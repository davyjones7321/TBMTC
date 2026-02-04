import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../src/lib/api-config';

// Premium colors (matching profile.tsx)
const COLORS = {
    burgundy: '#8B1538',
    crimson: '#A91D3A',
    terracotta: '#D4756E',
    charcoal: '#2D3436',
    slate: '#636E72',
    pearl: '#F8F9FA',
    blush: '#F7E7E6',
    success: '#16A34A',
    error: '#DC2626',
};

// Contact information (from frontend Contact.tsx)
const CONTACT_INFO = {
    phone: '8073037379',
    email: 'Jhomfoods24@gmail.com',
    businessHours: 'Mon-Sat: 8AM-8PM, Sun: 9AM-6PM',
};

export default function HelpSupportScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert(
                    'Message Sent!',
                    'Thank you for reaching out. We will get back to you soon.',
                    [{ text: 'OK', onPress: () => setFormData({ name: '', email: '', phone: '', message: '' }) }]
                );
                setErrors({});
            } else {
                Alert.alert('Error', data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('[HelpSupport] Submit error:', error);
            Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle call now
    const handleCallNow = () => {
        Linking.openURL(`tel:${CONTACT_INFO.phone}`);
    };

    // Handle email
    const handleEmail = () => {
        Linking.openURL(`mailto:${CONTACT_INFO.email}`);
    };

    const contactItems = [
        {
            icon: Phone,
            title: 'Phone',
            content: CONTACT_INFO.phone,
            onPress: handleCallNow,
            color: '#16A34A',
            bg: '#F0FDF4',
        },
        {
            icon: Mail,
            title: 'Email',
            content: CONTACT_INFO.email,
            onPress: handleEmail,
            color: '#2563EB',
            bg: '#EFF6FF',
        },
        {
            icon: Clock,
            title: 'Business Hours',
            content: CONTACT_INFO.businessHours,
            onPress: null,
            color: '#EA580C',
            bg: '#FFF7ED',
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.burgundy} translucent />

            {/* Hero Header */}
            <LinearGradient
                colors={[COLORS.burgundy, COLORS.terracotta]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroHeader}
            >
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />

                <SafeAreaView edges={['top']} style={styles.heroContent}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.heroTitle}>Help & Support</Text>
                        <View style={styles.backButton} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Contact Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Get in Touch</Text>
                        {contactItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.contactItem}
                                    onPress={item.onPress || undefined}
                                    activeOpacity={item.onPress ? 0.7 : 1}
                                    disabled={!item.onPress}
                                >
                                    <View style={[styles.contactIconContainer, { backgroundColor: item.bg }]}>
                                        <IconComponent size={20} color={item.color} />
                                    </View>
                                    <View style={styles.contactContent}>
                                        <Text style={styles.contactTitle}>{item.title}</Text>
                                        <Text style={[styles.contactValue, item.onPress && styles.contactLink]}>
                                            {item.content}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Quick Action Card */}
                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={handleCallNow}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[COLORS.success, '#22C55E']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.quickActionGradient}
                        >
                            <Phone size={24} color="#FFFFFF" />
                            <View style={styles.quickActionContent}>
                                <Text style={styles.quickActionTitle}>Need Immediate Help?</Text>
                                <Text style={styles.quickActionSubtitle}>Tap to call us now</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Support Form Section */}
                    <View style={styles.section}>
                        <View style={styles.formHeader}>
                            <MessageCircle size={20} color={COLORS.burgundy} />
                            <Text style={styles.sectionTitle}>Send us a Message</Text>
                        </View>

                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Name *</Text>
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                value={formData.name}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, name: text });
                                    if (errors.name) setErrors({ ...errors, name: '' });
                                }}
                                placeholder="Your Name"
                                placeholderTextColor="#9CA3AF"
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email *</Text>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                value={formData.email}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, email: text });
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                placeholder="your.email@example.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Phone Input (Optional) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                placeholder="Your Phone Number"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Message Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Message *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, errors.message && styles.inputError]}
                                value={formData.message}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, message: text });
                                    if (errors.message) setErrors({ ...errors, message: '' });
                                }}
                                placeholder="How can we help you?"
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                            {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={isSubmitting ? ['#9CA3AF', '#9CA3AF'] : [COLORS.burgundy, COLORS.crimson]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitButtonGradient}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Send size={18} color="#FFFFFF" />
                                        <Text style={styles.submitButtonText}>Send Message</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pearl,
    },
    // Hero Header
    heroHeader: {
        height: 140,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -40,
        right: -30,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 10,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    heroContent: {
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
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: 0.3,
    },
    // Scroll & Keyboard
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100,
    },
    // Sections
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 16,
        marginLeft: 4,
    },
    // Contact Items
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    contactIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    contactContent: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.slate,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.charcoal,
    },
    contactLink: {
        color: COLORS.burgundy,
    },
    // Quick Action Card
    quickActionCard: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    quickActionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    quickActionContent: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    quickActionSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
    },
    // Form
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.charcoal,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.charcoal,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    textArea: {
        minHeight: 120,
        paddingTop: 14,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.error,
        marginTop: 4,
        marginLeft: 4,
    },
    // Submit Button
    submitButton: {
        marginTop: 8,
        borderRadius: 14,
        overflow: 'hidden',
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});
