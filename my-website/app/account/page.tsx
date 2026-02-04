'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function AccountPage() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const result = await updateProfile({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
        }

        setIsLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        });
        setIsEditing(false);
        setMessage(null);
    };

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="form-input w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="form-input w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    placeholder="10-digit phone number"
                                    className="form-input w-full"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">First Name</p>
                                    <p className="text-gray-900 font-medium">{user?.firstName || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Last Name</p>
                                    <p className="text-gray-900 font-medium">{user?.lastName || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <p className="text-gray-900 font-medium">{user?.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                <p className="text-gray-900 font-medium">{user?.phone || '-'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Account Type</p>
                            <p className="text-gray-900 font-medium capitalize">{user?.role || 'Customer'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                            <p className="text-gray-900 font-medium">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : '-'
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Last Login</p>
                            <p className="text-gray-900 font-medium">
                                {user?.lastLogin
                                    ? new Date(user.lastLogin).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    : '-'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

