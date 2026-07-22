import { useState, useEffect } from 'react';
import { usersApi } from '../../lib/api';
import type { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { UserPlus, Search, Loader2, Shield, Users, Check } from 'lucide-react';
import { format } from 'date-fns';

const AdminUsers: React.FC = () => {
    const { user: currentUser } = useAuth();
    // Use the flag from backend instead of checking email
    const isSuperAdmin = currentUser?.isSuperAdmin === true;

    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [page, search, roleFilter]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params: any = { page, limit: 10 };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;

            const response = await usersApi.getAll(params);

            if (response.success && response.data) {
                setUsers(response.data.data || []);
                setStats(response.data.stats);
                setTotalPages(response.data.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSuperAdmin) {
            alert('Only the super admin can create new admin users.');
            return;
        }

        setIsSubmitting(true);
        try {
            await usersApi.createAdmin(formData);
            setShowCreateDialog(false);
            setFormData({ email: '', password: '', firstName: '', lastName: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to create admin:', error);
            alert('Failed to create admin. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleRole = async (userId: string, currentRole: string, isTargetSuperAdmin: boolean) => {
        if (!isSuperAdmin) {
            alert('Only the super admin can manage user roles.');
            return;
        }

        if (isTargetSuperAdmin) {
            alert('Cannot modify super admin role.');
            return;
        }

        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        try {
            await usersApi.updateRole(userId, newRole);
            fetchUsers();
        } catch (error: any) {
            console.error('Failed to update role:', error);
            alert(error.response?.data?.message || 'Failed to update role.');
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean, isTargetSuperAdmin: boolean) => {
        if (isTargetSuperAdmin) {
            alert('Cannot modify super admin status.');
            return;
        }

        try {
            await usersApi.updateStatus(userId, !currentStatus);
            fetchUsers();
        } catch (error: any) {
            console.error('Failed to update status:', error);
            alert(error.response?.data?.message || 'Failed to update status.');
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-dark">User Management</h1>
                    <p className="text-secondary mt-1">Manage admins and customers</p>
                </div>
                {isSuperAdmin && (
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <UserPlus className="w-4 h-4" />
                                Create Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Admin</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateAdmin} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email *</label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Password *</label>
                                    <Input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Minimum 6 characters"
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Admin'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                                    <p className="text-2xl font-bold text-dark">{stats.totalUsers}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Admins</p>
                                    <p className="text-2xl font-bold text-dark">{stats.totalAdmins}</p>
                                </div>
                                <Shield className="w-8 h-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Customers</p>
                                    <p className="text-2xl font-bold text-dark">{stats.totalCustomers}</p>
                                </div>
                                <Users className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active</p>
                                    <p className="text-2xl font-bold text-dark">{stats.activeUsers}</p>
                                </div>
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={(value) => {
                            setRoleFilter(value === 'all' ? '' : value);
                            setPage(1);
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admins Only</SelectItem>
                                <SelectItem value="customer">Customers Only</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => {
                            setSearch('');
                            setRoleFilter('');
                            setPage(1);
                        }}>
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName || user.lastName
                                                                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                                : user.email}
                                                        </div>
                                                        {(user.firstName || user.lastName) && (
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        ● {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggleRole(user._id, user.role, user.isSuperAdmin || false)}
                                                        disabled={user.isSuperAdmin || !isSuperAdmin}
                                                    >
                                                        {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                                                    </Button>
                                                    <Button
                                                        variant={user.isActive ? 'outline' : 'default'}
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(user._id, user.isActive, user.isSuperAdmin || false)}
                                                        disabled={user.isSuperAdmin}
                                                    >
                                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-700">
                                        Page {page} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsers;
