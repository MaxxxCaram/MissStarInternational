const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const BACKUP_DIR = '/var/backups/missstar';
const MAX_BACKUPS = 7; // Mantener una semana de backups

async function backup() {
    const date = new Date().toISOString().split('T')[0];
    const backupPath = path.join(BACKUP_DIR, `backup-${date}`);

    // Backup de archivos
    exec(`tar -czf ${backupPath}-files.tar.gz /var/www/missstarinternational.com/public`);

    // Backup de MongoDB
    exec(`mongodump --uri="${process.env.MONGODB_URI}" --out=${backupPath}-db`);

    // Eliminar backups antiguos
    const files = fs.readdirSync(BACKUP_DIR);
    if (files.length > MAX_BACKUPS) {
        const oldFiles = files.sort().slice(0, files.length - MAX_BACKUPS);
        oldFiles.forEach(file => fs.unlinkSync(path.join(BACKUP_DIR, file)));
    }
}

// Ejecutar backup diario
backup(); 