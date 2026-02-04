import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersApi } from '../../lib/api';
import type { Customer } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Search, Eye, Loader2, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [minSpent, setMinSpent] = useState('');
    const [maxSpent, setMaxSpent] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, [page, search, sortBy, sortOrder, minSpent, maxSpent]);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
                sortBy,
                order: sortOrder,
            };

            if (search) params.search = search;
            if (minSpent) params.minSpent = parseFloat(minSpent);
            if (maxSpent) params.maxSpent = parseFloat(maxSpent);

            const response = await customersApi.getAll(params);
            if (response.success && response.data) {
                setCustomers(response.data.data || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const SortIcon = ({ field }: { field: string }) => (
        <ArrowUpDown
            className={`w-4 h-4 inline ml-1 ${sortBy === field ? 'text-primary' : 'text-gray-400'}`}
        />
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Customers</h1>
                    <p className="text-secondary mt-1">Manage your customer base and view analytics</p>
                </div>
                {/* Future: Add Customer button can be added here */}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>

                        {/* Min Spent Filter */}
                        <Input
                            type="number"
                            placeholder="Min spent (₹)"
                            value={minSpent}
                            onChange={(e) => {
                                setMinSpent(e.target.value);
                                setPage(1);
                            }}
                        />

                        {/* Max Spent Filter */}
                        <Input
                            type="number"
                            placeholder="Max spent (₹)"
                            value={maxSpent}
                            onChange={(e) => {
                                setMaxSpent(e.target.value);
                                setPage(1);
                            }}
                        />

                        {/* Clear Filters */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                setMinSpent('');
                                setMaxSpent('');
                                setPage(1);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No customers found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('firstName')}
                                        >
                                            Customer <SortIcon field="firstName" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('totalOrders')}
                                        >
                                            Orders <SortIcon field="totalOrders" />
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('totalSpent')}
                                        >
                                            Total Spent <SortIcon field="totalSpent" />
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('lastOrderDate')}
                                        >
                                            Last Order <SortIcon field="lastOrderDate" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customers.map((customer) => (
                                        <tr
                                            key={customer._id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/customers/${customer._id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.firstName} {customer.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Since {format(new Date(customer.customerSince), 'MMM yyyy')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.userId.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.phone || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {customer.lastOrderDate
                                                        ? format(new Date(customer.lastOrderDate), 'MMM dd, yyyy')
                                                        : 'No orders'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.userId.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    ● {customer.userId.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/customers/${customer._id}`);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && customers.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
