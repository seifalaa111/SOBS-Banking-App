import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

// Goal types with emojis instead of icons
const GOAL_ICONS = [
    { id: 'vacation', label: 'Vacation', color: 'from-blue-400 to-cyan-500', emoji: '🏖️' },
    { id: 'car', label: 'Car', color: 'from-purple-400 to-pink-500', emoji: '🚗' },
    { id: 'home', label: 'Home', color: 'from-amber-400 to-orange-500', emoji: '🏠' },
    { id: 'education', label: 'Education', color: 'from-green-400 to-emerald-500', emoji: '🎓' },
    { id: 'emergency', label: 'Emergency', color: 'from-red-400 to-rose-500', emoji: '🏥' },
    { id: 'gift', label: 'Gift', color: 'from-pink-400 to-purple-500', emoji: '🎁' },
    { id: 'savings', label: 'General', color: 'from-yellow-400 to-amber-500', emoji: '🐷' },
    { id: 'other', label: 'Other', color: 'from-gray-400 to-gray-600', emoji: '🎯' },
];

// Create Goal Modal - NO ICONS
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
                    <h3 className="text-2xl font-bold">✨ Create Savings Goal</h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg transition-colors text-xl">✕</button>
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
                                    <span className="text-2xl">{item.emoji}</span>
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

// Add Money Modal - NO ICONS
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
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg text-xl">✕</button>
                </div>

                <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconData.color} flex items-center justify-center mx-auto mb-4 text-3xl`}>
                        {iconData.emoji}
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

// Liquid Fill Progress - visual "water tank" style progress
const LiquidProgress = ({ progress, color }) => (
    <div className="relative w-full h-32 bg-glass-bg rounded-2xl overflow-hidden border border-glass-border">
        <motion.div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${color}`}
            initial={{ height: 0 }}
            animate={{ height: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            style={{
                background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
            }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white drop-shadow-lg">{Math.round(progress)}%</span>
        </div>
    </div>
);

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
                        <span className="text-3xl">🐷</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                            Savings Goals
                        </span>
                    </h1>
                    <p className="text-text-secondary mt-2 ml-12">Track your progress towards your dreams</p>
                </div>
                <NeonButton onClick={() => setShowCreate(true)}>
                    + Create Goal
                </NeonButton>
            </div>

            {/* Summary Cards - NO ICONS, use emojis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="bg-gradient-to-br from-status-success/10 to-transparent border-status-success/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-status-success/20 flex items-center justify-center text-2xl">
                            💰
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Total Saved</p>
                            <p className="text-2xl font-bold text-status-success">{totalSaved.toLocaleString()} EGP</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-accent-cyan/10 to-transparent border-accent-cyan/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-2xl">
                            🎯
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Total Target</p>
                            <p className="text-2xl font-bold text-accent-cyan">{totalTarget.toLocaleString()} EGP</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-accent-purple/10 to-transparent border-accent-purple/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center text-2xl">
                            📈
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
                    <span className="text-6xl block mb-4">🐷</span>
                    <h3 className="text-xl font-semibold text-white mb-2">No savings goals yet</h3>
                    <p className="text-text-muted mb-6">Start saving towards your dreams!</p>
                    <NeonButton onClick={() => setShowCreate(true)}>
                        + Create Your First Goal
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
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-status-success/20 text-status-success text-xs font-medium border border-status-success/30">
                                            ✨ Complete!
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconData.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-2xl`}>
                                            {iconData.emoji}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                                            <p className="text-sm text-text-muted">{iconData.label}</p>
                                        </div>
                                    </div>

                                    {/* Liquid Fill Progress */}
                                    <LiquidProgress progress={progress} color={isComplete ? 'from-status-success to-emerald-400' : iconData.color} />

                                    {/* Stats */}
                                    <div className="mt-4 flex justify-between items-center text-sm">
                                        <span className="text-accent-cyan font-mono font-bold">{goal.currentAmount.toLocaleString()}</span>
                                        <span className="text-text-muted">of {goal.targetAmount.toLocaleString()} EGP</span>
                                    </div>

                                    {!isComplete && (
                                        <NeonButton
                                            variant="secondary"
                                            className="w-full mt-4"
                                            onClick={() => setSelectedGoal(goal)}
                                        >
                                            + Add Money
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
                        <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">+</span>
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
