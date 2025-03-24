/**
 * Script para sincronizar archivos únicos de PRIVATE_HTML a public
 * Ayuda a consolidar la estructura de archivos estáticos
 */

const fs = require('fs');
const path = require('path');

// Directorios
const sourceDir = path.join(__dirname, '..', 'PRIVATE_HTML');
const targetDir = path.join(__dirname, '..', 'public');

/**
 * Copia un archivo de origen a destino
 */
function copyFile(source, target) {
  try {
    // Crear directorio de destino si no existe
    const targetDir = path.dirname(target);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copiar el archivo
    fs.copyFileSync(source, target);
    console.log(`✅ Copiado: ${source} → ${target}`);
  } catch (error) {
    console.error(`❌ Error copiando ${source}: ${error.message}`);
  }
}

/**
 * Sincroniza archivos recursivamente
 */
function syncFiles(sourceDir, targetDir, relativePath = '') {
  // Leer el directorio fuente
  const items = fs.readdirSync(path.join(sourceDir, relativePath));
  
  // Procesar cada elemento
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, relativePath, item);
    const targetPath = path.join(targetDir, relativePath, item);
    const relPath = path.join(relativePath, item);
    
    // Verificar si es directorio o archivo
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Recursivamente sincronizar subdirectorios
      syncFiles(sourceDir, targetDir, relPath);
    } else {
      // Verificar si el archivo existe en el destino
      if (!fs.existsSync(targetPath)) {
        // Si no existe, copiarlo
        copyFile(sourcePath, targetPath);
      } else {
        // Comparar fechas de modificación
        const sourceTime = stat.mtime.getTime();
        const targetTime = fs.statSync(targetPath).mtime.getTime();
        
        if (sourceTime > targetTime) {
          console.log(`⚠️ Actualizado: ${relPath} (más reciente en PRIVATE_HTML)`);
          // Archivo en PRIVATE_HTML es más reciente
          copyFile(sourcePath, targetPath);
        }
      }
    }
  });
}

// Iniciar sincronización
console.log('🔄 Iniciando sincronización de PRIVATE_HTML a public...');
if (fs.existsSync(sourceDir) && fs.existsSync(targetDir)) {
  syncFiles(sourceDir, targetDir);
  console.log('✅ Sincronización completada');
} else {
  console.error('❌ Error: Uno o ambos directorios no existen');
} 