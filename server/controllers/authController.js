const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'unisphere_secure_jwt_token_secret_key_2026',
    { expiresIn: '30d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, interests, skills, biography } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Student',
      department: department || '',
      profileImage: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      biography: biography || '',
      skills: skills || [],
      interests: interests || [],
      joinedClubs: []
    });

    const token = signToken(newUser);

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal Server Error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(user);
    
    const userResponse = user.toObject();
    delete userResponse.password;

    // Log user login
    console.log(`[Log] User logged in: ${user.email} (${user.role})`);

    res.status(200).json({
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal Server Error during login.' });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, department, interests, skills, biography } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (department !== undefined) updates.department = department;
    
    if (interests) {
      updates.interests = Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (skills) {
      updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (biography !== undefined) updates.biography = biography;

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Internal Server Error updating profile.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const safeUsers = users.map(u => {
      const copy = u.toObject();
      delete copy.password;
      return copy;
    });
    res.status(200).json(safeUsers);
  } catch (err) {
    console.error('Get Users Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching users.' });
  }
};
