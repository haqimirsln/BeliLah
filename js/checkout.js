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
