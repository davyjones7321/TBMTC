'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.auth.forgotPassword(email);

            if (response.success) {
                setIsSubmitted(true);
            } else {
                setError(response.message || 'Failed to send reset email');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <img
                                src="/images/LOGO.png"
                                alt="The Bangalore Meat & Trading Company Logo"
                                className="h-12 w-auto object-contain"
                            />
                            <span
                                className="text-lg font-extrabold text-[#570C19] text-left leading-tight"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                THE BANGALORE
                                <span className="block text-xs font-semibold text-gray-700 tracking-wider">
                                    MEAT & TRADING CO.
                                </span>
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white py-10 px-6 shadow-lg rounded-2xl text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">
                            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>
                        <Link href="/login" className="btn btn-primary">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <img
                            src="/images/LOGO.png"
                            alt="The Bangalore Meat & Trading Company Logo"
                            className="h-12 w-auto object-contain"
                        />
                        <span
                            className="text-lg font-extrabold text-[#570C19] text-left leading-tight"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            THE BANGALORE
                            <span className="block text-xs font-semibold text-gray-700 tracking-wider">
                                MEAT & TRADING CO.
                            </span>
                        </span>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Enter your email and we&apos;ll send you a reset link
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="form-input w-full"
                                required
                            />
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
                                    Sending...
                                </span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-cyan-600 font-medium hover:underline">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

