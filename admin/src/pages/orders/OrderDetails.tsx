import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../lib/api';
import type { Order } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
    ArrowLeft,
    Printer,
    MapPin,
    User,
    CreditCard,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('');
    const [statusNote, setStatusNote] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await ordersApi.getById(id);
            if (response.success && response.data) {
                setOrder(response.data.order);
                setNewStatus(response.data.order.status);
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
            alert('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!id || !newStatus) return;

        setIsUpdating(true);
        try {
            const response = await ordersApi.updateStatus(id, newStatus, statusNote);
            if (response.success && response.data) {
                setOrder(response.data.order);
                alert('Order status updated successfully');
                setStatusNote('');
            } else {
                alert(response.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
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
            case 'pending': return <Clock className="w-4 h-4 mr-1" />;
            case 'processing': return <Package className="w-4 h-4 mr-1" />;
            case 'shipped': return <Truck className="w-4 h-4 mr-1" />;
            case 'delivered': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'cancelled': return <XCircle className="w-4 h-4 mr-1" />;
            default: return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex items-center space-x-2 text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading order details...</span>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                <Button className="mt-4" onClick={() => navigate('/orders')}>
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/orders')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </h1>
                        <p className="text-gray-500">
                            Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')} at {format(new Date(order.createdAt), 'h:mm a')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - 2 Columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div className="flex items-center gap-4">
                                            {item.product.images && item.product.images[0] ? (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                                    <Package className="w-8 h-8" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                                {item.variation && (
                                                    <p className="text-sm text-gray-500">Size: {item.variation}</p>
                                                )}
                                                {item.glazing && (
                                                    <p className="text-sm text-gray-500">Glazing: {item.glazing}%</p>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            ₹{(item.subtotal || item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">₹{order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium">₹{(order.shipping || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-medium">₹{(order.tax || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>₹{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.statusHistory.map((history, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                                {index !== order.statusHistory.length - 1 && (
                                                    <div className="w-0.5 h-full bg-gray-200 my-1" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(history.date), 'MMM dd, yyyy h:mm a')}
                                                </p>
                                                {history.note && (
                                                    <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                                                        {history.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - 1 Column */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
                            <CardDescription>Change order status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Order Status</Label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Note (Optional)</Label>
                                <Textarea
                                    placeholder="Add a note about this status change..."
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleStatusUpdate}
                                disabled={isUpdating || newStatus === order.status}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Status'
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {order.customer
                                            ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'N/A'
                                            : 'Guest Customer'
                                        }
                                    </p>
                                    {order.customer?.email && (
                                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                                    )}
                                    {!order.customer?.email && order.customer && (
                                        <p className="text-sm text-gray-400">No email provided</p>
                                    )}
                                    {order.customer?.phone && (
                                        <p className="text-sm text-gray-500">{order.customer.phone}</p>
                                    )}
                                    {!order.customer?.phone && order.customer && (
                                        <p className="text-sm text-gray-400">No phone provided</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">
                                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                    </p>
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>
                                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                                    </p>
                                    <p>{order.shippingAddress?.country}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <Clock className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900">Delivery Slot</p>
                                    <p className="text-sm text-gray-600">
                                        {order.deliverySlot || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900 capitalize">
                                        {order.paymentMethod.replace('_', ' ')}
                                    </p>
                                    <p className={`text-sm font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' :
                                        order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                        Status: {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
