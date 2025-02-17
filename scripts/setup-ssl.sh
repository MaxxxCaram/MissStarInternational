#!/bin/bash

# Instalar Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx \
    -d missstarinternational.com \
    -d www.missstarinternational.com \
    --non-interactive \
    --agree-tos \
    --email info@missnlproductions.com

# Configurar renovación automática
sudo certbot renew --dry-run 