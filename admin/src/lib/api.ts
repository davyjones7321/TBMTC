import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from './constants';
import type { ApiResponse, AuthResponse, Product, Category, Order, DashboardStats, ProductCreateData, ProductUpdateData, Customer, CustomerAnalytics, SalesReport, CategorySales, ProductSales, SalesTrends, User } from '../types';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
            // Token expired or invalid, but NOT for login requests
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
        const { data } = await apiClient.post('/api/auth/login', { email, password });
        return data;
    },

    getMe: async (): Promise<ApiResponse<{ user: any }>> => {
        const { data } = await apiClient.get('/api/auth/me');
        return data;
    },

    logout: async (): Promise<ApiResponse> => {
        const { data } = await apiClient.post('/api/auth/logout');
        return data;
    },

    forgotPassword: async (email: string): Promise<ApiResponse> => {
        const { data } = await apiClient.post('/api/auth/forgot-password', { email });
        return data;
    },

    resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
        const { data } = await apiClient.post(`/api/auth/reset-password/${token}`, { password });
        return data;
    },
};

// Categories API
export const categoriesApi = {
    getAll: async (params?: any): Promise<ApiResponse<{ categories: Category[] }>> => {
        const { data } = await apiClient.get('/api/admin/categories', { params });
        return data;
    },
    getOne: async (id: string): Promise<ApiResponse<{ category: Category }>> => {
        const { data } = await apiClient.get(`/api/admin/categories/${id}`);
        return data;
    },
    create: async (categoryData: any): Promise<ApiResponse<{ category: Category }>> => {
        const { data } = await apiClient.post('/api/admin/categories', categoryData);
        return data;
    },
    update: async (id: string, categoryData: any): Promise<ApiResponse<{ category: Category }>> => {
        const { data } = await apiClient.put(`/api/admin/categories/${id}`, categoryData);
        return data;
    },
    delete: async (id: string): Promise<ApiResponse> => {
        const { data } = await apiClient.delete(`/api/admin/categories/${id}`);
        return data;
    },
};

// Settings API
export const settingsApi = {
    get: async (): Promise<ApiResponse<{ settings: any }>> => {
        const { data } = await apiClient.get('/api/admin/settings');
        return data;
    },
    update: async (settingsData: any): Promise<ApiResponse<{ settings: any }>> => {
        const { data } = await apiClient.put('/api/admin/settings', settingsData);
        return data;
    },
};

// Dashboard API
export const dashboardApi = {
    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
        const { data } = await apiClient.get('/api/admin/dashboard/stats');
        return data;
    },
};

// Products API
export const productsApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sortBy?: string;
        order?: string;
    }): Promise<ApiResponse<{ products: Product[]; pagination: any; data: Product[] }>> => {
        const { data } = await apiClient.get('/api/admin/products', { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
        const { data } = await apiClient.get(`/api/admin/products/${id}`);
        return data;
    },

    create: async (productData: ProductCreateData): Promise<ApiResponse<{ product: Product }>> => {
        const { data } = await apiClient.post('/api/admin/products', productData);
        return data;
    },

    update: async (id: string, productData: ProductUpdateData): Promise<ApiResponse<{ product: Product }>> => {
        const { data } = await apiClient.put(`/api/admin/products/${id}`, productData);
        return data;
    },

    delete: async (id: string): Promise<ApiResponse> => {
        const { data } = await apiClient.delete(`/api/admin/products/${id}`);
        return data;
    },

    getLowStock: async (): Promise<ApiResponse<{ products: Product[] }>> => {
        const { data } = await apiClient.get('/api/admin/products/low-stock');
        return data;
    },
};

// Contact API
export const contactApi = {
    getAll: async (params?: { page?: number; limit?: number; status?: string; subject?: string }): Promise<ApiResponse<{ queries: any[]; totalPages: number; currentPage: number }>> => {
        const { data } = await apiClient.get('/api/contact', { params });
        return data;
    },

    updateStatus: async (id: string, status: string): Promise<ApiResponse<{ query: any }>> => {
        const { data } = await apiClient.put(`/api/contact/${id}`, { status });
        return data;
    },

    delete: async (id: string): Promise<ApiResponse> => {
        const { data } = await apiClient.delete(`/api/contact/${id}`);
        return data;
    },

    getStats: async (): Promise<ApiResponse<{ stats: any[] }>> => {
        const { data } = await apiClient.get('/api/contact/stats');
        return data;
    },
};

// Orders API
export const ordersApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }): Promise<ApiResponse<{ data: Order[]; pagination: any }>> => {
        const { data } = await apiClient.get('/api/admin/orders', { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
        const { data } = await apiClient.get(`/api/admin/orders/${id}`);
        return data;
    },

    updateStatus: async (id: string, status: string, note?: string): Promise<ApiResponse<{ order: Order }>> => {
        const { data } = await apiClient.patch(`/api/admin/orders/${id}/status`, { status, note });
        return data;
    },

    getStats: async (): Promise<ApiResponse<any>> => {
        const { data } = await apiClient.get('/api/admin/dashboard/stats');
        return data;
    },
};

// Customers API
export const customersApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        minSpent?: number;
        maxSpent?: number;
        sortBy?: string;
        order?: string;
    }): Promise<ApiResponse<{ data: Customer[]; pagination: any }>> => {
        const { data } = await apiClient.get('/api/admin/customers', { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<{
        customer: Customer;
        orders: Order[];
        orderStats: Record<string, number>
    }>> => {
        const { data } = await apiClient.get(`/api/admin/customers/${id}`);
        return data;
    },

    getAnalytics: async (id: string): Promise<ApiResponse<CustomerAnalytics>> => {
        const { data } = await apiClient.get(`/api/admin/customers/${id}/analytics`);
        return data;
    },

    update: async (id: string, customerData: Partial<Customer>): Promise<ApiResponse<{ customer: Customer }>> => {
        const { data } = await apiClient.put(`/api/admin/customers/${id}`, customerData);
        return data;
    },

    delete: async (id: string): Promise<ApiResponse> => {
        const { data } = await apiClient.delete(`/api/admin/customers/${id}`);
        return data;
    },
};

// Sales/Reports API
export const reportsApi = {
    getSalesReport: async (params?: {
        period?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<SalesReport>> => {
        const { data } = await apiClient.get('/api/admin/sales/report', { params });
        return data;
    },

    getCategorySales: async (params?: {
        period?: string;
    }): Promise<ApiResponse<CategorySales>> => {
        const { data } = await apiClient.get('/api/admin/sales/by-category', { params });
        return data;
    },

    getProductSales: async (params?: {
        period?: string;
        limit?: number;
    }): Promise<ApiResponse<ProductSales>> => {
        const { data } = await apiClient.get('/api/admin/sales/by-product', { params });
        return data;
    },

    getTrends: async (params?: {
        period?: string;
        groupBy?: string;
    }): Promise<ApiResponse<SalesTrends>> => {
        const { data } = await apiClient.get('/api/admin/sales/trends', { params });
        return data;
    },
};

// Users/Admin Management API
export const usersApi = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        isActive?: string;
    }): Promise<ApiResponse<{ data: User[]; pagination: any; stats: any }>> => {
        const { data } = await apiClient.get('/api/admin/users', { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
        const { data } = await apiClient.get(`/api/admin/users/${id}`);
        return data;
    },

    updateRole: async (id: string, role: string): Promise<ApiResponse<{ user: User }>> => {
        const { data } = await apiClient.put(`/api/admin/users/${id}/role`, { role });
        return data;
    },

    updateStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ user: User }>> => {
        const { data } = await apiClient.put(`/api/admin/users/${id}/status`, { isActive });
        return data;
    },

    delete: async (id: string): Promise<ApiResponse> => {
        const { data } = await apiClient.delete(`/api/admin/users/${id}`);
        return data;
    },

    createAdmin: async (userData: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<ApiResponse<{ user: User }>> => {
        const { data } = await apiClient.post('/api/auth/register', {
            ...userData,
            role: 'admin'
        });
        return data;
    },
};

export default apiClient;
