import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle, MessageCircle, Send, ChevronRight, ChevronDown, Search, BookOpen,
    Phone, Mail, X, Bot, User, Sparkles, Headphones, Clock, Star, ExternalLink,
    CreditCard, PiggyBank, Lock, Zap
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';

const FAQ_CATEGORIES = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'transfers', label: 'Transfers', icon: Send },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Lock },
];

const FAQ_ITEMS = [
    { q: 'How do I transfer money?', a: 'Go to Dashboard → Transfer, enter the recipient\'s account number and amount, then verify with OTP.', category: 'transfers' },
    { q: 'How do I add money to my account?', a: 'Click the "Add" button on your dashboard, enter your card details, specify the amount, and verify with OTP.', category: 'account' },
    { q: 'What are Savings Goals?', a: 'Savings Goals let you set aside money for specific purposes like vacations, emergencies, or big purchases. Track your progress visually!', category: 'account' },
    { q: 'How do I freeze my card?', a: 'Go to Card Controls and toggle the freeze switch. Your card will be immediately blocked from all transactions.', category: 'cards' },
    { q: 'Is my money safe?', a: 'Yes! We use bank-grade encryption, 2-factor authentication, and your data is protected with 256-bit SSL.', category: 'security' },
    { q: 'How do I pay bills?', a: 'Go to Bill Payments, select a category (Electricity, Water, etc.), choose your provider, and complete the payment.', category: 'transfers' },
    { q: 'What are beneficiaries?', a: 'Beneficiaries are saved recipients for quick transfers. Add someone once and send money to them with just one tap!', category: 'transfers' },
    { q: 'How do I view my PIN?', a: 'Go to Card Controls → View PIN. You\'ll need to verify with OTP for security. Never share your PIN with anyone.', category: 'cards' },
];

const ChatMessage = ({ message, isBot }) => (
    <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${isBot ? 'bg-gradient-to-br from-accent-cyan to-accent-purple' : 'bg-gradient-to-br from-accent-pink to-accent-purple'
            }`}>
            {isBot ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
        </div>
        <div className={`max-w-[75%] p-4 rounded-2xl ${isBot
                ? 'bg-glass-bg border border-glass-border rounded-tl-sm'
                : 'bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 rounded-tr-sm'
            }`}>
            <p className="text-sm leading-relaxed">{message}</p>
        </div>
    </motion.div>
);

const ChatBot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { text: 'Hi! 👋 I\'m SOBS Assistant. How can I help you today?', isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getBotResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();

        if (msg.includes('transfer') || msg.includes('send money')) {
            return 'To transfer money, go to Dashboard → Transfer. Enter the recipient\'s account number, specify the amount, and verify with OTP. 💸';
        }
        if (msg.includes('add money') || msg.includes('deposit')) {
            return 'Click the "Add" button on your dashboard, enter your card details, choose an amount, and verify with OTP to add money. 💰';
        }
        if (msg.includes('bill') || msg.includes('payment')) {
            return 'Go to Bill Payments from the menu. Select a category like Electricity or Internet, choose your provider, and complete the payment. ⚡';
        }
        if (msg.includes('freeze') || msg.includes('block card')) {
            return 'You can freeze your card instantly in Card Controls. Just toggle the freeze switch and all transactions will be blocked. ❄️';
        }
        if (msg.includes('pin')) {
            return 'To view your PIN, go to Card Controls → View PIN. You\'ll need to verify with OTP for security. 🔐';
        }
        if (msg.includes('safe') || msg.includes('secure')) {
            return 'Your money is protected by bank-grade encryption, 2FA, and 256-bit SSL. We take security very seriously! 🛡️';
        }
        if (msg.includes('hello') || msg.includes('hi')) {
            return 'Hello! 👋 How can I assist you with your banking needs today?';
        }
        if (msg.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with? 😊';
        }

        return 'I\'m not sure about that. You can find more information in our FAQ section, or contact our support team for assistance. 📞';
    };

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { text: input, isBot: false }]);
        const userMessage = input;
        setInput('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const response = getBotResponse(userMessage);
            setMessages(prev => [...prev, { text: response, isBot: true }]);
            setIsTyping(false);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] h-[550px] bg-gradient-to-b from-tertiary to-secondary border border-glass-border rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="p-5 border-b border-glass-border bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-lg shadow-accent-purple/30">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">SOBS Assistant</h4>
                            <p className="text-xs text-status-success flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" /> Online
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-glass-hover rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg.text} isBot={msg.isBot} />
                ))}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-glass-bg border border-glass-border rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-accent-cyan" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-2 h-2 rounded-full bg-accent-cyan" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-accent-cyan" />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {['Transfer money', 'Freeze card', 'View PIN'].map(q => (
                    <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full bg-glass-bg border border-glass-border hover:border-accent-cyan/50 transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-glass-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-glass-bg border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-cyan transition-colors"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                    />
                    <NeonButton onClick={handleSend} className="px-4">
                        <Send className="w-4 h-4" />
                    </NeonButton>
                </div>
            </div>
        </motion.div>
    );
};

export default function Support() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredFaq = FAQ_ITEMS.filter(item =>
        (item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedCategory || item.category === selectedCategory)
    );

    return (
        <div className="space-y-8">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 via-secondary to-teal-500/20 border border-glass-border p-8">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/30 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500/30 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                </div>

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                    >
                        <HelpCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-3">How can we help you?</h1>
                    <p className="text-text-secondary flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Search our FAQ or chat with our AI assistant
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search for help..."
                        className="w-full bg-glass-bg border border-glass-border rounded-2xl pl-14 pr-6 py-5 text-lg focus:outline-none focus:border-accent-cyan transition-colors"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent-cyan/50 transition-all text-center group"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">User Guide</h3>
                    <p className="text-sm text-text-muted">Learn how to use SOBS</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowChat(true)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 border border-accent-purple/30 hover:border-accent-purple/50 transition-all text-center group"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Chat with AI</h3>
                    <p className="text-sm text-text-muted">Get instant answers</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent-cyan/50 transition-all text-center group"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                        <Headphones className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Live Support</h3>
                    <p className="text-sm text-text-muted">Talk to a human</p>
                </motion.button>
            </div>

            {/* FAQ Category Filters */}
            <div className="flex justify-center gap-3">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-accent-cyan text-void' : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                        }`}
                >
                    All
                </button>
                {FAQ_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-accent-cyan text-void' : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                            }`}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto space-y-3">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent-cyan" /> Frequently Asked Questions
                </h2>

                {filteredFaq.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <button
                            onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                            className={`w-full p-5 rounded-2xl text-left transition-all ${expandedFaq === i
                                    ? 'bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/30'
                                    : 'bg-glass-bg border border-glass-border hover:border-accent-cyan/30'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium pr-4">{item.q}</h4>
                                <ChevronDown className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                            </div>
                            <AnimatePresence>
                                {expandedFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-text-secondary text-sm mt-4 pt-4 border-t border-glass-border leading-relaxed">
                                            {item.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Contact Card */}
            <GlassCard className="max-w-3xl mx-auto">
                <h3 className="text-xl font-bold mb-6">Still need help?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-accent-cyan/10 to-transparent border border-accent-cyan/30 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <Phone className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Call Us</p>
                            <p className="text-sm text-accent-cyan">1-800-SOBS-HELP</p>
                            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 24/7 Available
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-transparent border border-accent-purple/30 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Mail className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Email Us</p>
                            <p className="text-sm text-accent-purple">support@sobs-bank.com</p>
                            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Response within 24h
                            </p>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Floating Chat Button */}
            <motion.button
                onClick={() => setShowChat(!showChat)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple shadow-lg shadow-accent-purple/30 flex items-center justify-center z-40"
            >
                {showChat ? <X className="w-7 h-7 text-white" /> : <MessageCircle className="w-7 h-7 text-white" />}
            </motion.button>

            {/* Chat Bot */}
            <AnimatePresence>
                {showChat && <ChatBot isOpen={showChat} onClose={() => setShowChat(false)} />}
            </AnimatePresence>
        </div>
    );
}
