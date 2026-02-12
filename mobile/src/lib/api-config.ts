import { Platform } from 'react-native';

// API Configuration
// Automatically detects platform and uses the correct URL

// Local Development Configuration
const getApiBaseUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:5000';
    } else if (Platform.OS === 'android') {
        return 'http://192.168.1.11:5000'; // Update with your local IP
    } else {
        return 'http://192.168.1.11:5000'; // Update with your local IP
    }
};
export const API_BASE_URL = getApiBaseUrl();

/* 
// Production URL (Render) - Uncomment for production
// export const API_BASE_URL = 'https://tbmtc.onrender.com';
*/

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/signup', // /register is admin-only
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',

    // Products (public)
    PRODUCTS: '/api/products',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,

    // Categories (public)
    CATEGORIES: '/api/admin/categories',

    // Orders (authenticated)
    ORDERS: '/api/orders',
    MY_ORDERS: '/api/orders/my-orders',

    // Profile
    PROFILE: '/api/profile',

    // Bulk Orders (public)
    BULK_ORDERS: '/api/bulk-orders',
} as const;
