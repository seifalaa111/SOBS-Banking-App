import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import NeonButton from '../../components/common/NeonButton';

// Floating card component - NO ICONS
const FloatingCard = ({ delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        className={`absolute ${className}`}
    >
        <motion.div
            animate={{
                y: [0, -15, 0],
                rotateZ: [0, 2, 0, -2, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-28 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 shadow-2xl p-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-5 rounded bg-gradient-to-r from-yellow-400 to-orange-500" />
                <span className="text-xs text-white/50">VISA</span>
            </div>
            <div className="text-xs text-white/40 font-mono">•••• •••• •••• 4242</div>
            <div className="mt-2 text-sm font-semibold text-white/80">$12,450.00</div>
        </motion.div>
    </motion.div>
);

// Animated stat counter
const StatCounter = ({ value, label, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                {prefix}{count.toLocaleString()}{suffix}
            </div>
            <div className="text-text-muted mt-2">{label}</div>
        </div>
    );
};

// Feature Card - NO ICONS, uses emojis
const FeatureCard = ({ emoji, title, desc, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer"
    >
        <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-3xl`}
        >
            {emoji}
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400">{desc}</p>
    </motion.div>
);

export default function Landing() {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const features = [
        { emoji: '🔒', title: 'Bank-Grade Security', desc: '2FA authentication & encrypted transactions', color: 'from-emerald-400 to-green-500' },
        { emoji: '⚡', title: 'Instant Transfers', desc: 'Send money in seconds, not days', color: 'from-amber-400 to-orange-500' },
        { emoji: '💳', title: 'Virtual Cards', desc: 'Create and manage multiple cards', color: 'from-violet-400 to-purple-500' },
        { emoji: '🌍', title: 'Pay Bills Anywhere', desc: 'Electricity, water, internet & more', color: 'from-cyan-400 to-blue-500' },
    ];

    return (
        <div className="min-h-screen bg-black overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute top-[-30%] left-[-15%] w-[70%] h-[70%] bg-purple-600/15 blur-[200px] rounded-full"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-30%] right-[-15%] w-[60%] h-[60%] bg-cyan-500/12 blur-[200px] rounded-full"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -20, 0],
                        scale: [1.1, 1, 1.1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-[30%] h-[30%] bg-pink-500/8 blur-[150px] rounded-full"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>

            {/* Navigation - NO ICONS */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <motion.div
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white text-xl font-bold"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                        ◆
                    </motion.div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">SOBS</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors px-4 py-2 hidden sm:block">
                        Sign In
                    </Link>
                    <Link to="/register">
                        <NeonButton className="py-2.5 px-6">
                            Get Started →
                        </NeonButton>
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <motion.main
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32"
            >
                {/* Floating Cards */}
                <FloatingCard delay={0.8} className="top-20 left-[5%] hidden lg:block" />
                <FloatingCard delay={1} className="top-40 right-[8%] hidden lg:block" />

                <div className="text-center max-w-4xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-sm mb-8"
                    >
                        <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="text-lg"
                        >
                            ✨
                        </motion.span>
                        <span className="text-gray-300">Next-Gen Banking Platform</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium">NEW</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-bold mb-8 leading-[1.1]"
                    >
                        <span className="text-white">Banking Made</span>
                        <br />
                        <motion.span
                            className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Effortless
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Experience seamless digital banking with instant transfers, smart savings,
                        and complete control over your finances — all secured with bank-grade encryption.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/register">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <NeonButton className="px-10 py-4 text-lg w-full sm:w-auto">
                                    Start Free →
                                </NeonButton>
                            </motion.div>
                        </Link>
                        <Link to="/login">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <NeonButton variant="secondary" className="px-10 py-4 text-lg w-full sm:w-auto">
                                    Sign In
                                </NeonButton>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="flex flex-col items-center"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-gray-500 text-sm mb-2">Scroll to explore</span>
                    <span className="text-gray-500 text-xl">↓</span>
                </motion.div>
            </motion.main>

            {/* Stats Section */}
            <section className="relative z-10 py-20 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCounter value={50000} suffix="+" label="Active Users" />
                        <StatCounter value={99.9} suffix="%" label="Uptime" />
                        <StatCounter prefix="$" value={2} suffix="B+" label="Transactions" />
                        <StatCounter value={4.9} suffix="/5" label="User Rating" />
                    </div>
                </div>
            </section>

            {/* Features Grid - NO ICONS, uses emojis */}
            <section className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything You Need</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Powerful features to manage your money smarter, faster, and more securely.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard key={i} {...feature} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 border border-white/10 rounded-3xl p-12 md:p-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Banking?
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                            Join thousands of users who've already made the switch to smarter banking.
                        </p>
                        <Link to="/register">
                            <NeonButton className="px-12 py-5 text-lg">
                                Create Your Free Account →
                            </NeonButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer - NO ICONS */}
            <footer className="relative z-10 border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                ◆
                            </div>
                            <span className="text-lg font-bold text-white">SOBS</span>
                        </div>
                        <p className="text-gray-500 text-sm">© 2025 SOBS - Secure Online Banking System. All rights reserved.</p>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
