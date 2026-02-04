import { useState, useEffect } from 'react';
import { reportsApi } from '../../lib/api';
import type { SalesReport, CategorySales, ProductSales } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
    TrendingUp, DollarSign, ShoppingCart, Package,
    Download, Loader2, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesReports: React.FC = () => {
    const [period, setPeriod] = useState('month');
    const [isLoading, setIsLoading] = useState(true);
    const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
    const [categorySales, setCategorySales] = useState<CategorySales | null>(null);
    const [productSales, setProductSales] = useState<ProductSales | null>(null);

    useEffect(() => {
        fetchReports();
    }, [period]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const [salesRes, categoryRes, productRes] = await Promise.all([
                reportsApi.getSalesReport({ period }),
                reportsApi.getCategorySales({ period }),
                reportsApi.getProductSales({ period, limit: 20 })
            ]);

            if (salesRes.success) setSalesReport(salesRes.data!);
            if (categoryRes.success) setCategorySales(categoryRes.data!);
            if (productRes.success) setProductSales(productRes.data!);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!salesReport || !productSales) return;

        const csvContent = [
            `Sales Report - ${format(new Date(salesReport.period.startDate), 'MMM dd, yyyy')} to ${format(new Date(salesReport.period.endDate), 'MMM dd, yyyy')}`,
            '',
            'Summary',
            `Total Revenue,₹${salesReport.summary.totalRevenue.toLocaleString()}`,
            `Total Orders,${salesReport.summary.totalOrders}`,
            `Average Order Value,₹${salesReport.summary.averageOrderValue.toFixed(2)}`,
            `Total Items,${salesReport.summary.totalItems}`,
            '',
            'Top Products',
            'Product,SKU,Revenue,Quantity,Orders',
            ...productSales.products.map(p =>
                `${p.productName},${p.sku},₹${p.revenue},${p.quantitySold},${p.orderCount}`
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${period}.csv`;
        a.click();
    };

    const COLORS = ['#5e72e4', '#2dce89', '#f5365c', '#fb6340', '#ffd600', '#825ee4'];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Sales Reports</h1>
                    <p className="text-secondary mt-1">
                        Comprehensive sales analytics and insights
                    </p>
                </div>
                <Button onClick={exportToCSV} className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Period Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="quarter">This Quarter</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        {salesReport && (
                            <span className="text-sm text-gray-500">
                                {format(new Date(salesReport.period.startDate), 'MMM dd, yyyy')} - {format(new Date(salesReport.period.endDate), 'MMM dd, yyyy')}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            {salesReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold text-dark">
                                        ₹{salesReport.summary.totalRevenue.toLocaleString()}
                                    </p>
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
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-2xl font-bold text-dark">
                                        {salesReport.summary.totalOrders.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-dark">
                                        ₹{salesReport.summary.averageOrderValue.toFixed(2)}
                                    </p>
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
                                    <p className="text-sm font-medium text-gray-500">Total Items</p>
                                    <p className="text-2xl font-bold text-dark">
                                        {salesReport.summary.totalItems.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Revenue Trend Chart */}
            {salesReport && salesReport.dailyBreakdown.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>Daily revenue breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={salesReport.dailyBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#8392ab"
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                                />
                                <YAxis stroke="#8392ab" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 26px -4px rgba(20, 20, 20, 0.15)',
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#5e72e4"
                                    strokeWidth={2}
                                    name="Revenue (₹)"
                                    dot={{ fill: '#5e72e4' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#2dce89"
                                    strokeWidth={2}
                                    name="Orders"
                                    dot={{ fill: '#2dce89' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Sales */}
                {categorySales && categorySales.categories.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categorySales.categories}
                                        dataKey="revenue"
                                        nameKey="categoryName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry: any) => entry.categoryName}
                                    >
                                        {categorySales.categories.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {categorySales.categories.slice(0, 5).map((cat, idx) => (
                                    <div key={cat.categoryId} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <span>{cat.categoryName}</span>
                                        </div>
                                        <span className="font-medium">₹{cat.revenue.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Methods */}
                {salesReport && salesReport.paymentMethodBreakdown.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={salesReport.paymentMethodBreakdown}
                                        dataKey="revenue"
                                        nameKey="_id"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry: any) => entry._id}
                                    >
                                        {salesReport.paymentMethodBreakdown.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {salesReport.paymentMethodBreakdown.map((method, idx) => (
                                    <div key={method._id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <span className="capitalize">{method._id}</span>
                                        </div>
                                        <span className="font-medium">₹{method.revenue.toLocaleString()} ({method.count})</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Top Products Table */}
            {productSales && productSales.products.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>Top 20 products by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Revenue
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orders
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {productSales.products.map((product) => (
                                        <tr key={product.productId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.productName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{product.revenue.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.quantitySold}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.orderCount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SalesReports;
