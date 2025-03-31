# Guía de Despliegue en Vercel para Miss Star International

Esta guía explica cómo desplegar tu sitio web en Vercel para disfrutar de una experiencia más moderna, sin problemas de redirecciones y con SSL automático.

## Beneficios de usar Vercel

- **SSL automático**: Certificados renovados automáticamente, sin configuración.
- **CDN global**: Tu sitio se sirve desde centros de datos cercanos a tus visitantes.
- **Sin problemas de redirección**: Las redirecciones y manejo de idiomas funcionan perfectamente.
- **Autodespliegue**: Conectado a GitHub, cada cambio se despliega automáticamente.
- **Previews por PR**: Cada pull request genera un despliegue de prueba.

## Pasos para desplegar

1. **Crear una cuenta en Vercel**

   - Visita [Vercel.com](https://vercel.com) y regístrate (puedes usar tu cuenta de GitHub)

2. **Conectar tu repositorio de GitHub**

   - Crea un repositorio en GitHub con tu código
   - En Vercel, elige "New Project" y selecciona el repositorio

3. **Configurar el proyecto**

   - Vercel detectará automáticamente tu configuración desde `vercel.json`
   - No necesitas configuraciones adicionales

4. **Desplegar**
   - Haz clic en "Deploy" y Vercel desplegará tu sitio
   - El proceso toma aproximadamente 1-2 minutos

## Trabajando con Cursor

1. **Editar localmente con Cursor**

   - Cursor funciona perfectamente con proyectos desplegados en Vercel
   - Edita cualquier archivo HTML, CSS o JavaScript con las capacidades de Cursor

2. **Mantén sincronizado con GitHub**

   - Utiliza los comandos Git en Cursor para hacer push de tus cambios
   - Vercel desplegará automáticamente cada cambio

3. **Actualizar scripts**
   - Para probar localmente: `npm run vercel-dev`
   - Para desplegar: `npm run deploy`

## Estructura de archivos importante

- `vercel.json`: Configuración principal que controla redirecciones y encabezados
- `api/redirects.js`: Función serverless para redirecciones basadas en idioma del navegador
- `package.json`: Contiene scripts para despliegue y desarrollo

## Transición desde DirectAdmin

Esta solución elimina la necesidad de configurar manualmente Apache, .htaccess y otras configuraciones complejas que causaban problemas. Todo se maneja automáticamente por Vercel, permitiéndote concentrarte en el contenido y diseño del sitio.
