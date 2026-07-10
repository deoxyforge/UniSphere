# Deployment Guide

## Frontend → Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click 'Add New Project' → import deoxyforge/UniSphere
3. Set Root Directory: client
4. Framework: Vite (auto-detected)
5. Build Command: npm run build
6. Output Directory: dist
7. Add Environment Variable: VITE_API_URL = https://unisphere-server.onrender.com/api
8. Deploy

## Backend → Render

1. Go to https://render.com and sign in with GitHub
2. New Web Service → connect deoxyforge/UniSphere
3. Root Directory: server
4. Runtime: Node
5. Build Command: npm install
6. Start Command: node server.js
7. Add Environment Variables:
   - MONGODB_URI = your MongoDB Atlas connection string
   - JWT_SECRET = a long random secret key
   - FRONTEND_URL = https://your-vercel-url.vercel.app
   - NODE_ENV = production
   - PORT = 10000 (Render default)
8. Deploy
9. Copy your Render URL (https://xxx.onrender.com)
10. Go back to Vercel and update VITE_API_URL with the Render URL + /api

## Database → MongoDB Atlas

1. Atlas cluster already configured
2. Ensure Network Access allows 0.0.0.0/0 (or Render's IPs)
3. Use the connection string from Atlas → Connect → Drivers
4. Format: mongodb+srv://<user>:<pass>@cluster.mongodb.net/unisphere

## Health Check

After deployment, verify:
- GET https://your-backend.onrender.com/api/health → { status: 'healthy' }
- Frontend at https://your-vercel-url.vercel.app loads
- Login with demo credentials works

## Static Uploads

ponytail: Render free tier has ephemeral filesystem — uploaded images will be lost on restart.
Upgrade path: Add Cloudinary SDK, store returned URL instead of local path.
For MVP/demo, local uploads work fine on a single-instance server.

