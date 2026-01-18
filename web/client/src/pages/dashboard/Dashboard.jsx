import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api';

// Get time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
};

// SWISS GRID - Circle Arrow Button
const CircleArrowButton = ({ children, onClick, variant = 'primary', to }) => {
    const Button = to ? Link : 'button';
    return (
        <Button
            to={to}
            onClick={onClick}
            className={`circle-arrow-btn ${variant === 'secondary' ? 'bg-white dark:bg-black border-black dark:border-white text-black dark:text-white hover:bg-accent-primary hover:border-accent-primary dark:hover:bg-accent-primary dark:hover:border-accent-primary hover:text-white dark:hover:text-white' : ''}`}
        >
            {children}
        </Button>
    );
};

// GRID CARD - Sharp borders, no rounded corners
const GridCard = ({ children, className = '', border = true }) => (
    <div className={`bg-white dark:bg-void ${border ? 'border-2 border-grid-border-light dark:border-grid-border-light' : ''} p-6 ${className}`}>
        {children}
    </div>
);

// Transaction Item - Grid Style
const TransactionItem = ({ tx, index }) => {
    const isCredit = tx.type === 'credit';

    const getCategoryInitial = (category) => {
        const map = {
            deposit: 'D',
            transfer: 'T',
            bill: 'B',
            shopping: 'S',
            food: 'F',
            savings: '$',
        };
        return map[category] || 'T';
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const txDate = new Date(date);
        const diffDays = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'TODAY';
        if (diffDays === 1) return 'YESTERDAY';
        return txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-12 gap-4 border-t border-grid-border-light dark:border-grid-border-light py-4 hover:bg-secondary dark:hover:bg-secondary transition-colors"
        >
            {/* Icon/Initial */}
            <div className="col-span-2 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">
                    {isCredit ? '↓' : getCategoryInitial(tx.category)}
                </div>
            </div>

            {/* Details */}
            <div className="col-span-6 flex flex-col justify-center">
                <p className="font-bold text-sm uppercase tracking-wide truncate">{tx.description}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{getRelativeTime(tx.date)} • {tx.category || 'TRANSACTION'}</p>
            </div>

            {/* Amount */}
            <div className="col-span-4 flex items-center justify-end">
                <div className="text-right">
                    <p className={`font-mono font-bold text-lg ${isCredit ? 'text-status-success' : 'text-black dark:text-white'}`}>
                        {isCredit ? '+' : '-'}{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-muted font-mono">EGP</p>
                </div>
            </div>
        </motion.div>
    );
};

// Quick Action Card - Grid Style
const QuickActionCard = ({ label, sublabel, to }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-black dark:border-white p-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-bold uppercase text-sm tracking-wide mb-1">{label}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">{sublabel}</p>
                </div>
                <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl font-bold"
                >
                    →
                </motion.div>
            </div>
        </motion.div>
    </Link>
);

// Stat Card - Minimal grid
const StatCard = ({ label, value, suffix, trend }) => (
    <GridCard className="relative overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">{label}</p>
        <p className="mono-number text-4xl font-bold mb-1">
            {value.toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted uppercase">{suffix}</span>
            {trend && (
                <span className={`text-[10px] font-bold ${trend > 0 ? 'text-status-success' : 'text-status-error'}`}>
                    {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
                </span>
            )}
        </div>
    </GridCard>
);

export default function Dashboard() {
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const { theme, toggleTheme } = useTheme();

    const { data: accounts, isLoading: accountsLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    const selectedCard = accounts?.[selectedCardIndex];

    const { data: txnData, isLoading: txnLoading } = useQuery({
        queryKey: ['transactions', selectedCard?.number],
        queryFn: async () => {
            if (!selectedCard) return { transactions: [] };
            const res = await api.get(`/accounts/${selectedCard.number}/transactions`);
            return res.data;
        },
        enabled: !!selectedCard
    });

    const transactions = txnData?.transactions?.slice(0, 6) || [];
    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

    return (
        <div className="space-y-0">
            {/* HERO SECTION - MASSIVE BALANCE DISPLAY */}
            <GridCard border={false} className="!p-12 border-b-2 border-grid-border-light dark:border-grid-border-light">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    {/* Left: Greeting + Massive Balance */}
                    <div className="lg:col-span-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2">
                            {getGreeting()}
                        </p>

                        {/* HUGE BALANCE - SWISS GRID SIGNATURE */}
                        <div className="mb-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary mb-1">TOTAL BALANCE</p>
                            {accountsLoading ? (
                                <div className="h-32 bg-secondary dark:bg-secondary animate-pulse"></div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h1 className="display-huge mono-number">
                                        {totalBalance.toLocaleString()}
                                    </h1>
                                    <p className="text-2xl font-bold uppercase tracking-widest text-text-muted mt-2 font-mono">EGP</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Marquee text */}
                        <div className="border-t border-b border-grid-border-light dark:border-grid-border-light py-3 overflow-hidden">
                            <div className="flex whitespace-nowrap">
                                <motion.div
                                    animate={{ x: [0, -1000] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted"
                                >
                                    SECURE • FAST • RELIABLE • PREMIUM BANKING • SWISS PRECISION • SECURE • FAST • RELIABLE • PREMIUM BANKING • SWISS PRECISION •&nbsp;
                                </motion.div>
                                <motion.div
                                    animate={{ x: [0, -1000] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted"
                                >
                                    SECURE • FAST • RELIABLE • PREMIUM BANKING • SWISS PRECISION • SECURE • FAST • RELIABLE • PREMIUM BANKING • SWISS PRECISION •&nbsp;
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:col-span-4 flex gap-4 items-center justify-end">
                        <CircleArrowButton to="/transfer">
                            →
                        </CircleArrowButton>
                        <CircleArrowButton variant="secondary" onClick={toggleTheme}>
                            {theme === 'dark' ? '☀' : '🌙'}
                        </CircleArrowButton>
                    </div>
                </div>
            </GridCard>

            {/* QUICK ACTIONS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
                <div className="border-r border-b border-grid-border-light dark:border-grid-border-light">
                    <QuickActionCard
                        label="Send Money"
                        sublabel="Transfer Funds"
                        to="/transfer"
                    />
                </div>
                <div className="border-r border-b border-grid-border-light dark:border-grid-border-light lg:border-r">
                    <QuickActionCard
                        label="Pay Bills"
                        sublabel="Utilities"
                        to="/bills"
                    />
                </div>
                <div className="border-r border-b border-grid-border-light dark:border-grid-border-light">
                    <QuickActionCard
                        label="Savings"
                        sublabel="Track Goals"
                        to="/savings"
                    />
                </div>
                <div className="border-b border-grid-border-light dark:border-grid-border-light">
                    <QuickActionCard
                        label="Analytics"
                        sublabel="Insights"
                        to="/analytics"
                    />
                </div>
            </div>

            {/* STATS ROW - GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="border-r border-b border-grid-border-light dark:border-grid-border-light">
                    <StatCard
                        label="Current Balance"
                        value={totalBalance}
                        suffix="EGP"
                    />
                </div>
                <div className="border-r border-b border-grid-border-light dark:border-grid-border-light md:border-r">
                    <StatCard
                        label="Monthly Income"
                        value={15000}
                        suffix="EGP"
                        trend={12}
                    />
                </div>
                <div className="border-b border-grid-border-light dark:border-grid-border-light">
                    <StatCard
                        label="Monthly Spending"
                        value={8500}
                        suffix="EGP"
                        trend={-5}
                    />
                </div>
            </div>

            {/* RECENT TRANSACTIONS - GRID TABLE */}
            <GridCard border={false} className="!p-0 border-b-2 border-grid-border-light dark:border-grid-border-light">
                <div className="border-b-2 border-grid-border-light dark:border-grid-border-light p-6 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Recent Activity</h2>
                    <Link to="/transactions" className="text-[10px] font-bold uppercase tracking-wider hover:text-accent-primary transition-colors">
                        View All →
                    </Link>
                </div>

                <div className="p-6">
                    {txnLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-secondary dark:bg-secondary animate-pulse"></div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-grid-border-light dark:border-grid-border-light">
                            <p className="text-4xl mb-4">—</p>
                            <p className="font-bold uppercase text-sm tracking-wider">No Transactions</p>
                            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Make your first transfer</p>
                        </div>
                    ) : (
                        <div>
                            {transactions.map((tx, i) => (
                                <TransactionItem key={tx.id} tx={tx} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </GridCard>

            {/* CARD SELECTOR - GRID */}
            {accounts?.length > 0 && (
                <GridCard border={false} className="border-b-2 border-grid-border-light dark:border-grid-border-light">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Your Accounts</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accounts.map((acc, i) => (
                            <motion.button
                                key={acc.number}
                                onClick={() => setSelectedCardIndex(i)}
                                whileHover={{ y: -2 }}
                                className={`text-left p-4 border-2 transition-all ${
                                    selectedCardIndex === i
                                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                        : 'border-grid-border-light dark:border-grid-border-light hover:border-black dark:hover:border-white'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{acc.type} Account</p>
                                    <p className="text-xs font-mono">****{acc.number.slice(-4)}</p>
                                </div>
                                <p className="text-2xl font-mono font-bold">
                                    {acc.balance.toLocaleString()} <span className="text-sm font-normal">EGP</span>
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </GridCard>
            )}
        </div>
    );
}
