import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEY, REFRESH_TOKEN_KEY } from './api-config';
import type { Product, ApiResponse, User, Order, Category, CartItem } from '@/app/types';

// Token management
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
};

export const clearTokens = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};

// API fetch wrapper
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        // Handle 401 - clear tokens
        if (response.status === 401) {
            clearTokens();
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
}

// API methods
export const api = {
    // Auth
    auth: {
        login: async (identifier: string, password: string, isEmail = false) => {
            const payload = isEmail
                ? { email: identifier, password }
                : { phone: identifier, password };
            return apiFetch<{ user: User; token: string; refreshToken: string }>(
                API_ENDPOINTS.auth.login,
                { method: 'POST', body: JSON.stringify(payload) }
            );
        },

        signup: async (data: { name: string; email: string; phone: string; password: string }) => {
            return apiFetch<{ user: User; token: string; refreshToken: string }>(
                API_ENDPOINTS.auth.signup,
                { method: 'POST', body: JSON.stringify(data) }
            );
        },

        logout: async () => {
            const result = await apiFetch<null>(
                API_ENDPOINTS.auth.logout,
                { method: 'POST' }
            );
            clearTokens();
            return result;
        },

        me: async () => {
            return apiFetch<{ user: User }>(API_ENDPOINTS.auth.me);
        },

        forgotPassword: async (email: string) => {
            return apiFetch<null>(
                API_ENDPOINTS.auth.forgotPassword,
                { method: 'POST', body: JSON.stringify({ email }) }
            );
        },

        resetPassword: async (token: string, password: string) => {
            return apiFetch<null>(
                API_ENDPOINTS.auth.resetPassword(token),
                { method: 'POST', body: JSON.stringify({ password }) }
            );
        },
    },

    // Products
    products: {
        getAll: async (params?: {
            page?: number;
            limit?: number;
            search?: string;
            category?: string;
            isActive?: boolean;
            isFeatured?: boolean;
            sortBy?: string;
            order?: 'asc' | 'desc';
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.append(key, String(value));
                    }
                });
            }
            const query = searchParams.toString();
            return apiFetch<{
                data: Product[];
                pagination: {
                    currentPage: number;
                    totalPages: number;
                    totalItems: number;
                    itemsPerPage: number;
                };
            }>(`${API_ENDPOINTS.products.list}${query ? `?${query}` : ''}`);
        },

        getById: async (id: string) => {
            return apiFetch<{ product: Product }>(API_ENDPOINTS.products.detail(id));
        },
    },

    // Categories
    categories: {
        getAll: async () => {
            return apiFetch<{ data: Category[] }>(API_ENDPOINTS.categories.list);
        },
    },

    // Orders
    orders: {
        create: async (orderData: {
            items: Array<{
                product: string;
                quantity: number;
                price: number;
                variation?: string;
            }>;
            shippingAddress: {
                firstName?: string;
                lastName?: string;
                street: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
                phone?: string;
            };
            paymentMethod: string;
            deliverySlot?: string;
            notes?: string;
        }) => {
            return apiFetch<{ order: Order }>(
                API_ENDPOINTS.orders.create,
                { method: 'POST', body: JSON.stringify(orderData) }
            );
        },

        getMyOrders: async () => {
            return apiFetch<{ orders: Order[] }>(API_ENDPOINTS.orders.myOrders);
        },
    },

    // Profile
    profile: {
        get: async () => {
            return apiFetch<{ user: User }>(API_ENDPOINTS.profile.get);
        },

        update: async (data: { firstName?: string; lastName?: string; phone?: string }) => {
            return apiFetch<{ user: User }>(
                API_ENDPOINTS.profile.update,
                { method: 'PUT', body: JSON.stringify(data) }
            );
        },

        changePassword: async (currentPassword: string, newPassword: string) => {
            return apiFetch<null>(
                API_ENDPOINTS.profile.changePassword,
                { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }
            );
        },
    },

    // Contact
    contact: {
        submit: async (data: { name: string; email: string; phone?: string; message: string; subject: string }) => {
            return apiFetch<null>(
                API_ENDPOINTS.contact.submit,
                { method: 'POST', body: JSON.stringify(data) }
            );
        },
    },
};

export default api;

