import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, X, Send, Edit2, Trash2, User, Building2, CreditCard, Star } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const AVATAR_COLORS = [
    'from-purple-400 to-pink-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-yellow-400 to-orange-500',
    'from-red-400 to-rose-500',
    'from-indigo-400 to-purple-500',
];

const AddBeneficiaryModal = ({ isOpen, onClose, onSuccess, editData }) => {
    const [name, setName] = useState(editData?.name || '');
    const [accountNumber, setAccountNumber] = useState(editData?.accountNumber || '');
    const [bank, setBank] = useState(editData?.bank || '');
    const [nickname, setNickname] = useState(editData?.nickname || '');
    const [isFavorite, setIsFavorite] = useState(editData?.isFavorite || false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !accountNumber) return;
        setLoading(true);
        try {
            if (editData?.id) {
                await api.put(`/beneficiaries/${editData.id}`, { name, accountNumber, bank, nickname, isFavorite });
            } else {
                await api.post('/beneficiaries', { name, accountNumber, bank, nickname, isFavorite });
            }
            onSuccess();
            onClose();
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
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-lg"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-accent-cyan" />
                        {editData ? 'Edit Beneficiary' : 'Add Beneficiary'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                    <GlowInput
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <GlowInput
                        label="Account Number"
                        placeholder="1234567890123456"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    />

                    <GlowInput
                        label="Bank Name (Optional)"
                        placeholder="e.g., CIB, QNB, NBE"
                        value={bank}
                        onChange={e => setBank(e.target.value)}
                    />

                    <GlowInput
                        label="Nickname (Optional)"
                        placeholder="e.g., Mom, Landlord"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />

                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${isFavorite ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-glass-bg border-glass-border text-text-muted hover:bg-glass-hover'
                            }`}
                    >
                        <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400' : ''}`} />
                        {isFavorite ? 'Favorite' : 'Mark as Favorite'}
                    </button>

                    <NeonButton onClick={handleSave} className="w-full" loading={loading} disabled={!name || !accountNumber}>
                        {editData ? 'Save Changes' : 'Add Beneficiary'}
                    </NeonButton>
                </div>
            </motion.div>
        </div>
    );
};

const QuickTransferModal = ({ isOpen, onClose, beneficiary }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const queryClient = useQueryClient();

    const handleTransfer = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            await api.post('/transfers', { recipientAccountNumber: beneficiary.accountNumber, amount });
            setSuccess(true);
            queryClient.invalidateQueries(['accounts']);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!isOpen || !beneficiary) return null;

    const colorIndex = beneficiary.name.charCodeAt(0) % AVATAR_COLORS.length;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl p-8 w-full max-w-md"
            >
                {success ? (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Send className="w-10 h-10 text-status-success" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-2">Transfer Sent!</h3>
                        <p className="text-text-secondary mb-6">
                            <span className="text-accent-cyan font-bold">{parseFloat(amount).toLocaleString()} EGP</span> to {beneficiary.name}
                        </p>
                        <NeonButton onClick={onClose}>Done</NeonButton>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Quick Transfer</h3>
                            <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-lg"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-glass-bg border border-glass-border">
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIndex]} flex items-center justify-center text-xl font-bold text-white`}>
                                {beneficiary.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{beneficiary.nickname || beneficiary.name}</p>
                                <p className="text-sm text-text-muted font-mono">{beneficiary.accountNumber}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-text-secondary mb-2">Amount (EGP)</label>
                            <input
                                type="number"
                                className="w-full bg-transparent text-4xl font-bold text-center py-6 border-b-2 border-glass-border focus:border-accent-cyan focus:outline-none transition-colors"
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {[100, 500, 1000, 5000].map(val => (
                                <button key={val} onClick={() => setAmount(val.toString())}
                                    className="py-2 rounded-lg bg-glass-bg border border-glass-border hover:bg-glass-hover text-sm">
                                    {val}
                                </button>
                            ))}
                        </div>

                        <NeonButton onClick={handleTransfer} className="w-full" loading={loading} disabled={!amount}>
                            <Send className="w-4 h-4" /> Send Money
                        </NeonButton>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default function Beneficiaries() {
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState(null);
    const [transferTarget, setTransferTarget] = useState(null);
    const queryClient = useQueryClient();

    const { data: beneficiaries, isLoading } = useQuery({
        queryKey: ['beneficiaries'],
        queryFn: async () => {
            const res = await api.get('/beneficiaries');
            return res.data || [];
        }
    });

    const handleDelete = async (id) => {
        if (!confirm('Delete this beneficiary?')) return;
        await api.delete(`/beneficiaries/${id}`);
        queryClient.invalidateQueries(['beneficiaries']);
    };

    const favorites = beneficiaries?.filter(b => b.isFavorite) || [];
    const others = beneficiaries?.filter(b => !b.isFavorite) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                            Beneficiaries
                        </span>
                    </h1>
                    <p className="text-text-secondary mt-2 ml-16">Manage your saved recipients</p>
                </div>
                <NeonButton onClick={() => { setEditData(null); setShowAdd(true); }}>
                    <Plus className="w-5 h-5" /> Add Beneficiary
                </NeonButton>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
                </div>
            ) : !beneficiaries || beneficiaries.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <Users className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">No beneficiaries yet</h3>
                    <p className="text-text-muted mb-6">Save your frequent recipients for quick transfers</p>
                    <NeonButton onClick={() => setShowAdd(true)}>
                        <Plus className="w-5 h-5" /> Add Your First Beneficiary
                    </NeonButton>
                </GlassCard>
            ) : (
                <>
                    {/* Favorites */}
                    {favorites.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Favorites
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {favorites.map((b, i) => {
                                    const colorIndex = b.name.charCodeAt(0) % AVATAR_COLORS.length;
                                    return (
                                        <motion.div
                                            key={b.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <GlassCard className="group hover:border-accent-cyan/50 transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIndex]} flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
                                                        {b.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-white truncate">{b.nickname || b.name}</h3>
                                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                                                        </div>
                                                        <p className="text-sm text-text-muted truncate">{b.name}</p>
                                                        <p className="text-xs text-text-muted font-mono mt-1">{b.accountNumber}</p>
                                                        {b.bank && <p className="text-xs text-accent-cyan mt-1">{b.bank}</p>}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    <NeonButton className="flex-1 py-2 text-sm" onClick={() => setTransferTarget(b)}>
                                                        <Send className="w-4 h-4" /> Send
                                                    </NeonButton>
                                                    <button onClick={() => { setEditData(b); setShowAdd(true); }} className="p-2 rounded-lg bg-glass-bg hover:bg-glass-hover border border-glass-border">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg bg-status-error/10 hover:bg-status-error/20 border border-status-error/30 text-status-error">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Others */}
                    {others.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">All Beneficiaries</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {others.map((b, i) => {
                                    const colorIndex = b.name.charCodeAt(0) % AVATAR_COLORS.length;
                                    return (
                                        <motion.div
                                            key={b.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <GlassCard className="group hover:border-accent-cyan/50 transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIndex]} flex items-center justify-center text-xl font-bold text-white`}>
                                                        {b.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-white truncate">{b.nickname || b.name}</h3>
                                                        <p className="text-sm text-text-muted truncate">{b.name}</p>
                                                        <p className="text-xs text-text-muted font-mono mt-1">{b.accountNumber}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    <NeonButton className="flex-1 py-2 text-sm" onClick={() => setTransferTarget(b)}>
                                                        <Send className="w-4 h-4" /> Send
                                                    </NeonButton>
                                                    <button onClick={() => { setEditData(b); setShowAdd(true); }} className="p-2 rounded-lg bg-glass-bg hover:bg-glass-hover border border-glass-border">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg bg-status-error/10 hover:bg-status-error/20 border border-status-error/30 text-status-error">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showAdd && (
                    <AddBeneficiaryModal
                        isOpen={showAdd}
                        onClose={() => { setShowAdd(false); setEditData(null); }}
                        onSuccess={() => queryClient.invalidateQueries(['beneficiaries'])}
                        editData={editData}
                    />
                )}
                {transferTarget && (
                    <QuickTransferModal
                        isOpen={!!transferTarget}
                        onClose={() => setTransferTarget(null)}
                        beneficiary={transferTarget}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
