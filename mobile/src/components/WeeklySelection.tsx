import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';
import { Product } from '../contexts/ProductsContext';
import { getProductImage } from '../data/local-images';
import { useCart } from '../contexts/CartContext';

interface WeeklySelectionProps {
    products: Product[];
    onProductPress: (productId: string) => void;
}

const WeeklySelection: React.FC<WeeklySelectionProps> = ({ products, onProductPress }) => {
    const { addToCart } = useCart();

    // Track selected size per product
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

    // Get first 5 featured products, or fallback to first 5 if none featured
    const featuredList = products.filter(p => p.isFeatured);
    const featuredProducts = (featuredList.length > 0 ? featuredList : products).slice(0, 5);

    const getSelectedSize = (product: Product) => {
        return selectedSizes[product.id] || product.variations?.[0]?.size || '';
    };

    const getDisplayPrice = (product: Product) => {
        const size = getSelectedSize(product);
        if (size && product.variations) {
            const variation = product.variations.find(v => v.size === size);
            if (variation && variation.price > 0) return variation.price;
        }
        return product.price;
    };

    const handleSizeSelect = (productId: string, size: string) => {
        setSelectedSizes(prev => ({ ...prev, [productId]: size }));
    };

    const handleAddToCart = (product: Product) => {
        const size = getSelectedSize(product);
        addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            unit: product.unit,
            category: product.category as any,
            imageKey: product.imageKey,
            freshness: product.freshness,
            variations: product.variations,
        }, size || undefined);
    };

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Weekly</Text>
                    <Text style={styles.titleItalic}>Selection</Text>
                </View>
            </View>

            {/* Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {featuredProducts.map((product, index) => {
                    const localImage = getProductImage(product.imageKey);
                    const imageSource = localImage || { uri: product.imageUrl };
                    const isBestseller = index === 0;
                    const hasVariations = product.variations && product.variations.length > 0;
                    const displayPrice = getDisplayPrice(product);
                    const currentSize = getSelectedSize(product);

                    return (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.card}
                            onPress={() => onProductPress(product.id)}
                            activeOpacity={0.9}
                        >
                            {/* Image */}
                            <View style={styles.imageContainer}>
                                <Image source={imageSource} style={styles.image} resizeMode="cover" />

                                {/* Bestseller Badge */}
                                {isBestseller && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>BESTSELLER</Text>
                                    </View>
                                )}
                            </View>

                            {/* Content */}
                            <View style={styles.content}>
                                <View style={styles.row}>
                                    <Text style={styles.productName} numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.price}>
                                        {displayPrice > 0 ? `₹${displayPrice}` : ''}
                                    </Text>
                                </View>
                                <Text style={styles.description} numberOfLines={1}>
                                    {product.description}
                                </Text>

                                {/* Size Selector */}
                                {hasVariations && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.sizeScroll}
                                        contentContainerStyle={styles.sizeScrollContent}
                                    >
                                        {product.variations!.map((variant) => (
                                            <TouchableOpacity
                                                key={variant.size}
                                                style={[
                                                    styles.sizeButton,
                                                    currentSize === variant.size && styles.sizeButtonActive,
                                                ]}
                                                onPress={() => handleSizeSelect(product.id, variant.size)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.sizeText,
                                                        currentSize === variant.size && styles.sizeTextActive,
                                                    ]}
                                                >
                                                    {variant.size}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}

                                {/* Add to Cart Button */}
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => handleAddToCart(product)}
                                    activeOpacity={0.8}
                                >
                                    <Plus size={16} color={COLORS.white} />
                                    <Text style={styles.addButtonText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 28,
        color: COLORS.text,
        lineHeight: 32,
    },
    titleItalic: {
        fontFamily: FONTS.displayItalic,
        fontSize: 28,
        color: COLORS.text,
        fontStyle: 'italic',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    card: {
        width: 200,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        marginHorizontal: 6,
        overflow: 'hidden',
        ...SHADOWS.soft,
    },
    imageContainer: {
        height: 140,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: COLORS.accentWarm,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    badgeText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 8,
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    content: {
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    productName: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    price: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
    },
    description: {
        fontFamily: FONTS.body,
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    sizeScroll: {
        marginBottom: 8,
    },
    sizeScrollContent: {
        gap: 4,
    },
    sizeButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 4,
    },
    sizeButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sizeText: {
        fontSize: 9,
        fontWeight: '500',
        color: '#374151',
    },
    sizeTextActive: {
        color: '#FFFFFF',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.secondary,
        paddingVertical: 10,
        borderRadius: RADIUS.md,
        gap: 6,
    },
    addButtonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: COLORS.white,
    },
});

export default WeeklySelection;
