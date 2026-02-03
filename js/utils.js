App.tg = window.Telegram?.WebApp;

App.utils.triggerHaptic = function (type = 'light') {
    if (App.tg?.HapticFeedback) {
        if (type === 'success' || type === 'error' || type === 'warning') {
            App.tg.HapticFeedback.notificationOccurred(type);
        } else {
            App.tg.HapticFeedback.impactOccurred(type);
        }
    }
};

App.utils.showToast = function (message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
};

App.utils.formatPrice = function (price) {
    return `${price} ₴`;
};

App.utils.getUser = function () {
    return App.tg?.initDataUnsafe?.user;
};
