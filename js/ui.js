// Helper for lazy DOM
function getEl(id) { return document.getElementById(id); }

// Update single product card without full re-render
App.ui.updateProductCard = function (productId) {
    const card = document.querySelector(`.card-v4-pro-updated[data-id="${productId}"]`);
    if (!card) return;

    const cartItem = App.store.state.cart.find(item => item.id === productId);
    const quantity = cartItem ? cartItem.quantity : 0;
    const inWishlist = App.store.isInWishlist(productId);

    // Update heart button (only class and text, not innerHTML)
    const heartBtn = card.querySelector('[data-action="toggle-wishlist"]');
    if (heartBtn) {
        heartBtn.className = inWishlist ? 'icon-btn-fav active' : 'icon-btn-fav';
        heartBtn.textContent = inWishlist ? '❤️' : '🤍';
    }

    // Update cart controls
    const cartActionContainer = card.querySelector('.cart-action-container');
    const hadQuantityControls = cartActionContainer?.querySelector('.qty-value');
    const currentQty = hadQuantityControls ? parseInt(hadQuantityControls.textContent) : 0;

    // Only update cart controls if quantity changed
    if (currentQty !== quantity) {
        if (quantity > 0) {
            // Show quantity controls
            cartActionContainer.innerHTML = `
                <div class="quantity-controls">
                    <button type="button" class="qty-btn" data-action="decrease-quantity" data-id="${productId}">−</button>
                    <span class="qty-value">${quantity}</span>
                    <button type="button" class="qty-btn" data-action="increase-quantity" data-id="${productId}">+</button>
                </div>
            `;
        } else {
            // Show "Add to cart" button
            cartActionContainer.innerHTML = `
                <button type="button" class="buy-btn" data-action="add-to-cart" data-id="${productId}">
                    ${getT('btn_add_to_cart')}
                </button>
            `;
        }
    }
};

App.ui.renderProducts = function (products, isInCartFn, isInWishlistFn) {
    const productGrid = getEl('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(p => {
        const cartItem = App.store.state.cart.find(item => item.id === p.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        const inWishlist = isInWishlistFn ? isInWishlistFn(p.id) : false;
        const heartClass = inWishlist ? 'icon-btn-fav active' : 'icon-btn-fav';
        const heartText = inWishlist ? '❤️' : '🤍';

        // Badge mapping
        const badgeMap = {
            'hot': { text: getT('badge_hot_text'), color: '#ff4757' },
            'new': { text: getT('badge_new_text'), color: '#00d1b2' },
            'sale': { text: getT('badge_sale_text'), color: '#f39c12' },
            'limited': { text: getT('badge_limited_text'), color: '#54a0ff' },
            'discount': { text: getT('badge_discount_text'), color: '#ff3860' },
            'exclusive': { text: getT('badge_exclusive_text'), color: '#9b59b6' }
        };

        const badgesHtml = Object.entries(p.badges || {}).map(([key, active]) => {
            if (!active) return '';
            const info = badgeMap[key];
            if (!info) return '';
            return `<span class="badge-${key}" style="background: ${info.color};">${info.text}</span>`;
        }).join('');

        const freeDeliveryHtml = p.freeDelivery ? `<span class="badge-free-delivery" style="background: #2ecc71; color: white;">${getT('badge_free_delivery')}</span>` : '';

        const cartActionHtml = quantity > 0 ? `
            <div class="quantity-controls">
                <button class="qty-btn" data-action="decrease-quantity" data-id="${p.id}">−</button>
                <span class="qty-value">${quantity}</span>
                <button class="qty-btn" data-action="increase-quantity" data-id="${p.id}">+</button>
            </div>
        ` : `
            <button class="buy-btn" data-action="add-to-cart" data-id="${p.id}">
                ${getT('btn_add_to_cart')}
            </button>
        `;

        return `
        <div class="card-v4-pro-updated" data-action="open-product" data-id="${p.id}">
            <div class="img-box">
                <div class="badges-all">
                    ${badgesHtml}
                    ${freeDeliveryHtml}
                </div>
                <div class="badges-bottom-left">
                    ${p.rating ? `<span class="a-badge-rating">${p.rating} ⭐</span>` : ''}
                    ${p.isTrend ? `<span class="a-badge-trend">${getT('badge_trend')}</span>` : ''}
                    ${p.isHit ? `<span class="a-badge-hit">${getT('badge_hit')}</span>` : ''}
                </div>
                <img src="${p.img}" alt="${getT(`p${p.id}_name`)}" loading="lazy">
                <div class="top-actions-right">
                    <button class="${heartClass}" data-action="toggle-wishlist" data-id="${p.id}" title="${getT('btn_to_favorites_title')}">${heartText}</button>
                    <button class="icon-btn-qv" title="${getT('btn_quick_view_title')}">👁️</button>
                </div>
            </div>
            <div class="info-panel">
                <div class="card-title">${getT(`p${p.id}_name`)}</div>
                <div class="card-desc">${getT(`p${p.id}_desc`)}</div>
                <div class="price-row-action">
                    <div class="price-container">
                        ${p.oldPrice ? `<span class="old-price">${p.oldPrice} ₴</span>` : ''}
                        <span class="price-action">${p.price} ₴</span>
                    </div>
                    <div class="cart-action-container">
                        ${cartActionHtml}
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
};

App.ui.renderCart = function (cartItems) {
    const cartItemsContainer = getEl('cartItems');
    const cartTotalContainer = getEl('cartTotal');
    const cartCount = getEl('cartCount');
    const cartSum = getEl('cartSum');

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty empty-state">
                <div class="empty-icon cart-empty-icon">🛒</div>
                <div class="empty-title">${getT('cart_empty')}</div>
                <div class="empty-desc">${getT('cart_empty_desc')}</div>
            </div>
        `;
        cartTotalContainer.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${getT(`p${item.id}_name`)}</div>
                <div class="cart-item-price">${(item.price * item.quantity)} ₴</div>
            </div>
            <div class="cart-controls">
                <button class="cart-control-btn" data-action="decrease-quantity" data-id="${item.id}">−</button>
                <span class="cart-quantity">${item.quantity}</span>
                <button class="cart-control-btn" data-action="increase-quantity" data-id="${item.id}">+</button>
            </div>
        </div>
    `).join('');

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartCount.textContent = cartItems.length;
    cartSum.textContent = total + ' ₴';
    cartTotalContainer.style.display = 'block';
};

App.ui.updateCartBadge = function (count) {
    const cartBadge = getEl('cartBadge');
    const headerBadge = getEl('headerCartBadge');

    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (headerBadge) {
        headerBadge.style.display = count > 0 ? 'block' : 'none';
    }
};

App.ui.updateCategories = function (activeCategory) {
    // Only update quick categories if we are on the products view
    const productsView = document.getElementById('productsView');
    if (!productsView.classList.contains('hidden')) {
        document.querySelectorAll('.category-item, .quick-cat').forEach(item => {
            if (item.dataset.category === activeCategory) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    } else {
        // If not on products view, remove active class from all header categories
        document.querySelectorAll('.category-item, .quick-cat').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Update category boxes in catalog modal (always works)
    document.querySelectorAll('.category-box').forEach(item => {
        if (item.dataset.category === activeCategory) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};

App.ui.updateStaticTexts = function () {
    // Logo
    const tagline = document.querySelector('.logo-tagline');
    if (tagline) tagline.textContent = getT('logo_tagline');

    // Catalog Btn
    const catalogBtnText = document.querySelector('#catalogBtn span');
    if (catalogBtnText) catalogBtnText.textContent = getT('catalog_btn');

    // Search
    const searchInput = getEl('searchInput');
    if (searchInput) searchInput.placeholder = getT('search_input_placeholder');

    // Categories
    document.querySelectorAll('.quick-cat').forEach(el => {
        const cat = el.dataset.category;
        if (cat) el.textContent = getT(`cat_${cat}`);
    });
    document.querySelectorAll('.category-box').forEach(el => {
        const cat = el.dataset.category;
        if (cat) {
            const nameEl = el.querySelector('.category-name');
            if (nameEl) {
                // Check if specific name key exists for modals (clean names without emojis)
                const cleanKey = `cat_${cat}_name`;
                // If not (e.g. for dynamic or other cats), fallback to standard
                // But for modal we want clean names
                // Actually simplified logic: prioritize _name key if view is modal (class check?)
                // Just use _name key if available
                if (el.closest('.catalog-modal')) {
                    if (cat === 'all') nameEl.textContent = getT('cat_all_items');
                    else nameEl.textContent = getT(cleanKey) || getT(`cat_${cat}`);
                } else {
                    nameEl.textContent = getT(`cat_${cat}`);
                }
            }
        }
    });

    // Explicit Modal Categories Update (Redundant but safe)
    const catAllItems = document.querySelector('.category-box[data-category="all"] .category-name');
    if (catAllItems) catAllItems.textContent = getT('cat_all_items');

    const catChina = document.querySelector('.category-box[data-category="china"] .category-name');
    if (catChina) catChina.textContent = getT('cat_china_name');

    const catClothes = document.querySelector('.category-box[data-category="clothes"] .category-name');
    if (catClothes) catClothes.textContent = getT('cat_clothes_name');

    const catElectronics = document.querySelector('.category-box[data-category="electronics"] .category-name');
    if (catElectronics) catElectronics.textContent = getT('cat_electronics_name');

    const catAccessories = document.querySelector('.category-box[data-category="accessories"] .category-name');
    if (catAccessories) catAccessories.textContent = getT('cat_accessories_name');

    const catFavorites = document.querySelector('.category-box[data-view="favorites"] .category-name');
    if (catFavorites) catFavorites.textContent = getT('cat_favorites_name');


    // Titles
    const productsTitle = document.querySelector('#productsView .section-title');
    if (productsTitle) productsTitle.textContent = getT('section_products');
    const cartTitle = document.querySelector('#cartView .section-title');
    if (cartTitle) cartTitle.textContent = getT('section_cart');
    const favoritesTitle = document.querySelector('#favoritesView .section-title');
    if (favoritesTitle) favoritesTitle.textContent = getT('section_favorites');

    // In Profile
    const settingsTitle = document.querySelectorAll('.profile-view .section-title')[0];
    if (settingsTitle) settingsTitle.textContent = getT('section_settings');
    const ordersTitle = document.querySelectorAll('.profile-view .section-title')[1];
    if (ordersTitle) ordersTitle.textContent = getT('section_orders');

    // Labels in profile
    const profileLabels = document.querySelectorAll('.profile-menu .menu-label');
    if (profileLabels[0]) profileLabels[0].textContent = getT('profile_lang');
    if (profileLabels[1]) profileLabels[1].textContent = getT('profile_theme');

    const themeValue = document.querySelectorAll('.profile-menu .menu-value')[1];
    if (themeValue) themeValue.textContent = getT('profile_theme_dark');

    const emptyOrders = document.querySelector('.profile-empty-orders');
    if (emptyOrders) emptyOrders.textContent = getT('profile_orders_empty');

    // Cart Total Labels
    const cartCountLabel = document.querySelector('.cart-total-label');
    if (cartCountLabel) cartCountLabel.textContent = getT('cart_items_count');
    const cartSumLabel = document.querySelectorAll('.cart-total-label')[1];
    if (cartSumLabel) cartSumLabel.textContent = getT('cart_total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.textContent = getT('checkout_btn');

    // Bottom Nav
    document.querySelectorAll('.nav-item').forEach(el => {
        const view = el.dataset.view;
        const labelEl = el.querySelector('.nav-label');
        if (view && labelEl) labelEl.textContent = getT(`nav_${view === 'products' ? 'home' : view}`);
    });

    // Modal Titles
    const modalTitleCatalog = document.querySelector('.catalog-modal .modal-title');
    if (modalTitleCatalog) modalTitleCatalog.textContent = getT('cat_modal_title');

    const modalTitleSearch = document.querySelector('.search-modal .modal-title');
    if (modalTitleSearch) modalTitleSearch.textContent = getT('search_modal_title');

    const searchModalInput = document.getElementById('searchModalInput');
    if (searchModalInput) searchModalInput.placeholder = getT('search_input_placeholder');

    const mobileSearchTitle = document.querySelector('.mobile-search-bar .modal-title');
    if (mobileSearchTitle) mobileSearchTitle.textContent = getT('search_title');

    // Hero Section
    const hero1 = document.querySelector('.hero-card.primary');
    if (hero1) {
        hero1.querySelector('.hero-title').innerHTML = getT('hero_new_title');
        hero1.querySelector('.hero-subtitle').textContent = getT('hero_new_sub');
        hero1.querySelector('.hero-btn').textContent = getT('hero_check_btn');
    }
    const hero2 = document.querySelector('.hero-card.secondary');
    if (hero2) {
        hero2.querySelector('.hero-title').innerHTML = getT('hero_sale_title');
        hero2.querySelector('.hero-subtitle').textContent = getT('hero_sale_sub');
        hero2.querySelector('.hero-btn').textContent = getT('hero_go_btn');
    }

    // App Title & Logo
    document.title = getT('app_title');
    const logoName = document.querySelector('.logo-name');
    if (logoName) logoName.textContent = getT('logo_name');
};
