// ============================================
// Wishlist Management System
// ============================================

class WishlistManager {
    constructor() {
        this.storageKey = 'belilah_wishlist';
        this.wishlist = this.loadWishlist();
    }

    // Load wishlist from localStorage or auth
    loadWishlist() {
        if (window.authManager && window.authManager.isLoggedIn()) {
            return window.authManager.currentUser.wishlist || [];
        }
        
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    // Save wishlist
    saveWishlist() {
        if (window.authManager && window.authManager.isLoggedIn()) {
            window.authManager.updateProfile({ wishlist: this.wishlist });
        } else {
            localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
        }
        this.updateUI();
    }

    // Add to wishlist
    addItem(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.saveWishlist();
            return true;
        }
        return false;
    }

    // Remove from wishlist
    removeItem(productId) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        this.saveWishlist();
    }

    // Check if item is in wishlist
    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }

    // Get all wishlist items
    getItems() {
        if (!window.productsData) return [];
        return this.wishlist
            .map(id => window.productsData.getProductById(id))
            .filter(product => product !== undefined);
    }

    // Get wishlist count
    getCount() {
        return this.wishlist.length;
    }

    // Clear wishlist
    clear() {
        this.wishlist = [];
        this.saveWishlist();
    }

    // Toggle wishlist item
    toggleItem(productId) {
        if (this.isInWishlist(productId)) {
            this.removeItem(productId);
            return false;
        } else {
            this.addItem(productId);
            return true;
        }
    }

    // Update UI
    updateUI() {
        const wishlistCounts = document.querySelectorAll('.wishlist-count');
        const count = this.getCount();
        
        wishlistCounts.forEach(element => {
            element.textContent = count;
            if (count > 0) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });

        // Update wishlist icons on product cards
        const wishlistButtons = document.querySelectorAll('[data-wishlist-id]');
        wishlistButtons.forEach(button => {
            const productId = parseInt(button.getAttribute('data-wishlist-id'));
            if (this.isInWishlist(productId)) {
                button.classList.add('active');
                button.innerHTML = '❤️';
            } else {
                button.classList.remove('active');
                button.innerHTML = '🤍';
            }
        });
    }

    // Show toast
    showToast(message, type = 'success') {
        if (window.cartManager) {
            window.cartManager.showToast(message, type);
        }
    }

    // Move wishlist item to cart
    moveToCart(productId) {
        const product = window.productsData.getProductById(productId);
        if (product && window.cartManager) {
            window.cartManager.addItem(product);
            this.removeItem(productId);
            this.showToast(`${product.name} moved to cart!`, 'success');
        }
    }
}

// Create global wishlist instance
window.wishlistManager = new WishlistManager();
