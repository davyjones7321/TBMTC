export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tbmtc.onrender.com';

export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/',
    PRODUCTS: '/products',
    PRODUCT_CREATE: '/products/create',
    PRODUCT_EDIT: '/products/edit/:id',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:id',
    CUSTOMERS: '/customers',
    REPORTS: '/reports',
} as const;

export const ORDER_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};
