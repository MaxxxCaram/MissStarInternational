const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Función para conectar al FTP
async function connectFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  await client.access({
    host: 'web0151.zxcs.nl',
    user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
    password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
    secure: false
  });
  
  return client;
}

// Sube un solo archivo con reintentos
async function uploadSingleFile(logoPath, destination) {
  let client = null;
  
  try {
    console.log(`Subiendo logo a: ${destination}`);
    client = await connectFTP();
    
    await client.uploadFrom(logoPath, destination);
    console.log(`✅ Logo subido exitosamente a: ${destination}`);
    return true;
  } catch (err) {
    console.error(`❌ Error al subir a ${destination}:`, err.message);
    return false;
  } finally {
    if (client) {
      client.close();
    }
  }
}

async function main() {
  console.log('🔄 ACTUALIZANDO LOGOS DEL SITIO');
  
  // Ruta exacta del logo en el sistema local
  const logoPath = "E:\\MissStarInternational\\assets\\images\\logo\\logo-main1.png";
  
  // Verificar que el archivo exista
  if (!fs.existsSync(logoPath)) {
    console.error(`❌ El archivo de logo no existe en: ${logoPath}`);
    return;
  } else {
    console.log(`✅ Logo encontrado en: ${logoPath}`);
  }
  
  // Destinos principales para el logo
  const destinations = [
    '/assets/images/logo/logo.png',
    '/assets/images/logo/logo-main.png',
    '/assets/images/logo/logo-main1.png',
    '/assets/images/logo.png'
  ];
  
  // Subir cada logo por separado
  for (const dest of destinations) {
    await uploadSingleFile(logoPath, dest);
    // Esperar un momento entre subidas para evitar sobrecargar la conexión
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ ACTUALIZACIÓN DE LOGOS COMPLETADA');
}

main().catch(err => {
  console.error('Error general:', err);
}); 