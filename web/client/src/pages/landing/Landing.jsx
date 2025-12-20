import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, CreditCard, Send, ArrowRight, Sparkles, Globe, Lock } from 'lucide-react';
import NeonButton from '../../components/common/NeonButton';

export default function Landing() {
    const features = [
        { icon: Shield, title: 'Bank-Grade Security', desc: '2FA authentication & encrypted transactions', color: 'from-green-400 to-emerald-500' },
        { icon: Zap, title: 'Instant Transfers', desc: 'Send money in seconds, not days', color: 'from-yellow-400 to-orange-500' },
        { icon: CreditCard, title: 'Virtual Cards', desc: 'Create and manage multiple cards', color: 'from-purple-400 to-pink-500' },
        { icon: Globe, title: 'Pay Bills Anywhere', desc: 'Electricity, water, internet & more', color: 'from-blue-400 to-cyan-500' },
    ];

    return (
        <div className="min-h-screen bg-void overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-purple/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/15 blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-accent-pink/10 blur-[100px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">SOBS</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <Link to="/login" className="text-text-secondary hover:text-white transition-colors px-4 py-2">
                        Sign In
                    </Link>
                    <Link to="/register">
                        <NeonButton className="py-2 px-5 text-sm">
                            Get Started <ArrowRight className="w-4 h-4" />
                        </NeonButton>
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm mb-8"
                    >
                        <Sparkles className="w-4 h-4" /> Secure Online Banking System
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-text-secondary">
                            Banking Made
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink">
                            Simple & Secure
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-text-secondary max-w-2xl mx-auto mb-10"
                    >
                        Experience next-generation banking with instant transfers, bill payments,
                        and complete control over your finances — all in one place.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/register">
                            <NeonButton className="px-8 py-4 text-lg">
                                Create Free Account <ArrowRight className="w-5 h-5" />
                            </NeonButton>
                        </Link>
                        <Link to="/login">
                            <NeonButton variant="secondary" className="px-8 py-4 text-lg">
                                Sign In
                            </NeonButton>
                        </Link>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-glass-bg/50 backdrop-blur-xl border border-glass-border rounded-2xl p-6 hover:border-accent-cyan/50 transition-all group cursor-pointer"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-text-muted">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 text-center"
                >
                    <p className="text-text-muted text-sm mb-4">Trusted by thousands of users</p>
                    <div className="flex justify-center items-center gap-8 opacity-50">
                        <div className="text-2xl font-bold">🏦 Bank Grade</div>
                        <div className="text-2xl font-bold">🔒 256-bit SSL</div>
                        <div className="text-2xl font-bold">✓ PCI Compliant</div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-glass-border py-8 text-center text-text-muted text-sm">
                <p>© 2024 SOBS - Secure Online Banking System. All rights reserved.</p>
            </footer>
        </div>
    );
}
