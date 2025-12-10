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
