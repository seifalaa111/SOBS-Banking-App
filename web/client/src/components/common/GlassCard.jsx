import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, hover = true, ...props }) => {
    return (
        <div
            className={twMerge(
                "glass-panel rounded-2xl p-6 transition-all duration-300",
                hover && "hover:border-accent-cyan/30 hover:shadow-glow-cyan/20 hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
