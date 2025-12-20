import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Plus, X, Play, Pause, Trash2, Clock, RefreshCw,
    Repeat, ArrowRight, Check, ChevronRight, Sparkles, Zap, DollarSign
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const PAYMENT_TYPES = [
    { id: 'transfer', label: 'Transfer', icon: ArrowRight, gradient: 'from-cyan-400 to-blue-500' },
    { id: 'bill', label: 'Bill Payment', icon: Zap, gradient: 'from-amber-400 to-orange-500' },
    { id: 'rent', label: 'Rent', icon: DollarSign, gradient: 'from-emerald-400 to-green-500' },
];

const FREQUENCIES = [
    { id: 'weekly', label: 'Weekly', desc: 'Every week' },
    { id: 'biweekly', label: 'Bi-weekly', desc: 'Every 2 weeks' },
    { id: 'monthly', label: 'Monthly', desc: 'Every month' },
    { id: 'quarterly', label: 'Quarterly', desc: 'Every 3 months' },
];

const ScheduledPaymentCard = ({ payment, onPause, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const nextPayment = new Date(payment.startDate);
    nextPayment.setMonth(nextPayment.getMonth() + 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`relative p-5 rounded-2xl border transition-all ${payment.isPaused
                    ? 'bg-glass-bg/30 border-glass-border opacity-60'
                    : 'bg-gradient-to-r from-glass-bg to-transparent border-glass-border hover:border-accent-cyan/50'
                }`}
        >
            {/* Status Badge */}
            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${payment.isPaused
                    ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                    : 'bg-status-success/20 text-status-success border border-status-success/30'
                }`}>
                {payment.isPaused ? 'Paused' : 'Active'}
            </div>

            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${PAYMENT_TYPES.find(t => t.id === payment.paymentType)?.gradient || 'from-gray-400 to-gray-500'
                    } flex items-center justify-center shadow-lg`}>
                    {(() => {
                        const Icon = PAYMENT_TYPES.find(t => t.id === payment.paymentType)?.icon || ArrowRight;
                        return <Icon className="w-7 h-7 text-white" />;
                    })()}
                </div>

                <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{payment.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {payment.amount.toLocaleString()} EGP
                        </span>
                        <span className="w-1 h-1 rounded-full bg-text-muted" />
                        <span className="flex items-center gap-1">
                            <Repeat className="w-4 h-4" />
                            {payment.frequency}
                        </span>
                    </div>

                    {!payment.isPaused && (
                        <div className="mt-3 p-2 rounded-lg bg-accent-cyan/10 inline-flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-accent-cyan" />
                            <span className="text-text-secondary">Next: </span>
                            <span className="text-accent-cyan font-medium">
                                {nextPayment.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onPause(payment)}
                        className={`p-3 rounded-xl border transition-all ${payment.isPaused
                                ? 'bg-status-success/20 border-status-success/30 hover:bg-status-success/30'
                                : 'bg-status-warning/20 border-status-warning/30 hover:bg-status-warning/30'
                            }`}
                    >
                        {payment.isPaused ? (
                            <Play className="w-5 h-5 text-status-success" />
                        ) : (
                            <Pause className="w-5 h-5 text-status-warning" />
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(payment)}
                        className="p-3 rounded-xl bg-status-error/20 border border-status-error/30 hover:bg-status-error/30 transition-all"
                    >
                        <Trash2 className="w-5 h-5 text-status-error" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const CreatePaymentModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        paymentType: 'transfer',
        amount: '',
        recipientAccount: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
        setFormData({
            name: '',
            paymentType: 'transfer',
            amount: '',
            recipientAccount: '',
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0]
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-accent-purple to-accent-cyan rounded-xl">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        Schedule Payment
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-xl transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    <GlowInput
                        label="Payment Name"
                        placeholder="e.g., Monthly Rent, Internet Bill"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />

                    {/* Payment Type */}
                    <div>
                        <label className="block text-sm text-text-secondary mb-3 font-medium">Payment Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {PAYMENT_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setFormData({ ...formData, paymentType: type.id })}
                                    className={`p-4 rounded-xl border text-center transition-all ${formData.paymentType === type.id
                                            ? `bg-gradient-to-br ${type.gradient} border-transparent`
                                            : 'bg-glass-bg border-glass-border hover:border-accent-cyan/50'
                                        }`}
                                >
                                    <type.icon className="w-6 h-6 mx-auto mb-2" />
                                    <span className="text-sm font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <GlowInput
                        label="Amount (EGP)"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />

                    <GlowInput
                        label="Recipient Account"
                        placeholder="Enter account number"
                        value={formData.recipientAccount}
                        onChange={e => setFormData({ ...formData, recipientAccount: e.target.value })}
                    />

                    {/* Frequency */}
                    <div>
                        <label className="block text-sm text-text-secondary mb-3 font-medium">Frequency</label>
                        <div className="grid grid-cols-2 gap-3">
                            {FREQUENCIES.map(freq => (
                                <button
                                    key={freq.id}
                                    onClick={() => setFormData({ ...formData, frequency: freq.id })}
                                    className={`p-3 rounded-xl border text-left transition-all ${formData.frequency === freq.id
                                            ? 'bg-accent-cyan/20 border-accent-cyan'
                                            : 'bg-glass-bg border-glass-border hover:border-accent-cyan/50'
                                        }`}
                                >
                                    <p className="font-medium">{freq.label}</p>
                                    <p className="text-xs text-text-muted">{freq.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <GlowInput
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />

                    <NeonButton
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.amount || !formData.recipientAccount}
                        className="w-full"
                    >
                        <Calendar className="w-5 h-5" /> Create Schedule
                    </NeonButton>
                </div>
            </motion.div>
        </div>
    );
};

export default function ScheduledPayments() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: payments, isLoading } = useQuery({
        queryKey: ['scheduled-payments'],
        queryFn: async () => {
            const res = await api.get('/scheduled-payments');
            return res.data || [];
        }
    });

    const createPayment = useMutation({
        mutationFn: async (data) => {
            await api.post('/scheduled-payments', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['scheduled-payments']);
            setShowCreateModal(false);
        }
    });

    const updatePayment = useMutation({
        mutationFn: async ({ id, data }) => {
            await api.put(`/scheduled-payments/${id}`, data);
        },
        onSuccess: () => queryClient.invalidateQueries(['scheduled-payments'])
    });

    const deletePayment = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/scheduled-payments/${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries(['scheduled-payments'])
    });

    const activePayments = payments?.filter(p => !p.isPaused) || [];
    const pausedPayments = payments?.filter(p => p.isPaused) || [];
    const monthlyTotal = activePayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <div className="space-y-8">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/20 via-secondary to-indigo-500/20 border border-glass-border p-8">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/30 rounded-full blur-3xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-2xl shadow-lg shadow-violet-500/30">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">Scheduled Payments</h1>
                        </div>
                        <p className="text-text-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-violet-400" />
                            Automate your recurring payments
                        </p>
                    </div>

                    <NeonButton onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-5 h-5" /> Schedule Payment
                    </NeonButton>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="bg-gradient-to-br from-status-success/10 to-transparent border-status-success/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-status-success/20 flex items-center justify-center">
                            <Play className="w-6 h-6 text-status-success" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Active</p>
                            <p className="text-2xl font-bold text-status-success">{activePayments.length}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-status-warning/10 to-transparent border-status-warning/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-status-warning/20 flex items-center justify-center">
                            <Pause className="w-6 h-6 text-status-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Paused</p>
                            <p className="text-2xl font-bold text-status-warning">{pausedPayments.length}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-accent-cyan/10 to-transparent border-accent-cyan/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Monthly Total</p>
                            <p className="text-2xl font-bold text-accent-cyan">{monthlyTotal.toLocaleString()} EGP</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Payments List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
                </div>
            ) : payments?.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center"
                    >
                        <Calendar className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">No scheduled payments</h3>
                    <p className="text-text-muted mb-6">Set up recurring payments to save time</p>
                    <NeonButton onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-5 h-5" /> Create Your First Schedule
                    </NeonButton>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {payments?.map(payment => (
                            <ScheduledPaymentCard
                                key={payment.id}
                                payment={payment}
                                onPause={(p) => updatePayment.mutate({ id: p.id, data: { isPaused: !p.isPaused } })}
                                onDelete={(p) => deletePayment.mutate(p.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Create Modal */}
            <CreatePaymentModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={(data) => createPayment.mutate(data)}
            />
        </div>
    );
}
