module.exports = {
    domain: 'missstarinternational.com',
    ssl: {
        enabled: true,
        cert: '/etc/letsencrypt/live/missstarinternational.com/fullchain.pem',
        key: '/etc/letsencrypt/live/missstarinternational.com/privkey.pem'
    },
    database: {
        url: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true
        }
    },
    server: {
        port: process.env.PORT || 443
    }
}; 