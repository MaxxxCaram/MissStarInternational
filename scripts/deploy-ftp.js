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

// Scripts obsoletos a eliminar
const OBSOLETE_SCRIPTS = [
  'deploy.sh',
  'deploy-all.js',
  'backup.js',
  'setup-server.sh',
  'setup-ssl.sh'
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

/**
 * Función principal
 */
async function main() {
  try {
    // 1. Limpiar scripts obsoletos
    await cleanupScripts();
    
    // 2. Ejecutar el script de despliegue FTP
    console.log('🚀 Iniciando despliegue FTP...');
    await execAsync('node scripts/ftp-deploy.js');
    
    console.log('✅ Proceso completado con éxito');
  } catch (error) {
    console.error(`❌ Error durante el proceso: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar script
main(); 