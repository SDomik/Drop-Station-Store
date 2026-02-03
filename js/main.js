// Main Logic

// Init Telegram
if (App.tg) {
    App.tg.expand();
    App.tg.enableClosingConfirmation();
}

// --- Logic ---

function filterProducts() {
    const { category, searchQuery } = App.store.state;
    let filtered = App.products;

    if (category !== 'all') {
        if (category === 'favorites') {
            filtered = filtered.filter(p => App.store.isInWishlist(p.id));
        } else {
            filtered = filtered.filter(p => p.category === category);
        }
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.desc.toLowerCase().includes(query)
        );
    }
    return filtered;
}

// --- Event Handlers ---

function handleProductClick(e) {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    const heart = e.target.closest('[data-action="toggle-wishlist"]');
    const card = e.target.closest('[data-action="open-product"]');

    if (btn) {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const product = App.products.find(p => p.id === id);
        if (product) App.store.addToCart(product);
        return;
    }

    if (heart) {
        e.stopPropagation();
        const id = parseInt(heart.dataset.id);
        App.store.toggleWishlist(id);
        return;
    }

    if (card) {
        const id = parseInt(card.dataset.id);
        openModal(id);
    }
}

function handleCartClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id);

    if (action === 'increase-quantity') {
        App.store.changeQuantity(id, 1);
    } else if (action === 'decrease-quantity') {
        App.store.changeQuantity(id, -1);
    }
}

function handleCategoryClick(e) {
    const item = e.target.closest('.category-item');
    if (!item) return;
    App.store.setCategory(item.dataset.category);
}

function handleSearch(e) {
    App.store.setSearchQuery(e.target.value);
}

// --- Modal Logic ---
const modalOverlay = document.getElementById('modalOverlay');
let currentModalProductId = null;

function openModal(id) {
    const product = App.products.find(p => p.id === id);
    if (!product) return;

    currentModalProductId = id;

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalCategory').textContent = App.getCategoryName(product.category);
    document.getElementById('modalDesc').textContent = product.desc;
    document.getElementById('modalPrice').textContent = product.price + ' ₴';

    updateModalButton();

    modalOverlay.classList.add('active');
    App.utils.triggerHaptic('light');
}

function updateModalButton() {
    const btn = document.getElementById('modalBtn');
    if (!btn || !currentModalProductId) return;

    if (App.store.isInCart(currentModalProductId)) {
        btn.textContent = '✓ В корзине';
        btn.style.background = 'var(--success)';
    } else {
        btn.textContent = 'В корзину';
        btn.style.background = 'var(--accent-gradient)';
    }
}

function closeModal(e) {
    if (e) e.stopPropagation();
    modalOverlay.classList.remove('active');
    currentModalProductId = null;
}

function addToCartFromModal() {
    if (currentModalProductId) {
        const product = App.products.find(p => p.id === currentModalProductId);
        App.store.addToCart(product);
    }
}

// --- Navigation & Views ---
function switchView(viewName) {
    const productsView = document.getElementById('productsView');
    const cartView = document.getElementById('cartView');
    const headerSearch = document.getElementById('headerSearch');

    // Update Nav Icons (Both Top & Bottom)
    document.querySelectorAll('.nav-item, .header-action-btn, .logo').forEach(item => {
        if (item.dataset.view === viewName) item.classList.add('active');
        else item.classList.remove('active');
    });

    // Update Views
    productsView.classList.add('hidden');
    cartView.classList.remove('active');
    const profileView = document.getElementById('profileView');
    if (profileView) profileView.style.display = 'none';

    // Show/Hide search based on view
    if (headerSearch) {
        headerSearch.style.display = viewName === 'products' ? 'block' : 'none';
    }

    if (viewName === 'products') {
        productsView.classList.remove('hidden');
    } else if (viewName === 'cart') {
        cartView.classList.add('active');
    } else if (viewName === 'profile') {
        if (profileView) {
            profileView.style.display = 'block';
            renderProfile();
        }
    }

    if (App.tg?.HapticFeedback) App.tg.HapticFeedback.selectionChanged();
}

// --- Checkout ---
function checkout() {
    const { cart } = App.store.state;
    if (cart.length === 0) return;

    const total = App.store.getCartTotal();
    const orderData = {
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
        total: total,
        count: cart.length
    };

    if (App.tg?.sendData) {
        App.tg.sendData(JSON.stringify(orderData));
    } else {
        alert('Заказ:\n' + cart.map(i => `${i.name} - ${i.price}₴`).join('\n') + `\n\nИтого: ${total}₴`);
    }

    App.utils.triggerHaptic('success');
}

// --- Bootstrap ---

// 1. Subscribe UI to State
App.store.subscribe((state) => {
    // Re-render Products
    App.ui.renderProducts(
        filterProducts(),
        (id) => App.store.isInCart(id),
        (id) => App.store.isInWishlist(id)
    );

    // Re-render Cart
    App.ui.renderCart(state.cart);

    // Update Badge
    App.ui.updateCartBadge(state.cart.length);

    // Update Category Chips
    App.ui.updateCategories(state.category);

    // Update Modal Button if open
    updateModalButton();
});

// 2. Attach Global Listeners
document.getElementById('productGrid').addEventListener('click', handleProductClick);
document.getElementById('cartItems').addEventListener('click', handleCartClick);
document.getElementById('categories').addEventListener('click', handleCategoryClick);
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Modal
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.getElementById('modalBtn').addEventListener('click', addToCartFromModal);

// Global Events (Delegation)
document.addEventListener('click', (e) => {
    // 1. Navigation (any element with data-view)
    const navItem = e.target.closest('[data-view]');
    if (navItem) {
        const view = navItem.dataset.view;
        if (view) {
            switchView(view);
        }
    }

    // 2. Hero Buttons
    const heroBtn = e.target.closest('.hero-btn');
    if (heroBtn) {
        const action = heroBtn.dataset.action;
        const productsSection = document.getElementById('productsView');

        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });

            if (action === 'filter-sale') {
                App.store.setCategory('all');
                App.utils.showToast('🔥 Распродажа (Демо)!');
            } else {
                App.store.setCategory('all');
            }
        }
    }
});

// Profile Render
function renderProfile() {
    const user = App.utils.getUser();
    const nameEl = document.getElementById('profileName');
    const userEl = document.getElementById('profileUsername');

    if (user) {
        nameEl.textContent = `${user.first_name} ${user.last_name || ''}`;
        userEl.textContent = user.username ? `@${user.username}` : 'Нет юзернейма';
    } else {
        nameEl.textContent = 'Гость';
        userEl.textContent = 'Telegram WebApp не активен';
    }
}

// 3. Initial Render
App.ui.renderProducts(
    filterProducts(),
    (id) => App.store.isInCart(id),
    (id) => App.store.isInWishlist(id)
);
App.ui.updateCartBadge(0);

