/**
 * Script para probar la conexión a MongoDB
 */
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔄 Probando conexión a MongoDB...');
  
  try {
    // Mostrar URI sin mostrar contraseña
    const uri = process.env.MONGODB_URI || 'No configurado';
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`📄 URI: ${maskedUri}`);
    
    // Intentar conexión
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexión exitosa a MongoDB');
    
    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Colecciones disponibles:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Verificar modelos
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String
    }));
    
    const count = await User.countDocuments();
    console.log(`👤 Usuarios en la base de datos: ${count}`);
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada correctamente');
    
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:');
    console.error(error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n⚠️ Posibles soluciones:');
      console.log('1. Verifica que el usuario y contraseña en MONGODB_URI sean correctos');
      console.log('2. Asegúrate que la IP desde donde te conectas esté en la lista blanca de MongoDB Atlas');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n⚠️ Posibles soluciones:');
      console.log('1. Verifica que el nombre del host en MONGODB_URI sea correcto');
      console.log('2. Asegúrate de tener conexión a internet');
    }
  }
}

// Ejecutar prueba
testConnection().catch(console.error); 