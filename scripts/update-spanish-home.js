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
      user: process.env.FTP_USER || 'u127684p143111',
      password: process.env.FTP_PASSWORD || 'a9Kw5!%a0X',
      secure: false
    });

    console.log('Subiendo página principal en español...');
    
    // Subir el archivo es/index.html actualizado
    await client.uploadFrom(
      path.join(__dirname, '../es/index.html'),
      '/es/index.html'
    );
    
    console.log('¡Actualización completada con éxito!');
  } catch (err) {
    console.error('Error durante la actualización:', err);
  } finally {
    client.close();
  }
}

main(); 