'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [isEmail, setIsEmail] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(formData.identifier, formData.password, isEmail);

            if (result.success) {
                router.push('/');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const detectInputType = (value: string) => {
        // Simple email detection
        setIsEmail(value.includes('@'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1
                            className="text-3xl font-bold text-cyan-600"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            JHOM FOODS
                        </h1>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white py-8 px-6 shadow-lg rounded-2xl">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone or Email
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => {
                                    setFormData({ ...formData, identifier: e.target.value });
                                    detectInputType(e.target.value);
                                }}
                                placeholder="Enter your phone or email"
                                className="form-input w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                className="form-input w-full"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-cyan-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full justify-center disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-cyan-600 font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}

