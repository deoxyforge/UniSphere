const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Club = require('../models/Club');
const Notification = require('../models/Notification');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

// Create Event (Faculty or Admin)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, venue, date, time, capacity } = req.body;

    if (!title || !description || !category || !venue || !date || !time || !capacity) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const eventCapacity = parseInt(capacity);
    if (isNaN(eventCapacity) || eventCapacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than 0.' });
    }

    // Validate future date
    const eventDate = new Date(`${date}T${time}`);
    const today = new Date();
    if (eventDate < today) {
      return res.status(400).json({ message: 'Event date must be in the future.' });
    }

    let bannerUrl = '';
    if (req.file) {
      // Local uploaded image URL
      bannerUrl = `/uploads/${req.file.filename}`;
    } else {
      // Default placeholder banner using categories
      bannerUrl = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800`;
    }

    // Admins bypass pending state
    const status = req.user.role === 'Admin' ? 'approved' : 'pending';

    const newEvent = await Event.create({
      title,
      description,
      category,
      venue,
      date,
      time,
      banner: bannerUrl,
      capacity: eventCapacity,
      registeredStudents: [],
      organizer: req.user._id,
      status
    });

    console.log(`[Log] Event Created: "${title}" by organizer ${req.user.email} (Status: ${status})`);

    // Notify Admins if pending
    if (status === 'pending') {
      const admins = await User.find({ role: 'Admin' });
      for (const admin of admins) {
        await Notification.create({
          user: admin._id,
          title: 'New Event Approval Request',
          message: `Faculty member created event "${title}" which requires approval.`,
          type: 'info'
        });
      }
    }

    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ message: 'Internal Server Error creating event.' });
  }
};

// Edit Event (Organizer Faculty or Admin)
exports.editEvent = async (req, res) => {
  try {
    const { title, description, category, venue, date, time, capacity } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Authorization: Must be organizer or Admin
    if (event.organizer !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to edit this event.' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (venue) updates.venue = venue;
    
    if (date || time) {
      const newDate = date || event.date;
      const newTime = time || event.time;
      const eventDate = new Date(`${newDate}T${newTime}`);
      const today = new Date();
      if (eventDate < today) {
        return res.status(400).json({ message: 'Event date must be in the future.' });
      }
      if (date) updates.date = date;
      if (time) updates.time = time;
    }

    if (capacity) {
      const eventCapacity = parseInt(capacity);
      if (isNaN(eventCapacity) || eventCapacity <= 0) {
        return res.status(400).json({ message: 'Capacity must be greater than 0.' });
      }
      const registrationsCount = event.registeredStudents ? event.registeredStudents.length : 0;
      if (eventCapacity < registrationsCount) {
        return res.status(400).json({ message: `Capacity cannot be less than current registration count (${registrationsCount}).` });
      }
      updates.capacity = eventCapacity;
    }

    if (req.file) {
      updates.banner = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Edit Event Error:', err);
    res.status(500).json({ message: 'Internal Server Error editing event.' });
  }
};

// Delete Event (Organizer Faculty or Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.organizer !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to delete this event.' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Notify registered students
    const registrants = await Registration.find({ event: req.params.id, status: 'registered' });
    for (const reg of registrants) {
      await Notification.create({
        user: reg.student,
        title: 'Event Cancelled',
        message: `The event "${event.title}" has been cancelled.`,
        type: 'warning'
      });
      // Optionally notify via email
      const student = await User.findById(reg.student);
      if (student) {
        await emailService.sendEmail({
          to: student.email,
          subject: `Event Cancelled: ${event.title}`,
          text: `Hi ${student.name},\n\nWe regret to inform you that the event "${event.title}" scheduled on ${event.date} has been cancelled.\n\nBest,\nUniSphere Team`
        });
      }
    }

    // Set registration status to cancelled
    await Registration.updateMany({ event: req.params.id }, { status: 'cancelled' });

    res.status(200).json({ message: 'Event deleted and attendees notified.' });
  } catch (err) {
    console.error('Delete Event Error:', err);
    res.status(500).json({ message: 'Internal Server Error deleting event.' });
  }
};

// Get All Events (Filtered)
exports.getAllEvents = async (req, res) => {
  try {
    const { search, category, clubId, status, dateScope } = req.query;
    const query = {};

    // Standard filter for approved events, except for admin/coordinators reviewing items
    if (status) {
      query.status = status;
    } else {
      query.status = 'approved';
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // If clubId is supplied, filter events organized by that club's coordinator
    if (clubId) {
      const club = await Club.findById(clubId);
      if (club) {
        query.organizer = club.coordinator;
      }
    }

    let events = await Event.find(query).populate('organizer');

    // Date scope filter (upcoming vs past)
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateScope === 'upcoming') {
      events = events.filter(e => e.date >= todayStr);
    } else if (dateScope === 'past') {
      events = events.filter(e => e.date < todayStr);
    }

    res.status(200).json(events);
  } catch (err) {
    console.error('Get All Events Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching events.' });
  }
};

// Get Event By ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer');
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error('Get Event By ID Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching event.' });
  }
};

// Register for Event (Student only)
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot register for an unapproved event.' });
    }

    // Check capacity
    const currentRegistrants = event.registeredStudents ? event.registeredStudents.length : 0;
    if (currentRegistrants >= event.capacity) {
      return res.status(400).json({ message: 'Event has reached maximum capacity.' });
    }

    // Check existing registration
    const existingRegistration = await Registration.findOne({
      student: studentId,
      event: eventId,
      status: 'registered'
    });

    if (existingRegistration) {
      return res.status(409).json({ message: 'You are already registered for this event.' });
    }

    // Generate QR code data (simply a JSON structure containing IDs, signed later or verified by ID match)
    const registrationId = Math.random().toString(36).substr(2, 9);
    const qrData = JSON.stringify({
      registrationId,
      eventId,
      studentId
    });

    // Save registration
    const newReg = await Registration.create({
      _id: registrationId,
      student: studentId,
      event: eventId,
      registrationDate: new Date().toISOString().split('T')[0],
      qrCode: qrData,
      status: 'registered'
    });

    // Add student to event registered list
    await Event.findByIdAndUpdate(eventId, {
      $push: { registeredStudents: studentId }
    });

    // Log registration
    console.log(`[Log] Student ${req.user.email} registered for Event "${event.title}"`);

    // In-app notification
    await Notification.create({
      user: studentId,
      title: 'Event Registration Confirmed!',
      message: `You have registered successfully for "${event.title}". Download your QR pass.`,
      type: 'success'
    });

    // Send email confirmation
    const student = await User.findById(studentId);
    if (student) {
      await emailService.sendEmail({
        to: student.email,
        subject: `Registration Confirmed: ${event.title}`,
        text: `Hi ${student.name},\n\nYour registration for the event "${event.title}" has been successfully completed.\n\nDate: ${event.date}\nTime: ${event.time}\nVenue: ${event.venue}\n\nYour QR pass code is: ${registrationId}\n\nShow this QR pass at the entrance to mark your attendance.\n\nBest regards,\nUniSphere Campus Hub`
      });
    }

    res.status(201).json(newReg);
  } catch (err) {
    console.error('Register For Event Error:', err);
    res.status(500).json({ message: 'Internal Server Error registering for event.' });
  }
};

// Cancel Registration (Student only)
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    if (registration.student !== req.user._id) {
      return res.status(403).json({ message: 'Forbidden: You cannot cancel another student\'s registration.' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ message: 'Registration is already cancelled.' });
    }

    // Mark registration as cancelled
    await Registration.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    // Remove student from event registered list
    await Event.findByIdAndUpdate(registration.event, {
      $pull: { registeredStudents: req.user._id }
    });

    const event = await Event.findById(registration.event);
    
    // Notify in-app
    await Notification.create({
      user: req.user._id,
      title: 'Registration Cancelled',
      message: `Your registration for "${event ? event.title : 'Event'}" has been cancelled.`,
      type: 'warning'
    });

    res.status(200).json({ message: 'Registration successfully cancelled.' });
  } catch (err) {
    console.error('Cancel Registration Error:', err);
    res.status(500).json({ message: 'Internal Server Error cancelling registration.' });
  }
};

// Get User's Registrations (Student)
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user._id,
      status: 'registered'
    }).populate('event');
    res.status(200).json(registrations);
  } catch (err) {
    console.error('Get User Registrations Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching registrations.' });
  }
};

// Get Event Registrations (Faculty/Admin)
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.organizer !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: 'registered'
    }).populate('student');

    res.status(200).json(registrations);
  } catch (err) {
    console.error('Get Event Registrations Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching registrations.' });
  }
};

// AI Recommendations (Student)
exports.getRecommendations = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const events = await Event.find({ status: 'approved' }).populate('organizer');
    const registrations = await Registration.find({ student: student._id });
    const clubs = await Club.find({});

    const recommended = aiService.recommendEvents(student, events, registrations, clubs);
    
    // Return top 6 recommendations
    res.status(200).json(recommended.slice(0, 6));
  } catch (err) {
    console.error('Get Recommendations Error:', err);
    res.status(500).json({ message: 'Internal Server Error calculating recommendations.' });
  }
};

// Related Events
exports.getRelatedEvents = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const query = {
      _id: { $ne: event._id },
      status: 'approved',
      $or: [
        { category: event.category },
        { organizer: event.organizer }
      ]
    };

    const related = await Event.find(query).populate('organizer').limit(3);
    res.status(200).json(related);
  } catch (err) {
    console.error('Get Related Events Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching related events.' });
  }
};

// Approve Event (Admin only)
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

    // Notify organizer
    await Notification.create({
      user: event.organizer,
      title: 'Event Approved!',
      message: `Your event "${event.title}" has been approved and is now live.`,
      type: 'success'
    });

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Approve Event Error:', err);
    res.status(500).json({ message: 'Internal Server Error approving event.' });
  }
};

// Reject Event (Admin only)
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

    // Notify organizer
    await Notification.create({
      user: event.organizer,
      title: 'Event Rejected',
      message: `Your event "${event.title}" has been rejected by the administrator.`,
      type: 'warning'
    });

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Reject Event Error:', err);
    res.status(500).json({ message: 'Internal Server Error rejecting event.' });
  }
};
