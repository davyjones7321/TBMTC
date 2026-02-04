import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Small delay to ensure navigation is ready
            const timer = setTimeout(() => {
                if (user) {
                    router.replace('/(tabs)/home');
                } else {
                    router.replace('/(auth)/login');
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [user, loading, router]);

    return (
        <View className="flex-1 items-center justify-center bg-red-600">
            <Text className="text-white text-3xl font-bold mb-4">JHOMFOODS</Text>
            <Text className="text-white text-lg mb-8">Fresh Meat Delivery</Text>
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}
