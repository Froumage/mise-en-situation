# TODO: Integrate Database Values into Frontend

## Current Status
- Database: grocery_app with tables: users, categories, grocery_lists, product_list, list_templates, template_items
- Backend: APIs for items (product_list), categories, lists (grocery_lists), auth
- Frontend: Loads categories and items, has presetSelect for templates but no functionality

## Issues to Fix
- Templates now loaded in frontend presetSelect from API with fallback
- "Charger" button for templates now works with API and fallback
- Database connection issues (PDO MySQL extension)
- Frontend expects 'done' field not in database - added to cart items
- API for templates (list_templates, template_items) now implemented with hardcoded data

## Steps to Complete Integration

### 1. Fix Database Setup
- [ ] Ensure MySQL server is running
- [ ] Create grocery_app database
- [ ] Run database.sql to create tables and insert data
- [ ] Verify connection works

### 2. Add Backend API for Templates
- [ ] Create backend/templates.php with endpoints:
  - GET /api/templates - get all templates
  - GET /api/templates/{id} - get template with items
- [ ] Update router.php to route /api/templates/* to templates.php
- [ ] Test template API endpoints

### 3. Update Frontend for Templates
- [ ] Modify js/list.js to load templates into presetSelect
- [ ] Add functionality to "Charger" button to load selected template items
- [ ] Handle adding template items to current list (avoid duplicates)

### 4. Fix Frontend-Backend Mismatches
- [ ] Add 'done' column to product_list table if needed
- [ ] Ensure all API responses match frontend expectations
- [ ] Update addItem to use category name instead of ID

### 5. Test Full Integration
- [ ] Start PHP server
- [ ] Load frontend, verify categories load
- [ ] Verify templates load in dropdown
- [ ] Test adding items, loading templates, CRUD operations
- [ ] Check total calculation works

### 6. Optional Enhancements
- [ ] Integrate saved lists (grocery_lists) functionality
- [ ] Add user authentication integration
- [ ] Improve error handling and user feedback
