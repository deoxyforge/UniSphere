const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, upload.single('profileImage'), authController.updateProfile);
router.get('/users', auth, verifyAdmin, authController.getUsers);

module.exports = router;
