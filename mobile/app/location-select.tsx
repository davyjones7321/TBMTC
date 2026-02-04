import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    TextInput,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    MapPin,
    Navigation,
    Search,
    Clock,
    Trash2,
    ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation, SavedLocation } from '../src/contexts/LocationContext';

// Premium colors - Coral/Teal palette
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    teal: '#4A9B9B',
    charcoal: '#2D3436',
    slate: '#636E72',
    cream: '#FFF8F0',
    creamTint: '#FFF5E6',
    success: '#16A34A',
    error: '#DC2626',
};

export default function LocationSelectScreen() {
    const router = useRouter();
    const {
        selectedLocation,
        recentLocations,
        loading,
        detectCurrentLocation,
        selectLocation,
        searchLocations,
        clearRecentLocations,
    } = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<SavedLocation[]>(recentLocations);

    // Update filtered locations when search changes
    useEffect(() => {
        setFilteredLocations(searchLocations(searchQuery));
    }, [searchQuery, recentLocations, searchLocations]);

    // Handle detect current location
    const handleDetectLocation = useCallback(async () => {
        const location = await detectCurrentLocation();
        if (location) {
            router.back();
        }
    }, [detectCurrentLocation, router]);

    // Handle select from recent
    const handleSelectRecent = useCallback(async (location: SavedLocation) => {
        await selectLocation(location);
        router.back();
    }, [selectLocation, router]);

    // Format display address
    const formatDisplayAddress = (location: SavedLocation): string => {
        return `${location.area}, ${location.city}`;
    };

    // Render recent location item
    const renderRecentItem = ({ item }: { item: SavedLocation }) => (
        <TouchableOpacity
            style={styles.recentItem}
            onPress={() => handleSelectRecent(item)}
            activeOpacity={0.7}
        >
            <View style={styles.recentIconContainer}>
                <Clock size={18} color={COLORS.slate} />
            </View>
            <View style={styles.recentContent}>
                <Text style={styles.recentArea} numberOfLines={1}>
                    {item.area}
                </Text>
                <Text style={styles.recentAddress} numberOfLines={1}>
                    {item.city}, {item.state}
                </Text>
            </View>
            <ChevronRight size={18} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.coral} translucent />

            {/* Header */}
            <LinearGradient
                colors={[COLORS.coral, COLORS.teal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />

                <SafeAreaView edges={['top']} style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Select Delivery Location</Text>
                        <View style={styles.backButton} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Search size={18} color={COLORS.slate} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Enter your apartment / area"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={false}
                        />
                    </View>
                </View>

                {/* Use Current Location Button */}
                <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={handleDetectLocation}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={loading ? ['#9CA3AF', '#9CA3AF'] : [COLORS.success, '#22C55E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.currentLocationGradient}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Navigation size={22} color="#FFFFFF" />
                        )}
                        <View style={styles.currentLocationContent}>
                            <Text style={styles.currentLocationTitle}>
                                {loading ? 'Detecting Location...' : 'Use Current Location'}
                            </Text>
                            <Text style={styles.currentLocationSubtitle}>
                                {loading ? 'Please wait' : 'Using GPS'}
                            </Text>
                        </View>
                        {!loading && <ChevronRight size={20} color="rgba(255,255,255,0.7)" />}
                    </LinearGradient>
                </TouchableOpacity>

                {/* Currently Selected */}
                {selectedLocation && (
                    <View style={styles.selectedSection}>
                        <Text style={styles.sectionTitle}>Current Location</Text>
                        <View style={styles.selectedCard}>
                            <View style={styles.selectedIconContainer}>
                                <MapPin size={20} color={COLORS.coral} />
                            </View>
                            <View style={styles.selectedContent}>
                                <Text style={styles.selectedArea}>{selectedLocation.area}</Text>
                                <Text style={styles.selectedAddress} numberOfLines={2}>
                                    {selectedLocation.address}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Recent Searches */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.sectionTitle}>Recent Searches</Text>
                        {recentLocations.length > 0 && (
                            <TouchableOpacity
                                onPress={clearRecentLocations}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Trash2 size={18} color={COLORS.slate} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {filteredLocations.length > 0 ? (
                        <FlatList
                            data={filteredLocations}
                            renderItem={renderRecentItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.recentList}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <MapPin size={40} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>
                                {searchQuery ? 'No matching locations' : 'No recent searches'}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Your searched locations will appear here'}
                            </Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    // Header
    header: {
        height: 120,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -30,
        right: -20,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 10,
        left: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    headerContent: {
        flex: 1,
        paddingTop: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: 0.3,
    },
    // Keyboard
    keyboardView: {
        flex: 1,
    },
    // Search
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: COLORS.charcoal,
    },
    // Current Location Button
    currentLocationButton: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    currentLocationGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        gap: 14,
    },
    currentLocationContent: {
        flex: 1,
    },
    currentLocationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    currentLocationSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    // Selected Section
    selectedSection: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    selectedCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.creamTint,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(216, 74, 74, 0.1)',
    },
    selectedIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    selectedContent: {
        flex: 1,
    },
    selectedArea: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.charcoal,
        marginBottom: 4,
    },
    selectedAddress: {
        fontSize: 13,
        color: COLORS.slate,
        lineHeight: 18,
    },
    // Recent Section
    recentSection: {
        flex: 1,
        paddingHorizontal: 16,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    recentList: {
        paddingBottom: 100,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    recentIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.cream,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    recentContent: {
        flex: 1,
    },
    recentArea: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.charcoal,
        marginBottom: 2,
    },
    recentAddress: {
        fontSize: 12,
        color: COLORS.slate,
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.slate,
        marginTop: 16,
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
