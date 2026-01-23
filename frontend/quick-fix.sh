#!/bin/bash

# Quick fix script for greenalytic deployment
# Run this on your server: bash quick-fix.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔧 Quick Fix for GreenAlytic Deployment${NC}"
echo ""

# 1. Check if app is running on port 3000
echo -e "${YELLOW}Step 1: Checking if Next.js app is running...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ App is running on port 3000${NC}"
else
    echo -e "${RED}✗ App is NOT running!${NC}"
    echo "Starting the application..."
    pm2 start ecosystem.config.js || echo "Check if ecosystem.config.js exists"
    sleep 3
fi
echo ""

# 2. Check PM2 status
echo -e "${YELLOW}Step 2: PM2 Status${NC}"
pm2 list
echo ""

# 3. Check Nginx configuration files
echo -e "${YELLOW}Step 3: Checking Nginx configuration...${NC}"
if [ -f /etc/nginx/sites-available/greenalytic-frontend ]; then
    echo -e "${GREEN}✓ Config file exists${NC}"
    
    # Check if it's enabled
    if [ -L /etc/nginx/sites-enabled/greenalytic-frontend ]; then
        echo -e "${GREEN}✓ Site is enabled${NC}"
    else
        echo -e "${RED}✗ Site is NOT enabled. Enabling now...${NC}"
        sudo ln -s /etc/nginx/sites-available/greenalytic-frontend /etc/nginx/sites-enabled/
    fi
else
    echo -e "${RED}✗ Nginx config file missing!${NC}"
    echo "Copy the nginx.conf file:"
    echo "sudo cp nginx.conf /etc/nginx/sites-available/greenalytic-frontend"
fi
echo ""

# 4. Remove default nginx site if it exists
echo -e "${YELLOW}Step 4: Removing default Nginx site...${NC}"
if [ -L /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
    echo -e "${GREEN}✓ Removed default site${NC}"
else
    echo -e "${GREEN}✓ Default site already removed${NC}"
fi
echo ""

# 5. Test Nginx configuration
echo -e "${YELLOW}Step 5: Testing Nginx configuration...${NC}"
sudo nginx -t
echo ""

# 6. Restart Nginx
echo -e "${YELLOW}Step 6: Restarting Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager | head -5
echo ""

# 7. Check firewall
echo -e "${YELLOW}Step 7: Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 'Nginx Full'
echo -e "${GREEN}✓ Firewall rules added${NC}"
echo ""

# 8. Test connections
echo -e "${YELLOW}Step 8: Testing connections...${NC}"
echo "Testing localhost:3000 (Next.js):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000 || echo "Failed"

echo "Testing localhost:80 (Nginx):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost || echo "Failed"

echo "Testing local IP:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://10.10.135.196 || echo "Failed"
echo ""

# 9. Show what's listening on ports
echo -e "${YELLOW}Step 9: Ports listening...${NC}"
echo "Port 3000:"
sudo ss -tulpn | grep :3000 || echo "Nothing listening"
echo "Port 80:"
sudo ss -tulpn | grep :80 || echo "Nothing listening"
echo ""

# Final instructions
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Fix Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test locally: curl http://localhost"
echo "2. Check logs: pm2 logs greenalytic-frontend"
echo "3. If still issues, check: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "For external access to work, ensure:"
echo "- Your cloud provider/hosting allows inbound traffic on ports 80 and 443"
echo "- Security groups/firewall rules allow HTTP/HTTPS"
