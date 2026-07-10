# Testing Guide

## Running Tests

### Backend

cd server && npm test

Tests are in server/tests/ using Jest.

### Frontend

npm run build (Vite build = TypeScript/JSX compile check)

## Manual Testing Checklist

### Auth
- [ ] Register as Student, Faculty, Admin
- [ ] Login with each role
- [ ] JWT token stored in localStorage
- [ ] Accessing protected route without token redirects to /login
- [ ] 401 response auto-clears token

### Events
- [ ] View events list (unauthenticated)
- [ ] Faculty creates event (status = pending)
- [ ] Admin approves event
- [ ] Student registers for approved event
- [ ] QR pass modal displays after registration
- [ ] Student cancels registration
- [ ] Admin rejects event

### Clubs
- [ ] View clubs list
- [ ] Student joins/leaves club
- [ ] Faculty creates club

### Attendance
- [ ] Faculty marks attendance for event
- [ ] Student views attendance history

### Notifications
- [ ] Notification created on event approval
- [ ] Mark all as read works

### AI Features
- [ ] GET /api/analytics/student/insights returns scores
- [ ] GET /api/analytics/search?q=tech returns ranked results
- [ ] GET /api/events/recommendations/user returns scored events

### Dashboards
- [ ] Student dashboard shows registrations + recommendations
- [ ] Faculty dashboard shows own events + analytics
- [ ] Admin dashboard shows platform stats

## API Testing with curl

curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@demo.com","password":"password123"}'

