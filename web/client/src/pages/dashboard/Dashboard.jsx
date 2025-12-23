import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

// Get time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
};

// Format date
const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
};

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

// Premium Credit Card with 3D effects
const CreditCard3D = ({ card, onPrev, onNext, hasMultiple }) => {
    const [showBalance, setShowBalance] = useState(true);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const isFrozen = card?.cardSettings?.isFrozen;

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 10, y: x * -10 });
    };

    if (!card) return null;

    return (
        <div className="relative flex items-center justify-center gap-6">
            {/* Left Arrow - Text only */}
            {hasMultiple && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPrev}
                    className="p-4 rounded-2xl bg-glass-bg border border-glass-border hover:bg-glass-hover hover:border-accent-cyan text-2xl text-text-muted hover:text-white transition-all"
                >
                    ←
                </motion.button>
            )}

            {/* Main Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={card.number}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                    className="relative cursor-pointer"
                    style={{
                        perspective: '1500px',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <motion.div
                        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`relative w-[400px] h-[240px] rounded-3xl overflow-hidden shadow-2xl ${isFrozen ? 'grayscale' : ''}`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Card Background */}
                        <div className={`absolute inset-0 ${isFrozen
                                ? 'bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800'
                                : card.type === 'Savings'
                                    ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
                                    : 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
                            }`} />

                        {/* Holographic Shimmer */}
                        <motion.div
                            className="absolute inset-0 opacity-30"
                            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                            style={{
                                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                                backgroundSize: '200% 200%',
                            }}
                        />

                        {/* Decorative circles */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/30 blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
                        </div>

                        {/* Frozen Overlay */}
                        {isFrozen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center z-20"
                            >
                                <div className="text-center">
                                    <motion.span
                                        className="text-5xl block mb-2"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        ❄️
                                    </motion.span>
                                    <p className="text-blue-200 text-xs font-bold tracking-widest">CARD FROZEN</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Card Content */}
                        <div className="relative z-10 p-7 h-full flex flex-col">
                            {/* Top Row */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    {/* EMV Chip */}
                                    <div className="w-12 h-9 rounded-md relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/30 to-transparent" />
                                        <div className="absolute top-[35%] left-1 right-1 h-[1px] bg-yellow-700/40" />
                                        <div className="absolute top-[55%] left-1 right-1 h-[1px] bg-yellow-700/40" />
                                        <div className="absolute top-1 bottom-1 left-[30%] w-[1px] bg-yellow-700/40" />
                                        <div className="absolute top-1 bottom-1 left-[60%] w-[1px] bg-yellow-700/40" />
                                    </div>
                                    {/* Contactless */}
                                    <motion.div
                                        className="text-white/70 text-lg"
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        )))
                                    </motion.div>
                                </div>
                                <span className="text-2xl font-bold italic text-white/90 tracking-wide">VISA</span>
                            </div>

                            {/* Card Number */}
                            <div className="mt-6 font-mono text-xl tracking-[0.25em] text-white">
                                •••• •••• •••• {card.number.slice(-4)}
                            </div>

                            {/* Bottom Row */}
                            <div className="mt-auto flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">CARD HOLDER</p>
                                    <p className="text-sm font-semibold text-white">{card.cardName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">BALANCE</p>
                                    <button onClick={() => setShowBalance(!showBalance)} className="group">
                                        <p className="text-xl font-bold text-white group-hover:scale-105 transition-transform">
                                            {showBalance ? `${card.balance.toLocaleString()} ${card.currency}` : '••••••'}
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Right Arrow - Text only */}
            {hasMultiple && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onNext}
                    className="p-4 rounded-2xl bg-glass-bg border border-glass-border hover:bg-glass-hover hover:border-accent-cyan text-2xl text-text-muted hover:text-white transition-all"
                >
                    →
                </motion.button>
            )}
        </div>
    );
};

// Quick Action Card - NO ICONS, uses motion graphics
const QuickActionCard = ({ label, sublabel, gradient, to, motionElement }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${gradient} cursor-pointer group`}
        >
            <div className="relative z-10">
                <p className="text-white font-semibold mb-1">{label}</p>
                <p className="text-white/70 text-xs">{sublabel}</p>
            </div>
            {/* Motion graphic element */}
            <div className="absolute bottom-2 right-2 text-white/20 text-4xl font-bold">
                {motionElement}
            </div>
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10" />
        </motion.div>
    </Link>
);

// Transaction Item - NO ICONS, uses initials
const TransactionItem = ({ tx, index }) => {
    const isCredit = tx.type === 'credit';

    // Category colors
    const getCategoryColor = (category) => ({
        deposit: 'from-emerald-500 to-green-600',
        transfer: 'from-blue-500 to-indigo-600',
        bill: 'from-amber-500 to-orange-600',
        shopping: 'from-purple-500 to-pink-600',
        food: 'from-orange-500 to-red-600',
        savings: 'from-indigo-500 to-violet-600',
    }[category] || 'from-gray-500 to-slate-600');

    // Get initials
    const getInitials = (desc) => desc.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

    // Get relative time
    const getRelativeTime = (date) => {
        const now = new Date();
        const txDate = new Date(date);
        const diffDays = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.02)' }}
            className="flex items-center gap-4 p-4 rounded-xl cursor-pointer border-l-4 border-transparent hover:border-l-accent-cyan transition-all"
        >
            {/* Initials Circle */}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getCategoryColor(tx.category)} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                {isCredit ? '↓' : getInitials(tx.description)}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-white">{tx.description}</p>
                <p className="text-xs text-text-muted">{getRelativeTime(tx.date)} • {tx.category || 'Transaction'}</p>
            </div>

            {/* Amount */}
            <div className="text-right">
                <p className={`font-mono font-bold text-lg ${isCredit ? 'text-status-success' : 'text-white'}`}>
                    {isCredit ? '+' : '-'}{tx.amount.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">EGP</p>
            </div>
        </motion.div>
    );
};

// Mini Chart for spending overview
const MiniSpendingChart = ({ data = [] }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="flex items-end justify-between gap-1 h-16">
            {data.slice(-7).map((d, i) => (
                <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-accent-cyan to-accent-purple rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.value / maxValue) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                />
            ))}
        </div>
    );
};

// Add Money Modal
const AddMoneyModal = ({ isOpen, onClose, selectedCard }) => {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const debugOtp = '123456';
    const queryClient = useQueryClient();

    const handleRequestOTP = () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Enter a valid amount');
            return;
        }
        setStep(2);
    };

    const handleConfirm = async () => {
        if (otp !== debugOtp) {
            setError('Invalid OTP');
            return;
        }
        setLoading(true);
        try {
            await api.post('/accounts/add-money', {
                amount: parseFloat(amount),
                accountNumber: selectedCard?.number
            });
            queryClient.invalidateQueries(['accounts']);
            toast.success(`Added ${parseFloat(amount).toLocaleString()} EGP successfully!`);
            onClose();
            setStep(1);
            setAmount('');
            setOtp('');
        } catch {
            setError('Failed to add money');
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">💰 Add Money</h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg text-xl">✕</button>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center py-4">
                            <input
                                type="number"
                                className="w-full bg-transparent text-5xl font-bold placeholder:text-glass-border focus:outline-none text-center"
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                autoFocus
                            />
                            <p className="text-text-muted mt-2">EGP</p>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[500, 1000, 2500, 5000].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${amount === val.toString()
                                        ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                                        : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                        }`}
                                >
                                    {val.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {error && <p className="text-status-error text-sm text-center">{error}</p>}

                        <NeonButton onClick={handleRequestOTP} disabled={!amount} className="w-full">
                            Continue →
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
                            <NeonButton variant="secondary" onClick={() => setStep(1)} className="flex-1">← Back</NeonButton>
                            <NeonButton onClick={handleConfirm} loading={loading} disabled={otp.length !== 6} className="flex-1">Confirm</NeonButton>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Theme Toggle - NO ICONS
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-8 rounded-full bg-glass-bg border border-glass-border overflow-hidden"
        >
            <motion.div
                className="absolute inset-0.5 w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-sm"
                animate={{ x: theme === 'dark' ? 0 : 28 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? '🌙' : '☀️'}
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

    const transactions = txnData?.transactions?.slice(0, 5) || [];
    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

    const handlePrevCard = () => {
        setSelectedCardIndex(i => (i - 1 + (accounts?.length || 1)) % (accounts?.length || 1));
    };

    const handleNextCard = () => {
        setSelectedCardIndex(i => (i + 1) % (accounts?.length || 1));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        className="text-3xl font-bold flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {getGreeting().text}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple">Seif</span>
                        <motion.span
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            {getGreeting().emoji}
                        </motion.span>
                    </motion.h1>
                    <p className="text-text-muted">{formatDate()}</p>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/notifications" className="relative">
                        <div className="p-3 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-all">
                            <span className="text-lg">🔔</span>
                        </div>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-error rounded-full text-[10px] flex items-center justify-center font-bold text-white">3</span>
                    </Link>
                </div>
            </div>

            {/* Card Section */}
            <div className="py-6">
                {accountsLoading ? (
                    <div className="flex justify-center">
                        <Skeleton className="w-[400px] h-[240px] rounded-3xl" />
                    </div>
                ) : (
                    <>
                        <CreditCard3D
                            card={selectedCard}
                            onPrev={handlePrevCard}
                            onNext={handleNextCard}
                            hasMultiple={accounts?.length > 1}
                        />

                        {/* Card dots */}
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

                        {/* Card Actions */}
                        <div className="flex justify-center gap-4 mt-6">
                            <NeonButton onClick={() => setShowAddMoney(true)}>
                                + Add Money
                            </NeonButton>
                            <Link to="/cards">
                                <NeonButton variant="secondary">
                                    Manage Card
                                </NeonButton>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions - NO ICONS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                    label="Send Money"
                    sublabel="Transfer funds"
                    gradient="from-cyan-500 to-blue-600"
                    to="/transfer"
                    motionElement="→"
                />
                <QuickActionCard
                    label="Pay Bills"
                    sublabel="Utilities & more"
                    gradient="from-amber-500 to-orange-600"
                    to="/bills"
                    motionElement="≡"
                />
                <QuickActionCard
                    label="Savings"
                    sublabel="Track your goals"
                    gradient="from-emerald-500 to-green-600"
                    to="/savings"
                    motionElement="🎯"
                />
                <QuickActionCard
                    label="Analytics"
                    sublabel="Spending insights"
                    gradient="from-purple-500 to-pink-600"
                    to="/analytics"
                    motionElement="📊"
                />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="bg-gradient-to-br from-accent-cyan/10 to-transparent">
                    <p className="text-sm text-text-muted mb-1">Total Balance</p>
                    <p className="text-3xl font-bold text-accent-cyan">
                        <AnimatedNumber value={totalBalance} /> <span className="text-lg font-normal text-text-muted">EGP</span>
                    </p>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-status-success/10 to-transparent">
                    <p className="text-sm text-text-muted mb-1">This Month Income</p>
                    <p className="text-2xl font-bold text-status-success">+15,000 EGP</p>
                    <p className="text-xs text-status-success mt-1">▲ 12% from last month</p>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-status-error/10 to-transparent">
                    <p className="text-sm text-text-muted mb-1">This Month Spending</p>
                    <p className="text-2xl font-bold text-white">-8,500 EGP</p>
                    <p className="text-xs text-status-success mt-1">▼ 5% from last month</p>
                </GlassCard>
            </div>

            {/* Recent Transactions */}
            <GlassCard>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <Link to="/transactions" className="text-accent-cyan text-sm hover:underline">
                        See All →
                    </Link>
                </div>

                {txnLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        <p className="text-4xl mb-4">📋</p>
                        <p className="font-medium">No transactions yet</p>
                        <p className="text-sm">Make your first transfer to see activity here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-glass-border">
                        {transactions.map((tx, i) => (
                            <TransactionItem key={tx.id} tx={tx} index={i} />
                        ))}
                    </div>
                )}
            </GlassCard>

            {/* Add Money Modal */}
            <AddMoneyModal
                isOpen={showAddMoney}
                onClose={() => setShowAddMoney(false)}
                selectedCard={selectedCard}
            />
        </div>
    );
}
