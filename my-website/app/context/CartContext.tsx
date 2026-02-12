'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, LegacyProduct, CartItem, CartState } from '@/app/types';

// Helper to get product ID (handles both MongoDB _id and legacy id)
function getProductId(product: Product | LegacyProduct): string {
    return '_id' in product ? product._id : product.id;
}

// Helper to get cart item key (combines product ID, variation and glazing)
function getCartItemKey(productId: string, variation?: string, glazing?: number): string {
    let key = productId;
    if (variation) key += `-${variation}`;
    if (glazing) key += `-${glazing}`;
    return key;
}

// Action Types
type CartAction =
    | { type: 'ADD_ITEM'; payload: { product: Product | LegacyProduct; variation?: string; price?: number; glazing?: number } }
    | { type: 'REMOVE_ITEM'; payload: { productId: string; variation?: string; glazing?: number } }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variation?: string; glazing?: number; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'OPEN_CART' }
    | { type: 'CLOSE_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] };

// Initial State
const initialState: CartState = {
    items: [],
    isOpen: false,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { product, variation, price, glazing } = action.payload;
            const productId = getProductId(product);
            const itemKey = getCartItemKey(productId, variation, glazing);

            const existingItemIndex = state.items.findIndex(item => {
                const existingId = getProductId(item.product);
                const existingKey = getCartItemKey(existingId, item.variation, item.glazing);
                return existingKey === itemKey;
            });

            if (existingItemIndex > -1) {
                // Item exists, increment quantity
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1,
                };
                return { ...state, items: updatedItems, isOpen: true };
            }

            // New item, add to cart
            return {
                ...state,
                items: [...state.items, {
                    product,
                    quantity: 1,
                    variation,
                    price: price || product.price,
                    glazing,
                }],
                isOpen: true,
            };
        }

        case 'REMOVE_ITEM': {
            const { productId, variation, glazing } = action.payload;
            const itemKey = getCartItemKey(productId, variation, glazing);
            return {
                ...state,
                items: state.items.filter(item => {
                    const existingId = getProductId(item.product);
                    const existingKey = getCartItemKey(existingId, item.variation, item.glazing);
                    return existingKey !== itemKey;
                }),
            };
        }

        case 'UPDATE_QUANTITY': {
            const { productId, variation, glazing, quantity } = action.payload;
            const itemKey = getCartItemKey(productId, variation, glazing);

            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(item => {
                        const existingId = getProductId(item.product);
                        const existingKey = getCartItemKey(existingId, item.variation, item.glazing);
                        return existingKey !== itemKey;
                    }),
                };
            }

            return {
                ...state,
                items: state.items.map(item => {
                    const existingId = getProductId(item.product);
                    const existingKey = getCartItemKey(existingId, item.variation, item.glazing);
                    return existingKey === itemKey
                        ? { ...item, quantity }
                        : item;
                }),
            };
        }

        case 'CLEAR_CART':
            return { ...state, items: [] };

        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };

        case 'OPEN_CART':
            return { ...state, isOpen: true };

        case 'CLOSE_CART':
            return { ...state, isOpen: false };

        case 'LOAD_CART':
            return { ...state, items: action.payload };

        default:
            return state;
    }
}

// Context Type
interface CartContextType {
    cart: CartState;
    addToCart: (product: Product | LegacyProduct, variation?: string, price?: number, glazing?: number) => void;
    removeFromCart: (productId: string, variation?: string, glazing?: number) => void;
    updateQuantity: (productId: string, quantity: number, variation?: string, glazing?: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    cartTotal: number;
    cartSubtotal: number;
    deliveryFee: number;
    cartCount: number;
    meetsMinimumOrder: boolean;
    freeDeliveryRemaining: number;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local Storage Key
const CART_STORAGE_KEY = 'jhom-foods-cart';

// Business Rules
const MINIMUM_ORDER_VALUE = 300;
const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 50;

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    dispatch({ type: 'LOAD_CART', payload: parsedCart });
                }
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cart.items]);

    // Actions
    const addToCart = (product: Product | LegacyProduct, variation?: string, price?: number, glazing?: number) => {
        dispatch({ type: 'ADD_ITEM', payload: { product, variation, price, glazing } });
    };

    const removeFromCart = (productId: string, variation?: string, glazing?: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { productId, variation, glazing } });
    };

    const updateQuantity = (productId: string, quantity: number, variation?: string, glazing?: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variation, glazing, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const toggleCart = () => {
        dispatch({ type: 'TOGGLE_CART' });
    };

    const openCart = () => {
        dispatch({ type: 'OPEN_CART' });
    };

    const closeCart = () => {
        dispatch({ type: 'CLOSE_CART' });
    };

    // Computed Values
    const cartSubtotal = cart.items.reduce((total, item) => {
        const itemPrice = item.price || item.product.price;
        return total + itemPrice * item.quantity;
    }, 0);

    const deliveryFee = cartSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const cartTotal = cartSubtotal + deliveryFee;
    const meetsMinimumOrder = cartSubtotal >= MINIMUM_ORDER_VALUE;
    const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);

    const cartCount = cart.items.reduce(
        (count, item) => count + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleCart,
                openCart,
                closeCart,
                cartTotal,
                cartSubtotal,
                deliveryFee,
                cartCount,
                meetsMinimumOrder,
                freeDeliveryRemaining,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Custom Hook
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

