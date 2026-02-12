// Mobile app types matching jhom-foods-app template design

export type Category = 'All' | 'Fish' | 'Prawns' | 'Chicken' | 'Mutton' | 'Seafood';

export interface ProductVariation {
    size: string;
    price: number;
    glazingPrices?: {
        glazing20?: number;
        glazing30?: number;
        glazing50?: number;
    };
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    category: Category;
    imageKey: string; // Key to lookup in local images
    freshness: 'Fresh' | 'Frozen';
    variations?: ProductVariation[];
    glazingPrices?: {
        glazing20?: number;
        glazing30?: number;
        glazing50?: number;
    };
    piecesPerKg?: number;
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedGlazing?: number;
}

export type View = 'Home' | 'Products' | 'Cart' | 'Profile';
