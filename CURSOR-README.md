# Guía para trabajar con Miss Star International en Cursor

Este proyecto está optimizado para trabajar con Cursor, un IDE inteligente con capacidades de IA. Esta guía te ayudará a utilizar Cursor de manera efectiva con este proyecto.

## Configuración inicial

1. **Abrir el proyecto en Cursor**

   - Abre Cursor
   - Selecciona "Open Folder" y elige la carpeta del proyecto

2. **Explorar la estructura del proyecto**
   - Usa el explorador de archivos para familiarizarte con la estructura
   - Los directorios principales son: `/en`, `/es`, `/pt`, `/vi`, `/th`, `/assets`, y `/api`

## Edición eficiente con Cursor

### Comandos y atajos útiles

- `Ctrl+Shift+I`: Formatear el documento actual
- `Ctrl+Space`: Activar sugerencias de código
- `Ctrl+Shift+Space`: Activar sugerencias de IA contextual
- `Alt+/`: Abrir chat de IA para preguntas sobre el código
- `Ctrl+P`: Buscar archivos rápidamente

### Uso de la IA para edición

Para tareas comunes en este proyecto:

1. **Modificar contenido multilingüe**

   - Selecciona el texto en un archivo de idioma (ej: `/en/index.html`)
   - Presiona `Alt+/` y pide: "Traduce este texto a [idioma]"
   - Cursor generará una traducción adecuada

2. **Modificar estilos**

   - Abre archivos CSS y utiliza `Ctrl+Shift+Space` para sugerencias de estilo
   - Pide a Cursor: "Ajusta este estilo para hacer [cambio específico]"

3. **Solucionar problemas de redirección**
   - Si encuentras problemas con redirecciones, abre `vercel.json`
   - Usa `Alt+/` y pregunta: "¿Cómo puedo solucionar este problema de redirección?"

## Trabajando con Vercel desde Cursor

1. **Terminal integrado**

   - Abre el terminal integrado con `` Ctrl+`  ``
   - Ejecuta comandos de Vercel: `npx vercel login`, `npm run deploy`, etc.

2. **Despliegue desde Cursor**

   - Para probar localmente: `npm run vercel-dev`
   - Para desplegar a producción: `npm run deploy`

3. **Integración con Git**
   - Usa las funciones de Git integradas para commit, push y pull
   - Cursor muestra indicadores visuales de cambios

## Solución de problemas comunes

- **Si Cursor no muestra sugerencias**: Verifica que estés en el archivo correcto y que el tipo de archivo sea reconocido
- **Si la IA no entiende el contexto**: Proporciona más contexto en tu pregunta
- **Para problemas de rendimiento**: Cierra otros archivos grandes no utilizados

## Automatizaciones útiles

- **Creación de nuevas páginas**: Usa Cursor para clonar páginas existentes y adaptarlas
- **Actualización masiva**: Pide a Cursor que actualice varios archivos con patrones similares

## Referencia rápida

- **Archivos clave**: `vercel.json`, `package.json`, `api/redirects.js`
- **Carpetas importantes**: `/en`, `/es`, `/pt`, `/vi`, `/th`, `/assets`
- **Scripts NPM**: `npm run dev`, `npm run vercel-dev`, `npm run deploy`
