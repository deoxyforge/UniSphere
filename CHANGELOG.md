# Changelog

All notable changes to UniSphere are documented here.
Format: [Semantic Versioning](https://semver.org/)

---

## [1.0.0] - 2026-07-11

### Added — Core Platform
- JWT-based authentication with Student, Faculty, Admin roles
- User registration with department, interests, skills
- Bcrypt password hashing with secure token generation
- Protected routes with role-based middleware

### Added — Event Management
- Faculty can create events (pending approval workflow)
- Event banners via Multer file upload
- Admin approve/reject events with organizer notifications
- Student event registration with capacity enforcement
- QR pass generation on registration
- Event cancellation with attendee notifications
- Related events suggestion

### Added — Club Management
- Faculty can create clubs with logo uploads
- Student join/leave clubs
- Member count tracking
- Club coordinator management

### Added — Attendance System
- Faculty marks attendance per event
- QR-based attendance verification
- Student attendance history
- Attendance rate calculation per event

### Added — Notification System
- In-app notifications for event approvals, cancellations
- Mark all as read
- Notification badges

### Added — AI Features
- Smart event recommendation engine (local, zero cost)
- Attendance prediction with confidence score
- TF-IDF smart search across events and clubs
- Student participation and engagement scoring
- Faculty per-event analytics with monthly trends
- Admin platform-wide analytics with growth charts

### Added — Frontend
- 15+ pages (Landing, Login, Register, Dashboards, Events, Clubs, Profile, About, Contact, 404)
- Dark mode premium UI with Tailwind CSS
- Micro-animations and hover effects
- Responsive mobile-first design
- Toast notification system
- QR Pass modal with ticket details
- Real-time form validation

### Added — Infrastructure
- MongoDB Atlas cloud database
- Vercel frontend deployment
- Render backend deployment
- Helmet.js security headers
- Rate limiting (200/15min)
- CORS whitelist
- SEO optimization (Open Graph, Twitter Card, sitemap, manifest)

### Added — Documentation
- Comprehensive README.md (portfolio quality)
- OpenAPI YAML specification
- Architecture documentation
- Database schema documentation
- Developer guide
- Deployment guide
- Testing guide
- CHANGELOG and RELEASE_NOTES
- CONTRIBUTING, CODE_OF_CONDUCT, SECURITY policies
- GitHub Actions CI workflow
- GitHub community templates

### Fixed
- Footer.jsx missing Link import (blank page on production)
- Toast.jsx template literal broken by heredoc
- Icon import: Github → Globe (lucide-react version compatibility)
- CORS configuration for production Vercel URL

---

## [0.1.0] - 2026-07-09

### Added
- Initial project scaffold (React + Vite + Express)
- MongoDB Atlas connection
- Basic authentication skeleton
- GitHub repository setup
