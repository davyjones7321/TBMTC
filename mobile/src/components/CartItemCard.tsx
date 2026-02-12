import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';
import { getProductImage } from '../data/local-images';

interface CartItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    unit?: string;
    imageKey?: string;
    imageUrl?: string;
    variant?: string;
    isBestseller?: boolean;
}

interface CartItemCardProps {
    item: CartItem;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}) => {
    const localImage = item.imageKey ? getProductImage(item.imageKey) : null;
    const imageSource = localImage || { uri: item.imageUrl };

    return (
        <View style={styles.container}>
            {/* Swipe Delete Hint */}
            <TouchableOpacity style={styles.deleteHint} onPress={onRemove}>
                <Trash2 size={20} color={COLORS.error} />
            </TouchableOpacity>

            <View style={styles.content}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.image} resizeMode="cover" />

                    {/* Bestseller Badge */}
                    {item.isBestseller && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>BESTSELLER</Text>
                        </View>
                    )}
                </View>

                {/* Details */}
                <View style={styles.details}>
                    <View style={styles.header}>
                        <View style={styles.titleSection}>
                            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.variant} numberOfLines={1}>
                                {item.description || `${item.variant || ''} • ${item.unit || ''}`}
                            </Text>
                        </View>
                        <Text style={styles.price}>₹{item.price}</Text>
                    </View>

                    {/* Quantity Controls */}
                    <View style={styles.footer}>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={onDecrease}
                                activeOpacity={0.7}
                            >
                                <Minus size={14} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            <Text style={styles.quantity}>{item.quantity}</Text>

                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={onIncrease}
                                activeOpacity={0.7}
                            >
                                <Plus size={14} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Dotted line decoration */}
                        <View style={styles.dottedLine} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        marginHorizontal: 16,
        marginBottom: 12,
        overflow: 'hidden',
        position: 'relative',
        ...SHADOWS.soft,
    },
    deleteHint: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 60,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: RADIUS.lg,
        borderBottomRightRadius: RADIUS.lg,
    },
    content: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        padding: 12,
        gap: 16,
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: COLORS.accentWarm,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderBottomRightRadius: RADIUS.sm,
    },
    badgeText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 7,
        color: COLORS.white,
        letterSpacing: 0.3,
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleSection: {
        flex: 1,
        marginRight: 8,
    },
    name: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 4,
    },
    variant: {
        fontFamily: FONTS.body,
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    price: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.text,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.full,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.soft,
    },
    quantity: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
        minWidth: 24,
        textAlign: 'center',
    },
    dottedLine: {
        width: 48,
        height: 1,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
        borderStyle: 'dotted',
    },
});

export default CartItemCard;
