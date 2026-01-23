# Deployment Guide for GreenAlytic Vehicle Monitoring

This guide explains how to deploy your Next.js application on an Ubuntu 24.04.3 LTS server.

## Prerequisites

Your server IP: `197.243.27.245` (Public IP)

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (v20 LTS recommended)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### 1.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx (Web Server)
```bash
sudo apt install -y nginx
```

## Step 2: Create Separate Directory and Clone Repository

```bash
# Create new directory for the frontend
sudo mkdir -p /var/www/greenalytic-frontend
sudo chown -R $USER:$USER /var/www/greenalytic-frontend

# Clone your repository
cd /var/www/greenalytic-frontend
git clone <your-repository-url> .

# Or clone just the frontend folder if it's a monorepo
git clone --depth 1 --filter=blob:none --sparse <your-repository-url> .
git sparse-checkout set frontend
cd frontend
```

## Step 3: Configure Environment Variables

Create `.env.local` file in the frontend directory:

```bash
cd /var/www/greenalytic-frontend/frontend
nano .env.local
```

Add your environment variables:
```env
NEXT_PUBLIC_API_URL=http://10.10.135.196:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Step 4: Install Dependencies and Build

```bash
cd /var/www/greenalytic-frontend/frontend
npm install
npm run build
```

## Step 5: Configure PM2

Create PM2 ecosystem file:
```bash
nano ecosystem.config.js
```

Use the provided `ecosystem.config.js` file in this directory.

Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/greenalytic-frontend
```

Use the provided `nginx.conf` configuration.

Enable the site:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/greenalytic-frontend
sudo ln -s /etc/nginx/sites-available/greenalytic-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Step 8: Configure DNS

Point your domain `greenalytic.rw` to your server IP `197.243.27.245` in your DNS settings:
- A Record: `greenalytic.rw` → `197.243.27.245`
- A Record: `www.greenalytic.rw` → `197.243.27.245`

Your application should be accessible at:
- `http://greenalytic.rw`
- `http://www.greenalytic.rw`

## Useful PM2 Commands

```bash
pm2 list                           # List all processes
pm2 logs greenalytic-frontend      # View logs
pm2 restart greenalytic-frontend   # Restart application
pm2 stop greenalytic-frontend      # Stop application
pm2 delete greenalytic-frontend    # Delete process
pm2 monit                          # Monitor resources
```

## Updating Your Application

```bash
cd /var/www/greenalytic-frontend/frontend
git pull origin main     # Pull latest changes
npm install              # Install new dependencies
npm run build            # Build the application
pm2 restart greenalytic-frontend  # Restart the app
```

## Troubleshooting

### Check PM2 logs
```bash
pm2 logs greenalytic-frontend --lines 100
```

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check if the application is running
```bash
pm2 status
curl http://localhost:3000
```

### Check Nginx configuration
```bash
sudo nginx -t
```

## Step 9: Setup SSL with Let's Encrypt (Required for Production)

Secure your domain with free SSL certificate:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d greenalytic.rw -d www.greenalytic.rw

# Auto-renewal is set up automatically, test with:
sudo certbot renew --dry-run
```

After SSL setup, your site will be accessible at:
- `https://greenalytic.rw`
- `https://www.greenalytic.rw`

## Performance Optimization

1. Enable gzip compression (already configured in nginx.conf)
2. Set up caching headers
3. Consider using a CDN for static assets
4. Monitor with PM2 monitoring: `pm2 install pm2-server-monit`
