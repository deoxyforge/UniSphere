# UniSphere Version 1.0.0 Release Notes

We are excited to announce the official v1.0.0 release of **UniSphere**, a smart campus events and clubs management portal.

## 🚀 Key Highlights

1. **Intelligent Recommendation Engine**: Fully localized scoring algorithm recommending events to students based on interests, department, registered events, and joined clubs.
2. **Attendance Prediction**: Visual prediction rate (percentage) and confidence metrics for faculty using historical attendance, weekday patterns, and event scale.
3. **Smart Ranked Search**: Multi-keyword scoring system showing ranked results across all approved campus events and clubs.
4. **Interactive Dashboards**: Role-tailored homepages for Student, Faculty, and Admin users.
5. **Robust QR Pass System**: Self-service QR pass generation upon registration and instant attendance validation.
6. **Real-time Notifications**: Triggered on event creation, admin approvals, registrations, and cancellations.

## 🛠️ Tech Stack & Security
- **Frontend**: React 18, Vite 8, Tailwind CSS, Axios, Lucide React, Custom Toast notifications
- **Backend**: Node.js, Express, JWT, Mongoose, Multer for banner/logo uploads
- **Database**: Cloud-hosted MongoDB Atlas with secure indices
- **Security**: Rate limits (200 req/15min), Helmet.js security headers, CORS origin limits

## 📁 Repository Meta
- **Description**: Smart Campus Events & Clubs Hub with local AI-powered recommendations, attendance prediction, and QR check-in.
- **Topics**: react, express, mongodb, campus-management, qr-attendance, smart-recommendation, tailwindcss, vite
- **Homepage**: https://unisphere.vercel.app
