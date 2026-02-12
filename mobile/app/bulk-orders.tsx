import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    CheckCircle,
    Truck,
    Package,
    Users,
    ChevronDown,
    ChevronUp,
    Send,
    DollarSign,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../src/lib/theme';
import { API_BASE_URL, API_ENDPOINTS } from '../src/lib/api-config';
import { BulkOrderFormData, BusinessType } from '../src/types/bulk-orders';

const businessTypes: { value: BusinessType; label: string }[] = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'catering', label: 'Catering Service' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'other', label: 'Other' },
];

const productOptions = [
    { id: 'fish-seafood', label: 'Fish & Seafood' },
    { id: 'poultry', label: 'Poultry' },
    { id: 'mutton', label: 'Mutton' },
    { id: 'ready-to-cook', label: 'Ready to Cook' },
    { id: 'vegetarian', label: 'Vegetarian' },
];

const volumeOptions = [
    { value: '50-100kg', label: '50 - 100 kg' },
    { value: '100-250kg', label: '100 - 250 kg' },
    { value: '250-500kg', label: '250 - 500 kg' },
    { value: '500-1000kg', label: '500 - 1000 kg' },
    { value: '1000kg+', label: '1000+ kg' },
];

const benefits = [
    { icon: DollarSign, title: 'Best Prices', desc: 'Special bulk rates' },
    { icon: Truck, title: 'Reliable', desc: 'On-time delivery' },
    { icon: Package, title: 'Flexible', desc: 'Order what you need' },
    { icon: Users, title: 'Dedicated', desc: 'Personal support' },
];

const faqs = [
    {
        q: 'What is the minimum order quantity?',
        a: 'Our minimum order for bulk pricing is 50kg per order. For specific products, minimums may vary.',
    },
    {
        q: 'How does pricing work for bulk orders?',
        a: 'We offer tiered pricing based on volume. The more you order, the better the rates. Contact us for a quote.',
    },
    {
        q: 'What are your delivery options?',
        a: 'We offer scheduled deliveries (daily, weekly, bi-weekly) based on your needs in temperature-controlled vehicles.',
    },
    {
        q: 'Do you provide credit terms?',
        a: 'Yes, we offer credit terms for established business accounts based on volume and payment history.',
    },
];

export default function BulkOrdersScreen() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const [formData, setFormData] = useState<BulkOrderFormData>({
        businessName: '',
        businessType: 'restaurant',
        contactName: '',
        email: '',
        phone: '',
        city: '',
        estimatedMonthlyVolume: '',
        productInterests: [],
        message: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
        if (!formData.contactName.trim()) newErrors.contactName = 'Contact Name is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.estimatedMonthlyVolume) newErrors.estimatedMonthlyVolume = 'Please select volume';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Details Missing', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BULK_ORDERS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request');
            }

            setIsSuccess(true);
        } catch (error) {
            console.error('Submit bulk order error:', error);
            Alert.alert('Submission Failed', error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleProductInterest = (id: string) => {
        setFormData(prev => ({
            ...prev,
            productInterests: prev.productInterests.includes(id)
                ? prev.productInterests.filter(item => item !== id)
                : [...prev.productInterests, id],
        }));
    };

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    if (isSuccess) {
        return (
            <SafeAreaView style={styles.successContainer}>
                <View style={styles.successContent}>
                    <View style={styles.successIconContainer}>
                        <CheckCircle size={64} color={COLORS.primary} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.successTitle}>Request Submitted!</Text>
                    <Text style={styles.successText}>
                        Thank you for your interest in bulk orders. Our team will review your requirements and contact you within 24-48 hours.
                    </Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.primaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

            {/* Header */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView edges={['top']} style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerBadge}>FOR BUSINESSES</Text>
                            <Text style={styles.headerTitle}>Bulk Orders</Text>
                        </View>
                        <View style={{ width: 44 }} />
                    </View>
                </SafeAreaView>

                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Benefits Grid */}
                    <View style={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <View style={styles.benefitIconContainer}>
                                    <benefit.icon size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Request a Quote</Text>
                        <Text style={styles.sectionSubtitle}>
                            Fill out the form below and we'll get back to you with custom pricing.
                        </Text>

                        {/* Business Details */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Type</Text>
                            <View style={styles.optionContainer}>
                                {businessTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.value}
                                        style={[
                                            styles.optionChip,
                                            formData.businessType === type.value && styles.optionChipActive
                                        ]}
                                        onPress={() => setFormData({ ...formData, businessType: type.value })}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            formData.businessType === type.value && styles.optionTextActive
                                        ]}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Name *</Text>
                            <TextInput
                                style={[styles.input, errors.businessName && styles.inputError]}
                                value={formData.businessName}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, businessName: text });
                                    if (errors.businessName) setErrors({ ...errors, businessName: '' });
                                }}
                                placeholder="Your business name"
                                placeholderTextColor={COLORS.textLight}
                            />
                            {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Contact Name *</Text>
                                <TextInput
                                    style={[styles.input, errors.contactName && styles.inputError]}
                                    value={formData.contactName}
                                    onChangeText={(text) => {
                                        setFormData({ ...formData, contactName: text });
                                        if (errors.contactName) setErrors({ ...errors, contactName: '' });
                                    }}
                                    placeholder="Your name"
                                    placeholderTextColor={COLORS.textLight}
                                />
                                {errors.contactName && <Text style={styles.errorText}>{errors.contactName}</Text>}
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>City *</Text>
                                <TextInput
                                    style={[styles.input, errors.city && styles.inputError]}
                                    value={formData.city}
                                    onChangeText={(text) => {
                                        setFormData({ ...formData, city: text });
                                        if (errors.city) setErrors({ ...errors, city: '' });
                                    }}
                                    placeholder="e.g. Bangalore"
                                    placeholderTextColor={COLORS.textLight}
                                />
                                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                value={formData.email}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, email: text });
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                placeholder="your@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={COLORS.textLight}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone *</Text>
                            <TextInput
                                style={[styles.input, errors.phone && styles.inputError]}
                                value={formData.phone}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, phone: text });
                                    if (errors.phone) setErrors({ ...errors, phone: '' });
                                }}
                                placeholder="+91 XXXXX XXXXX"
                                keyboardType="phone-pad"
                                placeholderTextColor={COLORS.textLight}
                            />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Estimated Monthly Volume *</Text>
                            <View style={styles.optionContainer}>
                                {volumeOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.optionChip,
                                            formData.estimatedMonthlyVolume === option.value && styles.optionChipActive
                                        ]}
                                        onPress={() => {
                                            setFormData({ ...formData, estimatedMonthlyVolume: option.value });
                                            if (errors.estimatedMonthlyVolume) setErrors({ ...errors, estimatedMonthlyVolume: '' });
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            formData.estimatedMonthlyVolume === option.value && styles.optionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {errors.estimatedMonthlyVolume && <Text style={styles.errorText}>{errors.estimatedMonthlyVolume}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Products Interested In</Text>
                            <View style={styles.optionContainer}>
                                {productOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionChip,
                                            formData.productInterests.includes(option.id) && styles.optionChipActive
                                        ]}
                                        onPress={() => toggleProductInterest(option.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            formData.productInterests.includes(option.id) && styles.optionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Additional Requirements</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.message}
                                onChangeText={(text) => setFormData({ ...formData, message: text })}
                                placeholder="Any specific requirements..."
                                placeholderTextColor={COLORS.textLight}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                isSubmitting && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Text style={styles.primaryButtonText}>Submit Request</Text>
                                    <Send size={18} color={COLORS.white} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* FAQ Section */}
                    <View style={styles.faqSection}>
                        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                        {faqs.map((faq, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.faqItem}
                                onPress={() => toggleFaq(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                                    {expandedFaq === index ? (
                                        <ChevronUp size={20} color={COLORS.textSecondary} />
                                    ) : (
                                        <ChevronDown size={20} color={COLORS.textSecondary} />
                                    )}
                                </View>
                                {expandedFaq === index && (
                                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingBottom: 24,
        overflow: 'hidden',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        zIndex: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerBadge: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.full,
        marginBottom: 4,
        overflow: 'hidden',
    },
    headerTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.white,
    },
    circle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    circle2: {
        position: 'absolute',
        top: 40,
        left: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: RADIUS.lg,
        ...SHADOWS.soft,
    },
    benefitItem: {
        width: '50%',
        padding: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundCool,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    benefitTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    benefitDesc: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    formSection: {
        backgroundColor: COLORS.white,
        margin: 16,
        padding: 20,
        borderRadius: RADIUS.xl,
        ...SHADOWS.soft,
    },
    sectionTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: FONTS.body,
        fontSize: 15,
        color: COLORS.text,
    },
    inputError: {
        borderColor: COLORS.error,
        backgroundColor: '#FFF5F5',
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    errorText: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: COLORS.error,
        marginTop: 4,
        marginLeft: 4,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    optionChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionText: {
        fontFamily: FONTS.body,
        fontSize: 13,
        color: COLORS.text,
    },
    optionTextActive: {
        color: COLORS.white,
        fontFamily: FONTS.bodyBold,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.full,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
        ...SHADOWS.button,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.white,
    },
    faqSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    faqItem: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        marginBottom: 12,
        padding: 16,
        ...SHADOWS.soft,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontFamily: FONTS.bodyBold,
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
        paddingRight: 16,
    },
    faqAnswer: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 12,
        lineHeight: 20,
    },
    successContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        padding: 24,
    },
    successContent: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 32,
        borderRadius: RADIUS['2xl'],
        ...SHADOWS.floating,
    },
    successIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0F2FE', // Light blue
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    successText: {
        fontFamily: FONTS.body,
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
});
