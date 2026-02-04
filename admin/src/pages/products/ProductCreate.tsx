import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ProductCreate: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
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
        fetchCategories();
    }, []);

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
        setIsLoading(true);

        if (!formData.category) {
            alert('Please select a category');
            setIsLoading(false);
            return;
        }

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

            const response = await productsApi.create(productData);
            if (response.success) {
                alert('Product created successfully!');
                navigate('/products');
            } else {
                const errorMessage = response.errors ? response.errors.join('\n') : (response.message || 'Failed to create product');
                alert(errorMessage);
            }
        } catch (error: any) {
            console.error('Create product error:', error);
            const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.join('\n')
                : (error.response?.data?.message || 'Failed to create product');
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

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
                        <h1 className="text-3xl font-bold">Add New Product</h1>
                        <p className="text-gray-500">Create a new product in your inventory</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/products')}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Product'
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
                                    placeholder="e.g., Fresh Atlantic Salmon"
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
                                    placeholder="Brief product description (2-3 sentences)"
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
                                    placeholder="Detailed product description, ingredients, benefits, etc."
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
                                        placeholder="0.00"
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
                                        placeholder="1"
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
                                    <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
                                    <Input
                                        id="sku"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        placeholder="e.g., SAL-ATL-001"
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
                                        placeholder="0"
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
                                        placeholder="10"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Alert when stock falls below</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="trackInventory"
                                        checked={formData.trackInventory}
                                        onCheckedChange={(checked) => handleSwitchChange('trackInventory', checked)}
                                    />
                                    <Label htmlFor="trackInventory" className="cursor-pointer">
                                        Track inventory
                                    </Label>
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
                            <p className="text-xs text-gray-500">
                                Inactive products won't appear in the store
                            </p>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="isFeatured">Featured</Label>
                                <Switch
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Show in featured products section
                            </p>
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
                                required
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
                            <CardDescription>Add product photo URL</CardDescription>
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
                            <CardDescription>Comma-separated keywords</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="Fresh, Organic, Premium, etc."
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default ProductCreate;
