import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, ArrowUpRight, ArrowDownLeft, CreditCard, Shield, AlertTriangle, Gift, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const NOTIFICATION_TYPES = {
    transfer_received: { icon: ArrowDownLeft, color: 'text-status-success', bg: 'bg-status-success/20' },
    transfer_sent: { icon: ArrowUpRight, color: 'text-accent-cyan', bg: 'bg-accent-cyan/20' },
    bill_paid: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    security: { icon: Shield, color: 'text-accent-purple', bg: 'bg-accent-purple/20' },
    card: { icon: CreditCard, color: 'text-accent-pink', bg: 'bg-accent-pink/20' },
    warning: { icon: AlertTriangle, color: 'text-status-warning', bg: 'bg-status-warning/20' },
    promo: { icon: Gift, color: 'text-green-400', bg: 'bg-green-400/20' },
};

const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
};

export default function Notifications() {
    const [filter, setFilter] = useState('all'); // all | unread
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notifications');
            return res.data || [];
        }
    });

    const markAsRead = async (id) => {
        await api.put(`/notifications/${id}/read`);
        queryClient.invalidateQueries(['notifications']);
    };

    const markAllAsRead = async () => {
        await api.put('/notifications/read-all');
        queryClient.invalidateQueries(['notifications']);
    };

    const deleteNotification = async (id) => {
        await api.delete(`/notifications/${id}`);
        queryClient.invalidateQueries(['notifications']);
    };

    const filteredNotifications = notifications?.filter(n =>
        filter === 'all' || (filter === 'unread' && !n.isRead)
    ) || [];

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-lg shadow-pink-500/20 relative">
                            <Bell className="w-7 h-7 text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-error rounded-full text-xs flex items-center justify-center text-white font-bold">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                            Notifications
                        </span>
                    </h1>
                    <p className="text-text-secondary mt-2 ml-16">Stay updated with your account activity</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-glass-bg border border-glass-border rounded-xl p-1">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'unread', label: `Unread (${unreadCount})` },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.id ? 'bg-accent-cyan text-void' : 'text-text-muted hover:text-white'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {unreadCount > 0 && (
                        <NeonButton variant="secondary" onClick={markAllAsRead}>
                            <CheckCheck className="w-4 h-4" /> Mark All Read
                        </NeonButton>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
                </div>
            ) : filteredNotifications.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">
                        {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-text-muted">
                        {filter === 'unread' ? 'You\'re all caught up!' : 'We\'ll notify you about important activity'}
                    </p>
                </GlassCard>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notif, i) => {
                        const typeInfo = NOTIFICATION_TYPES[notif.type] || NOTIFICATION_TYPES.security;
                        const IconComponent = typeInfo.icon;

                        return (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                layout
                            >
                                <GlassCard
                                    className={`group hover:border-accent-cyan/30 transition-all ${!notif.isRead ? 'border-l-4 border-l-accent-cyan' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${typeInfo.bg} flex items-center justify-center flex-shrink-0`}>
                                            <IconComponent className={`w-6 h-6 ${typeInfo.color}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className={`font-semibold ${!notif.isRead ? 'text-white' : 'text-text-secondary'}`}>
                                                        {notif.title}
                                                    </h4>
                                                    <p className="text-sm text-text-muted mt-1">{notif.message}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className="text-xs text-text-muted">{formatTimeAgo(notif.createdAt)}</span>
                                                    {!notif.isRead && (
                                                        <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                                                    )}
                                                </div>
                                            </div>

                                            {notif.amount && (
                                                <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-mono font-bold ${notif.type === 'transfer_received' ? 'bg-status-success/20 text-status-success' : 'bg-accent-cyan/20 text-accent-cyan'
                                                    }`}>
                                                    {notif.type === 'transfer_received' ? '+' : '-'}{notif.amount.toLocaleString()} EGP
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="p-2 rounded-lg bg-glass-bg hover:bg-glass-hover border border-glass-border"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notif.id)}
                                                className="p-2 rounded-lg bg-status-error/10 hover:bg-status-error/20 border border-status-error/30 text-status-error"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
