#!/bin/bash

# Deployment script for GreenAlytic Vehicle Monitoring
# Run this script on your server after transferring the files

set -e

echo "🚀 Starting deployment process..."

# Configuration
APP_DIR="/var/www/greenalytic-frontend/frontend"
APP_NAME="greenalytic-frontend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📁 Navigating to application directory...${NC}"
cd $APP_DIR

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production=false

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
if pm2 describe $APP_NAME > /dev/null 2>&1; then
  pm2 restart $APP_NAME
else
  pm2 start ecosystem.config.js
  pm2 save
fi

echo -e "${YELLOW}💾 Saving PM2 configuration...${NC}"
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "Application Status:"
pm2 status $APP_NAME

echo ""
echo "View logs with: pm2 logs $APP_NAME"
echo "Monitor app with: pm2 monit"
