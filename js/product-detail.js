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
