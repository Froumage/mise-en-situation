// list.js - Gestion de la liste de courses
import { loadCategories } from "./category/functions.js";
import { loadProducts, populateProductSelect, PRODUCTS_DATA } from "./product/functions.js";
import { loadTemplates } from "./template/functions.js";
import { getTemplateItems } from "./item/fonction.js";
import { categories } from "./category/data.js";
import { STORAGE_KEY, baseUrl } from "./config.js";

// --- Variables globales ---
let items = [];
let currentListId = 1;

// Objet auth simple pour vérifier la connexion
const auth = {
  isLoggedIn: () => {
    // Pour l'instant, on considère que l'utilisateur est toujours connecté
    // Vous pouvez améliorer cela en vérifiant un token dans localStorage
    return true;
  }
};

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
const presetSelect = document.getElementById("presetSelect");
const usePresetBtn = document.getElementById("usePresetBtn");

// --- Élément pour afficher le total ---
let totalDisplay;

// Expose functions for external use
window.ListManager = {
  getItems: () => items,
  addItem: addItem,
  clearItems: clearItems
};
// --- Initialisation ---
function init() {
  console.log("Initialisation de la liste de courses...");
  
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
  
  console.log("Initialisation terminée");
}

// --- Attacher les événements ---
function attachEvents() {
  if (addForm) addForm.addEventListener("submit", e => { 
    e.preventDefault(); 
    addItem(); 
  });
  
  if (saveBtn) saveBtn.addEventListener("click", save);
  
  if (clearBtn) clearBtn.addEventListener("click", () => {
    if (confirm("Vider la liste ?")) { 
      clearItems(); 
    }
  });
  
  if (shareBtn) shareBtn.addEventListener("click", shareList);
  if (categoryFilter) categoryFilter.addEventListener("change", render);

  // Product selection change event
  if (productName) productName.addEventListener("change", updatePriceAndCategory);

  // Category selection change event to filter products
  if (productCategory) productCategory.addEventListener("change", filterProductsByCategory);

  // Template functionality
  if (presetSelect && usePresetBtn) {
    usePresetBtn.addEventListener("click", loadTemplate);
  }
}
// --- Sauvegarder dans localStorage ---
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    showStatus("Liste sauvegardée ✓");
    console.log("Liste sauvegardée:", items.length, "items");
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    showStatus("Erreur lors de la sauvegarde");
  }
}
// --- Afficher un message de statut ---
function showStatus(msg) {
  if (status) {
    status.textContent = msg;
    setTimeout(() => { status.textContent = ""; }, 2000);
  }
}

  const category = productCategory.value;
  const qty = productQty.value.trim();
  const price = parseFloat(productPrice.value) || 0;

  // Créer un nouvel item
  const newItem = {
    id: Date.now(), // ID unique basé sur le timestamp
    name: name,
    category: category,
    quantity: qty,
    price: price,
    done: false
  };

  items.push(newItem);

  // Réinitialiser le formulaire
  productName.value = "";
  productQty.value = "";
  productPrice.value = "";
  
  render();
  save();
  showStatus("Produit ajouté ✓");

  // Add to cart if CartManager exists
  if (window.CartManager) {
    window.CartManager.addToCart(newItem);
  }
// --- Basculer l'état done d'un item ---
function toggleDone(id) {
  const item = items.find(x => x.id === id);
  if (item) {
    item.done = !item.done;
    render();
    save();
  }
}

// --- Rendre la liste ---
function render() {
  if (!itemsList) return;

  const filterValue = categoryFilter ? categoryFilter.value : "all";
  const filtered = filterValue === "all" 
    ? items 
    : items.filter(item => item.category === filterValue);

  if (filtered.length === 0) {
    itemsList.innerHTML = '<li class="empty-state">Aucun article dans la liste</li>';
  } else {
    itemsList.innerHTML = filtered.map(item => `
      <li class="item ${item.done ? 'done' : ''}" data-id="${item.id}">
        <input type="checkbox" ${item.done ? 'checked' : ''} 
               onchange="window.toggleItemDone(${item.id})" 
               aria-label="Marquer comme fait">
        <div class="item-info">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.quantity ? `<span class="quantity">${escapeHtml(item.quantity)}</span>` : ''}
          <span class="category">${escapeHtml(item.category)}</span>
          <span class="price">${item.price.toFixed(2)} €</span>
        </div>
        <div class="item-actions">
          <button onclick="window.addToCartById(${item.id})" class="btn-cart" aria-label="Ajouter au panier" title="Ajouter au panier">🛒</button>
          <button onclick="window.editItemById(${item.id})" class="btn-edit" aria-label="Modifier">✏️</button>
          <button onclick="window.deleteItemById(${item.id})" class="btn-delete" aria-label="Supprimer">🗑️</button>
        </div>
      </li>
    `).join('');
  }

  updateTotal();
}
// --- Échapper le HTML pour éviter les injections ---
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- Calcul du total ---
function updateTotal() {
  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalAmount = document.getElementById("totalAmount");
  if (totalAmount) {
    totalAmount.textContent = total.toFixed(2);
  }
  
  // Mettre à jour le total dans le header
  const headerCartTotal = document.getElementById("headerCartTotal");
  if (headerCartTotal) {
    headerCartTotal.textContent = total.toFixed(2) + " €";
  }
}
// --- Partage / copie ---
async function shareList() {
  if (items.length === 0) { 
    alert("La liste est vide."); 
    return; 
  }
  
  const text = items.map(i =>
    `${i.done ? "✅" : "◻️"} ${i.name}${i.quantity ? " — " + i.quantity : ""} (${i.category}) - ${parseFloat(i.price).toFixed(2)}€`
  ).join("\n");
  
  if (navigator.share) {
    try {
      await navigator.share({ title: "Ma liste de courses", text });
      showStatus("Partagé !");
      return;
    } catch (e) { 
      console.warn(e); 
    }
  }
  
  try {
    await navigator.clipboard.writeText(text);
    alert("Liste copiée dans le presse-papiers.");
  } catch (e) {
    prompt("Copie manuelle de la liste :", text);
  }
}
// --- Ajouter un produit au panier ---
function addToCartById(id) {
  const item = items.find(x => x.id === id);
  if (!item) {
    showStatus("Produit introuvable");
    return;
  }

  // Vérifier si CartManager existe
  if (window.CartManager && window.CartManager.addToCart) {
    // Créer une copie de l'item avec une quantité par défaut de 1
    const cartItem = {
      ...item,
      quantity: 1 // Quantité par défaut pour le panier
    };
    
    window.CartManager.addToCart(cartItem);
    showStatus(`${item.name} ajouté au panier ✓`);
    
    // Mettre à jour le total du panier dans le header
    if (window.CartManager.updateHeaderCartTotal) {
      window.CartManager.updateHeaderCartTotal();
    }
  } else {
    showStatus("Erreur: Panier non disponible");
    console.error("CartManager not found");
  }
}

// --- Exposer les fonctions globalement pour les événements inline ---
window.toggleItemDone = toggleDone;
window.editItemById = editItem;
window.deleteItemById = deleteItem;
window.addToCartById = addToCartById;

// --- Démarrer l'application ---
window.addEventListener("DOMContentLoaded", init);
