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
