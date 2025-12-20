import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, Send, Receipt, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
    Plus, Eye, EyeOff, CreditCard, Sparkles, Clock, ChevronRight, Bell,
    PiggyBank, BarChart3, Zap, Activity, Target, ChevronLeft, Sun, Moon, Wifi,
    Settings, History
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

// Animated Counter Component
const AnimatedNumber = ({ value, duration = 1500 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    React.useEffect(() => {
        let startTime;
        const startValue = displayValue;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setDisplayValue(Math.floor(startValue + (value - startValue) * easeOutQuart));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};

// HERO Credit Card - Large and prominent
const HeroCreditCard = ({ card, onPrev, onNext, hasMultiple }) => {
    const [showBalance, setShowBalance] = useState(true);
    const isFrozen = card?.cardSettings?.isFrozen;
    const isBusinessCard = card?.type !== 'Savings';

    if (!card) return null;

    return (
        <div className="relative flex items-center justify-center gap-6">
            {/* Left Arrow */}
            {hasMultiple && (
                <motion.button
                    whileHover={{ scale: 1.15, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPrev}
                    className="p-4 rounded-2xl bg-glass-bg border border-glass-border hover:bg-glass-hover hover:border-accent-cyan shadow-xl transition-all"
                >
                    <ChevronLeft className="w-7 h-7" />
                </motion.button>
            )}

            {/* Main Card - HERO SIZE */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={card.number}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative"
                    style={{ perspective: '1500px' }}
                >
                    <div className={`relative w-[420px] h-[260px] rounded-3xl overflow-hidden shadow-2xl`}>
                        {/* Card Background */}
                        <div className={`absolute inset-0 ${isFrozen
                            ? 'bg-gradient-to-br from-slate-500 via-gray-600 to-slate-700'
                            : isBusinessCard
                                ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
                                : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600'
                            }`} />

                        {/* Animated shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        />

                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 blur-2xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Frozen overlay */}
                        {isFrozen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center z-20"
                            >
                                <div className="text-center">
                                    <motion.span
                                        className="text-6xl"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        ❄️
                                    </motion.span>
                                    <p className="text-blue-200 text-sm font-bold mt-3 tracking-widest">CARD FROZEN</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Card content */}
                        <div className="relative z-10 p-8 h-full flex flex-col">
                            {/* Top row */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg" />
                                    <Wifi className="w-7 h-7 text-white/70 rotate-90" />
                                </div>
                                <span className="text-3xl font-bold italic text-white/90 tracking-wider">VISA</span>
                            </div>

                            {/* Card number */}
                            <div className="mt-6 font-mono text-2xl tracking-[0.25em] text-white">
                                •••• •••• •••• {card.number.slice(-4)}
                            </div>

                            {/* Bottom row */}
                            <div className="mt-auto flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Card Name</p>
                                    <p className="text-lg font-semibold text-white">{card.cardName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Balance</p>
                                    <p className="text-2xl font-bold text-white">
                                        {showBalance ? `${card.balance.toLocaleString()} ${card.currency}` : '••••••'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Eye toggle */}
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="absolute top-6 right-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-30"
                        >
                            {showBalance ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Right Arrow */}
            {hasMultiple && (
                <motion.button
                    whileHover={{ scale: 1.15, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onNext}
                    className="p-4 rounded-2xl bg-glass-bg border border-glass-border hover:bg-glass-hover hover:border-accent-cyan shadow-xl transition-all"
                >
                    <ChevronRight className="w-7 h-7" />
                </motion.button>
            )}
        </div>
    );
};

// Quick Action Button - Compact
const QuickAction = ({ icon: Icon, label, gradient, to }) => (
    <Link to={to} className="group flex flex-col items-center gap-2">
        <motion.div
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
            <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
    </Link>
);

// Transaction Item
const TransactionItem = ({ tx, index }) => {
    const isCredit = tx.type === 'credit';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-glass-hover transition-all"
        >
            <div className={`w-10 h-10 rounded-xl ${isCredit ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-rose-400 to-red-500'
                } flex items-center justify-center`}>
                {isCredit ? <ArrowDownLeft className="w-4 h-4 text-white" /> : <ArrowUpRight className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <p className="text-xs text-text-muted">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
            <p className={`font-mono font-bold ${isCredit ? 'text-status-success' : 'text-status-error'}`}>
                {isCredit ? '+' : '-'}{tx.amount.toLocaleString()}
            </p>
        </motion.div>
    );
};

// Add Money Modal
const AddMoneyModal = ({ isOpen, onClose, selectedCard }) => {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [debugOtp, setDebugOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const queryClient = useQueryClient();

    const handleRequestOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/accounts/deposit/request', {
                amount: parseFloat(amount),
                accountNumber: selectedCard?.number
            });
            if (res.success) {
                setDebugOtp(res.debugOtp);
                setStep(2);
            } else {
                setError(res.message || 'Failed to request OTP');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/accounts/deposit/confirm', {
                otp,
                amount: parseFloat(amount),
                accountNumber: selectedCard?.number
            });
            if (res.success) {
                queryClient.invalidateQueries(['accounts']);
                queryClient.invalidateQueries(['transactions']);
                toast.success(`${parseFloat(amount).toLocaleString()} EGP added successfully! 💰`);
                onClose();
                setStep(1);
                setAmount('');
                setOtp('');
            } else {
                setError(res.message);
                toast.error(res.message || 'Deposit failed');
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Deposit failed');
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add Money</h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-xl transition-colors">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <input
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="bg-transparent text-5xl font-bold text-center w-full focus:outline-none"
                                autoFocus
                            />
                            <p className="text-text-muted mt-2">EGP</p>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[500, 1000, 2500, 5000].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className={`py-2 rounded-xl border text-sm transition-all ${amount === val.toString()
                                        ? 'bg-accent-cyan/20 border-accent-cyan'
                                        : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                        }`}
                                >
                                    {val.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {error && <p className="text-status-error text-sm text-center">{error}</p>}

                        <NeonButton onClick={handleRequestOTP} loading={loading} disabled={!amount} className="w-full">
                            Continue
                        </NeonButton>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-text-secondary mb-2">Enter OTP to confirm</p>
                            <p className="text-2xl font-bold text-accent-cyan">{parseFloat(amount).toLocaleString()} EGP</p>
                        </div>

                        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-3 text-center">
                            <span className="text-text-muted text-sm">Demo OTP:</span>
                            <div className="text-xl font-mono font-bold text-accent-cyan">{debugOtp}</div>
                        </div>

                        <GlowInput
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />

                        {error && <p className="text-status-error text-sm text-center">{error}</p>}

                        <div className="flex gap-3">
                            <NeonButton variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</NeonButton>
                            <NeonButton onClick={handleConfirm} loading={loading} disabled={otp.length !== 6} className="flex-1">Confirm</NeonButton>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Theme Toggle
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-7 rounded-full bg-glass-bg border border-glass-border overflow-hidden"
        >
            <motion.div
                className="absolute inset-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center"
                animate={{ x: theme === 'dark' ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-white" />}
            </motion.div>
        </motion.button>
    );
};

export default function Dashboard() {
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const { theme } = useTheme();

    const { data: accounts, isLoading: accountsLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    const selectedCard = accounts?.[selectedCardIndex];

    const { data: txnData, isLoading: txnLoading } = useQuery({
        queryKey: ['transactions', selectedCard?.number],
        queryFn: async () => {
            if (!selectedCard) return { transactions: [] };
            const res = await api.get(`/accounts/${selectedCard.number}/transactions`);
            return res.data;
        },
        enabled: !!selectedCard
    });

    const transactions = txnData?.transactions?.slice(0, 4) || [];
    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

    const handlePrevCard = () => {
        setSelectedCardIndex(i => (i - 1 + (accounts?.length || 1)) % (accounts?.length || 1));
    };

    const handleNextCard = () => {
        setSelectedCardIndex(i => (i + 1) % (accounts?.length || 1));
    };

    return (
        <div className="space-y-6">
            {/* Top Bar - Minimal */}
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        className="text-3xl font-bold"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple">Seif</span>
                    </motion.h1>
                    <p className="text-text-muted text-sm">Your financial overview</p>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link to="/notifications" className="relative p-2.5 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-error rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
                    </Link>
                </div>
            </div>

            {/* HERO: Card Section - Center Stage */}
            <div className="py-8">
                {accountsLoading ? (
                    <div className="flex justify-center">
                        <Skeleton className="w-[420px] h-[260px] rounded-3xl" />
                    </div>
                ) : (
                    <>
                        <HeroCreditCard
                            card={selectedCard}
                            onPrev={handlePrevCard}
                            onNext={handleNextCard}
                            hasMultiple={accounts?.length > 1}
                        />

                        {/* Card indicator dots */}
                        {accounts?.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                {accounts.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedCardIndex(i)}
                                        className={`transition-all ${i === selectedCardIndex
                                            ? 'w-8 h-2 bg-accent-cyan rounded-full'
                                            : 'w-2 h-2 bg-glass-border rounded-full hover:bg-glass-hover'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Card Actions - Below Card */}
                        <div className="flex justify-center gap-4 mt-6">
                            <NeonButton onClick={() => setShowAddMoney(true)}>
                                <Plus className="w-4 h-4" /> Add Money
                            </NeonButton>
                            <Link to="/cards">
                                <NeonButton variant="secondary">
                                    <Settings className="w-4 h-4" /> Manage Card
                                </NeonButton>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions Row */}
            <GlassCard className="py-6">
                <div className="flex justify-around">
                    <QuickAction icon={Send} label="Transfer" gradient="from-cyan-400 to-blue-500" to="/transfer" />
                    <QuickAction icon={Receipt} label="Pay Bills" gradient="from-amber-400 to-orange-500" to="/bills" />
                    <QuickAction icon={PiggyBank} label="Savings" gradient="from-emerald-400 to-green-500" to="/savings" />
                    <QuickAction icon={BarChart3} label="Analytics" gradient="from-purple-400 to-pink-500" to="/analytics" />
                    <QuickAction icon={History} label="History" gradient="from-slate-400 to-gray-500" to="/transactions" />
                </div>
            </GlassCard>

            {/* Stats + Transactions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Stats Cards */}
                <GlassCard className="bg-gradient-to-br from-violet-500/10 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Total Balance</p>
                            <p className="text-2xl font-bold">
                                <AnimatedNumber value={totalBalance} /> <span className="text-sm text-text-muted">EGP</span>
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">This Month Income</p>
                            <p className="text-2xl font-bold text-status-success">
                                +<AnimatedNumber value={12500} /> <span className="text-sm text-text-muted">EGP</span>
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-rose-500/10 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">This Month Expenses</p>
                            <p className="text-2xl font-bold text-status-error">
                                -<AnimatedNumber value={8300} /> <span className="text-sm text-text-muted">EGP</span>
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Recent Transactions */}
            <GlassCard>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent-pink" /> Recent Activity
                    </h3>
                    <Link to="/transactions" className="text-accent-cyan text-sm hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {txnLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-14" />)}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-text-muted">
                        <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {transactions.map((tx, i) => (
                            <TransactionItem key={tx.id || i} tx={tx} index={i} />
                        ))}
                    </div>
                )}
            </GlassCard>

            {/* Add Money Modal */}
            <AnimatePresence>
                {showAddMoney && (
                    <AddMoneyModal
                        isOpen={showAddMoney}
                        onClose={() => setShowAddMoney(false)}
                        selectedCard={selectedCard}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
