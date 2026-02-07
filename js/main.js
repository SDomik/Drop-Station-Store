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
    // Prevent default behavior for buttons
    if (e.target.closest('button')) {
        e.preventDefault();
    }
    
    const btn = e.target.closest('[data-action="add-to-cart"]');
    const incBtn = e.target.closest('[data-action="increase-quantity"]');
    const decBtn = e.target.closest('[data-action="decrease-quantity"]');
    const heart = e.target.closest('[data-action="toggle-wishlist"]');
    const card = e.target.closest('[data-action="open-product"]');

    if (btn) {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const product = App.products.find(p => p.id === id);
        if (product) App.store.addToCart(product);
        return;
    }

    if (incBtn) {
        e.stopPropagation();
        const id = parseInt(incBtn.dataset.id);
        App.store.changeQuantity(id, 1);
        return;
    }

    if (decBtn) {
        e.stopPropagation();
        const id = parseInt(decBtn.dataset.id);
        App.store.changeQuantity(id, -1);
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

function expandSearch() {
    // Check if mobile (screen width < 645px)
    if (window.innerWidth < 645) {
        const mobileSearchBar = document.getElementById('mobileSearchBar');
        if (mobileSearchBar && mobileSearchBar.classList.contains('active')) {
            closeSearchModal();
        } else {
            // Close catalog if it's open
            const catalogOverlay = document.getElementById('catalogOverlay');
            if (catalogOverlay) catalogOverlay.classList.remove('active');

            openSearchModal();
        }
        return;
    }

    // Desktop behavior - expand in header
    const wrapper = document.getElementById('headerSearch');
    const input = document.getElementById('searchInput');

    if (wrapper) {
        const isExpanded = wrapper.classList.contains('expanded');
        if (isExpanded) {
            if (!input || !input.value) {
                collapseSearch();
            }
        } else {
            wrapper.classList.add('expanded');
            if (input) {
                input.focus();
            }
        }
    }
}

function collapseSearch() {
    const wrapper = document.getElementById('headerSearch');
    const input = document.getElementById('searchInput');
    const headerRow = document.querySelector('.header-main-row');

    if (wrapper && (!input || !input.value)) {
        wrapper.classList.remove('expanded');
        if (headerRow) headerRow.classList.remove('search-mode');
    }
}

function clearSearch(e) {
    if (e) e.stopPropagation();
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = '';
        const clearBtn = document.getElementById('clearSearch');
        if (clearBtn) clearBtn.style.display = 'none';
        App.store.setSearchQuery('');
        input.focus();
    }
}

// --- Mobile Drop-down Search Logic ---
function openSearchModal() {
    const mobileSearchBar = document.getElementById('mobileSearchBar');
    const searchModalInput = document.getElementById('searchModalInput');

    if (mobileSearchBar) {
        mobileSearchBar.classList.add('active');
        // document.body.style.overflow = 'hidden'; // Keep scrolling for drop-down or disable? Let's keep it for now.

        // Focus input after animation
        setTimeout(() => {
            if (searchModalInput) searchModalInput.focus();
        }, 400);

        App.utils.triggerHaptic('light');
    }
}

function closeSearchModal() {
    const mobileSearchBar = document.getElementById('mobileSearchBar');
    const searchModalInput = document.getElementById('searchModalInput');

    if (mobileSearchBar) {
        mobileSearchBar.classList.remove('active');
        // document.body.style.overflow = '';

        // Clear search if empty
        if (searchModalInput && !searchModalInput.value) {
            App.store.setSearchQuery('');
        }
    }
}

function handleSearchModalInput(e) {
    const query = e.target.value;
    App.store.setSearchQuery(query);

    // Update clear button visibility
    const clearBtn = document.getElementById('searchModalClear');
    if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'flex' : 'none';
    }

    // If typing and not on products view, switch back to products (matching desktop behavior)
    const productsView = document.getElementById('productsView');
    if (productsView && productsView.classList.contains('hidden') && query.length > 0) {
        switchView('products');
    }
}

function clearSearchModal() {
    const input = document.getElementById('searchModalInput');
    if (input) {
        input.value = '';
        const clearBtn = document.getElementById('searchModalClear');
        if (clearBtn) clearBtn.style.display = 'none';
        App.store.setSearchQuery('');
    }
}

function renderSearchResults(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (!query || query.trim() === '') {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <div class="search-empty-icon">🔍</div>
                <p>Начните вводить название товара</p>
            </div>
        `;
        return;
    }

    // Filter products
    const filtered = App.products.filter(p => {
        const name = getT(`p${p.id}_name`).toLowerCase();
        const desc = getT(`p${p.id}_desc`).toLowerCase();
        return name.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());
    });

    if (filtered.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <div class="search-empty-icon">😔</div>
                <p>Ничего не найдено</p>
            </div>
        `;
        return;
    }

    // Render product cards
    const isInCart = (id) => App.store.state.cart.some(item => item.id === id);
    const isInWishlist = (id) => App.store.state.wishlist.includes(id);

    resultsContainer.innerHTML = `
        <div class="product-grid" style="padding: 0;">
            ${filtered.map(p => {
        const inCart = isInCart(p.id);
        const inWishlist = isInWishlist(p.id);
        const btnClass = inCart ? 'card-btn added' : 'card-btn';
        const btnText = inCart ? '✓' : '+';
        const heartClass = inWishlist ? 'card-heart active' : 'card-heart';
        const heartText = inWishlist ? '❤️' : '🤍';

        return `
                    <div class="card" data-action="open-product" data-id="${p.id}">
                        <button class="${heartClass}" data-action="toggle-wishlist" data-id="${p.id}">${heartText}</button>
                        <div class="card-img-wrapper">
                            <img src="${p.img}" class="card-img" alt="${p.name}" loading="lazy">
                            ${p.badge ? `<span class="card-badge ${p.badge}">${getT('badge_second')}</span>` : `<span class="card-badge">${getT('badge_new')}</span>`}
                        </div>
                        <div class="card-content">
                            <div class="card-title">${getT(`p${p.id}_name`)}</div>
                            <div class="card-desc">${getT(`p${p.id}_desc`)}</div>
                            <div class="card-footer">
                                <span class="card-price">${p.price} ₴</span>
                                <button class="${btnClass}" data-action="add-to-cart" data-id="${p.id}">
                                    ${btnText}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
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
        closeSearchModal(); // Optional: close if needed when clicking Home, or keep open? 
        // User said "if open... he should hide". So let's close both.
        if (catalogOverlay) catalogOverlay.classList.remove('active');
    } else if (viewName === 'cart') {
        cartView.classList.remove('hidden');
        App.ui.renderCart(App.store.state.cart);
        closeSearchModal();
        if (catalogOverlay) catalogOverlay.classList.remove('active');
    } else if (viewName === 'profile') {
        if (profileView) {
            profileView.classList.remove('hidden');
            renderProfile();
            closeSearchModal();
            if (catalogOverlay) catalogOverlay.classList.remove('active');
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
App.store.subscribe((state, prevState) => {
    // Check if category or searchQuery changed → full re-render
    const categoryChanged = prevState && (prevState.category !== state.category);
    const searchChanged = prevState && (prevState.searchQuery !== state.searchQuery);
    
    if (categoryChanged || searchChanged) {
        // Full re-render only when filtering changes
        App.ui.renderProducts(
            filterProducts(),
            (id) => App.store.isInCart(id),
            (id) => App.store.isInWishlist(id)
        );
    } else {
        // Only update affected cards when cart/wishlist changes
        // Find products that need update
        const cartChanged = prevState && JSON.stringify(prevState.cart) !== JSON.stringify(state.cart);
        const wishlistChanged = prevState && JSON.stringify(prevState.wishlist) !== JSON.stringify(state.wishlist);
        
        if (cartChanged || wishlistChanged) {
            // Get all unique product IDs from BOTH prev and current state
            // This ensures removed items are also updated
            const prevCartIds = prevState ? prevState.cart.map(item => item.id) : [];
            const currCartIds = state.cart.map(item => item.id);
            const wishlistIds = state.wishlist;
            
            const affectedIds = new Set([
                ...prevCartIds,
                ...currCartIds,
                ...wishlistIds
            ]);
            
            affectedIds.forEach(id => {
                App.ui.updateProductCard(id);
            });
        }
    }

    // Re-render Cart
    App.ui.renderCart(state.cart);

    // Update Badge
    App.ui.updateCartBadge(state.cart.length);

    // Update Category Chips
    App.ui.updateCategories(state.category);

    // Clear search inputs if searchQuery is empty (e.g. when category changes)
    if (state.searchQuery === '') {
        const sInput = document.getElementById('searchInput');
        const smInput = document.getElementById('searchModalInput');
        if (sInput && sInput.value !== '') sInput.value = '';
        if (smInput && smInput.value !== '') smInput.value = '';

        const clearBtn = document.getElementById('clearSearch');
        if (clearBtn) clearBtn.style.display = 'none';

        const smClearBtn = document.getElementById('searchModalClear');
        if (smClearBtn) smClearBtn.style.display = 'none';
    }

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
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('blur', collapseSearch);
}

const headerSearch = document.getElementById('headerSearch');
if (headerSearch) {
    headerSearch.addEventListener('click', (e) => {
        if (e.target.closest('.search-container-glass')) {
            expandSearch();
        }
    });
}

const clearSearchBtn = document.getElementById('clearSearch');
if (clearSearchBtn) clearSearchBtn.addEventListener('click', clearSearch);

// Catalog Modal Logic
const catalogOverlay = document.getElementById('catalogOverlay');

document.getElementById('catalogBtn').addEventListener('click', () => {
    const isActive = catalogOverlay.classList.contains('active');
    if (isActive) {
        catalogOverlay.classList.remove('active');
    } else {
        // Close search if it's open (especially on mobile)
        closeSearchModal();

        // Also collapse desktop search if empty
        const desktopInput = document.getElementById('searchInput');
        if (desktopInput && !desktopInput.value) {
            collapseSearch();
        }

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

        // Scroll to products
        const productsSection = document.getElementById('productsView');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Search Modal Logic
const searchOverlay = document.getElementById('searchOverlay');
const searchModalInput = document.getElementById('searchModalInput');
const searchModalClear = document.getElementById('searchModalClear');

if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearchModal();
    });
}

if (searchModalInput) {
    searchModalInput.addEventListener('input', handleSearchModalInput);
}

if (searchModalClear) {
    searchModalClear.addEventListener('click', clearSearchModal);
}

// Handle clicks on products in mobile search results
const mobileSearchBar = document.getElementById('mobileSearchBar');
if (mobileSearchBar) {
    mobileSearchBar.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card && card.dataset.action === 'open-product') {
            const id = parseInt(card.dataset.id);
            closeSearchModal();
            openModal(id);
        }

        // Handle add to cart in search results
        const addBtn = e.target.closest('[data-action="add-to-cart"]');
        if (addBtn) {
            e.stopPropagation();
            const id = parseInt(addBtn.dataset.id);
            const product = App.products.find(p => p.id === id);
            if (product) App.store.addToCart(product);
            App.utils.triggerHaptic('medium');
            App.utils.showToast(getT('toast_added'));
        }

        // Handle wishlist toggle in search results
        const wishlistBtn = e.target.closest('[data-action="toggle-wishlist"]');
        if (wishlistBtn) {
            e.stopPropagation();
            const id = parseInt(wishlistBtn.dataset.id);
            App.store.toggleWishlist(id);
            App.utils.triggerHaptic('light');
            // Re-render search results to update heart icon
            const query = searchModalInput ? searchModalInput.value : '';
            renderSearchResults(query);
        }
    });
}

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
