const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth, verifyStudent, verifyStaffOrAdmin } = require('../middleware/auth');

router.post('/', auth, verifyStaffOrAdmin, attendanceController.markAttendance);
router.get('/event/:eventId', auth, verifyStaffOrAdmin, attendanceController.getEventAttendance);
router.get('/student', auth, verifyStudent, attendanceController.getStudentAttendance);

module.exports = router;
