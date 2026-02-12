
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { productsApi } from '../lib/api';

// Types matching backend API response
export interface BackendProduct {
    _id: string;
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    unit: string;
    unitValue?: number;
    piecesPerKg?: number;
    category: {
        _id: string;
        name: string;
    };
    stock: {
        quantity: number;
        lowStockThreshold: number;
        trackInventory: boolean;
    };
    images: Array<{
        url: string;
        alt?: string;
        isPrimary?: boolean;
    }>;
    variants?: Array<{
        size: string;
        price: number;
        stock?: number;
    }>;
    isActive: boolean;
    isFeatured: boolean;
    tags?: string[];
    slug?: string;
}

// Transformed product for mobile app
export interface Product {
    id: string;           // MongoDB _id
    name: string;
    description: string;
    price: number;
    unit: string;
    category: string;
    imageUrl: string;     // Changed from imageKey to URL
    imageKey: string;     // Kept for backward compatibility
    freshness: 'Fresh' | 'Frozen';
    isFeatured: boolean;
    variations?: Array<{
        size: string;
        price: number;
    }>;
    inStock: boolean;
    stockQuantity: number;
    piecesPerKg?: number;
}

export type Category = 'All' | 'Seafood' | 'Prawns' | 'Chicken' | 'Mutton';

interface ProductsContextType {
    products: Product[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    refreshProducts: () => Promise<void>;
    getProductById: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Map backend categories to mobile app categories
const mapCategory = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
        'fish': 'Seafood',      // Merge Fish into Seafood
        'prawns': 'Prawns',
        'chicken': 'Chicken',
        'mutton': 'Mutton',
        'seafood': 'Seafood',
        'buffalo': 'Hidden',    // Hide Buffalo category
    };
    return categoryMap[categoryName?.toLowerCase()] || categoryName || 'Seafood';
};

// Transform backend product to mobile app format
const transformProduct = (backendProduct: BackendProduct): Product => {
    // Get primary image or first image
    const primaryImage = backendProduct.images?.find(img => img.isPrimary) || backendProduct.images?.[0];
    const imageUrl = primaryImage?.url || 'https://via.placeholder.com/200x200/8B1538/FFFFFF?text=' + encodeURIComponent(backendProduct.name);

    // Generate imageKey from name for backward compatibility with local images
    let imageKey = backendProduct.name.toLowerCase();

    // Custom mappings to match local image filenames
    imageKey = imageKey
        .replace('australian mutton', 'aus')
        .replace('australian', 'aus')
        .replace('/', '_') // Handle slashes like Raan/Leg -> Raan_Leg
        .replace(' shank/nali', '_shank')
        .replace(' mince/kheema', '_mince')
        .replace(' raan/leg', '_raan_leg')
        .replace(' jumbo curry cut', '_jumbo_curry')
        .replace(' delicate curry cut', '_delicate');

    imageKey = imageKey.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    // Determine freshness from tags or default
    const freshness: 'Fresh' | 'Frozen' = backendProduct.tags?.some(tag =>
        tag.toLowerCase().includes('fresh')
    ) ? 'Fresh' : 'Frozen';

    return {
        id: backendProduct._id,
        name: backendProduct.name,
        description: backendProduct.description || backendProduct.shortDescription || '',
        price: backendProduct.price || 0,
        unit: backendProduct.unit || 'kg',
        category: mapCategory(backendProduct.category?.name),
        imageUrl: imageUrl,
        imageKey: imageKey,
        freshness: freshness,
        isFeatured: backendProduct.isFeatured || false,
        variations: backendProduct.variants?.map(v => ({
            size: v.size,
            price: v.price || 0,
        })),
        inStock: backendProduct.stock?.quantity > 0,
        stockQuantity: backendProduct.stock?.quantity || 0,
        piecesPerKg: backendProduct.piecesPerKg || undefined,
    };
};

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all products (up to 100)
            const response = await productsApi.getAll({ limit: 100 });

            if (response.success && response.data?.data) {
                const backendProducts: BackendProduct[] = response.data.data;
                const transformedProducts = backendProducts
                    .filter(p => p.isActive && p.category?.name?.toLowerCase() !== 'buffalo')
                    .map(transformProduct);

                setProducts(transformedProducts);

                // Extract unique categories
                const uniqueCategories = new Set<string>();
                transformedProducts.forEach(p => {
                    if (p.category) uniqueCategories.add(p.category);
                });
                setCategories(['All', ...Array.from(uniqueCategories)] as Category[]);
            } else {
                throw new Error(response.message || 'Failed to fetch products');
            }
        } catch (err) {
            console.error('[Products] Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const refreshProducts = async () => {
        await fetchProducts();
    };

    const getProductById = (id: string): Product | undefined => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                categories,
                loading,
                error,
                refreshProducts,
                getProductById,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
