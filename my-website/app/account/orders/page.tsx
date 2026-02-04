'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api';
import type { Order } from '@/app/types';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    'out-for-delivery': 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    failed: 'text-red-600',
    refunded: 'text-gray-600',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('Fetching orders...');
                const response = await api.orders.getMyOrders();
                console.log('Orders response:', response);
                if (response.success && response.data?.orders) {
                    console.log('Orders found:', response.data.orders.length);
                    setOrders(response.data.orders);
                } else {
                    console.log('No orders or error:', response);
                    setError(response.message || 'Failed to load orders');
                }
            } catch (err) {
                console.error('Orders fetch error:', err);
                setError('Failed to load orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">When you place an order, it will appear here.</p>
                    <Link href="/shop" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
                    <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Order # </span>
                                    <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                                </div>
                                <div className="text-gray-400">|</div>
                                <div>
                                    <span className="text-gray-500">Placed on </span>
                                    <span className="text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                    {order.status.replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4">
                        <div className="space-y-3">
                            {order.items.map((item, index) => {
                                // Handle populated product object or fallback to item.name
                                const productName = typeof item.product === 'object' && item.product?.name
                                    ? item.product.name
                                    : item.name || 'Unknown Product';

                                return (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-900">{productName}</span>
                                            {item.variation && (
                                                <span className="text-gray-500">({item.variation})</span>
                                            )}
                                            <span className="text-gray-400">×{item.quantity}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">₹{item.subtotal.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="text-sm">
                                <span className="text-gray-500">Payment: </span>
                                <span className={`font-medium capitalize ${paymentStatusColors[order.paymentStatus] || 'text-gray-600'}`}>
                                    {order.paymentStatus}
                                </span>
                                <span className="text-gray-400 mx-2">•</span>
                                <span className="text-gray-600 capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-500 text-sm">Total: </span>
                                <span className="text-lg font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

