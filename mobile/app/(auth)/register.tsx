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

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const { register } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const result = await register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                phone: data.phone,
            });

            if (result.success) {
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Registration Failed', result.message || 'Please try again');
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
                    <View className="flex-1 px-6 pt-8">
                        {/* Header */}
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 bg-coral rounded-full items-center justify-center mb-3">
                                <Text className="text-white text-2xl font-bold">JF</Text>
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">Create Account</Text>
                            <Text className="text-gray-500 mt-1">Join JHOMFOODS today</Text>
                        </View>

                        {/* Form */}
                        <View className="space-y-3">
                            {/* Name Row */}
                            <View className="flex-row space-x-3">
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-1">First Name</Text>
                                    <Controller
                                        control={control}
                                        name="firstName"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className={`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 ${errors.firstName ? 'border-2 border-red-500' : ''
                                                    }`}
                                                placeholder="First name"
                                                placeholderTextColor="#9CA3AF"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    {errors.firstName && (
                                        <Text className="text-red-500 text-xs mt-1">{errors.firstName.message}</Text>
                                    )}
                                </View>

                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-1">Last Name</Text>
                                    <Controller
                                        control={control}
                                        name="lastName"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className={`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 ${errors.lastName ? 'border-2 border-red-500' : ''
                                                    }`}
                                                placeholder="Last name"
                                                placeholderTextColor="#9CA3AF"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    {errors.lastName && (
                                        <Text className="text-red-500 text-xs mt-1">{errors.lastName.message}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Email */}
                            <View className="mt-3">
                                <Text className="text-gray-700 font-medium mb-1">Email</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 ${errors.email ? 'border-2 border-red-500' : ''
                                                }`}
                                            placeholder="Enter your email"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
                                )}
                            </View>

                            {/* Phone */}
                            <View className="mt-3">
                                <Text className="text-gray-700 font-medium mb-1">Phone (Optional)</Text>
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                                            placeholder="Enter your phone number"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="phone-pad"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                            </View>

                            {/* Password */}
                            <View className="mt-3">
                                <Text className="text-gray-700 font-medium mb-1">Password</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 ${errors.password ? 'border-2 border-red-500' : ''
                                                }`}
                                            placeholder="Create a password"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>
                                )}
                            </View>

                            {/* Confirm Password */}
                            <View className="mt-3">
                                <Text className="text-gray-700 font-medium mb-1">Confirm Password</Text>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 ${errors.confirmPassword ? 'border-2 border-red-500' : ''
                                                }`}
                                            placeholder="Confirm your password"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</Text>
                                )}
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                className={`bg-coral rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Login Link */}
                        <View className="flex-row justify-center mt-6 mb-8">
                            <Text className="text-gray-600">Already have an account? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-coral font-semibold">Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
