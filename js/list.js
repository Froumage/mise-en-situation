// list.js — CRUD + persistance + partage
(function(){
  const STORAGE_KEY = "grocery_app_lists_v1";
  const presets = {
    "Semaine simple": [
      {name:"Pâtes", category:"Épicerie", qty:"1 paquet"},
      {name:"Tomates", category:"Fruits & Légumes", qty:"1kg"},
      {name:"Lait", category:"Boissons", qty:"1L"},
      {name:"Savon", category:"Hygiène", qty:"2"}
    ],
    "Barbecue": [
      {name:"Saucisses", category:"Boucherie", qty:"1kg"},
      {name:"Pain Burger", category:"Épicerie", qty:"6"},
      {name:"Salade", category:"Fruits & Légumes", qty:"1"}
    ]
  };

  let items = [];

  // DOM
  const itemsList = document.getElementById("itemsList");
  const addForm = document.getElementById("addForm");
  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productQty = document.getElementById("productQty");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");
  const shareBtn = document.getElementById("shareBtn");
  const presetSelect = document.getElementById("presetSelect");
  const usePresetBtn = document.getElementById("usePresetBtn");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  function init(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved){
      try{ items = JSON.parse(saved); } catch(e){ items = []; }
    } else { items = []; }

    // fill presets
    const names = Object.keys(presets);
    names.forEach(n=>{
      const opt = document.createElement("option");
      opt.value = n; opt.textContent = n;
      if(presetSelect) presetSelect.appendChild(opt);
    });

    render();
    attachEvents();
  }

  function attachEvents(){
    if(addForm) addForm.addEventListener("submit", e=>{ e.preventDefault(); addItem(); });
    if(saveBtn) saveBtn.addEventListener("click", save);
    if(clearBtn) clearBtn.addEventListener("click", ()=>{
      if(confirm("Vider la liste ?")){ items = []; save(); render(); }
    });
    if(usePresetBtn) usePresetBtn.addEventListener("click", ()=>{
      const sel = presetSelect.value;
      if(!sel) return alert("Choisissez une liste proposée.");
      if(confirm("Charger la liste: " + sel + " ? (remplace la liste actuelle)")){
        items = presets[sel].map(i=>({...i, done:false, id: Date.now() + Math.random()}));
        save(); render();
      }
    });
    if(shareBtn) shareBtn.addEventListener("click", shareList);
    if(searchInput) searchInput.addEventListener("input", render);
    if(categoryFilter) categoryFilter.addEventListener("change", render);
    window.addEventListener("beforeunload", ()=> save());
  }

  function addItem(){
    const name = productName.value.trim();
    if(!name) return;
    const category = productCategory.value;
    const qty = productQty.value.trim();
    items.push({id: Date.now() + Math.random(), name, category, qty, done:false});
    productName.value = ""; productQty.value = "";
    render(); save();
    showStatus("Produit ajouté");
  }

  function render(){
    if(!itemsList) return;
    itemsList.innerHTML = "";
    const q = (searchInput && searchInput.value || "").trim().toLowerCase();
    const cat = (categoryFilter && categoryFilter.value) || "all";

    const filtered = items.filter(it=>{
      if(cat !== "all" && it.category !== cat) return false;
      if(q && !(it.name.toLowerCase().includes(q) || (it.qty || "").toLowerCase().includes(q))) return false;
      return true;
    });

    if(filtered.length === 0){
      const li = document.createElement("li");
      li.textContent = "Aucun produit pour l'instant. Ajoute-en !";
      li.className = "muted";
      itemsList.appendChild(li);
      return;
    }

    filtered.forEach(it=>{
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox"; checkbox.checked = !!it.done;
      checkbox.addEventListener("change", ()=>{ it.done = checkbox.checked; save(); render(); });

      const left = document.createElement("div"); left.className = "item-left";
      const title = document.createElement("div"); title.textContent = it.name;
      const meta = document.createElement("div"); meta.className = "item-meta";
      meta.textContent = `${it.qty || ""} • ${it.category}`;

      left.appendChild(title); left.appendChild(meta);

      const editBtn = document.createElement("button"); editBtn.className = "icon-btn"; editBtn.textContent = "✏️";
      editBtn.addEventListener("click", ()=> editItem(it.id));

      const delBtn = document.createElement("button"); delBtn.className = "icon-btn"; delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", ()=>{
        if(confirm("Supprimer " + it.name + " ?")){ items = items.filter(x => x.id !== it.id); save(); render(); }
      });

      li.appendChild(checkbox); li.appendChild(left); li.appendChild(editBtn); li.appendChild(delBtn);
      itemsList.appendChild(li);
    });
  }

  function editItem(id){
    const it = items.find(x => x.id === id);
    if(!it) return;
    const newName = prompt("Modifier le nom du produit", it.name);
    if(newName === null) return;
    it.name = newName.trim() || it.name;
    const newQty = prompt("Quantité", it.qty || "");
    if(newQty !== null) it.qty = newQty.trim();
    save(); render();
  }

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    showStatus("Sauvegardé");
  }

  async function shareList(){
    if(items.length === 0){ alert("La liste est vide."); return; }
    const text = items.map(i => `${i.done ? "✅" : "◻️"} ${i.name}${i.qty ? " — " + i.qty : ""} (${i.category})`).join("\n");
    if(navigator.share){
      try{ await navigator.share({title:"Ma liste de courses", text}); showStatus("Partagé !"); return; }
      catch(e){ console.warn(e); }
    }
    try{
      await navigator.clipboard.writeText(text);
      alert("Liste copiée dans le presse-papiers.");
    }catch(e){
      prompt("Copie manuelle de la liste :", text);
    }
  }

  function showStatus(msg){
    const s = document.getElementById("status");
    if(!s) return;
    s.textContent = msg;
    setTimeout(()=>{ if(s) s.textContent = ""; }, 1400);
  }

  window.addEventListener("DOMContentLoaded", init);
})();