/**
 * Script para corregir las rutas de imágenes SVG a JPG
 * Creado para Miss Star International
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Directorios a excluir
const EXCLUDE_DIRS = [
  '.git',
  'node_modules',
  '.vscode',
  '.vs',
  '.venv',
  'browser-tools-mcp'
];

// Extensiones de archivos a procesar
const INCLUDE_EXTENSIONS = [
  '.html',
  '.css',
  '.js'
];

// Patrones a reemplazar
const REPLACEMENTS = [
  { from: /franchises\/([a-z]+)\.svg/g, to: 'franchises/$1.jpg' },
  { from: /franchises\/([a-z]+)\.jpgsvg/g, to: 'franchises/$1.jpg' },
  { from: /header-bg\.jpg/g, to: 'header-bg.jpg' }
];

/**
 * Función para verificar si un archivo o directorio debe ser excluido
 */
function shouldExclude(name) {
  if (EXCLUDE_DIRS.includes(name)) {
    return true;
  }
  
  // Excluir archivos temporales y de respaldo
  if (name.startsWith('.') || name.endsWith('~') || name.endsWith('.bak')) {
    return true;
  }
  
  return false;
}

/**
 * Función para verificar si un archivo debe ser procesado
 */
function shouldProcess(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return INCLUDE_EXTENSIONS.includes(ext);
}

/**
 * Función para procesar un archivo
 */
async function processFile(filePath) {
  try {
    // Leer el contenido del archivo
    const content = await readFile(filePath, 'utf8');
    
    // Verificar si hay patrones a reemplazar
    let newContent = content;
    let hasChanges = false;
    
    for (const { from, to } of REPLACEMENTS) {
      if (from.test(newContent)) {
        newContent = newContent.replace(from, to);
        hasChanges = true;
      }
    }
    
    // Si hay cambios, guardar el archivo
    if (hasChanges) {
      console.log(`📝 Corrigiendo: ${filePath}`);
      await writeFile(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error al procesar ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Función para procesar un directorio recursivamente
 */
async function processDirectory(dirPath) {
  try {
    // Leer contenido del directorio
    const items = await readdir(dirPath);
    let changedFiles = 0;
    
    // Procesar cada elemento
    for (const item of items) {
      if (shouldExclude(item)) {
        continue;
      }
      
      const itemPath = path.join(dirPath, item);
      const itemStat = await stat(itemPath);
      
      if (itemStat.isDirectory()) {
        // Procesar subdirectorio recursivamente
        changedFiles += await processDirectory(itemPath);
      } else if (shouldProcess(itemPath)) {
        // Procesar archivo
        if (await processFile(itemPath)) {
          changedFiles++;
        }
      }
    }
    
    return changedFiles;
  } catch (error) {
    console.error(`❌ Error al procesar directorio ${dirPath}: ${error.message}`);
    return 0;
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🔄 Iniciando corrección de rutas de imágenes...');
    
    // Obtener directorio local (raíz del proyecto)
    const rootDir = path.resolve(__dirname, '..');
    
    // Procesar todo el directorio
    const changedFiles = await processDirectory(rootDir);
    
    console.log(`✅ Proceso completado. Se corrigieron ${changedFiles} archivos.`);
  } catch (error) {
    console.error(`❌ Error durante el proceso: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar script
main().catch(err => {
  console.error('Error global:', err);
  process.exit(1);
}); 