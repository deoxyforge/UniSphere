const Club = require('../models/Club');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create Club (Admin only)
exports.createClub = async (req, res) => {
  try {
    const { name, description, coordinator, category } = req.body;

    if (!name || !description || !coordinator || !category) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Verify coordinator is actually a Faculty member
    const coordUser = await User.findById(coordinator);
    if (!coordUser || coordUser.role !== 'Faculty') {
      return res.status(400).json({ message: 'Assigned coordinator must be a faculty member.' });
    }

    let logoUrl = '';
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    } else {
      logoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    }

    const newClub = await Club.create({
      name,
      description,
      logo: logoUrl,
      coordinator,
      members: [],
      category
    });

    console.log(`[Log] Club Created: "${name}" coordinated by ${coordUser.email}`);

    // Notify the coordinator faculty
    await Notification.create({
      user: coordinator,
      title: 'Assigned as Club Coordinator',
      message: `You have been assigned as the coordinator for the new club: "${name}".`,
      type: 'info'
    });

    res.status(201).json(newClub);
  } catch (err) {
    console.error('Create Club Error:', err);
    res.status(500).json({ message: 'Internal Server Error creating club.' });
  }
};

// Edit Club (Coordinator or Admin)
exports.editClub = async (req, res) => {
  try {
    const { name, description, coordinator, category } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    // Authorization: Coordinator or Admin
    if (club.coordinator !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (category) updates.category = category;

    if (coordinator && req.user.role === 'Admin') {
      const coordUser = await User.findById(coordinator);
      if (!coordUser || coordUser.role !== 'Faculty') {
        return res.status(400).json({ message: 'Coordinator must be a faculty member.' });
      }
      updates.coordinator = coordinator;
    }

    if (req.file) {
      updates.logo = `/uploads/${req.file.filename}`;
    }

    const updatedClub = await Club.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(updatedClub);
  } catch (err) {
    console.error('Edit Club Error:', err);
    res.status(500).json({ message: 'Internal Server Error editing club.' });
  }
};

// Delete Club (Admin only)
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    await Club.findByIdAndDelete(req.params.id);

    // Notify coordinator
    await Notification.create({
      user: club.coordinator,
      title: 'Club Disbanded',
      message: `The club "${club.name}" has been disbanded by the system administrator.`,
      type: 'warning'
    });

    res.status(200).json({ message: 'Club disbanded successfully.' });
  } catch (err) {
    console.error('Delete Club Error:', err);
    res.status(500).json({ message: 'Internal Server Error deleting club.' });
  }
};

// Get All Clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({}).populate('coordinator');
    res.status(200).json(clubs);
  } catch (err) {
    console.error('Get All Clubs Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching clubs.' });
  }
};

// Get Club By ID
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('coordinator')
      .populate('members');
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }
    res.status(200).json(club);
  } catch (err) {
    console.error('Get Club By ID Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching club.' });
  }
};

// Join Club (Student only)
exports.joinClub = async (req, res) => {
  try {
    const { clubId } = req.body;
    const studentId = req.user._id;

    if (!clubId) {
      return res.status(400).json({ message: 'Club ID is required.' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    // Check if student already a member
    if (club.members && club.members.includes(studentId)) {
      return res.status(400).json({ message: 'You are already a member of this club.' });
    }

    // Add student to club members
    await Club.findByIdAndUpdate(clubId, {
      $push: { members: studentId }
    });

    // Add club to student's joined clubs
    await User.findByIdAndUpdate(studentId, {
      $push: { joinedClubs: clubId }
    });

    console.log(`[Log] Student ${req.user.email} joined Club "${club.name}"`);

    // Notify coordinator
    await Notification.create({
      user: club.coordinator,
      title: 'New Club Member',
      message: `A new student has joined your club: "${club.name}".`,
      type: 'info'
    });

    res.status(200).json({ message: 'Successfully joined club.' });
  } catch (err) {
    console.error('Join Club Error:', err);
    res.status(500).json({ message: 'Internal Server Error joining club.' });
  }
};

// Leave Club (Student only)
exports.leaveClub = async (req, res) => {
  try {
    const { clubId } = req.body;
    const studentId = req.user._id;

    if (!clubId) {
      return res.status(400).json({ message: 'Club ID is required.' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    // Check if student is a member
    if (club.members && !club.members.includes(studentId)) {
      return res.status(400).json({ message: 'You are not a member of this club.' });
    }

    // Pull student from club
    await Club.findByIdAndUpdate(clubId, {
      $pull: { members: studentId }
    });

    // Pull club from student
    await User.findByIdAndUpdate(studentId, {
      $pull: { joinedClubs: clubId }
    });

    res.status(200).json({ message: 'Successfully left club.' });
  } catch (err) {
    console.error('Leave Club Error:', err);
    res.status(500).json({ message: 'Internal Server Error leaving club.' });
  }
};
