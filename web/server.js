const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- STATEFUL MOCK DB ---
const DB = {
    users: [],
    sessions: {},
    otps: {},
    accounts: {},
    cards: {},  // NEW: Separate card settings
    transactions: {},
    beneficiaries: {},
    savingsGoals: {},
    scheduledPayments: {},
    notifications: {}
};

// Seed Data with 2025 dates
const SEED_USER_ID = "USR001";
DB.users.push({
    id: SEED_USER_ID,
    email: "seif@example.com",
    password: "SecurePass123!",
    name: "Seif Alaa",
    phone: "+201001234567"
});

// Two accounts/cards
DB.accounts[SEED_USER_ID] = [
    { number: "12345678901234", type: "Savings", balance: 50000.00, currency: "EGP", status: "Active", cardName: "Primary Card" },
    { number: "99887766554433", type: "Checking", balance: 12500.50, currency: "EGP", status: "Active", cardName: "Business Card" }
];

// Card settings (freeze, limits, etc.) - separate from account
DB.cards[SEED_USER_ID] = {
    "12345678901234": { isFrozen: false, onlinePurchases: true, internationalTransactions: true, contactlessPayments: true, spendingLimit: 50000 },
    "99887766554433": { isFrozen: false, onlinePurchases: true, internationalTransactions: false, contactlessPayments: true, spendingLimit: 25000 }
};

// Transactions for BOTH cards with 2025 dates
DB.transactions["12345678901234"] = [
    { id: 'tx1', date: '2025-12-20T10:30:00Z', type: 'credit', category: 'deposit', amount: 15000, description: 'Salary December', status: 'completed' },
    { id: 'tx2', date: '2025-12-18T14:20:00Z', type: 'debit', category: 'bill', amount: 450, description: 'Electricity Bill', status: 'completed' },
    { id: 'tx3', date: '2025-12-15T09:00:00Z', type: 'debit', category: 'transfer', amount: 2500, description: 'Transfer to Mohamed Ali', status: 'completed' },
    { id: 'tx4', date: '2025-12-12T16:45:00Z', type: 'debit', category: 'shopping', amount: 1800, description: 'Amazon Purchase', status: 'completed' },
    { id: 'tx5', date: '2025-12-10T11:30:00Z', type: 'credit', category: 'deposit', amount: 5000, description: 'Card Deposit', status: 'completed' },
    { id: 'tx6', date: '2025-12-08T08:15:00Z', type: 'debit', category: 'food', amount: 320, description: 'Restaurant - Lucille', status: 'completed' },
    { id: 'tx7', date: '2025-12-05T19:00:00Z', type: 'debit', category: 'entertainment', amount: 150, description: 'Netflix Subscription', status: 'completed' },
    { id: 'tx8', date: '2025-12-01T10:00:00Z', type: 'debit', category: 'transport', amount: 500, description: 'Uber Rides', status: 'completed' },
    { id: 'tx9', date: '2025-11-28T14:00:00Z', type: 'credit', category: 'deposit', amount: 15000, description: 'Salary November', status: 'completed' },
    { id: 'tx10', date: '2025-11-25T12:00:00Z', type: 'debit', category: 'bill', amount: 350, description: 'Internet Bill', status: 'completed' },
    { id: 'tx11', date: '2025-11-20T09:30:00Z', type: 'debit', category: 'health', amount: 800, description: 'Pharmacy', status: 'completed' },
    { id: 'tx12', date: '2025-11-15T16:00:00Z', type: 'debit', category: 'shopping', amount: 3500, description: 'Zara Clothes', status: 'completed' },
];

DB.transactions["99887766554433"] = [
    { id: 'tx20', date: '2025-12-19T11:00:00Z', type: 'credit', category: 'deposit', amount: 8000, description: 'Business Payment', status: 'completed' },
    { id: 'tx21', date: '2025-12-17T15:30:00Z', type: 'debit', category: 'transfer', amount: 3000, description: 'Supplier Payment', status: 'completed' },
    { id: 'tx22', date: '2025-12-14T10:00:00Z', type: 'debit', category: 'bill', amount: 1200, description: 'Office Rent', status: 'completed' },
    { id: 'tx23', date: '2025-12-10T14:00:00Z', type: 'credit', category: 'deposit', amount: 5500, description: 'Client Payment', status: 'completed' },
];

// MORE beneficiaries (8 total)
DB.beneficiaries[SEED_USER_ID] = [
    { id: 'b1', name: 'Mohamed Ali', accountNumber: '9876543210123456', bank: 'CIB', nickname: 'Brother', isFavorite: true },
    { id: 'b2', name: 'Sara Ahmed', accountNumber: '5555666677778888', bank: 'QNB', nickname: 'Mom', isFavorite: true },
    { id: 'b3', name: 'Landlord Office', accountNumber: '1111222233334444', bank: 'NBE', nickname: 'Rent', isFavorite: false },
    { id: 'b4', name: 'Fatma Hassan', accountNumber: '4444333322221111', bank: 'HSBC', nickname: 'Sister', isFavorite: true },
    { id: 'b5', name: 'Omar Khaled', accountNumber: '7777888899990000', bank: 'Banque Misr', nickname: 'Best Friend', isFavorite: false },
    { id: 'b6', name: 'Youssef Mahmoud', accountNumber: '1234123412341234', bank: 'Alex Bank', nickname: 'Colleague', isFavorite: false },
    { id: 'b7', name: 'Nour El-Din', accountNumber: '9999000011112222', bank: 'Arab African Bank', nickname: 'Trainer', isFavorite: false },
    { id: 'b8', name: 'Laila Mostafa', accountNumber: '6666777788889999', bank: 'Faisal Islamic Bank', nickname: 'Wife', isFavorite: true },
];

DB.savingsGoals[SEED_USER_ID] = [
    { id: 'g1', name: 'Dream Vacation', icon: 'vacation', targetAmount: 30000, currentAmount: 12500 },
    { id: 'g2', name: 'Emergency Fund', icon: 'emergency', targetAmount: 50000, currentAmount: 35000 },
    { id: 'g3', name: 'New Car', icon: 'car', targetAmount: 200000, currentAmount: 45000 },
];

DB.scheduledPayments[SEED_USER_ID] = [
    { id: 's1', name: 'Monthly Rent', paymentType: 'rent', amount: 8000, recipientAccount: '1111222233334444', frequency: 'monthly', startDate: '2025-01-01', isPaused: false },
    { id: 's2', name: 'Internet Bill', paymentType: 'bill', amount: 350, recipientAccount: '5555666677778888', frequency: 'monthly', startDate: '2025-01-15', isPaused: false },
];

DB.notifications[SEED_USER_ID] = [
    { id: 'n1', type: 'transfer_received', title: 'Money Received', message: 'You received 2,500 EGP from Sara Ahmed', amount: 2500, isRead: false, createdAt: '2025-12-20T09:00:00Z' },
    { id: 'n2', type: 'bill_paid', title: 'Bill Paid', message: 'Your electricity bill of 450 EGP was paid successfully', isRead: false, createdAt: '2025-12-18T14:20:00Z' },
    { id: 'n3', type: 'security', title: 'Security Alert', message: 'New login detected from Cairo, Egypt', isRead: false, createdAt: '2025-12-17T08:00:00Z' },
    { id: 'n4', type: 'promo', title: 'Special Offer', message: 'Get 2% cashback on all purchases this weekend!', isRead: true, createdAt: '2025-12-15T12:00:00Z' },
];

// --- HELPERS ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const getCurrentUserId = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer TOKEN_')) {
        const sessionId = authHeader.replace('Bearer TOKEN_', '');
        const userId = DB.sessions[sessionId];
        if (userId) return userId;
    }
    if (DB.users.find(u => u.id === SEED_USER_ID)) {
        return SEED_USER_ID;
    }
    return null;
};

// Check if card is frozen
const isCardFrozen = (userId, accountNumber) => {
    return DB.cards[userId]?.[accountNumber]?.isFrozen || false;
};

// Check if amount exceeds spending limit
const getSpendingLimit = (userId, accountNumber) => {
    return DB.cards[userId]?.[accountNumber]?.spendingLimit || null;
};

const checkSpendingLimit = (userId, accountNumber, amount) => {
    const limit = getSpendingLimit(userId, accountNumber);
    if (limit !== null && amount > limit) {
        return {
            allowed: false,
            message: `Transaction blocked: Amount ${amount.toLocaleString()} EGP exceeds your daily spending limit of ${limit.toLocaleString()} EGP. Please adjust your limit in Card Controls.`
        };
    }
    return { allowed: true };
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = DB.users.find(u => u.email === email && u.password === password);

    if (user) {
        const sessionId = generateId();
        DB.sessions[sessionId] = user.id;
        const otp = generateOTP();
        DB.otps[sessionId] = { code: otp, expires: Date.now() + 300000 };
        console.log(`[OTP] ${email}: ${otp}`);
        return res.json({ success: true, data: { sessionId, requiresOTP: true, debugOtp: otp } });
    }
    res.status(401).json({ success: false, message: "Invalid email or password" });
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { sessionId, otp } = req.body;
    const sessionOTP = DB.otps[sessionId];

    if (sessionOTP && sessionOTP.code === otp) {
        const userId = DB.sessions[sessionId];
        if (userId) {
            const user = DB.users.find(u => u.id === userId);
            return res.json({ success: true, data: { sessionToken: "TOKEN_" + sessionId, customerId: userId, fullName: user?.name, email: user?.email } });
        }
    }
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
});

app.post('/api/auth/register', (req, res) => {
    const { fullName, email, password, phone } = req.body;
    if (DB.users.find(u => u.email === email)) {
        return res.json({ success: false, message: "Email already registered" });
    }
    const newUser = { id: "USR" + generateId(), email, password, name: fullName, phone };
    DB.users.push(newUser);
    const accountNumber = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
    DB.accounts[newUser.id] = [{ number: accountNumber, type: "Savings", balance: 1000.00, currency: "EGP", status: "Active", cardName: "My Card" }];
    DB.cards[newUser.id] = { [accountNumber]: { isFrozen: false, onlinePurchases: true, internationalTransactions: true, contactlessPayments: true, spendingLimit: 50000 } };
    DB.transactions[accountNumber] = [];
    DB.beneficiaries[newUser.id] = [];
    DB.savingsGoals[newUser.id] = [];
    DB.scheduledPayments[newUser.id] = [];
    DB.notifications[newUser.id] = [];
    res.json({ success: true, message: "Registration successful. Please login." });
});

// --- ACCOUNTS ---
app.get('/api/accounts', (req, res) => {
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId] || [];
    // Attach card settings to each account
    const accountsWithCards = accounts.map(acc => ({
        ...acc,
        cardSettings: DB.cards[userId]?.[acc.number] || {}
    }));
    res.json({ success: true, data: accountsWithCards });
});

app.get('/api/accounts/:id/transactions', (req, res) => {
    const txns = DB.transactions[req.params.id] || [];
    res.json({ success: true, data: { transactions: txns, totalCount: txns.length } });
});

// --- CARD SETTINGS ---
app.get('/api/cards/:accountNumber/settings', (req, res) => {
    const userId = getCurrentUserId(req);
    const settings = DB.cards[userId]?.[req.params.accountNumber] || {};
    res.json({ success: true, data: settings });
});

app.put('/api/cards/:accountNumber/settings', (req, res) => {
    const userId = getCurrentUserId(req);
    if (!DB.cards[userId]) DB.cards[userId] = {};
    DB.cards[userId][req.params.accountNumber] = {
        ...DB.cards[userId][req.params.accountNumber],
        ...req.body
    };
    res.json({ success: true, data: DB.cards[userId][req.params.accountNumber] });
});

// --- DEPOSIT ---
let depositOtps = {};
app.post('/api/accounts/deposit/request', (req, res) => {
    const { accountNumber } = req.body;
    const userId = getCurrentUserId(req);

    // Check if card is frozen
    if (isCardFrozen(userId, accountNumber)) {
        return res.status(400).json({ success: false, message: 'Cannot deposit to a frozen card. Please unfreeze it first.' });
    }

    const otp = generateOTP();
    depositOtps[otp] = { amount: req.body.amount, accountNumber, expires: Date.now() + 300000 };
    console.log(`[DEPOSIT OTP] ${otp}`);
    res.json({ success: true, debugOtp: otp });
});

app.post('/api/accounts/deposit/confirm', (req, res) => {
    const { otp, amount, accountNumber } = req.body;
    const entry = depositOtps[otp];
    if (!entry || entry.expires < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId];
    const account = accounts?.find(a => a.number === (accountNumber || entry.accountNumber));

    if (account) {
        // Check if card is frozen
        if (isCardFrozen(userId, account.number)) {
            return res.status(400).json({ success: false, message: 'Cannot deposit to a frozen card' });
        }

        account.balance += parseFloat(amount);
        if (!DB.transactions[account.number]) DB.transactions[account.number] = [];
        DB.transactions[account.number].unshift({
            id: generateId(),
            date: new Date().toISOString(),
            type: "credit",
            category: "deposit",
            amount: parseFloat(amount),
            description: "Card Deposit",
            status: "completed"
        });
        delete depositOtps[otp];
        return res.json({ success: true, data: { newBalance: account.balance } });
    }
    res.status(400).json({ success: false, message: "Account not found" });
});

// --- TRANSFERS ---
app.post('/api/transfers', (req, res) => {
    const { recipientAccountNumber, amount, fromAccountNumber } = req.body;
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId];
    if (!accounts || accounts.length === 0) return res.status(400).json({ success: false, message: "Account not found" });

    // Find the source account (default to first if not specified)
    const sourceAccount = fromAccountNumber
        ? accounts.find(a => a.number === fromAccountNumber)
        : accounts[0];

    if (!sourceAccount) return res.status(400).json({ success: false, message: "Source account not found" });

    // CHECK IF CARD IS FROZEN - BLOCK TRANSFER!
    if (isCardFrozen(userId, sourceAccount.number)) {
        return res.status(400).json({
            success: false,
            message: 'Transfer blocked: Your card is frozen. Please unfreeze it in Card Controls to make transfers.'
        });
    }

    const transferAmount = parseFloat(amount);

    // CHECK SPENDING LIMIT - BLOCK IF EXCEEDS LIMIT!
    const cardSettings = DB.cards[userId]?.[sourceAccount.number];
    if (cardSettings && cardSettings.spendingLimit) {
        if (transferAmount > cardSettings.spendingLimit) {
            return res.status(400).json({
                success: false,
                message: `Transfer blocked: Amount ${transferAmount.toLocaleString()} EGP exceeds your card spending limit of ${cardSettings.spendingLimit.toLocaleString()} EGP. Please adjust your limit in Card Controls.`
            });
        }
    }

    if (sourceAccount.balance < transferAmount) {
        return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    sourceAccount.balance -= transferAmount;
    if (!DB.transactions[sourceAccount.number]) DB.transactions[sourceAccount.number] = [];
    DB.transactions[sourceAccount.number].unshift({
        id: generateId(),
        date: new Date().toISOString(),
        type: "debit",
        category: "transfer",
        amount: transferAmount,
        description: `Transfer to ${recipientAccountNumber}`,
        status: "completed"
    });

    res.json({ success: true, data: { transactionId: generateId(), newBalance: sourceAccount.balance } });
});

// --- BILL PAYMENTS ---
const BILL_PROVIDERS = {
    ELECTRICITY: ['Egyptian Electricity', 'North Cairo Electricity', 'South Cairo Electricity'],
    WATER: ['Cairo Water Company', 'Alexandria Water', 'Giza Water'],
    INTERNET: ['WE Internet', 'Vodafone Home', 'Orange DSL', 'Etisalat Home'],
    MOBILE: ['Vodafone', 'Orange', 'Etisalat', 'WE Mobile'],
    TV: ['beIN Sports', 'OSN', 'Nile TV'],
    INSURANCE: ['Allianz Egypt', 'AXA Egypt', 'MetLife']
};

app.get('/api/bills/providers', (req, res) => {
    const type = req.query.type;
    res.json({ success: true, data: BILL_PROVIDERS[type] || [] });
});

app.post('/api/bills/pay', (req, res) => {
    const { amount, provider, billNumber, description } = req.body;
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId] || [];
    const primaryAccount = accounts[0];
    const payAmount = parseFloat(amount);

    if (!primaryAccount) {
        return res.status(400).json({ success: false, message: 'No account found' });
    }

    // CHECK IF CARD IS FROZEN
    if (isCardFrozen(userId, primaryAccount.number)) {
        return res.status(400).json({
            success: false,
            message: 'Payment blocked: Your card is frozen. Please unfreeze it in Card Controls.'
        });
    }

    // CHECK SPENDING LIMIT
    const limitCheck = checkSpendingLimit(userId, primaryAccount.number, payAmount);
    if (!limitCheck.allowed) {
        return res.status(400).json({ success: false, message: limitCheck.message });
    }

    // CHECK BALANCE
    if (primaryAccount.balance < payAmount) {
        return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }

    // Process payment
    primaryAccount.balance -= payAmount;

    // Record transaction
    if (!DB.transactions[primaryAccount.number]) DB.transactions[primaryAccount.number] = [];
    DB.transactions[primaryAccount.number].unshift({
        id: generateId(),
        date: new Date().toISOString(),
        type: 'debit',
        category: 'bill',
        amount: payAmount,
        description: description || `${provider} Bill Payment`,
        status: 'completed'
    });

    res.json({ success: true, data: { transactionId: generateId(), newBalance: primaryAccount.balance } });
});

// --- BENEFICIARIES ---
app.get('/api/beneficiaries', (req, res) => {
    const userId = getCurrentUserId(req);
    res.json({ success: true, data: DB.beneficiaries[userId] || [] });
});

app.post('/api/beneficiaries', (req, res) => {
    const userId = getCurrentUserId(req);
    const newBenef = { id: generateId(), ...req.body };
    if (!DB.beneficiaries[userId]) DB.beneficiaries[userId] = [];
    DB.beneficiaries[userId].push(newBenef);
    res.json({ success: true, data: newBenef });
});

app.put('/api/beneficiaries/:id', (req, res) => {
    const userId = getCurrentUserId(req);
    const idx = DB.beneficiaries[userId]?.findIndex(b => b.id === req.params.id);
    if (idx >= 0) {
        DB.beneficiaries[userId][idx] = { ...DB.beneficiaries[userId][idx], ...req.body };
        return res.json({ success: true });
    }
    res.status(404).json({ success: false });
});

app.delete('/api/beneficiaries/:id', (req, res) => {
    const userId = getCurrentUserId(req);
    DB.beneficiaries[userId] = DB.beneficiaries[userId]?.filter(b => b.id !== req.params.id) || [];
    res.json({ success: true });
});

// --- SAVINGS GOALS ---
app.get('/api/savings/goals', (req, res) => {
    const userId = getCurrentUserId(req);
    res.json({ success: true, data: DB.savingsGoals[userId] || [] });
});

app.post('/api/savings/goals', (req, res) => {
    const userId = getCurrentUserId(req);
    const newGoal = { id: generateId(), currentAmount: 0, ...req.body };
    if (!DB.savingsGoals[userId]) DB.savingsGoals[userId] = [];
    DB.savingsGoals[userId].push(newGoal);
    res.json({ success: true, data: newGoal });
});

app.post('/api/savings/goals/:id/deposit', (req, res) => {
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId] || [];
    const primaryAccount = accounts[0];
    const depositAmount = parseFloat(req.body.amount);

    // CHECK SPENDING LIMIT FOR SAVINGS DEPOSIT
    if (primaryAccount) {
        const limitCheck = checkSpendingLimit(userId, primaryAccount.number, depositAmount);
        if (!limitCheck.allowed) {
            return res.status(400).json({ success: false, message: limitCheck.message });
        }

        // Check frozen
        if (isCardFrozen(userId, primaryAccount.number)) {
            return res.status(400).json({ success: false, message: 'Cannot deposit to savings: Your card is frozen.' });
        }

        // Check balance
        if (primaryAccount.balance < depositAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient funds for savings deposit.' });
        }

        // Deduct from account
        primaryAccount.balance -= depositAmount;

        // RECORD TRANSACTION
        if (!DB.transactions[primaryAccount.number]) DB.transactions[primaryAccount.number] = [];
        DB.transactions[primaryAccount.number].unshift({
            id: generateId(),
            date: new Date().toISOString(),
            type: 'debit',
            category: 'savings',
            amount: depositAmount,
            description: `Savings Goal Deposit`,
            status: 'completed'
        });
    }

    const goal = DB.savingsGoals[userId]?.find(g => g.id === req.params.id);
    if (goal) {
        goal.currentAmount += depositAmount;
        return res.json({ success: true, data: goal });
    }
    res.status(404).json({ success: false, message: 'Savings goal not found' });
});

// --- SCHEDULED PAYMENTS ---
app.get('/api/scheduled-payments', (req, res) => {
    const userId = getCurrentUserId(req);
    res.json({ success: true, data: DB.scheduledPayments[userId] || [] });
});

app.post('/api/scheduled-payments', (req, res) => {
    const userId = getCurrentUserId(req);
    const newSchedule = { id: generateId(), isPaused: false, ...req.body };
    if (!DB.scheduledPayments[userId]) DB.scheduledPayments[userId] = [];
    DB.scheduledPayments[userId].push(newSchedule);
    res.json({ success: true, data: newSchedule });
});

app.put('/api/scheduled-payments/:id', (req, res) => {
    const userId = getCurrentUserId(req);
    const idx = DB.scheduledPayments[userId]?.findIndex(s => s.id === req.params.id);
    if (idx >= 0) {
        DB.scheduledPayments[userId][idx] = { ...DB.scheduledPayments[userId][idx], ...req.body };
        return res.json({ success: true });
    }
    res.status(404).json({ success: false });
});

app.delete('/api/scheduled-payments/:id', (req, res) => {
    const userId = getCurrentUserId(req);
    DB.scheduledPayments[userId] = DB.scheduledPayments[userId]?.filter(s => s.id !== req.params.id) || [];
    res.json({ success: true });
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', (req, res) => {
    const userId = getCurrentUserId(req);
    res.json({ success: true, data: DB.notifications[userId] || [] });
});

app.put('/api/notifications/:id/read', (req, res) => {
    const userId = getCurrentUserId(req);
    const notif = DB.notifications[userId]?.find(n => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
});

app.put('/api/notifications/read-all', (req, res) => {
    const userId = getCurrentUserId(req);
    DB.notifications[userId]?.forEach(n => n.isRead = true);
    res.json({ success: true });
});

app.delete('/api/notifications/:id', (req, res) => {
    const userId = getCurrentUserId(req);
    DB.notifications[userId] = DB.notifications[userId]?.filter(n => n.id !== req.params.id) || [];
    res.json({ success: true });
});

// --- ANALYTICS (PERIOD-BASED - DIFFERENT DATA FOR WEEK/MONTH/YEAR) ---
app.get('/api/analytics', (req, res) => {
    const period = req.query.period || 'month';
    const accountNumber = req.query.account;
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId] || [];
    const acctNum = accountNumber || accounts[0]?.number;
    const allTxns = DB.transactions[acctNum] || [];

    const now = new Date();
    let startDate;

    // Different date ranges for each period
    if (period === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else { // year
        startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Filter transactions by period
    const txns = allTxns.filter(tx => new Date(tx.date) >= startDate);

    const byCategory = {};
    let totalSpent = 0, totalIncome = 0;

    txns.forEach(tx => {
        if (tx.type === 'debit') {
            totalSpent += tx.amount;
            byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
        } else {
            totalIncome += tx.amount;
        }
    });

    const categoryData = Object.entries(byCategory).map(([category, amount]) => ({ category, amount }));

    // DIFFERENT monthly data based on period
    let monthlyData;
    if (period === 'week') {
        // Last 7 days
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        monthlyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayTxns = allTxns.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.toDateString() === d.toDateString() && tx.type === 'debit';
            });
            const total = dayTxns.reduce((s, t) => s + t.amount, 0);
            monthlyData.push({ label: days[d.getDay()], value: total || Math.floor(Math.random() * 500) + 100 });
        }
    } else if (period === 'month') {
        // Last 4 weeks
        monthlyData = [
            { label: 'Week 1', value: 4500 },
            { label: 'Week 2', value: 3200 },
            { label: 'Week 3', value: 5800 },
            { label: 'Week 4', value: 2900 },
        ];
    } else {
        // Last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthlyData = months.map((label, i) => ({
            label,
            value: [8500, 7200, 9300, 6800, 11200, 8900, 7500, 10200, 9800, 8100, 12500, totalSpent || 8000][i]
        }));
    }

    // Different days for avg calculation
    const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 365;

    // Different trend percentages
    const trendByPeriod = { week: -5, month: 12, year: -8 };

    // Different tips based on data
    const tips = period === 'week' ? [
        { icon: '📊', text: `You spent ${totalSpent.toLocaleString()} EGP this week` },
        { icon: '💡', text: 'Your biggest expense was ' + (categoryData[0]?.category || 'shopping') },
        { icon: '🎯', text: 'Try to reduce weekend spending for better savings' },
    ] : period === 'month' ? [
        { icon: '📈', text: `Monthly spending: ${totalSpent.toLocaleString()} EGP` },
        { icon: '💰', text: `You earned ${totalIncome.toLocaleString()} EGP this month` },
        { icon: '⚡', text: 'Bills account for ' + Math.round((byCategory['bill'] || 0) / (totalSpent || 1) * 100) + '% of spending' },
    ] : [
        { icon: '🏆', text: 'Your best month was June with lowest spending' },
        { icon: '📅', text: `Annual spending: ${(totalSpent * 12).toLocaleString()} EGP projected` },
        { icon: '🎯', text: 'You\'re saving 15% more than last year!' },
    ];

    res.json({
        success: true,
        data: {
            byCategory: categoryData,
            monthly: monthlyData,
            insights: {
                totalSpent,
                totalIncome,
                avgDaily: Math.round(totalSpent / daysInPeriod),
                trend: trendByPeriod[period],
                tips
            }
        }
    });
});

// --- BILLS ---
app.get('/api/bills/providers', (req, res) => {
    const providers = {
        ELECTRICITY: ['Egyptian Electricity', 'North Delta Electricity'],
        WATER: ['Cairo Water Company', 'Alexandria Water'],
        INTERNET: ['WE (Telecom Egypt)', 'Orange DSL', 'Vodafone Home'],
        MOBILE: ['Vodafone Egypt', 'Orange Egypt', 'Etisalat Egypt'],
    };
    res.json({ success: true, data: providers[req.query.type] || [] });
});

// --- BILL PAYMENT (with card freeze check) ---
app.post('/api/bills/pay', (req, res) => {
    const { amount, fromAccountNumber } = req.body;
    const userId = getCurrentUserId(req);
    const accounts = DB.accounts[userId];
    const sourceAccount = fromAccountNumber
        ? accounts?.find(a => a.number === fromAccountNumber)
        : accounts?.[0];

    if (!sourceAccount) return res.status(400).json({ success: false, message: "Account not found" });

    // Check if card is frozen
    if (isCardFrozen(userId, sourceAccount.number)) {
        return res.status(400).json({
            success: false,
            message: 'Payment blocked: Your card is frozen. Please unfreeze it first.'
        });
    }

    if (sourceAccount.balance < parseFloat(amount)) {
        return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    sourceAccount.balance -= parseFloat(amount);
    DB.transactions[sourceAccount.number].unshift({
        id: generateId(),
        date: new Date().toISOString(),
        type: 'debit',
        category: 'bill',
        amount: parseFloat(amount),
        description: req.body.description || 'Bill Payment',
        status: 'completed'
    });

    res.json({ success: true, data: { newBalance: sourceAccount.balance } });
});

app.listen(PORT, () => {
    console.log(`SOBS API running on http://localhost:${PORT}`);
    console.log(`Demo: ahmed@example.com / SecurePass123!`);
});
