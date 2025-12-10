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
