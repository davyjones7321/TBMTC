/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // New coral/teal color palette
                coral: '#D84A4A',
                coralLight: '#E57373',
                teal: '#4A9B9B',
                cream: '#FFF8F0',
                creamTint: '#FFF5E6',
                charcoal: '#2D3436',
                slate: '#636E72',
                pearl: '#FFF8F0',
                success: '#27AE60',
                warning: '#F39C12',
                info: '#3498DB',
                // Legacy aliases for backwards compatibility
                burgundy: '#D84A4A',
                crimson: '#E57373',
                terracotta: '#4A9B9B',
                blush: '#FFF5E6',
                // Keep primary for backwards compatibility
                primary: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
            },
        },
    },
    plugins: [],
};
