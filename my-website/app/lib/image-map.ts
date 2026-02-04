// Image mapping from product names to local image files
// Maps MongoDB product names to local images in /images folder

const IMAGE_BASE_PATH = '/images';

// Product name to image file mapping
const productImageMap: Record<string, string> = {
    // Fish
    'Anchovy': 'ANCHOVY.png',
    'Basa Chilled': 'BASA CHILLED.png',
    'Bhetki': 'BHETKI.png',
    'Black Pomfret': 'BLACK POMFRET.png',
    'Catla': 'CATLA.png',
    'Crab': 'crab.png',
    'Crab Meat': 'crab meat.png',
    'Indian Basa': 'INDIAN BASA.png',
    'King Fish': 'KING FISH.jpg',
    'Lobster': 'LOBSTER.png',
    'Mackerel': 'MACKEREL.png',
    'Mahi Mahi': 'MAHI MAHI.png',
    'Rohu': 'ROHU.png',
    'Sardine': 'SARDINE.png',
    'Seer Fish': 'SEER FISH.jpg',
    'Squid Rings': 'squid rings.png',
    'Squid Tube': 'Squid Tube.jpg',
    'Tilapia': 'TILAPIA.png',
    'Vietnam Basa': 'VIETNAM BASA.png',
    'White Pomfret': 'WHITE POMFRET.png',

    // Prawns
    'Prawns PD': 'prawns-pd.png',
    'Prawns PDTO': 'prawns-PDTO.png',
    'Tiger Prawns': 'tiger prawns.png',

    // Chicken
    'Chicken Breast Boneless': 'CHICKEN BREAST BONELESS.png',
    'Chicken Curry Cut': 'CHICKEN CURRY CUT.png',
    'Chicken Drum Stick': 'CHICKEN DRUM STICK.png',
    'Chicken Leg Boneless': 'CHICKEN LEG BONELESS.png',
    'Chicken Lollipop': 'CHICKEN LOLLIPOP.png',
    'Chicken Thigh Boneless': 'CHICKEN THIGH BONELESS.png',
    'Chicken Whole Bird': 'CHICKEN WHOLE BIRD.png',
    'Chicken Whole Leg': 'CHICKEN WHOLE LEG.png',
    'Chicken Wings': 'CHICKEN WINGS.png',

    // Mutton
    'Australian Mutton Curry Cut': 'AUSTRALIAN CURRY CUT.png',
    'Australian Jumbo Curry Cut': 'AUSTRALIAN JUMBO CURRY CUT.png',
    'Australian Mutton Mince': 'Australian Mutton Mince.png',
    'Australian Mutton Raan/Leg': 'Australian Mutton RaanLeg.png',
    'Mutton Boneless': 'MUTTON BONELESS.png',
    'Mutton Brain': 'mutton brain.png',
    'Mutton Chops': 'MUTTON CHOPS.png',
    'Mutton Curry Cut': 'MUTTON CURRY CUT.png',
    'Mutton Delicate Curry Cut': 'MUTTON DELICATE CURRY CUT.png',
    'Mutton Fat': 'mutton fat.png',
    'Mutton Kidney': 'mutton-kedney.png',
    'Mutton Liver': 'mutton liver.png',
    'Mutton Paya': 'MUTTON PAYA.png',
    'Mutton Raan/Leg': 'Mutton RaanLeg.png',
    'Mutton Shank/Nali': 'MUTTON SHANK.png',
    'Mutton Mince/Kheema': 'Australian Mutton Mince.png', // Fallback
};

// Get local image path for a product
export function getProductImage(productName: string): string {
    const imageName = productImageMap[productName];
    if (imageName) {
        return `${IMAGE_BASE_PATH}/${imageName}`;
    }

    // Try partial matching
    for (const [name, image] of Object.entries(productImageMap)) {
        if (
            productName.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(productName.toLowerCase())
        ) {
            return `${IMAGE_BASE_PATH}/${image}`;
        }
    }

    // Return placeholder
    return '/images/placeholder-product.svg';
}

// Get image from product data (handles both local and remote images)
export function getProductImageUrl(product: {
    name: string;
    images?: Array<{ url: string; isPrimary?: boolean }>
}): string {
    // First, try to get local image
    const localImage = getProductImage(product.name);
    if (localImage !== '/images/placeholder-product.svg') {
        return localImage;
    }

    // Fall back to product's stored image
    if (product.images && product.images.length > 0) {
        const primaryImage = product.images.find(img => img.isPrimary);
        return primaryImage?.url || product.images[0].url;
    }

    return localImage;
}

// Category name to slug mapping
export const categorySlugMap: Record<string, string> = {
    'Fish': 'fish',
    'Prawns': 'prawns',
    'Chicken': 'chicken',
    'Mutton': 'mutton',
    'Seafood': 'seafood',
    'Buffalo': 'buffalo', // Hidden from UI
};

// Check if category should be hidden
export function isHiddenCategory(categoryName: string): boolean {
    return categoryName.toLowerCase() === 'buffalo';
}

export default productImageMap;

