const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/database');
const Action = require('./models/Action');
const History = require('./models/History');
const authMiddleware = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const Role = require('./models/Role');
const User = require('./models/User');
const path = require('path');
const fs = require('fs');
const { createCorporateEmail } = require('./scripts/create-email');
require('dotenv').config();

const app = express();

// Corregir advertencia de strictQuery en Mongoose
mongoose.set('strictQuery', false);

// Middleware
app.use(cors());
app.use(express.json());

// Verificar estructura de directorios
console.log('🔎 Estructura del directorio actual:');
console.log('📂 __dirname:', __dirname);
console.log('📂 Archivos en la raíz:', fs.readdirSync(__dirname));

try {
    // Intentar crear carpeta public si no existe
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
        console.log('⚠️ Carpeta public no existe, creándola...');
        fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
        console.log('✅ Carpeta public creada');
    }

    // Intentar crear un index.html vacío en public si no existe
    if (!fs.existsSync(path.join(__dirname, 'public/index.html'))) {
        console.log('⚠️ index.html no existe en public, creando uno básico...');
        const basicHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Miss Star International</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 50px;
                    background-color: #09041a;
                    color: white;
                }
                h1 { color: #00e5ff; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .loading { font-size: 18px; margin-top: 30px; }
                .links { margin-top: 40px; }
                .links a {
                    color: #ff00ff;
                    margin: 0 10px;
                    text-decoration: none;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Miss Star International</h1>
                <p class="loading">Cargando sitio...</p>
                <div class="links">
                    <a href="/en">English</a>
                    <a href="/es">Español</a>
                    <a href="/pt">Português</a>
                    <a href="/th">ไทย</a>
                    <a href="/vi">Tiếng Việt</a>
                </div>
            </div>
        </body>
        </html>
        `;
        fs.writeFileSync(path.join(__dirname, 'public/index.html'), basicHtml);
        console.log('✅ index.html básico creado en public');
    }
} catch (error) {
    console.error('❌ Error al crear archivos:', error);
}

// Verificar rutas de archivos estáticos
const privateHtmlPath = path.join(__dirname, 'PRIVATE_HTML');
const publicPath = path.join(__dirname, 'public');

console.log('📂 Ruta PRIVATE_HTML:', privateHtmlPath);
console.log('📂 Ruta public:', publicPath);
console.log('📄 Index.html en PRIVATE_HTML:', fs.existsSync(path.join(privateHtmlPath, 'index.html')));
console.log('📄 Index.html en public:', fs.existsSync(path.join(publicPath, 'index.html')));

// Servir archivos estáticos desde ambas rutas
// Cambiar el orden para que public tenga prioridad
app.use(express.static(publicPath));

// Determine environment
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Asegurar que las carpetas de idiomas existan
const languages = ['en', 'es', 'pt', 'th', 'vi'];
try {
    languages.forEach(lang => {
        const langPath = path.join(__dirname, `public/${lang}`);
        if (!fs.existsSync(langPath)) {
            console.log(`⚠️ Carpeta de idioma ${lang} no existe, creándola...`);
            fs.mkdirSync(langPath, { recursive: true });
            
            // Crear index.html básico para cada idioma
            const langTitle = {
                'en': 'Miss Star International',
                'es': 'Miss Star Internacional',
                'pt': 'Miss Star Internacional',
                'th': 'Miss Star International ประเทศไทย',
                'vi': 'Miss Star International Việt Nam'
            };
            
            const langLoading = {
                'en': 'Loading site...',
                'es': 'Cargando sitio...',
                'pt': 'Carregando site...',
                'th': 'กำลังโหลดเว็บไซต์...',
                'vi': 'Đang tải trang web...'
            };
            
            const basicLangHtml = `
            <!DOCTYPE html>
            <html lang="${lang}">
            <head>
                <meta charset="UTF-8">
                <title>${langTitle[lang]}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        margin-top: 50px;
                        background-color: #09041a;
                        color: white;
                    }
                    h1 { color: #00e5ff; }
                    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                    .loading { font-size: 18px; margin-top: 30px; }
                    .links { margin-top: 40px; }
                    .links a {
                        color: #ff00ff;
                        margin: 0 10px;
                        text-decoration: none;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${langTitle[lang]}</h1>
                    <p class="loading">${langLoading[lang]}</p>
                    <div class="links">
                        <a href="/en">English</a>
                        <a href="/es">Español</a>
                        <a href="/pt">Português</a>
                        <a href="/th">ไทย</a>
                        <a href="/vi">Tiếng Việt</a>
                    </div>
                </div>
            </body>
            </html>
            `;
            fs.writeFileSync(path.join(langPath, 'index.html'), basicLangHtml);
            console.log(`✅ index.html básico creado para idioma ${lang}`);
        }
    });
} catch (error) {
    console.error('❌ Error al crear archivos de idiomas:', error);
}

// MongoDB connection test
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB conectado correctamente'))
    .catch(err => console.error('❌ Error de conexión MongoDB:', err));

// Schemas
const translationSchema = new mongoose.Schema({
    originalText: String,
    translations: [{
        language: String,
        text: String
    }],
    timestamp: { type: Date, default: Date.now }
});

const Translation = mongoose.model('Translation', translationSchema);

// Routes
app.post('/api/translations', async (req, res) => {
    try {
        const translation = new Translation(req.body);
        await translation.save();
        res.status(201).json(translation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/translations', async (req, res) => {
    try {
        const translations = await Translation.find();
        res.json(translations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Action logging routes
app.post('/api/actions', async (req, res) => {
    try {
        const { action, details } = req.body;
        const newAction = new Action({
            action,
            details
        });
        await newAction.save();
        res.status(201).json(newAction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/actions', async (req, res) => {
    try {
        const actions = await Action.find()
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(actions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// History routes
app.post('/api/history', async (req, res) => {
    try {
        const { action, details, userId, sessionId, metadata } = req.body;
        const history = new History({
            action,
            details,
            userId,
            sessionId,
            metadata
        });
        await history.save();
        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const { userId, action, startDate, endDate } = req.query;
        let query = {};

        if (userId) query.userId = userId;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const history = await History.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(req.query.limit) || 100);

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected routes
app.use('/api/history', authMiddleware);
app.use('/api/translations', authMiddleware);

// Authentication route
app.post('/api/auth', async (req, res) => {
    const { apiKey } = req.body;
    
    if (apiKey === config.aiApiKey) {
        const token = jwt.sign(
            { role: 'ai', permissions: ['write', 'read'] },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid API key' });
    }
});

// User and role routes
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/roles', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save route
app.post('/api/analytics', async (req, res) => {
    try {
        const event = req.body;
        // Save to MongoDB
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Language routing middleware
app.use((req, res, next) => {
    const userLang = req.acceptsLanguages(['en', 'es', 'pt', 'th']) || 'en';
    req.userLanguage = userLang;
    next();
});

// Main routes - intentar ambas rutas y proporcionar una página por defecto si no existe
app.get('/', (req, res) => {
    const privateIndexPath = path.join(__dirname, 'PRIVATE_HTML/index.html');
    const publicIndexPath = path.join(__dirname, 'public/index.html');
    
    console.log('🔍 Intentando servir desde PRIVATE_HTML:', privateIndexPath);
    console.log('🔍 Intentando servir desde public:', publicIndexPath);
    
    if (fs.existsSync(privateIndexPath)) {
        res.sendFile(privateIndexPath);
    } else if (fs.existsSync(publicIndexPath)) {
        res.sendFile(publicIndexPath);
    } else {
        // Si no existe, creamos uno básico en memoria y lo enviamos
        console.log('❌ No se encontró index.html en ninguna ubicación, generando respuesta en memoria');
        const fallbackHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Miss Star International</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 50px;
                    background-color: #09041a;
                    color: white;
                }
                h1 { color: #00e5ff; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .links { margin-top: 40px; }
                .links a {
                    color: #ff00ff;
                    margin: 0 10px;
                    text-decoration: none;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Miss Star International</h1>
                <p>Welcome to Miss Star International</p>
                <div class="links">
                    <a href="/en">English</a>
                    <a href="/es">Español</a>
                    <a href="/pt">Português</a>
                    <a href="/th">ไทย</a>
                    <a href="/vi">Tiếng Việt</a>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(fallbackHtml);
    }
});

// Language-specific routes - mejorado con respuesta fallback
app.get('/:lang', (req, res) => {
    const validLangs = ['en', 'es', 'pt', 'th', 'vi'];
    const lang = req.params.lang;
    
    if (validLangs.includes(lang)) {
        const privateLangPath = path.join(__dirname, `PRIVATE_HTML/${lang}/index.html`);
        const publicLangPath = path.join(__dirname, `public/${lang}/index.html`);
        
        console.log(`🌐 Intentando servir idioma ${lang} desde PRIVATE_HTML:`, privateLangPath);
        console.log(`🌐 Intentando servir idioma ${lang} desde public:`, publicLangPath);
        
        if (fs.existsSync(privateLangPath)) {
            res.sendFile(privateLangPath);
        } else if (fs.existsSync(publicLangPath)) {
            res.sendFile(publicLangPath);
        } else {
            console.log(`❌ Archivo de idioma no encontrado en ninguna ruta: ${lang}, generando respuesta en memoria`);
            
            const langTitle = {
                'en': 'Miss Star International',
                'es': 'Miss Star Internacional',
                'pt': 'Miss Star Internacional',
                'th': 'Miss Star International ประเทศไทย',
                'vi': 'Miss Star International Việt Nam'
            };
            
            const fallbackLangHtml = `
            <!DOCTYPE html>
            <html lang="${lang}">
            <head>
                <meta charset="UTF-8">
                <title>${langTitle[lang] || 'Miss Star International'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        margin-top: 50px;
                        background-color: #09041a;
                        color: white;
                    }
                    h1 { color: #00e5ff; }
                    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                    .links { margin-top: 40px; }
                    .links a {
                        color: #ff00ff;
                        margin: 0 10px;
                        text-decoration: none;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${langTitle[lang] || 'Miss Star International'}</h1>
                    <p>Welcome to Miss Star International</p>
                    <div class="links">
                        <a href="/en">English</a>
                        <a href="/es">Español</a>
                        <a href="/pt">Português</a>
                        <a href="/th">ไทย</a>
                        <a href="/vi">Tiếng Việt</a>
                    </div>
                </div>
            </body>
            </html>
            `;
            res.send(fallbackLangHtml);
        }
    } else {
        res.redirect('/');
    }
});

// History routes - con página por defecto
app.get('/:lang/history', (req, res) => {
    const lang = req.params.lang;
    const privateHistoryPath = path.join(__dirname, `PRIVATE_HTML/${lang}/history.html`);
    const publicHistoryPath = path.join(__dirname, `public/${lang}/history.html`);
    
    console.log(`🔍 Intentando servir history desde PRIVATE_HTML:`, privateHistoryPath);
    console.log(`🔍 Intentando servir history desde public:`, publicHistoryPath);
    
    if (fs.existsSync(privateHistoryPath)) {
        res.sendFile(privateHistoryPath);
    } else if (fs.existsSync(publicHistoryPath)) {
        res.sendFile(publicHistoryPath);
    } else {
        console.log(`❌ Archivo history.html no encontrado para idioma: ${lang}, generando respuesta en memoria`);
        
        const langTitle = {
            'en': 'History - Miss Star International',
            'es': 'Historia - Miss Star Internacional',
            'pt': 'História - Miss Star Internacional',
            'th': 'ประวัติ - Miss Star International',
            'vi': 'Lịch sử - Miss Star International'
        };
        
        const fallbackHistoryHtml = `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
            <meta charset="UTF-8">
            <title>${langTitle[lang] || 'History - Miss Star International'}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 50px;
                    background-color: #09041a;
                    color: white;
                }
                h1 { color: #00e5ff; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .message { margin: 30px 0; }
                .links { margin-top: 40px; }
                .links a {
                    color: #ff00ff;
                    margin: 0 10px;
                    text-decoration: none;
                    font-weight: bold;
                }
                .back { margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${langTitle[lang] || 'History - Miss Star International'}</h1>
                <p class="message">This page is under construction. Please check back later.</p>
                <div class="links">
                    <a href="/en">English</a>
                    <a href="/es">Español</a>
                    <a href="/pt">Português</a>
                    <a href="/th">ไทย</a>
                    <a href="/vi">Tiếng Việt</a>
                </div>
                <div class="back">
                    <a href="/${lang}" style="color: #ffffff;">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(fallbackHistoryHtml);
    }
});

// Conference routes - con página por defecto
app.get('/:lang/conference', (req, res) => {
    const lang = req.params.lang;
    const privateConferencePath = path.join(__dirname, `PRIVATE_HTML/${lang}/conference.html`);
    const publicConferencePath = path.join(__dirname, `public/${lang}/conference.html`);
    
    console.log(`🔍 Intentando servir conference desde PRIVATE_HTML:`, privateConferencePath);
    console.log(`🔍 Intentando servir conference desde public:`, publicConferencePath);
    
    if (fs.existsSync(privateConferencePath)) {
        res.sendFile(privateConferencePath);
    } else if (fs.existsSync(publicConferencePath)) {
        res.sendFile(publicConferencePath);
    } else {
        console.log(`❌ Archivo conference.html no encontrado para idioma: ${lang}, generando respuesta en memoria`);
        
        const langTitle = {
            'en': 'Conference - Miss Star International',
            'es': 'Conferencia - Miss Star Internacional',
            'pt': 'Conferência - Miss Star Internacional',
            'th': 'การประชุม - Miss Star International',
            'vi': 'Hội nghị - Miss Star International'
        };
        
        const fallbackConferenceHtml = `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
            <meta charset="UTF-8">
            <title>${langTitle[lang] || 'Conference - Miss Star International'}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 50px;
                    background-color: #09041a;
                    color: white;
                }
                h1 { color: #00e5ff; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .message { margin: 30px 0; }
                .links { margin-top: 40px; }
                .links a {
                    color: #ff00ff;
                    margin: 0 10px;
                    text-decoration: none;
                    font-weight: bold;
                }
                .back { margin-top: 40px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${langTitle[lang] || 'Conference - Miss Star International'}</h1>
                <p class="message">Conference details will be available soon. Please check back later.</p>
                <div class="links">
                    <a href="/en">English</a>
                    <a href="/es">Español</a>
                    <a href="/pt">Português</a>
                    <a href="/th">ไทย</a>
                    <a href="/vi">Tiếng Việt</a>
                </div>
                <div class="back">
                    <a href="/${lang}" style="color: #ffffff;">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(fallbackConferenceHtml);
    }
});

// Email management routes
app.post('/api/email/create', authMiddleware, async (req, res) => {
    try {
        const result = await createCorporateEmail(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fallback route para manejar todas las rutas desconocidas
app.use((req, res) => {
    console.log('🔄 Ruta no encontrada, redirigiendo a inicio:', req.path);
    res.redirect('/');
});

// Configuración para Render.com - debe escuchar en host 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`🌐 Entorno: ${process.env.NODE_ENV}`);
}); 