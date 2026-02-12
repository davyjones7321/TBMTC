import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage, STORAGE_KEYS } from './storage';
import { API_BASE_URL } from './api-config';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout for mobile networks
});

// Request interceptor: Attach JWT token from secure storage
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('[API] Error getting auth token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        let customError: Error & { status?: number } = new Error('An unexpected error occurred');

        if (error.response) {
            // Server responded with a status code outside 2xx range
            const status = error.response.status;
            const data = error.response.data as any;
            const serverMessage = data?.message || data?.error;

            customError.status = status;

            switch (status) {
                case 400:
                    customError.message = serverMessage || 'Invalid request. Please check your data.';
                    break;
                case 401:
                    customError.message = 'Session expired. Please login again.';
                    // Token expired - clear storage
                    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                    await storage.removeItem(STORAGE_KEYS.USER_DATA);
                    // Navigation handled by AuthContext state change
                    break;
                case 403:
                    customError.message = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    customError.message = 'Resource not found. It may have been removed.';
                    break;
                case 408:
                    customError.message = 'Request timed out. Please check your connection.';
                    break;
                case 409:
                    customError.message = serverMessage || 'This record already exists.';
                    break;
                case 422:
                    customError.message = serverMessage || 'Please check the highlighted fields.';
                    break;
                case 429:
                    customError.message = 'Too many requests. Please wait a moment.';
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    customError.message = 'Something went wrong on our end. Please try again later.';
                    break;
                default:
                    customError.message = serverMessage || `Error (${status}). Please try again.`;
            }
        } else if (error.request) {
            // Request was made but no response received
            customError.message = 'Unable to connect. Please check your internet connection.';
        } else {
            // Something happened in setting up the request
            customError.message = error.message;
        }

        return Promise.reject(customError);
    }
);

// Generic API response type
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

// Auth API helpers
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await api.post<ApiResponse<{ token: string; user: unknown }>>('/api/auth/login', { email, password });
        return response.data;
    },

    register: async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
        // Use /signup endpoint - /register is for admin-only user creation
        const response = await api.post<ApiResponse<{ token: string; user: unknown }>>('/api/auth/signup', {
            email: data.email,
            password: data.password,
            phone: data.phone,
            name: `${data.firstName} ${data.lastName}`.trim(), // Backend expects 'name', not firstName/lastName
        });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get<ApiResponse<{ user: unknown }>>('/api/auth/me');
        return response.data;
    },

    logout: async () => {
        const response = await api.post<ApiResponse>('/api/auth/logout');
        return response.data;
    },
};

// Products API helpers
export const productsApi = {
    getAll: async (params?: { page?: number; limit?: number; search?: string; category?: string; isFeatured?: boolean }) => {
        const response = await api.get('/api/products', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },
};

// Categories API helpers
export const categoriesApi = {
    getAll: async () => {
        const response = await api.get('/api/admin/categories');
        return response.data;
    },
};

// Orders API helpers
export const ordersApi = {
    create: async (orderData: unknown) => {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/api/orders/my-orders');
        return response.data;
    },
};

export default api;
