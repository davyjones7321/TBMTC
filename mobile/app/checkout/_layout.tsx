import { Stack } from 'expo-router';

export default function CheckoutLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: '#D84A4A' },
                headerTintColor: '#FFF8F0',
                headerTitleStyle: { fontWeight: '600' },
            }}
        >
            <Stack.Screen
                name="delivery-details"
                options={{
                    headerTitle: 'Delivery Details',
                    headerBackTitle: 'Cart',
                }}
            />
            <Stack.Screen
                name="review-order"
                options={{
                    headerTitle: 'Review Order',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name="payment"
                options={{
                    headerTitle: 'Payment',
                    headerBackTitle: 'Back',
                }}
            />
        </Stack>
    );
}
