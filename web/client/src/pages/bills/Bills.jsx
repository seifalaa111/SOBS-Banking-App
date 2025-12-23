import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

// Bill categories with emojis instead of icons
const BILL_CATEGORIES = [
    { id: 'ELECTRICITY', label: 'Electricity', gradient: 'from-yellow-400 to-amber-500', emoji: '⚡' },
    { id: 'WATER', label: 'Water', gradient: 'from-cyan-400 to-blue-500', emoji: '💧' },
    { id: 'INTERNET', label: 'Internet', gradient: 'from-purple-400 to-violet-500', emoji: '📡' },
    { id: 'MOBILE', label: 'Mobile', gradient: 'from-green-400 to-emerald-500', emoji: '📱' },
    { id: 'TV', label: 'Television', gradient: 'from-pink-400 to-rose-500', emoji: '📺' },
    { id: 'INSURANCE', label: 'Insurance', gradient: 'from-indigo-400 to-blue-500', emoji: '🛡️' },
];

// Category Card - NO ICONS, uses emojis
const CategoryCard = ({ category, isSelected, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-6 rounded-2xl border transition-all ${isSelected
                ? `bg-gradient-to-br ${category.gradient} border-transparent shadow-lg`
                : 'bg-glass-bg border-glass-border hover:border-accent-cyan/50'
                }`}
        >
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg text-void font-bold text-sm"
                >
                    ✓
                </motion.div>
            )}
            <span className={`text-3xl block mx-auto mb-3 ${isSelected ? 'animate-bounce' : ''}`}>{category.emoji}</span>
            <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}>{category.label}</p>
        </motion.button>
    );
};

// Provider Card - NO ICONS, uses initials
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
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-accent-cyan bg-accent-cyan text-void' : 'border-glass-border'}`}>
            {isSelected && '✓'}
        </div>
    </motion.button>
);

// Payment Success - NO ICONS
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
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-xl shadow-green-500/30 text-4xl"
        >
            ✓
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

    const { data: providers, isLoading: providersLoading } = useQuery({
        queryKey: ['providers', selectedCategory],
        queryFn: async () => {
            if (!selectedCategory) return [];
            const res = await api.get(`/bills/providers?type=${selectedCategory}`);
            return res.data || [];
        },
        enabled: !!selectedCategory
    });

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
            setError('Your primary card is frozen. Please unfreeze it to pay bills.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/bills/pay', {
                billType: selectedCategory,
                provider: selectedProvider,
                billNumber,
                amount: parseFloat(amount),
                accountNumber: primaryAccount?.number
            });
            queryClient.invalidateQueries(['accounts']);
            queryClient.invalidateQueries(['transactions']);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Payment failed');
        }
        setLoading(false);
    };

    const resetForm = () => {
        setStep(1);
        setSelectedCategory(null);
        setSelectedProvider('');
        setBillNumber('');
        setAmount('');
        setError('');
        setSuccess(false);
    };

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
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-secondary to-orange-500/20 border border-glass-border p-8">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/30 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Pay Bills</h1>
                    <p className="text-text-secondary">💡 Quick and easy bill payments</p>
                </div>
            </div>

            {/* Progress Steps - NO ICONS */}
            <div className="flex items-center gap-2">
                {[
                    { num: 1, label: 'Category' },
                    { num: 2, label: 'Provider' },
                    { num: 3, label: 'Details' },
                    { num: 4, label: 'Confirm' }
                ].map((s, i) => (
                    <React.Fragment key={s.num}>
                        <motion.div
                            className="flex flex-col items-center gap-2"
                            animate={{ scale: step === s.num ? 1.05 : 1 }}
                        >
                            <motion.div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${step >= s.num
                                    ? 'bg-gradient-to-br from-accent-cyan to-accent-purple text-white shadow-lg'
                                    : 'bg-glass-bg border border-glass-border text-text-muted'
                                    }`}
                            >
                                {step > s.num ? '✓' : s.num}
                            </motion.div>
                            <span className={`text-xs font-medium ${step >= s.num ? 'text-accent-cyan' : 'text-text-muted'}`}>{s.label}</span>
                        </motion.div>
                        {i < 3 && (
                            <div className="flex-1 h-0.5 bg-glass-border rounded-full overflow-hidden mb-6">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                                    animate={{ width: step > s.num ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Select Category */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-2">Select Bill Category</h3>
                            <p className="text-text-muted mb-6">Choose the type of bill you want to pay</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {BILL_CATEGORIES.map(cat => (
                                    <CategoryCard
                                        key={cat.id}
                                        category={cat}
                                        isSelected={selectedCategory === cat.id}
                                        onClick={() => handleCategorySelect(cat)}
                                    />
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Step 2: Select Provider */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep(1)} className="text-2xl hover:scale-110 transition-transform">←</button>
                                <div>
                                    <h3 className="text-xl font-bold">Select Provider</h3>
                                    <p className="text-text-muted text-sm">Choose your service provider</p>
                                </div>
                            </div>

                            {providersLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {(providers || ['Egyptian Electricity', 'Cairo Utility', 'Alexandria Power']).map(provider => (
                                        <ProviderCard
                                            key={provider}
                                            provider={provider}
                                            isSelected={selectedProvider === provider}
                                            onClick={() => handleProviderSelect(provider)}
                                        />
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                )}

                {/* Step 3: Enter Details */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep(2)} className="text-2xl hover:scale-110 transition-transform">←</button>
                                <div>
                                    <h3 className="text-xl font-bold">Enter Bill Details</h3>
                                    <p className="text-text-muted text-sm">Provider: {selectedProvider}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <GlowInput
                                    label="Bill/Account Number"
                                    placeholder="Enter your bill number"
                                    value={billNumber}
                                    onChange={e => setBillNumber(e.target.value)}
                                />
                                <GlowInput
                                    label="Amount (EGP)"
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                                <NeonButton
                                    onClick={() => setStep(4)}
                                    className="w-full"
                                    disabled={!billNumber || !amount}
                                >
                                    Continue →
                                </NeonButton>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Step 4: Confirm */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep(3)} className="text-2xl hover:scale-110 transition-transform">←</button>
                                <div>
                                    <h3 className="text-xl font-bold">Confirm Payment</h3>
                                    <p className="text-text-muted text-sm">Review and confirm your payment</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-glass-bg to-transparent border border-glass-border rounded-2xl p-6 space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Category</span>
                                    <span className="font-medium">{BILL_CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Provider</span>
                                    <span className="font-medium">{selectedProvider}</span>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Bill Number</span>
                                    <span className="font-mono">{billNumber}</span>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Amount</span>
                                    <span className="text-2xl font-bold text-accent-cyan">{parseFloat(amount).toLocaleString()} EGP</span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/30 mb-4">
                                    <p className="text-status-error">⚠️ {error}</p>
                                </div>
                            )}

                            <NeonButton onClick={handlePayment} loading={loading} className="w-full">
                                ✓ Confirm Payment
                            </NeonButton>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
