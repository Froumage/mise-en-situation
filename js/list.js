import { loadCategories } from "./category/functions.js";
import { loadProducts } from "./product/functions.js";
(function(){
  let categories = [];
  let items = [];
  let templates = [];
  let products = [];
  let currentListId = null;
  let baseUrl = 'http://localhost:8000'; // Not used in local storage mode

  // Storage key for localStorage
  const STORAGE_KEY = 'shoppingListItems';

  // API base URL - disabled for local storage only
  // const API_BASE = 'http://localhost:8000/api';


  // Load products with fixed prices
 

  function loadTemplates() {
    templates = [
      { id: 1, name: 'Courses hebdomadaires', description: 'Liste de courses pour une semaine type' },
      { id: 2, name: 'Courses du weekend', description: 'Courses pour le weekend' },
      { id: 3, name: 'Courses de fête', description: 'Préparation pour une fête' },
      { id: 4, name: 'Courses de base', description: 'Produits essentiels' },
      { id: 5, name: 'Courses bio', description: 'Produits biologiques' },
      { id: 6, name: 'Courses végétariennes', description: 'Liste végétarienne' },
      { id: 7, name: 'Courses pour bébé', description: 'Produits pour bébé' },
      { id: 8, name: 'Courses de nettoyage', description: 'Produits d\'entretien' }
    ];
    populateTemplateSelect();
  }

  
  function populateTemplateSelect() {
    const presetSelect = document.getElementById("presetSelect");
    if (presetSelect) {
      presetSelect.innerHTML = '<option value="">-- Choisir --</option>';
      templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.name;
        presetSelect.appendChild(option);
      });
    }
  }
 

  
  async function loadItems() {
    try {
      const response = await fetch(`${baseUrl}/backend/items.php?list_id=${currentListId || 1}`);
      if (response.ok) {
        const data = await response.json();
        items = data.items || [];
      } else {
        console.warn('Failed to load items from API, using localStorage fallback');
      
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          items = JSON.parse(stored);
        } else {
          items = [];
        }
      }
    } catch (error) {
      console.error('Error loading items:', error);
    
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        items = JSON.parse(stored);
      } else {
        items = [];
      }
    }
    render();
  }

  // --- DOM Elements ---
  const itemsList = document.getElementById("itemsList");
  const addForm = document.getElementById("addForm");
  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productQty = document.getElementById("productQty");
  const productPrice = document.getElementById("productPrice");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");
  const shareBtn = document.getElementById("shareBtn");
  const categoryFilter = document.getElementById("categoryFilter");

  // --- Élément pour afficher le total ---
  let totalDisplay;

  // Expose functions for external use
  window.ListManager = {
    getItems: () => items,
    addItem: addItem,
    clearItems: clearItems
  };

  function init(){
    // Load categories, templates, products and items from local storage
    loadCategories();
    loadTemplates();
    loadProducts();
    loadItems();

    // Créer l'affichage du total
    totalDisplay = document.createElement("div");
    totalDisplay.className = "total-price";
    totalDisplay.innerHTML = '💰 Total : <span id="totalAmount">0.00</span> €';
    if (itemsList && itemsList.parentNode) {
      itemsList.parentNode.appendChild(totalDisplay);
    }

    render();
    attachEvents();
  }

  function attachEvents(){
    if(addForm) addForm.addEventListener("submit", e=>{ e.preventDefault(); addItem(); });
    if(saveBtn) saveBtn.addEventListener("click", save);
    if(clearBtn) clearBtn.addEventListener("click", ()=>{
      if(confirm("Vider la liste ?")){ clearItems(); }
    });
    if(shareBtn) shareBtn.addEventListener("click", shareList);
    if(categoryFilter) categoryFilter.addEventListener("change", render);

    // Product selection change event
    if(productName) productName.addEventListener("change", updatePriceAndCategory);

    // Category selection change event to filter products
    if(productCategory) productCategory.addEventListener("change", filterProductsByCategory);

    // Template functionality
    const presetSelect = document.getElementById("presetSelect");
    const loadPresetBtn = document.getElementById("loadPresetBtn");
    if(presetSelect && loadPresetBtn) {
      loadPresetBtn.addEventListener("click", loadTemplate);
    }
  }

  // --- Ajouter un produit ---
  async function addItem(){
    const name = productName.value.trim();
    if(!name) return;

    if (!auth.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter des articles.');
      window.location.href = 'connexion.html';
      return;
    }

    const category = productCategory.value;
    const qty = productQty.value.trim();
    const price = parseFloat(productPrice.value) || 0;

    // Find category ID from name
    const categoryObj = categories.find(cat => cat.name === category);
    if (!categoryObj) {
      alert('Catégorie invalide');
      return;
    }

    try {
      const response = await fetch('backend/lists.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_item',
          list_id: currentListId || 1, // Default to list 1 for now
          name: name,
          category_id: categoryObj.id,
          quantity: qty,
          price: price
        })
      });

      const result = await response.json();
      if (result.success) {
        productName.value = "";
        productQty.value = "";
        productPrice.value = "";
        loadItems(); // Reload items from server
        showStatus("Produit ajouté");

        // Add to cart if CartManager exists
        const newItem = {
          id: result.item_id,
          name,
          category,
          quantity: qty,
          price,
          done: false
        };

        if (window.CartManager) {
          window.CartManager.addToCart(newItem);
        }

        // Redirect to cart
        window.location.href = 'cart.html';
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Erreur lors de l\'ajout de l\'article');
    }
  }

  // --- Affichage principal ---
  function render(){
    if(!itemsList) return;
    itemsList.innerHTML = "";
    const cat = (categoryFilter && categoryFilter.value) || "all";

    const filtered = items.filter(it=>{
      if(cat !== "all" && it.category !== cat) return false;
      return true;
    });

    if(filtered.length === 0){
      const li = document.createElement("li");
      li.textContent = "Aucun produit pour l'instant. Ajoute-en !";
      li.className = "muted";
      itemsList.appendChild(li);
      updateTotal();
      return;
    }

    filtered.forEach(it=>{
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox"; checkbox.checked = !!it.done;
      checkbox.addEventListener("change", ()=> updateItem(it.id, { done: checkbox.checked }));

      const left = document.createElement("div");
      left.className = "item-left";
      const title = document.createElement("div");
      title.textContent = it.name;
      const meta = document.createElement("div");
      meta.className = "item-meta";
      meta.textContent = `${it.quantity || ""} • ${it.category} • ${parseFloat(it.price).toFixed(2)} €`;

      left.appendChild(title);
      left.appendChild(meta);

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", ()=> editItem(it.id));

      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn";
      delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", ()=> deleteItem(it.id));

      li.appendChild(checkbox);
      li.appendChild(left);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      itemsList.appendChild(li);
    });

    updateTotal();
  }

  // --- Modifier un produit ---
  function editItem(id){
    const it = items.find(x => x.id === id);
    if(!it) return;
    const newName = prompt("Modifier le nom du produit", it.name);
    if(newName === null) return;
    const newQty = prompt("Quantité", it.quantity || "");
    const newPrice = prompt("Prix", it.price || "");
    if(newQty !== null || newPrice !== null) {
      const updates = {};
      if(newQty !== null) updates.quantity = newQty.trim();
      if(newPrice !== null) updates.price = parseFloat(newPrice) || 0;
      updateItem(it.id, updates);
    }
  }

  // --- Calcul du total ---
  function updateTotal(){
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalAmount = document.getElementById("totalAmount");
    if(totalAmount) totalAmount.textContent = total.toFixed(2);
  }

  // --- Sauvegarde locale ---
  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    showStatus("Sauvegardé");
  }

  // --- Partage / copie ---
  async function shareList(){
    if(items.length === 0){ alert("La liste est vide."); return; }
    const text = items.map(i =>
      `${i.done ? "✅" : "◻️"} ${i.name}${i.quantity ? " — " + i.quantity : ""} (${i.category}) - ${parseFloat(i.price).toFixed(2)}€`
    ).join("\n");
    if(navigator.share){
      try{
        await navigator.share({title:"Ma liste de courses", text});
        showStatus("Partagé !");
        return;
      } catch(e){ console.warn(e); }
    }
    try{
      await navigator.clipboard.writeText(text);
      alert("Liste copiée dans le presse-papiers.");
    }catch(e){
      prompt("Copie manuelle de la liste :", text);
    }
  }

  // --- Update item via API ---
  async function updateItem(id, updates) {
    try {
      const response = await fetch('backend/lists.php', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_item',
          item_id: id,
          ...updates
        })
      });

      const result = await response.json();
      if (result.success) {
        // Reload items from server
        await loadItems();
        showStatus("Produit mis à jour");
      } else {
        console.error('Failed to update item:', result.message);
        showStatus("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error('Error updating item:', error);
      showStatus("Erreur lors de la mise à jour");
    }
  }

  // --- Delete item via API ---
  async function deleteItem(id) {
    if (!confirm("Supprimer cet article ?")) return;

    try {
      const response = await fetch('backend/lists.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_item',
          item_id: id
        })
      });

      const result = await response.json();
      if (result.success) {
        // Reload items from server
        await loadItems();
        showStatus("Produit supprimé");
      } else {
        console.error('Failed to delete item:', result.message);
        showStatus("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showStatus("Erreur lors de la suppression");
    }
  }

  // --- Clear all items ---
  function clearItems() {
    items = [];
    render();
    showStatus("Liste vidée");
    // Sauvegarder automatiquement après vidage
    save();
  }

  // --- Load template ---
  async function loadTemplate() {
    const presetSelect = document.getElementById("presetSelect");
    const templateId = presetSelect.value;
    if (!templateId) {
      showStatus("Sélectionnez un modèle");
      return;
    }

    try {
      const response = await fetch(`backend/templates.php?id=${templateId}`);
      if (response.ok) {
        const templateItems = await response.json();
        templateItems.forEach(item => {
          const newItem = {
            id: Date.now() + Math.random(), // Unique ID
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price || 0,
            done: false
          };
          items.push(newItem);
        });
        render();
        showStatus("Modèle chargé");
        // Sauvegarder automatiquement après chargement du modèle
        save();
      } else {
        console.warn('Failed to load template items from API, using fallback');
        // Fallback to hardcoded template items
        const templateItems = getTemplateItems(templateId);
        templateItems.forEach(item => {
          const newItem = {
            id: Date.now() + Math.random(), // Unique ID
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price || 0,
            done: false
          };
          items.push(newItem);
        });
        render();
        showStatus("Modèle chargé");
        save();
      }
    } catch (error) {
      console.error('Error loading template:', error);
      // Fallback to hardcoded template items
      const templateItems = getTemplateItems(templateId);
      templateItems.forEach(item => {
        const newItem = {
          id: Date.now() + Math.random(), // Unique ID
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price || 0,
          done: false
        };
        items.push(newItem);
      });
      render();
      showStatus("Modèle chargé");
      save();
    }
  }

  // --- Get template items ---
  function getTemplateItems(templateId) {
    const templateData = {
      1: [ // Courses hebdomadaires
        { name: 'Pain', category: 'Pain', quantity: '1 baguette', price: 1.20 },
        { name: 'Lait', category: 'Épicerie', quantity: '2L', price: 1.50 },
        { name: 'Oeufs', category: 'Épicerie', quantity: '12', price: 3.80 },
        { name: 'Bananes', category: 'Fruits & Légumes', quantity: '1kg', price: 2.50 },
        { name: 'Pommes', category: 'Fruits & Légumes', quantity: '1kg', price: 3.20 },
        { name: 'Tomates', category: 'Fruits & Légumes', quantity: '500g', price: 2.90 },
        { name: 'Riz', category: 'Épicerie', quantity: '1kg', price: 2.10 },
        { name: 'Pâtes', category: 'Épicerie', quantity: '500g', price: 1.90 },
        { name: 'Fromage', category: 'Boucherie', quantity: '200g', price: 4.50 },
        { name: 'Yaourt', category: 'Boissons', quantity: '6', price: 2.40 }
      ],
      2: [ // Courses du weekend
        { name: 'Croissants', category: 'Pain', quantity: '6', price: 3.00 },
        { name: 'Café', category: 'Épicerie', quantity: '500g', price: 4.50 },
        { name: 'Jus d\'orange', category: 'Boissons', quantity: '1L', price: 2.50 },
        { name: 'Pain au chocolat', category: 'Pain', quantity: '4', price: 2.80 },
        { name: 'Confiture', category: 'Épicerie', quantity: '1 pot', price: 3.20 }
      ],
      3: [ // Courses de fête
        { name: 'Champagne', category: 'Boissons', quantity: '1 bouteille', price: 25.00 },
        { name: 'Vin rouge', category: 'Boissons', quantity: '2 bouteilles', price: 8.50 },
        { name: 'Apéritifs', category: 'Boissons', quantity: 'assortis', price: 15.00 },
        { name: 'Chips', category: 'Épicerie', quantity: '3 paquets', price: 2.50 },
        { name: 'Olives', category: 'Épicerie', quantity: '500g', price: 4.80 },
        { name: 'Fromage', category: 'Boucherie', quantity: '500g', price: 12.00 },
        { name: 'Charcuterie', category: 'Boucherie', quantity: '300g', price: 8.90 },
        { name: 'Dessert', category: 'Autres', quantity: '1', price: 15.00 }
      ],
      4: [ // Courses de base
        { name: 'Pain', category: 'Pain', quantity: '1', price: 1.20 },
        { name: 'Lait', category: 'Épicerie', quantity: '1L', price: 0.90 },
        { name: 'Oeufs', category: 'Épicerie', quantity: '6', price: 2.10 },
        { name: 'Beurre', category: 'Épicerie', quantity: '250g', price: 2.80 },
        { name: 'Café', category: 'Épicerie', quantity: '250g', price: 3.50 }
      ],
      5: [ // Courses bio
        { name: 'Pain bio', category: 'Pain', quantity: '1', price: 2.50 },
        { name: 'Lait bio', category: 'Épicerie', quantity: '1L', price: 1.80 },
        { name: 'Oeufs bio', category: 'Épicerie', quantity: '6', price: 4.20 },
        { name: 'Fruits bio', category: 'Fruits & Légumes', quantity: '1kg', price: 6.00 },
        { name: 'Légumes bio', category: 'Fruits & Légumes', quantity: '1kg', price: 5.50 },
        { name: 'Riz bio', category: 'Épicerie', quantity: '500g', price: 3.20 }
      ],
      6: [ // Courses végétariennes
        { name: 'Fruits', category: 'Fruits & Légumes', quantity: '2kg', price: 5.00 },
        { name: 'Légumes', category: 'Fruits & Légumes', quantity: '2kg', price: 4.50 },
        { name: 'Pâtes', category: 'Épicerie', quantity: '500g', price: 1.90 },
        { name: 'Riz', category: 'Épicerie', quantity: '500g', price: 2.10 },
        { name: 'Légumineuses', category: 'Épicerie', quantity: '500g', price: 2.80 },
        { name: 'Fromage végétal', category: 'Autres', quantity: '200g', price: 3.50 },
        { name: 'Yaourt végétal', category: 'Boissons', quantity: '6', price: 3.00 }
      ],
      7: [ // Courses pour bébé
        { name: 'Lait infantile', category: 'Boissons', quantity: '800g', price: 18.50 },
        { name: 'Couches', category: 'Hygiène', quantity: '1 paquet', price: 12.90 },
        { name: 'Petits pots', category: 'Autres', quantity: '12', price: 8.50 },
        { name: 'Lingettes', category: 'Hygiène', quantity: '1 paquet', price: 4.20 },
        { name: 'Crème pour bébé', category: 'Hygiène', quantity: '1 tube', price: 6.80 }
      ],
      8: [ // Courses de nettoyage
        { name: 'Lessive', category: 'Autres', quantity: '3L', price: 4.50 },
        { name: 'Détergent vaisselle', category: 'Autres', quantity: '1L', price: 2.80 },
        { name: 'Nettoyant multi-usage', category: 'Autres', quantity: '750ml', price: 2.20 },
        { name: 'Papier toilette', category: 'Hygiène', quantity: '12 rouleaux', price: 6.50 },
        { name: 'Sac poubelle', category: 'Autres', quantity: '30', price: 3.90 },
        { name: 'Éponges', category: 'Autres', quantity: '5', price: 2.50 }
      ]
    };
    return templateData[templateId] || [];
  }

  // Update price and category when product is selected
  function updatePriceAndCategory() {
    const selectedOption = productName.options[productName.selectedIndex];
    if (selectedOption && selectedOption.value) {
      const price = parseFloat(selectedOption.dataset.price) || 0;
      const category = selectedOption.dataset.category || "";
      productPrice.value = price.toFixed(2);
      productCategory.value = category;
    } else {
      productPrice.value = "";
      productCategory.value = "";
    }
  }

  // Filter products by selected category
  function filterProductsByCategory() {
    const selectedCategory = productCategory.value;
    populateProductSelect(selectedCategory || null);
    // Clear product selection and price when category changes
    productName.value = "";
    productPrice.value = "";
  }

  // --- Message d’état ---
  function showStatus(msg){
    if(!status) return;
    status.textContent = msg;
    setTimeout(()=>{ status.textContent = ""; }, 1400);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
