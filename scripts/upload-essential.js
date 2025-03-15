/**
 * Script para subir solo archivos esenciales al servidor FTP
 * Creado para Miss Star International
 */

const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Configuración FTP
const FTP_CONFIG = {
  host: 'web0151.zxcs.nl',
  user: 'u127684p143111',
  password: 'C^F]TDaQ0h579taQ2oKI|(o',
  secure: false,
  port: 21
};

// Lista de archivos esenciales a subir
const ESSENTIAL_FILES = [
  // Archivos principales
  { local: 'index.html', remote: '/index.html' },
  { local: 'assets/images/logo/logo-main1.png', remote: '/assets/images/logo/logo-main1.png' },
  
  // Archivos de franquicias
  { local: 'assets/images/franchises/peru.jpg', remote: '/assets/images/franchises/peru.jpg' },
  { local: 'assets/images/franchises/mexico.jpg', remote: '/assets/images/franchises/mexico.jpg' },
  { local: 'assets/images/franchises/brazil.jpg', remote: '/assets/images/franchises/brazil.jpg' },
  { local: 'assets/images/franchises/thailand.jpg', remote: '/assets/images/franchises/thailand.jpg' },
  { local: 'assets/images/franchises/vietnam.jpg', remote: '/assets/images/franchises/vietnam.jpg' },
  { local: 'assets/images/franchises/spain.jpg', remote: '/assets/images/franchises/spain.jpg' },
  { local: 'assets/images/franchises/netherlands.jpg', remote: '/assets/images/franchises/netherlands.jpg' },
  
  // Banderas
  { local: 'assets/images/flags/en.svg', remote: '/assets/images/flags/en.svg' },
  { local: 'assets/images/flags/es.svg', remote: '/assets/images/flags/es.svg' },
  { local: 'assets/images/flags/pt.svg', remote: '/assets/images/flags/pt.svg' },
  { local: 'assets/images/flags/th.svg', remote: '/assets/images/flags/th.svg' },
  { local: 'assets/images/flags/vi.svg', remote: '/assets/images/flags/vi.svg' }
];

/**
 * Función para esperar un tiempo determinado
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función para asegurar que un directorio existe
 */
async function ensureDirectoryExists(client, remotePath) {
  try {
    const parts = remotePath.split('/').filter(p => p);
    let currentPath = '/';
    
    for (const part of parts) {
      currentPath = path.posix.join(currentPath, part);
      try {
        await client.ensureDir(currentPath);
      } catch (error) {
        console.log(`Creando directorio: ${currentPath}`);
        await client.mkdir(currentPath);
      }
    }
  } catch (error) {
    console.error(`Error al crear directorios: ${error.message}`);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🔄 Iniciando subida de archivos esenciales...');
  
  const client = new ftp.Client();
  client.ftp.verbose = false;
  
  try {
    console.log(`🔌 Conectando a ${FTP_CONFIG.host}...`);
    
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: false
    });
    
    console.log('✅ Conexión establecida');
    
    // Subir cada archivo esencial
    let uploadedCount = 0;
    
    for (const file of ESSENTIAL_FILES) {
      try {
        const localPath = path.join(process.cwd(), file.local);
        const remoteDir = path.posix.dirname(file.remote);
        
        // Verificar si el archivo local existe
        try {
          await stat(localPath);
        } catch (error) {
          console.log(`⚠️ Archivo no encontrado: ${file.local}, omitiendo...`);
          continue;
        }
        
        // Asegurar que el directorio remoto existe
        await ensureDirectoryExists(client, remoteDir);
        
        // Subir el archivo
        console.log(`📤 Subiendo: ${file.local} -> ${file.remote}`);
        await client.uploadFrom(localPath, file.remote);
        uploadedCount++;
        
        // Pequeña pausa entre archivos para evitar sobrecarga
        await sleep(500);
      } catch (error) {
        console.error(`❌ Error al subir ${file.local}: ${error.message}`);
      }
    }
    
    console.log(`✅ Subida completada. Se subieron ${uploadedCount} de ${ESSENTIAL_FILES.length} archivos esenciales.`);
  } catch (error) {
    console.error(`❌ Error durante la subida: ${error.message}`);
    process.exit(1);
  } finally {
    try {
      client.close();
      console.log('🔌 Conexión cerrada');
    } catch (e) {
      // Ignorar errores al cerrar
    }
  }
}

// Ejecutar script
main().catch(err => {
  console.error('Error global:', err);
  process.exit(1);
}); 