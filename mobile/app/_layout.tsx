import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';
import {
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
} from '@expo-google-fonts/lato';
import { AuthProvider } from '../src/contexts/AuthContext';
import { CartProvider } from '../src/contexts/CartContext';
import { CheckoutProvider } from '../src/contexts/CheckoutContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { LocationProvider } from '../src/contexts/LocationContext';
import { queryClient } from '../src/lib/queryClient';
import { COLORS } from '../src/lib/theme';
import '../global.css';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_500Medium,
        PlayfairDisplay_600SemiBold,
        PlayfairDisplay_700Bold,
        PlayfairDisplay_400Regular_Italic,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    // Show loading while fonts are loading
    if (!fontsLoaded && !fontError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <LocationProvider>
                            <ProductsProvider>
                                <CartProvider>
                                    <CheckoutProvider>
                                        <StatusBar style="dark" />
                                        <Stack screenOptions={{ headerShown: false }}>
                                            <Stack.Screen name="index" />
                                            <Stack.Screen name="(auth)" />
                                            <Stack.Screen name="(tabs)" />
                                            <Stack.Screen name="checkout" />
                                            <Stack.Screen name="location-select" />
                                            <Stack.Screen
                                                name="product/[id]"
                                                options={{
                                                    headerShown: false,
                                                }}
                                            />
                                        </Stack>
                                    </CheckoutProvider>
                                </CartProvider>
                            </ProductsProvider>
                        </LocationProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

