// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    
    if (product) {
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.id == productId);
        
        if (existingItemIndex > -1) {
            // Increase quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: 1
            });
        }
        
        // Save to localStorage
        saveCart();
        updateCartCount();
        
        // Show confirmation
        showNotification(`${product.name} a été ajouté au panier`);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartCount();
    
    // If we're on the cart page, update the display
    if (window.location.pathname.includes('panier.html')) {
        displayCart();
        updateCartTotal();
    }
}

function updateQuantity(productId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            
            // If we're on the cart page, update the display
            if (window.location.pathname.includes('panier.html')) {
                updateCartItemTotal(productId);
                updateCartTotal();
            }
        }
        
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function displayCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        return;
    }
    
    let cartHTML = '';
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="../${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}" title="Diminuer la quantité">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}" aria-label="Quantité">
                    <button class="quantity-btn increase" data-id="${item.id}" title="Augmenter la quantité">+</button>
                </div>
                <div class="cart-item-total" data-id="${item.id}">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
                <button class="remove-item" data-id="${item.id}" title="Supprimer l'article">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    // Add event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
    
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id == productId);
            if (itemIndex > -1) {
                updateQuantity(productId, cart[itemIndex].quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id == productId);
            if (itemIndex > -1) {
                updateQuantity(productId, cart[itemIndex].quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.getAttribute('data-id');
            const newQuantity = parseInt(input.value);
            if (!isNaN(newQuantity)) {
                updateQuantity(productId, newQuantity);
            }
        });
    });
}

function updateCartItemTotal(productId) {
    const itemTotalEl = document.querySelector(`.cart-item-total[data-id="${productId}"]`);
    const item = cart.find(item => item.id == productId);
    
    if (itemTotalEl && item) {
        itemTotalEl.textContent = formatCurrency(item.price * item.quantity);
    }
}

function updateCartTotal() {
    const totalElement = document.querySelector('.cart-summary-total');
    if (!totalElement) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = formatCurrency(total);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize cart page if we're on it
if (window.location.pathname.includes('panier.html')) {
    window.addEventListener('DOMContentLoaded', () => {
        displayCart();
        updateCartTotal();
        
        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Votre panier est vide.');
                    return;
                }
                
                alert('Fonctionnalité de paiement à venir!');
                // Here you would redirect to checkout page or open modal
            });
        }
        
        // Clear cart button
        const clearCartBtn = document.querySelector('.clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir vider votre panier?')) {
                    cart = [];
                    saveCart();
                    updateCartCount();
                    displayCart();
                    updateCartTotal();
                }
            });
        }
    });
} 