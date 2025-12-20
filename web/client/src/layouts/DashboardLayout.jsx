import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Send, Receipt, History, User, LogOut, Menu, X,
    PiggyBank, Users, BarChart3, QrCode, CreditCard, Bell, Calendar, HelpCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active, badge }) => (
    <Link
        to={to}
        className={twMerge(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                : "text-text-secondary hover:bg-glass-hover hover:text-white"
        )}
    >
        <Icon className={twMerge("w-5 h-5", active && "animate-pulse")} />
        <span className="font-medium flex-1">{label}</span>
        {badge > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-status-error text-white font-bold">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
        {active && <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_10px_#00f2ff]" />}
    </Link>
);

const SidebarSection = ({ title, children }) => (
    <div className="space-y-1">
        <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</p>
        {children}
    </div>
);

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
            <div className="flex items-center gap-3 px-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center font-bold text-white shadow-lg">S</div>
                <div>
                    <span className="text-xl font-bold">SOBS</span>
                    <span className="text-xs text-accent-cyan block">Premium Banking</span>
                </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto">
                <SidebarSection title="Main">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
                    <SidebarItem icon={Send} label="Transfer" to="/transfer" active={location.pathname === '/transfer'} />
                    <SidebarItem icon={Receipt} label="Pay Bills" to="/bills" active={location.pathname === '/bills'} />
                    <SidebarItem icon={History} label="Transactions" to="/transactions" active={location.pathname === '/transactions'} />
                </SidebarSection>

                <SidebarSection title="Features">
                    <SidebarItem icon={PiggyBank} label="Savings Goals" to="/savings" active={location.pathname === '/savings'} />
                    <SidebarItem icon={Users} label="Beneficiaries" to="/beneficiaries" active={location.pathname === '/beneficiaries'} />
                    <SidebarItem icon={Calendar} label="Scheduled" to="/scheduled" active={location.pathname === '/scheduled'} />
                    <SidebarItem icon={QrCode} label="QR Payments" to="/qr" active={location.pathname === '/qr'} />
                </SidebarSection>

                <SidebarSection title="Insights">
                    <SidebarItem icon={BarChart3} label="Analytics" to="/analytics" active={location.pathname === '/analytics'} />
                    <SidebarItem icon={CreditCard} label="Card Controls" to="/cards" active={location.pathname === '/cards'} />
                    <SidebarItem icon={Bell} label="Notifications" to="/notifications" active={location.pathname === '/notifications'} badge={3} />
                </SidebarSection>
            </nav>

            <div className="mt-auto pt-6 border-t border-glass-border space-y-2">
                <SidebarItem icon={HelpCircle} label="Support" to="/support" active={location.pathname === '/support'} />
                <SidebarItem icon={User} label="Profile" to="/profile" active={location.pathname === '/profile'} />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-status-error hover:bg-status-error/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-void text-text-primary">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 p-6 bg-secondary/50 backdrop-blur-xl border-r border-glass-border h-screen sticky top-0">
                <NavContent />
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan shadow-lg flex items-center justify-center"
            >
                <Menu className="w-6 h-6 text-white" />
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
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 p-6 bg-secondary border-r border-glass-border z-50 flex flex-col"
                        >
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-glass-hover rounded-lg"
                            >
                                <X className="w-5 h-5" />
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
