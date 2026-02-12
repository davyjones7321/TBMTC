import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
    onShopNow?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' }}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
            />

            {/* Content */}
            <View style={styles.content}>
                {/* Badge */}
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>THE COLLECTION</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>The</Text>
                <Text style={styles.titleHighlight}>Prime Cut</Text>

                {/* Shop Now Button */}
                <TouchableOpacity style={styles.shopButton} onPress={onShopNow} activeOpacity={0.8}>
                    <Text style={styles.shopButtonText}>Shop Now</Text>
                    <ChevronRight size={18} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Carousel Dots */}
            <View style={styles.dots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width - 32,
        height: 280,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 24,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    badgeText: {
        fontFamily: FONTS.body,
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.white,
        letterSpacing: 1.5,
    },
    title: {
        fontFamily: FONTS.display,
        fontSize: 36,
        color: COLORS.white,
        lineHeight: 40,
    },
    titleHighlight: {
        fontFamily: FONTS.displayItalic,
        fontSize: 42,
        color: COLORS.white,
        fontStyle: 'italic',
        marginBottom: 16,
    },
    shopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: RADIUS.full,
        alignSelf: 'flex-start',
        gap: 4,
        ...SHADOWS.soft,
    },
    shopButtonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
    },
    dots: {
        position: 'absolute',
        bottom: 16,
        right: 24,
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
        backgroundColor: COLORS.white,
        width: 24,
    },
});

export default HeroSection;
