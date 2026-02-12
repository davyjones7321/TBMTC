import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../lib/theme';

interface GlazingPrices {
    glazing20?: number;
    glazing30?: number;
    glazing50?: number;
}

interface GlazingSelectorProps {
    selectedGlazing: number;
    onSelect: (glazing: number) => void;
    prices?: GlazingPrices;
}

export default function GlazingSelector({ selectedGlazing, onSelect, prices }: GlazingSelectorProps) {
    const options = [
        { percentage: 20, price: prices?.glazing20 },
        { percentage: 30, price: prices?.glazing30 },
        { percentage: 50, price: prices?.glazing50 },
    ].filter(opt => opt.price !== undefined && opt.price !== null);

    if (options.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Glazing</Text>
            <View style={styles.optionsRow}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.percentage}
                        onPress={() => onSelect(option.percentage)}
                        style={[
                            styles.optionButton,
                            selectedGlazing === option.percentage && styles.selectedOption
                        ]}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedGlazing === option.percentage && styles.selectedOptionText
                        ]}>
                            {option.percentage}%
                        </Text>
                        <Text style={[
                            styles.priceText,
                            selectedGlazing === option.percentage && styles.selectedPriceText
                        ]}>
                            ₹{option.price}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.subtitle}>
                *Glazing percentage refers to the protective ice coating details.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING['2xl'],
    },
    title: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    optionButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        minWidth: 80,
    },
    selectedOption: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    selectedOptionText: {
        color: COLORS.white,
    },
    priceText: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    selectedPriceText: {
        color: 'rgba(255,255,255,0.9)',
    },
    subtitle: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
});
