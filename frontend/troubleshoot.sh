#!/bin/bash

# Troubleshooting script for greenalytic.rw deployment issues
# Run this on your server: bash troubleshoot.sh

echo "🔍 GreenAlytic Deployment Troubleshooting"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Check DNS Resolution
echo -e "${YELLOW}1. Checking DNS resolution...${NC}"
if host greenalytic.rw > /dev/null 2>&1; then
    echo -e "${GREEN}✓ DNS resolves${NC}"
    host greenalytic.rw
else
    echo -e "${RED}✗ DNS NOT resolving - Domain may not be configured yet${NC}"
fi
echo ""

# 2. Check if application is running
echo -e "${YELLOW}2. Checking PM2 status...${NC}"
pm2 status greenalytic-frontend
echo ""

# 3. Check if app is responding locally
echo -e "${YELLOW}3. Checking if app responds on localhost:3000...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Application is responding${NC}"
else
    echo -e "${RED}✗ Application is NOT responding${NC}"
    echo "Try: pm2 restart greenalytic-frontend"
fi
echo ""

# 4. Check Nginx status
echo -e "${YELLOW}4. Checking Nginx status...${NC}"
sudo systemctl status nginx --no-pager | head -10
echo ""

# 5. Check Nginx configuration
echo -e "${YELLOW}5. Testing Nginx configuration...${NC}"
sudo nginx -t
echo ""

# 6. Check if Nginx site is enabled
echo -e "${YELLOW}6. Checking if site is enabled...${NC}"
if [ -L /etc/nginx/sites-enabled/greenalytic-frontend ]; then
    echo -e "${GREEN}✓ Site is enabled${NC}"
    ls -l /etc/nginx/sites-enabled/greenalytic-frontend
else
    echo -e "${RED}✗ Site is NOT enabled${NC}"
    echo "Run: sudo ln -s /etc/nginx/sites-available/greenalytic-frontend /etc/nginx/sites-enabled/"
fi
echo ""

# 7. Check firewall
echo -e "${YELLOW}7. Checking firewall rules...${NC}"
sudo ufw status
echo ""

# 8. Check ports
echo -e "${YELLOW}8. Checking if ports are listening...${NC}"
echo "Port 80 (HTTP):"
sudo netstat -tulpn | grep :80 || echo "Not listening"
echo "Port 443 (HTTPS):"
sudo netstat -tulpn | grep :443 || echo "Not listening"
echo "Port 3000 (Next.js):"
sudo netstat -tulpn | grep :3000 || echo "Not listening"
echo ""

# 9. Show recent nginx error logs
echo -e "${YELLOW}9. Recent Nginx error logs (last 20 lines)...${NC}"
sudo tail -20 /var/log/nginx/greenalytic-error.log 2>/dev/null || echo "No error log found"
echo ""

# 10. Show recent PM2 logs
echo -e "${YELLOW}10. Recent PM2 logs (last 20 lines)...${NC}"
pm2 logs greenalytic-frontend --lines 20 --nostream
echo ""

# Summary
echo "=========================================="
echo -e "${YELLOW}Quick Fixes:${NC}"
echo "1. If DNS not resolving: Ensure A record points to 197.243.27.245, wait for DNS propagation (up to 48h)"
echo "2. If app not responding: pm2 restart greenalytic-frontend"
echo "3. If Nginx errors: sudo systemctl restart nginx"
echo "4. View live logs: pm2 logs greenalytic-frontend"
echo ""
echo "Test local access: curl http://localhost:3000"
echo "Test nginx: curl http://localhost"
echo "Test by IP: curl http://197.243.27.245"
echo "Test domain: curl http://greenalytic.rw"
