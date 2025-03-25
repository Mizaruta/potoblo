// Animations au défilement
document.addEventListener('DOMContentLoaded', function() {
    // Animation au défilement
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkScroll() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Vérifier le défilement initial
    checkScroll();
    
    // Vérifier le défilement à chaque événement de défilement
    window.addEventListener('scroll', checkScroll);
    
    // Compteurs pour créer un sentiment d'urgence
    const countdownElements = document.querySelectorAll('.countdown-timer');
    
    countdownElements.forEach(countdown => {
        // Temps aléatoire pour le compte à rebours (entre 3 et 24 heures)
        const hours = Math.floor(Math.random() * 21) + 3;
        const minutes = Math.floor(Math.random() * 60);
        const seconds = Math.floor(Math.random() * 60);
        
        let totalTime = hours * 3600 + minutes * 60 + seconds;
        
        function updateCountdown() {
            const hoursLeft = Math.floor(totalTime / 3600);
            const minutesLeft = Math.floor((totalTime % 3600) / 60);
            const secondsLeft = totalTime % 60;
            
            const hoursEl = countdown.querySelector('.hours');
            const minutesEl = countdown.querySelector('.minutes');
            const secondsEl = countdown.querySelector('.seconds');
            
            if (hoursEl) hoursEl.textContent = hoursLeft.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutesLeft.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = secondsLeft.toString().padStart(2, '0');
            
            if (totalTime > 0) {
                totalTime--;
                setTimeout(updateCountdown, 1000);
            } else {
                // Reset the countdown when it reaches zero
                totalTime = 24 * 3600;
                setTimeout(updateCountdown, 1000);
            }
        }
        
        updateCountdown();
    });
    
    // Marqueurs de stock aléatoires
    const stockIndicators = document.querySelectorAll('.stock-indicator');
    
    stockIndicators.forEach(indicator => {
        const stockLevel = indicator.querySelector('.stock-level');
        const stockText = indicator.querySelector('.stock-text');
        
        if (stockLevel && stockText) {
            // Niveau de stock aléatoire entre 5% et 95%
            const level = Math.floor(Math.random() * 91) + 5;
            stockLevel.style.width = `${level}%`;
            
            if (level < 20) {
                stockLevel.classList.add('low');
                stockText.textContent = `Plus que ${Math.floor(Math.random() * 5) + 1} en stock!`;
                stockText.classList.add('stock-low');
            } else {
                stockText.textContent = `En stock`;
            }
        }
    });
    
    // Ajouter des éléments visibles aux produits
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Ajouter un badge à certains produits aléatoirement
        if (Math.random() < 0.3) {
            const tagTypes = ['tag-new', 'tag-sale', 'tag-hot'];
            const tagText = ['Nouveau', 'Promo', 'Populaire'];
            
            const randomIndex = Math.floor(Math.random() * tagTypes.length);
            
            const tag = document.createElement('div');
            tag.classList.add('product-tag', tagTypes[randomIndex]);
            tag.textContent = tagText[randomIndex];
            
            card.appendChild(tag);
        }
        
        // Ajouter une remise à certains produits aléatoirement
        if (Math.random() < 0.2) {
            const discounts = ['10%', '20%', '30%', '40%'];
            const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
            
            const discountBadge = document.createElement('div');
            discountBadge.classList.add('discount-badge');
            discountBadge.textContent = `-${randomDiscount}`;
            
            card.appendChild(discountBadge);
        }
        
        // Ajouter des étoiles et des avis
        const productInfo = card.querySelector('.product-info');
        
        if (productInfo) {
            const reviewsPreview = document.createElement('div');
            reviewsPreview.classList.add('reviews-preview');
            
            // Notation aléatoire entre 3 et 5 étoiles
            const rating = (Math.random() * 2 + 3).toFixed(1);
            
            // Nombre d'avis aléatoire
            const reviewCount = Math.floor(Math.random() * 100) + 5;
            
            reviewsPreview.innerHTML = `
                <span class="stars">★★★★★</span>
                <span class="rating">${rating}</span>
                <span class="reviews-count">(${reviewCount})</span>
            `;
            
            productInfo.appendChild(reviewsPreview);
        }
    });
}); 