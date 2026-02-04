import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface SalesData {
    date: string;
    sales: number;
    orders: number;
}

interface SalesAreaChartProps {
    data?: SalesData[];
}

const defaultData: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: Math.floor(Math.random() * 5000) + 2000,
    orders: Math.floor(Math.random() * 50) + 20,
}));

export const SalesAreaChart: React.FC<SalesAreaChartProps> = ({ data = defaultData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Revenue and orders for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5e72e4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5e72e4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82d616" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#82d616" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            stroke="#8392ab"
                            style={{ fontSize: '12px' }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#8392ab"
                            style={{ fontSize: '12px' }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 8px 26px -4px rgba(20, 20, 20, 0.15)',
                                padding: '12px',
                            }}
                            labelStyle={{ color: '#344767', fontWeight: 600, marginBottom: '4px' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#5e72e4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            name="Revenue (₹)"
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#82d616"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorOrders)"
                            name="Orders"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default SalesAreaChart;
