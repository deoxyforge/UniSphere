# Release Notes

## v1.0.0 — 2026-07-11

**Initial Production Release**

UniSphere is now live at https://client-neon-sigma-98.vercel.app

### What's Included

**Authentication**
- Student, Faculty, Admin roles
- JWT with 7-day expiry
- Bcrypt password hashing

**Events**
- Full CRUD with image upload
- Admin approval workflow
- Student registration with QR pass generation
- Related events

**Clubs**
- Full CRUD with image upload
- Student join/leave
- Coordinator management

**Attendance**
- Faculty marks attendance per event
- Student attendance history

**Notifications**
- In-app notifications for all major events
- Mark-all-read

**AI Features (100% local, $0 cost)**
- Smart event recommendations (multi-factor scoring)
- Attendance prediction (historical + contextual)
- TF-IDF smart search
- Student insights (participation + engagement scores)
- Faculty per-event analytics
- Admin platform-wide analytics

**Infrastructure**
- Frontend: Vercel (React/Vite)
- Backend: Render (Express/Node.js)
- Database: MongoDB Atlas
- Security: Helmet, rate limiting, CORS whitelist
- SEO: Open Graph, Twitter Card, sitemap, manifest

### Fixed Issues
- Footer.jsx missing Link import caused blank production page
- Toast.jsx template literal issue
- Render deployment was using old commit (pre-server/ folder)
- VITE_API_URL configured to correct Render URL

### Known Limitations
- Image uploads use local Multer storage (not persistent on Render free tier)
- Email notifications require SMTP configuration
- Real-time features require Socket.io (planned v1.1)
