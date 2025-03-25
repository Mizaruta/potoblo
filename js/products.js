// DOM Elements
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortFilter = document.getElementById('sort-filter');
const productsContainer = document.getElementById('all-products');

// Load all products
window.addEventListener('DOMContentLoaded', () => {
    displayAllProducts();
    
    // Event listeners for filters
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
});

// Display all products
function displayAllProducts() {
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    // Apply filters
    let filteredProducts = [...products];
    
    // Category filter
    if (categoryFilter && categoryFilter.value !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryFilter.value
        );
    }
    
    // Price filter
    if (priceFilter && priceFilter.value !== 'all') {
        const priceRange = priceFilter.value.split('-');
        if (priceRange.length === 2) {
            const minPrice = parseInt(priceRange[0]);
            const maxPrice = parseInt(priceRange[1]);
            filteredProducts = filteredProducts.filter(product => 
                product.price >= minPrice && product.price <= maxPrice
            );
        } else if (priceFilter.value === '100+') {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= 100
            );
        }
    }
    
    // Sort products
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // In a real app, you would have a date field
                // Here we'll just reverse the array as a demonstration
                filteredProducts.reverse();
                break;
            // Default is popularity (original order)
        }
    }
    
    // Display filtered products
    filteredProducts.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        
        productEl.innerHTML = `
            <div class="product-img">
                <img src="../${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-price">
                    <span class="price">${product.price.toFixed(2)} €</span>
                    <a href="#" class="add-to-cart" data-id="${product.id}" title="Ajouter au panier">
                        <i class="fas fa-shopping-cart"></i>
                    </a>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productEl);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
    
    // Show message if no products match filters
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Aucun produit ne correspond à vos critères de recherche.</p>';
    }
}

// Filter products based on selected options
function filterProducts() {
    displayAllProducts();
} 