import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../lib/api';
import type { Product } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsApi.getAll({ limit: 100 });
            if (response.success && response.data) {
                setProducts(response.data.data || response.data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productsApi.delete(id);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        }
    };

    const handleToggleFeatured = async (product: Product) => {
        try {
            const updatedProduct = { ...product, isFeatured: !product.isFeatured };
            // Optimistic update
            setProducts(products.map(p => p._id === product._id ? updatedProduct : p));

            const response = await productsApi.update(product._id, { isFeatured: !product.isFeatured });

            if (!response.success) {
                // Revert on failure
                setProducts(products.map(p => p._id === product._id ? product : p));
                toast.error('Failed to update featured status');
            } else {
                toast.success(updatedProduct.isFeatured ? 'Product added to featured' : 'Product removed from featured');
            }
        } catch (error) {
            console.error('Failed to toggle featured status:', error);
            // Revert on failure
            setProducts(products.map(p => p._id === product._id ? product : p));
            toast.error('Failed to update featured status');
        }
    };

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-gray-500">Manage your product inventory</p>
                </div>
                <Link to="/products/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products ({products.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Product</th>
                                    <th className="text-left py-3 px-4">SKU</th>
                                    <th className="text-left py-3 px-4">Category</th>
                                    <th className="text-left py-3 px-4">Price</th>
                                    <th className="text-left py-3 px-4">Stock</th>
                                    <th className="text-center py-3 px-4">Featured</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={product.images?.[0]?.url || '/placeholder.png'}
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {product.shortDescription?.substring(0, 50)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{product.sku}</td>
                                        <td className="py-3 px-4 text-sm">{product.category?.name}</td>
                                        <td className="py-3 px-4 font-medium">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs rounded-full ${product.stock.quantity <= product.stock.lowStockThreshold
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {product.stock.quantity} units
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleFeatured(product)}
                                                className={product.isFeatured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-500'}
                                            >
                                                <Star className="h-5 w-5 fill-current" />
                                            </Button>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs rounded-full ${product.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <Link to={`/products/${product._id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No products found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductList;
