'use client';

import { useProducts } from '@/app/hooks/useProducts';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';

export default function FeaturedProducts() {
    const { products, isLoading, error } = useProducts({ limit: 6, featured: true });

    // Get first 6 products (featured or not)
    const displayProducts = products.slice(0, 6);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{error}</p>
                <Link href="/shop" className="btn btn-primary">
                    View All Products
                </Link>
            </div>
        );
    }

    if (displayProducts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products available at the moment</p>
                <Link href="/shop" className="btn btn-primary">
                    View All Products
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}

