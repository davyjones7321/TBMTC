import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../../lib/api';
import type { Category } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ArrowLeft, ImagePlus, X, Loader2 } from 'lucide-react';
import VariantManager from '../../components/products/VariantManager';

const ProductEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [variants, setVariants] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        sku: '',
        price: '',
        unit: 'piece',
        unitValue: '1',
        category: '',
        stockQuantity: '',
        lowStockThreshold: '10',
        trackInventory: true,
        tags: '',
        isActive: true,
        isFeatured: false,
    });

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchProduct = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const response = await productsApi.getById(id);
            if (response.success && response.data) {
                const product = response.data.product;

                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    shortDescription: product.shortDescription || '',
                    sku: product.sku || '',
                    price: product.price?.toString() || '',
                    unit: product.unit || 'piece',
                    unitValue: product.unitValue?.toString() || '1',
                    category: product.category?._id || '',
                    stockQuantity: product.stock?.quantity?.toString() || '',
                    lowStockThreshold: product.stock?.lowStockThreshold?.toString() || '10',
                    trackInventory: product.stock?.trackInventory ?? true,
                    tags: product.tags?.join(', ') || '',
                    isActive: product.isActive ?? true,
                    isFeatured: product.isFeatured ?? false,
                });

                if (product.images && product.images.length > 0) {
                    setImageUrl(product.images[0].url || '');
                }

                if (product.variants) {
                    setVariants(product.variants);
                }
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
            alert('Failed to load product');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoriesApi.getAll();
            if (response.success && response.data) {
                setCategories(response.data.categories || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSaving(true);

        const safeParseFloat = (val: string, defaultVal: number = 0) => {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? defaultVal : parsed;
        };

        const safeParseInt = (val: string, defaultVal: number = 0) => {
            const parsed = parseInt(val);
            return isNaN(parsed) ? defaultVal : parsed;
        };

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                shortDescription: formData.shortDescription,
                sku: formData.sku,
                price: safeParseFloat(formData.price),
                unit: formData.unit,
                unitValue: safeParseFloat(formData.unitValue, 1),
                category: formData.category,
                images: imageUrl ? [{ url: imageUrl, alt: formData.name, isPrimary: true }] : [],
                stock: {
                    quantity: safeParseInt(formData.stockQuantity),
                    lowStockThreshold: safeParseInt(formData.lowStockThreshold, 10),
                    trackInventory: formData.trackInventory,
                },
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                isActive: formData.isActive,
                isFeatured: formData.isFeatured,
                variants: variants.map(v => ({
                    size: v.size,
                    price: Number(v.price),
                    stock: Number(v.stock),
                    sku: v.sku
                }))
            };

            const response = await productsApi.update(id, productData);
            if (response.success) {
                alert('Product updated successfully!');
                navigate('/products');
            } else {
                const errorMessage = response.errors ? response.errors.join('\n') : (response.message || 'Failed to update product');
                alert(errorMessage);
            }
        } catch (error: any) {
            console.error('Update product error:', error);
            const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.join('\n')
                : (error.response?.data?.message || 'Failed to update product');
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex items-center space-x-2 text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading product...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate('/products')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Product</h1>
                        <p className="text-gray-500">Update product information and settings</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/products')}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Product name and description</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Textarea
                                    id="shortDescription"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Full Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Units */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Units</CardTitle>
                            <CardDescription>Set price and unit measurement</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="price">Selling Price (₹) *</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="unit">Unit Type</Label>
                                    <Select
                                        value={formData.unit}
                                        onValueChange={(value) => handleSelectChange('unit', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="piece">Piece</SelectItem>
                                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                            <SelectItem value="g">Gram (g)</SelectItem>
                                            <SelectItem value="l">Liter (l)</SelectItem>
                                            <SelectItem value="ml">Milliliter (ml)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="unitValue">Unit Value</Label>
                                    <Input
                                        id="unitValue"
                                        name="unitValue"
                                        type="number"
                                        step="0.01"
                                        value={formData.unitValue}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">e.g., 1 for 1 kg, 0.5 for 500g</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variants */}
                    <VariantManager variants={variants} onChange={setVariants} />

                    {/* Inventory */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory</CardTitle>
                            <CardDescription>Stock management settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="sku">SKU *</Label>
                                    <Input
                                        id="sku"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                                    <Input
                                        id="stockQuantity"
                                        name="stockQuantity"
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                                    <Input
                                        id="lowStockThreshold"
                                        name="lowStockThreshold"
                                        type="number"
                                        value={formData.lowStockThreshold}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="trackInventory"
                                        checked={formData.trackInventory}
                                        onCheckedChange={(checked) => handleSwitchChange('trackInventory', checked)}
                                    />
                                    <Label htmlFor="trackInventory">Track inventory</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Product Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="isActive">Active</Label>
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="isFeatured">Featured</Label>
                                <Switch
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="category">Product Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Product Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {imageUrl ? (
                                <div className="relative">
                                    <img
                                        src={imageUrl}
                                        alt="Product preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => setImageUrl('')}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">Add image URL below</p>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="Fresh, Organic, Premium"
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default ProductEdit;
