import { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ShoppingBag,
    ChevronRight,
    Edit3,
    ArrowLeft,
} from 'lucide-react-native';
import { useCheckout } from '../../src/contexts/CheckoutContext';
import { useCart } from '../../src/contexts/CartContext';
import { getProductImage } from '../../src/data/local-images';

// Premium colors
// Premium colors (Coral/Teal palette)
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    charcoal: '#2D3436',
    slate: '#636E72',
    pearl: '#F8F9FA',
    success: '#10B981',
};

export default function ReviewOrderScreen() {
    const router = useRouter();
    const { deliveryDetails } = useCheckout();
    const { cart, cartTotal, cartCount } = useCart();

    // Redirect if no delivery details or empty cart
    useEffect(() => {
        if (!deliveryDetails.firstName || cart.length === 0) {
            router.replace('/checkout/delivery-details');
        }
    }, [deliveryDetails, cart]);

    const fullName = `${deliveryDetails.firstName} ${deliveryDetails.lastName}`.trim();
    const fullAddress = `${deliveryDetails.street}, ${deliveryDetails.city}, ${deliveryDetails.state} - ${deliveryDetails.zipCode}`;

    // Calculate delivery charge (free above ₹500)
    const deliveryCharge = cartTotal >= 500 ? 0 : 50;
    const orderTotal = cartTotal + deliveryCharge;

    const handleEditDetails = () => {
        router.back();
    };

    const handleProceedToPayment = () => {
        router.push('/checkout/payment');
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
                    <Text style={styles.headerTitle}>Review Order</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Customer Details Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Delivery Details</Text>
                        <TouchableOpacity onPress={handleEditDetails} style={styles.editButton}>
                            <Edit3 size={16} color={COLORS.coral} />
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <User size={16} color={COLORS.slate} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Name</Text>
                            <Text style={styles.detailValue}>{fullName}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Phone size={16} color={COLORS.slate} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Phone</Text>
                            <Text style={styles.detailValue}>{deliveryDetails.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Mail size={16} color={COLORS.slate} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Email</Text>
                            <Text style={styles.detailValue}>{deliveryDetails.email}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <MapPin size={16} color={COLORS.slate} />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Delivery Address</Text>
                            <Text style={styles.detailValue}>{fullAddress}</Text>
                        </View>
                    </View>

                    {deliveryDetails.orderNotes ? (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <FileText size={16} color={COLORS.slate} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Order Notes</Text>
                                <Text style={styles.detailValue}>{deliveryDetails.orderNotes}</Text>
                            </View>
                        </View>
                    ) : null}
                </View>

                {/* Order Items Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <ShoppingBag size={20} color={COLORS.coral} />
                        <Text style={styles.cardTitle}>Order Items ({cartCount})</Text>
                    </View>

                    {cart.map((item, index) => {
                        const productImage = getProductImage(item.imageKey);
                        return (
                            <View key={item.id} style={[styles.orderItem, index < cart.length - 1 && styles.orderItemBorder]}>
                                <Image source={productImage} style={styles.itemImage} resizeMode="cover" />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                    {item.variation && (
                                        <Text style={styles.itemVariation}>Size: {item.variation}</Text>
                                    )}
                                    {item.glazing && (
                                        <Text style={[styles.itemVariation, { color: COLORS.coral }]}>Glazing: {item.glazing}%</Text>
                                    )}
                                    <View style={styles.itemPriceRow}>
                                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                        {item.price === 0 ? (
                                            <Text style={styles.itemPriceRequest}>Price on Request</Text>
                                        ) : (
                                            <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Order Summary Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Summary</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>
                            {cartTotal === 0 ? 'Price on Request' : `₹${cartTotal.toLocaleString()}`}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Charges</Text>
                        {deliveryCharge === 0 ? (
                            <Text style={styles.summaryFree}>FREE</Text>
                        ) : (
                            <Text style={styles.summaryValue}>₹{deliveryCharge}</Text>
                        )}
                    </View>

                    {deliveryCharge === 0 && cartTotal > 0 && (
                        <View style={styles.freeDeliveryBadge}>
                            <Text style={styles.freeDeliveryText}>🎉 Free delivery on orders above ₹500</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>
                            {orderTotal === 0 ? 'Price on Request' : `₹${orderTotal.toLocaleString()}`}
                        </Text>
                    </View>
                </View>

                {/* Spacer for button */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Proceed to Payment Button */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <View style={styles.footerTotal}>
                    <Text style={styles.footerTotalLabel}>Total</Text>
                    <Text style={styles.footerTotalValue}>
                        {orderTotal === 0 ? 'Price on Request' : `₹${orderTotal.toLocaleString()}`}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.paymentButton}
                    onPress={handleProceedToPayment}
                    activeOpacity={0.8}
                >
                    <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
                    <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    cardTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.charcoal,
        letterSpacing: -0.3,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
    },
    editText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.coral,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    detailIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.pearl,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.slate,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.charcoal,
        lineHeight: 20,
    },
    orderItem: {
        flexDirection: 'row',
        paddingVertical: 12,
    },
    orderItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.charcoal,
        marginBottom: 2,
    },
    itemVariation: {
        fontSize: 12,
        color: COLORS.slate,
        marginBottom: 4,
    },
    itemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemQuantity: {
        fontSize: 13,
        color: COLORS.slate,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.coral,
    },
    itemPriceRequest: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.slate,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 15,
        color: COLORS.slate,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.charcoal,
    },
    summaryFree: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.success,
    },
    freeDeliveryBadge: {
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    freeDeliveryText: {
        fontSize: 13,
        color: COLORS.success,
        fontWeight: '500',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.charcoal,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.coral,
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
    footerTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerTotalLabel: {
        fontSize: 14,
        color: COLORS.slate,
    },
    footerTotalValue: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.charcoal,
    },
    paymentButton: {
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
    paymentButtonText: {
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
});
