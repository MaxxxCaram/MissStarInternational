const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conexión exitosa a MongoDB');
        
        // Probar crear una colección
        await mongoose.connection.db.createCollection('test');
        console.log('✅ Prueba de escritura exitosa');
        
        // Limpiar
        await mongoose.connection.db.dropCollection('test');
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testConnection(); 