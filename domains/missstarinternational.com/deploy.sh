#!/bin/bash

# Limpiar cache del servidor
rm -rf domains/missstarinternational.com/public_html/tmp/*
rm -rf domains/missstarinternational.com/public_html/cache/*

# Ajustar permisos
find domains/missstarinternational.com/public_html -type f -exec chmod 644 {} \;
find domains/missstarinternational.com/public_html -type d -exec chmod 755 {} \;

# Verificar propiedad de archivos
chown -R u127684p143111:u127684p143111 domains/missstarinternational.com/public_html/

# Reiniciar servicios web si es necesario
/usr/local/directadmin/directadmin restart httpd 