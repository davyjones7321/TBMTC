import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Variant {
    size: string;
    price: number;
    stock: number;
    sku: string;
}

interface VariantManagerProps {
    variants: Variant[];
    onChange: (variants: Variant[]) => void;
}

const VariantManager: React.FC<VariantManagerProps> = ({ variants, onChange }) => {
    const handleAddVariant = () => {
        onChange([...variants, { size: '', price: 0, stock: 0, sku: '' }]);
    };

    const handleRemoveVariant = (index: number) => {
        const newVariants = variants.filter((_, i) => i !== index);
        onChange(newVariants);
    };

    const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
        const newVariants = [...variants];
        newVariants[index] = {
            ...newVariants[index],
            [field]: value,
        };
        onChange(newVariants);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Variants</CardTitle>
                    <CardDescription>Manage product size variants</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {variants.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        No variants added. Click "Add Variant" to create one.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg">
                                <div className="col-span-3">
                                    <Label>Size</Label>
                                    <Input
                                        value={variant.size}
                                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                        placeholder="e.g. 6/8"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Stock</Label>
                                    <Input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Label>SKU</Label>
                                    <Input
                                        value={variant.sku}
                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                        placeholder="SKU"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRemoveVariant(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default VariantManager;
