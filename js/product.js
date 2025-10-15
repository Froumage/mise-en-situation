(function () {
  const STORAGE_KEY = "grocery_app_lists_v2";
  const modal = document.getElementById("categoryModal");
  const modalItems = document.getElementById("modalItems");
  const modalTitle = document.getElementById("modalTitle");

  function openModal(title, items) {
    modalTitle.textContent = title;
    modalItems.innerHTML = "";
    if (!items || items.length === 0) {
      const li = document.createElement("li");
      li.className = "no-products";
      li.textContent = "Aucun produit enregistré pour cette catégorie.";
      modalItems.appendChild(li);
    } else {
      items.forEach((it) => {
        const li = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = it.name;
        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = `${it.qty ? it.qty + " • " : ""}${
          it.price ? it.price.toFixed(2) + " €" : ""
        }`;
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

  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = card.getAttribute("data-cat");
      let items = [];
      try {
        items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        items = [];
      }
      const filtered = items.filter((i) => i.category === cat);
      openModal(cat, filtered);
    });
  });

  modal.addEventListener("click", (e) => {
    if (
      e.target.matches("[data-close]") ||
      e.target.classList.contains("modal-close")
    )
      closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
