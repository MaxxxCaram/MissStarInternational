const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/database');
const Action = require('./models/Action');
const History = require('./models/History');
const authMiddleware = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const Role = require('./models/Role');
const User = require('./models/User');
const path = require('path');
const { createCorporateEmail } = require('./scripts/create-email');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Determine environment
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// MongoDB connection
mongoose.connect(config.url, config.options)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const translationSchema = new mongoose.Schema({
    originalText: String,
    translations: [{
        language: String,
        text: String
    }],
    timestamp: { type: Date, default: Date.now }
});

const Translation = mongoose.model('Translation', translationSchema);

// Routes
app.post('/api/translations', async (req, res) => {
    try {
        const translation = new Translation(req.body);
        await translation.save();
        res.status(201).json(translation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/translations', async (req, res) => {
    try {
        const translations = await Translation.find();
        res.json(translations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Action logging routes
app.post('/api/actions', async (req, res) => {
    try {
        const { action, details } = req.body;
        const newAction = new Action({
            action,
            details
        });
        await newAction.save();
        res.status(201).json(newAction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/actions', async (req, res) => {
    try {
        const actions = await Action.find()
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(actions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// History routes
app.post('/api/history', async (req, res) => {
    try {
        const { action, details, userId, sessionId, metadata } = req.body;
        const history = new History({
            action,
            details,
            userId,
            sessionId,
            metadata
        });
        await history.save();
        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const { userId, action, startDate, endDate } = req.query;
        let query = {};

        if (userId) query.userId = userId;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const history = await History.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(req.query.limit) || 100);

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected routes
app.use('/api/history', authMiddleware);
app.use('/api/translations', authMiddleware);

// Authentication route
app.post('/api/auth', async (req, res) => {
    const { apiKey } = req.body;
    
    if (apiKey === config.aiApiKey) {
        const token = jwt.sign(
            { role: 'ai', permissions: ['write', 'read'] },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid API key' });
    }
});

// User and role routes
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/roles', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save route
app.post('/api/analytics', async (req, res) => {
    try {
        const event = req.body;
        // Save to MongoDB
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Language routing middleware
app.use((req, res, next) => {
    const userLang = req.acceptsLanguages(['en', 'es', 'pt', 'th']) || 'en';
    req.userLanguage = userLang;
    next();
});

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Language-specific routes
app.get('/:lang', (req, res) => {
    const validLangs = ['en', 'es', 'pt', 'th'];
    const lang = req.params.lang;
    
    if (validLangs.includes(lang)) {
        res.sendFile(path.join(__dirname, `${lang}/index.html`));
    } else {
        res.redirect('/');
    }
});

// History routes
app.get('/:lang/history', (req, res) => {
    const lang = req.params.lang;
    res.sendFile(path.join(__dirname, `${lang}/history.html`));
});

// Conference routes
app.get('/:lang/conference', (req, res) => {
    const lang = req.params.lang;
    res.sendFile(path.join(__dirname, `${lang}/conference.html`));
});

// Email management routes
app.post('/api/email/create', authMiddleware, async (req, res) => {
    try {
        const result = await createCorporateEmail(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 