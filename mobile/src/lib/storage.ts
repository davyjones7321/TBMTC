import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage abstraction that uses:
 * - expo-secure-store for native (iOS/Android)
 * - localStorage for web
 */

// Web-safe storage implementation
const webStorage = {
    async setItem(key: string, value: string): Promise<void> {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`[Storage] Error setting item ${key}:`, error);
            throw error;
        }
    },

    async getItem(key: string): Promise<string | null> {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`[Storage] Error getting item ${key}:`, error);
            return null;
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`[Storage] Error removing item ${key}:`, error);
        }
    },

    async clear(): Promise<void> {
        const knownKeys = ['auth_token', 'refresh_token', 'user_data', 'cart'];
        knownKeys.forEach(key => localStorage.removeItem(key));
    },
};

// Native storage implementation using SecureStore
const nativeStorage = {
    async setItem(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error(`[Storage] Error setting item ${key}:`, error);
            throw error;
        }
    },

    async getItem(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error(`[Storage] Error getting item ${key}:`, error);
            return null;
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error(`[Storage] Error removing item ${key}:`, error);
        }
    },

    async clear(): Promise<void> {
        const knownKeys = ['auth_token', 'refresh_token', 'user_data', 'cart'];
        await Promise.all(knownKeys.map(key => SecureStore.deleteItemAsync(key).catch(() => { })));
    },
};

// Export the correct storage based on platform
export const storage = Platform.OS === 'web' ? webStorage : nativeStorage;

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    CART: 'cart',
} as const;
