#!/bin/bash

# Configuración
DOMAIN="missstarinternational.com"
SERVER_IP="tu_ip_del_servidor"
SERVER_USER="tu_usuario"
DEPLOY_PATH="/var/www/missstarinternational"

# Instalar dependencias y construir
npm install
npm run build

# Configurar SSL con Let's Encrypt
ssh $SERVER_USER@$SERVER_IP "sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN"

# Subir archivos al servidor
rsync -avz --exclude 'node_modules' --exclude '.git' \
    ./ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

# Configurar Nginx
ssh $SERVER_USER@$SERVER_IP "sudo bash -c 'cat > /etc/nginx/sites-available/$DOMAIN'" << 'EOF'
server {
    listen 80;
    server_name missstarinternational.com www.missstarinternational.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name missstarinternational.com www.missstarinternational.com;

    ssl_certificate /etc/letsencrypt/live/missstarinternational.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/missstarinternational.com/privkey.pem;

    root /var/www/missstarinternational/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /assets {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Reiniciar servicios
ssh $SERVER_USER@$SERVER_IP "sudo systemctl restart nginx && \
    cd $DEPLOY_PATH && \
    npm install --production && \
    pm2 restart all" 