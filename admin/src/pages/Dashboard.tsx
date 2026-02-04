import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../lib/api';
import StatsCard from '../components/charts/StatsCard';
import SalesAreaChart from '../components/charts/SalesAreaChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';
import RecentOrdersList from '../components/dashboard/RecentOrdersList';
import QuickActions from '../components/dashboard/QuickActions';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: dashboardApi.getStats,
    });

    const dashboardData = stats?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-secondary">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
                <p className="text-secondary mt-1">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${(dashboardData?.revenue?.total || 0).toLocaleString()}`}
                    change={dashboardData?.revenue?.change || 0}
                    icon={DollarSign}
                    gradient="primary"
                    trend={(dashboardData?.revenue?.change || 0) >= 0 ? "up" : "down"}
                />

                <StatsCard
                    title="Total Orders"
                    value={(dashboardData?.orders?.total || 0).toLocaleString()}
                    change={dashboardData?.orders?.change || 0}
                    icon={ShoppingCart}
                    gradient="info"
                    trend={(dashboardData?.orders?.change || 0) >= 0 ? "up" : "down"}
                />

                <StatsCard
                    title="Total Customers"
                    value={(dashboardData?.customers?.total || 0).toLocaleString()}
                    change={dashboardData?.customers?.change || 0}
                    icon={Users}
                    gradient="success"
                    trend={(dashboardData?.customers?.change || 0) >= 0 ? "up" : "down"}
                />

                <StatsCard
                    title="Low Stock Items"
                    value={dashboardData?.lowStockProducts?.total || 0}
                    icon={Package}
                    gradient="danger"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesAreaChart data={dashboardData?.salesData} />
                <CategoryDonutChart data={dashboardData?.categoryBreakdown?.map((cat, index) => ({
                    name: cat.categoryName,
                    value: cat.revenue,
                    color: ['#5e72e4', '#2dce89', '#11cdef', '#f5365c', '#fb6340'][index % 5]
                }))} />
            </div>

            {/* Recent Activity Row */}
            <div className="grid grid-cols-1 gap-6">
                <RecentOrdersList orders={dashboardData?.recentOrders} />
            </div>

            {/* Quick Actions */}
            <QuickActions />
        </div>
    );
};

export default Dashboard;
