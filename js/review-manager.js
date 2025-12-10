// ============================================
// Product Reviews & Ratings System
// ============================================

class ReviewManager {
    constructor() {
        this.storageKey = 'belilah_reviews';
        this.reviews = this.loadReviews();
    }

    // Load reviews from localStorage
    loadReviews() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultReviews();
        } catch (error) {
            return this.getDefaultReviews();
        }
    }

    // Save reviews to localStorage
    saveReviews() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
        } catch (error) {
            console.error('Error saving reviews:', error);
        }
    }

    // Get default/seed reviews
    getDefaultReviews() {
        return [
            {
                id: 1,
                productId: 1,
                userId: 'user_1',
                userName: 'Sarah Ahmad',
                rating: 5,
                title: 'Amazing sound quality!',
                comment: 'These headphones are incredible. The noise cancellation works perfectly and the battery life is outstanding.',
                date: '2024-12-01',
                helpful: 24,
                verified: true,
                images: []
            },
            {
                id: 2,
                productId: 1,
                userId: 'user_2',
                userName: 'John Lee',
                rating: 4,
                title: 'Great but pricey',
                comment: 'Excellent quality and comfort. Only downside is the price, but you get what you pay for.',
                date: '2024-12-03',
                helpful: 15,
                verified: true,
                images: []
            },
            {
                id: 3,
                productId: 2,
                userId: 'user_3',
                userName: 'Nurul Hassan',
                rating: 5,
                title: 'Perfect fitness companion',
                comment: 'Tracks everything I need. Battery lasts almost a week. Very happy with this purchase!',
                date: '2024-12-05',
                helpful: 18,
                verified: true,
                images: []
            },
            {
                id: 4,
                productId: 3,
                userId: 'user_4',
                userName: 'David Chen',
                rating: 5,
                title: 'Professional grade camera',
                comment: 'Amazing image quality. Perfect for both photos and videos. Highly recommend!',
                date: '2024-12-02',
                helpful: 31,
                verified: true,
                images: []
            },
            {
                id: 5,
                productId: 4,
                userId: 'user_5',
                userName: 'Maria Santos',
                rating: 4,
                title: 'Great speaker!',
                comment: 'Sound quality is excellent. Waterproof feature works great at the pool.',
                date: '2024-12-04',
                helpful: 12,
                verified: false,
                images: []
            }
        ];
    }

    // Add new review
    addReview(review) {
        const newReview = {
            id: Date.now(),
            productId: review.productId,
            userId: review.userId || 'guest',
            userName: review.userName,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
            verified: this.isVerifiedPurchase(review.productId, review.userId),
            images: review.images || []
        };

        this.reviews.push(newReview);
        this.saveReviews();
        return newReview;
    }

    // Check if user purchased product
    isVerifiedPurchase(productId, userId) {
        if (!window.authManager || !userId) return false;
        const user = window.authManager.getUserInfo();
        if (!user || !user.orders) return false;

        return user.orders.some(order => 
            order.items && order.items.some(item => item.id === productId)
        );
    }

    // Get reviews for a product
    getProductReviews(productId) {
        return this.reviews
            .filter(review => review.productId === productId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get review statistics for a product
    getProductStats(productId) {
        const productReviews = this.getProductReviews(productId);
        
        if (productReviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                verifiedCount: 0
            };
        }

        const ratings = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalRating = 0;
        let verifiedCount = 0;

        productReviews.forEach(review => {
            ratings[review.rating]++;
            totalRating += review.rating;
            if (review.verified) verifiedCount++;
        });

        return {
            averageRating: (totalRating / productReviews.length).toFixed(1),
            totalReviews: productReviews.length,
            ratings: ratings,
            verifiedCount: verifiedCount
        };
    }

    // Mark review as helpful
    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            this.saveReviews();
        }
    }

    // Sort reviews
    sortReviews(productId, sortBy = 'recent') {
        let reviews = this.getProductReviews(productId);

        switch(sortBy) {
            case 'highest':
                return reviews.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return reviews.sort((a, b) => a.rating - b.rating);
            case 'helpful':
                return reviews.sort((a, b) => b.helpful - a.helpful);
            case 'recent':
            default:
                return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    // Filter reviews by rating
    filterByRating(productId, rating) {
        if (rating === 'all') {
            return this.getProductReviews(productId);
        }
        return this.reviews.filter(review => 
            review.productId === productId && review.rating === parseInt(rating)
        );
    }

    // Check if user can review
    canUserReview(productId) {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            return { canReview: false, reason: 'Please login to leave a review' };
        }

        const user = window.authManager.getUserInfo();
        
        // Check if already reviewed
        const hasReviewed = this.reviews.some(r => 
            r.productId === productId && r.userId === user.id
        );

        if (hasReviewed) {
            return { canReview: false, reason: 'You have already reviewed this product' };
        }

        return { canReview: true };
    }

    // Get user's reviews
    getUserReviews(userId) {
        return this.reviews
            .filter(review => review.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Delete review (only user's own review)
    deleteReview(reviewId, userId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review && review.userId === userId) {
            this.reviews = this.reviews.filter(r => r.id !== reviewId);
            this.saveReviews();
            return true;
        }
        return false;
    }

    // Update review
    updateReview(reviewId, userId, updates) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review && review.userId === userId) {
            Object.assign(review, updates);
            this.saveReviews();
            return true;
        }
        return false;
    }

    // Get review summary for display
    getReviewSummary(productId) {
        const stats = this.getProductStats(productId);
        const reviews = this.getProductReviews(productId);
        
        return {
            ...stats,
            recentReviews: reviews.slice(0, 3),
            hasReviews: reviews.length > 0
        };
    }
}

// Create global review instance
window.reviewManager = new ReviewManager();
