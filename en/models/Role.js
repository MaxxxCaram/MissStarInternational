const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: String,
    permissions: [{
        resource: String,  // 'conference', 'history', 'translations'
        actions: [String]  // 'read', 'write', 'delete', 'admin'
    }]
});

module.exports = mongoose.model('Role', roleSchema); 