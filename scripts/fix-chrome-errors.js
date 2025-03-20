const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🚀 CORRECCIÓN DE ERRORES CHROME RUNTIME 🚀');
    console.log('=========================================');
    
    // Conectar al servidor
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navegar al directorio correcto
    console.log('\n1. Navegando al directorio público...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa');
    
    // Crear un archivo JavaScript optimizado que maneja errores específicos de Chrome
    console.log('\n2. Creando y subiendo JavaScript para manejar errores Chrome runtime...');
    
    const errorHandlerJs = `// Chrome Error Handler - Miss Star International
(function() {
  // Override console.error to filter Chrome extension errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Filter out Chrome runtime errors
    if (args && args[0] && typeof args[0] === 'string' && 
        (args[0].includes('runtime.lastError') || 
         args[0].includes('message channel closed'))) {
      // Suppress the error
      return;
    }
    
    // Pass through other errors to the original console.error
    return originalConsoleError.apply(console, args);
  };
  
  // Capture and suppress Chrome extension-related errors
  window.addEventListener('error', function(event) {
    if (event && event.error && event.error.message && 
        (event.error.message.includes('runtime.lastError') || 
         event.error.message.includes('message channel closed'))) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);
  
  // Patch window.chrome to prevent errors
  if (window.chrome && typeof window.chrome.runtime === 'object') {
    try {
      // Patch sendMessage to handle errors gracefully
      const originalSendMessage = window.chrome.runtime.sendMessage;
      if (originalSendMessage) {
        window.chrome.runtime.sendMessage = function() {
          try {
            return originalSendMessage.apply(this, arguments);
          } catch (e) {
            // Silently catch Chrome runtime errors
            return undefined;
          }
        };
      }
      
      // Patch onMessage to prevent listener errors
      if (window.chrome.runtime.onMessage) {
        const originalAddListener = window.chrome.runtime.onMessage.addListener;
        if (originalAddListener) {
          window.chrome.runtime.onMessage.addListener = function(callback) {
            const wrappedCallback = function() {
              try {
                return callback.apply(this, arguments);
              } catch (e) {
                return false; // Don't indicate asynchronous response
              }
            };
            return originalAddListener.call(this, wrappedCallback);
          };
        }
      }
    } catch (e) {
      // Do nothing if we can't patch chrome.runtime
    }
  }
  
  console.log('Chrome error handler initialized for Miss Star International');
})();`;
    
    // Guardamos el JavaScript en un archivo temporal
    const tempHandlerPath = path.join(__dirname, '../temp_chrome_handler.js');
    fs.writeFileSync(tempHandlerPath, errorHandlerJs);
    
    // Crear directorio js si no existe
    try {
      await client.ensureDir('assets/js');
    } catch (error) {
      console.log('Creando estructura de directorios...');
      try { await client.ensureDir('assets'); } catch (e) {}
      try { await client.ensureDir('assets/js'); } catch (e) {}
    }
    
    // Subimos el archivo al servidor
    await client.cd('/domains/missstarinternational.com/public_html/assets/js');
    await client.uploadFrom(tempHandlerPath, 'chrome-error-handler.js');
    console.log('✅ Handler de errores Chrome subido correctamente');
    
    // Actualizar el archivo index.html para incluir el nuevo script
    console.log('\n3. Actualizando el index.html para incluir el manejador de errores...');
    
    // Navegar de regreso al directorio público
    await client.cd('/domains/missstarinternational.com/public_html');
    
    // Descargar el archivo index.html actual
    const tempIndexPath = path.join(__dirname, '../temp_index.html');
    await client.downloadTo(tempIndexPath, 'index.html');
    
    // Leer el contenido del archivo
    let indexContent = fs.readFileSync(tempIndexPath, 'utf8');
    
    // Verificar si el script ya está incluido
    if (!indexContent.includes('chrome-error-handler.js')) {
      // Buscar la etiqueta </head> para insertar nuestro script antes
      indexContent = indexContent.replace('</head>', 
        '    <script src="assets/js/chrome-error-handler.js"></script>\n</head>');
      
      // Guardar el archivo modificado
      fs.writeFileSync(tempIndexPath, indexContent);
      
      // Subir el archivo actualizado
      await client.uploadFrom(tempIndexPath, 'index.html');
      console.log('✅ index.html actualizado correctamente');
    } else {
      console.log('⚠️ El script ya estaba incluido en index.html');
    }
    
    // Limpiamos los archivos temporales
    fs.unlinkSync(tempHandlerPath);
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ Proceso completado exitosamente');
    console.log('\nEsto debería eliminar los errores de Chrome runtime.lastError en la consola.');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

main(); 