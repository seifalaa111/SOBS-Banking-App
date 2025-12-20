import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none" />

            <GlassCard className="w-full max-w-md relative z-10 border-accent-purple/20">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan shadow-glow-purple mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">Welcome Back</h1>
                    <p className="text-text-secondary mt-2">Secure Online Banking System</p>
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
                                icon={Mail}
                                error={email && !isEmailValid ? 'Invalid email format' : ''}
                            />
                            <GlowInput
                                id="password"
                                type="password"
                                label="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                icon={Lock}
                                error={password && password.length < 8 ? 'Min 8 characters' : ''}
                            />

                            {error && <div className="p-3 rounded-lg bg-status-error/10 text-status-error text-sm text-center border border-status-error/20">{error}</div>}

                            <NeonButton type="submit" className="w-full" loading={loading} disabled={loading}>
                                Sign In <ArrowRight className="w-4 h-4" />
                            </NeonButton>

                            <div className="text-center text-sm text-text-muted">
                                Don't have an account? <Link to="/register" className="text-accent-cyan hover:underline">Create Account</Link>
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
                            <div className="text-center text-sm text-text-secondary mb-4">
                                {debugOtp ? (
                                    <>
                                        <span className="text-text-muted">Your OTP Code:</span>
                                        <div className="text-3xl font-mono font-bold text-accent-cyan mt-2 tracking-widest animate-pulse">
                                            {debugOtp}
                                        </div>
                                        <span className="text-xs text-text-muted mt-2 block">(Demo Mode)</span>
                                    </>
                                ) : (
                                    <>We sent a verification code to your phone.</>
                                )}
                            </div>

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
                                Back to Login
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
}
