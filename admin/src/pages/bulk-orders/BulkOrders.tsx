import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkOrdersApi } from '../../lib/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Trash2, Eye, Mail, Phone, Building2, MapPin, Package } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BulkOrder {
    _id: string;
    businessName: string;
    businessType: string;
    contactName: string;
    email: string;
    phone: string;
    city: string;
    estimatedMonthlyVolume: string;
    productInterests: string[];
    message?: string;
    status: 'new' | 'read' | 'contacted' | 'converted';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

const STATUS_OPTIONS = [
    { value: 'new', label: 'New', color: 'bg-blue-500' },
    { value: 'read', label: 'Read', color: 'bg-gray-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
    { value: 'converted', label: 'Converted', color: 'bg-green-500' },
];

const BUSINESS_TYPE_LABELS: Record<string, string> = {
    restaurant: 'Restaurant',
    hotel: 'Hotel',
    catering: 'Catering Service',
    retailer: 'Retailer',
    other: 'Other',
};

const PRODUCT_LABELS: Record<string, string> = {
    'fish-seafood': 'Fish & Seafood',
    'poultry': 'Poultry',
    'mutton': 'Mutton',
    'ready-to-cook': 'Ready to Cook',
    'vegetarian': 'Vegetarian',
};

const BulkOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState<BulkOrder | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['bulk-orders', statusFilter],
        queryFn: () => bulkOrdersApi.getAll(statusFilter !== 'all' ? { status: statusFilter } : undefined),
    });

    const { data: statsData } = useQuery({
        queryKey: ['bulk-orders-stats'],
        queryFn: () => bulkOrdersApi.getStats(),
        refetchInterval: 30000,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
            bulkOrdersApi.updateStatus(id, status, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bulk-orders'] });
            queryClient.invalidateQueries({ queryKey: ['bulk-orders-stats'] });
            toast.success('Status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update status');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => bulkOrdersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bulk-orders'] });
            queryClient.invalidateQueries({ queryKey: ['bulk-orders-stats'] });
            toast.success('Bulk order deleted successfully');
            setSelectedOrder(null);
        },
        onError: () => {
            toast.error('Failed to delete bulk order');
        },
    });

    const handleView = (order: BulkOrder) => {
        setSelectedOrder(order);
        if (order.status === 'new') {
            updateMutation.mutate({ id: order._id, status: 'read' });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this bulk order request?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        updateMutation.mutate({ id, status: newStatus });
    };

    const getStatusBadge = (status: string) => {
        const statusOption = STATUS_OPTIONS.find(s => s.value === status);
        return (
            <Badge className={statusOption?.color || 'bg-gray-500'}>
                {statusOption?.label || status}
            </Badge>
        );
    };

    const bulkOrders = data?.data?.bulkOrders || [];
    const stats = statsData?.data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Bulk Order Requests</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Requests</CardTitle>
                        <Badge className="bg-blue-500">{stats?.newCount || 0}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats?.newCount || 0}</div>
                    </CardContent>
                </Card>
                {STATUS_OPTIONS.slice(2).map(status => {
                    const count = stats?.stats?.find((s: any) => s._id === status.value)?.count || 0;
                    return (
                        <Card key={status.value}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{status.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {STATUS_OPTIONS.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Bulk Order Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Volume</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bulkOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No bulk order requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bulkOrders.map((order: BulkOrder) => (
                                        <TableRow key={order._id}>
                                            <TableCell>
                                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{order.businessName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {BUSINESS_TYPE_LABELS[order.businessType] || order.businessType}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{order.contactName}</div>
                                                <div className="text-sm text-muted-foreground">{order.email}</div>
                                            </TableCell>
                                            <TableCell>{order.city}</TableCell>
                                            <TableCell>{order.estimatedMonthlyVolume}</TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleView(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(order._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Bulk Order Request Details</DialogTitle>
                        <DialogDescription>
                            Received on {selectedOrder && format(new Date(selectedOrder.createdAt), 'PPP p')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Business Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Building2 className="h-3 w-3" /> Business Name
                                    </h4>
                                    <p className="text-base font-medium">{selectedOrder.businessName}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Business Type</h4>
                                    <p className="text-base">
                                        {BUSINESS_TYPE_LABELS[selectedOrder.businessType] || selectedOrder.businessType}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Contact Name</h4>
                                    <p className="text-base font-medium">{selectedOrder.contactName}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email
                                    </h4>
                                    <a href={`mailto:${selectedOrder.email}`} className="text-base text-blue-600 hover:underline">
                                        {selectedOrder.email}
                                    </a>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Phone
                                    </h4>
                                    <a href={`tel:${selectedOrder.phone}`} className="text-base text-blue-600 hover:underline">
                                        {selectedOrder.phone}
                                    </a>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> City
                                    </h4>
                                    <p className="text-base">{selectedOrder.city}</p>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-4 border-t pt-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Estimated Monthly Volume</h4>
                                    <p className="text-base font-semibold">{selectedOrder.estimatedMonthlyVolume}</p>
                                </div>

                                {selectedOrder.productInterests.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Products Interested In</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedOrder.productInterests.map(product => (
                                                <Badge key={product} variant="secondary">
                                                    {PRODUCT_LABELS[product] || product}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedOrder.message && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Additional Requirements</h4>
                                        <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                                            {selectedOrder.message}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Update */}
                            <div className="flex items-center gap-4 pt-4 border-t">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                        Update Status
                                    </label>
                                    <Select
                                        value={selectedOrder.status}
                                        onValueChange={(value) => handleStatusChange(selectedOrder._id, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map(status => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BulkOrders;
