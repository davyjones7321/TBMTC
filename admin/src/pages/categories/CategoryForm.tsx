import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { categoriesApi } from '../../lib/api';
import { Category } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Loader2, ArrowLeft, Save } from 'lucide-react';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent: 'none',
        isActive: true,
        sortOrder: 0
    });

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch all categories for parent selection
                const categoriesRes = await categoriesApi.getAll({ includeInactive: true });
                if (categoriesRes.success && categoriesRes.data) {
                    setCategories(categoriesRes.data.categories.filter(c => c._id !== id)); // Exclude self
                }

                // If edit mode, fetch category details
                if (isEditMode) {
                    const categoryRes = await categoriesApi.getOne(id);
                    if (categoryRes.success && categoryRes.data) {
                        const cat = categoryRes.data.category;
                        setFormData({
                            name: cat.name,
                            description: cat.description || '',
                            parent: (cat.parent as any)?._id || 'none',
                            isActive: cat.isActive,
                            sortOrder: cat.sortOrder || 0
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const dataToSubmit = {
                ...formData,
                parent: formData.parent === 'none' ? null : formData.parent
            };

            if (isEditMode) {
                await categoriesApi.update(id, dataToSubmit);
            } else {
                await categoriesApi.create(dataToSubmit);
            }
            navigate('/categories');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save category');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link to="/categories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Category' : 'Create Category'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditMode ? 'Update category details' : 'Add a new product category'}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parent">Parent Category</Label>
                            <Select
                                value={formData.parent}
                                onValueChange={(value) => setFormData({ ...formData, parent: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Top Level)</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Sort Order</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Active Status</Label>
                                <p className="text-sm text-muted-foreground">
                                    Category will be visible in the store
                                </p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link to="/categories">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Category
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryForm;
