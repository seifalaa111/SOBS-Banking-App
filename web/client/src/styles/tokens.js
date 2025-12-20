/**
 * SOBS Design System - Source of Truth
 * 
 * "In the darkness, the interface glows."
 */

export const colors = {
    bg: {
        void: '#000000',       // True black
        primary: '#050508',    // Near black
        secondary: '#0a0e17',  // Deep space
        tertiary: '#0f1420',   // Card bg
        elevated: '#141922',   // Modals/Dropdowns
        hover: '#1a202c',      // Interactive hover
    },
    accent: {
        cyan: '#00f2ff',       // Primary Action
        purple: '#7000ff',     // Secondary Action
        pink: '#ff0080',       // Tertiary
        blue: '#0066ff',       // Info
    },
    text: {
        primary: '#ffffff',
        secondary: '#94a3b8',
        muted: '#64748b',
        disabled: '#475569',
    },
    status: {
        success: '#00ff9d',
        warning: '#ffb800',
        error: '#ff0055',
        info: '#00b4ff',
    },
    glass: {
        bg: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.08)',
        hover: 'rgba(255, 255, 255, 0.06)',
    }
};

export const shadows = {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 4px 12px rgba(0, 0, 0, 0.6)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.7)',
    glow: {
        cyan: '0 0 40px rgba(0, 242, 255, 0.4)',
        purple: '0 0 40px rgba(112, 0, 255, 0.4)',
        error: '0 0 20px rgba(255, 0, 85, 0.4)',
    }
};

export const animations = {
    transition: {
        default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    }
};

// For Tailwind Config (Flattened where necessary)
export const tailwindTheme = {
    extend: {
        colors: {
            ...colors.bg,
            ...colors.text,
            ...colors.status,
            accent: colors.accent,
            glass: colors.glass,
        },
        boxShadow: shadows,
        animation: {
            'shimmer': 'shimmer 2s linear infinite',
            'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
            shimmer: {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
            },
            pulseGlow: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: .5 },
            }
        }
    }
};
