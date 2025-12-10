// ============================================
// Home Page Specific JavaScript
// ============================================

function renderFeaturedProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Show first 6 products as featured
    const featuredProducts = window.productsData.products.slice(0, 6);
    
    productsGrid.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card animate-on-scroll';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="add-to-cart" 
                            data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // Add click event for view details
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(event) {
    event.stopPropagation();
    const button = event.target;
    const productId = parseInt(button.getAttribute('data-product-id'));
    const product = window.productsData.getProductById(productId);
    
    if (product && window.cartManager) {
        window.cartManager.addItem(product);
        window.cartManager.showToast(`${product.name} added to cart!`, 'success');
        
        // Add button animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
}

// Initialize home page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFeaturedProducts);
} else {
    renderFeaturedProducts();
}
