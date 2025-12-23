/**
 * Format currency for Egyptian Pound (EGP)
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show EGP symbol
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showSymbol = true) {
    const formatted = new Intl.NumberFormat('en-EG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    return showSymbol ? `${formatted} EGP` : formatted;
}

/**
 * Format currency with compact notation for large numbers
 * @param {number} amount - Amount to format
 * @returns {string} Compact formatted string
 */
export function formatCompactCurrency(amount) {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M EGP`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K EGP`;
    }
    return formatCurrency(amount);
}

/**
 * Format date relative to now
 * @param {string|Date} date - Date to format
 * @returns {string} Relative date string
 */
export function formatRelativeDate(date) {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now - target;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return target.toLocaleDateString('en-EG', {
        month: 'short',
        day: 'numeric',
        year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
    const target = new Date(date);

    const options = {
        short: { month: 'short', day: 'numeric' },
        long: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' },
        full: { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    };

    return target.toLocaleDateString('en-EG', options[format] || options.short);
}

/**
 * Format phone number for Egypt
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('20')) {
        const local = cleaned.slice(2);
        return `+20 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `+20 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
}

/**
 * Format card number with masking
 * @param {string} cardNumber - Card number to format
 * @param {boolean} masked - Whether to mask the number
 * @returns {string} Formatted card number
 */
export function formatCardNumber(cardNumber, masked = true) {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (masked && cleaned.length >= 12) {
        return `•••• •••• •••• ${cleaned.slice(-4)}`;
    }
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Format account number
 * @param {string} accountNumber - Account number to format
 * @returns {string} Formatted account number
 */
export function formatAccountNumber(accountNumber) {
    const cleaned = accountNumber.replace(/\D/g, '');
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Get time-based greeting
 * @param {string} name - User's name
 * @returns {string} Time-appropriate greeting
 */
export function getGreeting(name) {
    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    return name ? `${greeting}, ${name}` : greeting;
}

/**
 * Get category color for transactions
 * @param {string} category - Transaction category
 * @returns {object} Color configuration
 */
export function getCategoryColor(category) {
    const colors = {
        deposit: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-l-emerald-500' },
        transfer: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-l-blue-500' },
        bill: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-l-amber-500' },
        shopping: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-l-purple-500' },
        food: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-l-orange-500' },
        entertainment: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-l-pink-500' },
        transport: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-l-cyan-500' },
        health: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-l-red-500' },
        savings: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-l-indigo-500' },
    };

    return colors[category] || { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-l-gray-500' };
}
