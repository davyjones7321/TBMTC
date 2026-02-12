import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

interface WeightOption {
    size: string;
    label?: string;
    price: number;
}

interface WeightSelectorProps {
    options: WeightOption[];
    selectedSize: string;
    onSelect: (size: string) => void;
}

const WeightSelector: React.FC<WeightSelectorProps> = ({
    options,
    selectedSize,
    onSelect,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {options.map((option) => {
                    const isSelected = selectedSize === option.size;
                    return (
                        <TouchableOpacity
                            key={option.size}
                            style={[
                                styles.chip,
                                isSelected && styles.chipActive,
                            ]}
                            onPress={() => onSelect(option.size)}
                            activeOpacity={0.7}
                        >
                            {/* Size label */}
                            <Text
                                style={[
                                    styles.sizeText,
                                    isSelected && styles.sizeTextActive,
                                ]}
                            >
                                {option.size}
                            </Text>

                            {/* Price */}
                            {option.price > 0 && (
                                <Text
                                    style={[
                                        styles.priceText,
                                        isSelected && styles.priceTextActive,
                                    ]}
                                >
                                    ₹{option.price}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    scrollContent: {
        gap: 8,
        paddingVertical: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.background,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: 'center',
        minWidth: 64,
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        ...SHADOWS.soft,
    },
    sizeText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    sizeTextActive: {
        color: COLORS.white,
    },
    priceText: {
        fontFamily: FONTS.body,
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },
    priceTextActive: {
        color: 'rgba(255,255,255,0.8)',
    },
});

export default WeightSelector;
