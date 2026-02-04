import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '../../lib/api';
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
import { Loader2, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Query {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

const SUBJECT_CATEGORIES = [
    { id: 'general', label: 'General Inquiry', color: 'bg-blue-100 text-blue-700' },
    { id: 'wholesale', label: 'Wholesale/Bulk Orders', color: 'bg-purple-100 text-purple-700' },
    { id: 'quality', label: 'Quality Concern', color: 'bg-red-100 text-red-700' },
    { id: 'partnership', label: 'Partnership Opportunity', color: 'bg-green-100 text-green-700' },
    { id: 'media', label: 'Media/Press Inquiry', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'order_mismatch', label: 'Order Mismatch', color: 'bg-orange-100 text-orange-700' },
];

const Queries = () => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['queries', selectedSubject],
        queryFn: () => contactApi.getAll(selectedSubject ? { subject: selectedSubject } : undefined),
        enabled: !!selectedSubject,
    });

    const { data: statsData } = useQuery({
        queryKey: ['queries-stats'],
        queryFn: () => contactApi.getStats(),
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const getCategoryStats = (subjectId: string) => {
        const stats = statsData?.data?.stats || [];
        const categoryStats = stats.find((s: any) => s._id === subjectId);
        return {
            count: categoryStats?.count || 0,
            unread: categoryStats?.unread || 0
        };
    };

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            contactApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queries'] });
            queryClient.invalidateQueries({ queryKey: ['queries-stats'] });
            toast.success('Status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update status');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => contactApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queries'] });
            queryClient.invalidateQueries({ queryKey: ['queries-stats'] });
            toast.success('Query deleted successfully');
            setSelectedQuery(null);
        },
        onError: () => {
            toast.error('Failed to delete query');
        },
    });

    const handleView = (query: Query) => {
        setSelectedQuery(query);
        if (query.status === 'new') {
            updateStatusMutation.mutate({ id: query._id, status: 'read' });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this query?')) {
            deleteMutation.mutate(id);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <Badge className="bg-blue-500">New</Badge>;
            case 'read':
                return <Badge variant="secondary">Read</Badge>;
            case 'replied':
                return <Badge className="bg-green-500">Replied</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const queries = data?.data?.queries || [];

    // Main Category View
    if (!selectedSubject) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Contact Queries</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SUBJECT_CATEGORIES.map((category) => {
                        const stats = getCategoryStats(category.id);
                        return (
                            <Card
                                key={category.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
                                onClick={() => setSelectedSubject(category.id)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        {category.label}
                                    </CardTitle>
                                    {stats.unread > 0 && (
                                        <Badge className="bg-red-500 animate-pulse">
                                            {stats.unread} New
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block ${category.color} mb-4`}>
                                        {category.label}
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
                                        <span>Total Queries</span>
                                        <span className="font-bold text-foreground">{stats.count}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    }

    // List View for Selected Subject
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                        ← Back to Categories
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {SUBJECT_CATEGORIES.find(c => c.id === selectedSubject)?.label}
                    </h1>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Inquiries List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No queries found for this category
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    queries.map((query: Query) => (
                                        <TableRow key={query._id}>
                                            <TableCell>
                                                {format(new Date(query.createdAt), 'MMM d, yyyy')}
                                            </TableCell>
                                            <TableCell className="font-medium">{query.name}</TableCell>
                                            <TableCell>{query.email}</TableCell>
                                            <TableCell>{getStatusBadge(query.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleView(query)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(query._id)}
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

            <Dialog open={!!selectedQuery} onOpenChange={(open) => !open && setSelectedQuery(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Query Details</DialogTitle>
                        <DialogDescription>
                            Received on {selectedQuery && format(new Date(selectedQuery.createdAt), 'PPP p')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedQuery && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                                    <p className="text-base font-medium">{selectedQuery.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                    <div>{getStatusBadge(selectedQuery.status)}</div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email
                                    </h4>
                                    <a href={`mailto:${selectedQuery.email}`} className="text-base text-blue-600 hover:underline">
                                        {selectedQuery.email}
                                    </a>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Phone
                                    </h4>
                                    <p className="text-base">{selectedQuery.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
                                <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                                    {selectedQuery.message}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                {selectedQuery.status !== 'replied' && (
                                    <Button
                                        onClick={() => {
                                            updateStatusMutation.mutate({ id: selectedQuery._id, status: 'replied' });
                                            setSelectedQuery(null);
                                        }}
                                    >
                                        Mark as Replied
                                    </Button>
                                )}
                                <Button variant="outline" onClick={() => setSelectedQuery(null)}>
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

export default Queries;
