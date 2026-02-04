import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GradientButton } from '../ui/gradient-button';
import { Plus, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <GradientButton
                        variant="gradient"
                        icon={Plus}
                        onClick={() => navigate('/products/create')}
                        className="w-full"
                    >
                        Add Product
                    </GradientButton>

                    <GradientButton
                        variant="info"
                        icon={ShoppingCart}
                        onClick={() => navigate('/orders')}
                        className="w-full"
                    >
                        View Orders
                    </GradientButton>

                    <GradientButton
                        variant="warning"
                        icon={Package}
                        onClick={() => navigate('/products')}
                        className="w-full"
                    >
                        Manage Stock
                    </GradientButton>

                    <GradientButton
                        variant="success"
                        icon={TrendingUp}
                        onClick={() => navigate('/reports')}
                        className="w-full"
                    >
                        View Reports
                    </GradientButton>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
