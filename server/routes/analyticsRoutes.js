const express = require('express');
const router = express.Router();
const { auth, verifyStudent, verifyFaculty, verifyAdmin } = require('../middleware/auth');
const {
  getStudentInsights,
  predictEventAttendance,
  smartSearch,
  getFacultyAnalytics,
  getAdminAnalytics
} = require('../controllers/analyticsController');

router.get('/search', smartSearch);
router.get('/student/insights', auth, verifyStudent, getStudentInsights);
router.get('/events/:eventId/predict', auth, predictEventAttendance);
router.get('/faculty', auth, verifyFaculty, getFacultyAnalytics);
router.get('/admin', auth, verifyAdmin, getAdminAnalytics);

module.exports = router;
