import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, ShoppingBag, User } from 'lucide-react-native';
import { useCart } from '../../src/contexts/CartContext';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
    const { cartCount } = useCart();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#D84A4A', // coral
                tabBarInactiveTintColor: '#636E72', // slate
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
                headerShown: false,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={80}
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
        left: 24,
        right: 24,
        height: 64,
        borderRadius: 24,
        backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.95)',
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingBottom: 0,
    },
    androidBackground: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 2,
    },
    tabBarItem: {
        paddingTop: 8,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        top: -12,
        width: 40,
        height: 3,
        backgroundColor: '#D84A4A', // coral
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: '#E57373', // coralLight
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
});
