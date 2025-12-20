import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, Sparkles, TrendingUp, Wallet, PiggyBank, Car, Plane, Home, GraduationCap, Heart, Gift } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const GOAL_ICONS = [
    { id: 'vacation', icon: Plane, label: 'Vacation', color: 'from-blue-400 to-cyan-500' },
    { id: 'car', icon: Car, label: 'Car', color: 'from-purple-400 to-pink-500' },
    { id: 'home', icon: Home, label: 'Home', color: 'from-amber-400 to-orange-500' },
    { id: 'education', icon: GraduationCap, label: 'Education', color: 'from-green-400 to-emerald-500' },
    { id: 'emergency', icon: Heart, label: 'Emergency', color: 'from-red-400 to-rose-500' },
    { id: 'gift', icon: Gift, label: 'Gift', color: 'from-pink-400 to-purple-500' },
    { id: 'savings', icon: PiggyBank, label: 'General', color: 'from-yellow-400 to-amber-500' },
    { id: 'other', icon: Target, label: 'Other', color: 'from-gray-400 to-gray-600' },
];

const CreateGoalModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('savings');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name || !targetAmount) return;
        setLoading(true);
        try {
            await api.post('/savings/goals', { name, targetAmount: parseFloat(targetAmount), icon: selectedIcon });
            onSuccess();
            onClose();
            setName('');
            setTargetAmount('');
            setSelectedIcon('savings');
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-lg"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-accent-cyan" /> Create Savings Goal
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <GlowInput
                        label="Goal Name"
                        placeholder="e.g., Dream Vacation"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <GlowInput
                        label="Target Amount (EGP)"
                        type="number"
                        placeholder="50000"
                        value={targetAmount}
                        onChange={e => setTargetAmount(e.target.value)}
                    />

                    <div>
                        <label className="block text-sm text-text-secondary mb-3 font-medium">Choose an Icon</label>
                        <div className="grid grid-cols-4 gap-3">
                            {GOAL_ICONS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedIcon(item.id)}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedIcon === item.id
                                            ? 'border-accent-cyan bg-accent-cyan/10'
                                            : 'border-glass-border hover:border-glass-hover'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xs text-text-muted">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <NeonButton onClick={handleCreate} className="w-full" loading={loading} disabled={!name || !targetAmount}>
                        Create Goal
                    </NeonButton>
                </div>
            </motion.div>
        </div>
    );
};

const AddMoneyToGoalModal = ({ isOpen, onClose, goal, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            await api.post(`/savings/goals/${goal.id}/deposit`, { amount: parseFloat(amount) });
            onSuccess();
            onClose();
            setAmount('');
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!isOpen || !goal) return null;

    const iconData = GOAL_ICONS.find(i => i.id === goal.icon) || GOAL_ICONS[6];
    const remaining = goal.targetAmount - goal.currentAmount;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add to {goal.name}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconData.color} flex items-center justify-center mx-auto mb-4`}>
                        <iconData.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-text-muted">Remaining: <span className="text-accent-cyan font-bold">{remaining.toLocaleString()} EGP</span></p>
                </div>

                <GlowInput
                    label="Amount to Add (EGP)"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />

                <div className="grid grid-cols-4 gap-2 mt-4">
                    {[100, 500, 1000, Math.min(5000, remaining)].map(val => (
                        <button key={val} onClick={() => setAmount(val.toString())}
                            className="py-2 rounded-lg bg-glass-bg border border-glass-border hover:bg-glass-hover text-sm">
                            {val}
                        </button>
                    ))}
                </div>

                <NeonButton onClick={handleAdd} className="w-full mt-6" loading={loading}>
                    Add {amount ? `${parseFloat(amount).toLocaleString()} EGP` : 'Money'}
                </NeonButton>
            </motion.div>
        </div>
    );
};

export default function SavingsGoals() {
    const [showCreate, setShowCreate] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const queryClient = useQueryClient();

    const { data: goals, isLoading } = useQuery({
        queryKey: ['savings-goals'],
        queryFn: async () => {
            const res = await api.get('/savings/goals');
            return res.data || [];
        }
    });

    const totalSaved = goals?.reduce((sum, g) => sum + g.currentAmount, 0) || 0;
    const totalTarget = goals?.reduce((sum, g) => sum + g.targetAmount, 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                            <PiggyBank className="w-7 h-7 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                            Savings Goals
                        </span>
                    </h1>
                    <p className="text-text-secondary mt-2 ml-16">Track your progress towards your dreams</p>
                </div>
                <NeonButton onClick={() => setShowCreate(true)}>
                    <Plus className="w-5 h-5" /> Create Goal
                </NeonButton>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="bg-gradient-to-br from-status-success/10 to-transparent border-status-success/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-status-success/20 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-status-success" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Total Saved</p>
                            <p className="text-2xl font-bold text-status-success">{totalSaved.toLocaleString()} EGP</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-accent-cyan/10 to-transparent border-accent-cyan/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                            <Target className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Total Target</p>
                            <p className="text-2xl font-bold text-accent-cyan">{totalTarget.toLocaleString()} EGP</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-accent-purple/10 to-transparent border-accent-purple/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-accent-purple" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Overall Progress</p>
                            <p className="text-2xl font-bold text-accent-purple">
                                {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Goals Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
                </div>
            ) : !goals || goals.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <PiggyBank className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">No savings goals yet</h3>
                    <p className="text-text-muted mb-6">Start saving towards your dreams!</p>
                    <NeonButton onClick={() => setShowCreate(true)}>
                        <Plus className="w-5 h-5" /> Create Your First Goal
                    </NeonButton>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal, i) => {
                        const iconData = GOAL_ICONS.find(ic => ic.id === goal.icon) || GOAL_ICONS[6];
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        const isComplete = progress >= 100;

                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <GlassCard className={`relative overflow-hidden group hover:border-accent-cyan/50 transition-all ${isComplete ? 'border-status-success/50' : ''}`}>
                                    {isComplete && (
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-status-success/20 text-status-success text-xs font-medium border border-status-success/30 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Complete!
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconData.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            <iconData.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                                            <p className="text-sm text-text-muted">{iconData.label}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-accent-cyan font-mono font-bold">{goal.currentAmount.toLocaleString()}</span>
                                            <span className="text-text-muted">of {goal.targetAmount.toLocaleString()} EGP</span>
                                        </div>
                                        <div className="h-3 bg-glass-bg rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full ${isComplete ? 'bg-gradient-to-r from-status-success to-emerald-400' : 'bg-gradient-to-r from-accent-cyan to-accent-purple'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                            />
                                        </div>
                                        <p className="text-right text-sm text-text-muted mt-1">{Math.round(progress)}%</p>
                                    </div>

                                    {!isComplete && (
                                        <NeonButton
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => setSelectedGoal(goal)}
                                        >
                                            <Plus className="w-4 h-4" /> Add Money
                                        </NeonButton>
                                    )}
                                </GlassCard>
                            </motion.div>
                        );
                    })}

                    {/* Add New Goal Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: goals.length * 0.1 }}
                        onClick={() => setShowCreate(true)}
                        className="border-2 border-dashed border-glass-border rounded-2xl p-8 flex flex-col items-center justify-center text-text-muted hover:border-accent-cyan hover:text-accent-cyan transition-all cursor-pointer min-h-[280px] group"
                    >
                        <Plus className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Create New Goal</span>
                    </motion.div>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showCreate && (
                    <CreateGoalModal
                        isOpen={showCreate}
                        onClose={() => setShowCreate(false)}
                        onSuccess={() => queryClient.invalidateQueries(['savings-goals'])}
                    />
                )}
                {selectedGoal && (
                    <AddMoneyToGoalModal
                        isOpen={!!selectedGoal}
                        goal={selectedGoal}
                        onClose={() => setSelectedGoal(null)}
                        onSuccess={() => queryClient.invalidateQueries(['savings-goals'])}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
