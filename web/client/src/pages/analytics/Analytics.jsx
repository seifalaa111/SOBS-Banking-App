import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, DollarSign, CreditCard, ChevronDown, Sparkles, Zap, Target, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const CATEGORY_COLORS = {
    food: { color: '#f97316', gradient: 'from-orange-400 to-red-500', label: 'Food & Dining', icon: '🍔' },
    transport: { color: '#3b82f6', gradient: 'from-blue-400 to-indigo-500', label: 'Transport', icon: '🚗' },
    shopping: { color: '#ec4899', gradient: 'from-pink-400 to-rose-500', label: 'Shopping', icon: '🛍️' },
    bill: { color: '#eab308', gradient: 'from-yellow-400 to-amber-500', label: 'Bills & Utilities', icon: '💡' },
    entertainment: { color: '#8b5cf6', gradient: 'from-purple-400 to-violet-500', label: 'Entertainment', icon: '🎬' },
    health: { color: '#10b981', gradient: 'from-emerald-400 to-green-500', label: 'Health', icon: '💊' },
    transfer: { color: '#06b6d4', gradient: 'from-cyan-400 to-blue-500', label: 'Transfers', icon: '💸' },
    deposit: { color: '#22c55e', gradient: 'from-green-400 to-emerald-500', label: 'Deposits', icon: '💰' },
    other: { color: '#6b7280', gradient: 'from-gray-400 to-slate-500', label: 'Other', icon: '📦' },
};

// Premium Animated Pie Chart with 3D effect
const PieChartVisual = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return null;

    let currentAngle = -90; // Start from top

    return (
        <div className="relative w-64 h-64 mx-auto">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 blur-xl animate-pulse" />

            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl relative z-10">
                <defs>
                    {data.map((segment, i) => (
                        <linearGradient key={`grad-${i}`} id={`pieGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={segment.color} stopOpacity="0.6" />
                        </linearGradient>
                    ))}
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                </defs>

                {data.map((segment, i) => {
                    const percentage = (segment.value / total) * 100;
                    const angle = (percentage / 100) * 360;

                    const startX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                    const startY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                    const endAngle = currentAngle + angle;
                    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                    const largeArc = angle > 180 ? 1 : 0;

                    const pathD = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`;
                    const result = (
                        <motion.path
                            key={i}
                            d={pathD}
                            fill={`url(#pieGrad${i})`}
                            filter="url(#shadow)"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: hoveredIndex === i ? 1.05 : 1,
                                filter: hoveredIndex === i ? 'brightness(1.2)' : 'brightness(1)'
                            }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="cursor-pointer transition-all origin-center"
                            style={{ transformOrigin: '50px 50px' }}
                        />
                    );
                    currentAngle += angle;
                    return result;
                })}

                {/* Center circle with gradient */}
                <circle cx="50" cy="50" r="25" className="fill-secondary" />
                <circle cx="50" cy="50" r="24" fill="url(#centerGrad)" fillOpacity="0.1" />
                <defs>
                    <radialGradient id="centerGrad">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center">
                    <motion.p
                        key={total}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple"
                    >
                        {total.toLocaleString()}
                    </motion.p>
                    <p className="text-xs text-text-muted">EGP Spent</p>
                </div>
            </div>
        </div>
    );
};

// Premium Bar Chart with gradient bars
const BarChartVisual = ({ data, maxValue, period }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="h-52 flex items-end justify-between gap-2 px-2">
            {data.map((item, i) => {
                const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                const isHovered = hoveredIndex === i;

                return (
                    <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-2 group"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Value tooltip */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="bg-tertiary border border-accent-cyan/50 rounded-lg px-3 py-1.5 text-sm font-mono shadow-lg shadow-accent-cyan/20"
                                >
                                    {item.value.toLocaleString()} <span className="text-text-muted text-xs">EGP</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bar */}
                        <div className="w-full h-40 flex items-end relative">
                            <motion.div
                                className={`w-full rounded-t-lg relative overflow-hidden ${isHovered ? 'shadow-lg shadow-accent-cyan/30' : ''}`}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: i * 0.05, duration: 0.6, type: "spring" }}
                            >
                                {/* Gradient fill */}
                                <div className="absolute inset-0 bg-gradient-to-t from-accent-purple via-accent-cyan to-accent-cyan/50" />

                                {/* Shine effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                                />

                                {/* Top glow */}
                                <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 blur-sm" />
                            </motion.div>
                        </div>

                        {/* Label */}
                        <span className={`text-xs transition-colors ${isHovered ? 'text-accent-cyan font-semibold' : 'text-text-muted'}`}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// Card Selector Dropdown
const CardSelector = ({ cards, selectedCard, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = cards.find(c => c.number === selectedCard) || cards[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 bg-glass-bg border border-glass-border rounded-xl hover:border-accent-cyan/50 transition-all min-w-[220px]"
            >
                <div className="w-10 h-6 rounded bg-gradient-to-br from-accent-purple to-accent-cyan" />
                <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{selected?.cardName || 'Card'}</p>
                    <p className="text-xs text-text-muted">****{selected?.number?.slice(-4)}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-tertiary border border-glass-border rounded-xl overflow-hidden shadow-xl z-50"
                    >
                        {cards.map(card => (
                            <button
                                key={card.number}
                                onClick={() => { onSelect(card.number); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-glass-hover transition-colors ${selectedCard === card.number ? 'bg-accent-cyan/10' : ''}`}
                            >
                                <div className={`w-10 h-6 rounded ${selectedCard === card.number ? 'bg-gradient-to-br from-accent-cyan to-accent-purple' : 'bg-glass-border'}`} />
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium">{card.cardName}</p>
                                    <p className="text-xs text-text-muted">****{card.number.slice(-4)} • {card.balance.toLocaleString()} EGP</p>
                                </div>
                                {card.cardSettings?.isFrozen && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-status-error/20 text-status-error">Frozen</span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Analytics() {
    const [period, setPeriod] = useState('month');
    const [selectedCard, setSelectedCard] = useState(null);

    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    const activeAccount = selectedCard || accounts?.[0]?.number;

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics', period, activeAccount],
        queryFn: async () => {
            const res = await api.get(`/analytics?period=${period}&account=${activeAccount}`);
            return res.data;
        },
        enabled: !!activeAccount
    });

    const categoryData = analytics?.byCategory || [];
    const monthlyData = analytics?.monthly || [];
    const insights = analytics?.insights || {};

    const periodLabels = { week: 'This Week', month: 'This Month', year: 'This Year' };

    return (
        <div className="space-y-8">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-purple/20 via-secondary to-accent-cyan/20 border border-glass-border p-8">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-accent-purple/30 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent-cyan/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-accent-purple to-accent-cyan rounded-2xl shadow-lg">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-cyan to-accent-purple">
                                    Spending Analytics
                                </h1>
                                <p className="text-text-secondary flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                                    Smart insights for smarter spending
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Card Selector */}
                        {accounts && accounts.length > 1 && (
                            <CardSelector
                                cards={accounts}
                                selectedCard={selectedCard || accounts[0]?.number}
                                onSelect={setSelectedCard}
                            />
                        )}

                        {/* Period Selector with premium design */}
                        <div className="flex items-center bg-secondary/80 backdrop-blur-sm border border-glass-border rounded-2xl p-1.5">
                            {['week', 'month', 'year'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${period === p ? 'text-void' : 'text-text-muted hover:text-white'
                                        }`}
                                >
                                    {period === p && (
                                        <motion.div
                                            layoutId="periodBg"
                                            className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 capitalize">{p}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Spent', value: insights.totalSpent || 0, icon: ArrowUpRight, color: 'status-error', prefix: '-' },
                            { label: 'Total Income', value: insights.totalIncome || 0, icon: ArrowDownLeft, color: 'status-success', prefix: '+' },
                            { label: 'Daily Average', value: insights.avgDaily || 0, icon: Calendar, color: 'accent-cyan', prefix: '' },
                            { label: 'vs Last Period', value: Math.abs(insights.trend || 0), icon: insights.trend > 0 ? TrendingUp : TrendingDown, color: insights.trend > 0 ? 'status-error' : 'status-success', prefix: insights.trend > 0 ? '+' : '-', suffix: '%' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <GlassCard className={`bg-gradient-to-br from-${stat.color}/10 to-transparent border-${stat.color}/30 hover:scale-[1.02] transition-transform`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}>
                                            <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-text-muted">{stat.label}</p>
                                            <p className={`text-xl font-bold text-${stat.color}`}>
                                                {stat.prefix}{stat.value.toLocaleString()}{stat.suffix || ' EGP'}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <GlassCard className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-purple/20 to-transparent rounded-full blur-2xl" />

                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10">
                                <PieChart className="w-5 h-5 text-accent-purple" />
                                Spending by Category
                                <span className="ml-auto text-sm text-text-muted font-normal">{periodLabels[period]}</span>
                            </h3>

                            {categoryData.length === 0 ? (
                                <div className="text-center py-16 text-text-muted">
                                    <PieChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="font-medium">No spending data for {periodLabels[period].toLowerCase()}</p>
                                    <p className="text-sm">Start making transactions to see insights</p>
                                </div>
                            ) : (
                                <div className="flex flex-col lg:flex-row items-center gap-8">
                                    <PieChartVisual data={categoryData.map(c => ({
                                        value: c.amount,
                                        color: CATEGORY_COLORS[c.category]?.color || '#6b7280'
                                    }))} />

                                    <div className="flex-1 space-y-2">
                                        {categoryData.slice(0, 5).map((cat, i) => {
                                            const catInfo = CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.other;
                                            const total = categoryData.reduce((s, c) => s + c.amount, 0);
                                            const percent = Math.round((cat.amount / total) * 100);

                                            return (
                                                <motion.div
                                                    key={cat.category}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.05 }}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-glass-hover transition-colors group"
                                                >
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${catInfo.gradient} flex items-center justify-center text-lg shadow-lg`}>
                                                        {catInfo.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm font-medium">{catInfo.label}</span>
                                                            <span className="font-mono text-sm font-bold">{cat.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-glass-border rounded-full overflow-hidden">
                                                            <motion.div
                                                                className={`h-full bg-gradient-to-r ${catInfo.gradient}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percent}%` }}
                                                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-text-muted font-mono">{percent}%</span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </GlassCard>

                        {/* Bar Chart */}
                        <GlassCard className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-cyan/20 to-transparent rounded-full blur-2xl" />

                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10">
                                <BarChart3 className="w-5 h-5 text-accent-cyan" />
                                {period === 'week' ? 'Daily' : period === 'month' ? 'Weekly' : 'Monthly'} Trend
                                <span className="ml-auto text-sm text-text-muted font-normal">{periodLabels[period]}</span>
                            </h3>

                            {monthlyData.length === 0 ? (
                                <div className="text-center py-16 text-text-muted">
                                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="font-medium">Not enough data for trends</p>
                                </div>
                            ) : (
                                <BarChartVisual
                                    data={monthlyData}
                                    maxValue={Math.max(...monthlyData.map(m => m.value))}
                                    period={period}
                                />
                            )}
                        </GlassCard>
                    </div>

                    {/* Smart Insights */}
                    <GlassCard className="relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-accent-pink/30 to-transparent rounded-full blur-3xl" />

                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10">
                            <Zap className="w-5 h-5 text-accent-pink" />
                            Smart Insights
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent-pink/20 text-accent-pink border border-accent-pink/30">
                                AI Powered
                            </span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                            {(insights.tips || []).map((tip, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="p-5 rounded-2xl bg-gradient-to-br from-glass-bg to-transparent border border-glass-border hover:border-accent-cyan/30 transition-all group"
                                >
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{tip.icon}</div>
                                    <p className="text-sm text-text-secondary leading-relaxed">{tip.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </>
            )}
        </div>
    );
}
