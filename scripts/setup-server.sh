#!/bin/bash

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm mongodb

# Configurar MongoDB
sudo systemctl enable mongodb
sudo systemctl start mongodb

# Instalar PM2
sudo npm install -g pm2

# Crear directorios necesarios
sudo mkdir -p /var/www/missstarinternational
sudo chown -R $USER:$USER /var/www/missstarinternational 