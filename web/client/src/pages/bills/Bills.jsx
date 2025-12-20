import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Receipt, Zap, Droplets, Wifi, Smartphone, Tv, Home, ShieldCheck, Car,
    ChevronRight, Check, X, Search, Star, Clock, AlertTriangle, Sparkles
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const BILL_CATEGORIES = [
    { id: 'ELECTRICITY', label: 'Electricity', icon: Zap, gradient: 'from-yellow-400 to-amber-500', color: 'yellow' },
    { id: 'WATER', label: 'Water', icon: Droplets, gradient: 'from-cyan-400 to-blue-500', color: 'cyan' },
    { id: 'INTERNET', label: 'Internet', icon: Wifi, gradient: 'from-purple-400 to-violet-500', color: 'purple' },
    { id: 'MOBILE', label: 'Mobile', icon: Smartphone, gradient: 'from-green-400 to-emerald-500', color: 'green' },
    { id: 'TV', label: 'Television', icon: Tv, gradient: 'from-pink-400 to-rose-500', color: 'pink' },
    { id: 'INSURANCE', label: 'Insurance', icon: ShieldCheck, gradient: 'from-indigo-400 to-blue-500', color: 'indigo' },
];

const CategoryCard = ({ category, isSelected, onClick }) => {
    const Icon = category.icon;
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-6 rounded-2xl border transition-all ${isSelected
                    ? `bg-gradient-to-br ${category.gradient} border-transparent shadow-lg shadow-${category.color}-500/30`
                    : 'bg-glass-bg border-glass-border hover:border-accent-cyan/50'
                }`}
        >
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                    <Check className="w-4 h-4 text-void" />
                </motion.div>
            )}
            <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-white' : 'text-text-secondary'}`} />
            <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}>{category.label}</p>
        </motion.button>
    );
};

const ProviderCard = ({ provider, isSelected, onClick }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full p-5 rounded-2xl border flex items-center gap-4 transition-all ${isSelected
                ? 'bg-accent-cyan/10 border-accent-cyan'
                : 'bg-glass-bg border-glass-border hover:border-accent-cyan/50'
            }`}
    >
        <div className={`w-14 h-14 rounded-xl ${isSelected ? 'bg-accent-cyan' : 'bg-glass-hover'} flex items-center justify-center`}>
            <span className="text-2xl font-bold">{provider[0]}</span>
        </div>
        <div className="flex-1 text-left">
            <p className="font-medium">{provider}</p>
            <p className="text-sm text-text-muted">Bill Payment</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-accent-cyan bg-accent-cyan' : 'border-glass-border'
            }`}>
            {isSelected && <Check className="w-4 h-4 text-void" />}
        </div>
    </motion.button>
);

const PaymentSuccess = ({ amount, provider, onNewPayment, onDone }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
    >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-xl shadow-green-500/30"
        >
            <Check className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-text-secondary mb-8">
            You paid <span className="text-accent-cyan font-bold">{amount.toLocaleString()} EGP</span> to {provider}
        </p>

        <div className="flex gap-4 justify-center">
            <NeonButton onClick={onNewPayment}>Pay Another Bill</NeonButton>
            <NeonButton variant="secondary" onClick={onDone}>Done</NeonButton>
        </div>
    </motion.div>
);

export default function Bills() {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const queryClient = useQueryClient();

    // Fetch providers for selected category
    const { data: providers, isLoading: providersLoading } = useQuery({
        queryKey: ['providers', selectedCategory],
        queryFn: async () => {
            if (!selectedCategory) return [];
            const res = await api.get(`/bills/providers?type=${selectedCategory}`);
            return res.data || [];
        },
        enabled: !!selectedCategory
    });

    // Fetch cards
    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.id);
        setSelectedProvider('');
        setStep(2);
    };

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        setStep(3);
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        const primaryAccount = accounts?.[0];
        if (primaryAccount?.cardSettings?.isFrozen) {
            setError('Your card is frozen. Please unfreeze it in Card Controls to make payments.');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/bills/pay', {
                amount: parseFloat(amount),
                provider: selectedProvider,
                billNumber,
                description: `${selectedProvider} - Bill Payment`
            });

            if (res.success) {
                setSuccess(true);
                queryClient.invalidateQueries(['accounts']);
                queryClient.invalidateQueries(['transactions']);
            } else {
                setError(res.message || 'Payment failed');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setStep(1);
        setSelectedCategory(null);
        setSelectedProvider('');
        setBillNumber('');
        setAmount('');
        setSuccess(false);
        setError('');
    };

    const filteredCategories = BILL_CATEGORIES.filter(cat =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (success) {
        return (
            <GlassCard className="max-w-xl mx-auto">
                <PaymentSuccess
                    amount={parseFloat(amount)}
                    provider={selectedProvider}
                    onNewPayment={resetForm}
                    onDone={resetForm}
                />
            </GlassCard>
        );
    }

    return (
        <div className="space-y-8">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-secondary to-orange-500/20 border border-glass-border p-8">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/30 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/30">
                                <Receipt className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">Pay Bills</h1>
                        </div>
                        <p className="text-text-secondary flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Fast & secure bill payments
                        </p>
                    </div>

                    {/* Saved Bills */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-glass-bg border border-glass-border">
                        <Star className="w-5 h-5 text-amber-400" />
                        <span className="text-sm">3 saved bills</span>
                        <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4">
                {[
                    { num: 1, label: 'Category' },
                    { num: 2, label: 'Provider' },
                    { num: 3, label: 'Payment' }
                ].map((s, i) => (
                    <React.Fragment key={s.num}>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= s.num
                                        ? 'bg-gradient-to-br from-accent-cyan to-accent-purple border-transparent text-white'
                                        : 'bg-glass-bg border-glass-border text-text-muted'
                                    }`}
                                animate={step >= s.num ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                            </motion.div>
                            <span className={`text-sm hidden md:block ${step >= s.num ? 'text-white' : 'text-text-muted'}`}>{s.label}</span>
                        </div>
                        {i < 2 && (
                            <div className="flex-1 h-1 bg-glass-border rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                                    initial={{ width: 0 }}
                                    animate={{ width: step > s.num ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <GlassCard className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {/* Step 1: Category Selection */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Select Bill Category</h2>
                                <p className="text-text-muted">Choose the type of bill you want to pay</p>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="w-full bg-glass-bg border border-glass-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent-cyan transition-colors"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredCategories.map((category, i) => (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <CategoryCard
                                            category={category}
                                            isSelected={selectedCategory === category.id}
                                            onClick={() => handleCategorySelect(category)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Provider Selection */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="p-2 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-semibold">Select Provider</h2>
                                    <p className="text-text-muted">Choose your service provider</p>
                                </div>
                            </div>

                            {providersLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
                                </div>
                            ) : providers?.length === 0 ? (
                                <div className="text-center py-12 text-text-muted">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No providers available for this category</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {providers?.map((provider, i) => (
                                        <motion.div
                                            key={provider}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <ProviderCard
                                                provider={provider}
                                                isSelected={selectedProvider === provider}
                                                onClick={() => handleProviderSelect(provider)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Payment Details */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="p-2 rounded-xl bg-glass-bg border border-glass-border hover:bg-glass-hover transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-semibold">Payment Details</h2>
                                    <p className="text-text-muted">Enter your bill information</p>
                                </div>
                            </div>

                            {/* Selected Provider Summary */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/30">
                                <p className="text-sm text-text-muted">Paying to</p>
                                <p className="text-lg font-bold text-accent-cyan">{selectedProvider}</p>
                            </div>

                            <GlowInput
                                label="Bill Number / Reference"
                                placeholder="Enter your bill number"
                                value={billNumber}
                                onChange={e => setBillNumber(e.target.value)}
                            />

                            <div>
                                <label className="block text-sm text-text-secondary mb-2 font-medium">Amount (EGP)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full bg-glass-bg border border-glass-border rounded-xl px-4 py-4 text-3xl font-bold text-center focus:outline-none focus:border-accent-cyan transition-colors"
                                />
                            </div>

                            <div className="flex gap-2">
                                {[100, 250, 500, 1000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val.toString())}
                                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${amount === val.toString()
                                                ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                                                : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/30 flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-status-error" />
                                    <p className="text-status-error">{error}</p>
                                </div>
                            )}

                            <NeonButton
                                onClick={handlePayment}
                                loading={loading}
                                disabled={!billNumber || !amount || parseFloat(amount) <= 0}
                                className="w-full"
                            >
                                <Receipt className="w-5 h-5" /> Pay {amount ? `${parseFloat(amount).toLocaleString()} EGP` : 'Now'}
                            </NeonButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>

            {/* Recent Bills */}
            <GlassCard>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-text-muted" /> Recent Payments
                    </h3>
                </div>

                <div className="space-y-3">
                    {[
                        { provider: 'Egyptian Electricity', amount: 450, date: 'Dec 18, 2025' },
                        { provider: 'WE Internet', amount: 350, date: 'Dec 15, 2025' },
                        { provider: 'Vodafone Mobile', amount: 200, date: 'Dec 10, 2025' },
                    ].map((bill, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-glass-bg/50 border border-glass-border hover:bg-glass-hover transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                    <Receipt className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium">{bill.provider}</p>
                                    <p className="text-sm text-text-muted">{bill.date}</p>
                                </div>
                            </div>
                            <p className="font-mono font-bold">{bill.amount.toLocaleString()} EGP</p>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
