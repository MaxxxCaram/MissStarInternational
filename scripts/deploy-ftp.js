/**
 * Script para automatizar el despliegue FTP y limpieza
 * Creado para Miss Star International
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const execAsync = util.promisify(exec);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);
const ftp = require('basic-ftp');
const chalk = require('chalk'); // Para colorear la salida en la consola
require('dotenv').config();

// Scripts obsoletos a eliminar
const OBSOLETE_SCRIPTS = [
  'deploy.sh',
  'deploy-all.js',
  'backup.js',
  'setup-server.sh',
  'setup-ssl.sh'
];

// Configuración FTP
const FTP_CONFIG = {
  host: process.env.FTP_HOST || 'web0151.zxcs.nl',
  user: process.env.FTP_USERNAME || 'u127684p143111',
  password: process.env.FTP_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
  secure: false,
  remoteDir: '/domains/missstarinternational.com/public_html'
};

// Lista de archivos y carpetas a ignorar
const IGNORE_LIST = [
  '.git',
  'node_modules',
  '.env',
  '.gitignore',
  'scripts',
  'package-lock.json',
  'README.md',
  '.DS_Store'
];

// Lista de extensiones de archivo que se deben transferir en modo ASCII
const ASCII_EXTENSIONS = [
  '.html', '.css', '.js', '.json', '.txt', '.xml', '.svg'
];

/**
 * Función para limpiar scripts obsoletos
 */
async function cleanupScripts() {
  console.log('🧹 Limpiando scripts obsoletos...');
  
  const scriptsDir = path.resolve(__dirname);
  
  for (const script of OBSOLETE_SCRIPTS) {
    const scriptPath = path.join(scriptsDir, script);
    
    try {
      await stat(scriptPath);
      console.log(`🗑️ Eliminando script obsoleto: ${script}`);
      await unlink(scriptPath);
    } catch (error) {
      // El archivo no existe, ignorar
      console.log(`⏭️ Script no encontrado: ${script}`);
    }
  }
  
  console.log('✅ Limpieza de scripts completada');
}

// Función para determinar si un elemento debe ser ignorado
function shouldIgnore(filename) {
  return IGNORE_LIST.some(item => filename === item || filename.startsWith(item + '/'));
}

// Función para determinar si un archivo debe transferirse en modo ASCII
function shouldTransferAsAscii(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ASCII_EXTENSIONS.includes(ext);
}

// Función para mostrar el progreso de la carga
function showProgress(filename, total, current) {
  const percent = Math.round((current / total) * 100);
  process.stdout.write(`Subiendo ${filename}: ${percent}% [${current}/${total}]\r`);
}

// Función para sincronizar archivos y carpetas
async function syncFiles(client, localDir, remoteDir, isRoot = true) {
  console.log(`\n📂 Sincronizando ${localDir} → ${remoteDir}`);
  
  // Leer archivos locales
  const items = fs.readdirSync(localDir);
  let totalFiles = 0;
  let currentFile = 0;
  
  // Contar el número total de archivos para mostrar el progreso
  const countFiles = (dir) => {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (shouldIgnore(item)) continue;
      
      const localPath = path.join(dir, item);
      const stat = fs.statSync(localPath);
      
      if (stat.isDirectory()) {
        count += countFiles(localPath);
      } else if (stat.isFile()) {
        count++;
      }
    }
    return count;
  };
  
  if (isRoot) {
    totalFiles = countFiles(localDir);
    console.log(`🔍 Encontrados ${totalFiles} archivos para subir`);
  }
  
  // Crear el directorio remoto si no existe
  try {
    await client.ensureDir(remoteDir);
  } catch (err) {
    console.error(`❌ Error al acceder al directorio remoto ${remoteDir}: ${err.message}`);
    return;
  }
  
  // Procesar cada elemento
  for (const item of items) {
    if (shouldIgnore(item)) {
      console.log(`⏭️ Ignorando ${item}`);
      continue;
    }
    
    const localPath = path.join(localDir, item);
    const remotePath = path.join(remoteDir, item).replace(/\\/g, '/');
    const stat = fs.statSync(localPath);
    
    if (stat.isDirectory()) {
      // Es un directorio, descender recursivamente
      await syncFiles(client, localPath, remotePath, false);
    } else if (stat.isFile()) {
      try {
        // Establecer el tipo de transferencia según la extensión del archivo
        client.ftp.binary = !shouldTransferAsAscii(item);
        
        // Subir el archivo
        currentFile++;
        showProgress(item, totalFiles, currentFile);
        await client.uploadFrom(localPath, remotePath);
        
        if (isRoot) {
          process.stdout.write('\r' + ' '.repeat(100) + '\r'); // Limpiar la línea actual
          console.log(`✅ Subido ${item} (${currentFile}/${totalFiles})`);
        }
      } catch (err) {
        process.stdout.write('\r' + ' '.repeat(100) + '\r'); // Limpiar la línea actual
        console.error(`❌ Error al subir ${item}: ${err.message}`);
      }
    }
  }
}

// Función principal
async function deploy() {
  console.log('='.repeat(50));
  console.log('   DESPLIEGUE FTP - MISS STAR INTERNATIONAL');
  console.log('='.repeat(50));
  
  const client = new ftp.Client();
  client.ftp.verbose = false; // Cambiar a true para modo debug
  
  try {
    console.log(`🔌 Conectando a ${FTP_CONFIG.host}...`);
    
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      secure: FTP_CONFIG.secure
    });
    
    console.log(`✅ Conexión FTP exitosa!`);
    
    // Verificar si el directorio remoto existe
    try {
      await client.cd(FTP_CONFIG.remoteDir);
      console.log(`✅ Directorio remoto encontrado: ${FTP_CONFIG.remoteDir}`);
    } catch (err) {
      console.error(`❌ Error al acceder al directorio remoto: ${err.message}`);
      console.log(`🔄 Intentando crear el directorio remoto...`);
      
      try {
        await client.ensureDir(FTP_CONFIG.remoteDir);
        console.log(`✅ Directorio remoto creado: ${FTP_CONFIG.remoteDir}`);
      } catch (err) {
        console.error(`❌ No se pudo crear el directorio remoto: ${err.message}`);
        throw new Error('No se puede continuar con el despliegue');
      }
    }
    
    // Iniciar la sincronización
    const startTime = Date.now();
    await syncFiles(client, '.', FTP_CONFIG.remoteDir);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('='.repeat(50));
    console.log('   ¡DESPLIEGUE COMPLETADO!');
    console.log(`   Tiempo total: ${duration} segundos`);
    console.log('='.repeat(50));
    
  } catch (err) {
    console.error(`❌ ERROR: ${err.message}`);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Ejecutar el script
deploy().catch(err => {
  console.error(`❌ ERROR FATAL: ${err.message}`);
  process.exit(1);
}); 