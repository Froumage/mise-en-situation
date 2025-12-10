// Template functions - Gestion des modèles de listes
import { baseUrl } from "../config.js";

let templates = [];

// --- Load templates ---
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

export function loadTemplate() {
  const templateId = parseInt(presetSelect.value);
  if (!templateId) {
    alert("Veuillez sélectionner un template");
    return;
  }

  const templateItems = getTemplateItems(templateId);
  if (templateItems.length === 0) {
    alert("Template vide ou introuvable");
    return;
  }

  // Ajouter les items du template à la liste
  templateItems.forEach(templateItem => {
    const newItem = {
      id: Date.now() + Math.random(), // ID unique
      name: templateItem.name,
      category: templateItem.category,
      quantity: templateItem.quantity,
      price: templateItem.price,
      done: false
    };
    items.push(newItem);
  });

  render();
  save();
  showStatus(`Template chargé: ${templateItems.length} articles ajoutés`);
}

// --- Populate template select ---
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

// --- Get templates ---
export function getTemplates() {
  return templates;
}
