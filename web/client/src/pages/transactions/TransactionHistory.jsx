import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Calendar, ChevronDown, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import Skeleton from '../../components/common/Skeleton';
import api from '../../api';

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'transfer', label: 'Transfers' },
    { id: 'deposit', label: 'Deposits' },
    { id: 'bill', label: 'Bills' },
    { id: 'shopping', label: 'Shopping' },
];

const TransactionRow = ({ tx, onDownload }) => {
    const isCredit = tx.type === 'credit';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-glass-bg hover:bg-glass-hover border border-glass-border transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${isCredit ? 'bg-status-success/20' : 'bg-status-error/20'
                    } flex items-center justify-center`}>
                    {isCredit ? (
                        <ArrowDownLeft className="w-6 h-6 text-status-success" />
                    ) : (
                        <ArrowUpRight className="w-6 h-6 text-status-error" />
                    )}
                </div>
                <div>
                    <p className="font-medium text-white">{tx.description}</p>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-text-muted" />
                        <span className="capitalize">{tx.category}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className={`font-mono font-bold text-lg ${isCredit ? 'text-status-success' : 'text-status-error'
                        }`}>
                        {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} EGP
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-status-success/20 text-status-success' :
                            tx.status === 'pending' ? 'bg-status-warning/20 text-status-warning' :
                                'bg-status-error/20 text-status-error'
                        }`}>
                        {tx.status}
                    </span>
                </div>
                <button
                    onClick={() => onDownload(tx)}
                    className="p-2 rounded-lg bg-glass-bg border border-glass-border opacity-0 group-hover:opacity-100 hover:bg-glass-hover transition-all"
                    title="Download Receipt"
                >
                    <Download className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default function TransactionHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [showFilters, setShowFilters] = useState(false);

    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const res = await api.get('/accounts');
            return res.data || [];
        }
    });

    const primaryAccount = accounts?.[0];

    const { data: txnData, isLoading } = useQuery({
        queryKey: ['transactions', primaryAccount?.number],
        queryFn: async () => {
            if (!primaryAccount) return { transactions: [] };
            const res = await api.get(`/accounts/${primaryAccount.number}/transactions`);
            return res.data;
        },
        enabled: !!primaryAccount
    });

    const allTransactions = txnData?.transactions || [];

    // Filter transactions
    let filteredTx = allTransactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category === 'all' || tx.category === category;
        const txDate = new Date(tx.date);
        const matchesDateFrom = !dateRange.from || txDate >= new Date(dateRange.from);
        const matchesDateTo = !dateRange.to || txDate <= new Date(dateRange.to);
        return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });

    const handleDownloadReceipt = (tx) => {
        // Create a simple receipt text
        const receipt = `
=====================================
        SOBS TRANSACTION RECEIPT
=====================================

Transaction ID: ${tx.id}
Date: ${new Date(tx.date).toLocaleString()}

Description: ${tx.description}
Category: ${tx.category}
Type: ${tx.type === 'credit' ? 'Received' : 'Sent'}

Amount: ${tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()} EGP
Status: ${tx.status}

=====================================
     Thank you for using SOBS
=====================================
        `;

        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${tx.id}.txt`;
        a.click();
    };

    const handleExportAll = () => {
        const csv = [
            ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'].join(','),
            ...filteredTx.map(tx => [
                new Date(tx.date).toLocaleDateString(),
                `"${tx.description}"`,
                tx.category,
                tx.type,
                tx.amount,
                tx.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
    };

    const totalIncome = filteredTx.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = filteredTx.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg shadow-red-500/20">
                            <Receipt className="w-7 h-7 text-white" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                            Transaction History
                        </span>
                    </h1>
                    <p className="text-text-secondary mt-2 ml-16">View and export your transaction records</p>
                </div>
                <NeonButton onClick={handleExportAll} variant="secondary">
                    <Download className="w-5 h-5" /> Export CSV
                </NeonButton>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="bg-gradient-to-br from-accent-cyan/10 to-transparent border-accent-cyan/30">
                    <p className="text-sm text-text-muted mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold text-accent-cyan">{filteredTx.length}</p>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-status-success/10 to-transparent border-status-success/30">
                    <p className="text-sm text-text-muted mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-status-success">+{totalIncome.toLocaleString()} EGP</p>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-status-error/10 to-transparent border-status-error/30">
                    <p className="text-sm text-text-muted mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-status-error">-{totalExpenses.toLocaleString()} EGP</p>
                </GlassCard>
            </div>

            {/* Search and Filters */}
            <GlassCard>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full bg-glass-bg border border-glass-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent-cyan transition-colors"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl border text-sm transition-all ${category === cat.id
                                        ? 'bg-accent-cyan text-void border-accent-cyan'
                                        : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${showFilters ? 'bg-accent-purple text-void border-accent-purple' : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide Filters' : 'More Filters'}
                        </button>
                    </div>
                </div>

                {/* Date Filters */}
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="flex gap-4 mt-4 pt-4 border-t border-glass-border"
                    >
                        <div>
                            <label className="text-sm text-text-muted block mb-1">From</label>
                            <input
                                type="date"
                                className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan"
                                value={dateRange.from}
                                onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-text-muted block mb-1">To</label>
                            <input
                                type="date"
                                className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan"
                                value={dateRange.to}
                                onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                            />
                        </div>
                        {(dateRange.from || dateRange.to) && (
                            <button
                                onClick={() => setDateRange({ from: '', to: '' })}
                                className="self-end px-3 py-2 text-sm text-accent-cyan hover:underline"
                            >
                                Clear dates
                            </button>
                        )}
                    </motion.div>
                )}
            </GlassCard>

            {/* Transactions List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
                </div>
            ) : filteredTx.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <Receipt className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
                    <p className="text-text-muted">
                        {searchQuery || category !== 'all' || dateRange.from || dateRange.to
                            ? 'Try adjusting your filters'
                            : 'Make your first transaction to see it here'}
                    </p>
                </GlassCard>
            ) : (
                <div className="space-y-3">
                    {filteredTx.map((tx, i) => (
                        <TransactionRow key={tx.id || i} tx={tx} onDownload={handleDownloadReceipt} />
                    ))}
                </div>
            )}
        </div>
    );
}
