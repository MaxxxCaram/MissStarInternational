# Instrucciones de Despliegue - Miss Star International

Este documento contiene instrucciones detalladas para el despliegue correcto del sitio web Miss Star International.

## Estructura de Archivos

La estructura correcta del proyecto es:

```
missstarinternational/
├── public/               # Carpeta principal con todos los archivos estáticos
│   ├── index.html        # Página principal 
│   ├── en/               # Versión en inglés
│   ├── es/               # Versión en español
│   ├── pt/               # Versión en portugués
│   ├── vi/               # Versión en vietnamita
│   ├── th/               # Versión en tailandés
│   ├── css/              # Estilos CSS
│   ├── js/               # Scripts JavaScript
│   └── assets/           # Imágenes, fuentes y otros recursos
├── server.js             # Servidor Node.js principal
├── scripts/              # Scripts de utilidad
├── models/               # Modelos de datos MongoDB
├── middleware/           # Middleware para Express
├── config/               # Archivos de configuración
├── .env                  # Variables de entorno (no incluido en Git)
└── package.json          # Dependencias y scripts de npm
```

## Preparación para Despliegue

Antes de desplegar, ejecutar los siguientes pasos:

1. Sincronizar archivos estáticos:
   ```
   npm run sync
   ```

2. Verificar conexión a MongoDB:
   ```
   node scripts/test-mongo.js
   ```

3. Instalar dependencias:
   ```
   npm install
   ```

## Despliegue en Render.com

1. Asegurarse que el repositorio esté actualizado en GitHub.

2. En Render.com, crear un nuevo Web Service:
   - Conectar con el repositorio de GitHub
   - Nombre: missstarinternational
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. Configurar las siguientes variables de entorno:
   - `MONGODB_URI`: URL de conexión a MongoDB
   - `NODE_ENV`: production
   - `PORT`: 10000 (o dejar que Render lo asigne)

4. Habilitar Auto-Deploy para despliegues automáticos cuando se actualice la rama principal.

## Solución de Problemas Comunes

### Problemas con Archivos Estáticos

Si hay problemas con archivos estáticos faltantes:

1. Verificar que todos los archivos estén en la carpeta `public/`
2. Ejecutar `npm run sync` para sincronizar archivos de PRIVATE_HTML a public
3. Verificar que el servidor está sirviendo desde la carpeta correcta

### Problemas de Conexión a MongoDB

1. Verificar que la variable `MONGODB_URI` esté correctamente configurada
2. Ejecutar `node scripts/test-mongo.js` para diagnosticar problemas
3. Verificar que la IP del servidor de despliegue esté en la lista blanca de MongoDB Atlas

### Error 404 en Rutas

Si las rutas no funcionan correctamente:

1. Revisar las rutas definidas en `server.js`
2. Verificar que los archivos HTML existan en las ubicaciones correctas
3. Verificar logs de servidor para identificar rutas problemáticas

## Mantenimiento

Para actualizar el sitio:

1. Realizar cambios en los archivos correspondientes
2. Probar localmente con `npm run dev`
3. Hacer commit y push al repositorio
4. Verificar el despliegue automático en Render.com

Para cualquier problema adicional, consultar los logs de la aplicación en Render.com o ejecutar la aplicación localmente para depuración. 