// Configuration centralisée pour l'application
export const baseUrl = 'http://localhost:8000';
export const STORAGE_KEY = 'shoppingListItems';
export const STORAGE_KEY_CART = 'shoppingCart';

// Configuration API
export const API_CONFIG = {
  categories: `${baseUrl}/backend/categories.php`,
  items: `${baseUrl}/backend/items.php`,
  lists: `${baseUrl}/backend/lists.php`,
  templates: `${baseUrl}/backend/templates.php`,
  auth: `${baseUrl}/backend/auth.php`
};

// Fallback data si l'API n'est pas disponible
export const FALLBACK_CATEGORIES = [
  { id: 1, name: "Fruits & Légumes", icon: "fruit-et-legumes.png" },
  { id: 2, name: "Épicerie", icon: "epicerie.jpg" },
  { id: 3, name: "Boissons", icon: "boissons.jpg" },
  { id: 4, name: "Hygiène", icon: "hygiene.jpg" },
  { id: 5, name: "Boucherie", icon: "viande.png" },
  { id: 6, name: "Pain", icon: "pain.png" },
  { id: 7, name: "Électroménager", icon: "electro.jpg" },
  { id: 8, name: "Électronique", icon: "electro.png" },
  { id: 9, name: "Autres", icon: null }
];
