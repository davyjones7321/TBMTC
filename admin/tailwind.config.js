/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Soft UI Primary Colors
                primary: {
                    50: '#f0f2ff',
                    100: '#e5e7ff',
                    200: '#c7ccff',
                    300: '#a5aaff',
                    400: '#7b7fff',
                    500: '#5e72e4',
                    600: '#4c63d2',
                    700: '#3d51bf',
                    800: '#2f3f9e',
                    900: '#1f2a6b',
                },
                // Secondary
                secondary: {
                    DEFAULT: '#8392ab',
                    light: '#acb4c4',
                    dark: '#67748e',
                },
                // Status Colors
                success: {
                    DEFAULT: '#82d616',
                    light: '#98ec2d',
                    dark: '#17ad37',
                },
                danger: {
                    DEFAULT: '#ea0606',
                    light: '#ff667c',
                    dark: '#c70505',
                },
                warning: {
                    DEFAULT: '#fbcf33',
                    light: '#ffd454',
                    dark: '#f5b800',
                },
                info: {
                    DEFAULT: '#17c1e8',
                    light: '#21d4fd',
                    dark: '#0ea5cc',
                },
                // Neutrals
                dark: {
                    DEFAULT: '#344767',
                    light: '#4a5568',
                    lighter: '#5a6c7d',
                },
                light: {
                    DEFAULT: '#f8f9fa',
                    dark: '#e9ecef',
                },
                // Gradients (as background classes)
                'gradient-primary': 'linear-gradient(310deg, #2152ff, #21d4fd)',
                'gradient-success': 'linear-gradient(310deg, #17ad37, #98ec2d)',
                'gradient-danger': 'linear-gradient(310deg, #ea0606, #ff667c)',
                'gradient-warning': 'linear-gradient(310deg, #f5b800, #ffd454)',
                'gradient-info': 'linear-gradient(310deg, #0ea5cc, #21d4fd)',
                'gradient-dark': 'linear-gradient(310deg, #141727, #2f3f9e)',
                'gradient-purple': 'linear-gradient(310deg, #7928CA, #FF0080)',

                // Legacy colors for compatibility
                border: "hsl(214.3 31.8% 91.4%)",
                input: "hsl(214.3 31.8% 91.4%)",
                ring: "hsl(221.2 83.2% 53.3%)",
                background: "hsl(0 0% 100%)",
                foreground: "hsl(222.2 84% 4.9%)",
                muted: {
                    DEFAULT: "hsl(210 40% 96.1%)",
                    foreground: "hsl(215.4 16.3% 46.9%)",
                },
                accent: {
                    DEFAULT: "hsl(210 40% 96.1%)",
                    foreground: "hsl(222.2 47.4% 11.2%)",
                },
                destructive: {
                    DEFAULT: "hsl(0 84.2% 60.2%)",
                    foreground: "hsl(210 40% 98%)",
                },
                popover: {
                    DEFAULT: "hsl(0 0% 100%)",
                    foreground: "hsl(222.2 84% 4.9%)",
                },
                card: {
                    DEFAULT: "hsl(0 0% 100%)",
                    foreground: "hsl(222.2 84% 4.9%)",
                },
            },
            // Soft UI Border Radius
            borderRadius: {
                'soft-sm': '0.375rem',   // 6px
                'soft-md': '0.5rem',     // 8px
                'soft-lg': '0.75rem',    // 12px
                'soft-xl': '1rem',       // 16px
                'soft-2xl': '1.25rem',   // 20px
                'soft-3xl': '1.5rem',    // 24px
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
            // Soft UI Box Shadows
            boxShadow: {
                'soft-xs': '0 2px 9px -5px rgba(0, 0, 0, 0.15)',
                'soft-sm': '0 0.25rem 0.375rem -0.0625rem rgba(20, 20, 20, 0.12), 0 0.125rem 0.25rem -0.0625rem rgba(20, 20, 20, 0.07)',
                'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 8px 26px -4px rgba(20, 20, 20, 0.15), 0 8px 9px -5px rgba(20, 20, 20, 0.06)',
                'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
                'soft-xxl': '0 23px 45px 0 rgba(0, 0, 0, 0.1)',
                'soft-inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
            },
            // Background Gradients
            backgroundImage: {
                'gradient-primary': 'linear-gradient(310deg, #2152ff, #21d4fd)',
                'gradient-success': 'linear-gradient(310deg, #17ad37, #98ec2d)',
                'gradient-danger': 'linear-gradient(310deg, #ea0606, #ff667c)',
                'gradient-warning': 'linear-gradient(310deg, #f5b800, #ffd454)',
                'gradient-info': 'linear-gradient(310deg, #0ea5cc, #21d4fd)',
                'gradient-dark': 'linear-gradient(310deg, #141727, #2f3f9e)',
                'gradient-purple': 'linear-gradient(310deg, #7928CA, #FF0080)',
                'gradient-light': 'linear-gradient(310deg, #f8f9fa, #ffffff)',
            },
            // Typography
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'sans-serif'],
            },
            fontSize: {
                'xxs': '0.625rem',    // 10px
                'xs': '0.75rem',      // 12px
                'sm': '0.875rem',     // 14px
                'base': '1rem',       // 16px
                'lg': '1.125rem',     // 18px
                'xl': '1.25rem',      // 20px
                '2xl': '1.5rem',      // 24px
                '3xl': '1.875rem',    // 30px
                '4xl': '2.25rem',     // 36px
            },
            // Spacing for consistent padding/margins
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            // Z-index layers
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
            // Backdrop blur for glassmorphism
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
            },
        },
    },
    plugins: [],
}
