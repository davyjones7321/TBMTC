/**
 * JHOMFOODS Mobile App - Design System
 * Based on Google Stitch Premium UI Design
 */

// Color Palette - Premium Blue Theme
export const COLORS = {
    // Primary colors
    primary: '#0EA5E9',           // Sky Blue - main actions
    primaryDark: '#0284C7',       // Darker blue for pressed states
    primaryLight: '#38BDF8',      // Light blue for accents

    // Secondary colors
    secondary: '#14453D',         // Deep Forest Green
    secondaryLight: '#1E5F55',    // Lighter green

    // Accent colors
    accent: '#D4AF37',            // Gold - premium badges
    accentWarm: '#F59E0B',        // Amber - bestseller badges

    // Background colors
    background: '#F7F5F2',        // Warm off-white
    backgroundCool: '#E8EBF0',    // Cool slate
    backgroundDark: '#0F172A',    // Deep charcoal (dark mode)

    // Surface colors
    card: '#FFFFFF',
    cardDark: '#1E293B',

    // Glass colors
    glassLight: 'rgba(255, 255, 255, 0.65)',
    glassDark: 'rgba(15, 23, 42, 0.75)',

    // Text colors
    text: '#334155',              // Slate 700
    textSecondary: '#64748B',     // Slate 500
    textLight: '#94A3B8',         // Slate 400
    textDark: '#E2E8F0',          // For dark mode

    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    // Neutral
    white: '#FFFFFF',
    black: '#000000',
    border: '#E5E7EB',
    borderDark: '#374151',
} as const;

// Typography
export const FONTS = {
    display: 'PlayfairDisplay_400Regular',
    displayMedium: 'PlayfairDisplay_500Medium',
    displaySemiBold: 'PlayfairDisplay_600SemiBold',
    displayBold: 'PlayfairDisplay_700Bold',
    displayItalic: 'PlayfairDisplay_400Regular_Italic',
    body: 'Lato_400Regular',
    bodyLight: 'Lato_300Light',
    bodyBold: 'Lato_700Bold',
} as const;

// Font Sizes
export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 22,
    '3xl': 28,
    '4xl': 36,
    '5xl': 48,
} as const;

// Border Radius
export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    full: 9999,
} as const;

// Shadows
export const SHADOWS = {
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 4,
    },
    floating: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 50,
        elevation: 8,
    },
    glass: {
        shadowColor: 'rgba(31, 38, 135, 0.37)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 32,
        elevation: 6,
    },
    premium: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    button: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 5,
    },
} as const;

// Spacing
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
} as const;

// Animation durations
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

// Export a combined theme object
export const theme = {
    colors: COLORS,
    fonts: FONTS,
    fontSizes: FONT_SIZES,
    radius: RADIUS,
    shadows: SHADOWS,
    spacing: SPACING,
    animation: ANIMATION,
} as const;

export default theme;
