const ftp = require('basic-ftp');
require('dotenv').config();

// Lista de archivos y carpetas a eliminar
const deleteFiles = [
    'PRIVATE_HTML',
    'en_tmp',
    'en_backup',
    'temp_*',
    'site_check*',
    '.vs',
    'domains'
];

async function cleanDirectory(client, currentPath = '') {
    console.log(`📂 Revisando directorio: ${currentPath || '/'}`);
    
    const list = await client.list();
    console.log('📄 Archivos encontrados:', list.map(item => item.name));

    // Eliminar archivos y carpetas no deseados en el directorio actual
    for (const pattern of deleteFiles) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        const matches = list.filter(item => regex.test(item.name));
        
        for (const item of matches) {
            try {
                if (item.isDirectory) {
                    console.log(`🗑️ Eliminando directorio: ${currentPath}/${item.name}`);
                    await client.removeDir(item.name);
                } else {
                    console.log(`🗑️ Eliminando archivo: ${currentPath}/${item.name}`);
                    await client.remove(item.name);
                }
                console.log(`✅ Eliminado: ${item.name}`);
            } catch (err) {
                console.error(`❌ Error eliminando ${item.name}:`, err.message);
            }
        }
    }

    // Revisar subdirectorios
    for (const item of list) {
        if (item.isDirectory && item.name !== '.' && item.name !== '..') {
            try {
                await client.cd(item.name);
                await cleanDirectory(client, `${currentPath}/${item.name}`);
                await client.cdup();
            } catch (err) {
                console.error(`❌ Error accediendo a ${item.name}:`, err.message);
            }
        }
    }
}

async function cleanBackups(client) {
    const list = await client.list();
    const backups = list.filter(item => item.name.startsWith('backup-') && item.name.endsWith('.tar.zst'));
    
    // Ordenar por fecha de modificación (más reciente primero)
    backups.sort((a, b) => b.modifiedAt - a.modifiedAt);
    
    // Mantener solo el backup más reciente
    if (backups.length > 1) {
        for (let i = 1; i < backups.length; i++) {
            try {
                console.log(`🗑️ Eliminando backup antiguo: ${backups[i].name}`);
                await client.remove(backups[i].name);
                console.log(`✅ Eliminado: ${backups[i].name}`);
            } catch (err) {
                console.error(`❌ Error eliminando ${backups[i].name}:`, err.message);
            }
        }
    }
}

async function cleanFTP() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔄 Conectando al servidor FTP...');
        
        await client.access({
            host: process.env.DIRECT_ADMIN_DOMAIN,
            user: process.env.DIRECT_ADMIN_USER,
            password: process.env.DIRECT_ADMIN_PASSWORD,
            secure: false,
            secureOptions: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Conexión exitosa');

        // Limpiar directorio tmp
        console.log('📂 Limpiando directorio tmp...');
        await client.cd('tmp');
        await cleanDirectory(client);

        // Limpiar directorio backups
        console.log('📂 Limpiando directorio backups...');
        await client.cd('..');
        await client.cd('backups');
        await cleanBackups(client);

        console.log('✅ Limpieza completada');

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
    
    client.close();
}

// Ejecutar limpieza
console.log('⚠️ Iniciando proceso de limpieza FTP');
console.log('🌐 Servidor:', process.env.DIRECT_ADMIN_DOMAIN);
cleanFTP().catch(console.error); 