// Product Data
App.products = [
    // China - Electronics
    { id: 1, name: "TWS Наушники i12", category: "china", desc: "Беспроводные наушники Apple-style, Bluetooth 5.0, сенсорное управление", price: 299, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop" },
    { id: 2, name: "PowerBank 20000mAh", category: "china", desc: "Портативная зарядка с быстрой зарядкой QC3.0, 2 USB порта", price: 449, img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop" },
    { id: 3, name: "LED Кольцо для селфи", category: "china", desc: "Кольцевая лампа 26см с держателем для телефона, 3 режима света", price: 349, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop" },
    { id: 4, name: "USB-C Хаб 7в1", category: "china", desc: "Адаптер для MacBook: HDMI, USB 3.0, SD карта, зарядка", price: 599, img: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300&h=300&fit=crop" },

    // Clothes - Second Hand
    { id: 5, name: "Vintage Джинсовка", category: "clothes", desc: "Оверсайз куртка Levi's 90х, отличное состояние, размер M-L", price: 850, img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300&h=300&fit=crop", badge: "second" },
    { id: 6, name: "Худи Champion", category: "clothes", desc: "Оригинальное худи, теплое с начесом, размер L", price: 680, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", badge: "second" },
    { id: 7, name: "Кроссовки Nike AF1", category: "clothes", desc: "Air Force 1 Low, белые, состояние 8/10, размер 42", price: 1200, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop", badge: "second" },
    { id: 8, name: "Карго штаны", category: "clothes", desc: "Широкие карго в стиле Y2K, много карманов, размер M", price: 550, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", badge: "second" },

    // Electronics
    { id: 9, name: "Смарт-часы M8", category: "electronics", desc: "Фитнес браслет с большим экраном, пульс, шаги, уведомления", price: 499, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
    { id: 10, name: "Мини проектор", category: "electronics", desc: "LED проектор для дома, поддержка 1080p, HDMI вход", price: 1599, img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=300&fit=crop" },

    // Accessories
    { id: 11, name: "Сумка через плечо", category: "accessories", desc: "Компактная crossbody сумка, нейлон, много отделений", price: 320, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop" },
    { id: 12, name: "Солнцезащитные очки", category: "accessories", desc: "Ретро стиль, UV400 защита, металлическая оправа", price: 250, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" },
    { id: 13, name: "Кепка NY Yankees", category: "accessories", desc: "Бейсболка черная, регулируемый размер, вышивка", price: 280, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop" },
    { id: 14, name: "Цепочка серебро", category: "accessories", desc: "Цепочка-веревка 50см, покрытие под серебро", price: 190, img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop" },
];

App.getCategoryName = function (cat) {
    const names = {
        china: '🇨🇳 Китайские товары',
        clothes: '👕 Одежда секонд',
        electronics: '📱 Электроника',
        accessories: '💎 Аксессуары'
    };
    return names[cat] || cat;
}
