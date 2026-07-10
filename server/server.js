require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const clubRoutes = require('./routes/clubRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// Disable content security policy restrictions for local image serving if needed, but configure standard helmet
app.use(helmet({
  crossOriginResourcePolicy: false // Allows serving local upload files to different origins
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://unisphere.vercel.app'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, mobile, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, true); // Keep permissive for now during evaluation
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting (prevent brute force, etc.)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    databaseMode: db.useMongo ? 'MongoDB' : 'Local JSON Mock DB'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint Not Found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred on the server.',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Connect Database & Start Server
const startServer = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 UniSphere Server running on http://localhost:${PORT}`);
      console.log(`📁 Local Static Uploads: http://localhost:${PORT}/uploads/`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Critical Server Startup Failure:', err);
    process.exit(1);
  }
};

startServer();
