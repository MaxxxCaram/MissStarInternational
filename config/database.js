module.exports = {
    // Configuración para producción
    production: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/missstar',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    // Configuración para desarrollo
    development: {
        url: 'mongodb://localhost:27017/missstar',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}; 