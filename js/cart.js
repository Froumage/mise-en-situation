(function(){
    let cartItems = [];
    const CART_STORAGE_KEY = 'shoppingCart';

    // Load cart items from localStorage
    function loadCart() {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            cartItems = JSON.parse(stored);
        } else {
            cartItems = [];
        }
        renderCart();
    }

    // Save cart items to localStorage
    function saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }

    // Add item to cart
    function addToCart(item) {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cartItems.push({
                ...item,
                quantity: item.quantity || 1,
                cartId: Date.now(), // Unique ID for cart item
                done: false
            });
        }
        saveCart();
        renderCart();
        updateHeaderCartTotal();
        showStatus('Article ajouté au panier');
    }

    // Add all items from list to cart
    function addAllFromList(listItems) {
        let addedCount = 0;
        listItems.forEach(item => {
            // Only add items that aren't already in cart
            const existingItem = cartItems.find(cartItem => cartItem.name === item.name && cartItem.category === item.category);
            if (!existingItem) {
                addToCart(item);
                addedCount++;
            }
        });
        if (addedCount > 0) {
            showStatus(`${addedCount} article(s) ajouté(s) au panier`);
        } else {
            showStatus('Tous les articles sont déjà dans le panier');
        }
    }

    // Remove item from cart
    function removeFromCart(cartId) {
        cartItems = cartItems.filter(item => item.cartId !== cartId);
        saveCart();
        renderCart();
        updateHeaderCartTotal();
        showStatus('Article retiré du panier');
    }

    // Update item quantity
    function updateQuantity(cartId, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(cartId);
            return;
        }

        const item = cartItems.find(item => item.cartId === cartId);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            renderCart();
            updateHeaderCartTotal();
        }
    }

    // Clear entire cart
    function clearCart() {
        if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
            cartItems = [];
            saveCart();
            renderCart();
            showStatus('Panier vidé');
        }
    }

    // Calculate total price
    function calculateTotal() {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Render cart items
    function renderCart() {
        const cartItemsList = document.getElementById('cartItems');
        const itemCount = document.getElementById('itemCount');
        const totalAmount = document.getElementById('totalAmount');

        if (!cartItemsList) return;

        // Update summary
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        itemCount.textContent = totalItems;
        totalAmount.textContent = calculateTotal().toFixed(2) + ' €';

        // Clear current list
        cartItemsList.innerHTML = '';

        if (cartItems.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'cart-empty';
            emptyMessage.innerHTML = `
                <h3>Votre panier est vide</h3>
                <p>Ajoutez des articles depuis votre liste de courses</p>
                <a href="index.html" class="primary">Voir ma liste</a>
            `;
            cartItemsList.appendChild(emptyMessage);
            return;
        }

        // Render each cart item
        cartItems.forEach(item => {
            const li = document.createElement('li');

            // Item image (placeholder)
            const image = document.createElement('img');
            image.className = 'cart-item-image';
            image.src = getCategoryImage(item.category);
            image.alt = item.category;

            // Item details
            const details = document.createElement('div');
            details.className = 'cart-item-details';

            const name = document.createElement('div');
            name.className = 'cart-item-name';
            name.textContent = item.name;

            const meta = document.createElement('div');
            meta.className = 'cart-item-meta';
            meta.textContent = `${item.category} • ${item.price.toFixed(2)} € chacun`;

            const itemTotal = document.createElement('div');
            itemTotal.className = 'cart-item-price';
            itemTotal.textContent = `Total: ${(item.price * item.quantity).toFixed(2)} €`;

            details.appendChild(name);
            details.appendChild(meta);
            details.appendChild(itemTotal);

            // Quantity controls
            const quantityControls = document.createElement('div');
            quantityControls.className = 'quantity-controls';

            const decreaseBtn = document.createElement('button');
            decreaseBtn.className = 'quantity-btn';
            decreaseBtn.textContent = '−';
            decreaseBtn.addEventListener('click', () => updateQuantity(item.cartId, item.quantity - 1));

            const quantityInput = document.createElement('input');
            quantityInput.className = 'quantity-input';
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = item.quantity;
            quantityInput.addEventListener('change', (e) => {
                const newQty = parseInt(e.target.value);
                if (newQty > 0) {
                    updateQuantity(item.cartId, newQty);
                } else {
                    e.target.value = item.quantity;
                }
            });

            const increaseBtn = document.createElement('button');
            increaseBtn.className = 'quantity-btn';
            increaseBtn.textContent = '+';
            increaseBtn.addEventListener('click', () => updateQuantity(item.cartId, item.quantity + 1));

            quantityControls.appendChild(decreaseBtn);
            quantityControls.appendChild(quantityInput);
            quantityControls.appendChild(increaseBtn);

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'cart-item-remove';
            removeBtn.textContent = 'Retirer';
            removeBtn.addEventListener('click', () => removeFromCart(item.cartId));

            // Assemble item
            li.appendChild(image);
            li.appendChild(details);
            li.appendChild(quantityControls);
            li.appendChild(removeBtn);

            cartItemsList.appendChild(li);
        });
    }

    // Get category image
    function getCategoryImage(category) {
        const categoryImages = {
            'Fruits & Légumes': 'assets/fruit-et-legumes.png',
            'Épicerie': 'assets/epicerie.jpg',
            'Boissons': 'assets/boissons.jpg',
            'Hygiène': 'assets/hygiene.jpg',
            'Boucherie': 'assets/viande.png',
            'Pain': 'assets/pain.png',
            'Électroménager': 'assets/electro.jpg',
            'Électronique': 'assets/electro.png',
            'Autres': 'assets/cart.svg'
        };
        return categoryImages[category] || 'assets/cart.svg';
    }

    // Checkout function
    function checkout() {
        if (cartItems.length === 0) {
            alert('Votre panier est vide');
            return;
        }

        const total = calculateTotal();
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        const message = `Commande confirmée !\n\nArticles: ${itemCount}\nTotal: ${total.toFixed(2)} €\n\nVotre commande sera préparée sous peu.`;

        alert(message);

        // Clear cart after checkout
        cartItems = [];
        saveCart();
        renderCart();
        updateHeaderCartTotal();
        showStatus('Commande passée avec succès !');
    }

    // Status message
    function showStatus(msg) {
        // Create or update status element
        let statusEl = document.getElementById('cart-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'cart-status';
            statusEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--accent);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-weight: 500;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusEl);
        }

        statusEl.textContent = msg;
        statusEl.style.opacity = '1';
        statusEl.style.transform = 'translateY(0)';

        setTimeout(() => {
            statusEl.style.opacity = '0';
            statusEl.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (statusEl.parentNode) {
                    statusEl.parentNode.removeChild(statusEl);
                }
            }, 300);
        }, 2000);
    }

    // Initialize cart page
    function init() {
        loadCart();

        // Event listeners
        const addAllFromListBtn = document.getElementById('addAllFromListBtn');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (addAllFromListBtn) {
            addAllFromListBtn.addEventListener('click', () => {
                // Get items from list.js (assuming it's loaded)
                if (window.ListManager && window.ListManager.getItems) {
                    const listItems = window.ListManager.getItems();
                    addAllFromList(listItems);
                } else {
                    // Fallback: try to get from localStorage
                    const stored = localStorage.getItem('shoppingListItems');
                    if (stored) {
                        const listItems = JSON.parse(stored);
                        addAllFromList(listItems);
                    } else {
                        showStatus('Aucune liste trouvée');
                    }
                }
            });
        }

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }

        // Update header cart total on page load
        updateHeaderCartTotal();
    }

    // Update header cart total
    function updateHeaderCartTotal() {
        const headerCartTotal = document.getElementById('headerCartTotal');
        if (headerCartTotal) {
            const total = calculateTotal();
            headerCartTotal.textContent = total.toFixed(2) + ' €';
        }
    }

    // Expose functions for external use (e.g., from list.js)
    window.CartManager = {
        addToCart: addToCart,
        addAllFromList: addAllFromList,
        getItemCount: () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        getTotal: calculateTotal,
        updateHeaderCartTotal: updateHeaderCartTotal
    };

    window.addEventListener('DOMContentLoaded', init);
})();
