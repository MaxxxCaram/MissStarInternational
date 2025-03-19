const ftp = require('basic-ftp');
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

    console.log('Verificando estructura de directorios...');
    
    // Verificar directorios principales
    const dirs = ['/', '/assets', '/assets/images', '/assets/css', '/assets/js', '/en', '/es', '/pt', '/th', '/vi'];
    
    for (const dir of dirs) {
      try {
        console.log(`Verificando directorio: ${dir}`);
        await client.list(dir);
        console.log(`✅ El directorio ${dir} existe`);
      } catch (err) {
        console.error(`❌ Error al verificar ${dir}:`, err.message);
        
        // Intentar crear el directorio si no existe
        try {
          console.log(`Intentando crear directorio: ${dir}`);
          await client.ensureDir(dir);
          console.log(`✅ Directorio ${dir} creado correctamente`);
        } catch (createErr) {
          console.error(`❌ No se pudo crear el directorio ${dir}:`, createErr.message);
        }
      }
    }
    
    console.log('¡Verificación completada!');
  } catch (err) {
    console.error('Error durante la verificación:', err);
  } finally {
    client.close();
  }
}

main(); 