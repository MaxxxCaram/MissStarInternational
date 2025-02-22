const { setupEmailSystem, EMAIL_PATTERNS } = require('./setup-email');
const { google } = require('googleapis');

async function createCorporateEmail(userData) {
    const { oauth2Client } = await setupEmailSystem();
    const admin = google.admin({version: 'directory_v1', auth: oauth2Client});

    const email = generateEmailAddress(userData);

    try {
        const user = await admin.users.insert({
            requestBody: {
                primaryEmail: email,
                name: {
                    givenName: userData.firstName,
                    familyName: userData.lastName
                },
                password: generateSecurePassword(),
                changePasswordAtNextLogin: true,
                organizations: [{
                    department: userData.department
                }]
            }
        });

        return {
            success: true,
            email: user.data.primaryEmail,
            message: 'Email account created successfully'
        };
    } catch (error) {
        console.error('Error creating email:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function generateEmailAddress(userData) {
    const pattern = EMAIL_PATTERNS[userData.type];
    return pattern
        .replace('{firstname}', userData.firstName.toLowerCase())
        .replace('{lastname}', userData.lastName.toLowerCase())
        .replace('{country}', userData.country?.toLowerCase());
}

function generateSecurePassword() {
    return Math.random().toString(36).slice(-10) + 
           Math.random().toString(36).toUpperCase().slice(-2) + 
           Math.floor(Math.random() * 10);
}

module.exports = { createCorporateEmail }; 