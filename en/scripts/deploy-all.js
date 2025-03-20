const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function deploy() {
    try {
        // 1. Construir el sitio
        console.log('🏗️ Construyendo el sitio...');
        await execAsync('node scripts/build.js');

        // 2. Probar la conexión a MongoDB
        console.log('🔌 Probando conexión a MongoDB...');
        await execAsync('node scripts/test-db.js');

        // 3. Subir archivos al servidor
        console.log('📤 Subiendo archivos...');
        await execAsync(`rsync -avz --exclude 'node_modules' --exclude '.git' ./ info@missstarinternational.com:/var/www/missstarinternational.com/`);

        console.log('✅ Despliegue completado con éxito!');
    } catch (error) {
        console.error('❌ Error durante el despliegue:', error);
        process.exit(1);
    }
}

deploy(); 