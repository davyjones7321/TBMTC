import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    User,
    ShoppingBag,
    Settings,
    HelpCircle,
    LogOut,
    ChevronRight,
    Package,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/contexts/AuthContext';

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

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    // Helper to get display name with fallbacks
    const getDisplayName = (): string => {
        if (!user) return 'Guest User';
        if (user.name) return user.name;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || 'Guest User';
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('[Profile] Logout error:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    const menuItems = [
        { icon: ShoppingBag, label: 'Browse Catalog', color: '#8B1538', bg: '#FEF2F2', onPress: () => router.push('/home') },
        { icon: Package, label: 'My Orders', color: '#EA580C', bg: '#FFF7ED', onPress: () => router.push('/orders') },
        { icon: Settings, label: 'Settings', color: '#2563EB', bg: '#EFF6FF', onPress: () => { } },
        { icon: HelpCircle, label: 'Help & Support', color: '#16A34A', bg: '#F0FDF4', onPress: () => router.push('/help-support') },
    ];

    const userInfoItems = [
        { icon: User, label: 'Full Name', value: getDisplayName() },
        { icon: Phone, label: 'Phone Number', value: user?.phone || 'Not provided' },
        { icon: Mail, label: 'Email Address', value: user?.email || 'Not logged in' },
        { icon: MapPin, label: 'Delivery Address', value: 'Set in checkout' },
    ];

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
                    <Text style={styles.heroTitle}>My Profile</Text>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Text style={styles.userName}>{getDisplayName()}</Text>
                    <Text style={styles.userBadge}>{user ? 'Premium Member' : 'Not logged in'}</Text>

                    {/* User Info List */}
                    <View style={styles.userInfoList}>
                        {userInfoItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <View key={index} style={styles.userInfoItem}>
                                    <View style={styles.userInfoIcon}>
                                        <IconComponent size={18} color={COLORS.coral} />
                                    </View>
                                    <View style={styles.userInfoContent}>
                                        <Text style={styles.userInfoLabel}>{item.label}</Text>
                                        <Text style={styles.userInfoValue} numberOfLines={2}>
                                            {item.value}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>Preferences</Text>
                    {menuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={item.onPress}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: item.bg }]}>
                                    <IconComponent size={20} color={item.color} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <ChevronRight size={18} color="#D1D5DB" />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    disabled={loggingOut}
                >
                    <LogOut size={18} color={COLORS.slate} />
                    <Text style={styles.logoutText}>{loggingOut ? 'Logging out...' : 'Log Out'}</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.versionText}>Jhom Foods App v2.1.0</Text>
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
        height: 200,
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
        paddingTop: 48,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 0.5,
    },
    // ScrollView
    scrollView: {
        flex: 1,
        marginTop: -50,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 120,
    },
    // Profile Card
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        marginBottom: 24,
    },
    avatarWrapper: {
        position: 'absolute',
        top: -50,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: COLORS.creamTint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    userBadge: {
        fontSize: 14,
        color: COLORS.slate,
        marginBottom: 24,
    },
    // User Info List
    userInfoList: {
        width: '100%',
        gap: 12,
    },
    userInfoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: COLORS.cream,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    userInfoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginRight: 12,
    },
    userInfoContent: {
        flex: 1,
    },
    userInfoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.slate,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    userInfoValue: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.charcoal,
        lineHeight: 20,
    },
    // Menu Section
    menuSection: {
        marginBottom: 24,
    },
    menuSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 12,
        paddingLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.charcoal,
    },
    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.slate,
    },
    // Version
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 16,
    },
});
