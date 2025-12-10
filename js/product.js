import { PRODUCTS_DATA } from "./product/functions.js";

(function () {
  const modal = document.getElementById("categoryModal");
  const modalItems = document.getElementById("modalItems");
  const modalTitle = document.getElementById("modalTitle");

  // Mapping des data-cat vers les noms de catégories réels
  const categoryMapping = {
    "fruits-legumes": "Fruits & Légumes",
    "epicerie": "Épicerie",
    "boissons": "Boissons",
    "hygiene": "Hygiène",
    "boucherie": "Boucherie",
    "autres": "Autres"
  };

  function openModal(title, items) {
    modalTitle.textContent = title;
    modalItems.innerHTML = "";
    
    if (!items || items.length === 0) {
      const li = document.createElement("li");
      li.className = "no-products";
      li.textContent = "Aucun produit disponible pour cette catégorie.";
      modalItems.appendChild(li);
    } else {
      items.forEach((product) => {
        const li = document.createElement("li");
        li.className = "product-item";
        
        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;
        
        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = `${product.price.toFixed(2)} €`;
        
        li.appendChild(name);
        li.appendChild(meta);
        modalItems.appendChild(li);
      });
    }
    
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
  }

  // Gestion des clics sur les cartes de catégories
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const dataCat = card.getAttribute("data-cat");
      const categoryName = categoryMapping[dataCat] || dataCat;
      
      // Filtrer les produits par catégorie
      const filtered = PRODUCTS_DATA.filter((product) => {
        return product.category === categoryName || 
               product.category === "Pain" && categoryName === "Épicerie" ||
               product.category === "Électronique" && categoryName === "Autres";
      });
      
      openModal(categoryName, filtered);
    });
  });

  // Fermeture du modal
  modal.addEventListener("click", (e) => {
    if (
      e.target.matches("[data-close]") ||
      e.target.classList.contains("modal-close")
    ) {
      closeModal();
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
