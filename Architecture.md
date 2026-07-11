# 🏗️ UniSphere Architecture

## Overview

UniSphere follows a classic 3-tier architecture deployed across cloud services.

```
┌──────────────────────────────────────────────────────┐
│              FRONTEND (React SPA)                    │
│         https://client-neon-sigma-98.vercel.app      │
│                                                      │
│  Pages · Components · AuthContext · Axios Services   │
│  React Router · Tailwind CSS · Lucide Icons          │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS REST API + JWT Bearer
┌──────────────────────▼───────────────────────────────┐
│              BACKEND (Express API)                   │
│        https://unisphere-i6uh.onrender.com/api       │
│                                                      │
│  Routes → Middleware → Controllers → Services        │
│  Helmet · CORS · Rate Limit · Multer · JWT · bcrypt  │
└──────────────────────┬───────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼───────────────────────────────┐
│           DATABASE (MongoDB Atlas)                   │
│      Cluster: unispherecluster.wb6gxs9.mongodb.net   │
│                                                      │
│  User · Event · Club · Registration                  │
│  Attendance · Notification                           │
└──────────────────────────────────────────────────────┘
```

## Component Layers

### Client Layer
- **Pages**: Route-level components (one file per URL route)
- **Components**: Reusable UI pieces (Navbar, Footer, Toast, modals)
- **Context**: `AuthContext.jsx` — global user state, login/logout actions
- **Services**: `api.js` — single Axios instance with interceptors

### Server Layer
- **Routes**: Thin URL-to-controller mapping with middleware chains
- **Middleware**: `auth.js` (JWT), `upload.js` (Multer), rate limiter, Helmet
- **Controllers**: Business logic, DB queries, response formatting
- **Services**: `aiService.js` (recommendation/analytics algorithms), `emailService.js`
- **Config**: `db.js` — MongoDB Atlas connection with validation

### Database Layer (MongoDB Atlas)
Six collections:
- `users` — User profiles with roles, interests, skills
- `events` — Campus events with status workflow
- `clubs` — Club profiles with member arrays
- `registrations` — Student↔Event join with QR data
- `attendances` — Student↔Event attendance records
- `notifications` — User notifications with read status

## Authentication Flow

```
1. POST /api/auth/login
   → bcrypt verify password
   → jwt.sign({ _id, role, email })
   → return { token, user }

2. Client stores token in localStorage

3. Axios request interceptor:
   config.headers.Authorization = `Bearer ${token}`

4. Server auth middleware:
   jwt.verify(token, JWT_SECRET)
   → req.user = decoded
   → next()

5. Axios response interceptor:
   401 response → clearToken() → redirect /login
```

## AI Service Architecture

All AI is contained in `server/services/aiService.js`. No external APIs are called.

```
analyticsController
  └── calls aiService functions
        ├── scoreEventForUser(user, events) → ranked events
        ├── predictAttendance(event, registrations, attendance) → prediction
        ├── rankSearchResults(query, events, clubs) → ranked results
        ├── calculateParticipationScore(user, events, registrations)
        ├── calculateEngagementScore(registrations, attendance)
        └── buildFacultyAnalytics(events, registrations, attendance)
```

## Deployment Architecture

```
Developer pushes to GitHub main branch
         │
         ├──► Render auto-detects push
         │       pulls server/ directory
         │       runs: npm install
         │       starts: node server.js
         │       serves on: https://unisphere-i6uh.onrender.com
         │
         └──► Vercel auto-detects push
                 pulls client/ directory
                 runs: npm install && npm run build
                 serves dist/ on CDN
                 URL: https://client-neon-sigma-98.vercel.app
```

## Security Architecture

| Layer | Measure |
|-------|---------|
| Passwords | Bcrypt (10 salt rounds) |
| Tokens | JWT (HS256, 7d expiry) |
| Headers | Helmet.js (HSTS, CSP, X-Frame-Options) |
| Rate Limiting | 200 requests per 15 minutes per IP |
| CORS | Whitelist: localhost + Vercel production domain |
| File Uploads | Multer with file type validation |
| Secrets | Environment variables (never in code) |
