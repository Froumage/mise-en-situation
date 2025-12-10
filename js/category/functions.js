// Load categories from API
import { categories } from "./data.js";
import { baseUrl } from "../config.js";

export async function loadCategories() {
  let loadedCategories = [...categories]; // Use local categories as default
  
  try {
    const response = await fetch(`${baseUrl}/backend/categories.php`);
    if (response.ok) {
      loadedCategories = await response.json();
      console.log("Categories loaded from API:", loadedCategories);
    } else {
      console.warn("Failed to load categories from API, using fallback");
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    // Fallback to hardcoded categories
  }
  populateCategorySelects(loadedCategories);
  return loadedCategories;
}

export function populateCategorySelects() {
  const productCategory = document.getElementById("productCategory");
  const categoryFilter = document.getElementById("categoryFilter");

  if (productCategory) {
    productCategory.innerHTML = "";
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      productCategory.appendChild(option);
    });
  }

  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="all">Toutes catégories</option>';
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categoryFilter.appendChild(option);
    });
  }
}
// --- Filter products by selected category ---
export function filterProductsByCategory() {
  const selectedCategory = productCategory.value;
  populateProductSelect(selectedCategory || null);
  // Clear product selection and price when category changes
  productName.value = "";
  productPrice.value = "";
}

// --- Update price and category when product is selected ---
 export function updatePriceAndCategory() {
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

