import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, CheckCircle2, UserCheck, ArrowRight, ArrowLeft, CreditCard,
    ChevronDown, AlertTriangle, Snowflake, Sparkles, Zap, Users, Clock
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../../components/common/GlassCard';
import GlowInput from '../../components/common/GlowInput';
import NeonButton from '../../components/common/NeonButton';
import api from '../../api';

// Premium Card Selector Component
const CardSelector = ({ cards, selectedCard, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = cards?.find(c => c.number === selectedCard) || cards?.[0];

    if (!cards || cards.length <= 1) return null;

    return (
        <div className="relative mb-6">
            <label className="block text-sm text-text-secondary mb-2 font-medium">Transfer From</label>
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-glass-bg to-transparent border border-glass-border rounded-2xl hover:border-accent-cyan/50 transition-all"
            >
                <div className={`w-14 h-9 rounded-lg ${selected?.cardSettings?.isFrozen
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                    : selected?.type === 'Savings'
                        ? 'bg-gradient-to-br from-accent-purple to-accent-cyan'
                        : 'bg-gradient-to-br from-amber-500 to-orange-600'
                    } shadow-lg flex items-center justify-center`}>
                    <CreditCard className="w-5 h-5 text-white/80" />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-medium flex items-center gap-2">
                        {selected?.cardName || 'Card'}
                        {selected?.cardSettings?.isFrozen && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                <Snowflake className="w-3 h-3" /> Frozen
                            </span>
                        )}
                    </p>
                    <p className="text-sm text-text-muted">****{selected?.number?.slice(-4)} • {selected?.balance?.toLocaleString()} EGP available</p>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-tertiary border border-glass-border rounded-2xl overflow-hidden shadow-2xl z-50"
                    >
                        {cards.map(card => (
                            <button
                                key={card.number}
                                onClick={() => { onSelect(card.number); setIsOpen(false); }}
                                className={`w-full flex items-center gap-4 p-4 hover:bg-glass-hover transition-colors ${selectedCard === card.number ? 'bg-accent-cyan/10' : ''}`}
                            >
                                <div className={`w-14 h-9 rounded-lg ${card.cardSettings?.isFrozen
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                                    : card.type === 'Savings'
                                        ? 'bg-gradient-to-br from-accent-purple to-accent-cyan'
                                        : 'bg-gradient-to-br from-amber-500 to-orange-600'
                                    } shadow-lg flex items-center justify-center`}>
                                    <CreditCard className="w-5 h-5 text-white/80" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium flex items-center gap-2">
                                        {card.cardName}
                                        {card.cardSettings?.isFrozen && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Frozen</span>
                                        )}
                                    </p>
                                    <p className="text-sm text-text-muted">****{card.number.slice(-4)} • {card.balance.toLocaleString()} EGP</p>
                                </div>
                                {selectedCard === card.number && (
                                    <div className="w-5 h-5 rounded-full bg-accent-cyan flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-void" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Quick Amount Button
const QuickAmount = ({ value, selected, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${selected
            ? 'bg-gradient-to-r from-accent-cyan to-accent-purple border-transparent text-void shadow-lg shadow-accent-purple/30'
            : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
            }`}
    >
        {value.toLocaleString()}
    </motion.button>
);

// Success Animation
const SuccessScreen = ({ amount, recipient, onNewTransfer, onDone }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
    >
        {/* Confetti-like particles */}
        <div className="relative">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-3 h-3 rounded-full ${['bg-accent-cyan', 'bg-accent-purple', 'bg-accent-pink', 'bg-status-success'][i % 4]
                        }`}
                    initial={{
                        x: 0, y: 0, scale: 0, opacity: 1
                    }}
                    animate={{
                        x: Math.cos(i * 30 * Math.PI / 180) * 100,
                        y: Math.sin(i * 30 * Math.PI / 180) * 100 - 50,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ delay: 0.3, duration: 1 }}
                    style={{ left: '50%', top: '50%' }}
                />
            ))}

            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-2xl shadow-green-500/40"
            >
                <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>
        </div>

        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-3"
        >
            Transfer Successful!
        </motion.h2>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <p className="text-text-secondary mb-1">You sent</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple mb-2">
                {amount.toLocaleString()} EGP
            </p>
            <p className="text-text-muted text-sm mb-8">to {recipient}</p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center"
        >
            <NeonButton onClick={onNewTransfer}>
                <Send className="w-4 h-4" /> New Transfer
            </NeonButton>
            <Link to="/dashboard">
                <NeonButton variant="secondary">Back to Dashboard</NeonButton>
            </Link>
        </motion.div>
    </motion.div>
);

export default function Transfer() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        recipient: '',
        amount: '',
        fromAccount: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    // Fetch accounts/cards
    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    // Fetch beneficiaries for quick select
    const { data: beneficiaries } = useQuery({
        queryKey: ['beneficiaries'],
        queryFn: async () => {
            const res = await api.get('/beneficiaries');
            return res.data || [];
        }
    });

    // Set default account
    const selectedAccount = formData.fromAccount || accounts?.[0]?.number;
    const currentCard = accounts?.find(a => a.number === selectedAccount);
    const isCardFrozen = currentCard?.cardSettings?.isFrozen;

    // Validation
    const isRecipientValid = formData.recipient.length >= 10;
    const isAmountValid = formData.amount && parseFloat(formData.amount) > 0;
    const hasEnoughBalance = currentCard && parseFloat(formData.amount || 0) <= currentCard.balance;

    const handleNext = () => {
        setError('');

        if (step === 1 && !isRecipientValid) {
            setError('Please enter a valid account number (min 10 digits)');
            return;
        }
        if (step === 2 && !isAmountValid) {
            setError('Please enter a valid amount greater than 0');
            return;
        }
        if (step === 2 && !hasEnoughBalance) {
            setError(`Insufficient balance. Available: ${currentCard?.balance?.toLocaleString()} EGP`);
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        if (isCardFrozen) {
            setError('This card is frozen. Please unfreeze it in Card Controls to make transfers.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/transfers', {
                recipientAccountNumber: formData.recipient,
                amount: formData.amount,
                fromAccountNumber: selectedAccount
            });

            if (res.success) {
                setSuccess(res);
                queryClient.invalidateQueries(['accounts']);
                queryClient.invalidateQueries(['transactions']);
                toast.success('Transfer completed successfully! 🎉');
            } else {
                setError(res.message || 'Transfer failed');
                toast.error(res.message || 'Transfer failed');
            }
        } catch (err) {
            setError(err.message || 'Transfer failed');
            toast.error(err.message || 'Transfer failed');
        }
        setLoading(false);
    };

    const resetForm = () => {
        setSuccess(null);
        setStep(1);
        setFormData({ recipient: '', amount: '', fromAccount: '' });
        setError('');
    };

    if (success) {
        return (
            <GlassCard className="max-w-xl mx-auto">
                <SuccessScreen
                    amount={parseFloat(formData.amount)}
                    recipient={formData.recipient}
                    onNewTransfer={resetForm}
                />
            </GlassCard>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-secondary to-blue-500/20 border border-glass-border p-8">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/30 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <motion.div
                            className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/30"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                        >
                            <Send className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold">Transfer Money</h1>
                            <p className="text-text-secondary flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                Instant transfers, zero fees
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Frozen Card Warning */}
            <AnimatePresence>
                {isCardFrozen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3"
                    >
                        <Snowflake className="w-5 h-5 text-blue-400 mt-0.5 animate-pulse" />
                        <div>
                            <p className="font-medium text-blue-400">Selected card is frozen</p>
                            <p className="text-sm text-text-muted">
                                You cannot transfer from this card. <Link to="/cards" className="text-accent-cyan hover:underline">Unfreeze it in Card Controls</Link> or select a different card.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
                {[
                    { num: 1, label: 'Recipient', icon: Users },
                    { num: 2, label: 'Amount', icon: CreditCard },
                    { num: 3, label: 'Confirm', icon: CheckCircle2 }
                ].map((s, i) => (
                    <React.Fragment key={s.num}>
                        <motion.div
                            className="flex flex-col items-center gap-2"
                            animate={{ scale: step === s.num ? 1.05 : 1 }}
                        >
                            <motion.div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${step >= s.num
                                    ? 'bg-gradient-to-br from-accent-cyan to-accent-purple text-white shadow-lg shadow-accent-purple/30'
                                    : 'bg-glass-bg border border-glass-border text-text-muted'
                                    }`}
                            >
                                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </motion.div>
                            <span className={`text-xs font-medium ${step >= s.num ? 'text-accent-cyan' : 'text-text-muted'}`}>{s.label}</span>
                        </motion.div>
                        {i < 2 && (
                            <div className="flex-1 h-1 bg-glass-border rounded-full overflow-hidden mb-6">
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

            <GlassCard className="relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-cyan/10 to-transparent rounded-full blur-2xl" />

                {/* Card Selector */}
                {accounts && accounts.length > 1 && (
                    <CardSelector
                        cards={accounts}
                        selectedCard={selectedAccount}
                        onSelect={(num) => setFormData(prev => ({ ...prev, fromAccount: num }))}
                    />
                )}

                <AnimatePresence mode="wait">
                    {/* Step 1: Recipient */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-1">Who are you sending to?</h3>
                                <p className="text-text-muted text-sm">Enter account number or select from beneficiaries</p>
                            </div>

                            <GlowInput
                                label="Recipient Account Number"
                                placeholder="Enter account number (min 10 digits)"
                                value={formData.recipient}
                                onChange={(e) => setFormData({ ...formData, recipient: e.target.value.replace(/\D/g, '') })}
                                icon={UserCheck}
                                error={formData.recipient && !isRecipientValid ? 'Min 10 digits required' : ''}
                                autoFocus
                            />

                            {/* Quick Select Beneficiaries */}
                            {beneficiaries && beneficiaries.length > 0 && (
                                <div>
                                    <p className="text-sm text-text-muted mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Quick Select
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {beneficiaries.slice(0, 4).map(b => (
                                            <motion.button
                                                key={b.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setFormData({ ...formData, recipient: b.accountNumber })}
                                                className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${formData.recipient === b.accountNumber
                                                    ? 'bg-accent-cyan/20 border-accent-cyan'
                                                    : 'bg-glass-bg border-glass-border hover:border-accent-cyan/50'
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-xs font-bold">
                                                    {b.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-sm font-medium">{b.nickname || b.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && <p className="text-status-error text-sm">{error}</p>}

                            <NeonButton onClick={handleNext} className="w-full" disabled={!isRecipientValid || isCardFrozen}>
                                Continue <ArrowRight className="w-4 h-4" />
                            </NeonButton>
                        </motion.div>
                    )}

                    {/* Step 2: Amount */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-1">How much do you want to send?</h3>
                                <p className="text-text-muted text-sm">Enter amount or select a quick option</p>
                            </div>

                            {/* Balance indicator */}
                            <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/30">
                                <span className="text-text-muted text-sm">Available Balance</span>
                                <p className="text-2xl font-bold text-accent-cyan">{currentCard?.balance?.toLocaleString() || 0} <span className="text-sm font-normal">EGP</span></p>
                            </div>

                            <div className="text-center">
                                <input
                                    type="number"
                                    className="w-full bg-transparent text-6xl font-bold placeholder:text-glass-border focus:outline-none text-center py-4"
                                    placeholder="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    autoFocus
                                />
                                <p className="text-text-muted">EGP</p>
                            </div>

                            <div className="flex gap-2">
                                {[100, 500, 1000, 5000].map(val => (
                                    <QuickAmount
                                        key={val}
                                        value={val}
                                        selected={formData.amount === val.toString()}
                                        onClick={() => setFormData({ ...formData, amount: val.toString() })}
                                    />
                                ))}
                            </div>

                            {error && <p className="text-status-error text-center">{error}</p>}
                            {!hasEnoughBalance && formData.amount && (
                                <p className="text-status-warning text-center text-sm flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Amount exceeds available balance
                                </p>
                            )}

                            <div className="flex gap-4">
                                <NeonButton variant="secondary" onClick={() => setStep(1)} className="flex-1">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </NeonButton>
                                <NeonButton onClick={handleNext} className="flex-1" disabled={!isAmountValid || !hasEnoughBalance || isCardFrozen}>
                                    Review <ArrowRight className="w-4 h-4" />
                                </NeonButton>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-1">Review & Confirm</h3>
                                <p className="text-text-muted text-sm">Please verify the details before confirming</p>
                            </div>

                            <div className="bg-gradient-to-br from-glass-bg to-transparent border border-glass-border rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">From</span>
                                    <div className="text-right">
                                        <p className="font-medium">{currentCard?.cardName}</p>
                                        <p className="text-sm text-text-muted">****{currentCard?.number?.slice(-4)}</p>
                                    </div>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">To</span>
                                    <span className="font-mono text-white">{formData.recipient}</span>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Amount</span>
                                    <span className="font-mono text-accent-cyan font-bold text-3xl">{parseFloat(formData.amount).toLocaleString()} <span className="text-sm">EGP</span></span>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Fee</span>
                                    <span className="text-status-success font-medium">FREE ✓</span>
                                </div>
                                <div className="border-t border-glass-border" />
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">New Balance</span>
                                    <span className="font-mono text-text-muted">{((currentCard?.balance || 0) - parseFloat(formData.amount)).toLocaleString()} EGP</span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/30 flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-status-error" />
                                    <p className="text-status-error">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <NeonButton variant="secondary" onClick={() => setStep(2)} className="flex-1">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </NeonButton>
                                <NeonButton onClick={handleSubmit} loading={loading} className="flex-1" disabled={isCardFrozen}>
                                    <Send className="w-4 h-4" /> Confirm Transfer
                                </NeonButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
}
