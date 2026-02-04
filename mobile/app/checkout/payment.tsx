import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    CreditCard,
    Wallet,
    Truck,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react-native';
import { useCheckout } from '../../src/contexts/CheckoutContext';
import { useCart } from '../../src/contexts/CartContext';

// Premium colors
// Premium colors (Coral/Teal palette)
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    charcoal: '#2D3436',
    slate: '#636E72',
    pearl: '#F8F9FA',
    success: '#10B981',
    warning: '#F59E0B',
};

type PaymentMethod = 'cash_on_delivery' | 'razorpay';

export default function PaymentScreen() {
    const router = useRouter();
    const { deliveryDetails, getShippingAddress, getDeliverySlot, resetCheckout } = useCheckout();
    const { cart, cartTotal, placeOrder, clearCart } = useCart();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash_on_delivery');
    const [isLoading, setIsLoading] = useState(false);

    // Calculate totals
    const deliveryCharge = cartTotal >= 500 ? 0 : 50;
    const orderTotal = cartTotal + deliveryCharge;

    // Redirect if no delivery details or empty cart
    useEffect(() => {
        if (!deliveryDetails.firstName || cart.length === 0) {
            router.replace('/checkout/delivery-details');
        }
    }, [deliveryDetails, cart]);

    const handlePlaceOrder = async () => {
        if (selectedMethod === 'razorpay') {
            Alert.alert(
                'Coming Soon',
                'Razorpay payment integration is coming soon! Please use Cash on Delivery for now.',
                [{ text: 'OK' }]
            );
            return;
        }

        setIsLoading(true);
        try {
            const shippingAddress = getShippingAddress();
            const deliverySlot = getDeliverySlot();

            const result = await placeOrder(
                {
                    ...shippingAddress,
                    country: 'India',
                },
                'cash_on_delivery'
            );

            if (result.success) {
                resetCheckout();
                Alert.alert(
                    '🎉 Order Placed!',
                    'Your order has been placed successfully. We\'ll notify you when it ships.',
                    [
                        {
                            text: 'Continue Shopping',
                            onPress: () => router.replace('/(tabs)/home'),
                        },
                    ]
                );
            } else {
                Alert.alert('Order Failed', result.message || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.coral} />

            {/* Custom Header */}
            <SafeAreaView edges={['top']} style={styles.headerSafe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Payment</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Order Total Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Total</Text>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalAmount}>
                            {orderTotal === 0 ? 'Price on Request' : `₹${orderTotal.toLocaleString()}`}
                        </Text>
                        <Text style={styles.totalSubtext}>
                            Including {deliveryCharge === 0 ? 'free delivery' : `₹${deliveryCharge} delivery`}
                        </Text>
                    </View>
                </View>

                {/* Payment Methods */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Select Payment Method</Text>

                    {/* Cash on Delivery */}
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedMethod === 'cash_on_delivery' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedMethod('cash_on_delivery')}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.radioOuter,
                            selectedMethod === 'cash_on_delivery' && styles.radioOuterSelected,
                        ]}>
                            {selectedMethod === 'cash_on_delivery' && <View style={styles.radioInner} />}
                        </View>
                        <View style={[styles.paymentIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Truck size={20} color={COLORS.warning} />
                        </View>
                        <View style={styles.paymentContent}>
                            <Text style={styles.paymentLabel}>Cash on Delivery</Text>
                            <Text style={styles.paymentSubtext}>Pay when you receive your order</Text>
                        </View>
                        {selectedMethod === 'cash_on_delivery' && (
                            <CheckCircle size={20} color={COLORS.success} />
                        )}
                    </TouchableOpacity>

                    {/* Razorpay (Coming Soon) */}
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            styles.paymentOptionDisabled,
                            selectedMethod === 'razorpay' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedMethod('razorpay')}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.radioOuter,
                            selectedMethod === 'razorpay' && styles.radioOuterSelected,
                        ]}>
                            {selectedMethod === 'razorpay' && <View style={styles.radioInner} />}
                        </View>
                        <View style={[styles.paymentIcon, { backgroundColor: '#EBF5FF' }]}>
                            <CreditCard size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.paymentContent}>
                            <View style={styles.paymentLabelRow}>
                                <Text style={styles.paymentLabel}>Razorpay</Text>
                                <View style={styles.comingSoonBadge}>
                                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                                </View>
                            </View>
                            <Text style={styles.paymentSubtext}>Cards, UPI, Net Banking & Wallets</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Razorpay Coming Soon Notice */}
                {selectedMethod === 'razorpay' && (
                    <View style={styles.noticeCard}>
                        <AlertTriangle size={24} color={COLORS.warning} />
                        <View style={styles.noticeContent}>
                            <Text style={styles.noticeTitle}>Razorpay Integration Coming Soon</Text>
                            <Text style={styles.noticeText}>
                                We're working on integrating Razorpay for seamless online payments.
                                Please use Cash on Delivery for now.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Security Info */}
                <View style={styles.securityInfo}>
                    <Wallet size={16} color={COLORS.slate} />
                    <Text style={styles.securityText}>
                        Your payment information is secure and encrypted
                    </Text>
                </View>

                {/* Spacer for button */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Place Order Button */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.placeOrderButton,
                        (isLoading || selectedMethod === 'razorpay') && styles.placeOrderButtonDisabled,
                    ]}
                    onPress={handlePlaceOrder}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.placeOrderButtonText}>
                                {selectedMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                            </Text>
                            <ArrowRight size={20} color="#FFFFFF" />
                        </>
                    )}
                </TouchableOpacity>
                <Text style={styles.footerNote}>
                    By placing this order, you agree to our Terms & Conditions
                </Text>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pearl,
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    totalContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: COLORS.pearl,
        borderRadius: 16,
    },
    totalAmount: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.coral,
        letterSpacing: -1,
    },
    totalSubtext: {
        fontSize: 14,
        color: COLORS.slate,
        marginTop: 4,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.pearl,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        borderColor: COLORS.coral,
        backgroundColor: '#FEF2F2',
    },
    paymentOptionDisabled: {
        opacity: 0.9,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioOuterSelected: {
        borderColor: COLORS.coral,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.coral,
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentContent: {
        flex: 1,
    },
    paymentLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    paymentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.charcoal,
    },
    paymentSubtext: {
        fontSize: 13,
        color: COLORS.slate,
        marginTop: 2,
    },
    comingSoonBadge: {
        backgroundColor: COLORS.warning,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    comingSoonText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    noticeCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    noticeContent: {
        flex: 1,
        marginLeft: 12,
    },
    noticeTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.charcoal,
        marginBottom: 4,
    },
    noticeText: {
        fontSize: 13,
        color: COLORS.slate,
        lineHeight: 18,
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
    },
    securityText: {
        fontSize: 12,
        color: COLORS.slate,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
    },
    placeOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.coral,
        paddingVertical: 18,
        borderRadius: 16,
        gap: 8,
        shadowColor: COLORS.coral,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    placeOrderButtonDisabled: {
        opacity: 0.7,
    },
    placeOrderButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    headerSafe: {
        backgroundColor: COLORS.coral,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.coral,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    footerNote: {
        fontSize: 11,
        color: COLORS.slate,
        textAlign: 'center',
        marginTop: 12,
    },
});
