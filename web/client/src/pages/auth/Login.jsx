import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/common/GlassCard';
import GlowInput from '../../components/common/GlowInput';
import NeonButton from '../../components/common/NeonButton';
import api from '../../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [debugOtp, setDebugOtp] = useState('');

    const [step, setStep] = useState('credentials');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sessionId, setSessionId] = useState(null);

    const navigate = useNavigate();

    // Validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid = isEmailValid && password.length >= 8;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Please enter a valid email and password (8+ characters)');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.success) {
                if (res.data.requiresOTP) {
                    setSessionId(res.data.sessionId);
                    if (res.data.debugOtp) {
                        setDebugOtp(res.data.debugOtp);
                    }
                    setStep('otp');
                } else {
                    localStorage.setItem('sessionToken', res.data.sessionToken);
                    navigate('/dashboard');
                }
            } else {
                setError(res.message || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Check your credentials.');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/verify-otp', { sessionId, otp });
            if (res.success) {
                localStorage.setItem('sessionToken', res.data.sessionToken);
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/dashboard');
            } else {
                setError(res.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(err.message || 'OTP Verification failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-purple/20 via-void to-accent-cyan/20 relative overflow-hidden flex-col justify-center px-16">
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[100px]"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 15, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-[100px]"
                        animate={{ scale: [1.2, 1, 1.2] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-12"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shadow-2xl shadow-accent-purple/30 text-white text-2xl font-bold">
                            ◆
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">SOBS</h2>
                            <p className="text-text-muted text-sm">Premium Banking</p>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-bold text-white leading-tight mb-6"
                    >
                        Your money,<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-purple">
                            simplified.
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                            <p className="text-lg font-semibold text-white">50,000+ users</p>
                            <p className="text-text-muted text-sm">trust SOBS for their banking</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                            <p className="text-lg font-semibold text-white">Bank-grade security</p>
                            <p className="text-text-muted text-sm">2FA and encrypted transactions</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 lg:hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none" />
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan shadow-lg mb-4 text-white text-xl font-bold">
                            ◆
                        </div>
                        <h2 className="text-2xl font-bold text-white">SOBS</h2>
                    </div>

                    <GlassCard className="border-accent-purple/20">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                                Welcome back
                            </h1>
                            <p className="text-text-secondary mt-2">Sign in to your account</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 'credentials' ? (
                                <motion.form
                                    key="credentials"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleLogin}
                                    className="space-y-6"
                                >
                                    <GlowInput
                                        id="email"
                                        type="email"
                                        label="Email Address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        error={email && !isEmailValid ? 'Invalid email format' : ''}
                                    />
                                    <GlowInput
                                        id="password"
                                        type="password"
                                        label="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        error={password && password.length < 8 ? 'Min 8 characters' : ''}
                                    />

                                    <div className="text-right">
                                        <button type="button" className="text-sm text-accent-cyan hover:underline">
                                            Forgot password?
                                        </button>
                                    </div>

                                    {error && <div className="p-3 rounded-lg bg-status-error/10 text-status-error text-sm text-center border border-status-error/20">{error}</div>}

                                    <NeonButton type="submit" className="w-full" loading={loading} disabled={loading}>
                                        Sign In →
                                    </NeonButton>

                                    <div className="text-center text-sm text-text-muted">
                                        Don't have an account? <Link to="/register" className="text-accent-cyan hover:underline">Create one →</Link>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleVerifyOtp}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                            🔐
                                        </div>
                                        <p className="text-text-secondary text-sm">
                                            {debugOtp ? 'Enter the code below to verify' : 'We sent a verification code to your phone.'}
                                        </p>
                                    </div>

                                    {debugOtp && (
                                        <div className="text-center p-4 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30">
                                            <span className="text-text-muted text-sm">Demo OTP:</span>
                                            <div className="text-3xl font-mono font-bold text-accent-cyan mt-1 tracking-widest animate-pulse">
                                                {debugOtp}
                                            </div>
                                        </div>
                                    )}

                                    <GlowInput
                                        id="otp"
                                        type="text"
                                        label="Enter OTP Code"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="text-center tracking-[0.5em] text-2xl font-mono"
                                        maxLength={6}
                                        autoFocus
                                    />

                                    {error && <div className="p-3 rounded-lg bg-status-error/10 text-status-error text-sm text-center border border-status-error/20">{error}</div>}

                                    <NeonButton type="submit" className="w-full" loading={loading} disabled={loading || otp.length !== 6}>
                                        Verify Identity
                                    </NeonButton>

                                    <button
                                        type="button"
                                        onClick={() => { setStep('credentials'); setError(''); setOtp(''); }}
                                        className="w-full text-sm text-text-muted hover:text-white transition-colors"
                                    >
                                        ← Back to Login
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
