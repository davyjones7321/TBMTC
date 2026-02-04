import { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, Mic, ShoppingCart, RefreshCw, ChevronDown } from 'lucide-react-native';
import { useProducts } from '../../src/contexts/ProductsContext';
import { useLocation } from '../../src/contexts/LocationContext';
import CategoryNav from '../../src/components/CategoryNav';
import ProductCard from '../../src/components/ProductCard';
import { useCart } from '../../src/contexts/CartContext';

// Premium colors - Coral/Teal palette
const COLORS = {
    coral: '#D84A4A',
    coralLight: '#E57373',
    teal: '#4A9B9B',
    charcoal: '#2D3436',
    slate: '#636E72',
    cream: '#FFF8F0',
};

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
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
                            <MapPin size={12} color={COLORS.coral} />
                            <Text style={styles.locationLabelText}>Delivering to</Text>
                            <ChevronDown size={12} color={COLORS.coral} style={{ marginLeft: 2 }} />
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
                            <ShoppingCart size={22} color={COLORS.coral} />
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
                    <Search size={18} color={COLORS.slate} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for fresh meat, seafood..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.micButton}>
                        <Mic size={18} color={COLORS.coral} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Category Navigation */}
            <CategoryNav
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categories={categories}
            />

            {/* Section Title */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{getCategoryTitle()}</Text>
            </View>

            {/* Products Grid */}
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                    <View style={styles.productCardWrapper}>
                        <ProductCard
                            product={item}
                            onPress={() => router.push(`/product/${item.id}`)}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Search size={48} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No products found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try adjusting your search or category filter
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
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
        fontSize: 11,
        color: COLORS.slate,
        fontWeight: '500',
        marginLeft: 4,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.charcoal,
        maxWidth: 200,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cartButton: {
        padding: 10,
        backgroundColor: COLORS.cream,
        borderRadius: 12,
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: COLORS.coral,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    cartBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cream,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
        fontSize: 15,
        color: COLORS.charcoal,
    },
    micButton: {
        padding: 4,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.charcoal,
        letterSpacing: -0.5,
    },
    productList: {
        padding: 8,
        paddingBottom: 120, // Extra padding for floating nav
    },
    productCardWrapper: {
        flex: 1,
        maxWidth: '50%',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        opacity: 0.7,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.slate,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
