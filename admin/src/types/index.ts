// Common types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

// User & Auth
export interface User {
    _id: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role: 'admin' | 'customer';
    isActive: boolean;
    isSuperAdmin?: boolean; // Added for frontend permission checks
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

// Product
export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    cost?: number;
    unit?: string;
    unitValue?: number;
    category: {
        _id: string;
        name: string;
    };
    images: {
        url: string;
        alt?: string;
        isPrimary: boolean;
    }[];
    stock: {
        quantity: number;
        lowStockThreshold: number;
        trackInventory: boolean;
    };
    tags?: string[];
    isActive: boolean;
    isFeatured: boolean;
    totalSold: number;
    rating: {
        average: number;
        count: number;
    };
    variants?: {
        size: string;
        price: number;
        stock: number;
        sku: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductCreateData {
    name: string;
    description: string;
    shortDescription?: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    cost?: number;
    unit?: string;
    unitValue?: number;
    category: string;
    images: {
        url: string;
        alt?: string;
        isPrimary: boolean;
    }[];
    stock: {
        quantity: number;
        lowStockThreshold: number;
        trackInventory: boolean;
    };
    tags?: string[];
    isActive: boolean;
    isFeatured: boolean;
    variants?: {
        size: string;
        price: number;
        stock: number;
        sku: string;
    }[];
}

export interface ProductUpdateData {
    name?: string;
    description?: string;
    shortDescription?: string;
    sku?: string;
    price?: number;
    compareAtPrice?: number;
    cost?: number;
    unit?: string;
    unitValue?: number;
    category?: string;
    images?: { url: string; alt?: string; isPrimary: boolean }[];
    stock?: {
        quantity: number;
        lowStockThreshold: number;
        trackInventory: boolean;
    };
    tags?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
    variants?: {
        size: string;
        price: number;
        stock: number;
        sku: string;
    }[];
}

// Category
export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

// Order
export interface Order {
    _id: string;
    orderNumber: string;
    customer: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
    };
    items: {
        product: {
            _id: string;
            name: string;
            images: { url: string }[];
        };
        quantity: number;
        price: number;
        total: number;
        subtotal?: number;
        variation?: string;
    }[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    notes?: string;
    deliverySlot?: string;
    statusHistory: {
        status: string;
        date: Date;
        note?: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

// Customer
export interface Customer {
    _id: string;
    userId: {
        _id: string;
        email: string;
        isActive: boolean;
        lastLogin?: string;
    };
    firstName: string;
    lastName: string;
    phone?: string;
    addresses: {
        type: 'shipping' | 'billing';
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        isDefault: boolean;
    }[];
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    customerSince: string;
    isActive: boolean;
    tags?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerAnalytics {
    customerStats: {
        totalOrders: number;
        totalSpent: number;
        averageOrderValue: number;
        lastOrderDate?: string;
        customerSince: string;
    };
    monthlySpending: {
        _id: string;
        total: number;
        orders: number;
    }[];
    favoriteCategories: {
        _id: string;
        totalSpent: number;
        itemsPurchased: number;
    }[];
}

// Dashboard
export interface DashboardStats {
    revenue: {
        total: number;
        change: number;
    };
    orders: {
        total: number;
        change: number;
    };
    customers: {
        total: number;
        change: number;
    };
    lowStockProducts: {
        total: number;
        change: number;
    };
    recentOrders: Order[];
    salesData: {
        date: string;
        sales: number;
        orders: number;
    }[];
    topProducts: {
        product: Product;
        quantity: number;
        revenue: number;
    }[];
    categoryBreakdown: {
        categoryId: string;
        categoryName: string;
        revenue: number;
        itemsSold: number;
        orderCount: number;
    }[];
}

// Sales Report
export interface SalesReport {
    period: {
        startDate: string;
        endDate: string;
    };
    summary: {
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        totalItems: number;
    };
    dailyBreakdown: {
        _id: string;
        revenue: number;
        orders: number;
    }[];
    paymentMethodBreakdown: {
        _id: string;
        count: number;
        revenue: number;
    }[];
}

export interface CategorySales {
    categories: {
        categoryId: string;
        categoryName: string;
        revenue: number;
        itemsSold: number;
        orderCount: number;
    }[];
}

export interface ProductSales {
    products: {
        productId: string;
        productName: string;
        sku: string;
        revenue: number;
        quantitySold: number;
        orderCount: number;
    }[];
}

export interface SalesTrends {
    period: string;
    groupBy: string;
    trends: {
        _id: string | { year: number; week: number };
        revenue: number;
        orders: number;
        averageOrderValue: number;
    }[];
}
