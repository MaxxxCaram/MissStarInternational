#!/bin/bash

# Crear archivo .env seguro
cat > .env << EOF
MONGODB_URI=mongodb+srv://caramvictoria:${MONGODB_PASSWORD}@missstar.mongodb.net/missstar?retryWrites=true&w=majority
NODE_ENV=production
PORT=443
DOMAIN=missstarinternational.com
SSL_CERT=/etc/letsencrypt/live/missstarinternational.com/fullchain.pem
SSL_KEY=/etc/letsencrypt/live/missstarinternational.com/privkey.pem
EOF

# Asegurar permisos
chmod 600 .env

# Hacer ejecutable el script de despliegue
chmod +x scripts/deploy.sh 