import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Login Failed', result.message || 'Please check your credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 pt-12">
                        {/* Header */}
                        <View className="items-center mb-10">
                            <View className="w-20 h-20 bg-coral rounded-full items-center justify-center mb-4">
                                <Text className="text-white text-3xl font-bold">JF</Text>
                            </View>
                            <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
                            <Text className="text-gray-500 mt-2">Sign in to continue shopping</Text>
                        </View>

                        {/* Form */}
                        <View className="space-y-4">
                            {/* Email Input */}
                            <View>
                                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-gray-100 rounded-xl px-4 py-4 text-gray-900 ${errors.email ? 'border-2 border-red-500' : ''
                                                }`}
                                            placeholder="Enter your email"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View className="mt-4">
                                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-gray-100 rounded-xl px-4 py-4 text-gray-900 ${errors.password ? 'border-2 border-red-500' : ''
                                                }`}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry
                                            autoComplete="password"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                                )}
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                className={`bg-coral rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">Sign In</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center mt-8">
                            <Text className="text-gray-600">Don't have an account? </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text className="text-coral font-semibold">Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
