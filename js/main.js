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
        filtered = filtered.filter(p => {
            const name = getT(`p${p.id}_name`).toLowerCase();
            const desc = getT(`p${p.id}_desc`).toLowerCase();
            return name.includes(query) || desc.includes(query);
        });
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
    const query = e.target.value;
    App.store.setSearchQuery(query);

    // Update clear button visibility
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.style.display = query.length > 0 ? 'flex' : 'none';
    }

    // If typing (or clearing) and not on products view, switch back to products
    const productsView = document.getElementById('productsView');
    if (productsView && productsView.classList.contains('hidden')) {
        switchView('products');
    }
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = '';
        const clearBtn = document.getElementById('clearSearch');
        if (clearBtn) clearBtn.style.display = 'none';
        App.store.setSearchQuery('');
        input.focus();
    }
}

// --- Modal Logic ---
const modalOverlay = document.getElementById('modalOverlay');
let currentModalProductId = null;

function openModal(id) {
    const product = App.products.find(p => p.id === id);
    if (!product) return;

    currentModalProductId = id;

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalTitle').textContent = getT(`p${product.id}_name`);
    document.getElementById('modalCategory').textContent = App.getCategoryName(product.category);
    document.getElementById('modalDesc').textContent = getT(`p${product.id}_desc`);
    document.getElementById('modalPrice').textContent = product.price + ' ₴';

    updateModalButton();

    modalOverlay.classList.add('active');
    App.utils.triggerHaptic('light');
}

function updateModalButton() {
    const btn = document.getElementById('modalBtn');
    if (!btn || !currentModalProductId) return;

    if (App.store.isInCart(currentModalProductId)) {
        btn.textContent = getT('modal_in_cart');
        btn.style.background = 'var(--success)';
    } else {
        btn.textContent = getT('modal_to_cart');
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
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Specific logic for catalog button and search
    const catalogBtn = document.getElementById('catalogBtn');
    if (viewName === 'products') {
        if (App.store.state.category !== 'all') {
            catalogBtn?.classList.add('active');
        }
    } else {
        catalogBtn?.classList.remove('active');
    }

    // Update Views
    productsView.classList.add('hidden');
    cartView.classList.add('hidden');
    const profileView = document.getElementById('profileView');
    if (profileView) profileView.classList.add('hidden');

    // Search bar is now ALWAYS visible
    if (headerSearch) {
        headerSearch.style.display = 'block';
    }

    if (viewName === 'products') {
        productsView.classList.remove('hidden');
    } else if (viewName === 'cart') {
        cartView.classList.remove('hidden');
        App.ui.renderCart(App.store.state.cart); // Re-render cart when switching to it
    } else if (viewName === 'profile') {
        if (profileView) {
            profileView.classList.remove('hidden');
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
        const lang = App.store.state.lang;
        const totalStr = lang === 'en' ? 'Total' : (lang === 'ua' ? 'Разом' : 'Итого');
        alert(`${getT('section_orders')}:\n` + cart.map(i => `${i.name} - ${i.price}₴`).join('\n') + `\n\n${totalStr}: ${total}₴`);
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

    // Update Static Texts (Localization)
    App.ui.updateStaticTexts();

    // Re-render Profile if it's visible
    const profileView = document.getElementById('profileView');
    if (profileView && !profileView.classList.contains('hidden')) {
        renderProfile();
    }
});

// 2. Attach Global Listeners
const productGrid = document.getElementById('productGrid');
if (productGrid) productGrid.addEventListener('click', handleProductClick);

const cartItems = document.getElementById('cartItems');
if (cartItems) cartItems.addEventListener('click', handleCartClick);

const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('input', handleSearch);

const clearSearchBtn = document.getElementById('clearSearch');
if (clearSearchBtn) clearSearchBtn.addEventListener('click', clearSearch);

// Catalog Modal Logic
const catalogOverlay = document.getElementById('catalogOverlay');

document.getElementById('catalogBtn').addEventListener('click', () => {
    const isActive = catalogOverlay.classList.contains('active');
    if (isActive) {
        catalogOverlay.classList.remove('active');
    } else {
        catalogOverlay.classList.add('active');
    }
    App.utils.triggerHaptic('light');
});

catalogOverlay.addEventListener('click', (e) => {
    if (e.target === catalogOverlay) catalogOverlay.classList.remove('active');
});

// Category Click in Catalog Modal (Delegation)
catalogOverlay.addEventListener('click', (e) => {
    const box = e.target.closest('.category-box');
    if (box) {
        const cat = box.dataset.category;

        // Always switch to products view when a category is selected
        switchView('products');

        App.store.setCategory(cat);
        catalogOverlay.classList.remove('active');

        // Visual feedback
        document.querySelectorAll('.category-box').forEach(b => b.classList.toggle('active', b === box));

        // Scroll to products
        const productsSection = document.getElementById('productsView');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Modal (Product)
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
        return;
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
                App.utils.showToast(getT('toast_added')); // Demo toast
            } else {
                App.store.setCategory('all');
            }
        }
        return;
    }

    // 3. Quick Category Links (Header)
    const quickCat = e.target.closest('.quick-cat');
    if (quickCat) {
        e.preventDefault();
        const category = quickCat.dataset.category;
        if (category) {
            // Update active state
            document.querySelectorAll('.quick-cat').forEach(c => c.classList.remove('active'));
            quickCat.classList.add('active');

            // Switch to products view and set category
            switchView('products');
            App.store.setCategory(category);

            // Scroll to products
            const productsSection = document.getElementById('productsView');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        return;
    }

    // 4. Localization Toggle (Profile)
    const langItem = e.target.closest('.profile-menu-item');
    if (langItem) {
        const labelEl = langItem.querySelector('.menu-label');
        if (labelEl) {
            const labelText = labelEl.textContent;
            // Check if it's the language selection item
            if (labelText === getT('profile_lang') || labelText === 'Язык' || labelText === 'Мова' || labelText === 'Language') {
                const langs = ['ru', 'ua', 'en'];
                const currentIdx = langs.indexOf(App.store.state.lang);
                const nextLang = langs[(currentIdx + 1) % langs.length];
                App.store.setLanguage(nextLang);
                App.utils.triggerHaptic('medium');
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
        userEl.textContent = user.username ? `@${user.username}` : getT('profile_no_username');
    } else {
        nameEl.textContent = getT('profile_guest');
        userEl.textContent = 'Telegram WebApp Offline';
    }

    // Update language value in menu
    const langValue = document.querySelector('.profile-menu .menu-value');
    if (langValue) {
        const langNames = { ua: 'Українська', ru: 'Русский', en: 'English' };
        langValue.textContent = langNames[App.store.state.lang] || '...';
    }
}

// 3. Initial Render
App.ui.renderProducts(
    filterProducts(),
    (id) => App.store.isInCart(id),
    (id) => App.store.isInWishlist(id)
);
App.ui.renderCart(App.store.state.cart); // Render cart initially
App.ui.updateCartBadge(App.store.state.cart.length); // Correct badge count
App.ui.updateStaticTexts(); // Apply translations on load
