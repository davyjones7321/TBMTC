import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Package,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ordersApi } from '../src/lib/api';

// Premium colors - Coral/Teal palette
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    teal: '#4A9B9B',
    charcoal: '#2D3436',
    slate: '#636E72',
    cream: '#FFF8F0',
    creamTint: '#FFF5E6',
};

// Status colors
const STATUS_COLORS: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
    pending: { bg: '#FEF3C7', text: '#D97706', icon: Clock },
    confirmed: { bg: '#DBEAFE', text: '#2563EB', icon: Package },
    processing: { bg: '#E0E7FF', text: '#4F46E5', icon: Package },
    shipped: { bg: '#D1FAE5', text: '#059669', icon: Truck },
    delivered: { bg: '#D1FAE5', text: '#059669', icon: CheckCircle },
    cancelled: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
};

export default function OrdersScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ordersApi.getMyOrders();

            console.log('[Orders] API Response:', JSON.stringify(response, null, 2));

            // Handle various response formats from the backend
            let ordersData: any[] = [];

            if (Array.isArray(response)) {
                // Direct array response
                ordersData = response;
            } else if (response?.data?.orders && Array.isArray(response.data.orders)) {
                // { data: { orders: [...] } }
                ordersData = response.data.orders;
            } else if (response?.data && Array.isArray(response.data)) {
                // { data: [...] }
                ordersData = response.data;
            } else if (response?.orders && Array.isArray(response.orders)) {
                // { orders: [...] }
                ordersData = response.orders;
            } else if (response?.success && response?.data?.orders) {
                // { success: true, data: { orders: [...] } }
                ordersData = response.data.orders;
            }

            console.log('[Orders] Parsed orders count:', ordersData.length);
            setOrders(ordersData);
        } catch (err: any) {
            console.error('[Orders] Fetch error:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const formatPrice = (price: number) => {
        return `₹${price?.toFixed(2) || '0.00'}`;
    };

    const getStatusConfig = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || 'pending';
        return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.pending;
    };

    const renderOrderCard = (order: any) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;
        const orderId = order._id || order.id || 'N/A';
        const orderDate = order.createdAt || order.date;
        const items = order.items || [];
        const totalAmount = order.totalAmount || order.total || 0;

        return (
            <TouchableOpacity
                key={orderId}
                style={styles.orderCard}
                activeOpacity={0.8}
            >
                {/* Order Header */}
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>
                            Order #{orderId.slice(-8).toUpperCase()}
                        </Text>
                        <Text style={styles.orderDate}>
                            {orderDate ? formatDate(orderDate) : 'Date N/A'}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                        <StatusIcon size={14} color={statusConfig.text} />
                        <Text style={[styles.statusText, { color: statusConfig.text }]}>
                            {order.status || 'Pending'}
                        </Text>
                    </View>
                </View>

                {/* Order Items */}
                <View style={styles.itemsContainer}>
                    {items.slice(0, 3).map((item: any, index: number) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName} numberOfLines={1}>
                                {item.product?.name || item.name || 'Product'}
                            </Text>
                            <Text style={styles.itemQty}>×{item.quantity || 1}</Text>
                        </View>
                    ))}
                    {items.length > 3 && (
                        <Text style={styles.moreItems}>
                            +{items.length - 3} more items
                        </Text>
                    )}
                </View>

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                    <Text style={styles.itemsCount}>
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </Text>
                    <Text style={styles.totalAmount}>
                        {formatPrice(totalAmount)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.coral} translucent />

            {/* Hero Header with Gradient */}
            <LinearGradient
                colors={[COLORS.coral, COLORS.teal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroHeader}
            >
                {/* Decorative blur elements */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />

                <SafeAreaView edges={['top']} style={styles.heroContent}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.heroTitle}>My Orders</Text>
                        <View style={styles.placeholder} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Loading State */}
                {loading && (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={COLORS.coral} />
                        <Text style={styles.loadingText}>Loading orders...</Text>
                    </View>
                )}

                {/* Error State */}
                {!loading && error && (
                    <View style={styles.centerContainer}>
                        <XCircle size={48} color={COLORS.slate} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={fetchOrders}
                        >
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Empty State */}
                {!loading && !error && orders.length === 0 && (
                    <View style={styles.centerContainer}>
                        <ShoppingBag size={64} color={COLORS.slate} />
                        <Text style={styles.emptyTitle}>No Orders Yet</Text>
                        <Text style={styles.emptyText}>
                            Your order history will appear here
                        </Text>
                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => router.push('/(tabs)/home')}
                        >
                            <Text style={styles.shopButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Orders List */}
                {!loading && !error && orders.length > 0 && (
                    <View style={styles.ordersContainer}>
                        {orders.map(renderOrderCard)}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    // Hero Header
    heroHeader: {
        height: 140,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -60,
        right: -40,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 20,
        left: -40,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    heroContent: {
        flex: 1,
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 40,
    },
    // ScrollView
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100,
    },
    // Center Container for states
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.slate,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.slate,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.coral,
        borderRadius: 12,
    },
    retryText: {
        color: 'white',
        fontWeight: '600',
    },
    emptyTitle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.charcoal,
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.slate,
        textAlign: 'center',
    },
    shopButton: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        backgroundColor: COLORS.coral,
        borderRadius: 16,
    },
    shopButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    // Orders List
    ordersContainer: {
        gap: 16,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.charcoal,
    },
    orderDate: {
        fontSize: 13,
        color: COLORS.slate,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    itemsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemName: {
        fontSize: 14,
        color: COLORS.charcoal,
        flex: 1,
        marginRight: 8,
    },
    itemQty: {
        fontSize: 14,
        color: COLORS.slate,
        fontWeight: '500',
    },
    moreItems: {
        fontSize: 13,
        color: COLORS.coral,
        fontWeight: '500',
        marginTop: 4,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    itemsCount: {
        fontSize: 13,
        color: COLORS.slate,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.coral,
    },
});
