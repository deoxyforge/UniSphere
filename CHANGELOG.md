# Changelog

All notable changes to UniSphere are documented in this file.

## [1.0.0] — 2026-07-10

### Added
- Full-stack campus management platform (React + Express + MongoDB Atlas)
- JWT authentication with role-based access (Student, Faculty, Admin)
- Event management with approval workflow (Faculty creates → Admin approves)
- Club management with join/leave membership
- QR-code based attendance tracking per event
- Student Dashboard with AI-powered event recommendations
- Faculty Dashboard with event performance analytics
- Admin Dashboard with platform-wide statistics
- AI analytics engine (all local, no external API keys):
  - Smart event recommendations
  - Attendance prediction with confidence score
  - Smart search with TF-IDF-style ranking
  - Student insights (participation + engagement scores)
  - Faculty analytics (monthly growth, category breakdown)
  - Admin analytics (top departments, clubs, students, faculty)
- Real-time notifications for event approvals and registrations
- Profile management (bio, skills, interests, profile image)
- Responsive UI with Tailwind CSS (dark mode)
- Custom 404, About, Privacy, Terms, Contact pages
- Professional Footer with version badge
- Toast notification system
- SEO: Open Graph, Twitter Card, manifest.json, robots.txt, sitemap.xml
- Deployment configs: vercel.json (frontend), render.json (backend)
- Comprehensive API documentation (API_DOCS.md + OpenAPI.yaml)

### Infrastructure
- MongoDB Atlas for cloud database
- Multer for file uploads (event banners, club logos, profile images)
- Helmet + express-rate-limit for security
- Nodemon for development hot-reload
- Vite for frontend build tooling

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/).
