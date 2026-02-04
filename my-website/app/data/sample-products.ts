import { LegacyProduct, CategoryInfo } from '@/app/types';

export const categories: CategoryInfo[] = [
    {
        id: 'fish-seafood',
        name: 'Fish & Seafood',
        description: 'Fresh catch from the ocean, sustainably sourced',
        icon: '🐟',
    },
    {
        id: 'poultry',
        name: 'Poultry',
        description: 'Free-range chicken and farm-fresh eggs',
        icon: '🍗',
    },
    {
        id: 'mutton',
        name: 'Mutton',
        description: 'Premium goat meat, tender and flavorful',
        icon: '🥩',
    },
    {
        id: 'ready-to-cook',
        name: 'Ready to Cook',
        description: 'Marinated and pre-prepared for convenience',
        icon: '🍳',
    },
    {
        id: 'vegetarian',
        name: 'Vegetarian',
        description: 'Fresh vegetables and plant-based options',
        icon: '🥬',
    },
];

export const sampleProducts: LegacyProduct[] = [
    // Fish & Seafood
    {
        id: 'prod-001',
        name: 'Fresh Salmon Fillet',
        description: 'Premium Atlantic salmon, rich in omega-3. Perfect for grilling, baking, or pan-searing.',
        price: 899,
        originalPrice: 1099,
        category: 'fish-seafood',
        image: '/images/products/salmon.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
        isBestseller: true,
    },
    {
        id: 'prod-002',
        name: 'Tiger Prawns',
        description: 'Jumbo tiger prawns, cleaned and deveined. Sweet, succulent, and ready to cook.',
        price: 749,
        category: 'fish-seafood',
        image: '/images/products/prawns.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
        isNew: true,
    },
    {
        id: 'prod-003',
        name: 'Surmai (King Fish) Steaks',
        description: 'Fresh Surmai steaks, firm and flavorful. A favorite for curries and fry preparations.',
        price: 649,
        category: 'fish-seafood',
        image: '/images/products/surmai.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-004',
        name: 'Pomfret Whole',
        description: 'Whole silver pomfret, cleaned and ready. Delicate flavor perfect for steaming or frying.',
        price: 799,
        category: 'fish-seafood',
        image: '/images/products/pomfret.jpg',
        weight: '400',
        unit: 'g',
        inStock: true,
    },

    // Poultry
    {
        id: 'prod-005',
        name: 'Free-Range Whole Chicken',
        description: 'Farm-fresh free-range chicken, hormone-free. Tender meat with rich, natural flavor.',
        price: 449,
        category: 'poultry',
        image: '/images/products/whole-chicken.jpg',
        weight: '1',
        unit: 'kg',
        inStock: true,
        isBestseller: true,
    },
    {
        id: 'prod-006',
        name: 'Chicken Breast Boneless',
        description: 'Lean, protein-rich chicken breast. Ideal for healthy meals and grilling.',
        price: 349,
        category: 'poultry',
        image: '/images/products/chicken-breast.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-007',
        name: 'Chicken Drumsticks',
        description: 'Juicy chicken drumsticks, perfect for BBQ, curries, or baking.',
        price: 279,
        category: 'poultry',
        image: '/images/products/drumsticks.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-008',
        name: 'Chicken Wings',
        description: 'Party-ready chicken wings. Great for frying, grilling, or tossing in sauce.',
        price: 249,
        category: 'poultry',
        image: '/images/products/wings.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
    },

    // Mutton
    {
        id: 'prod-009',
        name: 'Goat Curry Cut',
        description: 'Premium goat meat cut for curries. Bone-in pieces for rich, flavorful gravies.',
        price: 699,
        category: 'mutton',
        image: '/images/products/mutton-curry.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
        isBestseller: true,
    },
    {
        id: 'prod-010',
        name: 'Mutton Keema',
        description: 'Freshly minced goat meat. Perfect for kebabs, keema pav, or stuffed parathas.',
        price: 649,
        category: 'mutton',
        image: '/images/products/keema.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-011',
        name: 'Mutton Leg Boneless',
        description: 'Tender boneless leg of goat. Ideal for slow-cooking and special occasions.',
        price: 899,
        originalPrice: 999,
        category: 'mutton',
        image: '/images/products/mutton-leg.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-012',
        name: 'Lamb Chops',
        description: 'Premium lamb chops, French-trimmed. Restaurant-quality for home cooking.',
        price: 999,
        category: 'mutton',
        image: '/images/products/lamb-chops.jpg',
        weight: '400',
        unit: 'g',
        inStock: false,
    },

    // Ready to Cook
    {
        id: 'prod-013',
        name: 'Tandoori Chicken',
        description: 'Marinated in authentic tandoori spices. Just grill or oven-bake for 20 minutes.',
        price: 399,
        category: 'ready-to-cook',
        image: '/images/products/tandoori.jpg',
        weight: '500',
        unit: 'g',
        inStock: true,
        isBestseller: true,
    },
    {
        id: 'prod-014',
        name: 'Butter Garlic Prawns',
        description: 'Prawns marinated in butter garlic sauce. Ready in 10 minutes.',
        price: 549,
        category: 'ready-to-cook',
        image: '/images/products/butter-prawns.jpg',
        weight: '300',
        unit: 'g',
        inStock: true,
        isNew: true,
    },
    {
        id: 'prod-015',
        name: 'Chicken Seekh Kebab',
        description: 'Traditional seekh kebabs, ready to grill. 8 pieces per pack.',
        price: 349,
        category: 'ready-to-cook',
        image: '/images/products/seekh-kebab.jpg',
        weight: '400',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-016',
        name: 'Fish Fingers',
        description: 'Crispy breaded fish fingers. Kid-friendly and ready in 15 minutes.',
        price: 299,
        category: 'ready-to-cook',
        image: '/images/products/fish-fingers.jpg',
        weight: '300',
        unit: 'g',
        inStock: true,
    },

    // Vegetarian
    {
        id: 'prod-017',
        name: 'Paneer Fresh',
        description: 'Soft, fresh cottage cheese made from pure milk. Perfect for curries and grills.',
        price: 199,
        category: 'vegetarian',
        image: '/images/products/paneer.jpg',
        weight: '250',
        unit: 'g',
        inStock: true,
    },
    {
        id: 'prod-018',
        name: 'Mushroom Mix',
        description: 'Assorted fresh mushrooms - button, oyster, and shiitake.',
        price: 179,
        category: 'vegetarian',
        image: '/images/products/mushrooms.jpg',
        weight: '200',
        unit: 'g',
        inStock: true,
    },
];

export const getProductById = (id: string): LegacyProduct | undefined => {
    return sampleProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): LegacyProduct[] => {
    return sampleProducts.filter(product => product.category === category);
};

export const getFeaturedProducts = (): LegacyProduct[] => {
    return sampleProducts.filter(product => product.isBestseller || product.isNew).slice(0, 6);
};

export const getBestsellers = (): LegacyProduct[] => {
    return sampleProducts.filter(product => product.isBestseller);
};

export const getNewArrivals = (): LegacyProduct[] => {
    return sampleProducts.filter(product => product.isNew);
};

