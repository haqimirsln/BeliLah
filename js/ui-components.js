// ============================================
// UI Components & Modals
// ============================================

class UIComponents {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        this.createModals();
        this.attachEventListeners();
    }

    // Create all modals
    createModals() {
        // Login Modal
        this.createModal('login', this.getLoginModalHTML());
        
        // Register Modal
        this.createModal('register', this.getRegisterModalHTML());
        
        // Review Modal
        this.createModal('review', this.getReviewModalHTML());
        
        // Quick View Modal
        this.createModal('quickView', this.getQuickViewModalHTML());
        
        // Coupon List Modal
        this.createModal('coupons', this.getCouponsModalHTML());
    }

    // Create a modal
    createModal(id, html) {
        const modal = document.createElement('div');
        modal.id = `${id}Modal`;
        modal.className = 'modal';
        modal.innerHTML = html;
        document.body.appendChild(modal);
        this.modals.set(id, modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(id);
            }
        });
    }

    // Show modal
    showModal(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    closeModal(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Login Modal HTML
    getLoginModalHTML() {
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Welcome Back</h2>
                    <span class="modal-close" onclick="window.uiComponents.closeModal('login')">×</span>
                </div>
                <div class="modal-body">
                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <label>Email Address *</label>
                            <input type="email" name="email" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label>Password *</label>
                            <input type="password" name="password" required placeholder="••••••••">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
                    <div class="auth-toggle">
                        Don't have an account? <a onclick="window.uiComponents.switchToRegister()">Sign up</a>
                    </div>
                    <div class="divider"><span>OR</span></div>
                    <div class="social-auth">
                        <button class="social-auth-btn" onclick="alert('Social login demo')">
                            <span>🌐</span> Continue with Google
                        </button>
                        <button class="social-auth-btn" onclick="alert('Social login demo')">
                            <span>📘</span> Continue with Facebook
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Register Modal HTML
    getRegisterModalHTML() {
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create Account</h2>
                    <span class="modal-close" onclick="window.uiComponents.closeModal('register')">×</span>
                </div>
                <div class="modal-body">
                    <form class="auth-form" id="registerForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Email Address *</label>
                            <input type="email" name="email" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" placeholder="01X-XXX-XXXX">
                        </div>
                        <div class="form-group">
                            <label>Password *</label>
                            <input type="password" name="password" required minlength="6" placeholder="Min. 6 characters">
                        </div>
                        <div class="form-group">
                            <label>Confirm Password *</label>
                            <input type="password" name="confirmPassword" required placeholder="Re-enter password">
                        </div>
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                            <input type="checkbox" name="newsletter">
                            <span>Subscribe to newsletter for deals & updates</span>
                        </label>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;">Create Account</button>
                    </form>
                    <div class="auth-toggle">
                        Already have an account? <a onclick="window.uiComponents.switchToLogin()">Login</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Review Modal HTML
    getReviewModalHTML() {
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Write a Review</h2>
                    <span class="modal-close" onclick="window.uiComponents.closeModal('review')">×</span>
                </div>
                <div class="modal-body">
                    <form class="auth-form" id="reviewForm">
                        <input type="hidden" name="productId" id="reviewProductId">
                        <div class="form-group">
                            <label>Your Rating *</label>
                            <div class="rating-input" id="ratingInput">
                                <span data-rating="1">☆</span>
                                <span data-rating="2">☆</span>
                                <span data-rating="3">☆</span>
                                <span data-rating="4">☆</span>
                                <span data-rating="5">☆</span>
                            </div>
                            <input type="hidden" name="rating" id="selectedRating" required>
                        </div>
                        <div class="form-group">
                            <label>Review Title *</label>
                            <input type="text" name="title" required placeholder="Sum up your experience">
                        </div>
                        <div class="form-group">
                            <label>Your Review *</label>
                            <textarea name="comment" rows="4" required placeholder="Tell us what you think about this product..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Review</button>
                    </form>
                </div>
            </div>
        `;
    }

    // Quick View Modal HTML
    getQuickViewModalHTML() {
        return `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>Quick View</h2>
                    <span class="modal-close" onclick="window.uiComponents.closeModal('quickView')">×</span>
                </div>
                <div class="modal-body">
                    <div id="quickViewContent"></div>
                </div>
            </div>
        `;
    }

    // Coupons Modal HTML
    getCouponsModalHTML() {
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Available Coupons</h2>
                    <span class="modal-close" onclick="window.uiComponents.closeModal('coupons')">×</span>
                </div>
                <div class="modal-body">
                    <div id="couponsListContent"></div>
                </div>
            </div>
        `;
    }

    // Switch between login and register
    switchToRegister() {
        this.closeModal('login');
        this.showModal('register');
    }

    switchToLogin() {
        this.closeModal('register');
        this.showModal('login');
    }

    // Attach event listeners
    attachEventListeners() {
        // Login form
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(e.target);
            } else if (e.target.id === 'registerForm') {
                e.preventDefault();
                this.handleRegister(e.target);
            } else if (e.target.id === 'reviewForm') {
                e.preventDefault();
                this.handleReviewSubmit(e.target);
            }
        });

        // Rating input clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('#ratingInput')) {
                const star = e.target;
                if (star.dataset.rating) {
                    const rating = parseInt(star.dataset.rating);
                    this.setRating(rating);
                }
            }
        });

        // Auth buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.auth-btn')) {
                this.showModal('login');
            }
        });
    }

    // Handle login
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        const result = window.authManager.login(email, password);
        
        if (result.success) {
            this.closeModal('login');
            window.cartManager.showToast(result.message, 'success');
            window.authManager.updateUI();
            setTimeout(() => window.location.reload(), 500);
        } else {
            window.cartManager.showToast(result.message, 'error');
        }
    }

    // Handle register
    handleRegister(form) {
        const formData = new FormData(form);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            window.cartManager.showToast('Passwords do not match', 'error');
            return;
        }

        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: password
        };

        const result = window.authManager.register(userData);
        
        if (result.success) {
            this.closeModal('register');
            window.cartManager.showToast(result.message, 'success');
            window.authManager.updateUI();
            setTimeout(() => window.location.reload(), 500);
        } else {
            window.cartManager.showToast(result.message, 'error');
        }
    }

    // Set rating in review form
    setRating(rating) {
        const stars = document.querySelectorAll('#ratingInput span');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.style.color = '#ffc107';
            } else {
                star.textContent = '☆';
                star.style.color = '#d2d2d7';
            }
        });
        document.getElementById('selectedRating').value = rating;
    }

    // Handle review submit
    handleReviewSubmit(form) {
        const formData = new FormData(form);
        
        if (!window.authManager.isLoggedIn()) {
            window.cartManager.showToast('Please login to write a review', 'error');
            this.closeModal('review');
            this.showModal('login');
            return;
        }

        const user = window.authManager.getUserInfo();
        const review = {
            productId: parseInt(formData.get('productId')),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            rating: parseInt(formData.get('rating')),
            title: formData.get('title'),
            comment: formData.get('comment')
        };

        window.reviewManager.addReview(review);
        this.closeModal('review');
        window.cartManager.showToast('Review submitted successfully!', 'success');
        
        // Reload if on product detail page
        if (window.location.pathname.includes('product-detail.html')) {
            setTimeout(() => window.location.reload(), 1000);
        }
    }

    // Show quick view
    showQuickView(productId) {
        const product = window.productsData.getProductById(productId);
        if (!product) return;

        const content = document.getElementById('quickViewContent');
        content.innerHTML = `
            <div class="product-detail-grid">
                <div class="product-image-large" style="height: 300px; font-size: 120px;">${product.image}</div>
                <div class="product-info-detailed">
                    <span class="product-category-tag">${product.category}</span>
                    <h1 class="product-title-large" style="font-size: 28px;">${product.name}</h1>
                    <div class="product-rating">
                        <div class="stars">${generateStarRating(product.rating)}</div>
                        <span class="rating-count">(${product.reviews} reviews)</span>
                    </div>
                    <p class="product-price-large" style="font-size: 28px;">${product.price}</p>
                    <p class="product-description-full" style="font-size: 14px;">${product.description}</p>
                    <div class="product-actions" style="margin-top: 24px;">
                        <button class="btn btn-primary btn-large" onclick="window.cartManager.addItem(window.productsData.getProductById(${product.id})); window.cartManager.showToast('Added to cart!', 'success'); window.uiComponents.closeModal('quickView');">Add to Cart</button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-secondary btn-large">View Details</a>
                    </div>
                </div>
            </div>
        `;

        this.showModal('quickView');
    }

    // Show coupons modal
    showCouponsModal() {
        const content = document.getElementById('couponsListContent');
        const coupons = window.couponManager.getAvailableCoupons();
        
        content.innerHTML = `
            <div class="coupon-list">
                ${coupons.map(coupon => `
                    <div class="coupon-item" onclick="window.uiComponents.applyCouponFromModal('${coupon.code}')">
                        <div>
                            <div class="coupon-code">${coupon.code}</div>
                            <div class="coupon-description">${coupon.description}</div>
                        </div>
                        <button class="btn btn-secondary" style="padding: 8px 16px;">Apply</button>
                    </div>
                `).join('')}
            </div>
        `;

        this.showModal('coupons');
    }

    // Apply coupon from modal
    applyCouponFromModal(code) {
        const couponInput = document.getElementById('couponInput');
        if (couponInput) {
            couponInput.value = code;
            const applyBtn = document.querySelector('.coupon-apply-btn');
            if (applyBtn) {
                applyBtn.click();
            }
        }
        this.closeModal('coupons');
    }

    // Show review modal for product
    showReviewModal(productId) {
        if (!window.authManager.isLoggedIn()) {
            window.cartManager.showToast('Please login to write a review', 'error');
            this.showModal('login');
            return;
        }

        const canReview = window.reviewManager.canUserReview(productId);
        if (!canReview.canReview) {
            window.cartManager.showToast(canReview.reason, 'error');
            return;
        }

        document.getElementById('reviewProductId').value = productId;
        this.setRating(0);
        this.showModal('review');
    }
}

// Initialize UI Components
window.uiComponents = new UIComponents();

// Initialize user dropdown
function initUserDropdown() {
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });

        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Add to DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserDropdown);
} else {
    initUserDropdown();
}
