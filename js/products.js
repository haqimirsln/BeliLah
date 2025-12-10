// ============================================
// Products Database
// ============================================

const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        description: "Crystal clear sound with active noise cancellation",
        price: "RM 899",
        priceValue: 899,
        image: "🎧",
        category: "Electronics",
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Bluetooth 5.0",
            "Premium comfort padding"
        ],
        rating: 4.8,
        reviews: 234,
        inStock: true
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        description: "Track your fitness and stay connected",
        price: "RM 1,299",
        priceValue: 1299,
        image: "⌚",
        category: "Electronics",
        features: [
            "Heart rate monitoring",
            "GPS tracking",
            "Water resistant",
            "7-day battery life"
        ],
        rating: 4.6,
        reviews: 189,
        inStock: true
    },
    {
        id: 3,
        name: "Ultra HD Camera",
        description: "Capture life's moments in stunning detail",
        price: "RM 2,499",
        priceValue: 2499,
        image: "📷",
        category: "Electronics",
        features: [
            "4K video recording",
            "24MP sensor",
            "Image stabilization",
            "WiFi connectivity"
        ],
        rating: 4.9,
        reviews: 156,
        inStock: true
    },
    {
        id: 4,
        name: "Wireless Speaker",
        description: "360° sound with deep bass",
        price: "RM 599",
        priceValue: 599,
        image: "🔊",
        category: "Electronics",
        features: [
            "360° surround sound",
            "20-hour playtime",
            "Waterproof IPX7",
            "Voice assistant"
        ],
        rating: 4.5,
        reviews: 312,
        inStock: true
    },
    {
        id: 5,
        name: "Gaming Laptop",
        description: "High-performance gaming on the go",
        price: "RM 5,999",
        priceValue: 5999,
        image: "💻",
        category: "Electronics",
        features: [
            "RTX 4060 Graphics",
            "Intel i7 Processor",
            "16GB RAM",
            "1TB SSD"
        ],
        rating: 4.7,
        reviews: 98,
        inStock: true
    },
    {
        id: 6,
        name: "Smart Home Hub",
        description: "Control your entire home from one device",
        price: "RM 799",
        priceValue: 799,
        image: "🏠",
        category: "Gadgets",
        features: [
            "Voice control",
            "Compatible with all devices",
            "Energy monitoring",
            "Automation scheduling"
        ],
        rating: 4.4,
        reviews: 167,
        inStock: true
    },
    {
        id: 7,
        name: "Professional Drone",
        description: "4K aerial photography made easy",
        price: "RM 3,499",
        priceValue: 3499,
        image: "🚁",
        category: "Electronics",
        features: [
            "4K camera",
            "30-minute flight time",
            "GPS positioning",
            "Return-to-home"
        ],
        rating: 4.8,
        reviews: 142,
        inStock: true
    },
    {
        id: 8,
        name: "Fitness Tracker Band",
        description: "Monitor your health 24/7",
        price: "RM 299",
        priceValue: 299,
        image: "📱",
        category: "Gadgets",
        features: [
            "24/7 heart rate",
            "Sleep tracking",
            "14-day battery",
            "Water resistant"
        ],
        rating: 4.3,
        reviews: 456,
        inStock: true
    },
    {
        id: 9,
        name: "Premium Backpack",
        description: "Stylish and functional for everyday use",
        price: "RM 399",
        priceValue: 399,
        image: "🎒",
        category: "Fashion",
        features: [
            "Water resistant",
            "Laptop compartment",
            "USB charging port",
            "Ergonomic design"
        ],
        rating: 4.6,
        reviews: 289,
        inStock: true
    },
    {
        id: 10,
        name: "Coffee Maker Pro",
        description: "Barista-quality coffee at home",
        price: "RM 899",
        priceValue: 899,
        image: "☕",
        category: "Home & Living",
        features: [
            "15-bar pressure",
            "Milk frother",
            "Programmable",
            "Auto-clean"
        ],
        rating: 4.7,
        reviews: 203,
        inStock: true
    },
    {
        id: 11,
        name: "LED Desk Lamp",
        description: "Adjustable lighting for perfect ambiance",
        price: "RM 249",
        priceValue: 249,
        image: "💡",
        category: "Home & Living",
        features: [
            "3 color modes",
            "5 brightness levels",
            "USB charging port",
            "Touch control"
        ],
        rating: 4.5,
        reviews: 178,
        inStock: true
    },
    {
        id: 12,
        name: "Bluetooth Earbuds",
        description: "True wireless freedom with premium sound",
        price: "RM 449",
        priceValue: 449,
        image: "🎵",
        category: "Electronics",
        features: [
            "Active noise cancellation",
            "8-hour battery",
            "Touch controls",
            "Charging case included"
        ],
        rating: 4.6,
        reviews: 534,
        inStock: true
    }
];

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
}

// Get all categories
function getCategories() {
    const categories = [...new Set(products.map(product => product.category))];
    return ['all', ...categories];
}

// Search products
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

// Sort products
function sortProducts(productsArray, sortBy) {
    const sorted = [...productsArray];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.priceValue - b.priceValue);
        case 'price-high':
            return sorted.sort((a, b) => b.priceValue - a.priceValue);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.productsData = {
        products,
        getProductById,
        getProductsByCategory,
        getCategories,
        searchProducts,
        sortProducts
    };
}
