// Product Data
App.products = [
    // China - Electronics
    { 
        id: 1, 
        category: "china", 
        price: 299, 
        oldPrice: 450,
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
        badges: { hot: true, new: true, sale: true, limited: true, discount: true, exclusive: true },
        freeDelivery: true,
        rating: "4.8",
        isTrend: true,
        isHit: true,
    },
    { 
        id: 2, 
        category: "china", 
        price: 449, 
        img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
        badges: { hot: false, new: false, sale: true, limited: false, discount: false, exclusive: false },
        freeDelivery: false,
        rating: "4.5",
        isTrend: false,
        isHit: true
    },
    { 
        id: 3, 
        category: "china", 
        price: 349, 
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
        badges: { hot: false, new: false, sale: false, limited: true, discount: false, exclusive: false },
        freeDelivery: true,
        rating: "4.9",
        isTrend: true,
        isHit: true
    },
    { 
        id: 4, 
        category: "china", 
        price: 599, 
        oldPrice: 800,
        img: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=600&q=80",
        badges: { hot: false, new: false, sale: false, limited: false, discount: true, exclusive: false },
        freeDelivery: false,
        rating: "4.7",
        isTrend: false,
        isHit: false
    },

    // Clothes - Second Hand
    { 
        id: 5, 
        category: "clothes", 
        price: 850, 
        img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
        badges: { hot: false, new: false, sale: true, limited: false, discount: false, exclusive: true },
        freeDelivery: true,
        rating: "4.6",
        isTrend: true,
        isHit: false
    },
    { 
        id: 6, 
        category: "clothes", 
        price: 680, 
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
        badges: { hot: false, new: true, sale: false, limited: false, discount: false, exclusive: false },
        freeDelivery: false,
        rating: "4.4",
        isTrend: false,
        isHit: true
    },
    { 
        id: 7, 
        category: "clothes", 
        price: 1200, 
        oldPrice: 1500,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
        badges: { hot: true, new: false, sale: false, limited: true, discount: false, exclusive: false },
        freeDelivery: true,
        rating: "5.0",
        isTrend: true,
        isHit: true
    },
    { 
        id: 8, 
        category: "clothes", 
        price: 550, 
        img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
        badges: { hot: false, new: false, sale: true, limited: false, discount: false, exclusive: false },
        freeDelivery: false,
        rating: "4.3",
        isTrend: false,
        isHit: false
    },

    // Electronics
    { 
        id: 9, 
        category: "electronics", 
        price: 499, 
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        badges: { hot: true, new: true, sale: false, limited: false, discount: false, exclusive: false },
        freeDelivery: true,
        rating: "4.9",
        isTrend: true,
        isHit: true
    },
    { 
        id: 10, 
        category: "electronics", 
        price: 1599, 
        oldPrice: 2100,
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
        badges: { hot: false, new: false, sale: false, limited: false, discount: false, exclusive: true },
        freeDelivery: false,
        rating: "4.8",
        isTrend: false,
        isHit: true
    },

    // Accessories
    { 
        id: 11, 
        category: "accessories", 
        price: 320, 
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
        badges: { hot: false, new: false, sale: true, limited: false, discount: false, exclusive: false },
        freeDelivery: true,
        rating: "4.7",
        isTrend: true,
        isHit: false
    },
    { 
        id: 12, 
        category: "accessories", 
        price: 250, 
        img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
        badges: { hot: false, new: true, sale: false, limited: false, discount: false, exclusive: false },
        freeDelivery: false,
        rating: "4.5",
        isTrend: false,
        isHit: false
    },
    { 
        id: 13, 
        category: "accessories", 
        price: 280, 
        img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
        badges: { hot: false, new: false, sale: false, limited: true, discount: false, exclusive: false },
        freeDelivery: true,
        rating: "4.6",
        isTrend: true,
        isHit: true
    },
    { 
        id: 14, 
        category: "accessories", 
        price: 190, 
        img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
        badges: { hot: false, new: false, sale: false, limited: false, discount: true, exclusive: false },
        freeDelivery: false,
        rating: "4.4",
        isTrend: false,
        isHit: false
    },
];

App.getCategoryName = function (cat) {
    return getT(`cat_${cat}`);
}
