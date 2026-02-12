import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

// interface BulkOrdersCTAProps removed

const BulkOrdersCTA = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>Looking for Bulk Orders?</Text>
                    <Text style={styles.subtitle}>
                        Special pricing for restaurants, hotels, and catering services. Get the best rates today.
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/bulk-orders')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Bulk Pricing</Text>
                        <ChevronRight size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 24,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        ...SHADOWS.floating,
    },
    gradient: {
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: RADIUS.full,
        gap: 6,
    },
    buttonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.primary,
    },
});

export default BulkOrdersCTA;
