# 🗺️ UniSphere — Visual Walkthrough

**Production URL:** https://client-neon-sigma-98.vercel.app

This document walks through every major user journey in UniSphere.

---

## 1. 🏠 Landing Page

**URL:** `/`

The landing page greets visitors with:
- Hero section with UniSphere branding and tagline
- Platform statistics (events, students, clubs)
- Feature highlights section
- Navigation to Login and Sign Up

**Key elements:**
- Dark mode premium design
- Animated gradient hero
- CTA buttons for quick access

---

## 2. 📝 Registration

**URL:** `/register`

New users can register with:
- Full name
- Email address
- Password (min 8 characters)
- Role: **Student**, **Faculty**, or **Admin**
- Department
- Interests / skills (optional, improves AI recommendations)

After registration, a JWT token is issued and the user is redirected to their role-specific dashboard.

---

## 3. 🔑 Login

**URL:** `/login`

Existing users log in with email and password. The JWT token is stored in `localStorage` and attached to all subsequent API requests via Axios interceptor.

---

## 4. 📊 Student Dashboard

**URL:** `/student-dashboard`

The Student Dashboard shows:
- **AI-Recommended Events**: Personalized events ranked by interest match, club affiliation, and past behavior
- **My Registrations**: Events the student has registered for, with QR pass access
- **My Clubs**: Clubs the student has joined
- **Notifications**: Event approvals, updates, cancellations

---

## 5. 📅 Events Page

**URL:** `/events`

Browse all approved campus events:
- Filter by category (Tech, Sports, Cultural, Workshop, etc.)
- Search by title or description
- Sort by date, popularity
- Each card shows: title, date, venue, category, seats available

---

## 6. 📌 Event Details

**URL:** `/events/:id`

Detailed event view includes:
- Full description and banner image
- Date, time, venue, organizer
- Remaining capacity
- Registration button (Students)
- Related events section

---

## 7. 🎫 QR Pass (After Registration)

After a student registers for an event, a **QR Pass Modal** appears with:
- Unique QR code (encoded with student ID + event ID)
- Event name, date, venue
- Student name and registration confirmation

This QR code is used by faculty for digital attendance marking.

---

## 8. 🏛️ Clubs Page

**URL:** `/clubs`

Browse all campus clubs:
- Filter by category
- See member count and coordinator
- Join or leave clubs instantly
- Club logo and description

---

## 9. 👤 Profile Page

**URL:** `/profile`

Students and faculty can update:
- Display name and profile photo
- Biography
- Department
- Skills (multi-select tags)
- Interests (multi-select tags — directly improves AI recommendations)

---

## 10. 👨‍🏫 Faculty Dashboard

**URL:** `/faculty-dashboard`

Faculty members see:
- My Events (with status: pending / approved / rejected)
- Create Event form (title, description, category, venue, date, time, capacity, banner)
- Per-event analytics: registrations, attendance rate
- Attendance management for their events
- AI-powered attendance prediction for upcoming events

---

## 11. 🛡️ Admin Dashboard

**URL:** `/admin-dashboard`

Administrators see:
- **Pending Events** queue — approve or reject with one click
- Platform statistics: total users, events, clubs, registrations
- Most active students and faculty
- Department distribution
- Monthly growth chart (new users + new events)
- Top clubs by member count

---

## 12. 🔔 Notifications

**URL:** `/notifications`

All users see system notifications:
- Event approved / rejected
- Event cancelled with reason
- New club content
- Registration confirmations

Unread notifications show a badge count. Mark-all-read available.

---

## 13. 🔍 Smart Search

**URL:** `/events?search=<query>`

The AI-powered search uses TF-IDF ranking:
- Title matches weight 3×
- Category matches weight 2×
- Description matches weight 1×
- Prefix matches score higher than substring matches

Results are sorted by relevance score descending.

---

## 14. 📈 Analytics

Faculty and Admin have access to analytics views:

**Student Insights** (`GET /api/analytics/student/insights`):
- Participation Score (%)
- Engagement Score (%)
- Activity timeline
- Most interested categories
- Top 5 upcoming recommendations

**Faculty Analytics** (`GET /api/analytics/faculty`):
- Per-event registrations and attendance
- Monthly registration trends
- Category breakdown

**Admin Analytics** (`GET /api/analytics/admin`):
- Platform-wide stats
- Top 5 departments, clubs, students, faculty
- Monthly growth chart

---

## 15. 🤖 AI Attendance Prediction

Faculty see a prediction card on each upcoming event:
- **Predicted Attendance Rate**: e.g., "78%"
- **Predicted Count**: e.g., "47 out of 60"
- **Confidence**: e.g., "75%"
- **Reasoning**: "Weekday event (+5%), high engagement category (+8%), large club organizer (+5%)"

---

## 16. 🚪 Logout

The Logout button clears the JWT token from localStorage and redirects to the landing page. The Axios 401 interceptor also triggers auto-logout if a token expires during a session.

---

## User Journey Summary

```
Visitor → Landing Page → Sign Up → Role Dashboard
                                         │
                          Student ───────┤──── View AI Recommendations
                                         │     Register for Events → QR Pass
                                         │     Join Clubs
                                         │     Update Profile (improves AI)
                                         │
                          Faculty ───────┤──── Create Events
                                         │     Mark Attendance
                                         │     View Event Analytics
                                         │     AI Attendance Prediction
                                         │
                          Admin ─────────┤──── Approve/Reject Events
                                               Manage Platform
                                               View Platform Analytics
```
