import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, Share2, Copy, Check, Download, X, ArrowRight } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';

// Simple QR Code Generator (SVG-based)
const QRCodeDisplay = ({ value, size = 200 }) => {
    // Simple pattern generation for demo - in production use a library like qrcode.react
    const generatePattern = (str) => {
        const pattern = [];
        const gridSize = 25;
        for (let i = 0; i < gridSize * gridSize; i++) {
            const hash = (str.charCodeAt(i % str.length) * (i + 1)) % 100;
            pattern.push(hash > 40);
        }
        return pattern;
    };

    const pattern = generatePattern(value);
    const cellSize = size / 25;

    return (
        <svg width={size} height={size} className="mx-auto">
            <rect width={size} height={size} fill="white" rx="12" />
            {pattern.map((filled, i) => {
                if (!filled) return null;
                const x = (i % 25) * cellSize;
                const y = Math.floor(i / 25) * cellSize;
                return (
                    <rect
                        key={i}
                        x={x}
                        y={y}
                        width={cellSize}
                        height={cellSize}
                        fill="#000"
                    />
                );
            })}
            {/* Corner markers */}
            {[0, 18, 0].map((offsetX, idx) => {
                const offsetY = idx === 2 ? 18 : 0;
                if (idx === 1) return null;
                return (
                    <g key={idx}>
                        <rect x={offsetX * cellSize} y={offsetY * cellSize} width={7 * cellSize} height={7 * cellSize} fill="#000" />
                        <rect x={(offsetX + 1) * cellSize} y={(offsetY + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
                        <rect x={(offsetX + 2) * cellSize} y={(offsetY + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#000" />
                    </g>
                );
            })}
            <g>
                <rect x={18 * cellSize} y={0} width={7 * cellSize} height={7 * cellSize} fill="#000" />
                <rect x={19 * cellSize} y={1 * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
                <rect x={20 * cellSize} y={2 * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#000" />
            </g>
        </svg>
    );
};

export default function QRPayments() {
    const [activeTab, setActiveTab] = useState('receive'); // receive | scan
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [copied, setCopied] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    const accountNumber = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).accountNumber || '12345678901234'
        : '12345678901234';

    const paymentLink = `sobs://pay/${accountNumber}${amount ? `?amount=${amount}` : ''}${note ? `&note=${encodeURIComponent(note)}` : ''}`;
    const qrValue = paymentLink;

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Pay Me',
                    text: amount ? `Pay me ${amount} EGP` : 'Send me money',
                    url: paymentLink,
                });
            } catch (e) {
                console.log('Share cancelled');
            }
        } else {
            handleCopy();
        }
    };

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setScanResult({
                accountNumber: '9876543210123456',
                name: 'Mohamed Ali',
                amount: 500,
            });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-lg shadow-purple-500/20">
                        <QrCode className="w-7 h-7 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                        QR Payments
                    </span>
                </h1>
                <p className="text-text-secondary mt-2 ml-16">Send and receive money instantly with QR codes</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-glass-bg border border-glass-border rounded-xl p-1 max-w-md">
                {[
                    { id: 'receive', label: 'Receive Money', icon: QrCode },
                    { id: 'scan', label: 'Scan to Pay', icon: Camera },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setScanResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-accent-cyan text-void' : 'text-text-muted hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'receive' ? (
                    <motion.div
                        key="receive"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* QR Code Display */}
                        <GlassCard className="text-center">
                            <h3 className="text-lg font-semibold mb-6">Your Payment QR Code</h3>

                            <div className="p-6 bg-white rounded-2xl inline-block mb-6 shadow-xl">
                                <QRCodeDisplay value={qrValue} size={220} />
                            </div>

                            <p className="text-text-muted text-sm mb-4">
                                Scan this code to send money to your account
                            </p>

                            {amount && (
                                <div className="inline-block px-4 py-2 rounded-full bg-accent-cyan/20 text-accent-cyan font-bold mb-4">
                                    Request: {parseFloat(amount).toLocaleString()} EGP
                                </div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <NeonButton variant="secondary" onClick={handleCopy}>
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </NeonButton>
                                <NeonButton onClick={handleShare}>
                                    <Share2 className="w-4 h-4" /> Share
                                </NeonButton>
                            </div>
                        </GlassCard>

                        {/* Customize Payment */}
                        <GlassCard>
                            <h3 className="text-lg font-semibold mb-6">Customize Request</h3>

                            <div className="space-y-4">
                                <GlowInput
                                    label="Request Amount (Optional)"
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />

                                <div className="grid grid-cols-4 gap-2">
                                    {[100, 500, 1000, 5000].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val.toString())}
                                            className={`py-2 rounded-lg border text-sm transition-all ${amount === val.toString()
                                                    ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                                                    : 'bg-glass-bg border-glass-border hover:bg-glass-hover'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>

                                <GlowInput
                                    label="Note (Optional)"
                                    placeholder="e.g., For dinner"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />

                                <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                                    <p className="text-xs text-text-muted mb-2">Payment Link</p>
                                    <p className="text-sm font-mono text-accent-cyan break-all">{paymentLink}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="scan"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <GlassCard className="max-w-lg mx-auto">
                            {scanResult ? (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-status-success" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">QR Code Scanned!</h3>

                                    <div className="p-4 rounded-xl bg-glass-bg border border-glass-border text-left my-6">
                                        <div className="flex justify-between py-2 border-b border-glass-border">
                                            <span className="text-text-muted">Recipient</span>
                                            <span className="font-semibold">{scanResult.name}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-glass-border">
                                            <span className="text-text-muted">Account</span>
                                            <span className="font-mono">{scanResult.accountNumber}</span>
                                        </div>
                                        {scanResult.amount && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-text-muted">Amount</span>
                                                <span className="text-accent-cyan font-bold">{scanResult.amount} EGP</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <NeonButton variant="secondary" onClick={() => setScanResult(null)} className="flex-1">
                                            Scan Again
                                        </NeonButton>
                                        <NeonButton className="flex-1">
                                            Pay Now <ArrowRight className="w-4 h-4" />
                                        </NeonButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-6">Scan QR Code</h3>

                                    {/* Camera Placeholder */}
                                    <div className="relative aspect-square max-w-sm mx-auto mb-6 rounded-2xl overflow-hidden bg-black/50 border-2 border-dashed border-glass-border">
                                        {scanning ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative">
                                                    <div className="w-48 h-48 border-2 border-accent-cyan rounded-lg animate-pulse" />
                                                    <motion.div
                                                        className="absolute left-0 right-0 h-0.5 bg-accent-cyan"
                                                        initial={{ top: 0 }}
                                                        animate={{ top: '100%' }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                                                <Camera className="w-16 h-16 mb-4 opacity-50" />
                                                <p>Camera preview</p>
                                                <p className="text-sm">(Click button to simulate scan)</p>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-text-secondary text-sm mb-6">
                                        Point your camera at a QR code to scan
                                    </p>

                                    <NeonButton onClick={simulateScan} loading={scanning} className="w-full">
                                        <Camera className="w-5 h-5" />
                                        {scanning ? 'Scanning...' : 'Simulate Scan'}
                                    </NeonButton>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
