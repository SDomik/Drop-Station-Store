// Product Data
App.products = [
    // China - Electronics
    { id: 1, category: "china", price: 299, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop" },
    { id: 2, category: "china", price: 449, img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop" },
    { id: 3, category: "china", price: 349, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop" },
    { id: 4, category: "china", price: 599, img: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300&h=300&fit=crop" },

    // Clothes - Second Hand
    { id: 5, category: "clothes", price: 850, img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300&h=300&fit=crop", badge: "second" },
    { id: 6, category: "clothes", price: 680, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop", badge: "second" },
    { id: 7, category: "clothes", price: 1200, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop", badge: "second" },
    { id: 8, category: "clothes", price: 550, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop", badge: "second" },

    // Electronics
    { id: 9, category: "electronics", price: 499, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
    { id: 10, category: "electronics", price: 1599, img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=300&fit=crop" },

    // Accessories
    { id: 11, category: "accessories", price: 320, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop" },
    { id: 12, category: "accessories", price: 250, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" },
    { id: 13, category: "accessories", price: 280, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop" },
    { id: 14, category: "accessories", price: 190, img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop" },
];

App.getCategoryName = function (cat) {
    return getT(`cat_${cat}`);
}
