const ftp = require('basic-ftp');
require('dotenv').config();

async function testConnection() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🔍 Probando conexión FTP...');
    console.log(`Host: ${process.env.FTP_HOST || 'web0151.zxcs.nl'}`);
    console.log(`Usuario: ${process.env.FTP_USERNAME || 'u127684p143111'}`);
    console.log('Contraseña: ***********');
    
    await client.access({
      host: process.env.FTP_HOST || 'web0151.zxcs.nl',
      user: process.env.FTP_USERNAME || 'u127684p143111',
      password: process.env.FTP_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    console.log('✅ Conexión FTP exitosa!');
    console.log('📂 Listando directorios:');
    
    const list = await client.list();
    list.forEach(item => {
      console.log(`- ${item.name} (${item.type === 1 ? 'archivo' : 'directorio'})`);
    });
    
    // Intentar navegar al directorio de destino
    try {
      console.log('\n📁 Intentando navegar al directorio de destino...');
      await client.cd('/domains/missstarinternational.com/public_html');
      console.log('✅ Navegación exitosa al directorio de destino');
      
      // Listar contenido del directorio
      console.log('📂 Contenido del directorio:');
      const dirContent = await client.list();
      dirContent.forEach(item => {
        console.log(`- ${item.name} (${item.type === 1 ? 'archivo' : 'directorio'})`);
      });
    } catch (err) {
      console.error('❌ Error al navegar al directorio de destino:', err.message);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Conexión FTP fallida:', err.message);
    if (err.code === 530) {
      console.log('\n⚠️ Error de autenticación: Credenciales incorrectas');
      console.log('Por favor, verifica tu nombre de usuario y contraseña');
    }
    return false;
  } finally {
    client.close();
  }
}

console.log('================================================');
console.log('   PRUEBA DE CREDENCIALES FTP');
console.log('================================================');

testConnection().then(success => {
  console.log('\n================================================');
  if (success) {
    console.log('✅ PRUEBA EXITOSA: Las credenciales FTP son correctas');
  } else {
    console.log('❌ PRUEBA FALLIDA: Las credenciales FTP no funcionan');
    console.log('\nPosibles soluciones:');
    console.log('1. Verifica el nombre de usuario y contraseña');
    console.log('2. Asegúrate de que el servidor FTP esté disponible');
    console.log('3. Verifica si hay restricciones de IP en el servidor');
  }
  console.log('================================================');
}); 