import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShoppingBag, Trash2, Plus, Minus, ChevronLeft, Lock, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../../src/contexts/CartContext';
import { getProductImage } from '../../src/data/local-images';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../src/lib/theme';
import MemberStatusCard from '../../src/components/MemberStatusCard';

export default function CartScreen() {
    const router = useRouter();
    const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

    // Calculate savings (demo value - 10% member discount)
    const memberDiscount = cartTotal * 0.1;
    const finalTotal = cartTotal - memberDiscount;
    const deliveryFee = cartTotal >= 500 ? 0 : 49;

    const renderCartItem = (item: typeof cart[0], index: number) => {
        const productImage = getProductImage(item.imageKey);

        return (
            <View key={item.id} style={[styles.cartItem, index === 0 && { marginTop: 0 }]}>
                {/* Bestseller Badge */}
                {index === 0 && (
                    <View style={styles.bestsellBadge}>
                        <Text style={styles.bestsellText}>BESTSELLER</Text>
                    </View>
                )}

                {/* Image */}
                <Image source={productImage} style={styles.itemImage} resizeMode="cover" />

                {/* Content */}
                <View style={styles.itemContent}>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                        {item.variation && (
                            <Text style={styles.itemVariation}>Size: {item.variation}</Text>
                        )}
                        {item.glazing && (
                            <Text style={[styles.itemVariation, { color: COLORS.primary }]}>Glazing: {item.glazing}%</Text>
                        )}
                        <View style={styles.itemPriceRow}>
                            {item.price === 0 ? (
                                <Text style={styles.priceOnRequest}>Price on Request</Text>
                            ) : (
                                <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                            )}
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        {/* Quantity */}
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => updateQuantity(item.productId, item.quantity - 1, item.variation, item.glazing)}
                            >
                                <Minus size={14} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            <View style={styles.quantityDisplay}>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.quantityButton, styles.quantityButtonPlus]}
                                onPress={() => updateQuantity(item.productId, item.quantity + 1, item.variation, item.glazing)}
                            >
                                <Plus size={14} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Delete Button */}
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeFromCart(item.productId, item.variation, item.glazing)}
                        >
                            <Trash2 size={16} color={COLORS.error} />
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
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

                {/* Header */}
                <SafeAreaView edges={['top']} style={styles.emptyHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.emptyHeaderTitle}>Cart</Text>
                    <View style={{ width: 40 }} />
                </SafeAreaView>

                {/* Empty State Content */}
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <ShoppingBag size={80} color={COLORS.primary} strokeWidth={1.5} />
                    </View>

                    <Text style={styles.emptyTitle}>Your cart is empty!</Text>
                    <Text style={styles.emptySubtitle}>
                        Browse our premium selection to discover fresh catches and quality meats.
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
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Your Cart</Text>
                    <TouchableOpacity onPress={clearCart}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Cart Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Member Status Card */}
                <MemberStatusCard
                    memberTier="Gold"
                    points={2840}
                    pointsToNext={160}
                    progressPercent={95}
                />

                {/* Cart Items */}
                <View style={styles.cartSection}>
                    <Text style={styles.sectionTitle}>{cartCount} Items</Text>
                    {cart.map((item, index) => renderCartItem(item, index))}
                </View>

                {/* Order Summary */}
                <View style={styles.summaryCard}>
                    {/* Layered paper effect */}
                    <View style={styles.paperLayer1} />
                    <View style={styles.paperLayer2} />

                    <View style={styles.summaryContent}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString()}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Member Discount (10%)</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{memberDiscount.toFixed(0)}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery</Text>
                            <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>₹{(finalTotal + deliveryFee).toFixed(0)}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 200 }} />
            </ScrollView>

            {/* Floating Checkout Bar */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <View style={styles.footerContent}>
                    <View style={styles.footerLeft}>
                        <Text style={styles.footerLabel}>Total</Text>
                        <Text style={styles.footerTotal}>
                            {cartTotal === 0 ? 'Price on Request' : `₹${(finalTotal + deliveryFee).toFixed(0)}`}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => router.push('/checkout/delivery-details')}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.checkoutGradient}
                        >
                            <Lock size={16} color={COLORS.white} />
                            <Text style={styles.checkoutButtonText}>Secure Checkout</Text>
                            <ArrowRight size={18} color={COLORS.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // Header styles
    header: {
        backgroundColor: COLORS.card,
        ...SHADOWS.soft,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingTop: SPACING.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    clearText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.primaryLight,
    },
    // ScrollView content
    scrollContent: {
        paddingBottom: 120,
    },
    // Cart Section
    cartSection: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
    },
    sectionTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    // Cart Items
    cartItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        marginTop: SPACING.md,
        position: 'relative',
        overflow: 'hidden',
        ...SHADOWS.soft,
    },
    bestsellBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: COLORS.accentWarm,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderBottomRightRadius: RADIUS.md,
    },
    bestsellText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 9,
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.background,
    },
    itemContent: {
        flex: 1,
        marginLeft: SPACING.lg,
        justifyContent: 'space-between',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 2,
        lineHeight: 22,
    },
    itemVariation: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    itemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.primary,
    },
    priceOnRequest: {
        fontFamily: FONTS.bodyBold,
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    quantityButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },
    quantityButtonPlus: {
        backgroundColor: COLORS.background,
    },
    quantityDisplay: {
        width: 36,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.card,
    },
    quantityText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
    },
    removeButton: {
        width: 32,
        height: 32,
        borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Order Summary Card
    summaryCard: {
        marginHorizontal: SPACING.lg,
        marginTop: SPACING['2xl'],
        position: 'relative',
    },
    paperLayer1: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: -8,
        bottom: -8,
        backgroundColor: COLORS.border,
        borderRadius: RADIUS.xl,
        transform: [{ rotate: '-2deg' }],
    },
    paperLayer2: {
        position: 'absolute',
        top: 4,
        left: 4,
        right: -4,
        bottom: -4,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        transform: [{ rotate: '-1deg' }],
        ...SHADOWS.soft,
    },
    summaryContent: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING['2xl'],
        ...SHADOWS.soft,
    },
    summaryTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: SPACING.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    summaryLabel: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    summaryValue: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.lg,
    },
    totalLabel: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.text,
    },
    totalValue: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.primary,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADIUS['2xl'],
        borderTopRightRadius: RADIUS['2xl'],
        ...SHADOWS.premium,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.lg,
        gap: SPACING.lg,
    },
    footerLeft: {
        flex: 1,
    },
    footerLabel: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    footerTotal: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.text,
    },
    checkoutButton: {
        flex: 1,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.button,
    },
    checkoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    checkoutButtonText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.white,
        fontSize: 15,
    },
    // Empty State
    emptyHeader: {
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.sm,
    },
    emptyHeaderTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.text,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING['3xl'],
        paddingBottom: 60,
    },
    emptyIconContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: COLORS.backgroundCool,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING['3xl'],
    },
    emptyTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 26,
        color: COLORS.text,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: FONTS.body,
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING['3xl'],
        maxWidth: 300,
    },
    shopButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING['4xl'],
        borderRadius: RADIUS.lg,
        ...SHADOWS.button,
    },
    shopButtonText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.white,
        fontSize: 16,
    },
});
