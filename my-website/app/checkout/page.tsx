'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import { Address, Product, LegacyProduct } from '@/app/types';

// Helper to get product ID
function getProductId(product: Product | LegacyProduct): string {
    return '_id' in product ? product._id : product.id;
}

// Helper to get category name
function getCategoryName(category: string | { name: string }): string {
    if (typeof category === 'object' && category !== null && 'name' in category) {
        return category.name;
    }
    return String(category);
}

// Map frontend payment methods to backend enum values
function mapPaymentMethod(method: string): string {
    switch (method) {
        case 'cod':
            return 'cash_on_delivery';
        case 'upi':
            return 'paypal'; // Using paypal as placeholder for UPI
        case 'card':
            return 'credit_card';
        default:
            return 'cash_on_delivery';
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        cart,
        cartTotal,
        cartSubtotal,
        deliveryFee,
        clearCart
    } = useCart();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [orderError, setOrderError] = useState<string | null>(null);

    const [address, setAddress] = useState<Address>({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }
    }, [authLoading, isAuthenticated, router]);

    const getCategoryEmoji = (categoryData: string | { name: string } | undefined) => {
        const category = categoryData ? getCategoryName(categoryData).toLowerCase() : 'other';

        if (category.includes('fish') || category.includes('seafood')) return '🐟';
        if (category.includes('prawn')) return '🦐';
        if (category.includes('chicken') || category.includes('poultry')) return '🍗';
        if (category.includes('mutton') || category.includes('meat')) return '🥩';
        if (category.includes('crab')) return '🦀';
        if (category.includes('egg')) return '🥚';
        if (category.includes('ready')) return '🍳';
        if (category.includes('veg')) return '🥬';

        return '🍽️';
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setOrderError(null);

        try {
            // Prepare order items for API
            const orderItems = cart.items.map((item) => ({
                product: getProductId(item.product),
                quantity: item.quantity,
                price: item.price || item.product.price,
                variation: item.variation,
            }));

            // Parse address name into firstName and lastName
            const nameParts = address.fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Build shipping address for API (only include optional fields if not empty)
            const shippingAddress: {
                street: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
                firstName?: string;
                lastName?: string;
                phone?: string;
            } = {
                street: address.addressLine2
                    ? `${address.addressLine1}, ${address.addressLine2}`
                    : address.addressLine1,
                city: address.city,
                state: address.state,
                zipCode: address.pincode,
                country: 'India',
            };

            // Only add optional fields if they have values
            if (firstName) shippingAddress.firstName = firstName;
            if (lastName) shippingAddress.lastName = lastName;
            if (address.phone) shippingAddress.phone = address.phone;

            // Debug logging
            const orderData = {
                items: orderItems,
                shippingAddress,
                paymentMethod: mapPaymentMethod(paymentMethod),
            };
            console.log('Placing order with data:', orderData);

            // Create order via API
            const response = await api.orders.create(orderData);
            console.log('Order API response:', response);

            if (response.success && response.data?.order) {
                setOrderNumber(response.data.order.orderNumber || '');
                setOrderPlaced(true);
                clearCart();
            } else {
                // Show detailed error message including validation errors
                const errorMessage = response.errors
                    ? response.errors.join(', ')
                    : response.message || 'Failed to place order. Please try again.';
                setOrderError(errorMessage);
            }
        } catch (error) {
            console.error('Order placement error:', error);
            setOrderError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <section className="pt-32 pb-24">
                <div className="container">
                    <div className="max-w-md mx-auto text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-600 border-t-transparent mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (cart.items.length === 0 && !orderPlaced) {
        return (
            <section className="pt-32 pb-24">
                <div className="container">
                    <div className="max-w-md mx-auto text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            No items to checkout
                        </h1>
                        <p className="text-gray-600 mb-8">Add items to your cart before checking out.</p>
                        <Link href="/shop" className="btn btn-primary btn-lg">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    if (orderPlaced) {
        return (
            <section className="pt-32 pb-24">
                <div className="container">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-100 flex items-center justify-center">
                            <svg className="h-10 w-10 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Order Placed Successfully!
                        </h1>
                        {orderNumber && (
                            <p className="text-cyan-600 font-semibold mb-2">
                                Order #{orderNumber}
                            </p>
                        )}
                        <p className="text-gray-600 mb-8">
                            Thank you for your order. We&apos;ll send you a confirmation email shortly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/account/orders" className="btn btn-outline">
                                View My Orders
                            </Link>
                            <Link href="/shop" className="btn btn-primary btn-lg">
                                Continue Shopping
                            </Link>
                        </div>
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
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                        Checkout
                    </h1>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-4 mt-6">
                        {['Address', 'Payment', 'Review'].map((label, index) => (
                            <div key={label} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step > index + 1
                                    ? 'bg-cyan-600 text-white'
                                    : step === index + 1
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {step > index + 1 ? '✓' : index + 1}
                                </div>
                                <span className={`ml-2 font-medium ${step === index + 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {label}
                                </span>
                                {index < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-3" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Checkout Content */}
            <section className="py-12 bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
                                {/* Step 1: Address */}
                                {step === 1 && (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={address.fullName}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={address.phone}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            </div>
                                            <div className="form-group md:col-span-2">
                                                <label className="form-label">Address Line 1 *</label>
                                                <input
                                                    type="text"
                                                    name="addressLine1"
                                                    value={address.addressLine1}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="House/Flat No., Building Name"
                                                />
                                            </div>
                                            <div className="form-group md:col-span-2">
                                                <label className="form-label">Address Line 2</label>
                                                <input
                                                    type="text"
                                                    name="addressLine2"
                                                    value={address.addressLine2}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="Street, Area"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={address.city}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="Bangalore"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">State *</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={address.state}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="Karnataka"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Pincode *</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={address.pincode}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="560001"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Landmark</label>
                                                <input
                                                    type="text"
                                                    name="landmark"
                                                    value={address.landmark}
                                                    onChange={handleAddressChange}
                                                    className="form-input"
                                                    placeholder="Near..."
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => setStep(2)} className="btn btn-primary btn-lg mt-6">
                                            Continue to Payment
                                        </button>
                                    </>
                                )}

                                {/* Step 2: Payment */}
                                {step === 2 && (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                                                { id: 'upi', name: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                                                { id: 'card', name: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                                            ].map((method) => (
                                                <label
                                                    key={method.id}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === method.id
                                                        ? 'border-cyan-500 bg-cyan-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value={method.id}
                                                        checked={paymentMethod === method.id}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-3xl">{method.icon}</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{method.name}</div>
                                                        <div className="text-sm text-gray-500">{method.desc}</div>
                                                    </div>
                                                    {paymentMethod === method.id && (
                                                        <svg className="ml-auto h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 mt-6">
                                            <button onClick={() => setStep(1)} className="btn btn-secondary">
                                                Back
                                            </button>
                                            <button onClick={() => setStep(3)} className="btn btn-primary btn-lg">
                                                Review Order
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Review */}
                                {step === 3 && (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                                        {/* Address Summary */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                                                    <p className="text-gray-600 mt-1">
                                                        {address.fullName}<br />
                                                        {address.addressLine1}<br />
                                                        {address.addressLine2 && <>{address.addressLine2}<br /></>}
                                                        {address.city}, {address.state} - {address.pincode}<br />
                                                        Phone: {address.phone}
                                                    </p>
                                                </div>
                                                <button onClick={() => setStep(1)} className="text-cyan-600 text-sm font-medium">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Payment Method</h3>
                                                    <p className="text-gray-600 mt-1">
                                                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                                                        {paymentMethod === 'upi' && 'UPI'}
                                                        {paymentMethod === 'card' && 'Credit/Debit Card'}
                                                    </p>
                                                </div>
                                                <button onClick={() => setStep(2)} className="text-cyan-600 text-sm font-medium">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                                        <div className="space-y-3 mb-6">
                                            {cart.items.map((item) => {
                                                const productId = getProductId(item.product);
                                                const key = item.variation
                                                    ? `${productId}-${item.variation}`
                                                    : productId;
                                                const itemPrice = item.price || item.product.price;

                                                return (
                                                    <div key={key} className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
                                                            <span className="text-2xl">{getCategoryEmoji(item.product.category)}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">{item.product.name}</div>
                                                            {item.variation && (
                                                                <div className="text-xs text-cyan-600">Size: {item.variation}</div>
                                                            )}
                                                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                                        </div>
                                                        <div className="font-semibold">₹{(itemPrice * item.quantity).toLocaleString()}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Error Display */}
                                        {orderError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                                <p className="text-red-600 text-sm">{orderError}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(2)} className="btn btn-secondary">
                                                Back
                                            </button>
                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={isSubmitting}
                                                className="btn btn-primary btn-lg flex-1 justify-center"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Placing Order...
                                                    </>
                                                ) : (
                                                    `Place Order — ₹${cartTotal.toLocaleString()}`
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                <div className="space-y-3 mb-4">
                                    {cart.items.slice(0, 3).map((item) => {
                                        const productId = getProductId(item.product);
                                        const key = item.variation
                                            ? `${productId}-${item.variation}`
                                            : productId;

                                        return (
                                            <div key={key} className="flex items-center gap-3 text-sm">
                                                <span className="text-lg">{getCategoryEmoji(item.product.category)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <span className="block truncate">{item.product.name}</span>
                                                    {item.variation && (
                                                        <span className="text-xs text-cyan-600 block">{item.variation}</span>
                                                    )}
                                                </div>
                                                <span className="text-gray-500">×{item.quantity}</span>
                                            </div>
                                        );
                                    })}
                                    {cart.items.length > 3 && (
                                        <p className="text-sm text-gray-500">+{cart.items.length - 3} more items</p>
                                    )}
                                </div>
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cartSubtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className={deliveryFee === 0 ? 'text-cyan-600' : 'text-gray-900'}>
                                            {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

