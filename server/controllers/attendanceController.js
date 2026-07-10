const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Club = require('../models/Club');
const aiService = require('../services/aiService');
const Notification = require('../models/Notification');

// Mark Attendance (Faculty or Admin)
// Can be called via QR Scan (passing qrCode string) or Manual entry (passing studentId and eventId)
exports.markAttendance = async (req, res) => {
  try {
    const { qrData, studentId, eventId } = req.body;

    let targetStudentId = studentId;
    let targetEventId = eventId;
    let targetRegId = null;

    // 1. Process QR Scan
    if (qrData) {
      try {
        const parsed = JSON.parse(qrData);
        targetRegId = parsed.registrationId;
        targetEventId = parsed.eventId;
        targetStudentId = parsed.studentId;
      } catch (err) {
        // If not JSON, check if it's the raw Registration ID string
        targetRegId = qrData;
      }
    }

    // 2. Load registration to verify
    let registration = null;
    if (targetRegId) {
      registration = await Registration.findById(targetRegId);
    } else if (targetStudentId && targetEventId) {
      registration = await Registration.findOne({
        student: targetStudentId,
        event: targetEventId,
        status: 'registered'
      });
    }

    if (!registration) {
      return res.status(404).json({ message: 'No valid registration found for this student and event.' });
    }

    if (registration.status !== 'registered') {
      return res.status(400).json({ message: 'Registration has been cancelled.' });
    }

    // Use registration details
    targetStudentId = registration.student;
    targetEventId = registration.event;

    // 3. Check if event exists
    const event = await Event.findById(targetEventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Authorization check: User must be coordinator of event or Admin
    if (event.organizer !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to mark attendance for this event.' });
    }

    // 4. Check if attendance already marked
    const existingAttendance = await Attendance.findOne({
      student: targetStudentId,
      event: targetEventId
    });

    if (existingAttendance) {
      return res.status(409).json({ message: 'Attendance already marked for this student.' });
    }

    // 5. Create attendance record
    const attendance = await Attendance.create({
      student: targetStudentId,
      event: targetEventId,
      attendanceStatus: 'present',
      checkInTime: new Date().toISOString()
    });

    console.log(`[Log] Attendance Marked: Student ${targetStudentId} checked in to Event "${event.title}"`);

    // Notify Student of check-in
    await Notification.create({
      user: targetStudentId,
      title: 'Checked In',
      message: `Your attendance has been marked for the event: "${event.title}".`,
      type: 'info'
    });

    res.status(201).json({
      message: 'Attendance marked successfully.',
      attendance
    });
  } catch (err) {
    console.error('Mark Attendance Error:', err);
    res.status(500).json({ message: 'Internal Server Error marking attendance.' });
  }
};

// Get Event Attendance Report (Faculty or Admin)
exports.getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Auth check
    if (event.organizer !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }

    const registrations = await Registration.find({ event: eventId, status: 'registered' }).populate('student');
    const attendanceRecords = await Attendance.find({ event: eventId }).populate('student');
    const clubs = await Club.find({});

    const presentStudentIds = attendanceRecords.map(a => a.student._id || a.student);

    // List of student objects with status
    const report = registrations.map(reg => {
      const isPresent = presentStudentIds.includes(reg.student._id || reg.student);
      const checkInRecord = attendanceRecords.find(a => (a.student._id || a.student) === (reg.student._id || reg.student));

      return {
        student: reg.student,
        status: isPresent ? 'present' : 'absent',
        checkInTime: checkInRecord ? checkInRecord.checkInTime : null
      };
    });

    // Run AI attendance prediction
    const aiPrediction = aiService.predictAttendance(event, registrations, clubs);

    res.status(200).json({
      event,
      totalRegistered: registrations.length,
      presentCount: attendanceRecords.length,
      absentCount: registrations.length - attendanceRecords.length,
      attendanceList: report,
      aiPrediction
    });
  } catch (err) {
    console.error('Get Event Attendance Report Error:', err);
    res.status(500).json({ message: 'Internal Server Error generating report.' });
  }
};

// Get Student Attendance History (Student only)
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attendanceRecords = await Attendance.find({ student: studentId }).populate('event');
    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error('Get Student Attendance Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching attendance history.' });
  }
};
