const axios = require('axios');
const https = require('https');
require('dotenv').config();

// Configuración de DirectAdmin
const config = {
    url: process.env.DIRECT_ADMIN_URL,
    user: process.env.DIRECT_ADMIN_USER,
    password: process.env.DIRECT_ADMIN_PASSWORD,
    domain: process.env.PRIMARY_DOMAIN
};

// Lista de archivos y carpetas a mantener
const keepFiles = [
    'public',
    'node_modules',
    'server.js',
    'package.json',
    'package-lock.json',
    '.env',
    'scripts',
    'models',
    'middleware',
    'config'
];

// Lista de archivos y carpetas a eliminar
const deleteFiles = [
    'PRIVATE_HTML',
    'en_tmp',
    'en_backup',
    'temp_*',
    'site_check*',
    'backup_*',
    '.vs',
    'domains'
];

// Función para hacer peticiones a DirectAdmin
async function directAdminRequest(path, method = 'GET', data = null) {
    const agent = new https.Agent({
        rejectUnauthorized: false // Para manejar certificados auto-firmados
    });

    try {
        const response = await axios({
            method,
            url: `${config.url}${path}`,
            auth: {
                username: config.user,
                password: config.password
            },
            httpsAgent: agent,
            data
        });
        return response.data;
    } catch (error) {
        console.error(`Error en petición a DirectAdmin: ${error.message}`);
        throw error;
    }
}

// Función para listar archivos
async function listFiles(path = '') {
    try {
        const response = await directAdminRequest(`/CMD_FILE_MANAGER/domains/${config.domain}/public_html${path}`);
        return response;
    } catch (error) {
        console.error(`Error listando archivos: ${error.message}`);
        return [];
    }
}

// Función para eliminar archivo o carpeta
async function deleteFile(path) {
    try {
        await directAdminRequest(
            `/CMD_FILE_MANAGER/domains/${config.domain}/public_html${path}`,
            'DELETE'
        );
        console.log(`✅ Eliminado: ${path}`);
    } catch (error) {
        console.error(`❌ Error eliminando ${path}: ${error.message}`);
    }
}

// Función principal de limpieza
async function cleanDirectAdmin() {
    console.log('🔄 Iniciando limpieza de DirectAdmin...');

    try {
        // Listar archivos actuales
        const files = await listFiles();
        console.log('📁 Archivos encontrados:', files);

        // Eliminar archivos y carpetas no necesarios
        for (const pattern of deleteFiles) {
            const matchingFiles = files.filter(file => 
                file.match(new RegExp(pattern.replace('*', '.*')))
            );

            for (const file of matchingFiles) {
                await deleteFile(`/${file}`);
            }
        }

        console.log('✅ Limpieza completada');
        
        // Verificar estructura final
        const remainingFiles = await listFiles();
        console.log('📁 Estructura final:', remainingFiles);

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error.message);
    }
}

// Ejecutar limpieza
console.log('⚠️ Iniciando proceso de limpieza en DirectAdmin');
console.log('🌐 Dominio:', config.domain);
cleanDirectAdmin().catch(console.error); 