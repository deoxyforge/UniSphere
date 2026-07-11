<div align="center">

# 🎓 UniSphere

### Smart Campus Events & Clubs Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-7c3aed.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg)](https://vercel.com)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46e3b7.svg)](https://render.com)

**A full-stack campus management platform connecting students, faculty, and administration through events, clubs, AI-powered recommendations, and intelligent analytics.**

[🌐 Live Demo](https://client-neon-sigma-98.vercel.app) · [📡 API Health](https://unisphere-i6uh.onrender.com/api/health) · [📄 API Docs](./docs/OpenAPI.yaml) · [🐛 Report Bug](https://github.com/deoxyforge/UniSphere/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [AI Features](#-ai-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Deployment](#-deployment)
- [API Overview](#-api-overview)
- [Testing](#-testing)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 About

UniSphere is a **smart campus events and clubs management hub** built for universities. The platform bridges the gap between students, faculty, and administration by centralizing all campus activities in one place.

**Key problems it solves:**
- Events scattered across email, chat groups, and physical flyers
- No personalized event discovery for students
- Manual, error-prone attendance tracking
- Zero visibility into campus engagement patterns for administrators
- Disconnected club membership management

---

## 🌐 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | https://client-neon-sigma-98.vercel.app |
| **Backend API** | https://unisphere-i6uh.onrender.com/api |
| **Health Check** | https://unisphere-i6uh.onrender.com/api/health |
| **GitHub** | https://github.com/deoxyforge/UniSphere |

> **Demo Credentials**
> Register a free account with any role (Student / Faculty / Admin) at the live site.

---

## ✨ Features

### 🎓 Student Features
- Personalized event discovery feed powered by AI recommendations
- One-click event registration with automatic QR pass generation
- Club discovery, join/leave clubs instantly
- Complete attendance history and participation stats
- Real-time notifications (event approvals, cancellations, reminders)
- Profile management with skills, interests, and bio

### 👨‍🏫 Faculty Features
- Create and manage campus events (auto-submitted for admin approval)
- Upload event banners and set capacity limits
- Mark student attendance using QR scan or manual selection
- AI-powered attendance prediction for upcoming events
- Personal event analytics (registration trends, attendance rates)

### 🛡️ Admin Features
- Event approval/rejection workflow with organizer notifications
- Platform-wide analytics dashboard with growth charts
- User management and role oversight
- Top clubs, most active students, department statistics
- Full CRUD control over all events and clubs

### 🌐 General
- Smart full-text search across events and clubs (TF-IDF ranking)
- Advanced filter by category, date, status
- Dark mode premium UI with micro-animations
- Fully responsive design (mobile-first)
- SEO optimized (Open Graph, Twitter Card, sitemap, manifest)

---

## 🤖 AI Features

All AI in UniSphere is **100% local** — no external API keys required, no cost, no latency.

| Feature | Endpoint | Description |
|---------|----------|-------------|
| **Smart Recommendations** | `GET /api/events/recommendations/user` | Scores events by interests (+30), club match (+40), past categories (+20), department (+15), popularity (+2/registration) |
| **Attendance Prediction** | `GET /api/analytics/events/:id/predict` | Predicts attendance rate using weekday patterns, venue size, category engagement, club size |
| **Smart Search** | `GET /api/analytics/search?q=` | TF-IDF ranked search — title (3×), category (2×), description (1×), prefix match (+10), substring match (+5) |
| **Student Insights** | `GET /api/analytics/student/insights` | Participation score, engagement score, activity timeline, category interests, recommendations |
| **Faculty Analytics** | `GET /api/analytics/faculty` | Per-event stats, monthly registration growth, category breakdown |
| **Admin Analytics** | `GET /api/analytics/admin` | Platform-wide stats, user growth, department distribution, top performers |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Vercel)                   │
│         React 18 + Vite + Tailwind CSS              │
│    React Router · Axios · Lucide React · Toast      │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / REST API
┌────────────────────▼────────────────────────────────┐
│                   SERVER (Render)                    │
│              Express.js · Node.js 18                │
│   Helmet · CORS · Rate Limiting · Multer · JWT      │
└────────────────────┬────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────┐
│               DATABASE (MongoDB Atlas)               │
│   User · Event · Club · Registration · Attendance   │
│                    Notification                      │
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
1. React SPA calls REST API with JWT Bearer token
2. Express middleware validates token → routes to controller
3. Controller queries MongoDB Atlas via Mongoose
4. AI service computes scores/insights from query results
5. JSON response returned to frontend

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router | 6 | Client-side routing |
| Axios | 1.x | HTTP client |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4 | REST API framework |
| Mongoose | 8 | MongoDB ODM |
| JWT | 9 | Authentication tokens |
| Multer | 1.4 | File upload handling |
| Helmet | 7 | Security headers |
| express-rate-limit | 7 | Rate limiting |
| Bcryptjs | 2.4 | Password hashing |
| Nodemailer | 6.9 | Email notifications |

### Infrastructure
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database |
| Vercel | Frontend hosting |
| Render | Backend hosting |
| GitHub | Version control & CI |

---

## 📁 Folder Structure

```
UniSphere/
├── client/                     # React frontend
│   ├── public/                 # Static files (manifest, robots, sitemap)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── QrScannerModal.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── Clubs.jsx
│   │   │   ├── ClubDetails.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios instance & API helpers
│   │   ├── App.jsx             # Routes definition
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── vercel.json             # Vercel deployment config
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── clubController.js
│   │   ├── attendanceController.js
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── upload.js           # Multer config
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Club.js
│   │   ├── Registration.js
│   │   ├── Attendance.js
│   │   └── Notification.js
│   ├── routes/                 # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── clubRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── analyticsRoutes.js
│   ├── services/
│   │   ├── aiService.js        # Local AI algorithms
│   │   └── emailService.js     # Nodemailer wrapper
│   ├── scripts/
│   │   └── seed.js             # Database seeding
│   ├── tests/
│   │   └── api.test.js         # API integration tests
│   ├── server.js               # Express app entry point
│   └── package.json
│
├── docs/                       # Technical documentation
│   ├── Architecture.md
│   ├── DatabaseSchema.md
│   ├── DeploymentGuide.md
│   ├── DeveloperGuide.md
│   ├── OpenAPI.yaml
│   └── TestingGuide.md
│
├── .github/
│   ├── workflows/              # CI/CD actions
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── render.yaml                 # Render deployment config
├── README.md
├── CHANGELOG.md
├── RELEASE_NOTES.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- MongoDB Atlas account (or local MongoDB 6+)

### 1. Clone the Repository

```bash
git clone https://github.com/deoxyforge/UniSphere.git
cd UniSphere
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Create `server/.env` (see [Environment Variables](#-environment-variables) below).

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/unisphere?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Optional: Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=UniSphere <noreply@unisphere.edu>

# Optional: Cloud storage
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Frontend (`client/.env`)

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files.** They are listed in `.gitignore`.

---

## 💻 Local Development

### Start the Backend

```bash
cd server
npm run dev      # nodemon hot-reload on port 5000
```

### Start the Frontend

```bash
cd client
npm run dev      # Vite HMR on port 5173
```

Open http://localhost:5173 in your browser.

### Seed Sample Data (Optional)

```bash
cd server
npm run seed     # Populates MongoDB with demo events, clubs, and users
```

---

## ☁️ Deployment

### Backend → Render

1. Sign up at [render.com](https://render.com)
2. New Web Service → connect `deoxyforge/UniSphere`
3. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add Environment Variables (see above)
5. Deploy

### Frontend → Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. New Project → import `deoxyforge/UniSphere`
3. Configure:
   - Root Directory: `client`
   - Framework: Vite
4. Add: `VITE_API_URL = https://your-render-url.onrender.com/api`
5. Deploy

Full guide: [docs/DeploymentGuide.md](./docs/DeploymentGuide.md)

---

## 📡 API Overview

Base URL: `https://unisphere-i6uh.onrender.com/api`

All authenticated endpoints require: `Authorization: Bearer <token>`

| Group | Endpoint | Auth | Description |
|-------|----------|------|-------------|
| **Auth** | `POST /auth/register` | None | Register user |
| | `POST /auth/login` | None | Login |
| | `GET /auth/profile` | User | Get own profile |
| | `PUT /auth/profile` | User | Update profile |
| **Events** | `GET /events` | None | List approved events |
| | `GET /events/:id` | None | Event details |
| | `POST /events` | Faculty | Create event |
| | `PUT /events/:id/approve` | Admin | Approve event |
| | `POST /events/:id/register` | Student | Register + QR pass |
| **Clubs** | `GET /clubs` | None | List all clubs |
| | `POST /clubs/join` | Student | Join club |
| | `POST /clubs/leave` | Student | Leave club |
| **Attendance** | `POST /attendance` | Faculty | Mark attendance |
| | `GET /attendance/student` | Student | Own history |
| **Analytics** | `GET /analytics/admin` | Admin | Platform stats |
| | `GET /analytics/faculty` | Faculty | Own event stats |
| | `GET /analytics/student/insights` | Student | AI insights |
| **AI** | `GET /events/recommendations/user` | Student | Personalized feed |
| | `GET /analytics/events/:id/predict` | Faculty | Attendance prediction |
| | `GET /analytics/search?q=` | None | Smart search |

Full OpenAPI spec: [docs/OpenAPI.yaml](./docs/OpenAPI.yaml)

---

## 🧪 Testing

### Backend API Tests

```bash
cd server
npm test
```

### Frontend Build Check

```bash
cd client
npm run build
```

### Manual Testing Checklist

See [docs/TestingGuide.md](./docs/TestingGuide.md) for the complete manual verification checklist.

---

## 🔮 Future Improvements

| Priority | Feature |
|----------|---------|
| High | Cloudinary CDN for persistent image storage |
| High | Real-time notifications via Socket.io |
| High | Email notifications via Nodemailer |
| Medium | Event calendar view (month/week/day) |
| Medium | Club announcement boards |
| Medium | Waitlist for full events |
| Medium | Event feedback and ratings |
| Low | React Native mobile app |
| Low | Multi-language support (i18n) |
| Low | Redis caching for analytics |

---

## 👥 Contributors

| Name | Role |
|------|------|
| **deoxyforge** | Full-Stack Developer, Project Lead |

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Made with ❤️ for campus communities everywhere.

**[⭐ Star this repo](https://github.com/deoxyforge/UniSphere)** if you found it useful!

</div>
