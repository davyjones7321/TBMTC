import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authApi } from '../lib/api';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Helper to construct full name from firstName + lastName
    const constructFullName = (userData: User): string => {
        if (userData.name) return userData.name;
        const firstName = userData.firstName || '';
        const lastName = userData.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || 'User';
    };

    const checkAuth = async () => {
        try {
            const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (token) {
                const response = await authApi.getMe();
                if (response.success && response.data?.user) {
                    const userData = response.data.user as User;
                    setUser({
                        ...userData,
                        id: userData._id || userData.id,
                        name: constructFullName(userData),
                    });
                } else {
                    // Token invalid - clear storage
                    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('[Auth] Check auth failed:', error);
            await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await authApi.login(email, password);

            if (response.success && response.data) {
                const { token, user: userData } = response.data as { token: string; user: User };
                await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
                setUser({
                    ...userData,
                    id: userData._id || userData.id,
                    name: constructFullName(userData),
                });
                return { success: true };
            }

            return { success: false, message: response.message || 'Login failed' };
        } catch (error: any) {
            console.error('[Auth] Login error:', error);
            // API interceptor now handles 401 and other errors standardly
            return { success: false, message: error.message || 'Login failed. Please try again.' };
        }
    };

    const register = async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await authApi.register(data);

            if (response.success && response.data) {
                const { token, user: userData } = response.data as { token: string; user: User };
                await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
                setUser({
                    ...userData,
                    id: userData._id || userData.id,
                    name: constructFullName(userData),
                });
                return { success: true };
            }

            return { success: false, message: response.message || 'Registration failed' };
        } catch (error: any) {
            console.error('[Auth] Register error:', error);
            // API interceptor handles 409 (Conflict) standardly
            return { success: false, message: error.message || 'Registration failed. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('[Auth] Logout error:', error);
        } finally {
            await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            await storage.removeItem(STORAGE_KEYS.USER_DATA);
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
