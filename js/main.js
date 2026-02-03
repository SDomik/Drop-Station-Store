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
        filtered = filtered.filter(p => p.category === category);
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
    const card = e.target.closest('[data-action="open-product"]');

    if (btn) {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const product = App.products.find(p => p.id === id);
        if (product) App.store.addToCart(product);
        return;
    }

    if (card) {
        const id = parseInt(card.dataset.id);
        openModal(id);
    }
}

function handleCartClick(e) {
    const removeBtn = e.target.closest('[data-action="remove-from-cart"]');
    if (removeBtn) {
        const id = parseInt(removeBtn.dataset.id);
        App.store.removeFromCart(id);
    }
}

function handleCategoryClick(e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    App.store.setCategory(chip.dataset.category);
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

    // Update Nav
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.view === viewName) item.classList.add('active');
        else item.classList.remove('active');
    });

    // Update Views
    if (viewName === 'products') {
        productsView.classList.remove('hidden');
        cartView.classList.remove('active');
    } else if (viewName === 'cart') {
        productsView.classList.add('hidden');
        cartView.classList.add('active');
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
    App.ui.renderProducts(filterProducts(), (id) => App.store.isInCart(id));

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

// Navigation
document.querySelectorAll('.nav-item').forEach(nav => {
    nav.addEventListener('click', () => {
        const view = nav.dataset.view;
        if (view) switchView(view);
    });
});

// Profile
const profileBtn = document.querySelector('.nav-item:nth-child(3)');
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        const user = App.utils.getUser();
        if (user) {
            alert(`👤 ${user.first_name} ${user.last_name || ''}\n@${user.username || 'нет username'}`);
        } else {
            App.utils.showToast('👤 Профиль доступен в Telegram');
        }
    });
}

// Checkout
document.querySelector('.checkout-btn').addEventListener('click', checkout);

// 3. Initial Render
App.ui.renderProducts(filterProducts(), (id) => App.store.isInCart(id));
App.ui.updateCartBadge(0);
