// DOM Elements
const cartContent = document.getElementById('cart-content');
const cartEmpty = document.getElementById('cart-empty');
const subtotalElement = document.getElementById('subtotal'); // Used in updateSummary
const totalElement = document.getElementById('total'); // Used in updateSummary
const checkoutBtn = document.getElementById('checkout-btn'); // Used in checkout
const cartCount = document.querySelector('.cart-count'); // Used in updateCartCount
const hamburger = document.getElementById('hamburger'); // Used in initNavigation
const navMenu = document.getElementById('nav-menu'); // Used in initNavigation

// Cart Data
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let deliveryFee = 50;
let promoDiscount = 0;

// Helper function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Update Cart Count (made global and accessible)
function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) { // Check if element exists
        cartCount.textContent = totalItems;
        // Animate cart count
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount(); // Call the global one
    initNavigation(); // This should probably be in script-fixed.js or a shared utility
});

// Navigation Mobile
function initNavigation() {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Load Cart
function loadCart() {
    if (cartItems.length === 0) {
        cartEmpty.style.display = 'flex';
        cartContent.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartContent.style.display = 'block';
        renderCartItems();
        updateSummary();
    }
}

// Render Cart Items
function renderCartItems() {
    cartContent.innerHTML = '';
    
    // Using forEach for better readability, but a for-loop might be marginally faster for very large arrays.
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartContent.appendChild(cartItemElement);
    });
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.itemId = item.id; // Add data-id for easier DOM manipulation
    div.innerHTML = ` 
        <div class="cart-item-image">
            <img src="${item.image || './images/icone.png'}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <h3>${item.name}</h3>
            <p class="item-price">${parseFloat(item.price).toFixed(2)} MRU</p>
        </div>
        <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-total">
            <span class="item-total">${(parseFloat(item.price) * item.quantity).toFixed(2)} MRU</span>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const minusBtn = div.querySelector('.minus');
    const plusBtn = div.querySelector('.plus');
    const removeBtn = div.querySelector('.remove-item');
    
    minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
    plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
    removeBtn.addEventListener('click', () => removeItem(item.id));
    
    return div;
}

// Update Quantity
function updateQuantity(itemId, change) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity += change;
        
        if (cartItems[itemIndex].quantity <= 0) {
            removeItem(itemId);
        } else {
            saveCart();
            // Update DOM for the specific item
            const itemElement = cartContent.querySelector(`[data-item-id="${itemId}"]`);
            if (itemElement) {
                itemElement.querySelector('.quantity').textContent = cartItems[itemIndex].quantity;
                itemElement.querySelector('.item-total').textContent = (parseFloat(cartItems[itemIndex].price) * cartItems[itemIndex].quantity).toFixed(2) + ' MRU';
            }
            updateSummary();
            updateCartCount();
        }
    }
}

// Remove Item
function removeItem(itemId) {
    const initialLength = cartItems.length;
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    if (cartItems.length < initialLength) { // Only update if an item was actually removed
        saveCart();
        // Remove item from DOM
        const itemElement = cartContent.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            itemElement.remove();
        }
        
        if (cartItems.length === 0) {
            cartEmpty.style.display = 'flex';
            cartContent.style.display = 'none';
        }
        updateSummary();
        updateCartCount();
    }
}

// Update Summary
function updateSummary() {
    const subtotal = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
    
    const total = subtotal + deliveryFee - promoDiscount;
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2) + ' MRU';
    if (totalElement) totalElement.textContent = total.toFixed(2) + ' MRU';
}

// Checkout
checkoutBtn.addEventListener('click', function() {
    if (cartItems.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }

    const phoneNumber = "22249057538"; 
    
    // 2. Construction du message
    let message = "🍔 *NOUVELLE COMMANDE SONE BURGER* 🍔\n\n";
    message += "Détails de la commande :\n";
    message += "--------------------------------\n";
    
    cartItems.forEach(item => {
        const itemPrice = parseFloat(item.price);
        const itemTotal = itemPrice * item.quantity;
        message += `• *${item.name}*\n  Quantité: ${item.quantity} x ${itemPrice.toFixed(2)} MRU\n  Total produit: *${itemTotal.toFixed(2)} MRU*\n\n`;
    });
    
    const subtotal = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
    const total = subtotal + deliveryFee - promoDiscount;
    
    message += "--------------------------------\n";
    message += `💰 *Sous-total:* ${subtotal.toFixed(2)} MRU\n`;
    message += `🚚 *Livraison:* ${deliveryFee.toFixed(2)} MRU\n`;
    message += `✅ *TOTAL À PAYER: ${total.toFixed(2)} MRU*\n\n`;
    message += "Merci de me confirmer la réception et le délai de livraison !";
    
    // 3. Encodage du message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // 4. Notification et redirection
    showNotification('Préparation de votre message WhatsApp...');
    
    setTimeout(() => {
        // Ouvre WhatsApp via redirection (meilleur sur mobile)
        window.location.href = whatsappUrl;

        // Vider le panier après l'envoi
        cartItems = [];
        localStorage.removeItem('cartItems');
        loadCart(); // This will now show the empty cart message
        updateCartCount();
    }, 1000);
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

window.updateCartCount = updateCartCount; // Make updateCartCount globally accessible
