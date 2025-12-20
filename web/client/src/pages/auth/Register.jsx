import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, CreditCard, Eye, EyeOff, Check, X } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import GlowInput from '../../components/common/GlowInput';
import NeonButton from '../../components/common/NeonButton';
import api from '../../api';

const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-status-success' : 'text-text-muted'}`}>
        {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        {text}
    </div>
);

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        nationalId: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // Validation helpers
    const passwordChecks = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isPhoneValid = /^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''));
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

    const isFormValid = formData.fullName.length >= 3 && isEmailValid && isPhoneValid && isPasswordValid && passwordsMatch;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Please fill all fields correctly');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/register', formData);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <GlassCard className="w-full max-w-md text-center py-12">
                    <div className="w-16 h-16 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-status-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-text-secondary">Redirecting to login...</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none" />

            <GlassCard className="w-full max-w-lg relative z-10">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan mb-4">
                        <UserPlus className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="text-text-secondary text-sm mt-1">Join SOBS Banking System</p>
                </div>

                <motion.form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlowInput
                            id="fullName"
                            name="fullName"
                            label="Full Name"
                            placeholder="Ahmed Mohamed"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={formData.fullName && formData.fullName.length < 3 ? 'Min 3 characters' : ''}
                        />
                        <GlowInput
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={formData.email && !isEmailValid ? 'Invalid email format' : ''}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlowInput
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            placeholder="+201001234567"
                            value={formData.phone}
                            onChange={handleChange}
                            error={formData.phone && !isPhoneValid ? 'Invalid phone number' : ''}
                        />
                        <GlowInput
                            id="nationalId"
                            name="nationalId"
                            label="National ID (Optional)"
                            placeholder="29901011234567"
                            value={formData.nationalId}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <GlowInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-text-muted hover:text-white"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-glass-bg border border-glass-border">
                            <PasswordRequirement met={passwordChecks.length} text="8+ characters" />
                            <PasswordRequirement met={passwordChecks.uppercase} text="Uppercase letter" />
                            <PasswordRequirement met={passwordChecks.lowercase} text="Lowercase letter" />
                            <PasswordRequirement met={passwordChecks.number} text="Number" />
                            <PasswordRequirement met={passwordChecks.special} text="Special character" />
                            <PasswordRequirement met={passwordsMatch} text="Passwords match" />
                        </div>
                    )}

                    <GlowInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
                    />

                    {error && <div className="p-3 rounded-lg bg-status-error/10 text-status-error text-sm text-center border border-status-error/20">{error}</div>}

                    <NeonButton type="submit" className="w-full" loading={loading} disabled={loading || !isFormValid}>
                        Create Account
                    </NeonButton>

                    <div className="text-center text-sm text-text-muted">
                        Already have an account? <Link to="/login" className="text-accent-cyan hover:underline">Sign In</Link>
                    </div>
                </motion.form>
            </GlassCard>
        </div>
    );
}
