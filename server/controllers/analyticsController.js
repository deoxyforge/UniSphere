const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Club = require('../models/Club');
const aiService = require('../services/aiService');

exports.getStudentInsights = async (req, res) => {
  try {
    const studentId = req.user._id;
    const [student, registrations, attendanceRecords, clubs, events] = await Promise.all([
      User.findById(studentId),
      Registration.find({ student: studentId }).populate('event'),
      Attendance.find({ student: studentId }).populate('event'),
      Club.find(),
      Event.find({ status: 'approved' })
    ]);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    const approvedEvents = events.length || 1;
    const participationScore = Math.min(Math.round((registrations.length / approvedEvents) * 100), 100);
    const attended = attendanceRecords.filter(a => a.attended).length;
    const engagementScore = Math.min(Math.round((attended / (registrations.length || 1)) * 100), 100);
    const categoryCount = {};
    registrations.forEach(r => { if (r.event && r.event.category) categoryCount[r.event.category] = (categoryCount[r.event.category] || 0) + 1; });
    const mostInterestedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category, count]) => ({ category, count }));
    const joinedClubs = clubs.filter(c => c.members && c.members.includes(studentId));
    const mostActiveClub = joinedClubs.length > 0 ? joinedClubs.sort((a, b) => (b.members ? b.members.length : 0) - (a.members ? a.members.length : 0))[0].name : null;
    const activityTimeline = registrations.filter(r => r.event).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10).map(r => ({ eventId: r.event._id, title: r.event.title, category: r.event.category, date: r.event.date, status: r.status }));
    const allRegs = await Registration.find({});
    const recommendations = aiService.recommendEvents(student, events, allRegs, clubs).slice(0, 5).map(e => ({ _id: e._id, title: e.title, category: e.category, date: e.date, aiReason: e.aiReason, aiScore: e.aiScore }));
    res.json({ participationScore, engagementScore, totalRegistrations: registrations.length, totalAttended: attended, mostInterestedCategories, mostActiveClub, activityTimeline, upcomingRecommendations: recommendations });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Failed to load student insights.' }); }
};

exports.predictEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const [event, registrations, clubs, attendanceHistory] = await Promise.all([Event.findById(eventId), Registration.find({ event: eventId }), Club.find(), Attendance.find({ event: eventId })]);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    const prediction = aiService.predictAttendance(event, registrations, clubs);
    const historicalAttended = attendanceHistory.filter(a => a.attended).length;
    const historicalTotal = attendanceHistory.length;
    const actualRate = historicalTotal > 0 ? Math.round((historicalAttended / historicalTotal) * 100) : null;
    const dataPoints = registrations.length + historicalTotal;
    const confidence = dataPoints >= 20 ? 90 : dataPoints >= 10 ? 75 : dataPoints >= 5 ? 60 : 40;
    res.json({ eventId, eventTitle: event.title, registeredCount: registrations.length, ...prediction, confidence, actualRate, reasoning: prediction.analysis });
  } catch (err) { res.status(500).json({ message: 'Failed to predict attendance.' }); }
};

exports.smartSearch = async (req, res) => {
  try {
    const q = req.query.q || '';
    const type = req.query.type || 'all';
    if (!q.trim()) return res.json({ events: [], clubs: [], query: q });
    const query = q.toLowerCase().trim();
    const terms = query.split(' ').filter(Boolean);
    const scoreText = (text) => { if (!text) return 0; const t = text.toLowerCase(); let s = 0; terms.forEach(term => { if (t.startsWith(term)) s += 10; else if (t.includes(term)) s += 5; }); return s; };
    let events = [], clubs = [];
    if (type === 'all' || type === 'events') {
      const eventsRaw = await Event.find({ status: 'approved' }).populate('organizer', 'name department');
      events = eventsRaw.map(e => { const score = scoreText(e.title) * 3 + scoreText(e.description) + scoreText(e.category) * 2 + scoreText(e.venue) + scoreText(e.organizer ? e.organizer.name : ''); return Object.assign(e.toObject(), { searchScore: score }); }).filter(e => e.searchScore > 0).sort((a, b) => b.searchScore - a.searchScore).slice(0, 10);
    }
    if (type === 'all' || type === 'clubs') {
      const clubsRaw = await Club.find().populate('coordinator', 'name');
      clubs = clubsRaw.map(c => { const score = scoreText(c.name) * 3 + scoreText(c.description) + scoreText(c.category) * 2 + scoreText(c.coordinator ? c.coordinator.name : ''); return Object.assign(c.toObject(), { searchScore: score }); }).filter(c => c.searchScore > 0).sort((a, b) => b.searchScore - a.searchScore).slice(0, 5);
    }
    res.json({ events, clubs, query: q });
  } catch (err) { res.status(500).json({ message: 'Search failed.' }); }
};

exports.getFacultyAnalytics = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const events = await Event.find({ organizer: facultyId }).sort({ date: -1 });
    const eventIds = events.map(e => e._id);
    const regsQuery = { event: {} };
    regsQuery.event[''] = eventIds;
    const attQuery = { event: {} };
    attQuery.event[''] = eventIds;
    const [registrations, attendanceRecords] = await Promise.all([Registration.find(regsQuery), Attendance.find(attQuery)]);
    const eventPerformance = events.map(e => { const regs = registrations.filter(r => r.event.toString() === e._id.toString()); const att = attendanceRecords.filter(a => a.event.toString() === e._id.toString()); const attended = att.filter(a => a.attended).length; return { eventId: e._id, title: e.title, date: e.date, category: e.category, status: e.status, registrations: regs.length, attended, attendanceRate: regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0 }; });
    const now = new Date();
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) { const month = new Date(now.getFullYear(), now.getMonth() - i, 1); const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); const count = registrations.filter(r => { const d = new Date(r.createdAt); return d >= month && d <= monthEnd; }).length; monthlyGrowth.push({ month: month.toLocaleDateString('en', { month: 'short', year: '2-digit' }), count }); }
    const catBreakdown = {};
    events.forEach(e => { catBreakdown[e.category] = (catBreakdown[e.category] || 0) + 1; });
    const mostPopular = eventPerformance.slice().sort((a, b) => b.registrations - a.registrations).slice(0, 3);
    res.json({ totalEvents: events.length, totalRegistrations: registrations.length, totalAttended: attendanceRecords.filter(a => a.attended).length, eventPerformance, monthlyGrowth, categoryBreakdown: Object.entries(catBreakdown).map(([k, v]) => ({ category: k, count: v })), mostPopularEvents: mostPopular });
  } catch (err) { res.status(500).json({ message: 'Failed to load faculty analytics.' }); }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const [users, events, registrations, clubs, attendanceRecords] = await Promise.all([User.find(), Event.find(), Registration.find(), Club.find(), Attendance.find()]);
    const students = users.filter(u => u.role === 'Student');
    const faculty = users.filter(u => u.role === 'Faculty');
    const deptCount = {};
    students.forEach(s => { if (s.department) deptCount[s.department] = (deptCount[s.department] || 0) + 1; });
    const topDepartments = Object.entries(deptCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([department, count]) => ({ department, count }));
    const topClubs = clubs.slice().sort((a, b) => (b.members ? b.members.length : 0) - (a.members ? a.members.length : 0)).slice(0, 5).map(c => ({ _id: c._id, name: c.name, members: c.members ? c.members.length : 0 }));
    const studentRegCount = {};
    registrations.forEach(r => { const sid = r.student ? r.student.toString() : null; if (sid) studentRegCount[sid] = (studentRegCount[sid] || 0) + 1; });
    const topStudentIds = Object.entries(studentRegCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    const mostActiveStudents = students.filter(s => topStudentIds.includes(s._id.toString())).map(s => ({ _id: s._id, name: s.name, department: s.department, registrations: studentRegCount[s._id.toString()] || 0 })).sort((a, b) => b.registrations - a.registrations);
    const facultyEventCount = {};
    events.forEach(e => { const fid = e.organizer ? e.organizer.toString() : null; if (fid) facultyEventCount[fid] = (facultyEventCount[fid] || 0) + 1; });
    const topFacultyIds = Object.entries(facultyEventCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    const mostActiveFaculty = faculty.filter(f => topFacultyIds.includes(f._id.toString())).map(f => ({ _id: f._id, name: f.name, department: f.department, events: facultyEventCount[f._id.toString()] || 0 })).sort((a, b) => b.events - a.events);
    const catCount = {};
    events.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1; });
    const popularCategories = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([category, count]) => ({ category, count }));
    const now = new Date();
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) { const month = new Date(now.getFullYear(), now.getMonth() - i, 1); const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); const newUsers = users.filter(u => { const d = new Date(u.createdAt); return d >= month && d <= monthEnd; }).length; const newEvents = events.filter(e => { const d = new Date(e.createdAt); return d >= month && d <= monthEnd; }).length; monthlyGrowth.push({ month: month.toLocaleDateString('en', { month: 'short', year: '2-digit' }), newUsers, newEvents }); }
    res.json({ platform: { totalStudents: students.length, totalFaculty: faculty.length, totalEvents: events.length, approvedEvents: events.filter(e => e.status === 'approved').length, pendingEvents: events.filter(e => e.status === 'pending').length, totalClubs: clubs.length, totalRegistrations: registrations.length, totalAttended: attendanceRecords.filter(a => a.attended).length }, topDepartments, topClubs, mostActiveStudents, mostActiveFaculty, popularCategories, monthlyGrowth });
  } catch (err) { res.status(500).json({ message: 'Failed to load admin analytics.' }); }
};
