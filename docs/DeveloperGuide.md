# Developer Guide

## Prerequisites

- Node.js v18+
- npm v9+
- Git
- MongoDB Atlas account (or local MongoDB 6+)

## First-time Setup

1. Clone: git clone https://github.com/deoxyforge/UniSphere.git
2. Server: cd server && npm install
3. Client: cd ../client && npm install
4. Create server/.env (see Environment Variables in README)

## Development Commands

### Server
npm run dev   # nodemon hot-reload on port 5000
npm test      # Jest unit tests

### Client
npm run dev   # Vite HMR on port 5173
npm run build # Production build to dist/

## Adding a New API Endpoint

1. Create/update controller in server/controllers/
2. Add route in server/routes/
3. Mount route in server/server.js
4. Add API call in client/src/services/api.js
5. Use in component with useState/useEffect

## Folder Conventions

- Pages: one file per route in src/pages/
- Components: reusable UI in src/components/
- All API calls: go through src/services/api.js
- Auth middleware: always use auth.js (not inline JWT logic)

## Environment Variables

See docs/DeploymentGuide.md for the full list.
Never commit .env files — they're gitignored.

## Known Gotchas

- Mongoose _id is a String (not ObjectId) — compare with .toString() on both sides
- File uploads are ephemeral on Render free tier
- lucide-react version in use does not export 'Github' — use 'Globe' instead
- Vite builds output a single large JS chunk — acceptable for MVP scale

