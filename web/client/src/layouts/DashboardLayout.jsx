import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

// Text-only menu item with gradient underline for active state
const SidebarItem = ({ label, to, active, badge }) => (
    <Link
        to={to}
        className={twMerge(
            "relative block px-4 py-3 transition-all duration-200",
            active
                ? "text-white font-semibold"
                : "text-text-secondary hover:text-white"
        )}
    >
        <span className="relative z-10">{label}</span>
        {active && (
            <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        {badge > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs rounded-full bg-status-error text-white font-bold">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </Link>
);

// Section divider with subtle line
const SidebarSection = ({ title, children }) => (
    <div className="space-y-1">
        <p className="px-4 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-widest">{title}</p>
        {children}
    </div>
);

// Quick action card with motion graphic
const QuickActionCard = () => (
    <Link to="/transfer">
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 cursor-pointer group"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Quick Transfer</span>
                <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-accent-cyan"
                >
                    →
                </motion.span>
            </div>
            <div className="h-1 bg-glass-border rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '50%' }}
                />
            </div>
        </motion.div>
    </Link>
);

// User profile card at bottom
const UserProfileCard = ({ onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="mx-4 p-4 rounded-2xl bg-glass-bg border border-glass-border">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-text-muted truncate">{user.email || 'user@email.com'}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_#10b981]" title="Online" />
            </div>
            <div className="flex gap-2">
                <Link to="/profile" className="flex-1 text-center py-2 text-xs text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-glass-hover">
                    Profile
                </Link>
                <button
                    onClick={onLogout}
                    className="flex-1 text-center py-2 text-xs text-status-error hover:bg-status-error/10 transition-colors rounded-lg"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        navigate('/');
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/30">
                    <span className="text-white font-bold text-lg">◆</span>
                </div>
                <div>
                    <span className="text-xl font-bold text-white">SOBS</span>
                    <span className="text-[10px] text-accent-cyan block tracking-wider">PREMIUM BANKING</span>
                </div>
            </div>

            {/* Quick Action Card */}
            <QuickActionCard />

            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto">
                <SidebarSection title="Overview">
                    <SidebarItem label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
                    <SidebarItem label="Transactions" to="/transactions" active={location.pathname === '/transactions'} />
                </SidebarSection>

                <SidebarSection title="Payments">
                    <SidebarItem label="Send Money" to="/transfer" active={location.pathname === '/transfer'} />
                    <SidebarItem label="Pay Bills" to="/bills" active={location.pathname === '/bills'} />
                    <SidebarItem label="Beneficiaries" to="/beneficiaries" active={location.pathname === '/beneficiaries'} />
                </SidebarSection>

                <SidebarSection title="Manage">
                    <SidebarItem label="My Cards" to="/cards" active={location.pathname === '/cards'} />
                    <SidebarItem label="Savings Goals" to="/savings" active={location.pathname === '/savings'} />
                    <SidebarItem label="Analytics" to="/analytics" active={location.pathname === '/analytics'} />
                </SidebarSection>

                <SidebarSection title="More">
                    <SidebarItem label="Notifications" to="/notifications" active={location.pathname === '/notifications'} badge={3} />
                    <SidebarItem label="Support" to="/support" active={location.pathname === '/support'} />
                </SidebarSection>
            </nav>

            {/* User Profile Card */}
            <div className="mt-auto pt-6 border-t border-glass-border">
                <UserProfileCard onLogout={handleLogout} />
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-void text-text-primary">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 p-4 bg-secondary/50 backdrop-blur-xl border-r border-glass-border h-screen sticky top-0">
                <NavContent />
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan shadow-lg flex items-center justify-center"
            >
                <span className="text-white text-2xl">☰</span>
            </button>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 p-4 bg-secondary border-r border-glass-border z-50 flex flex-col"
                        >
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-glass-hover rounded-lg text-text-secondary hover:text-white"
                            >
                                ✕
                            </button>
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
