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

    console.log('Verificando estructura de directorios de conferencia...');
    
    // Verificar directorios de conferencia
    const langs = ['en', 'es', 'pt', 'th', 'vi'];
    
    for (const lang of langs) {
      const dir = `/${lang}/conference`;
      try {
        console.log(`Verificando directorio: ${dir}`);
        await client.list(dir);
        console.log(`✅ El directorio ${dir} existe`);
        
        // Verificar contenido del directorio de conferencia
        console.log(`Contenido de ${dir}:`);
        const list = await client.list(dir);
        list.forEach(item => {
          console.log(`  - ${item.name} (${item.type})`);
        });
      } catch (err) {
        console.error(`❌ Error al verificar ${dir}:`, err.message);
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