const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    preferences: {
        language: String,
        theme: String,
        notifications: Boolean
    },
    lastLogin: Date,
    loginHistory: [{
        date: Date,
        ip: String,
        device: String
    }]
});

module.exports = mongoose.model('User', userSchema); 