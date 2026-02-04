import { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart, Minus, Plus, ChevronLeft } from 'lucide-react-native';
import { useProducts } from '../../src/contexts/ProductsContext';
import { getProductImage } from '../../src/data/local-images';
import { useCart } from '../../src/contexts/CartContext';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { addToCart } = useCart();
    const { products, loading, getProductById } = useProducts();
    const insets = useSafeAreaInsets();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

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
        if (selectedVariation && product?.variations) {
            const variation = product.variations.find(v => v.size === selectedVariation);
            return variation?.price || product.price;
        }
        return product?.price || 0;
    };

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
            addToCart(cartProduct, selectedVariation || undefined);
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
                <ActivityIndicator size="large" color="#bf002d" />
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

    // Image handling: prefer backend URL, fallback to local image
    const localImage = getProductImage(product.imageKey);
    const isPlaceholderUrl = product.imageUrl?.includes('placeholder.com') || product.imageUrl?.includes('via.placeholder');
    const hasRemoteImage = product.imageUrl && product.imageUrl.startsWith('http') && !isPlaceholderUrl;

    const productImage = hasRemoteImage
        ? { uri: product.imageUrl }
        : localImage;
    const currentPrice = getCurrentPrice();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Custom Header with Safe Area handling */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerBackButton}
                >
                    <ChevronLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {product.name}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={productImage}
                        style={styles.image}
                        resizeMode="cover"
                    />
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

                    {/* Variations */}
                    {product.variations && product.variations.length > 0 && (
                        <View style={styles.variationsContainer}>
                            <Text style={styles.sectionTitle}>Select Size</Text>
                            <View style={styles.variationsList}>
                                {product.variations.map((variation) => (
                                    <TouchableOpacity
                                        key={variation.size}
                                        style={[
                                            styles.variationButton,
                                            selectedVariation === variation.size && styles.variationButtonActive,
                                        ]}
                                        onPress={() => setSelectedVariation(variation.size)}
                                    >
                                        <Text
                                            style={[
                                                styles.variationText,
                                                selectedVariation === variation.size && styles.variationTextActive,
                                            ]}
                                        >
                                            {variation.size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus size={20} color="#4B5563" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Plus size={20} color="#4B5563" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Add to Cart Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                    activeOpacity={0.8}
                >
                    <ShoppingCart size={24} color="#FFFFFF" />
                    <Text style={styles.addToCartText}>
                        Add to Cart {currentPrice > 0 ? `- ₹${(currentPrice * quantity).toFixed(2)}` : ''}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#bf002d',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 14,
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    headerSpacer: {
        width: 40,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#EF4444',
        marginBottom: 8,
    },
    errorSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 16,
    },
    backButton: {
        backgroundColor: '#bf002d',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    imageContainer: {
        height: 280,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    freshnessBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    freshnessText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    infoContainer: {
        padding: 24,
        paddingBottom: 120,
    },
    category: {
        fontSize: 14,
        fontWeight: '600',
        color: '#bf002d',
        marginBottom: 4,
    },
    productName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 24,
    },
    price: {
        fontSize: 32,
        fontWeight: '700',
        color: '#bf002d',
    },
    priceOnRequest: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    unit: {
        fontSize: 14,
        color: '#9CA3AF',
        marginLeft: 8,
    },
    variationsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    variationsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    variationButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    variationButtonActive: {
        borderColor: '#bf002d',
        backgroundColor: '#FEF2F2',
    },
    variationText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    variationTextActive: {
        color: '#bf002d',
    },
    quantityContainer: {
        marginBottom: 24,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 44,
        height: 44,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        paddingHorizontal: 24,
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
    },
    descriptionContainer: {
        marginBottom: 24,
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#bf002d',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
});
