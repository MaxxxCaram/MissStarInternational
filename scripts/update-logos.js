const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('Conectando al servidor FTP...');
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    console.log('Subiendo logos...');
    
    // Subir los logos
    const logoFiles = [
      { local: '../assets/images/logo/logo-main1.png', remote: '/assets/images/logo/logo-main1.png' },
      { local: '../assets/images/logo/logo-main1.png', remote: '/assets/images/logo/logo.png' },
      { local: '../assets/images/logo/logo-main1.png', remote: '/assets/images/logo/logo-main.png' }
    ];

    for (const logoFile of logoFiles) {
      try {
        console.log(`Subiendo ${logoFile.local} a ${logoFile.remote}...`);
        await client.uploadFrom(
          path.join(__dirname, logoFile.local),
          logoFile.remote
        );
        console.log(`Logo ${logoFile.remote} subido correctamente.`);
      } catch (err) {
        console.error(`Error al subir ${logoFile.remote}:`, err);
      }
    }
    
    console.log('¡Actualización de logos completada con éxito!');
  } catch (err) {
    console.error('Error durante la actualización:', err);
  } finally {
    client.close();
  }
}

main(); 