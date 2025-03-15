/**
 * Script para subir archivos al servidor FTP
 * Creado para Miss Star International
 */

const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuración FTP
const FTP_CONFIG = {
  host: 'web0151.zxcs.nl',
  user: 'u127684p143111',
  password: 'C^F]TDaQ0h579taQ2oKI|(o',
  secure: false, // Cambiado a false para evitar problemas de certificado
  port: 21
};

// Directorios a excluir
const EXCLUDE_DIRS = [
  '.git',
  'node_modules',
  '.vscode',
  '.vs',
  '.venv',
  'browser-tools-mcp'
];

// Archivos a excluir
const EXCLUDE_FILES = [
  '.DS_Store',
  'Thumbs.db',
  '.gitignore',
  '.cspell.json'
];

// Contador de archivos procesados
let filesUploaded = 0;
let directoriesProcessed = 0;

/**
 * Función para verificar si un archivo o directorio debe ser excluido
 */
function shouldExclude(name) {
  if (EXCLUDE_DIRS.includes(name) || EXCLUDE_FILES.includes(name)) {
    return true;
  }
  
  // Excluir archivos temporales y de respaldo
  if (name.startsWith('.') || name.endsWith('~') || name.endsWith('.bak')) {
    return true;
  }
  
  return false;
}

/**
 * Función para subir un directorio recursivamente
 */
async function uploadDirectory(client, localPath, remotePath) {
  // Reducir verbosidad, solo mostrar directorios principales
  if (remotePath === '/' || remotePath.split('/').length <= 2) {
    console.log(`📂 Procesando directorio: ${path.basename(localPath)}`);
  }
  
  directoriesProcessed++;
  
  try {
    // Crear directorio remoto si no existe
    await client.ensureDir(remotePath);
    
    // Leer contenido del directorio
    const items = await readdir(localPath);
    
    // Procesar cada elemento
    for (const item of items) {
      if (shouldExclude(item)) {
        // Reducir verbosidad, no mostrar cada exclusión
        continue;
      }
      
      const localItemPath = path.join(localPath, item);
      const remoteItemPath = path.join(remotePath, item).replace(/\\/g, '/');
      const itemStat = await stat(localItemPath);
      
      if (itemStat.isDirectory()) {
        // Subir subdirectorio recursivamente
        await uploadDirectory(client, localItemPath, remoteItemPath);
      } else {
        // Reducir verbosidad, no mostrar cada archivo
        filesUploaded++;
        
        // Mostrar progreso cada 10 archivos
        if (filesUploaded % 10 === 0) {
          console.log(`📤 Archivos subidos: ${filesUploaded}`);
        }
        
        await client.uploadFrom(localItemPath, remoteItemPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${localPath}: ${error.message}`);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🔄 Iniciando despliegue FTP...');
  
  const client = new ftp.Client();
  client.ftp.verbose = false; // Desactivar mensajes detallados
  
  try {
    console.log(`🔌 Conectando a ${FTP_CONFIG.host}...`);
    
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: false
    });
    
    console.log('✅ Conexión establecida');
    console.log('📤 Iniciando subida de archivos...');
    
    // Obtener directorio local (raíz del proyecto)
    const localDir = path.resolve(__dirname, '..');
    
    // Subir todo el directorio
    await uploadDirectory(client, localDir, '/');
    
    console.log(`✅ Despliegue completado con éxito. Se subieron ${filesUploaded} archivos en ${directoriesProcessed} directorios.`);
  } catch (error) {
    console.error(`❌ Error durante el despliegue: ${error.message}`);
    process.exit(1);
  } finally {
    client.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar script
main().catch(err => {
  console.error('Error global:', err);
  process.exit(1);
}); 