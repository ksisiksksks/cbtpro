# CBTPro Deployment Guide

This guide covers deploying CBTPro in a production environment using Docker and Docker Compose.

## Prerequisites
- A Linux VPS (Ubuntu 20.04+ recommended) with at least 2GB RAM and 20GB Storage.
- Docker and Docker Compose installed.
- Domain name pointed to your VPS IP (e.g., `cbt.yourinstitution.edu`).
- Nginx installed (for Reverse Proxy).

## Step 1: Clone the Repository
```bash
git clone https://github.com/ksisiksksks/cbtpro.git
cd cbtpro
```

## Step 2: Configure Environment
Copy the example environment files or create `.env` files in both the root, `backend/`, and `frontend/` folders.

**`backend/.env`:**
```properties
PORT=5000
DATABASE_URL="mysql://root:secure_password@database:3306/cbtpro_db"
JWT_SECRET="your_very_long_secure_jwt_secret"
GROQ_API_KEY="your_groq_api_key"
```

**`frontend/.env`:**
```properties
VITE_API_BASE_URL=https://cbt.yourinstitution.edu/api
```

## Step 3: Run Docker Compose
At the root of the project:
```bash
docker-compose up -d --build
```
This will spin up:
1. `cbtpro_db`: MySQL 8.0 instance
2. `cbtpro_backend`: Node.js Express API
3. `cbtpro_frontend`: React Vite App

## Step 4: Run Prisma Migrations
Exec into the backend container to migrate the database:
```bash
docker exec -it cbtpro_backend npx prisma db push
docker exec -it cbtpro_backend npx ts-node seed.ts
```

## Step 5: Configure Nginx (Reverse Proxy)
Create a new Nginx block:
```nginx
server {
    listen 80;
    server_name cbt.yourinstitution.edu;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uploaded Recordings
    location /uploads/ {
        proxy_pass http://localhost:5000/uploads/;
    }
}
```
Reload Nginx: `sudo systemctl reload nginx`.

## Step 6: SSL Certificate
Run Certbot to secure your domain:
```bash
sudo certbot --nginx -d cbt.yourinstitution.edu
```

Your CBTPro instance is now live and secure!
