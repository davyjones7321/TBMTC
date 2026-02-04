import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token');
        const savedUser = localStorage.getItem('admin_user');

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login(email, password);

            if (response.success && response.data) {
                const { user: userData, token } = response.data;

                // Verify user is admin
                if (userData.role !== 'admin') {
                    throw new Error('Access denied. Admin privileges required.');
                }

                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_user', JSON.stringify(userData));
                setUser(userData);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                checkAuth,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
