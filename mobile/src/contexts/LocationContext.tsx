import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';

// ============================================
// TYPES
// ============================================

export interface SavedLocation {
    id: string;
    address: string;
    area: string;
    city: string;
    state: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
    timestamp: number;
}

export interface LocationState {
    selectedLocation: SavedLocation | null;
    recentLocations: SavedLocation[];
    loading: boolean;
    error: string | null;
    permissionStatus: Location.PermissionStatus | null;
}

interface LocationContextType extends LocationState {
    detectCurrentLocation: () => Promise<SavedLocation | null>;
    selectLocation: (location: SavedLocation) => Promise<void>;
    searchLocations: (query: string) => SavedLocation[];
    clearRecentLocations: () => Promise<void>;
    checkPermission: () => Promise<Location.PermissionStatus>;
}

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEYS = {
    SELECTED_LOCATION: '@jhomfoods_selected_location',
    RECENT_LOCATIONS: '@jhomfoods_recent_locations',
};

const MAX_RECENT_LOCATIONS = 10;

// ============================================
// CONTEXT
// ============================================

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<LocationState>({
        selectedLocation: null,
        recentLocations: [],
        loading: false,
        error: null,
        permissionStatus: null,
    });

    // ============================================
    // LOAD SAVED DATA ON MOUNT
    // ============================================

    useEffect(() => {
        loadSavedData();
    }, []);

    const loadSavedData = async () => {
        try {
            const [selectedJson, recentJson] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION),
                AsyncStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS),
            ]);

            setState(prev => ({
                ...prev,
                selectedLocation: selectedJson ? JSON.parse(selectedJson) : null,
                recentLocations: recentJson ? JSON.parse(recentJson) : [],
            }));
        } catch (error) {
            console.error('[LocationContext] Failed to load saved data:', error);
        }
    };

    // ============================================
    // PERMISSION HANDLING
    // ============================================

    const checkPermission = useCallback(async (): Promise<Location.PermissionStatus> => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            setState(prev => ({ ...prev, permissionStatus: status }));
            return status;
        } catch (error) {
            console.error('[LocationContext] Permission check failed:', error);
            return Location.PermissionStatus.UNDETERMINED;
        }
    }, []);

    const requestPermission = async (): Promise<boolean> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setState(prev => ({ ...prev, permissionStatus: status }));

            if (status === Location.PermissionStatus.GRANTED) {
                return true;
            }

            if (status === Location.PermissionStatus.DENIED) {
                Alert.alert(
                    'Location Permission Denied',
                    'You can enter your address manually or enable location access in your device settings.',
                    [
                        { text: 'Enter Manually', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }

            return false;
        } catch (error) {
            console.error('[LocationContext] Permission request failed:', error);
            return false;
        }
    };

    // ============================================
    // LOCATION DETECTION
    // ============================================

    const detectCurrentLocation = useCallback(async (): Promise<SavedLocation | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Check if location services are enabled
            const enabled = await Location.hasServicesEnabledAsync();
            if (!enabled) {
                setState(prev => ({ ...prev, loading: false }));
                Alert.alert(
                    'Location Services Disabled',
                    'Location services are off. Please enable GPS.',
                    [
                        { text: 'Enter Manually', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings:');
                                } else {
                                    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
                                }
                            },
                        },
                    ]
                );
                return null;
            }

            // Request permission if needed
            const hasPermission = await requestPermission();
            if (!hasPermission) {
                setState(prev => ({ ...prev, loading: false }));
                return null;
            }

            // Get current position with timeout
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 10000,
            });

            const { latitude, longitude } = position.coords;

            // Reverse geocode to get address
            const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (addresses.length === 0) {
                throw new Error('Unable to get address for this location');
            }

            const addr = addresses[0];

            // Create location object
            const location: SavedLocation = {
                id: `loc_${Date.now()}`,
                address: formatFullAddress(addr),
                area: addr.name || addr.street || addr.district || 'Unknown Area',
                city: addr.city || addr.subregion || 'Unknown City',
                state: addr.region || 'Unknown State',
                postalCode: addr.postalCode || undefined,
                latitude,
                longitude,
                timestamp: Date.now(),
            };

            // Save as selected location
            await selectLocation(location);

            setState(prev => ({ ...prev, loading: false }));
            return location;

        } catch (error: any) {
            console.error('[LocationContext] Location detection failed:', error);

            let errorMessage = 'Unable to detect location. Please try again or enter address manually.';

            if (error.code === 'E_LOCATION_TIMEOUT') {
                errorMessage = 'Location detection timed out. Try again or enter manually.';
            } else if (error.message?.includes('network')) {
                errorMessage = 'Unable to connect. Please check your internet connection.';
            } else if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
                errorMessage = 'Location services are off. Please enable GPS.';
            }

            setState(prev => ({ ...prev, loading: false, error: errorMessage }));

            Alert.alert('Location Error', errorMessage, [{ text: 'OK' }]);

            return null;
        }
    }, []);

    // ============================================
    // FORMAT ADDRESS HELPER
    // ============================================

    const formatFullAddress = (addr: Location.LocationGeocodedAddress): string => {
        const parts = [
            addr.name,
            addr.street,
            addr.district,
            addr.city,
            addr.region,
            addr.postalCode,
        ].filter(Boolean);

        return parts.join(', ');
    };

    // ============================================
    // SELECT & SAVE LOCATION
    // ============================================

    const selectLocation = useCallback(async (location: SavedLocation) => {
        try {
            // Save as selected
            await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(location));

            // Add to recent (avoid duplicates, limit to MAX)
            const recentLocations = state.recentLocations.filter(
                loc => loc.id !== location.id && loc.address !== location.address
            );
            const updatedRecent = [location, ...recentLocations].slice(0, MAX_RECENT_LOCATIONS);

            await AsyncStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(updatedRecent));

            setState(prev => ({
                ...prev,
                selectedLocation: location,
                recentLocations: updatedRecent,
            }));
        } catch (error) {
            console.error('[LocationContext] Failed to save location:', error);
        }
    }, [state.recentLocations]);

    // ============================================
    // SEARCH RECENT LOCATIONS
    // ============================================

    const searchLocations = useCallback((query: string): SavedLocation[] => {
        if (!query.trim()) return state.recentLocations;

        const lowerQuery = query.toLowerCase();
        return state.recentLocations.filter(
            loc =>
                loc.address.toLowerCase().includes(lowerQuery) ||
                loc.area.toLowerCase().includes(lowerQuery) ||
                loc.city.toLowerCase().includes(lowerQuery)
        );
    }, [state.recentLocations]);

    // ============================================
    // CLEAR RECENT LOCATIONS
    // ============================================

    const clearRecentLocations = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_LOCATIONS);
            setState(prev => ({ ...prev, recentLocations: [] }));
        } catch (error) {
            console.error('[LocationContext] Failed to clear recent locations:', error);
        }
    }, []);

    // ============================================
    // PROVIDER VALUE
    // ============================================

    const value: LocationContextType = {
        ...state,
        detectCurrentLocation,
        selectLocation,
        searchLocations,
        clearRecentLocations,
        checkPermission,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}

export default LocationContext;
