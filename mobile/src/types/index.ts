// User types
export interface User {
    id: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'admin' | 'customer';
}

// Product types
export interface ProductImage {
    url: string;
    alt?: string;
    isPrimary: boolean;
    _id?: string;
}

export interface ProductVariation {
    size: string;
    price: number;
    stock: number;
    sku: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    shortDescription?: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    cost?: number;
    category: {
        _id: string;
        name: string;
        slug?: string;
    };
    stock: {
        quantity: number;
        lowStockThreshold: number;
        trackInventory: boolean;
    };
    images: ProductImage[];
    variations?: ProductVariation[];
    isActive: boolean;
    isFeatured: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// Cart types
export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
    variation?: string;
}

// Order types
export interface OrderItem {
    product: string;
    quantity: number;
    price: number;
    variation?: string;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customer: {
        _id: string;
        firstName?: string;
        lastName?: string;
        email: string;
    };
    items: OrderItem[];
    subtotal: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: string;
    shippingAddress: ShippingAddress;
    deliverySlot?: string;
    createdAt: string;
    updatedAt: string;
}

// Category types
export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    order: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        items: T[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
