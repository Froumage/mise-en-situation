// Load categories from API
import { categories } from "./data.js";
export async function loadCategories() {
  try {
    const response = await fetch(`${baseUrl}/backend/categories.php`);
    if (response.ok) {
      categories = await response.json();
      console.log("Categories response:", categories);
    } else {
      console.warn("Failed to load categories from API, using fallback");
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    // Fallback to hardcoded categories
  }
  populateCategorySelects(categories);
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
