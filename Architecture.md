# UniSphere Architecture

## Overview

UniSphere is a 3-tier architecture: React SPA → REST API → MongoDB Atlas.

## Tech Stack per Layer

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js 18, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (jsonwebtoken), bcrypt |
| Uploads | Multer (local disk) |
| Security | Helmet, express-rate-limit |

## Auth Flow

1. POST /auth/login → server validates → returns signed JWT (7d expiry)
2. Client stores in localStorage under 'unisphere_token'
3. Axios request interceptor attaches 'Authorization: Bearer <token>' to every request
4. 401 response interceptor clears token and redirects to /login

## Role-Based Access

| Role | Capabilities |
|------|-------------|
| Student | Register for events, join clubs, view own dashboard and attendance |
| Faculty | Create events (pending approval), mark attendance, view own analytics |
| Admin | Approve/reject events, manage all content, view platform analytics |

## AI Engine (local, zero API cost)

- aiService.js: pure JS scoring functions, no external calls
- analyticsController.js: MongoDB queries + aiService processing
- Smart Recommendations: weighted score (interests 30, clubs 40, history 20, department 15, popularity 15)
- Attendance Prediction: base 75% + weekday/capacity/category adjustments
- Smart Search: term-frequency ranking across title(3x)/category(2x)/description(1x)

## Event Registration Flow

Student clicks Register → POST /events/:id/register → validate (approved? capacity? duplicate?) → create Registration → push to Event.registeredStudents → create Notification → return QR data

## File Uploads

Multer stores to server/uploads/ — served as /uploads/* static route.
ponytail: ephemeral on Render free tier — upgrade to Cloudinary for production persistence.

