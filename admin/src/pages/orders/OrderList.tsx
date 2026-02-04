import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../lib/api';
import type { Order } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
    Search,
    Eye,
    Filter,
    ChevronLeft,
    ChevronRight,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck
} from 'lucide-react';
import { format } from 'date-fns';

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter, search]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
                search: search || undefined,
            };

            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const response = await ordersApi.getAll(params);
            if (response.success && response.data) {
                // Backend returns { success: true, data: { data: [...orders], pagination: {...} } }
                setOrders(response.data.data || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalOrders(response.data.pagination?.totalItems || 0);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3 mr-1" />;
            case 'processing': return <Package className="w-3 h-3 mr-1" />;
            case 'shipped': return <Truck className="w-3 h-3 mr-1" />;
            case 'delivered': return <CheckCircle className="w-3 h-3 mr-1" />;
            case 'cancelled': return <XCircle className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-600 font-medium';
            case 'pending': return 'text-yellow-600 font-medium';
            case 'failed': return 'text-red-600 font-medium';
            case 'refunded': return 'text-gray-600 font-medium';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500">Manage and track customer orders</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <CardTitle>Order List</CardTitle>
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search orders..."
                                        className="pl-9 w-full md:w-[250px]"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" variant="secondary">Search</Button>
                            </form>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Payment</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="bg-white hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">
                                                        {order.customer
                                                            ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'N/A'
                                                            : 'Guest Customer'
                                                        }
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {order.customer?.email || 'No email'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                                <div className="text-xs">{format(new Date(order.createdAt), 'h:mm a')}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                ₹{order.total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getPaymentStatusColor(order.paymentStatus)}>
                                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/orders/${order._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            Showing {orders.length} of {totalOrders} orders
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center px-2 text-sm font-medium">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || isLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderList;
