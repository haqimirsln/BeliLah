function renderCart() {
    const container = document.getElementById('cartContainer');
    const items = window.cartManager.getItems();
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items" id="cartItemsList"></div>
            <div class="cart-summary">
                <h2>Order Summary</h2>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span class="amount">${formatCurrency(window.cartManager.getSubtotal())}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span class="amount">${formatCurrency(window.cartManager.getShipping())}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (6%):</span>
                    <span class="amount">${formatCurrency(window.cartManager.getTax())}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span class="amount">${formatCurrency(window.cartManager.getTotal())}</span>
                </div>
                <div class="shipping-note">
                    ${window.cartManager.getShipping() === 0 ? '🎉 Free shipping!' : '💡 Free shipping on orders over RM100'}
                </div>
                <a href="checkout.html" class="checkout-btn">Proceed to Checkout</a>
                <a href="products.html" class="continue-shopping">Continue Shopping</a>
            </div>
        </div>
    `;
    
    const itemsList = document.getElementById('cartItemsList');
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-description">${item.description}</p>
                <p class="cart-item-price">${item.price}</p>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn-small" data-action="decrease" data-id="${item.id}">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn-small" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        itemsList.appendChild(itemEl);
    });
    
    document.querySelectorAll('.quantity-btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const action = e.target.dataset.action;
            const item = items.find(i => i.id === id);
            if (item) {
                const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                if (newQty > 0) {
                    window.cartManager.updateQuantity(id, newQty);
                    renderCart();
                }
            }
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            window.cartManager.removeItem(id);
            window.cartManager.showToast('Item removed from cart', 'success');
            renderCart();
        });
    });
}

renderCart();
