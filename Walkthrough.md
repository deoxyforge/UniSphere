# UniSphere Project Walkthrough & Verification

This document walks through the verified production features, implementation details, and screenshots of UniSphere.

## 🎥 Core Workflows Verified

### 1. Landing Page
- Modern dark mode welcome page displaying hero content and clear calls-to-action to log in or register.
- Clean header navigation showing links for Events, Clubs, and Auth options.

### 2. User Authentication (JWT)
- Safe user signup/login under student, faculty, and admin roles.
- Authorization token saved in localStorage and sent on every API header.
- Unauthorized responses (401) trigger redirect to login with user notification.

### 3. Student Dashboard & AI Feed
- Displays registered events, upcoming recommendations, and joined clubs.
- "Interests & Skills" can be updated in Profile to dynamically update the recommendation scores on the feed.

### 4. Event CRUD & Registration
- Faculty can create new events with local image banners. Events start as 'pending'.
- Admin approves the events. Status transitions to 'approved'.
- Students can browse approved events, select a card, and click Register.
- QR Pass modal displays instantly with ticket details.

### 5. Attendance & Insights
- Faculty can mark student attendance on their event management panel.
- Predictions showing attendance rate (%) and confidence score (%) are rendered for event coordinators using local algorithms.
- Platform stats are calculated dynamically for the Admin dashboard.

## 📷 Screenshots
All screenshots of pages are located under the artifacts directory:
- [Landing page](LandingPage.png)
- [Login page](Login.png)
- [Student Dashboard](StudentDashboard.png)
- [Event details page](EventDetails.png)
- [Joined club details](ClubDetails.png)
