'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Quality', href: '/quality' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Contact', href: '/contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { cartCount, toggleCart } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    // Use dark theme if scrolled OR if not on homepage
    const useDarkTheme = isScrolled || pathname !== '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await logout();
        window.location.href = '/';
    };

    const getUserInitials = () => {
        if (user?.firstName) {
            return user.firstName.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${useDarkTheme
                ? 'bg-white/95 backdrop-blur-md shadow-md'
                : 'bg-transparent'
                }`}
        >
            <div className="container">
                <nav className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <span
                                className="text-2xl md:text-3xl font-bold tracking-tight"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                <span className={`transition-colors ${useDarkTheme ? 'text-cyan-600' : 'text-white'}`}>
                                    JHOM
                                </span>
                                <span className={`transition-colors ${useDarkTheme ? 'text-gray-800' : 'text-white'}`}>
                                    {' '}FOODS
                                </span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors relative group ${useDarkTheme
                                    ? 'text-gray-700 hover:text-cyan-600'
                                    : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* User Menu / Auth Button */}
                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-colors ${useDarkTheme
                                        ? 'hover:bg-gray-100'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {getUserInitials()}
                                    </div>
                                    <span className={`hidden md:block text-sm font-medium ${useDarkTheme ? 'text-gray-700' : 'text-white'}`}>
                                        {user?.firstName || 'Account'}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} ${useDarkTheme ? 'text-gray-700' : 'text-white'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/account"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/account/orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                My Orders
                                            </Link>
                                        </div>
                                        <div className="py-2 border-t border-gray-100">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${useDarkTheme
                                        ? 'text-gray-700 hover:text-cyan-600'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${useDarkTheme
                                        ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                                        : 'bg-white text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className={`relative p-2 rounded-full transition-colors ${useDarkTheme
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-white hover:bg-white/10'
                                }`}
                            aria-label="Open cart"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold text-white bg-orange-500 rounded-full px-1">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Desktop CTA Button */}
                        <Link
                            href="/shop"
                            className={`hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${useDarkTheme
                                ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md hover:shadow-lg'
                                : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                                }`}
                        >
                            Shop Now
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-lg transition-colors ${useDarkTheme
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-white hover:bg-white/10'
                                }`}
                            aria-label="Toggle menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                                <span className="text-cyan-600">JHOM</span>
                                <span className="text-gray-800"> FOODS</span>
                            </span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* User Info (if logged in) */}
                        {isAuthenticated && (
                            <div className="px-6 py-4 bg-cyan-50 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold">
                                        {getUserInitials()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto py-4">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-cyan-600 transition-colors"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Account Links (if logged in) */}
                            {isAuthenticated && (
                                <div className="px-6 py-4 border-t mt-4">
                                    <Link
                                        href="/account"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                </div>
                            )}

                            <div className="px-6 py-4 border-t mt-4">
                                <Link
                                    href="/bulk-orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors"
                                >
                                    Bulk Orders
                                </Link>
                                <Link
                                    href="/sustainability"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors"
                                >
                                    Sustainability
                                </Link>
                            </div>
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-4 border-t bg-gray-50">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center w-full py-3 border border-cyan-600 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                                <a href="tel:8073037379" className="hover:text-cyan-600">
                                    📞 8073037379
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

