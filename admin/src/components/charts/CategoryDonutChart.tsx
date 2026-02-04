import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface CategoryData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

interface CategoryDonutChartProps {
    data?: CategoryData[];
}

const COLORS = ['#5e72e4', '#82d616', '#ea0606', '#fbcf33', '#17c1e8', '#7928CA'];

const defaultData: CategoryData[] = [
    { name: 'Fish', value: 45000, color: COLORS[0] },
    { name: 'Meat', value: 32000, color: COLORS[1] },
    { name: 'Vegetables', value: 28000, color: COLORS[2] },
    { name: 'Fruits', value: 15000, color: COLORS[3] },
    { name: 'Dairy', value: 12000, color: COLORS[4] },
    { name: 'Others', value: 8000, color: COLORS[5] },
];

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data = defaultData }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const renderLabel = (entry: any) => {
        const percentage = ((entry.value / total) * 100).toFixed(0);
        return `${percentage}%`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Sales distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderLabel}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color || COLORS[index % COLORS.length]}
                                    style={{ outline: 'none' }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 8px 26px -4px rgba(20, 20, 20, 0.15)',
                                padding: '12px',
                            }}
                            formatter={(value: number) => `₹${value.toLocaleString()}`}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span style={{ color: '#344767', fontSize: '14px' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="flex flex-col items-center justify-center -mt-48 pointer-events-none">
                    <p className="text-sm font-medium text-secondary">Total Revenue</p>
                    <p className="text-2xl font-bold text-dark">₹{total.toLocaleString()}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CategoryDonutChart;
