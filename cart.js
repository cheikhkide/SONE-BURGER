// DOM Elements
const cartContent = document.getElementById('cart-content');
const cartEmpty = document.getElementById('cart-empty');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCount = document.querySelector('.cart-count');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Cart Data
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let deliveryFee = 50;
let promoDiscount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
    initNavigation();
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
    
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartContent.appendChild(cartItemElement);
    });
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
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
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeItem(itemId);
        } else {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            loadCart();
            updateCartCount();
        }
    }
}

// Remove Item
function removeItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCart();
    updateCartCount();
}

// Update Summary
function updateSummary() {
    const subtotal = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
    
    const total = subtotal + deliveryFee - promoDiscount;
    
    subtotalElement.textContent = subtotal.toFixed(2) + ' MRU';
    totalElement.textContent = total.toFixed(2) + ' MRU';
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
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
        // Ouvre WhatsApp dans un nouvel onglet
        window.open(whatsappUrl, '_blank');

        // Vider le panier après l'envoi
        cartItems = [];
        localStorage.removeItem('cartItems');
        loadCart();
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

// Add CSS for cart page
const cartStyles = `
<style>
.cart-section {
    padding: 120px 0 80px;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 3rem;
}

.cart-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.cart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: var(--white);
    border-radius: 15px;
    box-shadow: var(--shadow);
}

.cart-empty i {
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.cart-empty h2 {
    font-size: 1.8rem;
    color: var(--dark-color);
    margin-bottom: 1rem;
}

.cart-empty p {
    color: #666;
    margin-bottom: 2rem;
}

.cart-content {
    background: var(--white);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: var(--shadow);
}

.cart-item {
    display: grid;
    grid-template-columns: 70px 1fr auto auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.5rem 0;
    border-bottom: 1px solid #eee;
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-image img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 10px;
}

.cart-item-info h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
}

.item-price {
    color: var(--primary-color);
    font-weight: 600;
    font-size: 1.1rem;
}

.cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-btn {
    background: var(--light-color);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    font-weight: 600;
    color: var(--dark-color);
}

.quantity-btn:hover {
    background: var(--primary-color);
    color: var(--white);
}

.quantity {
    font-weight: 600;
    min-width: 30px;
    text-align: center;
}

.cart-item-total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
}

.item-total {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--dark-color);
}

.remove-item {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    transition: var(--transition);
    font-size: 1rem;
}

.remove-item:hover {
    transform: scale(1.2);
}

.cart-summary {
    position: sticky;
    top: 100px;
}

.summary-card {
    background: var(--white);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: var(--shadow);
}

.summary-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 1.5rem;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.summary-item:last-child {
    border-bottom: none;
}

.summary-item.total {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--primary-color);
    padding-top: 1.5rem;
    margin-top: 1rem;
    border-top: 2px solid var(--primary-color);
}

.checkout-btn {
    width: 100%;
    background: var(--primary-color);
    color: var(--white);
    border: none;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    transition: var(--transition);
    margin: 1.5rem 0;
}

.checkout-btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.continue-shopping {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--dark-color);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
}

.continue-shopping:hover {
    color: var(--primary-color);
}

.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--white);
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
}

.notification.success {
    border-left: 4px solid #27ae60;
}

.notification.error {
    border-left: 4px solid #e74c3c;
}

.notification i {
    font-size: 1.2rem;
}

.notification.success i {
    color: #27ae60;
}

.notification.error i {
    color: #e74c3c;
}

@media (max-width: 768px) {
    .cart-container {
        grid-template-columns: 1fr;
    }
    
    .cart-summary {
        position: static;
    }
    
    .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 1rem;
    }
    
    .cart-item-quantity,
    .cart-item-total {
        grid-column: 2;
        justify-self: start;
    }
    
    .cart-item-total {
        align-self: flex-end;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
    
    .page-title {
        font-size: 2rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', cartStyles);
