import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Wifi, Eye, EyeOff, Snowflake, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatCardNumber } from '../../lib/formatters';

/**
 * Premium 3D Credit Card Component
 * Features: 3D tilt, holographic shimmer, flip animation, realistic chip
 */
export default function CreditCard3D({
    card,
    showBalance = true,
    onToggleBalance,
    className,
    size = 'default', // 'default' | 'large' | 'small'
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [copied, setCopied] = useState(false);
    const cardRef = useRef(null);

    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animations
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const copyCardNumber = () => {
        navigator.clipboard.writeText(card.number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sizeClasses = {
        small: 'w-72 h-44',
        default: 'w-96 h-60',
        large: 'w-[420px] h-[265px]',
    };

    const isFrozen = card.cardSettings?.isFrozen;

    return (
        <div
            className={cn('perspective-1000', className)}
            style={{ perspective: '1000px' }}
        >
            <motion.div
                ref={cardRef}
                className={cn(
                    'relative cursor-pointer transition-transform duration-200',
                    sizeClasses[size]
                )}
                style={{
                    rotateX: isFlipped ? 180 : rotateX,
                    rotateY: isFlipped ? 0 : rotateY,
                    transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsFlipped(!isFlipped)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                {/* Card Front */}
                <motion.div
                    className={cn(
                        'absolute inset-0 rounded-3xl overflow-hidden',
                        'backface-hidden',
                        isFrozen && 'grayscale'
                    )}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Card gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f35] via-[#2d3561] to-[#6366F1]" />

                    {/* Holographic shimmer overlay */}
                    <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                            backgroundSize: '200% 200%',
                        }}
                        animate={{
                            backgroundPosition: ['0% 0%', '200% 200%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />

                    {/* Frosted glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/2" />

                    {/* Card content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                        {/* Top row - Chip & Logos */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                {/* Realistic chip */}
                                <div className="w-12 h-9 rounded-md bg-gradient-to-br from-[#d4af37] via-[#f4e5b8] to-[#b8860b] shadow-lg relative overflow-hidden">
                                    {/* Chip lines */}
                                    <div className="absolute inset-1 border border-[#b8860b]/50 rounded-sm" />
                                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[#b8860b]/50" />
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#b8860b]/50" />
                                </div>

                                {/* Contactless icon */}
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Wifi className="w-6 h-6 rotate-90 text-white/70" />
                                </motion.div>
                            </div>

                            {/* Card brand logo */}
                            <div className="text-right">
                                <span className="text-2xl font-bold italic tracking-wider opacity-90">VISA</span>
                            </div>
                        </div>

                        {/* Card number */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="font-mono text-xl tracking-[0.2em] text-white/90">
                                    {formatCardNumber(card.number, true)}
                                </p>
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); copyCardNumber(); }}
                                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-white/70" />
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Bottom row - Name & Balance */}
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">Card Holder</p>
                                <p className="font-medium text-sm">{card.cardName || 'Primary Card'}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">Balance</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono text-lg font-bold tabular-nums">
                                        {showBalance
                                            ? `${card.balance?.toLocaleString()} ${card.currency || 'EGP'}`
                                            : '••••••'}
                                    </p>
                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); onToggleBalance?.(); }}
                                        className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {showBalance ? (
                                            <Eye className="w-4 h-4 text-white/70" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-white/70" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Frozen overlay */}
                        {isFrozen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center rounded-3xl"
                            >
                                <div className="text-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Snowflake className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                                    </motion.div>
                                    <p className="text-blue-200 text-sm font-bold tracking-widest uppercase">Card Frozen</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Premium shadow */}
                    <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/30 blur-xl rounded-full" />
                </motion.div>

                {/* Card Back */}
                <motion.div
                    className={cn(
                        'absolute inset-0 rounded-3xl overflow-hidden',
                        'backface-hidden'
                    )}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f35] via-[#2d3561] to-[#6366F1]" />

                    {/* Magnetic stripe */}
                    <div className="absolute top-8 left-0 right-0 h-12 bg-[#1a1a2e]" />

                    {/* Signature strip & CVV */}
                    <div className="absolute top-24 left-0 right-0 px-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-10 bg-white/90 rounded flex items-center px-4">
                                <p className="font-sans italic text-gray-600 text-sm">Authorized Signature</p>
                            </div>
                            <div className="w-16 h-10 bg-white rounded flex items-center justify-center">
                                <p className="font-mono text-gray-800 font-bold">•••</p>
                            </div>
                        </div>
                        <p className="text-xs text-white/50 mt-2 text-center">
                            CVV is hidden for security • Tap to flip back
                        </p>
                    </div>

                    {/* Card info */}
                    <div className="absolute bottom-6 left-6 right-6 text-center">
                        <p className="text-xs text-white/40 leading-relaxed">
                            This card is issued by SOBS Bank. Unauthorized use is prohibited.
                            <br />
                            Contact support: +20 XXX XXX XXXX
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
