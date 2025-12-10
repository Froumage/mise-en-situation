
import { items, render, showStatus, save } from "../template/list/functions.js";
  // --- Load template ---
   export  async function loadTemplate() {
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
   export function getTemplateItems(templateId) {
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
   export function loadTemplates() {
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

  export function populateTemplateSelect() {
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
  // --- Affichage principal ---
  export function render(){
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
// --- Message d’état ---
 export function showStatus(msg){
    if(!status) return;
    status.textContent = msg;
    setTimeout(()=>{ status.textContent = ""; }, 1400);
  }
  // --- Sauvegarde locale ---
  export function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    showStatus("Sauvegardé");
  }
