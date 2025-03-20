const mongoose = require('mongoose');
const History = require('../models/History');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conexión exitosa a MongoDB');
        
        // Ejecutar pruebas CRUD
        await testCRUD();
        
        console.log('✅ Todas las pruebas completadas');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Test CRUD operations
async function testCRUD() {
    try {
        // Create
        const testDoc = new History({
            action: 'test',
            details: 'Testing CRUD operations',
            userId: 'test-user'
        });
        await testDoc.save();
        console.log('✅ Create: Exitoso');

        // Read
        const doc = await History.findOne({ action: 'test' });
        console.log('✅ Read: Exitoso');

        // Update
        await History.updateOne(
            { _id: doc._id },
            { $set: { details: 'Updated test' }}
        );
        console.log('✅ Update: Exitoso');

        // Delete
        await History.deleteOne({ _id: doc._id });
        console.log('✅ Delete: Exitoso');

    } catch (error) {
        console.error('❌ Error en CRUD:', error);
    }
}

testConnection(); 