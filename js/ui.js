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
                ${p.badge ? `<span class="card-badge ${p.badge}">♻️ Секонд</span>` : `<span class="card-badge">🆕 Новое</span>`}
            </div>
            <div class="card-content">
                <div class="card-title">${p.name}</div>
                <div class="card-desc">${p.desc}</div>
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
                <p>Корзина пуста</p>
                <p style="font-size: 13px; margin-top: 8px;">Добавьте товары из каталога</p>
            </div>
        `;
        cartTotalContainer.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
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
    if (!cartBadge) return;

    if (count > 0) {
        cartBadge.textContent = count;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
};

App.ui.updateCategories = function (activeCategory) {
    document.querySelectorAll('.chip').forEach(chip => {
        if (chip.dataset.category === activeCategory) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
};
