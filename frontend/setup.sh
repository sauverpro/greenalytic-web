#!/bin/bash

# Quick Setup Script for GreenAlytic Frontend
# Run this on your server: bash setup.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 GreenAlytic Frontend Deployment Setup${NC}"
echo ""

# 1. Create directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
sudo mkdir -p /var/www/greenalytic-frontend
sudo chown -R $USER:$USER /var/www/greenalytic-frontend

# 2. Clone repository
echo -e "${YELLOW}📦 Enter your Git repository URL:${NC}"
read -p "Repository URL: " REPO_URL

cd /var/www/greenalytic-frontend
echo -e "${YELLOW}Cloning repository...${NC}"
git clone $REPO_URL .

# Navigate to frontend folder
cd frontend

# 3. Create environment file
echo -e "${YELLOW}⚙️  Creating environment file...${NC}"
cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=https://greenalytic.rw/api

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Node Environment
NODE_ENV=production
EOF

echo -e "${YELLOW}Please edit .env.local and add your API keys:${NC}"
echo "nano .env.local"
read -p "Press enter after editing the file..."

# 4. Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# 5. Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# 6. Create logs directory
mkdir -p logs

# 7. Start with PM2
echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 8. Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
sudo cp nginx.conf /etc/nginx/sites-available/greenalytic-frontend
sudo ln -sf /etc/nginx/sites-available/greenalytic-frontend /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# 9. Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Point your domain greenalytic.rw to server IP: 10.10.135.196"
echo "2. Wait for DNS propagation (may take 1-48 hours)"
echo "3. Install SSL certificate: sudo certbot --nginx -d greenalytic.rw -d www.greenalytic.rw"
echo ""
echo "Application status:"
pm2 status
