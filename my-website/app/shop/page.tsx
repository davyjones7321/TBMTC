'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import { useProducts } from '@/app/hooks/useProducts';
import { api } from '@/app/lib/api';
import type { Category, Product } from '@/app/types';

// Categories for client-side filtering
const categories = [
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'prawns', name: 'Prawns', icon: '🦐' },
    { id: 'chicken', name: 'Chicken', icon: '🍗' },
    { id: 'mutton', name: 'Mutton', icon: '🥩' },
    { id: 'seafood', name: 'Seafood', icon: '🦀' },
];

export default function ShopPage() {
    const { products, isLoading, error, getImageUrl } = useProducts({ limit: 100 });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('featured');
    const [dbCategories, setDbCategories] = useState<Category[]>([]);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.categories.getAll();
                if (response.success && response.data?.data) {
                    setDbCategories(response.data.data.filter(c =>
                        c.name.toLowerCase() !== 'buffalo' && c.isActive
                    ));
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Filter products by category
    const filteredProducts = selectedCategory
        ? products.filter(product =>
            product.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
        )
        : products;

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'featured':
            default:
                return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
    });

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-cyan-800 to-cyan-900 text-white">
                <div className="container">
                    <div className="max-w-2xl">
                        <h1
                            className="text-4xl lg:text-5xl font-bold mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Shop Now
                        </h1>
                        <p className="text-lg" style={{ color: '#000000' }}>
                            Premium quality meat and seafood, handpicked for excellence and delivered to your door.
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b sticky top-20 z-30">
                <div className="container">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 -mb-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${!selectedCategory
                                ? 'bg-cyan-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-cyan-100 hover:text-cyan-700'
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${selectedCategory === category.name
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-cyan-100 hover:text-cyan-700'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
                        </p>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm text-gray-600">
                                Sort by:
                            </label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="form-select py-2 px-4 text-sm rounded-lg border-gray-200"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="text-center py-16">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-primary"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && sortedProducts.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg mb-2">No products found</p>
                            <p className="text-gray-400">
                                {selectedCategory
                                    ? `No products in ${selectedCategory} category`
                                    : 'Please check back later'}
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!isLoading && !error && sortedProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sortedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="section bg-cyan-50">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2
                            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Get Exclusive Offers
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Subscribe to our newsletter for special deals, new products, and recipes.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input flex-1"
                            />
                            <button type="submit" className="btn btn-primary">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

