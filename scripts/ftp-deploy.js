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

// Configuración de reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 segundos

// Directorios a excluir
const EXCLUDE_DIRS = [
  '.git',
  'node_modules',
  '.vscode',
  '.vs',
  '.venv',
  'browser-tools-mcp',
  'imap' // Excluir directorio imap que está causando problemas
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
 * Función para esperar un tiempo determinado
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función para subir un archivo con reintentos
 */
async function uploadFileWithRetry(client, localPath, remotePath, retries = 0) {
  try {
    await client.uploadFrom(localPath, remotePath);
    return true;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`⚠️ Error al subir ${path.basename(localPath)}, reintentando (${retries + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY);
      return uploadFileWithRetry(client, localPath, remotePath, retries + 1);
    } else {
      throw error;
    }
  }
}

/**
 * Función para reconectar al servidor FTP
 */
async function reconnectFTP(client) {
  try {
    // Cerrar conexión existente si está abierta
    try {
      client.close();
    } catch (e) {
      // Ignorar errores al cerrar
    }
    
    console.log('🔄 Reconectando al servidor FTP...');
    await sleep(RETRY_DELAY);
    
    // Crear nueva conexión
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: false
    });
    
    console.log('✅ Reconexión exitosa');
    return true;
  } catch (error) {
    console.error(`❌ Error al reconectar: ${error.message}`);
    return false;
  }
}

/**
 * Función para subir un directorio recursivamente
 */
async function uploadDirectory(client, localPath, remotePath, depth = 0) {
  // Reducir verbosidad, solo mostrar directorios principales
  if (depth <= 1) {
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
      
      try {
        const itemStat = await stat(localItemPath);
        
        if (itemStat.isDirectory()) {
          // Subir subdirectorio recursivamente
          await uploadDirectory(client, localItemPath, remoteItemPath, depth + 1);
        } else {
          // Reducir verbosidad, no mostrar cada archivo
          filesUploaded++;
          
          // Mostrar progreso cada 10 archivos
          if (filesUploaded % 10 === 0) {
            console.log(`📤 Archivos subidos: ${filesUploaded}`);
          }
          
          // Subir archivo con reintentos
          await uploadFileWithRetry(client, localItemPath, remoteItemPath);
        }
      } catch (error) {
        if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
          console.error(`⚠️ Error de conexión: ${error.message}`);
          
          // Intentar reconectar
          const reconnected = await reconnectFTP(client);
          if (reconnected) {
            // Reintentar el elemento actual
            console.log(`🔄 Reintentando ${item}...`);
            // Reducir el contador para no contar dos veces
            if (!itemStat || !itemStat.isDirectory()) {
              filesUploaded--;
            } else {
              directoriesProcessed--;
            }
            // Volver a procesar el elemento
            const itemStat = await stat(localItemPath);
            if (itemStat.isDirectory()) {
              await uploadDirectory(client, localItemPath, remoteItemPath, depth + 1);
            } else {
              filesUploaded++;
              await uploadFileWithRetry(client, localItemPath, remoteItemPath);
            }
          } else {
            throw new Error(`No se pudo reconectar al servidor FTP después de error: ${error.message}`);
          }
        } else {
          console.error(`❌ Error al procesar ${localItemPath}: ${error.message}`);
          // Continuar con el siguiente elemento
        }
      }
    }
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      console.error(`⚠️ Error de conexión en directorio ${localPath}: ${error.message}`);
      
      // Intentar reconectar
      const reconnected = await reconnectFTP(client);
      if (reconnected) {
        // Reintentar el directorio actual
        console.log(`🔄 Reintentando directorio ${path.basename(localPath)}...`);
        await uploadDirectory(client, localPath, remotePath, depth);
      } else {
        throw new Error(`No se pudo reconectar al servidor FTP después de error: ${error.message}`);
      }
    } else {
      console.error(`❌ Error al procesar directorio ${localPath}: ${error.message}`);
      // No lanzar el error para continuar con otros directorios
    }
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🔄 Iniciando despliegue FTP...');
  
  const client = new ftp.Client();
  client.ftp.verbose = false; // Desactivar mensajes detallados
  
  // Configurar tiempos de espera más largos
  client.ftp.socket.setTimeout(60000); // 60 segundos
  
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