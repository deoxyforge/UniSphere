# 🎓 UniSphere — Project Showcase

## Executive Summary

UniSphere is a smart, role-based campus event and club management platform designed for universities. It eliminates the fragmentation of campus activity discovery by providing a unified portal for students, faculty, and administrators — with AI-powered recommendations and QR-based attendance tracking.

---

## 🏆 Key Achievements

| Metric | Value |
|--------|-------|
| Features Implemented | 30+ |
| API Endpoints | 35+ |
| AI Algorithms | 6 |
| User Roles | 3 (Student / Faculty / Admin) |
| Frontend Pages | 15+ |
| Backend Controllers | 6 |
| Mongoose Models | 6 |
| External API Cost | $0 (100% local AI) |

---

## 🤖 Innovation: Local AI Engine

UniSphere demonstrates that **AI-powered features don't require external API calls or cost**. The entire AI engine (`server/services/aiService.js`) is:

- Pure JavaScript
- Zero external dependencies
- Zero latency vs API calls
- Zero ongoing cost
- Fully explainable (each recommendation has an `aiReason`)

### Algorithms Implemented
1. **Interest-weighted event scoring** (multi-factor recommendation)
2. **Attendance prediction** (historical + contextual factors)
3. **TF-IDF search ranking** (multi-field weighted search)
4. **Participation score calculation** (engagement analytics)
5. **Faculty analytics aggregation** (trend + growth analysis)
6. **Admin platform intelligence** (cross-collection analytics)

---

## 🎯 Problem → Solution

| Problem | UniSphere Solution |
|---------|-------------------|
| Events scattered in emails/chats | Centralized event hub with discovery |
| Students miss relevant events | AI recommendation engine |
| Manual attendance = errors | QR pass + digital attendance marking |
| No campus engagement data | Admin analytics with growth charts |
| Club membership is informal | Digital club join/leave with member counts |
| Faculty overload in approvals | Structured workflow with notifications |

---

## 🌐 Live Deployment

| Component | URL | Platform |
|-----------|-----|----------|
| Frontend | https://client-neon-sigma-98.vercel.app | Vercel |
| Backend API | https://unisphere-i6uh.onrender.com/api | Render |
| Health Check | https://unisphere-i6uh.onrender.com/api/health | Render |
| Database | MongoDB Atlas (cluster: unispherecluster) | MongoDB Cloud |
| Source Code | https://github.com/deoxyforge/UniSphere | GitHub |

---

## 📐 Technical Architecture

```
React SPA ─── HTTPS/REST ─── Express API ─── MongoDB Atlas
   │                              │
   │                          AI Service
   │                      (local algorithms)
   │
   └── JWT Auth (stored in localStorage)
       └── Axios interceptor (auto-attach token)
       └── 401 interceptor (auto-logout + redirect)
```

---

## 🔐 Security Measures

- JWT tokens with 7-day expiry
- Bcrypt password hashing (salt rounds: 10)
- Helmet.js security headers
- Rate limiting (200 req/15min per IP)
- CORS origin whitelist
- Server-side role validation on every protected route
- `.env` excluded from version control

---

## 🚀 Deployment Architecture

```
GitHub Push ──► Render Auto-Deploy (server/)
             └► Vercel Auto-Deploy (client/)
                    │
                    └── VITE_API_URL env var
                        points to Render backend
```
