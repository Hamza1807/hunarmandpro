const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// In-memory database (Replace with actual database in production)
let userData = {
    availableBalance: 0.00,
    withdrawnTotal: 1479.20,
    transactions: [
        {
            id: 1,
            date: '2025-09-10',
            activity: 'Withdrawal',
            description: 'Transferred successfully',
            order: null,
            amount: 40.00
        },
        {
            id: 2,
            date: '2025-09-10',
            activity: 'Withdrawal',
            description: 'Transferred successfully',
            order: null,
            amount: 40.00
        }
    ]
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'HunarmandPro API is running!' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/gigs', require('./routes/gigs'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/payments', require('./routes/payments'));

// Get dashboard data
app.get('/api/dashboard', (req, res) => {
    res.json({
        availableBalance: userData.availableBalance,
        withdrawnTotal: userData.withdrawnTotal
    });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
    res.json(userData.transactions);
});

// Process withdrawal
app.post('/api/withdraw', (req, res) => {
    const { amount, accountType } = req.body;
    
    // Validation
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    
    if (amount > userData.availableBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    if (!accountType) {
        return res.status(400).json({ error: 'Account type is required' });
    }
    
    // Process withdrawal
    userData.availableBalance -= amount;
    userData.withdrawnTotal += amount;
    
    // Add transaction record
    const newTransaction = {
        id: userData.transactions.length + 1,
        date: new Date().toISOString().split('T')[0],
        activity: 'Withdrawal',
        description: 'Transferred successfully',
        order: null,
        amount: amount
    };
    
    userData.transactions.unshift(newTransaction);
    
    // Log withdrawal details
    console.log(`Withdrawal processed: $${amount} to ${accountType}`);
    
    res.json({
        success: true,
        message: 'Withdrawal processed successfully',
        transaction: newTransaction,
        newBalance: userData.availableBalance
    });
});

// Add funds (for testing purposes)
app.post('/api/add-funds', (req, res) => {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    
    userData.availableBalance += amount;
    
    res.json({
        success: true,
        message: 'Funds added successfully',
        newBalance: userData.availableBalance
    });
});

// Update user data (for testing)
app.put('/api/user-data', (req, res) => {
    const { availableBalance, withdrawnTotal } = req.body;
    
    if (availableBalance !== undefined) {
        userData.availableBalance = availableBalance;
    }
    
    if (withdrawnTotal !== undefined) {
        userData.withdrawnTotal = withdrawnTotal;
    }
    
    res.json({
        success: true,
        message: 'User data updated',
        userData: {
            availableBalance: userData.availableBalance,
            withdrawnTotal: userData.withdrawnTotal
        }
    });
});

// Get account details
app.get('/api/accounts', (req, res) => {
    // Mock account data
    const accounts = [
        { type: 'easy_paisa', name: 'Easy Paisa Account', accountNumber: '03XX-XXXXXXX' },
        { type: 'jazz_cash', name: 'Jazz Cash Account', accountNumber: '03XX-XXXXXXX' },
        { type: 'payoneer', name: 'Payoneer Account', email: 'user@email.com' },
        { type: 'bank', name: 'Bank Account', accountNumber: 'XXXX-XXXX-XXXX-1234' }
    ];
    
    res.json(accounts);
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', require('./routes/upload'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

