import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../lib/theme';

interface OrderSummaryCardProps {
    subtotal: number;
    deliveryFee: number;
    memberDiscount?: number;
    grandTotal: number;
    onCheckout: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
    subtotal,
    deliveryFee,
    memberDiscount = 0,
    grandTotal,
    onCheckout,
}) => {
    return (
        <View style={styles.outerContainer}>
            {/* Layered paper effect */}
            <View style={styles.paperBehind} />

            <View style={styles.container}>
                {/* Tear edge top */}
                <View style={styles.tearEdge} />

                {/* Summary Lines */}
                <View style={styles.summaryContent}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.value}>₹{subtotal.toLocaleString()}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Delivery (Express Cold Chain)</Text>
                        <Text style={styles.value}>₹{deliveryFee}</Text>
                    </View>

                    {memberDiscount > 0 && (
                        <View style={styles.row}>
                            <Text style={styles.discountLabel}>Member Discount</Text>
                            <Text style={styles.discountValue}>- ₹{memberDiscount}</Text>
                        </View>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Grand Total */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalValue}>₹{grandTotal.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Quality Assured Stamp */}
                <View style={styles.stamp}>
                    <Text style={styles.stampText}>QUALITY{'\n'}ASSURED</Text>
                </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
                style={styles.checkoutButton}
                onPress={onCheckout}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight, COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.buttonText}>PROCEED TO VAULT</Text>
                    <Lock size={18} color={COLORS.white} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 32,
        position: 'relative',
    },
    paperBehind: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: -8,
        bottom: -8,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        opacity: 0.5,
        transform: [{ rotate: '1deg' }],
    },
    container: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: 24,
        paddingTop: 32,
        overflow: 'hidden',
        position: 'relative',
        ...SHADOWS.floating,
    },
    tearEdge: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: COLORS.background,
        // Tear pattern effect using border
    },
    summaryContent: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    value: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    discountLabel: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.success,
    },
    discountValue: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.success,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    totalLabel: {
        fontFamily: FONTS.displayItalic,
        fontSize: 18,
        color: COLORS.textSecondary,
    },
    totalValue: {
        fontFamily: FONTS.displayBold,
        fontSize: 32,
        color: COLORS.text,
    },
    stamp: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 4,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-12deg' }],
        opacity: 0.3,
    },
    stampText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: COLORS.textSecondary,
        textAlign: 'center',
        letterSpacing: 1,
    },
    checkoutButton: {
        marginTop: 16,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.premium,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    buttonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.white,
        letterSpacing: 1,
    },
});

export default OrderSummaryCard;
