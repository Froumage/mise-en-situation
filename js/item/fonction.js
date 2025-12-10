// Fonctions pour gérer les items via l'API backend
import { baseUrl } from "../config.js";

// --- Update item via API ---
export async function updateItem(id, updates) {
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
export async function deleteItemAPI(id) {
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
  
  
// --- Add item via API ---
export async function addItemAPI(itemData) {
  try {
    const response = await fetch(`${baseUrl}/backend/lists.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add_item',
        ...itemData
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding item via API:', error);
    return { success: false, message: error.message };
  }
}

// --- Load items from API ---
export async function loadItemsAPI(listId = 1) {
  try {
    const response = await fetch(`${baseUrl}/backend/items.php?list_id=${listId}`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, items: data.items || [] };
    } else {
      return { success: false, items: [] };
    }
  } catch (error) {
    console.error('Error loading items from API:', error);
    return { success: false, items: [] };
  }
}

// --- Vider la liste ---
export function clearItems() {
  items = [];
  render();
  save();
  showStatus("Liste vidée ✓");
}

// --- Modifier un item ---
export function editItem(id) {
  const item = items.find(x => x.id === id);
  if (!item) return;
  
  const newName = prompt("Modifier le nom du produit", item.name);
  if (newName === null) return;
  
  const newQty = prompt("Quantité", item.quantity || "");
  if (newQty === null) return;
  
  const newPrice = prompt("Prix (€)", item.price || "");
  if (newPrice === null) return;

  item.name = newName.trim();
  item.quantity = newQty.trim();
  item.price = parseFloat(newPrice) || 0;
  
  render();
  save();
  showStatus("Produit modifié ✓");
}
// --- Supprimer un item ---
export function deleteItem(id) {
  if (!confirm("Supprimer cet article ?")) return;
  
  items = items.filter(item => item.id !== id);
  render();
  save();
  showStatus("Produit supprimé ✓");
}

// --- Ajouter un produit ---
export function addItem() {
  const name = productName.value.trim();
  if (!name) {
    alert("Veuillez sélectionner un produit");
    return;
  }}
  // --- Charger les items depuis localStorage ---
 export function loadItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        items = JSON.parse(stored);
        console.log("Items chargés depuis localStorage:", items.length);
      } else {
        items = [];
        console.log("Aucun item dans localStorage");
      }
    } catch (error) {
      console.error('Error loading items from localStorage:', error);
      items = [];
    }
    render();
  }

