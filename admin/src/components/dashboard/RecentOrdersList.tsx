import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { GradientButton } from '../ui/gradient-button';
import { ArrowRight, Eye } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../lib/utils';

import { Order } from '../../types';

interface RecentOrdersListProps {
    orders?: Order[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-gradient-warning',
    processing: 'bg-gradient-info',
    shipped: 'bg-gradient-primary',
    delivered: 'bg-gradient-success',
    cancelled: 'bg-gradient-danger',
};

export const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ orders = [] }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your store</CardDescription>
                </div>
                <GradientButton
                    variant="gradient"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate('/orders')}
                >
                    View All
                </GradientButton>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-center text-secondary py-8">No recent orders</p>
                    ) : (
                        orders.slice(0, 5).map((order) => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between p-4 rounded-soft-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => navigate(`/orders/${order._id}`)}
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="flex-1">
                                        <p className="font-semibold text-dark">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-sm text-secondary">
                                            {order.customer?.firstName
                                                ? `${order.customer.firstName} ${order.customer.lastName || ''}`
                                                : order.customer?.email || 'Guest'}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-dark">{formatCurrency(order.total)}</p>
                                        <p className="text-xs text-secondary">{formatDateTime(order.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="ml-4 flex items-center space-x-3">
                                    <span
                                        className={`px-3 py-1 rounded-soft-md text-white text-xs font-semibold ${statusColors[order.status] || 'bg-gray-400'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                    <Eye className="w-4 h-4 text-secondary" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentOrdersList;
