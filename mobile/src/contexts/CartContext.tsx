import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { ordersApi } from '../lib/api';
import { Product } from '../data/types';

// Cart item for local storage
interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    imageKey: string;
    unit: string;
    quantity: number;
    variation?: string;
    glazing?: number;
}

interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface CartContextType {
    cart: CartItem[];
    cartCount: number;
    cartTotal: number;
    loading: boolean;
    addToCart: (product: Product, variation?: string, glazing?: number) => void;
    removeFromCart: (id: string, variation?: string, glazing?: number) => void;
    updateQuantity: (id: string, quantity: number, variation?: string, glazing?: number) => void;
    clearCart: () => void;
    placeOrder: (shippingAddress: ShippingAddress, paymentMethod?: string) => Promise<{ success: boolean; orderId?: string; message?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load cart from storage on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart to storage whenever it changes
    useEffect(() => {
        if (!loading) {
            saveCart();
        }
    }, [cart, loading]);

    const loadCart = async () => {
        try {
            const savedCart = await storage.getItem(STORAGE_KEYS.CART);
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('[Cart] Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveCart = async () => {
        try {
            await storage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        } catch (error) {
            console.error('[Cart] Error saving cart:', error);
        }
    };

    const addToCart = useCallback((product: Product, variation?: string, glazing?: number) => {
        setCart((prevCart) => {
            let cartItemId = product.id;
            if (variation) cartItemId += `-${variation}`;
            if (glazing) cartItemId += `-${glazing}`;

            const existingItemIndex = prevCart.findIndex(
                (cartItem) => cartItem.id === cartItemId
            );

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += 1;
                return updatedCart;
            }

            // Get price from variation if available
            let price = product.price;
            let glazingPrices = product.glazingPrices;

            if (variation && product.variations) {
                const selectedVariation = product.variations.find(v => v.size === variation);
                if (selectedVariation) {
                    price = selectedVariation.price;
                    // Variant glazing prices take precedence if available
                    if (selectedVariation.glazingPrices) {
                        glazingPrices = selectedVariation.glazingPrices;
                    }
                }
            }

            // Apply glazing price if selected
            if (glazing && glazingPrices) {
                if (glazing === 20 && glazingPrices.glazing20) price = glazingPrices.glazing20;
                else if (glazing === 30 && glazingPrices.glazing30) price = glazingPrices.glazing30;
                else if (glazing === 50 && glazingPrices.glazing50) price = glazingPrices.glazing50;
            }

            return [...prevCart, {
                id: cartItemId,
                productId: product.id,
                name: product.name,
                price: price,
                imageKey: product.imageKey,
                unit: product.unit,
                quantity: 1,
                variation,
                glazing,
            }];
        });
    }, []);

    const removeFromCart = useCallback((id: string, variation?: string, glazing?: number) => {
        let cartItemId = id;
        if (variation) cartItemId += `-${variation}`;
        if (glazing) cartItemId += `-${glazing}`;

        setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number, variation?: string, glazing?: number) => {
        if (quantity <= 0) {
            removeFromCart(id, variation, glazing);
            return;
        }

        let cartItemId = id;
        if (variation) cartItemId += `-${variation}`;
        if (glazing) cartItemId += `-${glazing}`;

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const placeOrder = async (
        shippingAddress: ShippingAddress,
        paymentMethod: string = 'cash_on_delivery'
    ): Promise<{ success: boolean; orderId?: string; message?: string }> => {
        try {
            const items = cart.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
                variation: item.variation,
                glazing: item.glazing,
            }));

            const orderData = {
                items,
                shippingAddress,
                paymentMethod,
            };

            const response = await ordersApi.create(orderData);

            if (response.success && response.data?.order) {
                clearCart();
                return { success: true, orderId: response.data.order._id };
            }

            return { success: false, message: response.message || 'Failed to place order' };
        } catch (error: any) {
            console.error('[Cart] Place order error:', error);

            let message = error.message || 'Failed to place order';

            // Check for stock specific error (400) if message is generic
            if (error.status === 400 && message.includes('Invalid request')) {
                message = 'Order exceeds current stock';
            }

            return { success: false, message };
        }
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                cartTotal,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                placeOrder,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
