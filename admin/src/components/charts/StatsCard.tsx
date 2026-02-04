import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    gradient: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'dark';
    trend?: 'up' | 'down';
}

const gradientClasses = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    danger: 'bg-gradient-danger',
    warning: 'bg-gradient-warning',
    info: 'bg-gradient-info',
    purple: 'bg-gradient-purple',
    dark: 'bg-gradient-dark',
};

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    gradient,
    trend,
}) => {
    const isPositive = trend === 'up' || (change && change > 0);

    return (
        <div className="relative bg-white rounded-soft-xl shadow-soft-lg p-6 overflow-hidden transition-all duration-300 hover:shadow-soft-xxl">
            {/* Icon with gradient background */}
            <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10">
                <Icon className="w-full h-full" />
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm font-medium text-secondary mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-dark mb-2">{value}</h3>

                    {change !== undefined && (
                        <div className="flex items-center text-sm">
                            <span
                                className={cn(
                                    'font-semibold',
                                    isPositive ? 'text-success' : 'text-danger'
                                )}
                            >
                                {isPositive ? '+' : ''}{change}%
                            </span>
                            <span className="text-secondary ml-2">than last month</span>
                        </div>
                    )}
                </div>

                {/* Floating icon with gradient */}
                <div
                    className={cn(
                        'w-16 h-16 rounded-soft-lg flex items-center justify-center shadow-soft-md',
                        gradientClasses[gradient]
                    )}
                >
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
