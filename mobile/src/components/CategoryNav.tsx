import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

// Premium colors - Coral/Teal palette
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    charcoal: '#2D3436',
    cream: '#FFF8F0',
};

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
        backgroundColor: COLORS.cream,
        paddingVertical: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
        marginRight: 4,
    },
    categoryButtonActive: {
        backgroundColor: COLORS.coral,
        borderColor: COLORS.coral,
        shadowColor: COLORS.coral,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
        transform: [{ scale: 1.02 }],
    },
    categoryIcon: {
        fontSize: 18,
    },
    categoryText: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.charcoal,
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
