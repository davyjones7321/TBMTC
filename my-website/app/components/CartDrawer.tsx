'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { Product, LegacyProduct } from '@/app/types';
import { getProductImageUrl } from '@/app/lib/image-map';

// Helper to get product ID
function getProductId(product: Product | LegacyProduct): string {
    return '_id' in product ? product._id : product.id;
}

// Helper to get category name
function getCategoryName(product: Product | LegacyProduct): string {
    if ('_id' in product) {
        return product.category?.name || 'Other';
    }
    return product.category;
}

// Helper to get category emoji
function getCategoryEmoji(category: string): string {
    const cat = category.toLowerCase();
    if (cat.includes('fish') || cat.includes('seafood')) return '🐟';
    if (cat.includes('prawn')) return '🦐';
    if (cat.includes('chicken') || cat.includes('poultry')) return '🍗';
    if (cat.includes('mutton')) return '🥩';
    if (cat.includes('crab')) return '🦀';
    return '🍽️';
}

export default function CartDrawer() {
    const {
        cart,
        closeCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartSubtotal,
        deliveryFee,
        cartCount,
        meetsMinimumOrder,
        freeDeliveryRemaining,
    } = useCart();

    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (productId: string) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    if (!cart.isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2
                        className="text-xl font-bold"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Your Cart ({cartCount})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Free Delivery Progress */}
                {cart.items.length > 0 && freeDeliveryRemaining > 0 && (
                    <div className="px-4 py-3 bg-cyan-50 border-b">
                        <p className="text-sm text-cyan-700 mb-2">
                            Add ₹{freeDeliveryRemaining} more for <strong>FREE delivery!</strong>
                        </p>
                        <div className="h-2 bg-cyan-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-cyan-600 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (cartSubtotal / 500) * 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Add some delicious items to get started!
                            </p>
                            <Link
                                href="/shop"
                                onClick={closeCart}
                                className="btn btn-primary"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => {
                                const productId = getProductId(item.product);
                                const categoryName = getCategoryName(item.product);
                                const itemPrice = item.price || item.product.price;
                                const imageUrl = '_id' in item.product
                                    ? getProductImageUrl(item.product)
                                    : item.product.image;
                                const showEmoji = imageErrors[productId] || !imageUrl;

                                return (
                                    <div
                                        key={`${productId}-${item.variation || ''}`}
                                        className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                                    >
                                        {/* Product Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 relative">
                                            {!showEmoji ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                    onError={() => handleImageError(productId)}
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center text-3xl">
                                                    {getCategoryEmoji(categoryName)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {item.product.name}
                                            </h4>
                                            {item.variation && (
                                                <p className="text-sm text-cyan-600">
                                                    Size: {item.variation}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500">
                                                {'_id' in item.product
                                                    ? `${item.product.unitValue || 1} ${item.product.unit || 'piece'}`
                                                    : `${item.product.weight}${item.product.unit}`
                                                }
                                            </p>
                                            <p className="font-semibold text-cyan-600 mt-1">
                                                ₹{itemPrice}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeFromCart(productId, item.variation)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>

                                            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(productId, item.quantity - 1, item.variation)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(productId, item.quantity + 1, item.variation)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer with Total and Checkout */}
                {cart.items.length > 0 && (
                    <div className="border-t p-4 bg-gray-50">
                        {/* Minimum Order Warning */}
                        {!meetsMinimumOrder && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    ⚠️ Minimum order value is <strong>₹300</strong>. Add ₹{300 - cartSubtotal} more to checkout.
                                </p>
                            </div>
                        )}

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">
                                    ₹{cartSubtotal.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Delivery</span>
                                <span className={`font-medium ${deliveryFee === 0 ? 'text-cyan-600' : 'text-gray-900'}`}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-gray-900 font-semibold">Total</span>
                                <span className="text-xl font-bold text-gray-900">
                                    ₹{cartTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href={meetsMinimumOrder ? "/checkout" : "#"}
                                onClick={(e) => {
                                    if (!meetsMinimumOrder) {
                                        e.preventDefault();
                                        return;
                                    }
                                    closeCart();
                                }}
                                className={`btn w-full justify-center ${meetsMinimumOrder
                                        ? 'btn-primary'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Proceed to Checkout
                            </Link>
                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="btn btn-secondary w-full justify-center"
                            >
                                View Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

