import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/contexts/AuthContext';
import { CartProvider } from '../src/contexts/CartContext';
import { CheckoutProvider } from '../src/contexts/CheckoutContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { LocationProvider } from '../src/contexts/LocationContext';
import { queryClient } from '../src/lib/queryClient';
import '../global.css';

export default function RootLayout() {
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
