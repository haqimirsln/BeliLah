// ============================================
// Cart Management System with LocalStorage
// ============================================

class CartManager {
    constructor() {
        this.storageKey = 'belilah_cart';
        this.cart = this.loadCart();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = localStorage.getItem(this.storageKey);
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
            this.updateCartUI();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                priceValue: product.priceValue,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        return true;
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
            return true;
        }
        return false;
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Get cart items
    getItems() {
        return this.cart;
    }

    // Get total items count
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get subtotal
    getSubtotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.priceValue * item.quantity);
        }, 0);
    }

    // Get shipping cost
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 100 ? 0 : 15; // Free shipping over RM100
    }

    // Get tax (6% SST in Malaysia)
    getTax() {
        return this.getSubtotal() * 0.06;
    }

    // Get grand total
    getTotal() {
        return this.getSubtotal() + this.getShipping() + this.getTax();
    }

    // Update cart count in navbar
    updateCartUI() {
        const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
        const totalItems = this.getTotalItems();
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = totalItems;
                
                // Add animation
                element.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast show ${type}`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Create global cart instance
window.cartManager = new CartManager();
