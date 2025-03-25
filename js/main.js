// DOM Elements
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const searchIcon = document.getElementById('search-icon');
const searchContainer = document.querySelector('.search-container');
const closeSearch = document.querySelector('.close-search');
const userIcon = document.getElementById('user-icon');
const newsletterForm = document.getElementById('newsletter-form');
const productsGrid = document.querySelector('.products-grid');

// Sample Products Data (In a real app, this would come from a database)
const products = [
    {
        id: 1,
        name: "Écouteurs Sans Fil",
        price: 49.99,
        img: "images/products/headphones.jpg",
        category: "Électronique"
    },
    {
        id: 2,
        name: "Montre Intelligente",
        price: 89.99,
        img: "images/products/smartwatch.jpg",
        category: "Électronique"
    },
    {
        id: 3,
        name: "Sac à Main Élégant",
        price: 59.99,
        img: "images/products/handbag.jpg",
        category: "Mode"
    },
    {
        id: 4,
        name: "Lampe de Bureau LED",
        price: 29.99,
        img: "images/products/lamp.jpg",
        category: "Maison"
    },
    {
        id: 5,
        name: "Crème Hydratante",
        price: 19.99,
        img: "images/products/cream.jpg",
        category: "Beauté"
    },
    {
        id: 6,
        name: "Chargeur Portable",
        price: 34.99,
        img: "images/products/charger.jpg",
        category: "Électronique"
    },
    {
        id: 7,
        name: "T-shirt Premium",
        price: 24.99,
        img: "images/products/tshirt.jpg",
        category: "Mode"
    },
    {
        id: 8,
        name: "Enceinte Bluetooth",
        price: 79.99,
        img: "images/products/speaker.jpg",
        category: "Électronique"
    }
];

// Toggle Menu
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
});

// Toggle Search
searchIcon.addEventListener('click', () => {
    searchContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeSearch.addEventListener('click', () => {
    searchContainer.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// User Account (Simple modal for demo)
userIcon.addEventListener('click', () => {
    alert("Fonctionnalité de compte utilisateur à venir!");
});

// Newsletter Form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        
        if (email) {
            alert(`Merci de vous être inscrit avec l'email: ${email}`);
            newsletterForm.reset();
        }
    });
}

// Display Featured Products
function displayProducts() {
    if (!productsGrid) return;
    
    // Show only first 4 products on homepage
    const featuredProducts = products.slice(0, 4);
    
    featuredProducts.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        
        productEl.innerHTML = `
            <div class="product-img">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-price">
                    <span class="price">${product.price.toFixed(2)} €</span>
                    <a href="#" class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </a>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productEl);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});

// Close the mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.burger')) {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
    }
});

// AOS Animation (For scroll animations)
// Note: In a real project, you would include the AOS library
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
});

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
} 