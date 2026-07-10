const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { auth, verifyStudent, verifyFaculty, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', clubController.getAllClubs);
router.get('/:id', clubController.getClubById);

// Student club memberships
router.post('/join', auth, verifyStudent, clubController.joinClub);
router.post('/leave', auth, verifyStudent, clubController.leaveClub);

// Club administrative controls
router.post('/', auth, verifyAdmin, upload.single('logo'), clubController.createClub);
router.put('/:id', auth, verifyFaculty, upload.single('logo'), clubController.editClub);
router.delete('/:id', auth, verifyAdmin, clubController.deleteClub);

module.exports = router;
