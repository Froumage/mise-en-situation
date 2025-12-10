
// Fonction pour charger et afficher les produits
export function loadProducts() {
    const products = [
      // Fruits & Légumes
      { name: 'Bananes', category: 'Fruits & Légumes', price: 2.50 },
      { name: 'Pommes', category: 'Fruits & Légumes', price: 3.20 },
      { name: 'Oranges', category: 'Fruits & Légumes', price: 2.80 },
      { name: 'Tomates', category: 'Fruits & Légumes', price: 2.90 },
      { name: 'Carottes', category: 'Fruits & Légumes', price: 1.80 },
      { name: 'Laitue', category: 'Fruits & Légumes', price: 1.50 },
      { name: 'Concombres', category: 'Fruits & Légumes', price: 1.70 },
      { name: 'Poivrons', category: 'Fruits & Légumes', price: 2.20 },

      // Épicerie
      { name: 'Pain', category: 'Pain', price: 1.20 },
      { name: 'Lait', category: 'Épicerie', price: 1.50 },
      { name: 'Oeufs', category: 'Épicerie', price: 3.80 },
      { name: 'Riz', category: 'Épicerie', price: 2.10 },
      { name: 'Pâtes', category: 'Épicerie', price: 1.90 },
      { name: 'Café', category: 'Épicerie', price: 4.50 },
      { name: 'Thé', category: 'Épicerie', price: 3.20 },
      { name: 'Sucre', category: 'Épicerie', price: 1.80 },

      // Boissons
      { name: 'Eau minérale', category: 'Boissons', price: 0.80 },
      { name: 'Jus d\'orange', category: 'Boissons', price: 2.50 },
      { name: 'Soda', category: 'Boissons', price: 1.90 },
      { name: 'Vin rouge', category: 'Boissons', price: 8.50 },
      { name: 'Bière', category: 'Boissons', price: 1.60 },

      // Hygiène
      { name: 'Dentifrice', category: 'Hygiène', price: 2.80 },
      { name: 'Savon', category: 'Hygiène', price: 1.90 },
      { name: 'Shampooing', category: 'Hygiène', price: 3.50 },
      { name: 'Papier toilette', category: 'Hygiène', price: 4.20 },

      // Boucherie
      { name: 'Steak haché', category: 'Boucherie', price: 6.50 },
      { name: 'Poulet', category: 'Boucherie', price: 8.90 },
      { name: 'Saucisses', category: 'Boucherie', price: 5.20 },
      { name: 'Jambon', category: 'Boucherie', price: 4.80 },

      // Autres
      { name: 'Lessive', category: 'Autres', price: 3.90 },
      { name: 'Détergent', category: 'Autres', price: 2.70 },
      { name: 'Ampoules', category: 'Électronique', price: 1.50 },
      { name: 'Batteries', category: 'Électronique', price: 4.90 }
    ];
    populateProductSelect(products);
  }

// Liste complète des produits disponibles
export const PRODUCTS_DATA = [
  // Fruits & Légumes
  { name: 'Bananes', category: 'Fruits & Légumes', price: 2.50 },
  { name: 'Pommes', category: 'Fruits & Légumes', price: 3.20 },
  { name: 'Oranges', category: 'Fruits & Légumes', price: 2.80 },
  { name: 'Tomates', category: 'Fruits & Légumes', price: 2.90 },
  { name: 'Carottes', category: 'Fruits & Légumes', price: 1.80 },
  { name: 'Laitue', category: 'Fruits & Légumes', price: 1.50 },
  { name: 'Concombres', category: 'Fruits & Légumes', price: 1.70 },
  { name: 'Poivrons', category: 'Fruits & Légumes', price: 2.20 },

  // Épicerie
  { name: 'Pain', category: 'Pain', price: 1.20 },
  { name: 'Lait', category: 'Épicerie', price: 1.50 },
  { name: 'Oeufs', category: 'Épicerie', price: 3.80 },
  { name: 'Riz', category: 'Épicerie', price: 2.10 },
  { name: 'Pâtes', category: 'Épicerie', price: 1.90 },
  { name: 'Café', category: 'Épicerie', price: 4.50 },
  { name: 'Thé', category: 'Épicerie', price: 3.20 },
  { name: 'Sucre', category: 'Épicerie', price: 1.80 },

  // Boissons
  { name: 'Eau minérale', category: 'Boissons', price: 0.80 },
  { name: 'Jus d\'orange', category: 'Boissons', price: 2.50 },
  { name: 'Soda', category: 'Boissons', price: 1.90 },
  { name: 'Vin rouge', category: 'Boissons', price: 8.50 },
  { name: 'Bière', category: 'Boissons', price: 1.60 },

  // Hygiène
  { name: 'Dentifrice', category: 'Hygiène', price: 2.80 },
  { name: 'Savon', category: 'Hygiène', price: 1.90 },
  { name: 'Shampooing', category: 'Hygiène', price: 3.50 },
  { name: 'Papier toilette', category: 'Hygiène', price: 4.20 },

  // Boucherie
  { name: 'Steak haché', category: 'Boucherie', price: 6.50 },
  { name: 'Poulet', category: 'Boucherie', price: 8.90 },
  { name: 'Saucisses', category: 'Boucherie', price: 5.20 },
  { name: 'Jambon', category: 'Boucherie', price: 4.80 },

  // Autres
  { name: 'Lessive', category: 'Autres', price: 3.90 },
  { name: 'Détergent', category: 'Autres', price: 2.70 },
  { name: 'Ampoules', category: 'Électronique', price: 1.50 },
  { name: 'Batteries', category: 'Électronique', price: 4.90 }
];

export function populateProductSelect(categoryFilter = null) {
  const productName = document.getElementById("productName");
  if (productName) {
    productName.innerHTML = '<option value="">-- Choisir un produit --</option>';
    const filteredProducts = categoryFilter ? PRODUCTS_DATA.filter(p => p.category === categoryFilter) : PRODUCTS_DATA;
    filteredProducts.forEach(product => {
      const option = document.createElement('option');
      option.value = product.name;
      option.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
      option.dataset.price = product.price;
      option.dataset.category = product.category;
      productName.appendChild(option);
    });
  }
}
