import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

// SWISS GRID NAVIGATION ITEM - Text only with sharp borders
const SidebarItem = ({ label, to, active, badge }) => (
    <Link
        to={to}
        className={twMerge(
            "relative block px-6 py-4 border-l-4 transition-all duration-150",
            active
                ? "bg-black text-white border-l-accent-primary font-bold dark:bg-white dark:text-black"
                : "border-l-transparent text-text-secondary hover:bg-secondary hover:text-black dark:hover:text-white"
        )}
    >
        <span className="text-sm uppercase tracking-wider">{label}</span>
        {badge > 0 && (
            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] bg-accent-primary text-white font-bold">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </Link>
);

// Section divider with sharp line
const SidebarSection = ({ title, children }) => (
    <div className="border-t-2 border-grid-border-light dark:border-grid-border-light">
        <p className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] bg-secondary dark:bg-secondary">{title}</p>
        <div>{children}</div>
    </div>
);

// User profile card - Grid style
const UserProfileCard = ({ onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="border-t-2 border-grid-border-light dark:border-grid-border-light p-6">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-grid-border-light">
                {/* Initials circle - no gradient, just black/red */}
                <div className="w-12 h-12 border-2 border-black bg-black text-white flex items-center justify-center font-bold text-sm dark:bg-white dark:text-black dark:border-white">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-black dark:text-white uppercase text-xs truncate tracking-wide">{user.name || 'User'}</p>
                    <p className="text-[10px] text-text-muted truncate font-mono">{user.email || 'user@email.com'}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Link to="/profile" className="text-center py-2 text-[10px] font-bold uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all dark:border-white dark:hover:bg-white dark:hover:text-black">
                    Profile
                </Link>
                <button
                    onClick={onLogout}
                    className="text-center py-2 text-[10px] font-bold uppercase tracking-wider bg-accent-primary text-white hover:bg-accent-hover transition-all"
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
        <div className="flex flex-col h-full">
            {/* Logo - Sharp and minimal */}
            <div className="border-b-2 border-grid-border-light dark:border-grid-border-light p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black dark:bg-white flex items-center justify-center">
                        <span className="text-white dark:text-black font-bold text-xl">S</span>
                    </div>
                    <div>
                        <span className="text-xl font-bold text-black dark:text-white tracking-tight">SOBS</span>
                        <span className="text-[8px] text-accent-primary block tracking-[0.3em] font-bold">BANKING</span>
                    </div>
                </div>
            </div>

            {/* Navigation sections */}
            <nav className="flex-1 overflow-y-auto">
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

                <SidebarSection title="Support">
                    <SidebarItem label="Notifications" to="/notifications" active={location.pathname === '/notifications'} badge={3} />
                    <SidebarItem label="Help Center" to="/support" active={location.pathname === '/support'} />
                </SidebarSection>
            </nav>

            {/* User Profile Card */}
            <div className="mt-auto">
                <UserProfileCard onLogout={handleLogout} />
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-primary text-text-primary">
            {/* Desktop Sidebar - GRID BORDERS */}
            <aside className="hidden lg:flex flex-col w-72 border-r-2 border-grid-border-light dark:border-grid-border-light h-screen sticky top-0 bg-white dark:bg-void">
                <NavContent />
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 circle-arrow-btn"
            >
                ☰
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
                            className="lg:hidden fixed inset-0 bg-black/80 z-40"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 border-r-2 border-black z-50 flex flex-col bg-white dark:bg-void"
                        >
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 border-2 border-black hover:bg-black hover:text-white transition-all dark:border-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content - GRID CONTAINER */}
            <main className="flex-1 overflow-y-auto">
                <div className="min-h-screen border-l-2 border-grid-border-light dark:border-grid-border-light">
                    {/* Top bar with grid */}
                    <div className="border-b-2 border-grid-border-light dark:border-grid-border-light p-6 bg-white dark:bg-void sticky top-0 z-30">
                        <div className="flex items-center justify-between max-w-7xl mx-auto">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Online Banking System</p>
                                <p className="text-xs text-text-secondary mt-0.5 font-mono">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <Link to="/notifications" className="relative">
                                <div className="w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center dark:border-white dark:hover:bg-white dark:hover:text-black">
                                    <span className="text-sm">🔔</span>
                                </div>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-primary text-white text-[9px] flex items-center justify-center font-bold">3</span>
                            </Link>
                        </div>
                    </div>

                    {/* Page content */}
                    <div className="p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
