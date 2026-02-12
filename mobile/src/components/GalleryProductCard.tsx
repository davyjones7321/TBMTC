import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Eye, Plus } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';
import { Product } from '../contexts/ProductsContext';
import { getProductImage } from '../data/local-images';
import { useCart } from '../contexts/CartContext';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.7;

interface GalleryProductCardProps {
    product: Product;
    onPress: () => void;
    onQuickView?: () => void;
    badge?: 'bestseller' | 'new' | null;
}

const GalleryProductCard: React.FC<GalleryProductCardProps> = ({
    product,
    onPress,
    onQuickView,
    badge,
}) => {
    const { addToCart } = useCart();
    const localImage = getProductImage(product.imageKey);
    const imageSource = localImage || { uri: product.imageUrl };

    const hasVariations = product.variations && product.variations.length > 0;
    const [selectedSize, setSelectedSize] = useState(
        product.variations?.[0]?.size || ''
    );

    const getDisplayPrice = () => {
        if (selectedSize && product.variations) {
            const variation = product.variations.find(v => v.size === selectedSize);
            if (variation && variation.price > 0) return variation.price;
        }
        return product.price;
    };

    const handleAddToCart = () => {
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
        }, selectedSize || undefined);
    };

    const getBadgeStyle = () => {
        if (badge === 'bestseller') {
            return { backgroundColor: 'rgba(245, 158, 11, 0.9)' };
        }
        if (badge === 'new') {
            return { backgroundColor: 'rgba(14, 165, 233, 0.9)' };
        }
        return {};
    };

    const getBadgeText = () => {
        if (badge === 'bestseller') return 'BESTSELLER';
        if (badge === 'new') return 'NEW ARRIVAL';
        return '';
    };

    const displayPrice = getDisplayPrice();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* Background Image */}
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} resizeMode="cover" />

                {/* Gradient Overlay */}
                <View style={styles.gradientOverlay} />
            </View>

            {/* Quick View Button */}
            <TouchableOpacity
                style={styles.quickViewButton}
                onPress={onQuickView}
                activeOpacity={0.8}
            >
                <Eye size={24} color={COLORS.white} />
            </TouchableOpacity>

            {/* Badge */}
            {badge && (
                <View style={[styles.badge, getBadgeStyle()]}>
                    <Text style={styles.badgeText}>{getBadgeText()}</Text>
                </View>
            )}

            {/* Bottom Info Panel - Glass Effect */}
            <BlurView intensity={80} style={styles.infoPanel} tint="light">
                <View style={styles.infoContent}>
                    {/* Title */}
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>

                    {/* Description */}
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
                                        styles.sizeChip,
                                        selectedSize === variant.size && styles.sizeChipActive,
                                    ]}
                                    onPress={() => setSelectedSize(variant.size)}
                                >
                                    <Text
                                        style={[
                                            styles.sizeChipText,
                                            selectedSize === variant.size && styles.sizeChipTextActive,
                                        ]}
                                    >
                                        {variant.size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* Price and Add Button Row */}
                    <View style={styles.footer}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceLabel}>PRICE PER {product.unit?.toUpperCase()}</Text>
                            <Text style={styles.price}>₹{displayPrice.toLocaleString()}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddToCart}
                            activeOpacity={0.8}
                        >
                            <Plus size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: RADIUS['2xl'],
        overflow: 'hidden',
        marginHorizontal: 8,
        ...SHADOWS.floating,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))',
    },
    quickViewButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 20,
        left: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    infoPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    infoContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    productName: {
        fontFamily: FONTS.displayBold,
        fontSize: 28,
        color: COLORS.text,
        lineHeight: 34,
    },
    description: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: COLORS.textSecondary,
        letterSpacing: 1,
        marginBottom: 2,
    },
    price: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.text,
    },
    sizeScroll: {
        marginBottom: 8,
    },
    sizeScrollContent: {
        gap: 4,
    },
    sizeChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        marginRight: 4,
    },
    sizeChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sizeChipText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#374151',
    },
    sizeChipTextActive: {
        color: '#FFFFFF',
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.text,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.soft,
    },
});

export default GalleryProductCard;
