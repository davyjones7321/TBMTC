'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/app/lib/api';
import { getProductImageUrl, isHiddenCategory } from '@/app/lib/image-map';
import type { Product } from '@/app/types';

interface UseProductsOptions {
    category?: string;
    limit?: number;
    featured?: boolean;
    excludeBuffalo?: boolean;
}

interface UseProductsResult {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    } | null;
    fetchProducts: (page?: number) => Promise<void>;
    getImageUrl: (product: Product) => string;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
    const {
        category,
        limit = 100,
        featured,
        excludeBuffalo = true
    } = options;

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        totalPages: number;
        totalItems: number;
    } | null>(null);

    const fetchProducts = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.products.getAll({
                page,
                limit,
                category,
                isFeatured: featured,
                isActive: true,
            });

            if (response.success && response.data) {
                let filteredProducts = response.data.data;

                // Filter out Buffalo products if requested
                if (excludeBuffalo) {
                    filteredProducts = filteredProducts.filter(
                        (product) => !isHiddenCategory(product.category?.name || '')
                    );
                }

                setProducts(filteredProducts);
                setPagination({
                    currentPage: response.data.pagination.currentPage,
                    totalPages: response.data.pagination.totalPages,
                    totalItems: response.data.pagination.totalItems,
                });
            } else {
                setError(response.message || 'Failed to fetch products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }, [category, limit, featured, excludeBuffalo]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getImageUrl = useCallback((product: Product): string => {
        return getProductImageUrl(product);
    }, []);

    return {
        products,
        isLoading,
        error,
        pagination,
        fetchProducts,
        getImageUrl,
    };
}

// Hook for single product
export function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await api.products.getById(id);

                if (response.success && response.data?.product) {
                    setProduct(response.data.product);
                } else {
                    setError(response.message || 'Product not found');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to fetch product');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getImageUrl = useCallback((product: Product): string => {
        return getProductImageUrl(product);
    }, []);

    return {
        product,
        isLoading,
        error,
        getImageUrl,
    };
}

// Get products by category
export function useProductsByCategory(categoryName: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.products.getAll({
                    limit: 100,
                    isActive: true,
                });

                if (response.success && response.data) {
                    // Client-side filter by category name
                    const filtered = response.data.data.filter(
                        (product) =>
                            product.category?.name?.toLowerCase() === categoryName.toLowerCase() &&
                            !isHiddenCategory(product.category?.name || '')
                    );
                    setProducts(filtered);
                } else {
                    setError(response.message || 'Failed to fetch products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to fetch products');
            } finally {
                setIsLoading(false);
            }
        };

        if (categoryName) {
            fetchProducts();
        }
    }, [categoryName]);

    const getImageUrl = useCallback((product: Product): string => {
        return getProductImageUrl(product);
    }, []);

    return {
        products,
        isLoading,
        error,
        getImageUrl,
    };
}

export default useProducts;

