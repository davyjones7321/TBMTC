'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

const accountLinks = [
    { label: 'My Profile', href: '/account', icon: 'user' },
    { label: 'My Orders', href: '/account/orders', icon: 'orders' },
    { label: 'Change Password', href: '/account/password', icon: 'lock' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, user, logout } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=' + encodeURIComponent(pathname));
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'user':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'orders':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            case 'lock':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                        My Account
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Welcome back, {user?.firstName || 'Customer'}!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {accountLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0 transition-colors ${isActive
                                            ? 'bg-cyan-50 text-cyan-600 border-l-4 border-l-cyan-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {getIcon(link.icon)}
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-xl shadow-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

