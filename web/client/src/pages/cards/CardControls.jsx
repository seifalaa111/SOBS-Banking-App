import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, Unlock, Shield, Eye, EyeOff, Globe, ShoppingCart, Smartphone, X, Check, AlertTriangle, ChevronLeft, ChevronRight, Snowflake, Wifi } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const ToggleSwitch = ({ enabled, onChange, disabled }) => (
    <button
        onClick={onChange}
        disabled={disabled}
        className={`relative w-14 h-7 rounded-full transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${enabled ? 'bg-gradient-to-r from-accent-cyan to-accent-purple' : 'bg-glass-border'}`}
    >
        <motion.div
            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-lg"
            animate={{ x: enabled ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

const ViewPINModal = ({ isOpen, onClose, cardNumber }) => {
    const [otp, setOtp] = useState('');
    const [verified, setVerified] = useState(false);
    const [pin, setPIN] = useState(null);
    const debugOtp = '123456';

    const handleVerify = () => {
        if (otp === debugOtp) {
            setVerified(true);
            setPIN('4829');
        }
    };

    const handleClose = () => {
        setOtp('');
        setVerified(false);
        setPIN(null);
        onClose();
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
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-accent-cyan" /> View Card PIN
                    </h3>
                    <button onClick={handleClose} className="p-2 hover:bg-glass-hover rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                {verified ? (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Check className="w-10 h-10 text-status-success" />
                        </motion.div>
                        <p className="text-text-muted mb-2">Your PIN is:</p>
                        <div className="text-5xl font-mono font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple mb-6">
                            {pin}
                        </div>
                        <p className="text-sm text-status-warning mb-6 flex items-center justify-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Never share your PIN with anyone
                        </p>
                        <NeonButton onClick={handleClose}>Done</NeonButton>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-accent-cyan" />
                            </div>
                            <p className="text-text-secondary">Enter OTP to view your PIN</p>
                        </div>

                        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4 text-center mb-6">
                            <span className="text-text-muted text-sm">Demo OTP:</span>
                            <div className="text-2xl font-mono font-bold text-accent-cyan tracking-widest mt-1">{debugOtp}</div>
                        </div>

                        <GlowInput
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="text-center text-2xl tracking-widest"
                            maxLength={6}
                        />

                        <NeonButton onClick={handleVerify} className="w-full mt-6" disabled={otp.length !== 6}>
                            Verify & View PIN
                        </NeonButton>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const SpendingLimitModal = ({ isOpen, onClose, currentLimit, onSave }) => {
    const [limit, setLimit] = useState(currentLimit?.toString() || '50000');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Set Spending Limit</h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                <p className="text-text-secondary text-sm mb-6">
                    Limit daily spending on this card to protect against fraud
                </p>

                <GlowInput
                    label="Daily Limit (EGP)"
                    type="number"
                    value={limit}
                    onChange={e => setLimit(e.target.value)}
                />

                <div className="grid grid-cols-4 gap-2 mt-4">
                    {[5000, 10000, 25000, 50000].map(val => (
                        <button
                            key={val}
                            onClick={() => setLimit(val.toString())}
                            className={`py-2 rounded-lg border text-sm transition-all ${limit === val.toString() ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan' : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                }`}
                        >
                            {(val / 1000)}K
                        </button>
                    ))}
                </div>

                <NeonButton onClick={() => { onSave(parseFloat(limit)); onClose(); }} className="w-full mt-6">
                    Save Limit
                </NeonButton>
            </motion.div>
        </div>
    );
};

// Premium 3D Card Component
const CreditCardVisual = ({ card, isFrozen, isSelected, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: isSelected ? 1 : 1.02, rotateY: isSelected ? 0 : 5 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer transition-all ${isSelected ? 'z-20' : 'z-10 opacity-70 hover:opacity-100'}`}
            style={{ perspective: '1000px' }}
        >
            <div className={`relative w-80 aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl ${isSelected ? 'shadow-accent-cyan/30' : 'shadow-black/50'}`}>
                {/* Card Background */}
                <div className={`absolute inset-0 ${isFrozen
                    ? 'bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800'
                    : card.type === 'Savings'
                        ? 'bg-gradient-to-br from-accent-purple via-indigo-600 to-accent-cyan'
                        : 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600'
                    }`} />

                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-white/5" />

                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Frozen overlay */}
                {isFrozen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="text-center">
                            <Snowflake className="w-12 h-12 mx-auto mb-2 text-blue-300 animate-pulse" />
                            <span className="text-blue-200 font-bold tracking-widest text-sm">FROZEN</span>
                        </div>
                    </motion.div>
                )}

                {/* Card content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-inner" />
                            <Wifi className="w-6 h-6 text-white/70 rotate-90" />
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold italic text-white/90 tracking-wide">VISA</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="font-mono text-xl tracking-[0.3em] text-white/90">
                            •••• •••• •••• {card.number.slice(-4)}
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-white/50 uppercase">Card Name</p>
                                <p className="text-sm font-medium text-white/90">{card.cardName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50 uppercase">Balance</p>
                                <p className="text-lg font-bold text-white">{card.balance.toLocaleString()} {card.currency}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                    <motion.div
                        layoutId="cardSelected"
                        className="absolute inset-0 border-2 border-accent-cyan rounded-2xl"
                    />
                )}
            </div>
        </motion.div>
    );
};

export default function CardControls() {
    const [showPINModal, setShowPINModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const queryClient = useQueryClient();

    const { data: cards, isLoading } = useQuery({
        queryKey: ['cards'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    const selectedCard = cards?.[selectedCardIndex];
    const cardSettings = selectedCard?.cardSettings || {};

    const updateCardSettings = useMutation({
        mutationFn: async ({ accountNumber, settings }) => {
            await api.put(`/cards/${accountNumber}/settings`, settings);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cards']);
        }
    });

    const toggleSetting = (setting) => {
        if (!selectedCard) return;
        const newValue = !cardSettings[setting];
        updateCardSettings.mutate({
            accountNumber: selectedCard.number,
            settings: { [setting]: newValue }
        });
    };

    const isFrozen = cardSettings.isFrozen;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-secondary to-orange-500/20 border border-glass-border p-8">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/30">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Card Controls</h1>
                            <p className="text-text-secondary">Manage your card security settings</p>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Skeleton className="h-96" />
            ) : !cards || cards.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <CreditCard className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No cards found</h3>
                    <p className="text-text-muted">Add a card to manage its settings</p>
                </GlassCard>
            ) : (
                <>
                    {/* Card Carousel */}
                    <div className="relative">
                        <div className="flex justify-center items-center gap-4">
                            {/* Prev Button */}
                            {cards.length > 1 && (
                                <button
                                    onClick={() => setSelectedCardIndex(i => (i - 1 + cards.length) % cards.length)}
                                    className="p-3 rounded-full bg-glass-bg border border-glass-border hover:bg-glass-hover hover:border-accent-cyan transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}

                            {/* Cards */}
                            <div className="flex items-center gap-4 overflow-hidden">
                                <AnimatePresence mode="popLayout">
                                    {cards.map((card, i) => (
                                        <motion.div
                                            key={card.number}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                scale: i === selectedCardIndex ? 1 : 0.85,
                                                zIndex: i === selectedCardIndex ? 20 : 10
                                            }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ type: "spring", bounce: 0.2 }}
                                            className={i !== selectedCardIndex && cards.length > 1 ? 'hidden md:block' : ''}
                                        >
                                            <CreditCardVisual
                                                card={card}
                                                isFrozen={card.cardSettings?.isFrozen}
                                                isSelected={i === selectedCardIndex}
                                                onClick={() => setSelectedCardIndex(i)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Next Button */}
                            {cards.length > 1 && (
                                <button
                                    onClick={() => setSelectedCardIndex(i => (i + 1) % cards.length)}
                                    className="p-3 rounded-full bg-glass-bg border border-glass-border hover:bg-glass-hover hover:border-accent-cyan transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Card Indicators */}
                        {cards.length > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {cards.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedCardIndex(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === selectedCardIndex
                                                ? 'bg-accent-cyan w-8'
                                                : 'bg-glass-border hover:bg-glass-hover'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Card Settings */}
                    {selectedCard && (
                        <motion.div
                            key={selectedCard.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Freeze Card - Main Action */}
                            <GlassCard className={`${isFrozen ? 'bg-gradient-to-br from-blue-500/20 to-status-error/10 border-blue-500/50' : 'bg-gradient-to-br from-status-success/10 to-transparent border-status-success/30'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl ${isFrozen ? 'bg-blue-500/20' : 'bg-status-success/20'} flex items-center justify-center`}>
                                            {isFrozen ? <Snowflake className="w-7 h-7 text-blue-400" /> : <Unlock className="w-7 h-7 text-status-success" />}
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold">{isFrozen ? 'Card Frozen' : 'Card Active'}</p>
                                            <p className="text-sm text-text-muted">
                                                {isFrozen
                                                    ? 'All transactions are blocked. Unfreeze to use your card.'
                                                    : 'Your card is active and ready to use'}
                                            </p>
                                        </div>
                                    </div>
                                    <NeonButton
                                        variant={isFrozen ? 'primary' : 'danger'}
                                        onClick={() => toggleSetting('isFrozen')}
                                    >
                                        {isFrozen ? <><Unlock className="w-4 h-4" /> Unfreeze</> : <><Snowflake className="w-4 h-4" /> Freeze</>}
                                    </NeonButton>
                                </div>

                                {isFrozen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 p-4 rounded-xl bg-status-warning/10 border border-status-warning/30"
                                    >
                                        <p className="text-sm text-status-warning flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            <strong>Blocked:</strong> Transfers, bill payments, deposits, and all card transactions
                                        </p>
                                    </motion.div>
                                )}
                            </GlassCard>

                            {/* Other Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Online Purchases */}
                                <GlassCard className={`hover:border-accent-cyan/30 transition-all ${isFrozen ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                                                <Globe className="w-6 h-6 text-accent-cyan" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Online Purchases</p>
                                                <p className="text-sm text-text-muted">E-commerce transactions</p>
                                            </div>
                                        </div>
                                        <ToggleSwitch
                                            enabled={cardSettings.onlinePurchases && !isFrozen}
                                            onChange={() => toggleSetting('onlinePurchases')}
                                            disabled={isFrozen}
                                        />
                                    </div>
                                </GlassCard>

                                {/* International */}
                                <GlassCard className={`hover:border-accent-cyan/30 transition-all ${isFrozen ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                                                <ShoppingCart className="w-6 h-6 text-accent-purple" />
                                            </div>
                                            <div>
                                                <p className="font-medium">International</p>
                                                <p className="text-sm text-text-muted">Payments from abroad</p>
                                            </div>
                                        </div>
                                        <ToggleSwitch
                                            enabled={cardSettings.internationalTransactions && !isFrozen}
                                            onChange={() => toggleSetting('internationalTransactions')}
                                            disabled={isFrozen}
                                        />
                                    </div>
                                </GlassCard>

                                {/* Contactless */}
                                <GlassCard className={`hover:border-accent-cyan/30 transition-all ${isFrozen ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-accent-pink/20 flex items-center justify-center">
                                                <Smartphone className="w-6 h-6 text-accent-pink" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Contactless</p>
                                                <p className="text-sm text-text-muted">Tap to pay enabled</p>
                                            </div>
                                        </div>
                                        <ToggleSwitch
                                            enabled={cardSettings.contactlessPayments && !isFrozen}
                                            onChange={() => toggleSetting('contactlessPayments')}
                                            disabled={isFrozen}
                                        />
                                    </div>
                                </GlassCard>

                                {/* Spending Limit */}
                                <GlassCard className={`hover:border-accent-cyan/30 transition-all ${isFrozen ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-status-warning/20 flex items-center justify-center">
                                                <Shield className="w-6 h-6 text-status-warning" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Daily Limit</p>
                                                <p className="text-sm text-accent-cyan font-mono">{(cardSettings.spendingLimit || 50000).toLocaleString()} EGP</p>
                                            </div>
                                        </div>
                                        <NeonButton
                                            variant="secondary"
                                            onClick={() => setShowLimitModal(true)}
                                            disabled={isFrozen}
                                        >
                                            Change
                                        </NeonButton>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* View PIN Button */}
                            <GlassCard>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Card PIN</p>
                                            <p className="text-sm text-text-muted">View your secure PIN (requires OTP)</p>
                                        </div>
                                    </div>
                                    <NeonButton onClick={() => setShowPINModal(true)}>
                                        <Eye className="w-4 h-4" /> View PIN
                                    </NeonButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </>
            )}

            {/* Modals */}
            <ViewPINModal
                isOpen={showPINModal}
                onClose={() => setShowPINModal(false)}
                cardNumber={selectedCard?.number}
            />
            <SpendingLimitModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                currentLimit={cardSettings.spendingLimit}
                onSave={(limit) => {
                    updateCardSettings.mutate({
                        accountNumber: selectedCard.number,
                        settings: { spendingLimit: limit }
                    });
                }}
            />
        </div>
    );
}
