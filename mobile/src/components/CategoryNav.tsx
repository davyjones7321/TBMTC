import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../lib/theme';

// Category icons as emojis (matching jhom-foods design)
const CATEGORY_ICONS: Record<string, string> = {
    'All': '✨',
    'Seafood': '🦞',
    'Prawns': '🦐',
    'Chicken': '🍗',
    'Mutton': '🍖',
};

interface CategoryNavProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    categories?: string[]; // Optional dynamic categories
}

const DEFAULT_CATEGORIES = ['All', 'Seafood', 'Prawns', 'Chicken', 'Mutton'];

export default function CategoryNav({
    activeCategory,
    onCategoryChange,
    categories = DEFAULT_CATEGORIES
}: CategoryNavProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const isActive = activeCategory === category;
                    const icon = CATEGORY_ICONS[category] || '🍽️';

                    return (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                isActive && styles.categoryButtonActive,
                            ]}
                            onPress={() => onCategoryChange(category)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.categoryIcon}>{icon}</Text>
                            <Text
                                style={[
                                    styles.categoryText,
                                    isActive && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        paddingVertical: SPACING.lg,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 8,
        marginRight: 4,
    },
    categoryButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        ...SHADOWS.premium,
        transform: [{ scale: 1.02 }],
    },
    categoryIcon: {
        fontSize: 18,
    },
    categoryText: {
        fontFamily: FONTS.body,
        fontSize: 15,
        color: COLORS.text,
    },
    categoryTextActive: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.white,
    },
});

