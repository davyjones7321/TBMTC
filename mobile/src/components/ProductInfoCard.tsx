import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Scale, Droplets, Leaf } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

type IconType = 'origin' | 'protein' | 'freshness' | 'sustainability';

interface ProductInfoCardProps {
    type: IconType;
    label: string;
    value: string;
}

const iconMap = {
    origin: Droplets,
    protein: Scale,
    freshness: Leaf,
    sustainability: Leaf,
};

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ type, label, value }) => {
    const IconComponent = iconMap[type] || Droplets;

    return (
        <View style={styles.container}>
            <IconComponent
                size={28}
                color={COLORS.secondary}
                style={{ opacity: 0.6 }}
            />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontFamily: FONTS.body,
        fontSize: 10,
        color: COLORS.textSecondary,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    value: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
    },
});

export default ProductInfoCard;
