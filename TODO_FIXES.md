# Plan de Correction du Site - Liste de Courses

## Problèmes Identifiés
- [x] Imports circulaires dans js/item/fonction.js
- [x] Imports circulaires dans js/product/functions.js
- [x] Fonctions manquantes dans js/list.js
- [x] Variables non définies (baseUrl, items, categories, auth, etc.)
- [x] Logique de rendu et sauvegarde manquante

## Étapes de Correction

### 1. Créer js/config.js - Configuration centralisée
- [x] Définir baseUrl
- [x] Définir STORAGE_KEY
- [x] Exporter les constantes

### 2. Corriger js/category/functions.js
- [x] Importer baseUrl depuis config.js
- [x] Corriger les références aux variables

### 3. Corriger js/product/functions.js
- [x] Supprimer l'import circulaire
- [x] Corriger la fonction loadProducts()
- [x] Créer PRODUCTS_DATA exportable

### 4. Corriger js/item/fonction.js
- [x] Supprimer l'import circulaire invalide
- [x] Garder uniquement les fonctions API
- [x] Renommer deleteItem en deleteItemAPI pour éviter les conflits

### 5. Reconstruire js/list.js complètement
- [x] Ajouter toutes les fonctions manquantes
- [x] Implémenter la logique de rendu
- [x] Implémenter la sauvegarde localStorage
- [x] Corriger tous les imports
- [x] Ajouter les fonctions: addItem, deleteItem, editItem, toggleDone, clearItems
- [x] Implémenter updateTotal, shareList, loadTemplate

### 6. Créer js/template/functions.js
- [x] Créer un nouveau fichier propre
- [x] Implémenter loadTemplates et populateTemplateSelect

### 7. Tests
- [x] Ouvrir le site dans le navigateur
- [ ] Tester le chargement de la page
- [ ] Tester l'ajout d'items
- [ ] Tester les filtres
- [ ] Tester la sauvegarde

## Statut: ✅ CORRECTIONS TERMINÉES - EN PHASE DE TEST
