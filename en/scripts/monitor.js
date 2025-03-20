const pm2 = require('pm2');
const nodemailer = require('nodemailer');

const ALERT_EMAIL = 'info@missnlproductions.com';

pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.launchBus(function(err, bus) {
        bus.on('process:exception', function(data) {
            sendAlert('Exception', data);
        });

        bus.on('process:error', function(data) {
            sendAlert('Error', data);
        });
    });
});

async function sendAlert(type, data) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.vimexx.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: 'system@missstarinternational.com',
        to: ALERT_EMAIL,
        subject: `[ALERT] Miss Star - ${type}`,
        text: JSON.stringify(data, null, 2)
    });
} 