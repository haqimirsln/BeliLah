// ============================================
// User Authentication & Profile Management
// ============================================

class AuthManager {
    constructor() {
        this.storageKey = 'belilah_user';
        this.currentUser = this.loadUser();
    }

    // Load current user from localStorage
    loadUser() {
        try {
            const userData = localStorage.getItem(this.storageKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        }
    }

    // Save user to localStorage
    saveUser(user) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;
            this.updateUI();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    }

    // Register new user
    register(userData) {
        const users = this.getAllUsers();
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now(),
            email: userData.email,
            password: btoa(userData.password), // Simple encoding (not secure for production!)
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            createdAt: new Date().toISOString(),
            addresses: [],
            orders: [],
            wishlist: [],
            settings: {
                newsletter: false,
                notifications: true
            }
        };

        users.push(newUser);
        localStorage.setItem('belilah_users', JSON.stringify(users));
        
        // Auto login after registration
        this.saveUser(newUser);
        
        return { success: true, message: 'Registration successful!' };
    }

    // Login user
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === btoa(password));

        if (user) {
            this.saveUser(user);
            return { success: true, message: 'Login successful!' };
        }

        return { success: false, message: 'Invalid email or password' };
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.storageKey);
        this.currentUser = null;
        this.updateUI();
        window.location.href = 'index.html';
    }

    // Get all users
    getAllUsers() {
        try {
            const users = localStorage.getItem('belilah_users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            return [];
        }
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) return false;

        this.currentUser = { ...this.currentUser, ...updates };
        
        // Update in users list
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('belilah_users', JSON.stringify(users));
        }

        this.saveUser(this.currentUser);
        return true;
    }

    // Add address
    addAddress(address) {
        if (!this.currentUser) return false;

        address.id = Date.now();
        address.isDefault = this.currentUser.addresses.length === 0;
        
        this.currentUser.addresses.push(address);
        this.updateProfile({ addresses: this.currentUser.addresses });
        return true;
    }

    // Add order to history
    addOrder(order) {
        if (!this.currentUser) return false;

        this.currentUser.orders.unshift(order);
        this.updateProfile({ orders: this.currentUser.orders });
        return true;
    }

    // Wishlist management
    addToWishlist(productId) {
        if (!this.currentUser) return false;

        if (!this.currentUser.wishlist.includes(productId)) {
            this.currentUser.wishlist.push(productId);
            this.updateProfile({ wishlist: this.currentUser.wishlist });
        }
        return true;
    }

    removeFromWishlist(productId) {
        if (!this.currentUser) return false;

        this.currentUser.wishlist = this.currentUser.wishlist.filter(id => id !== productId);
        this.updateProfile({ wishlist: this.currentUser.wishlist });
        return true;
    }

    isInWishlist(productId) {
        return this.currentUser ? this.currentUser.wishlist.includes(productId) : false;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get user info
    getUserInfo() {
        return this.currentUser;
    }

    // Update UI based on auth state
    updateUI() {
        const authButtons = document.querySelectorAll('.auth-btn');
        const userMenus = document.querySelectorAll('.user-menu');
        const userNames = document.querySelectorAll('.user-name');

        if (this.isLoggedIn()) {
            authButtons.forEach(btn => btn.style.display = 'none');
            userMenus.forEach(menu => menu.style.display = 'flex');
            userNames.forEach(name => {
                name.textContent = this.currentUser.firstName;
            });
        } else {
            authButtons.forEach(btn => btn.style.display = 'flex');
            userMenus.forEach(menu => menu.style.display = 'none');
        }
    }
}

// Create global auth instance
window.authManager = new AuthManager();
