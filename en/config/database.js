module.exports = {
    // Configuración para producción
    production: {
        url: 'mongodb+srv://caramvictoria:<PASSWORD>@missstar.mongodb.net/missstar?retryWrites=true&w=majority',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            authSource: 'admin'
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