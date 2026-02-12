import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

interface Review {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    quote: string;
    purchase?: string;
}

interface ReviewsCarouselProps {
    reviews?: Review[];
}

const defaultReviews: Review[] = [
    {
        id: '1',
        name: 'Elena R.',
        rating: 5,
        quote: '"Absolutely exquisite. The texture was buttery and the sweetness was unlike any I\'ve sourced locally. Arrived perfectly chilled."',
        purchase: 'Verified Purchase • 1.8kg',
    },
    {
        id: '2',
        name: 'Marcus T.',
        rating: 4.5,
        quote: '"Presented this for our anniversary dinner. The quality was exceptional. A true centerpiece for any occasion."',
        purchase: 'Verified Purchase • 2.5kg',
    },
];

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews = defaultReviews }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={14}
                    color={COLORS.accent}
                    fill={i < Math.floor(rating) ? COLORS.accent : 'transparent'}
                />
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Epicurean</Text>
                    <Text style={styles.titleLine2}>Reviews</Text>
                </View>
            </View>

            {/* Reviews Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={320}
                decelerationRate="fast"
            >
                {reviews.map((review) => (
                    <View key={review.id} style={styles.card}>
                        {/* Avatar */}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: review.avatar || 'https://ui-avatars.com/api/?name=' + review.name }}
                                style={styles.avatar}
                            />
                        </View>

                        {/* Stars */}
                        <View style={styles.stars}>
                            {renderStars(review.rating)}
                        </View>

                        {/* Quote */}
                        <Text style={styles.quote}>{review.quote}</Text>

                        {/* Author */}
                        <View style={styles.author}>
                            <Text style={styles.authorName}>{review.name}</Text>
                            <Text style={styles.purchaseInfo}>{review.purchase}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 24,
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
        color: COLORS.secondary,
    },
    titleLine2: {
        fontFamily: FONTS.displayItalic,
        fontSize: 28,
        color: COLORS.secondary,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    card: {
        width: 300,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: 20,
        marginHorizontal: 8,
        marginTop: 24, // For avatar overflow
        position: 'relative',
        ...SHADOWS.soft,
    },
    avatarContainer: {
        position: 'absolute',
        top: -24,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: COLORS.card,
        ...SHADOWS.soft,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    stars: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 16,
    },
    quote: {
        fontFamily: FONTS.displayItalic,
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        marginBottom: 16,
    },
    author: {
        marginTop: 'auto',
    },
    authorName: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.secondary,
    },
    purchaseInfo: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
});

export default ReviewsCarousel;
