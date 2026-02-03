class Store {
    constructor() {
        this.state = {
            cart: [],
            category: 'all',
            searchQuery: ''
        };
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Cart Actions
    addToCart(product) {
        if (!this.state.cart.some(item => item.id === product.id)) {
            this.state.cart = [...this.state.cart, product];
            this.notify();
            App.utils.triggerHaptic('light');
            App.utils.showToast('✅ Добавлено в корзину');
        }
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.notify();
        App.utils.triggerHaptic('medium');
    }

    isInCart(productId) {
        return this.state.cart.some(item => item.id === productId);
    }

    getCartTotal() {
        return this.state.cart.reduce((sum, item) => sum + item.price, 0);
    }

    clearCart() {
        this.state.cart = [];
        this.notify();
    }

    // Filter Actions
    setCategory(category) {
        if (this.state.category !== category) {
            this.state.category = category;
            this.notify();
            if (App.tg?.HapticFeedback) {
                App.tg.HapticFeedback.selectionChanged();
            }
        }
    }

    setSearchQuery(query) {
        if (this.state.searchQuery !== query) {
            this.state.searchQuery = query;
            this.notify();
        }
    }
}

App.store = new Store();
