'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken, setRefreshToken, clearTokens, getAuthToken } from '@/app/lib/api';
import type { User } from '@/app/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password: string, isEmail?: boolean) => Promise<{ success: boolean; message?: string }>;
    register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user on mount if token exists
    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const response = await api.auth.me();
                    if (response.success && response.data?.user) {
                        setUser(response.data.user);
                    } else {
                        clearTokens();
                    }
                } catch {
                    clearTokens();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (identifier: string, password: string, isEmail = false) => {
        try {
            const response = await api.auth.login(identifier, password, isEmail);

            if (response.success && response.data) {
                setAuthToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                setUser(response.data.user);
                return { success: true };
            }

            return { success: false, message: response.message || 'Login failed' };
        } catch {
            return { success: false, message: 'Network error' };
        }
    };

    const register = async (data: { name: string; email: string; phone: string; password: string }) => {
        try {
            const response = await api.auth.signup(data);

            if (response.success && response.data) {
                setAuthToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                setUser(response.data.user);
                return { success: true };
            }

            return { success: false, message: response.message || 'Registration failed' };
        } catch {
            return { success: false, message: 'Network error' };
        }
    };

    const logout = async () => {
        try {
            await api.auth.logout();
        } finally {
            setUser(null);
            clearTokens();
        }
    };

    const refreshUser = async () => {
        const token = getAuthToken();
        if (token) {
            const response = await api.auth.me();
            if (response.success && response.data?.user) {
                setUser(response.data.user);
            }
        }
    };

    const updateProfile = async (data: { firstName?: string; lastName?: string; phone?: string }) => {
        try {
            const response = await api.profile.update(data);
            if (response.success && response.data?.user) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.message || 'Update failed' };
        } catch {
            return { success: false, message: 'Network error' };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                refreshUser,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

