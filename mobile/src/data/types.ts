// Mobile app types matching jhom-foods-app template design

export type Category = 'All' | 'Fish' | 'Prawns' | 'Chicken' | 'Mutton' | 'Seafood';

export interface ProductVariation {
    size: string;
    price: number;
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
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
}

export type View = 'Home' | 'Products' | 'Cart' | 'Profile';
