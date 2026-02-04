import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShoppingBag, Trash2, Plus, Minus, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useCart } from '../../src/contexts/CartContext';
import { getProductImage } from '../../src/data/local-images';

// Premium colors - Coral/Teal palette
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    teal: '#4A9B9B',
    charcoal: '#2D3436',
    slate: '#636E72',
    cream: '#FFF8F0',
    creamTint: '#FFF5E6',
};

export default function CartScreen() {
    const router = useRouter();
    const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

    const renderCartItem = ({ item }: { item: typeof cart[0] }) => {
        const productImage = getProductImage(item.imageKey);

        return (
            <View style={styles.cartItem}>
                {/* Image */}
                <Image source={productImage} style={styles.itemImage} resizeMode="cover" />

                {/* Content */}
                <View style={styles.itemContent}>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                        {item.variation && (
                            <Text style={styles.itemVariation}>Size: {item.variation}</Text>
                        )}
                        <View style={styles.itemPriceRow}>
                            {item.price === 0 ? (
                                <Text style={styles.priceOnRequest}>Price on Request</Text>
                            ) : (
                                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                            )}
                        </View>
                        <Text style={styles.itemUnit}>{item.unit}</Text>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        {/* Quantity */}
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => updateQuantity(item.id.split('-')[0], item.quantity - 1, item.variation)}
                            >
                                <Minus size={14} color={COLORS.slate} />
                            </TouchableOpacity>

                            <View style={styles.quantityDisplay}>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.quantityButton, styles.quantityButtonPlus]}
                                onPress={() => updateQuantity(item.id.split('-')[0], item.quantity + 1, item.variation)}
                            >
                                <Plus size={14} color={COLORS.coral} />
                            </TouchableOpacity>
                        </View>

                        {/* Delete Button */}
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeFromCart(item.id.split('-')[0], item.variation)}
                        >
                            <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // Empty Cart State
    if (cart.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

                {/* Header */}
                <SafeAreaView edges={['top']} style={styles.emptyHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={COLORS.charcoal} />
                    </TouchableOpacity>
                    <Text style={styles.emptyHeaderTitle}>Cart</Text>
                    <View style={{ width: 40 }} />
                </SafeAreaView>

                {/* Empty State Content */}
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <ShoppingBag size={80} color={COLORS.coral} strokeWidth={1.5} />
                        <Text style={styles.emptyEmoji}>😢</Text>
                    </View>

                    <Text style={styles.emptyTitle}>Your cart is hungry!</Text>
                    <Text style={styles.emptySubtitle}>
                        It looks like you haven't added any delicious items yet. Browse our fresh selection to get started.
                    </Text>

                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/home')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={COLORS.charcoal} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Your Cart</Text>
                    <TouchableOpacity onPress={clearCart}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Cart Items */}
            <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cartList}
                showsVerticalScrollIndicator={false}
            />

            {/* Footer with Total and Checkout */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <View style={styles.footerContent}>
                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Total ({cartCount} items)</Text>
                        <Text style={styles.totalAmount}>
                            {cartTotal === 0 ? 'Price on Request' : `₹${cartTotal.toLocaleString()}`}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => router.push('/checkout/delivery-details')}
                    >
                        <Text style={styles.checkoutButtonText}>Checkout Now</Text>
                        <ArrowRight size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    // Header styles
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.charcoal,
        letterSpacing: -0.5,
    },
    clearText: {
        fontSize: 15,
        color: COLORS.coralLight,
        fontWeight: '600',
    },
    // Cart List
    cartList: {
        padding: 16,
        paddingBottom: 220,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
    },
    itemImage: {
        width: 88,
        height: 88,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
    },
    itemContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.charcoal,
        marginBottom: 2,
        lineHeight: 22,
    },
    itemVariation: {
        fontSize: 12,
        color: COLORS.slate,
        marginBottom: 4,
    },
    itemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.coral,
    },
    priceOnRequest: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.slate,
    },
    itemUnit: {
        fontSize: 11,
        color: COLORS.slate,
        marginTop: 2,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    quantityButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cream,
    },
    quantityButtonPlus: {
        backgroundColor: COLORS.cream,
    },
    quantityDisplay: {
        width: 40,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.charcoal,
    },
    removeButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 80, // Raised above the tab bar
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
        paddingBottom: 24,
    },
    footerContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    totalSection: {
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 14,
        color: COLORS.slate,
        fontWeight: '500',
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.charcoal,
        letterSpacing: -1,
    },
    checkoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.coral,
        paddingVertical: 18,
        borderRadius: 16,
        gap: 8,
        shadowColor: COLORS.coral,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    // Empty State
    emptyHeader: {
        backgroundColor: COLORS.cream,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    emptyHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.charcoal,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 60,
    },
    emptyIconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.creamTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    emptyEmoji: {
        fontSize: 40,
        position: 'absolute',
        top: 50,
        right: 40,
    },
    emptyTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    emptySubtitle: {
        fontSize: 15,
        color: COLORS.slate,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        maxWidth: 300,
    },
    shopButton: {
        backgroundColor: COLORS.coral,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 16,
        shadowColor: COLORS.coral,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    shopButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
