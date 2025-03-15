# Miss Star International - Bitácora de Desarrollo

## Último Update: 15/03/2024

## Prueba de Funcionamiento
Última actualización: 15 de marzo de 2024

### Estructura Actual del Sitio 

### Cambios Realizados Hoy
1. Implementación de scripts de despliegue FTP automático
2. Limpieza de scripts obsoletos
3. Automatización del proceso de publicación

### Problemas Pendientes
1. **URGENTE**: Las banderas no desaparecen después de seleccionar el idioma
2. **IMPORTANTE**: Sincronizar contenido entre idiomas
   - Todos los idiomas deben tener el mismo contenido que la versión en inglés
   - Pendiente: es/, fr/, pt/

### Pendientes Técnicos
1. Eliminar carpeta .vs
2. Organizar mejor la estructura de assets
3. Corregir el efecto fade de las banderas
4. Revisar page redirections

### Notas Importantes
- Las banderas deben desaparecer al hacer clic
- Cada versión de idioma debe ser idéntica en estructura
- Mantener consistencia en todas las traducciones

### Instrucciones de Despliegue FTP
Para subir el sitio al servidor FTP, sigue estos pasos:

1. **Despliegue Automático (Recomendado)**:
   - Ejecuta el archivo `scripts/auto-deploy.bat` haciendo doble clic
   - Espera a que el proceso termine

2. **Despliegue Manual**:
   - Ejecuta `node scripts/deploy-ftp.js` en la terminal para subir archivos al FTP
   - O ejecuta `node scripts/deploy-ftp.js` para limpiar scripts obsoletos y subir archivos

3. **Credenciales FTP**:
   - Host: web0151.zxcs.nl
   - Usuario: u127684p143111
   - Contraseña: C^F]TDaQ0h579taQ2oKI|(o

### Próximos Pasos
1. Corregir el efecto fade de las banderas
2. Copiar estructura de /en/ a los otros idiomas
3. Traducir contenido manteniendo el mismo formato

¿Quieres que trabajemos primero en arreglar el problema de las banderas o en sincronizar el contenido entre idiomas? 