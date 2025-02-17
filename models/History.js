const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    action: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
    userId: String,
    sessionId: String,
    metadata: {
        browser: String,
        os: String,
        ip: String
    }
});

// Indexación para mejorar el rendimiento
historySchema.index({ timestamp: -1 });
historySchema.index({ action: 1 });
historySchema.index({ userId: 1 });

module.exports = mongoose.model('History', historySchema); 