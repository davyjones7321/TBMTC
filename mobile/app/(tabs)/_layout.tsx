import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, ShoppingBag, User } from 'lucide-react-native';
import { useCart } from '../../src/contexts/CartContext';
import { BlurView } from 'expo-blur';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../src/lib/theme';

export default function TabLayout() {
    const { cartCount } = useCart();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
                headerShown: false,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={90}
                            style={StyleSheet.absoluteFill}
                            tint="light"
                        />
                    ) : (
                        <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />
                    )
                ),
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <Home
                                size={24}
                                color={color}
                                strokeWidth={focused ? 2.5 : 2}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <View>
                                <ShoppingBag
                                    size={24}
                                    color={color}
                                    strokeWidth={focused ? 2.5 : 2}
                                />
                                {cartCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {cartCount > 9 ? '9+' : cartCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <User
                                size={24}
                                color={color}
                                strokeWidth={focused ? 2.5 : 2}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
        height: 68,
        borderRadius: RADIUS['2xl'],
        backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.85)' : COLORS.card,
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingBottom: 0,
        ...SHADOWS.floating,
    },
    androidBackground: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS['2xl'],
    },
    tabBarLabel: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        marginTop: 4,
    },
    tabBarItem: {
        paddingTop: 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        top: -14,
        width: 36,
        height: 4,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.full,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.full,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    badgeText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.white,
        fontSize: 10,
    },
});

