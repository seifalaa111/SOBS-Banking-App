import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Shield, Bell, Lock, Eye, EyeOff, Camera,
    Edit3, Check, X, ChevronRight, Sparkles, Moon, Sun, Globe, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/common/GlassCard';
import NeonButton from '../../components/common/NeonButton';
import GlowInput from '../../components/common/GlowInput';

const SettingToggle = ({ enabled, onChange }) => (
    <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-all ${enabled ? 'bg-gradient-to-r from-accent-cyan to-accent-purple' : 'bg-glass-border'}`}
    >
        <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg"
            animate={{ x: enabled ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

const SettingRow = ({ icon: Icon, title, description, action, gradient }) => (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-glass-hover transition-colors group">
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="font-medium">{title}</p>
                {description && <p className="text-sm text-text-muted">{description}</p>}
            </div>
        </div>
        {action}
    </div>
);

export default function Profile() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        name: user.fullName || 'Seif Alaa',
        email: user.email || 'seif@example.com',
        phone: '+201001234567',
    });

    const [settings, setSettings] = useState({
        notifications: true,
        twoFactor: true,
        biometric: false,
        language: 'English',
    });

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-purple/30 via-secondary to-accent-cyan/30 border border-glass-border">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -left-20 w-60 h-60 bg-accent-purple/40 rounded-full blur-3xl"
                        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent-cyan/40 rounded-full blur-3xl"
                        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    />
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-accent-purple/30"
                            >
                                {formData.name.split(' ').map(n => n[0]).join('')}
                            </motion.div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Camera className="w-5 h-5 text-void" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{formData.name}</h1>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-void flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Premium
                                </span>
                            </div>
                            <p className="text-text-secondary mb-4">{formData.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1.5 rounded-xl bg-glass-bg border border-glass-border text-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-status-success" /> Verified
                                </span>
                                <span className="px-3 py-1.5 rounded-xl bg-glass-bg border border-glass-border text-sm flex items-center gap-2">
                                    <span className="text-text-muted">Member since</span> Dec 2024
                                </span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <NeonButton
                            variant="secondary"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
                        </NeonButton>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <GlassCard>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-accent-cyan" /> Personal Information
                </h2>

                {isEditing ? (
                    <div className="space-y-4">
                        <GlowInput
                            label="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            icon={User}
                        />
                        <GlowInput
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            icon={Mail}
                        />
                        <GlowInput
                            label="Phone Number"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            icon={Phone}
                        />
                        <NeonButton onClick={() => setIsEditing(false)} className="w-full">
                            <Check className="w-4 h-4" /> Save Changes
                        </NeonButton>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-glass-bg/50 border border-glass-border">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-text-muted" />
                                <div>
                                    <p className="text-sm text-text-muted">Full Name</p>
                                    <p className="font-medium">{formData.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-glass-bg/50 border border-glass-border">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-text-muted" />
                                <div>
                                    <p className="text-sm text-text-muted">Email Address</p>
                                    <p className="font-medium">{formData.email}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-status-success/20 text-status-success">Verified</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-glass-bg/50 border border-glass-border">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-text-muted" />
                                <div>
                                    <p className="text-sm text-text-muted">Phone Number</p>
                                    <p className="font-medium">{formData.phone}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-status-success/20 text-status-success">Verified</span>
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Security Settings */}
            <GlassCard>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-purple" /> Security
                </h2>

                <div className="space-y-2">
                    <SettingRow
                        icon={Lock}
                        title="Change Password"
                        description="Update your account password"
                        gradient="from-red-400 to-rose-500"
                        action={<ChevronRight className="w-5 h-5 text-text-muted" />}
                    />
                    <SettingRow
                        icon={Shield}
                        title="Two-Factor Authentication"
                        description="Extra security for your account"
                        gradient="from-emerald-400 to-green-500"
                        action={<SettingToggle enabled={settings.twoFactor} onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })} />}
                    />
                    <SettingRow
                        icon={Eye}
                        title="Biometric Login"
                        description="Use fingerprint or face ID"
                        gradient="from-blue-400 to-cyan-500"
                        action={<SettingToggle enabled={settings.biometric} onChange={() => setSettings({ ...settings, biometric: !settings.biometric })} />}
                    />
                </div>
            </GlassCard>

            {/* Preferences */}
            <GlassCard>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent-pink" /> Preferences
                </h2>

                <div className="space-y-2">
                    <SettingRow
                        icon={Bell}
                        title="Push Notifications"
                        description="Get notified about transactions"
                        gradient="from-amber-400 to-orange-500"
                        action={<SettingToggle enabled={settings.notifications} onChange={() => setSettings({ ...settings, notifications: !settings.notifications })} />}
                    />
                    <SettingRow
                        icon={theme === 'dark' ? Moon : Sun}
                        title="Dark Mode"
                        description={theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                        gradient="from-violet-400 to-purple-500"
                        action={<SettingToggle enabled={theme === 'dark'} onChange={toggleTheme} />}
                    />
                    <SettingRow
                        icon={Globe}
                        title="Language"
                        description={settings.language}
                        gradient="from-cyan-400 to-blue-500"
                        action={<ChevronRight className="w-5 h-5 text-text-muted" />}
                    />
                </div>
            </GlassCard>

            {/* Logout */}
            <GlassCard className="bg-gradient-to-r from-status-error/10 to-transparent border-status-error/30">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-status-error/10 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg">
                            <LogOut className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-status-error">Sign Out</p>
                            <p className="text-sm text-text-muted">Log out from your account</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-status-error" />
                </button>
            </GlassCard>
        </div>
    );
}
