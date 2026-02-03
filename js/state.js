class Store {
    constructor() {
        const savedCart = localStorage.getItem('cart');
        const savedWishlist = localStorage.getItem('wishlist');
        const savedLang = localStorage.getItem('lang') || (App.tg?.initDataUnsafe?.user?.language_code === 'uk' ? 'ua' : (App.tg?.initDataUnsafe?.user?.language_code === 'en' ? 'en' : 'ua'));
        this.state = {
            cart: savedCart ? JSON.parse(savedCart) : [],
            wishlist: savedWishlist ? JSON.parse(savedWishlist) : [],
            lang: savedLang,
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

    _saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
        this.notify();
    }

    // Cart Actions
    addToCart(product) {
        const existingItem = this.state.cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
            App.utils.showToast(`${getT('toast_count_updated')}: ${existingItem.quantity}`);
        } else {
            this.state.cart = [...this.state.cart, { ...product, quantity: 1 }];
            App.utils.showToast(getT('toast_added'));
        }
        App.utils.triggerHaptic('light');
        this._saveCart();
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        App.utils.triggerHaptic('medium');
        this._saveCart();
    }

    changeQuantity(productId, delta) {
        const item = this.state.cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this._saveCart();
            }
            App.utils.triggerHaptic('light');
        }
    }

    isInCart(productId) {
        return this.state.cart.some(item => item.id === productId);
    }

    getCartTotal() {
        return this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.state.cart = [];
        this._saveCart();
    }

    // Wishlist Actions
    toggleWishlist(productId) {
        const index = this.state.wishlist.indexOf(productId);
        if (index === -1) {
            this.state.wishlist.push(productId);
            App.utils.triggerHaptic('light');
            App.utils.showToast(getT('toast_wishlist_added'));
        } else {
            this.state.wishlist.splice(index, 1);
            App.utils.triggerHaptic('light');
        }
        localStorage.setItem('wishlist', JSON.stringify(this.state.wishlist));
        this.notify();
    }

    isInWishlist(productId) {
        return this.state.wishlist.includes(productId);
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

    setLanguage(lang) {
        if (this.state.lang !== lang) {
            this.state.lang = lang;
            localStorage.setItem('lang', lang);
            this.notify();
        }
    }
}

// Helper to get translation
function getT(key) {
    const lang = App.store?.state?.lang || 'ru';
    return App.i18n[lang][key] || App.i18n['ru'][key] || key;
}
window.getT = getT;

App.store = new Store();
