const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const DOMAIN = 'missstarinternational.com';
const EMAIL_PATTERNS = {
    staff: '{firstname}.{lastname}@' + DOMAIN,
    contestants: 'contestant.{country}@' + DOMAIN,
    admin: 'admin@' + DOMAIN,
    info: 'info@' + DOMAIN,
    support: 'support@' + DOMAIN,
    media: 'media@' + DOMAIN,
    press: 'press@' + DOMAIN
};

async function setupEmailSystem() {
    // Configuración OAuth2 para Google Workspace
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.ADMIN_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN
        }
    });

    return { oauth2Client, transporter };
}

module.exports = { setupEmailSystem, EMAIL_PATTERNS }; 