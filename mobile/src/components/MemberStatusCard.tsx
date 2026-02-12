import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

interface MemberStatusCardProps {
    memberTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    points?: number;
    pointsToNext?: number;
    progressPercent?: number;
}

const MemberStatusCard: React.FC<MemberStatusCardProps> = ({
    memberTier = 'Gold',
    points = 2760,
    pointsToNext = 1240,
    progressPercent = 72,
}) => {
    // Calculate SVG circle values
    const size = 80;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <View style={styles.container}>
            {/* Decorative corner */}
            <View style={styles.cornerDecoration} />

            <View style={styles.content}>
                {/* Left side - Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.label}>CONNOISSEUR STATUS</Text>
                    <Text style={styles.tier}>{memberTier} Member</Text>
                    <Text style={styles.pointsText}>{pointsToNext.toLocaleString()} pts to Platinum</Text>
                </View>

                {/* Right side - Progress Ring */}
                <View style={styles.progressContainer}>
                    <Svg width={size} height={size} style={styles.svg}>
                        {/* Background Circle */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={COLORS.border}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        {/* Progress Circle */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={COLORS.primary}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${size / 2}, ${size / 2}`}
                        />
                    </Svg>
                    <Text style={styles.percentText}>{progressPercent}%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
        overflow: 'hidden',
        position: 'relative',
        ...SHADOWS.soft,
    },
    cornerDecoration: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        backgroundColor: COLORS.primary,
        opacity: 0.1,
        borderBottomLeftRadius: 100,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoSection: {
        flex: 1,
    },
    label: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: COLORS.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    tier: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.text,
        marginBottom: 8,
    },
    pointsText: {
        fontFamily: FONTS.body,
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    progressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        transform: [{ rotate: '-90deg' }],
    },
    percentText: {
        position: 'absolute',
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.primary,
    },
});

export default MemberStatusCard;
