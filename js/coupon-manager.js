// ============================================
// Coupon & Promo Code System
// ============================================

class CouponManager {
    constructor() {
        this.storageKey = 'belilah_applied_coupon';
        this.appliedCoupon = this.loadAppliedCoupon();
        this.coupons = this.initializeCoupons();
    }

    // Initialize available coupons
    initializeCoupons() {
        return [
            {
                code: 'WELCOME10',
                type: 'percentage',
                value: 10,
                description: '10% off for new customers',
                minPurchase: 50,
                maxDiscount: 100,
                expiryDate: '2025-12-31',
                usageLimit: null,
                categories: []
            },
            {
                code: 'SAVE20',
                type: 'percentage',
                value: 20,
                description: '20% off on orders above RM200',
                minPurchase: 200,
                maxDiscount: 200,
                expiryDate: '2025-12-31',
                usageLimit: null,
                categories: []
            },
            {
                code: 'FLAT50',
                type: 'fixed',
                value: 50,
                description: 'RM50 off on orders above RM300',
                minPurchase: 300,
                maxDiscount: null,
                expiryDate: '2025-12-31',
                usageLimit: null,
                categories: []
            },
            {
                code: 'ELECTRONICS25',
                type: 'percentage',
                value: 25,
                description: '25% off on Electronics',
                minPurchase: 100,
                maxDiscount: 300,
                expiryDate: '2025-12-31',
                usageLimit: null,
                categories: ['Electronics']
            },
            {
                code: 'FREESHIP',
                type: 'free_shipping',
                value: 0,
                description: 'Free shipping on all orders',
                minPurchase: 0,
                maxDiscount: null,
                expiryDate: '2025-12-31',
                usageLimit: null,
                categories: []
            },
            {
                code: 'FIRSTBUY',
                type: 'percentage',
                value: 15,
                description: '15% off for first-time buyers',
                minPurchase: 100,
                maxDiscount: 150,
                expiryDate: '2025-12-31',
                usageLimit: 1,
                categories: [],
                firstTimeOnly: true
            }
        ];
    }

    // Load applied coupon
    loadAppliedCoupon() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    }

    // Save applied coupon
    saveAppliedCoupon(coupon) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(coupon));
            this.appliedCoupon = coupon;
        } catch (error) {
            console.error('Error saving coupon:', error);
        }
    }

    // Validate coupon code
    validateCoupon(code, subtotal, cartItems = []) {
        const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

        if (!coupon) {
            return { valid: false, message: 'Invalid coupon code' };
        }

        // Check expiry date
        if (new Date(coupon.expiryDate) < new Date()) {
            return { valid: false, message: 'Coupon has expired' };
        }

        // Check minimum purchase
        if (subtotal < coupon.minPurchase) {
            return { 
                valid: false, 
                message: `Minimum purchase of ${formatCurrency(coupon.minPurchase)} required` 
            };
        }

        // Check category restrictions
        if (coupon.categories.length > 0 && cartItems.length > 0) {
            const hasValidCategory = cartItems.some(item => {
                const product = window.productsData?.getProductById(item.id);
                return product && coupon.categories.includes(product.category);
            });

            if (!hasValidCategory) {
                return { 
                    valid: false, 
                    message: `Coupon only valid for ${coupon.categories.join(', ')} products` 
                };
            }
        }

        // Check first-time buyer restriction
        if (coupon.firstTimeOnly && window.authManager) {
            const user = window.authManager.getUserInfo();
            if (user && user.orders && user.orders.length > 0) {
                return { 
                    valid: false, 
                    message: 'This coupon is only for first-time buyers' 
                };
            }
        }

        return { valid: true, coupon: coupon };
    }

    // Apply coupon
    applyCoupon(code, subtotal, cartItems = []) {
        const validation = this.validateCoupon(code, subtotal, cartItems);

        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        this.saveAppliedCoupon(validation.coupon);
        return { 
            success: true, 
            message: 'Coupon applied successfully!',
            coupon: validation.coupon
        };
    }

    // Remove coupon
    removeCoupon() {
        localStorage.removeItem(this.storageKey);
        this.appliedCoupon = null;
    }

    // Calculate discount amount
    calculateDiscount(subtotal, cartItems = []) {
        if (!this.appliedCoupon) return 0;

        let discount = 0;

        if (this.appliedCoupon.type === 'percentage') {
            // Calculate discount on eligible items only if category restriction exists
            if (this.appliedCoupon.categories.length > 0) {
                const eligibleTotal = cartItems.reduce((total, item) => {
                    const product = window.productsData?.getProductById(item.id);
                    if (product && this.appliedCoupon.categories.includes(product.category)) {
                        return total + (item.priceValue * item.quantity);
                    }
                    return total;
                }, 0);
                discount = (eligibleTotal * this.appliedCoupon.value) / 100;
            } else {
                discount = (subtotal * this.appliedCoupon.value) / 100;
            }

            // Apply max discount limit
            if (this.appliedCoupon.maxDiscount && discount > this.appliedCoupon.maxDiscount) {
                discount = this.appliedCoupon.maxDiscount;
            }
        } else if (this.appliedCoupon.type === 'fixed') {
            discount = this.appliedCoupon.value;
        }

        return discount;
    }

    // Check if free shipping applies
    isFreeShipping() {
        return this.appliedCoupon && this.appliedCoupon.type === 'free_shipping';
    }

    // Get applied coupon
    getAppliedCoupon() {
        return this.appliedCoupon;
    }

    // Get all available coupons
    getAvailableCoupons(subtotal = 0) {
        return this.coupons.filter(coupon => {
            const notExpired = new Date(coupon.expiryDate) >= new Date();
            return notExpired;
        });
    }

    // Clear coupon on checkout complete
    clearOnCheckout() {
        this.removeCoupon();
    }
}

// Create global coupon instance
window.couponManager = new CouponManager();
