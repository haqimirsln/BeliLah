let currentProducts = window.productsData.products;

function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    const count = document.getElementById('productsCount');
    
    count.textContent = `Showing ${productsToRender.length} products`;
    grid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card animate-on-scroll';
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
        
        grid.appendChild(product);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.getAttribute('data-product-id'));
            const product = window.productsData.getProductById(id);
            if (product) {
                window.cartManager.addItem(product);
                window.cartManager.showToast(`${product.name} added to cart!`, 'success');
            }
        });
    });
}

function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    
    window.productsData.getCategories().forEach(cat => {
        if (cat !== 'all') {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        }
    });
    
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', debounce(applyFilters, 300));
}

function applyFilters() {
    let filtered = window.productsData.products;
    
    const search = document.getElementById('searchInput').value;
    if (search) {
        filtered = window.productsData.searchProducts(search);
    }
    
    const category = document.getElementById('categoryFilter').value;
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    const sort = document.getElementById('sortFilter').value;
    if (sort !== 'default') {
        filtered = window.productsData.sortProducts(filtered, sort);
    }
    
    currentProducts = filtered;
    renderProducts(filtered);
}

initFilters();
renderProducts(currentProducts);
