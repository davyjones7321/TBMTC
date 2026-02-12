import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

interface ChefNoteProps {
    note?: string;
    chefName?: string;
    chefTitle?: string;
    chefAvatar?: string;
}

const ChefNote: React.FC<ChefNoteProps> = ({
    note = 'Pair this delicate meat with a crisp Chablis or a light Chardonnay. Avoid heavy sauces; a simple lemon butter emulsion is perfection.',
    chefName = 'Jean-Pierre',
    chefTitle = 'Executive Chef',
    chefAvatar,
}) => {
    return (
        <View style={styles.container}>
            {/* Decorative blur circle */}
            <View style={styles.decorativeCircle} />

            {/* Content */}
            <Text style={styles.title}>Chef's Pairing Note</Text>

            <Text style={styles.note}>"{note}"</Text>

            {/* Chef Info */}
            <View style={styles.chefInfo}>
                <Image
                    source={{ uri: chefAvatar || 'https://ui-avatars.com/api/?name=' + chefName + '&background=14453D&color=fff' }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.chefName}>{chefName}</Text>
                    <Text style={styles.chefTitle}>{chefTitle}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.secondary,
        borderRadius: RADIUS.xl,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.white,
        marginBottom: 12,
    },
    note: {
        fontFamily: FONTS.bodyLight,
        fontSize: 15,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 24,
        marginBottom: 20,
    },
    chefInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    chefName: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.white,
    },
    chefTitle: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
});

export default ChefNote;
