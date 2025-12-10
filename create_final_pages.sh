#!/bin/bash

cd /home/claude/belilah-enhanced

# Checkout Page
cat > checkout.html << 'CHECKOUT_HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout | BeliLah</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/pages.css">
</head>
<body>
    <div id="toast" class="toast"></div>
    
    <header class="navbar">
        <nav class="nav-container">
            <div class="nav-logo"><a href="index.html">BeliLah</a></div>
        </nav>
    </header>

    <section class="page-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
    </section>

    <div class="breadcrumb container">
        <a href="index.html">Home</a> <span>/</span> <a href="cart.html">Cart</a> <span>/</span> <span>Checkout</span>
    </div>

    <section class="checkout-page">
        <div class="container">
            <div class="checkout-layout">
                <form class="checkout-form" id="checkoutForm">
                    <div class="form-section">
                        <h2>Shipping Information</h2>
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" required>
                                <span class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" required>
                                <span class="error-message"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label>Phone *</label>
                            <input type="tel" name="phone" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label>Address *</label>
                            <textarea name="address" rows="3" required></textarea>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>City *</label>
                                <input type="text" name="city" required>
                                <span class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label>Postal Code *</label>
                                <input type="text" name="postalCode" required>
                                <span class="error-message"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h2>Payment Method</h2>
                        <div class="payment-methods">
                            <label class="payment-method selected">
                                <input type="radio" name="paymentMethod" value="card" checked>
                                <span>Credit/Debit Card</span>
                            </label>
                            <label class="payment-method">
                                <input type="radio" name="paymentMethod" value="bank">
                                <span>Online Banking</span>
                            </label>
                            <label class="payment-method">
                                <input type="radio" name="paymentMethod" value="ewallet">
                                <span>E-Wallet</span>
                            </label>
                            <label class="payment-method">
                                <input type="radio" name="paymentMethod" value="cod">
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="place-order-btn">Proceed to Payment</button>
                </form>
                
                <div class="order-summary-box">
                    <h2>Order Summary</h2>
                    <div class="summary-items" id="summaryItems"></div>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span id="summarySubtotal"></span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span id="summaryShipping"></span>
                    </div>
                    <div class="summary-row">
                        <span>Tax:</span>
                        <span id="summaryTax"></span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span class="amount" id="summaryTotal"></span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script src="js/products.js"></script>
    <script src="js/cart-manager.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/checkout.js"></script>
</body>
</html>
CHECKOUT_HTML

# Checkout JS
cat > js/checkout.js << 'CHECKOUT_JS'
function renderOrderSummary() {
    const items = window.cartManager.getItems();
    if (items.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = items.map(item => `
        <div class="summary-item">
            <span class="summary-item-name">${item.name}</span>
            <span class="summary-item-qty">x${item.quantity}</span>
            <span class="summary-item-price">${formatCurrency(item.priceValue * item.quantity)}</span>
        </div>
    `).join('');
    
    document.getElementById('summarySubtotal').textContent = formatCurrency(window.cartManager.getSubtotal());
    document.getElementById('summaryShipping').textContent = formatCurrency(window.cartManager.getShipping());
    document.getElementById('summaryTax').textContent = formatCurrency(window.cartManager.getTax());
    document.getElementById('summaryTotal').textContent = formatCurrency(window.cartManager.getTotal());
}

document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
        this.classList.add('selected');
        this.querySelector('input[type="radio"]').checked = true;
    });
});

document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    
    if (!validateEmail(data.email)) {
        window.cartManager.showToast('Please enter a valid email', 'error');
        return;
    }
    
    if (!validatePhone(data.phone)) {
        window.cartManager.showToast('Please enter a valid phone number', 'error');
        return;
    }
    
    saveToStorage('belilah_checkout', data);
    window.location.href = 'payment.html';
});

renderOrderSummary();
CHECKOUT_JS

# Payment Page
cat > payment.html << 'PAYMENT_HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment | BeliLah</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/pages.css">
</head>
<body>
    <div id="toast" class="toast"></div>
    <div id="loading-spinner" class="loading-spinner"><div class="spinner"></div></div>
    
    <header class="navbar">
        <nav class="nav-container">
            <div class="nav-logo"><a href="index.html">BeliLah</a></div>
        </nav>
    </header>

    <section class="page-header">
        <h1>Payment</h1>
        <p>Secure payment processing</p>
    </section>

    <section class="payment-page">
        <div class="payment-container">
            <div class="payment-box">
                <div class="payment-header">
                    <h2>Complete Your Payment</h2>
                    <p class="payment-amount" id="paymentAmount"></p>
                </div>
                
                <form id="paymentForm">
                    <div class="card-input-group">
                        <label>Card Number *</label>
                        <input type="text" id="cardNumber" class="card-number-input" placeholder="1234 5678 9012 3456" maxlength="19" required>
                    </div>
                    
                    <div class="card-input-group">
                        <label>Cardholder Name *</label>
                        <input type="text" id="cardName" placeholder="John Doe" required>
                    </div>
                    
                    <div class="card-row">
                        <div class="card-input-group">
                            <label>Expiry Date *</label>
                            <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" required>
                        </div>
                        <div class="card-input-group">
                            <label>CVV *</label>
                            <input type="text" id="cvv" placeholder="123" maxlength="3" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="pay-btn">Pay Now</button>
                    
                    <div class="security-note">
                        <span class="security-icon">🔒</span>
                        Your payment information is encrypted and secure
                    </div>
                </form>
            </div>
        </div>
    </section>

    <script src="js/cart-manager.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/payment.js"></script>
</body>
</html>
PAYMENT_HTML

# Payment JS
cat > js/payment.js << 'PAYMENT_JS'
const total = window.cartManager.getTotal();
document.getElementById('paymentAmount').textContent = formatCurrency(total);

document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
});

document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    showLoading();
    
    setTimeout(() => {
        const orderNumber = 'BL' + Date.now();
        saveToStorage('belilah_order', {
            orderNumber: orderNumber,
            date: new Date().toISOString(),
            total: total,
            items: window.cartManager.getItems()
        });
        
        window.cartManager.clearCart();
        hideLoading();
        window.location.href = `order-confirmation.html?order=${orderNumber}`;
    }, 2000);
});
PAYMENT_JS

# Order Confirmation Page
cat > order-confirmation.html << 'CONFIRM_HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed | BeliLah</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/pages.css">
</head>
<body>
    <header class="navbar">
        <nav class="nav-container">
            <div class="nav-logo"><a href="index.html">BeliLah</a></div>
        </nav>
    </header>

    <section class="confirmation-page">
        <div class="confirmation-box">
            <div class="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. Your order has been successfully placed.</p>
            <div class="order-number" id="orderNumber"></div>
            <p>We've sent a confirmation email with order details.</p>
            <div class="confirmation-actions">
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        </div>
        
        <div class="order-details-box">
            <h2>Order Details</h2>
            <div class="detail-row">
                <span>Order Date:</span>
                <span id="orderDate"></span>
            </div>
            <div class="detail-row">
                <span>Total Amount:</span>
                <span id="orderTotal"></span>
            </div>
            <div class="detail-row">
                <span>Estimated Delivery:</span>
                <span>2-3 business days</span>
            </div>
        </div>
    </section>

    <script src="js/utils.js"></script>
    <script src="js/confirmation.js"></script>
</body>
</html>
CONFIRM_HTML

# Confirmation JS
cat > js/confirmation.js << 'CONFIRM_JS'
const urlParams = new URLSearchParams(window.location.search);
const orderNumber = urlParams.get('order');

if (!orderNumber) {
    window.location.href = 'index.html';
} else {
    document.getElementById('orderNumber').textContent = `Order #${orderNumber}`;
    
    const order = loadFromStorage('belilah_order');
    if (order) {
        const date = new Date(order.date);
        document.getElementById('orderDate').textContent = date.toLocaleDateString();
        document.getElementById('orderTotal').textContent = formatCurrency(order.total);
    }
}
CONFIRM_JS

# Product Detail Page
cat > product-detail.html << 'DETAIL_HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Detail | BeliLah</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/pages.css">
</head>
<body>
    <div id="toast" class="toast"></div>
    
    <header class="navbar">
        <nav class="nav-container">
            <div class="nav-logo"><a href="index.html">BeliLah</a></div>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
            </ul>
            <div class="nav-actions">
                <a href="cart.html" class="icon-btn cart-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H3L3.4 3M5 11H15L19 3H3.4M5 11L3.4 3M5 11L3 15H17M9 18C9 18.5523 8.55228 19 8 19C7.44772 19 7 18.5523 7 18C7 17.4477 7.44772 17 8 17C8.55228 17 9 17.4477 9 18ZM17 18C17 18.5523 16.5523 19 16 19C15.4477 19 15 18.5523 15 18C15 17.4477 15.4477 17 16 17C16.5523 17 17 17.4477 17 18Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span class="cart-count" id="cartCount">0</span>
                </a>
                <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>
            </div>
        </nav>
    </header>

    <div class="breadcrumb container">
        <a href="index.html">Home</a> <span>/</span> <a href="products.html">Products</a> <span>/</span> <span id="breadcrumbProduct"></span>
    </div>

    <section class="product-detail">
        <div class="container">
            <div class="product-detail-grid">
                <div class="product-image-large" id="productImage"></div>
                <div class="product-info-detailed">
                    <span class="product-category-tag" id="productCategory"></span>
                    <h1 class="product-title-large" id="productName"></h1>
                    <div class="product-rating">
                        <div class="stars" id="productStars"></div>
                        <span class="rating-count" id="productReviews"></span>
                    </div>
                    <p class="product-price-large" id="productPrice"></p>
                    <p class="product-description-full" id="productDescription"></p>
                    <div class="product-features">
                        <h3>Features</h3>
                        <ul id="productFeatures"></ul>
                    </div>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn" id="decreaseQty">−</button>
                            <input type="number" class="quantity-input" id="quantity" value="1" min="1">
                            <button class="quantity-btn" id="increaseQty">+</button>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-large" id="addToCartBtn">Add to Cart</button>
                        <button class="btn btn-secondary btn-large" id="buyNowBtn">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2025 BeliLah. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/products.js"></script>
    <script src="js/cart-manager.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/product-detail.js"></script>
</body>
</html>
DETAIL_HTML

# Product Detail JS
cat > js/product-detail.js << 'DETAIL_JS'
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
const product = window.productsData.getProductById(productId);

if (!product) {
    window.location.href = 'products.html';
} else {
    document.getElementById('breadcrumbProduct').textContent = product.name;
    document.getElementById('productImage').textContent = product.image;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productStars').innerHTML = generateStarRating(product.rating);
    document.getElementById('productReviews').textContent = `(${product.reviews} reviews)`;
    document.getElementById('productPrice').textContent = product.price;
    document.getElementById('productDescription').textContent = product.description;
    
    const featuresList = document.getElementById('productFeatures');
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
}

const qtyInput = document.getElementById('quantity');
document.getElementById('decreaseQty').addEventListener('click', () => {
    if (qtyInput.value > 1) qtyInput.value--;
});
document.getElementById('increaseQty').addEventListener('click', () => {
    qtyInput.value++;
});

document.getElementById('addToCartBtn').addEventListener('click', () => {
    const qty = parseInt(qtyInput.value);
    window.cartManager.addItem(product, qty);
    window.cartManager.showToast(`${qty} x ${product.name} added to cart!`, 'success');
});

document.getElementById('buyNowBtn').addEventListener('click', () => {
    const qty = parseInt(qtyInput.value);
    window.cartManager.addItem(product, qty);
    window.location.href = 'cart.html';
});
DETAIL_JS

echo "All final pages created successfully!"
