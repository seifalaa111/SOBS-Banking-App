import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlowInput = React.forwardRef(({ label, error, className, id, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label htmlFor={id} className="block text-sm text-text-secondary mb-2 font-medium">{label}</label>}
            <input
                ref={ref}
                id={id}
                className={twMerge(
                    "w-full bg-bg-secondary/50 border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted transition-all duration-300 focus:outline-none focus:border-accent-cyan focus:shadow-glow-cyan/20",
                    error && "border-status-error focus:border-status-error focus:shadow-glow-error/20",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-status-error animate-pulse">{error}</p>}
        </div>
    );
});

export default GlowInput;
