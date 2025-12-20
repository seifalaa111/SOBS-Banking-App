import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const NeonButton = ({ children, variant = 'primary', className, loading, disabled, ...props }) => {
    const variants = {
        primary: "bg-gradient-to-br from-accent-purple to-accent-cyan text-white shadow-lg shadow-accent-purple/20 hover:shadow-glow-cyan hover:scale-[1.02]",
        secondary: "bg-glass-bg border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10 hover:border-accent-cyan",
        ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-glass-hover",
        danger: "bg-status-error/10 border border-status-error/30 text-status-error hover:bg-status-error/20 hover:shadow-glow-error"
    };

    return (
        <button
            className={twMerge(
                "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};

export default NeonButton;
