'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { Product, LegacyProduct } from '@/app/types';

// Helper to get product ID (handles both MongoDB _id and legacy id)
function getProductId(product: Product | LegacyProduct): string {
    return '_id' in product ? product._id : product.id;
}

// Helper to get category slug for emoji lookup
function getCategorySlug(product: Product | LegacyProduct): string {
    if ('_id' in product && typeof product.category === 'object') {
        // MongoDB Product - category is an object
        return product.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'other';
    }
    // LegacyProduct - category is a string
    return (product as LegacyProduct).category || 'other';
}

// Helper to get product weight/size display
function getProductWeight(product: Product | LegacyProduct, variation?: string): string {
    if ('_id' in product) {
        // MongoDB Product
        if (variation) return variation;
        return `${product.unitValue}${product.unit}`;
    }
    // LegacyProduct
    return `${(product as LegacyProduct).weight}${product.unit}`;
}

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const getCategoryEmoji = (category: string) => {
        const slug = category.toLowerCase();
        if (slug.includes('fish') || slug.includes('seafood')) return '🐟';
        if (slug.includes('poultry') || slug.includes('chicken')) return '🍗';
        if (slug.includes('mutton') || slug.includes('goat')) return '🥩';
        if (slug.includes('ready') || slug.includes('cook')) return '🍳';
        if (slug.includes('vegetarian') || slug.includes('veg')) return '🥬';
        if (slug.includes('prawn') || slug.includes('shrimp')) return '🦐';
        return '🍽️';
    };

    if (cart.items.length === 0) {
        return (
            <section className="pt-32 pb-24">
                <div className="container">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
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
                        <h1
                            className="text-3xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Your cart is empty
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven&apos;t added anything to your cart yet.
                        </p>
                        <Link href="/shop" className="btn btn-primary btn-lg">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-8 bg-gray-50">
                <div className="container">
                    <h1
                        className="text-3xl lg:text-4xl font-bold text-gray-900"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-12 bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600 text-sm">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                {/* Cart Items */}
                                {cart.items.map((item) => {
                                    const productId = getProductId(item.product);
                                    const categorySlug = getCategorySlug(item.product);
                                    const weightDisplay = getProductWeight(item.product, item.variation);
                                    const itemPrice = item.price || item.product.price;

                                    return (
                                        <div
                                            key={`${productId}-${item.variation || 'default'}`}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center"
                                        >
                                            {/* Product */}
                                            <div className="md:col-span-6 flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-4xl">
                                                        {getCategoryEmoji(categorySlug)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/product/${productId}`}
                                                        className="font-semibold text-gray-900 hover:text-cyan-600"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">
                                                        {weightDisplay}
                                                    </p>
                                                    {item.glazing && (
                                                        <p className="text-sm text-cyan-600">
                                                            Glazing: {item.glazing}%
                                                        </p>
                                                    )}
                                                    <button
                                                        onClick={() => removeFromCart(productId, item.variation)}
                                                        className="text-sm text-red-500 hover:text-red-600 mt-1"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="md:col-span-2 text-center">
                                                <span className="md:hidden text-gray-500 text-sm mr-2">Price:</span>
                                                <span className="font-medium">₹{itemPrice}</span>
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-2 flex justify-center">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(productId, item.quantity - 1, item.variation)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(productId, item.quantity + 1, item.variation)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="md:col-span-2 text-right">
                                                <span className="md:hidden text-gray-500 text-sm mr-2">Total:</span>
                                                <span className="font-bold text-gray-900">
                                                    ₹{(itemPrice * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Clear Cart */}
                                <div className="p-4 bg-gray-50 flex justify-between items-center">
                                    <Link href="/shop" className="text-cyan-600 font-medium hover:text-cyan-700">
                                        ← Continue Shopping
                                    </Link>
                                    <button
                                        onClick={clearCart}
                                        className="text-red-500 font-medium hover:text-red-600"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-cyan-600">Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-xl text-gray-900">
                                            ₹{cartTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="btn btn-primary btn-lg w-full justify-center mb-4"
                                >
                                    Proceed to Checkout
                                </Link>

                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    Secure Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

