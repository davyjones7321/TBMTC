// Local image mapping for mobile app
// Maps product imageKey to require() statements for bundled images

// Image assets - using require for React Native bundling
// These images are copied from frontend/public/images/
export const productImages: Record<string, any> = {
    // Fish
    squid_rings: require('../../assets/images/products/squid_rings.png'),
    squid_tube: require('../../assets/images/products/squid_tube.jpg'),
    mahi_mahi: require('../../assets/images/products/mahi_mahi.png'),
    black_pomfret: require('../../assets/images/products/black_pomfret.png'),
    white_pomfret: require('../../assets/images/products/white_pomfret.png'),
    king_fish: require('../../assets/images/products/king_fish.jpg'),
    seer_fish: require('../../assets/images/products/seer_fish.jpg'),
    indian_basa: require('../../assets/images/products/indian_basa.png'),
    vietnam_basa: require('../../assets/images/products/vietnam_basa.png'),
    bhetki: require('../../assets/images/products/bhetki.png'),
    catla: require('../../assets/images/products/catla.png'),
    rohu: require('../../assets/images/products/rohu.png'),
    tilapia: require('../../assets/images/products/tilapia.png'),
    sardine: require('../../assets/images/products/sardine.png'),
    mackerel: require('../../assets/images/products/mackerel.png'),
    anchovy: require('../../assets/images/products/anchovy.png'),
    basa_chilled: require('../../assets/images/products/basa_chilled.png'),
    crab: require('../../assets/images/products/crab.png'),

    // Prawns
    prawns_pdto: require('../../assets/images/products/prawns_pdto.png'),
    prawns_pd: require('../../assets/images/products/prawns_pd.png'),
    tiger_prawns: require('../../assets/images/products/tiger_prawns.png'),

    // Chicken
    chicken_breast: require('../../assets/images/products/chicken_breast.png'),
    chicken_curry_cut: require('../../assets/images/products/chicken_curry_cut.png'),
    chicken_drum_stick: require('../../assets/images/products/chicken_drum_stick.png'),
    chicken_leg_boneless: require('../../assets/images/products/chicken_leg_boneless.png'),
    chicken_lollipop: require('../../assets/images/products/chicken_lollipop.png'),
    chicken_thigh_boneless: require('../../assets/images/products/chicken_thigh_boneless.png'),
    chicken_whole_leg: require('../../assets/images/products/chicken_whole_leg.png'),
    chicken_wings: require('../../assets/images/products/chicken_wings.png'),
    chicken_whole_bird: require('../../assets/images/products/chicken_whole_bird.png'),

    // Mutton
    mutton_curry_cut: require('../../assets/images/products/mutton_curry_cut.png'),
    mutton_boneless: require('../../assets/images/products/mutton_boneless.png'),
    mutton_chops: require('../../assets/images/products/mutton_chops.png'),
    mutton_raan_leg: require('../../assets/images/products/mutton_raan_leg.png'),
    mutton_shank: require('../../assets/images/products/mutton_shank.png'),
    mutton_paya: require('../../assets/images/products/mutton_paya.png'),
    mutton_fat: require('../../assets/images/products/mutton_fat.png'),
    mutton_mince: require('../../assets/images/products/mutton_mince.png'),
    mutton_delicate: require('../../assets/images/products/mutton_delicate.png'),
    mutton_brain: require('../../assets/images/products/mutton_brain.png'),
    aus_curry_cut: require('../../assets/images/products/aus_curry_cut.png'),
    aus_jumbo_curry: require('../../assets/images/products/aus_jumbo_curry.png'),
    aus_mince: require('../../assets/images/products/aus_mince.png'),
    aus_raan_leg: require('../../assets/images/products/aus_raan_leg.png'),
    mutton_liver: require('../../assets/images/products/mutton_liver.png'),
    mutton_kidney: require('../../assets/images/products/mutton_kidney.png'),

    // Seafood
    crab_meat: require('../../assets/images/products/crab_meat.png'),
    lobster: require('../../assets/images/products/lobster.png'),
};

// Fallback placeholder image
export const placeholderImage = require('../../assets/images/placeholder.png');

// Helper function to get product image
export const getProductImage = (imageKey: string): any => {
    return productImages[imageKey] || placeholderImage;
};
