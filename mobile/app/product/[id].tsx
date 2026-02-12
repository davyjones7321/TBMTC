import { useState, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag, Minus, Plus, ChevronLeft, Lock, Eye } from 'lucide-react-native';
import { useProducts } from '../../src/contexts/ProductsContext';
import { getProductImage } from '../../src/data/local-images';
import { useCart } from '../../src/contexts/CartContext';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../src/lib/theme';
import WeightSelector from '../../src/components/WeightSelector';
import ReviewsCarousel from '../../src/components/ReviewsCarousel';
import ChefNote from '../../src/components/ChefNote';
import ProductInfoCard from '../../src/components/ProductInfoCard';
import GlazingSelector from '../../src/components/GlazingSelector';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { addToCart } = useCart();
    const { products, loading, getProductById } = useProducts();
    const insets = useSafeAreaInsets();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
    const [selectedGlazing, setSelectedGlazing] = useState<number>(50);

    // Find product from ProductsContext (backend data)
    const product = useMemo(() => {
        return getProductById(id || '');
    }, [id, products]);

    // Initialize selected variation
    useMemo(() => {
        if (product?.variations && product.variations.length > 0 && !selectedVariation) {
            setSelectedVariation(product.variations[0].size);
        }
    }, [product]);

    const getCurrentPrice = () => {
        // Glazing logic
        if (product) {
            const isSeafood = ['Fish', 'Prawns', 'Seafood'].includes(product.category);
            let glazingPrices = product.glazingPrices;
            let basePrice = product.price;

            if (selectedVariation && product.variations) {
                const variation = product.variations.find(v => v.size === selectedVariation);
                if (variation) {
                    basePrice = variation.price;
                    if (variation.glazingPrices) {
                        glazingPrices = variation.glazingPrices;
                    }
                }
            }

            if (isSeafood && glazingPrices) {
                if (selectedGlazing === 20 && glazingPrices.glazing20) return glazingPrices.glazing20;
                if (selectedGlazing === 30 && glazingPrices.glazing30) return glazingPrices.glazing30;
                if (selectedGlazing === 50 && glazingPrices.glazing50) return glazingPrices.glazing50;
            }

            return basePrice;
        }
        return 0;
    };

    // Prepare weight options for the WeightSelector
    const weightOptions = useMemo(() => {
        if (!product?.variations || product.variations.length === 0) {
            return [
                { size: product?.unit || '1kg', label: 'Standard', price: product?.price || 0 },
            ];
        }
        return product.variations.map((v) => ({
            size: v.size,
            label: v.size,
            price: v.price,
        }));
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;

        if (product.variations && product.variations.length > 0 && !selectedVariation) {
            Alert.alert('Select Size', 'Please select a size before adding to cart');
            return;
        }

        // Create a cart-compatible product object
        const cartProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            unit: product.unit,
            category: product.category as any,
            imageKey: product.imageKey,
            freshness: product.freshness,
            variations: product.variations,
        };

        // Add to cart multiple times for quantity
        for (let i = 0; i < quantity; i++) {
            const isSeafood = ['Fish', 'Prawns', 'Seafood'].includes(product.category);
            // Only pass glazing if it is seafood and we have prices
            const glazing = isSeafood ? selectedGlazing : undefined;
            addToCart(cartProduct, selectedVariation || undefined, glazing);
        }

        Alert.alert(
            'Added to Cart',
            `${product.name} has been added to your cart`,
            [
                { text: 'Continue Shopping', style: 'cancel' },
                {
                    text: 'View Cart',
                    onPress: () => router.push('/(tabs)/cart'),
                },
            ]
        );
    };

    // Show loading while products are being fetched
    if (loading) {
        return (
            <View style={styles.errorContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading product...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Product Not Found</Text>
                <Text style={styles.errorSubtitle}>
                    The product you're looking for doesn't exist.
                </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Image handling
    const localImage = getProductImage(product.imageKey);
    const isPlaceholderUrl = product.imageUrl?.includes('placeholder.com') || product.imageUrl?.includes('via.placeholder');
    const hasRemoteImage = product.imageUrl && product.imageUrl.startsWith('http') && !isPlaceholderUrl;
    const productImage = hasRemoteImage ? { uri: product.imageUrl } : localImage;
    const currentPrice = getCurrentPrice();
    const totalPrice = currentPrice * quantity;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Premium Floating Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerBackButton}
                >
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerPrice}>₹{totalPrice.toLocaleString()}</Text>
                </View>

                <TouchableOpacity style={styles.secureButton}>
                    <Lock size={14} color={COLORS.white} />
                    <Text style={styles.secureText}>SECURE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={productImage}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.imageGradient}
                    />

                    {/* Premium Badge */}
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>PREMIUM CATCH</Text>
                    </View>

                    {/* Quick View Button */}
                    <TouchableOpacity style={styles.quickViewButton}>
                        <Eye size={20} color={COLORS.white} />
                    </TouchableOpacity>

                    {/* Freshness Badge */}
                    <View style={styles.freshnessBadge}>
                        <Text style={styles.freshnessText}>{product.freshness}</Text>
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    {/* Category */}
                    <Text style={styles.category}>{product.category}</Text>

                    {/* Name */}
                    <Text style={styles.productName}>{product.name}</Text>

                    {/* Price */}
                    <View style={styles.priceRow}>
                        {currentPrice === 0 ? (
                            <Text style={styles.priceOnRequest}>Price on Request</Text>
                        ) : (
                            <Text style={styles.price}>₹{currentPrice}</Text>
                        )}
                        <Text style={styles.unit}>per {product.unit}</Text>
                    </View>

                    {/* Weight Selector */}
                    {weightOptions.length > 1 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Select Size</Text>
                            <WeightSelector
                                options={weightOptions}
                                selectedSize={selectedVariation || weightOptions[0].size}
                                onSelect={setSelectedVariation}
                            />
                        </View>
                    )}

                    {/* Glazing Selector */}
                    {product && ['Fish', 'Prawns', 'Seafood'].includes(product.category) && (
                        (selectedVariation ?
                            product.variations?.find(v => v.size === selectedVariation)?.glazingPrices
                            : product.glazingPrices) || product.glazingPrices
                    ) && (
                            <GlazingSelector
                                selectedGlazing={selectedGlazing}
                                onSelect={setSelectedGlazing}
                                prices={
                                    (selectedVariation ?
                                        product.variations?.find(v => v.size === selectedVariation)?.glazingPrices
                                        : product.glazingPrices) || product.glazingPrices
                                }
                            />
                        )}

                    {/* Quantity Selector */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Plus size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Product Info Cards */}
                    <View style={styles.infoCardsRow}>
                        <ProductInfoCard type="origin" label="ORIGIN" value="Wild Caught" />
                        <ProductInfoCard type="protein" label="PROTEIN" value="22g/100g" />
                    </View>
                    {product.piecesPerKg && (
                        <View style={styles.piecesPerKgContainer}>
                            <Text style={styles.piecesPerKgLabel}>PIECES PER KG</Text>
                            <Text style={styles.piecesPerKgValue}>~{product.piecesPerKg} pcs</Text>
                        </View>
                    )}

                    {/* Description */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                </View>

                {/* Reviews Carousel */}
                <ReviewsCarousel />

                {/* Chef's Note */}
                <ChefNote />

                {/* Bottom spacing */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Floating Add to Cart Bar */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.footerContent}>
                    <View style={styles.footerPrice}>
                        <Text style={styles.footerPriceLabel}>Total</Text>
                        <Text style={styles.footerPriceValue}>₹{totalPrice.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={handleAddToCart}
                        activeOpacity={0.8}
                    >
                        <ShoppingBag size={20} color={COLORS.white} />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.95)',
        ...SHADOWS.soft,
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.soft,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerPrice: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.text,
    },
    secureButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
        gap: 4,
    },
    secureText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING['2xl'],
    },
    errorTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.error,
        marginBottom: SPACING.sm,
    },
    errorSubtitle: {
        fontFamily: FONTS.body,
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING['2xl'],
    },
    loadingText: {
        fontFamily: FONTS.body,
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.lg,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING['2xl'],
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
    },
    backButtonText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.white,
    },
    imageContainer: {
        height: 340,
        backgroundColor: COLORS.card,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 150,
    },
    premiumBadge: {
        position: 'absolute',
        top: 100,
        left: SPACING.lg,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
    },
    premiumBadgeText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 11,
        color: COLORS.white,
        letterSpacing: 1,
    },
    quickViewButton: {
        position: 'absolute',
        top: 100,
        right: SPACING.lg,
        width: 44,
        height: 44,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    freshnessBadge: {
        position: 'absolute',
        bottom: SPACING.lg,
        left: SPACING.lg,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: RADIUS.md,
        ...SHADOWS.soft,
    },
    freshnessText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: COLORS.success,
    },
    infoContainer: {
        padding: SPACING['2xl'],
        paddingBottom: 0,
    },
    category: {
        fontFamily: FONTS.bodyBold,
        fontSize: 13,
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.xs,
    },
    productName: {
        fontFamily: FONTS.displayBold,
        fontSize: 28,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: SPACING['2xl'],
    },
    price: {
        fontFamily: FONTS.displayBold,
        fontSize: 32,
        color: COLORS.primary,
    },
    priceOnRequest: {
        fontFamily: FONTS.bodyBold,
        fontSize: 18,
        color: COLORS.text,
    },
    unit: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: SPACING.sm,
    },
    sectionContainer: {
        marginBottom: SPACING['2xl'],
    },
    sectionTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    infoCardsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    piecesPerKgContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: SPACING['2xl'],
        gap: SPACING.sm,
    },
    piecesPerKgLabel: {
        fontFamily: FONTS.bodyBold,
        fontSize: 11,
        color: COLORS.textSecondary,
        letterSpacing: 1,
    },
    piecesPerKgValue: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.primary,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 48,
        height: 48,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontFamily: FONTS.displayMedium,
        paddingHorizontal: SPACING['2xl'],
        fontSize: 22,
        color: COLORS.text,
    },
    description: {
        fontFamily: FONTS.body,
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.card,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        borderTopLeftRadius: RADIUS['2xl'],
        borderTopRightRadius: RADIUS['2xl'],
        ...SHADOWS.premium,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.lg,
    },
    footerPrice: {
        flex: 1,
    },
    footerPriceLabel: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    footerPriceValue: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.text,
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: RADIUS.lg,
        gap: 8,
        ...SHADOWS.button,
    },
    addToCartText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.white,
        fontSize: 16,
    },
});

