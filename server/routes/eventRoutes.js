const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, verifyStudent, verifyFaculty, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/:id/related', eventController.getRelatedEvents);

// Student registration routes
router.get('/registrations/user', auth, verifyStudent, eventController.getUserRegistrations);
router.get('/recommendations/user', auth, verifyStudent, eventController.getRecommendations);
router.post('/:id/register', auth, verifyStudent, eventController.registerForEvent);
router.delete('/registrations/:id', auth, verifyStudent, eventController.cancelRegistration);

// Faculty event organizer routes
router.post('/', auth, verifyFaculty, upload.single('banner'), eventController.createEvent);
router.put('/:id', auth, verifyFaculty, upload.single('banner'), eventController.editEvent);
router.delete('/:id', auth, verifyFaculty, eventController.deleteEvent);
router.get('/:eventId/registrations', auth, verifyFaculty, eventController.getEventRegistrations);

// Admin approval routes
router.put('/:id/approve', auth, verifyAdmin, eventController.approveEvent);
router.put('/:id/reject', auth, verifyAdmin, eventController.rejectEvent);

module.exports = router;
