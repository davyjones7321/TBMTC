'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { use, useState } from 'react';
import { useProduct, useProductsByCategory } from '@/app/hooks/useProducts';
import { useCart } from '@/app/context/CartContext';
import ProductCard from '@/app/components/ProductCard';

interface Props {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: Props) {
    const { id } = use(params);
    const { product, isLoading, error, getImageUrl } = useProduct(id);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [imageError, setImageError] = useState(false);

    // Fetch related products only when we have a product
    const categoryName = product?.category?.name || '';
    const { products: categoryProducts } = useProductsByCategory(categoryName);

    // Filter out current product from related items
    const relatedProducts = categoryProducts
        .filter(p => p._id !== id)
        .slice(0, 4);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                <Link href="/shop" className="btn btn-primary">
                    Return to Shop
                </Link>
            </div>
        );
    }

    const getCategoryEmoji = (catName: string) => {
        const category = catName.toLowerCase();
        if (category.includes('fish') || category.includes('seafood')) return '🐟';
        if (category.includes('poultry') || category.includes('chicken')) return '🍗';
        if (category.includes('mutton')) return '🥩';
        if (category.includes('ready')) return '🍳';
        if (category.includes('veg')) return '🥬';
        return '🍽️';
    };

    const getCategoryGradient = (catName: string) => {
        const category = catName.toLowerCase();
        if (category.includes('fish') || category.includes('seafood')) return 'from-blue-100 to-cyan-100';
        if (category.includes('poultry') || category.includes('chicken')) return 'from-orange-100 to-amber-100';
        if (category.includes('mutton')) return 'from-red-100 to-rose-100';
        if (category.includes('ready')) return 'from-yellow-100 to-orange-100';
        if (category.includes('veg')) return 'from-green-100 to-emerald-100';
        return 'from-gray-100 to-gray-200';
    };

    const handleAddToCart = () => {
        // Add to cart with specific quantity
        // Note: The context might need adjustment if it doesn't support adding with quantity directly
        // behaving as adding N times for now or using the update logic if checking context
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const imageUrl = getImageUrl(product);
    const categoryDisplayName = product.category?.name || 'Uncategorized';

    // Check stock status
    const inStock = product.stock?.quantity > 0 || !product.stock?.trackInventory;

    return (
        <>
            {/* Breadcrumb */}
            <section className="pt-24 pb-4 bg-gray-50">
                <div className="container">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-cyan-600">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-cyan-600">Shop</Link>
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </nav>
                </div>
            </section>

            {/* Product Details */}
            <section className="py-12 bg-gray-50 min-h-[60vh]">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Product Image */}
                        <div className="relative group">
                            <div className={`rounded-3xl overflow-hidden bg-white shadow-lg aspect-square flex items-center justify-center relative border border-gray-100`}>
                                {!imageError && imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                        onError={() => setImageError(true)}
                                        priority
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(categoryDisplayName)} flex items-center justify-center`}>
                                        <span className="text-[120px] lg:text-[180px]">{getCategoryEmoji(categoryDisplayName)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-3">
                                {product.isFeatured && (
                                    <span className="px-5 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-xl">
                                        BESTSELLER
                                    </span>
                                )}
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="px-5 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-xl">
                                        {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-center">
                            <h1
                                className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-bold text-cyan-600">₹{product.price}</span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="text-2xl text-gray-400 line-through">₹{product.compareAtPrice}</span>
                                )}
                                <span className="text-lg text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                                    per {product.unitValue || 1} {product.unit}
                                </span>
                            </div>

                            <p className="text-lg text-gray-600 mb-10 leading-relaxed border-l-4 border-cyan-200 pl-6">
                                {product.description}
                            </p>

                            {/* Stock Status */}
                            <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-xl border border-gray-100 w-fit shadow-sm">
                                {inStock ? (
                                    <>
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-emerald-700 font-semibold tracking-wide">In Stock & Ready to Ship</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-3 h-3 bg-red-500 rounded-full" />
                                        <span className="text-red-600 font-semibold">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            {inStock && (
                                <div className="flex flex-col sm:flex-row gap-5 mb-10">
                                    <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden w-fit shadow-sm bg-white">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-cyan-600 transition-colors text-xl font-medium"
                                        >
                                            −
                                        </button>
                                        <span className="w-16 text-center font-bold text-xl text-gray-800">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-cyan-600 transition-colors text-xl font-medium"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="btn btn-primary btn-lg flex-1 justify-center shadow-lg hover:shadow-cyan-200 shadow-cyan-100 text-lg py-4 rounded-full"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                        Add {quantity} to Cart — ₹{(product.price * quantity).toFixed(2)}
                                    </button>
                                </div>
                            )}

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: '🌿', text: 'Sustainably Sourced' },
                                    { icon: '❄️', text: 'Flash Frozen' },
                                    { icon: '🚚', text: 'Fast Delivery' },
                                    { icon: '✓', text: 'Quality Assured' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-2xl filter drop-shadow-sm">{feature.icon}</span>
                                        <span className="font-semibold text-gray-700">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="section bg-white border-t border-gray-100">
                    <div className="container">
                        <div className="flex items-center gap-4 mb-10">
                            <span className="text-3xl">✨</span>
                            <h2
                                className="text-3xl lg:text-4xl font-bold text-gray-900"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                You May Also Like
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
