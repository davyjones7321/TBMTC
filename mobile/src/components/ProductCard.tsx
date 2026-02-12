import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { ShoppingCart, Check, Heart, Plus } from 'lucide-react-native';
import { Product } from '../contexts/ProductsContext';
import { getProductImage } from '../data/local-images';
import { useCart } from '../contexts/CartContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const { addToCart } = useCart();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSize, setSelectedSize] = useState(
        product.variations?.[0]?.size || ''
    );

    // Priority: 1. Local image if exists, 2. Remote URL (if not placeholder), 3. Fallback placeholder
    const localImage = getProductImage(product.imageKey);
    const isPlaceholderUrl = product.imageUrl?.includes('placeholder.com') || product.imageUrl?.includes('via.placeholder');

    // Check if local image exists (not the fallback placeholder)
    const hasLocalImage = localImage !== getProductImage('__nonexistent__');

    const imageSource = hasLocalImage
        ? localImage  // Use bundled local image
        : (product.imageUrl && product.imageUrl.startsWith('http') && !isPlaceholderUrl)
            ? { uri: product.imageUrl }  // Use remote URL if not placeholder
            : localImage;  // Fallback to placeholder

    const handleAddToCart = () => {
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
        addToCart(cartProduct, selectedSize || undefined);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageGradient}
                />

                {/* Fresh Badge - Top Left */}
                <View style={styles.freshBadge}>
                    <Text style={styles.freshText}>{product.freshness || 'Fresh'}</Text>
                </View>

                {/* Category Badge - Top Right */}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <Heart
                        size={20}
                        color={isFavorite ? COLORS.coralLight : COLORS.charcoal}
                        fill={isFavorite ? COLORS.coralLight : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {product.description}
                </Text>

                {/* Price */}
                <View style={styles.priceRow}>
                    {product.price === 0 ? (
                        <Text style={styles.priceOnRequest}>Price on Request</Text>
                    ) : (
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>₹{product.price}</Text>
                            <Text style={styles.unit}>/{product.unit}</Text>
                        </View>
                    )}
                </View>

                {/* Size Selector if variations exist */}
                {product.variations && product.variations.length > 0 && (
                    <View style={styles.sizeContainer}>
                        {product.variations.map((variant) => (
                            <TouchableOpacity
                                key={variant.size}
                                style={[
                                    styles.sizeButton,
                                    selectedSize === variant.size && styles.sizeButtonActive,
                                ]}
                                onPress={() => setSelectedSize(variant.size)}
                            >
                                <Text
                                    style={[
                                        styles.sizeText,
                                        selectedSize === variant.size && styles.sizeTextActive,
                                    ]}
                                >
                                    {variant.size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {/* Stock Warning */}
                {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
                    <Text style={styles.stockWarning}>
                        Stock: {product.stockQuantity} items left
                    </Text>
                )}
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
                style={[
                    styles.addButton,
                    showSuccess && styles.addButtonSuccess,
                    !product.inStock && styles.addButtonDisabled
                ]}
                onPress={handleAddToCart}
                activeOpacity={0.8}
                disabled={!product.inStock || showSuccess}
            >
                {showSuccess ? (
                    <>
                        <Check size={18} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Added!</Text>
                    </>
                ) : !product.inStock ? (
                    <>
                        <Text style={styles.addButtonText}>Out of Stock</Text>
                    </>
                ) : (
                    <>
                        <Plus size={18} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Add to Cart</Text>
                    </>
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        margin: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    imageContainer: {
        height: 180,
        backgroundColor: '#F5F5F5',
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
        height: 80,
    },
    freshBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    freshText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.success,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoryBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    favoriteButton: {
        position: 'absolute',
        top: 44,
        right: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        padding: 14,
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 12,
        color: COLORS.textSecondary,
        lineHeight: 17,
        marginBottom: 10,
    },
    priceRow: {
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
    },
    unit: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 2,
    },
    priceOnRequest: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    stockWarning: {
        fontSize: 11,
        color: '#E53935', // Red for urgency
        fontWeight: '600',
        marginTop: 4,
    },
    // Size Selector
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    sizeButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sizeButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sizeText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#374151',
    },
    sizeTextActive: {
        color: '#FFFFFF',
    },
    // Add Button
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        marginHorizontal: 14,
        marginBottom: 14,
        borderRadius: 16,
        gap: 6,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonSuccess: {
        backgroundColor: COLORS.success,
        shadowColor: COLORS.success,
    },
    addButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowColor: 'transparent',
        elevation: 0,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ProductCard;
