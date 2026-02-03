// Helper for lazy DOM
function getEl(id) { return document.getElementById(id); }

App.ui.renderProducts = function (products, isInCartFn, isInWishlistFn) {
    const productGrid = getEl('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(p => {
        const inCart = isInCartFn(p.id);
        const inWishlist = isInWishlistFn ? isInWishlistFn(p.id) : false;
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
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>${getT('cart_empty')}</p>
                <p style="font-size: 13px; margin-top: 8px;">${getT('cart_empty_desc')}</p>
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
    document.querySelectorAll('.category-item').forEach(item => {
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
    if (searchInput) searchInput.placeholder = getT('search_placeholder');

    // Categories
    document.querySelectorAll('.quick-cat').forEach(el => {
        const cat = el.dataset.category;
        if (cat) el.textContent = getT(`cat_${cat}`);
    });
    document.querySelectorAll('.category-box').forEach(el => {
        const cat = el.dataset.category;
        if (cat) {
            const nameEl = el.querySelector('.category-name');
            if (nameEl) nameEl.textContent = getT(`cat_${cat}`);
        }
    });

    // Titles
    const productsTitle = document.querySelector('#productsView .section-title');
    if (productsTitle) productsTitle.textContent = getT('section_products');
    const cartTitle = document.querySelector('#cartView .section-title');
    if (cartTitle) cartTitle.textContent = getT('section_cart');

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

    // Modal
    const modalTitleCatalog = document.querySelector('.catalog-modal .modal-title');
    if (modalTitleCatalog) modalTitleCatalog.textContent = getT('cat_modal_title');

    const modalTitleSearch = document.querySelector('.search-modal .modal-title');
    if (modalTitleSearch) modalTitleSearch.textContent = getT('search_modal_title');

    const searchModalInput = document.getElementById('searchModalInput');
    if (searchModalInput) searchModalInput.placeholder = getT('search_placeholder');

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
};
