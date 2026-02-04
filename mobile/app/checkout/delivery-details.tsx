import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ChevronRight,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react-native';
import { useCheckout } from '../../src/contexts/CheckoutContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { useCart } from '../../src/contexts/CartContext';

// Premium colors
// Premium colors (Coral/Teal palette)
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    charcoal: '#2D3436',
    slate: '#636E72',
    pearl: '#F8F9FA',
    error: '#EF4444',
    success: '#10B981',
};

interface FormErrors {
    firstName?: string;
    phone?: string;
    email?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export default function DeliveryDetailsScreen() {
    const router = useRouter();
    const { deliveryDetails, setDeliveryDetails } = useCheckout();
    const { user } = useAuth();
    const { cart } = useCart();

    // Form state
    const [firstName, setFirstName] = useState(deliveryDetails.firstName);
    const [lastName, setLastName] = useState(deliveryDetails.lastName);
    const [phone, setPhone] = useState(deliveryDetails.phone);
    const [email, setEmail] = useState(deliveryDetails.email);
    const [street, setStreet] = useState(deliveryDetails.street);
    const [city, setCity] = useState(deliveryDetails.city);
    const [state, setState] = useState(deliveryDetails.state || 'Haryana');
    const [zipCode, setZipCode] = useState(deliveryDetails.zipCode);
    const [orderNotes, setOrderNotes] = useState(deliveryDetails.orderNotes);
    const [errors, setErrors] = useState<FormErrors>({});

    // Pre-fill from user data if available
    useEffect(() => {
        if (user && !firstName) {
            const nameParts = (user.name || '').split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            router.replace('/(tabs)/cart');
        }
    }, [cart]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'Name is required';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\s\-+()]{10,}$/.test(phone.trim())) {
            newErrors.phone = 'Enter a valid phone number';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!street.trim()) {
            newErrors.street = 'Address is required';
        }

        if (!city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!zipCode.trim()) {
            newErrors.zipCode = 'PIN code is required';
        } else if (!/^\d{6}$/.test(zipCode.trim())) {
            newErrors.zipCode = 'Enter a valid 6-digit PIN code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateForm()) {
            setDeliveryDetails({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                street: street.trim(),
                city: city.trim(),
                state: state.trim(),
                zipCode: zipCode.trim(),
                country: 'India',
                orderNotes: orderNotes.trim(),
            });
            router.push('/checkout/review-order');
        }
    };

    const renderInput = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        icon: React.ReactNode,
        error?: string,
        options?: {
            placeholder?: string;
            keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
            multiline?: boolean;
            maxLength?: number;
        }
    ) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <View style={styles.inputIcon}>{icon}</View>
                <TextInput
                    style={[styles.input, options?.multiline && styles.inputMultiline]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={options?.placeholder || `Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={options?.keyboardType || 'default'}
                    multiline={options?.multiline}
                    numberOfLines={options?.multiline ? 3 : 1}
                    maxLength={options?.maxLength}
                    textAlignVertical={options?.multiline ? 'top' : 'center'}
                />
            </View>
            {error && (
                <View style={styles.errorContainer}>
                    <AlertCircle size={12} color={COLORS.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.coral} />

            {/* Custom Header */}
            <SafeAreaView edges={['top']} style={styles.headerSafe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Delivery Details</Text>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Customer Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Customer Information</Text>

                        <View style={styles.nameRow}>
                            <View style={styles.halfInput}>
                                {renderInput(
                                    'First Name',
                                    firstName,
                                    setFirstName,
                                    <User size={18} color={COLORS.slate} />,
                                    errors.firstName,
                                    { placeholder: 'First name' }
                                )}
                            </View>
                            <View style={styles.halfInput}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Last Name</Text>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.inputIcon}>
                                            <User size={18} color={COLORS.slate} />
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            value={lastName}
                                            onChangeText={setLastName}
                                            placeholder="Last name"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {renderInput(
                            'Phone Number',
                            phone,
                            setPhone,
                            <Phone size={18} color={COLORS.slate} />,
                            errors.phone,
                            { placeholder: '+91 98765 43210', keyboardType: 'phone-pad' }
                        )}

                        {renderInput(
                            'Email Address',
                            email,
                            setEmail,
                            <Mail size={18} color={COLORS.slate} />,
                            errors.email,
                            { placeholder: 'you@example.com', keyboardType: 'email-address' }
                        )}
                    </View>

                    {/* Delivery Address Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>

                        {renderInput(
                            'Street Address',
                            street,
                            setStreet,
                            <MapPin size={18} color={COLORS.slate} />,
                            errors.street,
                            { placeholder: 'House no., Street, Landmark', multiline: true }
                        )}

                        <View style={styles.nameRow}>
                            <View style={styles.halfInput}>
                                {renderInput(
                                    'City',
                                    city,
                                    setCity,
                                    <MapPin size={18} color={COLORS.slate} />,
                                    errors.city,
                                    { placeholder: 'City' }
                                )}
                            </View>
                            <View style={styles.halfInput}>
                                {renderInput(
                                    'State',
                                    state,
                                    setState,
                                    <MapPin size={18} color={COLORS.slate} />,
                                    errors.state,
                                    { placeholder: 'State' }
                                )}
                            </View>
                        </View>

                        {renderInput(
                            'PIN Code',
                            zipCode,
                            setZipCode,
                            <MapPin size={18} color={COLORS.slate} />,
                            errors.zipCode,
                            { placeholder: '125039', keyboardType: 'numeric', maxLength: 6 }
                        )}
                    </View>

                    {/* Order Notes Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputContainer}>
                                <View style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 12 }]}>
                                    <FileText size={18} color={COLORS.slate} />
                                </View>
                                <TextInput
                                    style={[styles.input, styles.inputMultiline]}
                                    value={orderNotes}
                                    onChangeText={setOrderNotes}
                                    placeholder="Special delivery instructions, preferred timing, etc."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Spacer for button */}
                    <View style={{ height: 120 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Continue Button */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>Continue to Review</Text>
                    <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pearl,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.charcoal,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.pearl,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    inputContainerError: {
        borderColor: COLORS.error,
        borderWidth: 2,
    },
    inputIcon: {
        padding: 14,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.charcoal,
        paddingVertical: 14,
        paddingRight: 14,
    },
    inputMultiline: {
        minHeight: 80,
        paddingTop: 14,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.error,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.coral,
        paddingVertical: 18,
        borderRadius: 16,
        gap: 8,
        shadowColor: COLORS.coral,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    headerSafe: {
        backgroundColor: COLORS.coral,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.coral,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
