import { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, ShoppingCart, ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { useProducts } from '../../src/contexts/ProductsContext';
import { useLocation } from '../../src/contexts/LocationContext';
import CategoryNav from '../../src/components/CategoryNav';
import ProductCard from '../../src/components/ProductCard';
import HeroSection from '../../src/components/HeroSection';
import WeeklySelection from '../../src/components/WeeklySelection';
import BulkOrdersCTA from '../../src/components/BulkOrdersCTA';
import { useCart } from '../../src/contexts/CartContext';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../src/lib/theme';

export default function HomeScreen() {
    const router = useRouter();
    const { cartCount } = useCart();
    const { selectedLocation } = useLocation();
    const { products, categories, loading, error, refreshProducts } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Filter products based on category and search
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by category
        if (activeCategory !== 'All') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                p =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [products, activeCategory, searchQuery]);

    // Get current category name for title
    const getCategoryTitle = () => {
        if (activeCategory === 'All') return 'Featured Products';
        return `${activeCategory} Selection`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    {/* Location - Tappable */}
                    <TouchableOpacity
                        style={styles.locationContainer}
                        onPress={() => router.push('/location-select')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.locationLabel}>
                            <MapPin size={12} color={COLORS.primary} />
                            <Text style={styles.locationLabelText}>Delivering to</Text>
                            <ChevronDown size={12} color={COLORS.primary} style={{ marginLeft: 2 }} />
                        </View>
                        <Text style={styles.locationText} numberOfLines={1}>
                            {selectedLocation
                                ? `${selectedLocation.area}, ${selectedLocation.city}`
                                : 'Select delivery location'}
                        </Text>
                    </TouchableOpacity>

                    {/* Right side icons */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={() => router.push('/cart')}
                        >
                            <ShoppingCart size={22} color={COLORS.primary} />
                            {cartCount > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search size={18} color={COLORS.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for fresh meat, seafood..."
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.filterButton}>
                        <SlidersHorizontal size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Main Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Section */}
                <HeroSection onShopNow={() => setActiveCategory('All')} />

                {/* Weekly Selection */}
                <WeeklySelection
                    products={products}
                    onProductPress={(id) => router.push(`/product/${id}`)}
                />

                {/* Category Navigation */}
                <View style={styles.categorySection}>
                    <CategoryNav
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        categories={categories}
                    />
                </View>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{getCategoryTitle()}</Text>
                </View>

                {/* Products Grid */}
                <View style={styles.productGrid}>
                    {filteredProducts.map((product) => (
                        <View key={product.id} style={styles.productCardWrapper}>
                            <ProductCard
                                product={product}
                                onPress={() => router.push(`/product/${product.id}`)}
                            />
                        </View>
                    ))}
                </View>

                {filteredProducts.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Search size={48} color={COLORS.border} />
                        <Text style={styles.emptyTitle}>No products found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try adjusting your search or category filter
                        </Text>
                    </View>
                )}

                {/* Bulk Orders CTA */}
                <BulkOrdersCTA />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.card,
        borderBottomLeftRadius: RADIUS.xl,
        borderBottomRightRadius: RADIUS.xl,
        ...SHADOWS.soft,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    locationContainer: {
        flex: 1,
    },
    locationLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    locationLabelText: {
        fontFamily: FONTS.body,
        fontSize: 11,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    locationText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.text,
        maxWidth: 200,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cartButton: {
        padding: 10,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.card,
    },
    cartBadgeText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10,
        color: COLORS.white,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        marginHorizontal: SPACING.lg,
        marginVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: 14,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.md,
        marginRight: SPACING.sm,
        fontFamily: FONTS.body,
        fontSize: 15,
        color: COLORS.text,
    },
    filterButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    categorySection: {
        marginTop: SPACING['2xl'],
    },
    sectionHeader: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.md,
    },
    sectionTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.sm,
    },
    productCardWrapper: {
        width: '50%',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        opacity: 0.7,
    },
    emptyTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 18,
        color: COLORS.textSecondary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptySubtitle: {
        fontFamily: FONTS.body,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});

