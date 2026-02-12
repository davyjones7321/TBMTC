'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, LegacyProduct } from '@/app/types';
import { useCart } from '@/app/context/CartContext';
import { getProductImageUrl } from '@/app/lib/image-map';

interface ProductCardProps {
    product: Product | LegacyProduct;
}

// Type guard to check if it's a MongoDB product
function isMongoProduct(product: Product | LegacyProduct): product is Product {
    return '_id' in product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    // Get product ID
    const productId = isMongoProduct(product) ? product._id : product.id;

    // Get category info
    const categoryName = isMongoProduct(product)
        ? product.category?.name || 'Other'
        : product.category;

    // Get variants (only for MongoDB products)
    const variants = isMongoProduct(product) ? product.variants || [] : [];
    const hasVariants = variants.length > 0;

    // Get current price based on variant selection
    const getCurrentPrice = () => {
        if (hasVariants && selectedVariant) {
            const variant = variants.find(v => v.size === selectedVariant);
            return variant?.price || product.price;
        }
        return product.price;
    };

    // Check if in stock
    const isInStock = isMongoProduct(product)
        ? product.stock?.quantity > 0 || !product.stock?.trackInventory
        : 'inStock' in product ? product.inStock : true;

    // Check for compare price / original price
    const comparePrice = isMongoProduct(product)
        ? product.compareAtPrice
        : 'originalPrice' in product ? product.originalPrice : undefined;

    // Get image URL
    const imageUrl = isMongoProduct(product)
        ? getProductImageUrl(product)
        : product.image;

    // Get badges
    const showNewBadge = isMongoProduct(product)
        ? new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Within 7 days
        : 'isNew' in product ? product.isNew : false;

    const showBestsellerBadge = isMongoProduct(product)
        ? product.isFeatured
        : 'isBestseller' in product ? product.isBestseller : false;

    const showSaleBadge = comparePrice && comparePrice > getCurrentPrice();

    const getCategoryEmoji = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('fish') || cat.includes('seafood')) return '🐟';
        if (cat.includes('prawn')) return '🦐';
        if (cat.includes('chicken') || cat.includes('poultry')) return '🍗';
        if (cat.includes('mutton')) return '🥩';
        if (cat.includes('crab')) return '🦀';
        if (cat.includes('lobster')) return '🦞';
        return '🍽️';
    };

    const getCategoryGradient = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('fish') || cat.includes('seafood')) return 'from-blue-100 to-cyan-100';
        if (cat.includes('prawn')) return 'from-orange-100 to-pink-100';
        if (cat.includes('chicken') || cat.includes('poultry')) return 'from-orange-100 to-amber-100';
        if (cat.includes('mutton')) return 'from-red-100 to-rose-100';
        return 'from-gray-100 to-gray-200';
    };

    const handleAddToCart = () => {
        if (hasVariants && !selectedVariant) {
            // If has variants but none selected, auto-select first
            const firstVariant = variants[0];
            addToCart(product, firstVariant.size, firstVariant.price);
        } else if (hasVariants && selectedVariant) {
            const variant = variants.find(v => v.size === selectedVariant);
            addToCart(product, selectedVariant, variant?.price || product.price);
        } else {
            addToCart(product);
        }
    };

    // Get unit display
    const getUnitDisplay = () => {
        if (isMongoProduct(product)) {
            const unitValue = product.unitValue || 1;
            const unit = product.unit || 'piece';
            if (unit === 'piece') return 'per piece';
            if (unit === 'kg') return `${unitValue} kg`;
            if (unit === 'g') return `${unitValue} g`;
            return `${unitValue} ${unit}`;
        }
        return `${product.weight}${product.unit}`;
    };

    return (
        <div className="product-card group">
            {/* Image */}
            <Link href={`/product/${productId}`}>
                <div className="product-image relative overflow-hidden">
                    {!imageError && imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    ) : (
                        <div
                            className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(
                                categoryName
                            )} flex items-center justify-center`}
                        >
                            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                {getCategoryEmoji(categoryName)}
                            </span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {showNewBadge && (
                            <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full shadow-md">
                                NEW
                            </span>
                        )}
                        {showBestsellerBadge && (
                            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                                BESTSELLER
                            </span>
                        )}
                        {showSaleBadge && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
                                SALE
                            </span>
                        )}
                    </div>

                    {/* Out of Stock Overlay */}
                    {!isInStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <span className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                <Link href={`/product/${productId}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm text-gray-500 mb-2">
                    {getUnitDisplay()}
                </p>

                {/* Variants */}
                {hasVariants && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {variants.map((variant) => (
                            <button
                                key={variant.size}
                                onClick={() => setSelectedVariant(variant.size)}
                                className={`px-2 py-1 text-xs rounded border transition-colors ${selectedVariant === variant.size
                                    ? 'bg-cyan-600 text-white border-cyan-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-600'
                                    }`}
                            >
                                {variant.size}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            ₹{getCurrentPrice()}
                        </span>
                        {showSaleBadge && comparePrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{comparePrice}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className={`p-2.5 rounded-full transition-all duration-300 ${isInStock
                            ? 'bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white hover:scale-110 hover:shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Add to cart"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

