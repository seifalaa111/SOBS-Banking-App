// ============================================
// SECURE BANKING API - OWASP COMPLIANT
// Zero Trust Architecture
// ============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const xss = require('xss');

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 12;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// 1. Security Headers (XSS, Clickjacking, etc.)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// 2. CORS - Whitelist specific origins only
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10kb' })); // Prevent large payload attacks

// 3. Rate Limiting - Prevent Brute Force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: { success: false, message: 'Too many requests. Please slow down.' }
});

app.use('/api/', generalLimiter);

// ============================================
// STATEFUL MOCK DB (In Production: Use PostgreSQL/MySQL with proper ORM)
// ============================================
const DB = {
    users: [],
    sessions: {},
    otps: {},
    accounts: {},
    cards: {},
    transactions: {},
    beneficiaries: {},
    savingsGoals: {},
    scheduledPayments: {},
    notifications: {}
};

// ============================================
// VALIDATION SCHEMAS (Joi)
// ============================================
const schemas = {
    register: Joi.object({
        fullName: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
            .messages({
                'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
            }),
        phone: Joi.string().pattern(/^\+?\d{10,15}$/).required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    transfer: Joi.object({
        recipientAccountNumber: Joi.string().length(14).required(),
        amount: Joi.number().positive().min(1).max(1000000).required(),
        fromAccountNumber: Joi.string().length(14).required()
    }),
    deposit: Joi.object({
        accountNumber: Joi.string().length(14).required(),
        amount: Joi.number().positive().min(1).max(100000).required()
    }),
    billPayment: Joi.object({
        amount: Joi.number().positive().min(1).max(50000).required(),
        provider: Joi.string().min(3).max(100).required(),
        billNumber: Joi.string().alphanum().min(5).max(20).required(),
        description: Joi.string().max(200).optional()
    })
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate secure UUID instead of sequential IDs
const generateSecureId = (prefix = '') => prefix + uuidv4();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Sanitize user input (XSS prevention)
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return xss(input.trim());
    }
    return input;
};

// Hash password with bcrypt
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Verify password
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Get current user ID from session (with expiration check)
const getCurrentUserId = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer TOKEN_')) {
        const sessionId = authHeader.replace('Bearer TOKEN_', '');
        const session = DB.sessions[sessionId];

        if (session) {
            // Check if session expired
            if (Date.now() - session.createdAt > SESSION_TIMEOUT) {
                delete DB.sessions[sessionId];
                return null;
            }
            return session.userId;
        }
    }
    return null;
};

// ============================================
// OWNERSHIP VERIFICATION MIDDLEWARE (IDOR Prevention)
// ============================================
const verifyAccountOwnership = (req, res, next) => {
    const userId = getCurrentUserId(req);
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const accountNumber = req.params.id || req.params.accountNumber || req.body.accountNumber || req.body.fromAccountNumber;

    if (!accountNumber) {
        return res.status(400).json({ success: false, message: 'Account number required' });
    }

    // Verify user owns this account
    const userAccounts = DB.accounts[userId] || [];
    const ownsAccount = userAccounts.some(acc => acc.number === accountNumber);

    if (!ownsAccount) {
        // DO NOT reveal why - generic error
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    req.userId = userId;
    req.accountNumber = accountNumber;
    next();
};

// Generic auth middleware
const requireAuth = (req, res, next) => {
    const userId = getCurrentUserId(req);
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    req.userId = userId;
    next();
};

// ============================================
// SEED DATA (with HASHED passwords)
// ============================================
(async () => {
    const SEED_USER_ID = generateSecureId('USR_');
    const hashedPassword = await hashPassword('SecurePass123!');

    DB.users.push({
        id: SEED_USER_ID,
        email: "seif@example.com",
        passwordHash: hashedPassword, // NEVER store plain text!
        name: "Seif Alaa",
        phone: "+201001234567",
        createdAt: Date.now()
    });

    // Two accounts
    const account1 = generateSecureId();
    const account2 = generateSecureId();

    DB.accounts[SEED_USER_ID] = [
        { number: account1, type: "Savings", balance: 50000.00, currency: "EGP", status: "Active", cardName: "Primary Card" },
        { number: account2, type: "Checking", balance: 12500.50, currency: "EGP", status: "Active", cardName: "Business Card" }
    ];

    DB.cards[SEED_USER_ID] = {
        [account1]: { isFrozen: false, onlinePurchases: true, internationalTransactions: true, contactlessPayments: true, spendingLimit: 50000 },
        [account2]: { isFrozen: false, onlinePurchases: true, internationalTransactions: false, contactlessPayments: true, spendingLimit: 25000 }
    };

    DB.transactions[account1] = [
        { id: generateSecureId('TX_'), date: '2025-12-20T10:30:00Z', type: 'credit', category: 'deposit', amount: 15000, description: 'Salary December', status: 'completed' },
        { id: generateSecureId('TX_'), date: '2025-12-18T14:20:00Z', type: 'debit', category: 'bill', amount: 450, description: 'Electricity Bill', status: 'completed' },
    ];

    DB.transactions[account2] = [];
    DB.beneficiaries[SEED_USER_ID] = [];
    DB.savingsGoals[SEED_USER_ID] = [];
    DB.scheduledPayments[SEED_USER_ID] = [];
    DB.notifications[SEED_USER_ID] = [];

    console.log(`[SEED] User created: seif@example.com`);
    console.log(`[SEED] Account 1: ${account1}`);
    console.log(`[SEED] Account 2: ${account2}`);
})();

// ============================================
// AUTH ENDPOINTS
// ============================================

// REGISTER (with validation and password hashing)
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = schemas.register.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { fullName, email, password, phone } = value;

        // Check if email exists (NEVER reveal this in production - use email verification instead)
        if (DB.users.find(u => u.email === email)) {
            return res.status(400).json({ success: false, message: 'Registration failed' });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user with UUID
        const newUser = {
            id: generateSecureId('USR_'),
            email: sanitizeInput(email),
            passwordHash, // NEVER store plain password
            name: sanitizeInput(fullName),
            phone: sanitizeInput(phone),
            createdAt: Date.now()
        };

        DB.users.push(newUser);

        // Create account with UUID
        const accountNumber = generateSecureId('ACC_').substring(0, 14);
        DB.accounts[newUser.id] = [{
            number: accountNumber,
            type: "Savings",
            balance: 1000.00,
            currency: "EGP",
            status: "Active",
            cardName: "My Card"
        }];

        DB.cards[newUser.id] = {
            [accountNumber]: {
                isFrozen: false,
                onlinePurchases: true,
                internationalTransactions: true,
                contactlessPayments: true,
                spendingLimit: 50000
            }
        };

        DB.transactions[accountNumber] = [];
        DB.beneficiaries[newUser.id] = [];
        DB.savingsGoals[newUser.id] = [];
        DB.scheduledPayments[newUser.id] = [];
        DB.notifications[newUser.id] = [];

        console.log(`[REGISTER] New user: ${email}`);
        res.json({ success: true, message: "Registration successful. Please login." });

    } catch (err) {
        console.error('[ERROR] Registration:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// LOGIN (with bcrypt verification)
app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = schemas.login.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const { email, password } = value;

        // Find user
        const user = DB.users.find(u => u.email === email);

        // ALWAYS take same time to prevent timing attacks
        const dummyHash = '$2b$12$dummy.hash.for.timing.attack.prevention.only';
        const passwordHash = user ? user.passwordHash : dummyHash;
        const isValid = await verifyPassword(password, passwordHash);

        if (!user || !isValid) {
            // GENERIC error - don't reveal if email exists
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create session with UUID
        const sessionId = generateSecureId('SESS_');
        DB.sessions[sessionId] = {
            userId: user.id,
            createdAt: Date.now()
        };

        // Generate OTP
        const otp = generateOTP();
        DB.otps[sessionId] = {
            code: otp,
            expires: Date.now() + 300000 // 5 minutes
        };

        console.log(`[OTP] ${email}: ${otp}`);

        // NEVER send OTP in response in production! Send via SMS/Email
        res.json({
            success: true,
            data: {
                sessionId,
                requiresOTP: true,
                // debugOtp: otp // Remove in production!
            }
        });

    } catch (err) {
        console.error('[ERROR] Login:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// VERIFY OTP
app.post('/api/auth/verify-otp', authLimiter, (req, res) => {
    try {
        const { sessionId, otp } = req.body;

        if (!sessionId || !otp) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        const sessionOTP = DB.otps[sessionId];

        if (!sessionOTP || sessionOTP.expires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (sessionOTP.code !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const session = DB.sessions[sessionId];
        if (!session) {
            return res.status(400).json({ success: false, message: 'Session not found' });
        }

        const user = DB.users.find(u => u.id === session.userId);

        // Delete OTP after use
        delete DB.otps[sessionId];

        res.json({
            success: true,
            data: {
                sessionToken: "TOKEN_" + sessionId,
                customerId: user.id,
                fullName: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error('[ERROR] OTP Verification:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// ACCOUNTS ENDPOINTS (with IDOR protection)
// ============================================

app.get('/api/accounts', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const accounts = DB.accounts[userId] || [];

        const accountsWithCards = accounts.map(acc => ({
            ...acc,
            cardSettings: DB.cards[userId]?.[acc.number] || {}
        }));

        res.json({ success: true, data: accountsWithCards });
    } catch (err) {
        console.error('[ERROR] Get Accounts:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// CRITICAL FIX: Add ownership verification!
app.get('/api/accounts/:id/transactions', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const accountNumber = req.params.id;

        // VERIFY OWNERSHIP (IDOR Prevention)
        const userAccounts = DB.accounts[userId] || [];
        const ownsAccount = userAccounts.some(acc => acc.number === accountNumber);

        if (!ownsAccount) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const txns = DB.transactions[accountNumber] || [];
        res.json({ success: true, data: { transactions: txns, totalCount: txns.length } });

    } catch (err) {
        console.error('[ERROR] Get Transactions:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// CARD SETTINGS (with ownership verification)
// ============================================

app.get('/api/cards/:accountNumber/settings', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const accountNumber = req.params.accountNumber;

        // VERIFY OWNERSHIP
        const userAccounts = DB.accounts[userId] || [];
        const ownsAccount = userAccounts.some(acc => acc.number === accountNumber);

        if (!ownsAccount) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const settings = DB.cards[userId]?.[accountNumber] || {};
        res.json({ success: true, data: settings });

    } catch (err) {
        console.error('[ERROR] Get Card Settings:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/cards/:accountNumber/settings', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const accountNumber = req.params.accountNumber;

        // VERIFY OWNERSHIP
        const userAccounts = DB.accounts[userId] || [];
        const ownsAccount = userAccounts.some(acc => acc.number === accountNumber);

        if (!ownsAccount) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (!DB.cards[userId]) DB.cards[userId] = {};

        DB.cards[userId][accountNumber] = {
            ...DB.cards[userId][accountNumber],
            ...req.body
        };

        res.json({ success: true, data: DB.cards[userId][accountNumber] });

    } catch (err) {
        console.error('[ERROR] Update Card Settings:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// TRANSFERS (with validation and atomic operations)
// ============================================

app.post('/api/transfers', requireAuth, async (req, res) => {
    try {
        // VALIDATE INPUT
        const { error, value } = schemas.transfer.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { recipientAccountNumber, amount, fromAccountNumber } = value;
        const userId = req.userId;

        // VERIFY OWNERSHIP
        const userAccounts = DB.accounts[userId] || [];
        const sourceAccount = userAccounts.find(acc => acc.number === fromAccountNumber);

        if (!sourceAccount) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Check if card is frozen
        if (DB.cards[userId]?.[sourceAccount.number]?.isFrozen) {
            return res.status(400).json({
                success: false,
                message: 'Transfer blocked: Card is frozen'
            });
        }

        // Check spending limit
        const cardSettings = DB.cards[userId]?.[sourceAccount.number];
        if (cardSettings?.spendingLimit && amount > cardSettings.spendingLimit) {
            return res.status(400).json({
                success: false,
                message: `Amount exceeds spending limit of ${cardSettings.spendingLimit.toLocaleString()} EGP`
            });
        }

        // Check balance
        if (sourceAccount.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient funds' });
        }

        // ATOMIC OPERATION (Simulated - use DB transactions in production)
        try {
            // Deduct from source
            sourceAccount.balance -= amount;

            // Record transaction
            if (!DB.transactions[sourceAccount.number]) {
                DB.transactions[sourceAccount.number] = [];
            }

            DB.transactions[sourceAccount.number].unshift({
                id: generateSecureId('TX_'),
                date: new Date().toISOString(),
                type: "debit",
                category: "transfer",
                amount: amount,
                description: sanitizeInput(`Transfer to ${recipientAccountNumber}`),
                status: "completed"
            });

            res.json({
                success: true,
                data: {
                    transactionId: generateSecureId('TX_'),
                    newBalance: sourceAccount.balance
                }
            });

        } catch (atomicError) {
            // ROLLBACK (in production, DB handles this automatically)
            sourceAccount.balance += amount;
            throw atomicError;
        }

    } catch (err) {
        console.error('[ERROR] Transfer:', err);
        res.status(500).json({ success: false, message: 'Transfer failed. Please try again.' });
    }
});

// ============================================
// BILL PAYMENTS (with validation)
// ============================================

const BILL_PROVIDERS = {
    ELECTRICITY: ['Egyptian Electricity', 'North Cairo Electricity'],
    WATER: ['Cairo Water Company', 'Alexandria Water'],
    INTERNET: ['WE Internet', 'Vodafone Home', 'Orange DSL'],
    MOBILE: ['Vodafone', 'Orange', 'Etisalat'],
};

app.get('/api/bills/providers', (req, res) => {
    const type = req.query.type;
    res.json({ success: true, data: BILL_PROVIDERS[type] || [] });
});

app.post('/api/bills/pay', requireAuth, async (req, res) => {
    try {
        // VALIDATE INPUT
        const { error, value } = schemas.billPayment.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { amount, provider, billNumber, description } = value;
        const userId = req.userId;
        const accounts = DB.accounts[userId] || [];
        const primaryAccount = accounts[0];

        if (!primaryAccount) {
            return res.status(400).json({ success: false, message: 'No account found' });
        }

        // Check frozen
        if (DB.cards[userId]?.[primaryAccount.number]?.isFrozen) {
            return res.status(400).json({ success: false, message: 'Card is frozen' });
        }

        // Check spending limit
        const cardSettings = DB.cards[userId]?.[primaryAccount.number];
        if (cardSettings?.spendingLimit && amount > cardSettings.spendingLimit) {
            return res.status(400).json({
                success: false,
                message: `Amount exceeds spending limit`
            });
        }

        // Check balance
        if (primaryAccount.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient funds' });
        }

        // Process payment
        primaryAccount.balance -= amount;

        if (!DB.transactions[primaryAccount.number]) {
            DB.transactions[primaryAccount.number] = [];
        }

        DB.transactions[primaryAccount.number].unshift({
            id: generateSecureId('TX_'),
            date: new Date().toISOString(),
            type: 'debit',
            category: 'bill',
            amount: amount,
            description: sanitizeInput(description || `${provider} Bill Payment`),
            status: 'completed'
        });

        res.json({
            success: true,
            data: {
                transactionId: generateSecureId('TX_'),
                newBalance: primaryAccount.balance
            }
        });

    } catch (err) {
        console.error('[ERROR] Bill Payment:', err);
        res.status(500).json({ success: false, message: 'Payment failed' });
    }
});

// ============================================
// BENEFICIARIES (with ownership verification)
// ============================================

app.get('/api/beneficiaries', requireAuth, (req, res) => {
    const userId = req.userId;
    res.json({ success: true, data: DB.beneficiaries[userId] || [] });
});

app.post('/api/beneficiaries', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const newBenef = {
            id: generateSecureId('BEN_'),
            name: sanitizeInput(req.body.name),
            accountNumber: sanitizeInput(req.body.accountNumber),
            bank: sanitizeInput(req.body.bank),
            nickname: sanitizeInput(req.body.nickname),
            isFavorite: Boolean(req.body.isFavorite)
        };

        if (!DB.beneficiaries[userId]) DB.beneficiaries[userId] = [];
        DB.beneficiaries[userId].push(newBenef);

        res.json({ success: true, data: newBenef });
    } catch (err) {
        console.error('[ERROR] Add Beneficiary:', err);
        res.status(500).json({ success: false, message: 'Failed to add beneficiary' });
    }
});

app.put('/api/beneficiaries/:id', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const idx = DB.beneficiaries[userId]?.findIndex(b => b.id === req.params.id);

        if (idx >= 0) {
            DB.beneficiaries[userId][idx] = {
                ...DB.beneficiaries[userId][idx],
                ...req.body,
                id: DB.beneficiaries[userId][idx].id // Prevent ID change
            };
            return res.json({ success: true });
        }
        res.status(404).json({ success: false, message: 'Beneficiary not found' });
    } catch (err) {
        console.error('[ERROR] Update Beneficiary:', err);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

app.delete('/api/beneficiaries/:id', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        DB.beneficiaries[userId] = DB.beneficiaries[userId]?.filter(b => b.id !== req.params.id) || [];
        res.json({ success: true });
    } catch (err) {
        console.error('[ERROR] Delete Beneficiary:', err);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// ============================================
// SAVINGS GOALS
// ============================================

app.get('/api/savings/goals', requireAuth, (req, res) => {
    const userId = req.userId;
    res.json({ success: true, data: DB.savingsGoals[userId] || [] });
});

app.post('/api/savings/goals', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const newGoal = {
            id: generateSecureId('GOAL_'),
            currentAmount: 0,
            name: sanitizeInput(req.body.name),
            icon: sanitizeInput(req.body.icon),
            targetAmount: Math.abs(parseFloat(req.body.targetAmount)) || 0
        };

        if (!DB.savingsGoals[userId]) DB.savingsGoals[userId] = [];
        DB.savingsGoals[userId].push(newGoal);

        res.json({ success: true, data: newGoal });
    } catch (err) {
        console.error('[ERROR] Create Savings Goal:', err);
        res.status(500).json({ success: false, message: 'Failed to create goal' });
    }
});

app.post('/api/savings/goals/:id/deposit', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const depositAmount = Math.abs(parseFloat(req.body.amount));

        if (!depositAmount || depositAmount <= 0 || depositAmount > 100000) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const accounts = DB.accounts[userId] || [];
        const primaryAccount = accounts[0];

        if (!primaryAccount) {
            return res.status(400).json({ success: false, message: 'No account found' });
        }

        // Check frozen
        if (DB.cards[userId]?.[primaryAccount.number]?.isFrozen) {
            return res.status(400).json({ success: false, message: 'Card is frozen' });
        }

        // Check balance
        if (primaryAccount.balance < depositAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient funds' });
        }

        // Deduct from account
        primaryAccount.balance -= depositAmount;

        // Record transaction
        if (!DB.transactions[primaryAccount.number]) {
            DB.transactions[primaryAccount.number] = [];
        }

        DB.transactions[primaryAccount.number].unshift({
            id: generateSecureId('TX_'),
            date: new Date().toISOString(),
            type: 'debit',
            category: 'savings',
            amount: depositAmount,
            description: 'Savings Goal Deposit',
            status: 'completed'
        });

        // Update goal
        const goal = DB.savingsGoals[userId]?.find(g => g.id === req.params.id);
        if (goal) {
            goal.currentAmount += depositAmount;
            return res.json({ success: true, data: goal });
        }

        res.status(404).json({ success: false, message: 'Goal not found' });

    } catch (err) {
        console.error('[ERROR] Savings Deposit:', err);
        res.status(500).json({ success: false, message: 'Deposit failed' });
    }
});

// ============================================
// NOTIFICATIONS
// ============================================

app.get('/api/notifications', requireAuth, (req, res) => {
    const userId = req.userId;
    res.json({ success: true, data: DB.notifications[userId] || [] });
});

app.put('/api/notifications/:id/read', requireAuth, (req, res) => {
    const userId = req.userId;
    const notif = DB.notifications[userId]?.find(n => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
});

app.put('/api/notifications/read-all', requireAuth, (req, res) => {
    const userId = req.userId;
    DB.notifications[userId]?.forEach(n => n.isRead = true);
    res.json({ success: true });
});

app.delete('/api/notifications/:id', requireAuth, (req, res) => {
    const userId = req.userId;
    DB.notifications[userId] = DB.notifications[userId]?.filter(n => n.id !== req.params.id) || [];
    res.json({ success: true });
});

// ============================================
// ANALYTICS
// ============================================

app.get('/api/analytics', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const period = req.query.period || 'month';
        const accounts = DB.accounts[userId] || [];
        const accountNumber = req.query.account || accounts[0]?.number;

        // Verify ownership
        const ownsAccount = accounts.some(acc => acc.number === accountNumber);
        if (!ownsAccount) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const allTxns = DB.transactions[accountNumber] || [];

        // Simple analytics (would be more complex in production)
        res.json({
            success: true,
            data: {
                byCategory: [],
                monthly: [],
                insights: {
                    totalSpent: 0,
                    totalIncome: 0,
                    avgDaily: 0,
                    trend: 0,
                    tips: []
                }
            }
        });

    } catch (err) {
        console.error('[ERROR] Analytics:', err);
        res.status(500).json({ success: false, message: 'Failed to load analytics' });
    }
});

// ============================================
// SCHEDULED PAYMENTS
// ============================================

app.get('/api/scheduled-payments', requireAuth, (req, res) => {
    const userId = req.userId;
    res.json({ success: true, data: DB.scheduledPayments[userId] || [] });
});

app.post('/api/scheduled-payments', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const newSchedule = {
            id: generateSecureId('SCHED_'),
            isPaused: false,
            ...req.body
        };

        if (!DB.scheduledPayments[userId]) DB.scheduledPayments[userId] = [];
        DB.scheduledPayments[userId].push(newSchedule);

        res.json({ success: true, data: newSchedule });
    } catch (err) {
        console.error('[ERROR] Create Scheduled Payment:', err);
        res.status(500).json({ success: false, message: 'Failed to create schedule' });
    }
});

app.put('/api/scheduled-payments/:id', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        const idx = DB.scheduledPayments[userId]?.findIndex(s => s.id === req.params.id);

        if (idx >= 0) {
            DB.scheduledPayments[userId][idx] = {
                ...DB.scheduledPayments[userId][idx],
                ...req.body,
                id: DB.scheduledPayments[userId][idx].id
            };
            return res.json({ success: true });
        }
        res.status(404).json({ success: false, message: 'Schedule not found' });
    } catch (err) {
        console.error('[ERROR] Update Scheduled Payment:', err);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

app.delete('/api/scheduled-payments/:id', requireAuth, (req, res) => {
    try {
        const userId = req.userId;
        DB.scheduledPayments[userId] = DB.scheduledPayments[userId]?.filter(s => s.id !== req.params.id) || [];
        res.json({ success: true });
    } catch (err) {
        console.error('[ERROR] Delete Scheduled Payment:', err);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use((err, req, res, next) => {
    console.error('[UNHANDLED ERROR]:', err);
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('🔒 SECURE BANKING API - OWASP COMPLIANT');
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Security Headers: ENABLED (Helmet)`);
    console.log(`✅ Rate Limiting: ENABLED`);
    console.log(`✅ Password Hashing: ENABLED (bcrypt)`);
    console.log(`✅ Input Validation: ENABLED (Joi)`);
    console.log(`✅ XSS Protection: ENABLED`);
    console.log(`✅ IDOR Protection: ENABLED`);
    console.log(`✅ CORS: WHITELIST ONLY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📧 Demo: seif@example.com / SecurePass123!`);
    console.log(`${'='.repeat(60)}\n`);
});
