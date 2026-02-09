// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        logout: '/api/auth/logout',
        me: '/api/auth/me',
        refresh: '/api/auth/refresh',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: (token: string) => `/api/auth/reset-password/${token}`,
    },

    // Products
    products: {
        list: '/api/products',
        detail: (id: string) => `/api/products/${id}`,
    },

    // Categories (public endpoint)
    categories: {
        list: '/api/categories',
    },

    // Orders
    orders: {
        create: '/api/orders',
        myOrders: '/api/orders/my-orders',
        detail: (id: string) => `/api/orders/${id}`,
    },

    // Profile
    profile: {
        get: '/api/profile',
        update: '/api/profile',
        changePassword: '/api/profile/password',
    },

    // Contact
    contact: {
        submit: '/api/contact',
    },
};

// Token storage keys
export const TOKEN_KEY = 'jhom_auth_token';
export const REFRESH_TOKEN_KEY = 'jhom_refresh_token';

