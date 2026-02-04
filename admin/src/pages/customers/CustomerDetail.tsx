import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { customersApi } from '../../lib/api';
import type { Customer, Order, CustomerAnalytics } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import {
    ArrowLeft, Mail, Phone, MapPin, User, Package,
    DollarSign, TrendingUp, Calendar, Loader2, ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderStats, setOrderStats] = useState<Record<string, number>>({});
    const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCustomerDetails();
            fetchAnalytics();
        }
    }, [id]);

    const fetchCustomerDetails = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await customersApi.getById(id);
            if (response.success && response.data) {
                setCustomer(response.data.customer);
                setOrders(response.data.orders || []);
                setOrderStats(response.data.orderStats || {});
            }
        } catch (error) {
            console.error('Failed to fetch customer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        if (!id) return;
        setAnalyticsLoading(true);
        try {
            const response = await customersApi.getAnalytics(id);
            if (response.success && response.data) {
                setAnalytics(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Customer not found</h2>
                <Button className="mt-4" onClick={() => navigate('/customers')}>
                    Back to Customers
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/customers')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-dark">
                            {customer.firstName} {customer.lastName}
                        </h1>
                        <p className="text-secondary">{customer.userId.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${customer.userId.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        ● {customer.userId.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-dark">{customer.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                                <p className="text-2xl font-bold text-dark">₹{customer.totalSpent.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Average Order</p>
                                <p className="text-2xl font-bold text-dark">₹{customer.averageOrderValue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Customer Since</p>
                                <p className="text-lg font-bold text-dark">
                                    {format(new Date(customer.customerSince), 'MMM yyyy')}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{customer.userId.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{customer.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Last Order</p>
                                        <p className="font-medium">
                                            {customer.lastOrderDate
                                                ? format(new Date(customer.lastOrderDate), 'MMM dd, yyyy')
                                                : 'No orders'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    {customer.addresses && customer.addresses.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Addresses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {customer.addresses.map((address, index) => (
                                        <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium capitalize">{address.type}</p>
                                                    {address.isDefault && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{address.street}</p>
                                                <p className="text-sm text-gray-600">
                                                    {address.city}, {address.state} {address.zipCode}
                                                </p>
                                                <p className="text-sm text-gray-600">{address.country}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                            <CardDescription>Recent orders from this customer</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No orders yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <ShoppingBag className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">₹{order.total.toLocaleString()}</p>
                                                <p className={`text-sm capitalize ${order.status === 'delivered' ? 'text-green-600' :
                                                        order.status === 'cancelled' ? 'text-red-600' :
                                                            'text-blue-600'
                                                    }`}>
                                                    {order.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Statistics */}
                    {Object.keys(orderStats).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(orderStats).map(([status, count]) => (
                                        <div key={status} className="flex justify-between items-center">
                                            <span className="text-sm capitalize text-gray-600">{status}</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Monthly Spending Chart */}
                    {!analyticsLoading && analytics && analytics.monthlySpending.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Spending</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={analytics.monthlySpending}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="_id"
                                            style={{ fontSize: '12px' }}
                                            tickFormatter={(value) => value.slice(-2)}
                                        />
                                        <YAxis style={{ fontSize: '12px' }} />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#5e72e4"
                                            fill="#5e72e4"
                                            fillOpacity={0.3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Favorite Categories */}
                    {!analyticsLoading && analytics && analytics.favoriteCategories.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Favorite Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {analytics.favoriteCategories.map((category) => (
                                        <div key={category._id}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">{category._id}</span>
                                                <span className="text-sm text-gray-500">₹{category.totalSpent.toLocaleString()}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {category.itemsPurchased} items purchased
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes */}
                    {customer.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{customer.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
