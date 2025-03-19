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

    console.log('Verificando directorios de dominios...');
    
    // Verificar directorio domains
    try {
      console.log(`Verificando directorio: /domains`);
      const domainsList = await client.list('/domains');
      console.log(`✅ El directorio /domains existe`);
      
      console.log('Dominios encontrados:');
      for (const domain of domainsList) {
        if (domain.type === 2) { // Es un directorio
          console.log(`  - ${domain.name}`);
          
          // Verificar public_html para cada dominio
          try {
            const publicHtmlPath = `/domains/${domain.name}/public_html`;
            await client.list(publicHtmlPath);
            console.log(`    ✅ ${publicHtmlPath} existe`);
          } catch (err) {
            console.error(`    ❌ No se encontró public_html para ${domain.name}`);
          }
        }
      }
    } catch (err) {
      console.error(`❌ Error al verificar /domains:`, err.message);
    }
    
    // Verificar otros directorios importantes
    console.log('\nVerificando otros directorios importantes:');
    const importantDirs = [
      '/missstarinternational.com',
      '/missnlproductions.com',
      '/domains/missstarinternational.com/public_html',
      '/domains/missnlproductions.com/public_html'
    ];
    
    for (const dir of importantDirs) {
      try {
        console.log(`Verificando directorio: ${dir}`);
        await client.list(dir);
        console.log(`✅ El directorio ${dir} existe`);
      } catch (err) {
        console.error(`❌ Error al verificar ${dir}:`, err.message);
      }
    }
    
    console.log('\n¡Verificación completada!');
  } catch (err) {
    console.error('Error durante la verificación:', err);
  } finally {
    client.close();
  }
}

main(); 