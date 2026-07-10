require('dotenv').config();
const db = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Club = require('../models/Club');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('Seeding database...');
    await db.connect();

    // 1. Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Club.deleteMany({});
    await Registration.deleteMany({});
    await Attendance.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing database collections.');

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 3. Create Users
    const student1 = await User.create({
      _id: 'stud00001',
      name: 'Alex Rivera',
      email: 'student@unisphere.edu',
      password: hashedPassword,
      role: 'Student',
      department: 'Computer Science',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
      interests: ['Coding', 'Workshop', 'Tech'],
      joinedClubs: ['club00001']
    });

    const student2 = await User.create({
      _id: 'stud00002',
      name: 'Sarah Chen',
      email: 'student2@unisphere.edu',
      password: hashedPassword,
      role: 'Student',
      department: 'Electrical Engineering',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
      interests: ['Seminar', 'Arts', 'Music'],
      joinedClubs: []
    });

    const faculty = await User.create({
      _id: 'facu00001',
      name: 'Dr. Evelyn Martinez',
      email: 'faculty@unisphere.edu',
      password: hashedPassword,
      role: 'Faculty',
      department: 'Engineering Coordinator',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Evelyn',
      interests: [],
      joinedClubs: []
    });

    const admin = await User.create({
      _id: 'admi00001',
      name: 'System Admin',
      email: 'admin@unisphere.edu',
      password: hashedPassword,
      role: 'Admin',
      department: 'Campus Administration',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
      interests: [],
      joinedClubs: []
    });

    console.log('Created Users (Student, Faculty, Admin).');

    // 4. Create Clubs
    const club1 = await Club.create({
      _id: 'club00001',
      name: 'ByteCraft Code Club',
      description: 'The official campus hub for programmers and tech enthusiasts. We organize hackathons, coding workshops, and development meetups.',
      logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
      coordinator: 'facu00001',
      members: ['stud00001'],
      category: 'Tech'
    });

    const club2 = await Club.create({
      _id: 'club00002',
      name: 'Acoustic Waves Music Club',
      description: 'A club for campus singers, instrumentalists, and music lovers. Weekly jam sessions and concert planning.',
      logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      coordinator: 'facu00001',
      members: [],
      category: 'Music'
    });

    console.log('Created Clubs.');

    // 5. Create Events
    const event1 = await Event.create({
      _id: 'even00001',
      title: 'UniSphere HackFest 2026',
      description: 'A 24-hour campus hackathon where students build creative software products. Great prizes, food, and networking opportunities. Open to all departments!',
      category: 'Coding',
      venue: 'Main Library Seminar Hall',
      date: '2026-07-25', // Future
      time: '09:00',
      banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      capacity: 50,
      registeredStudents: [],
      organizer: 'facu00001',
      status: 'approved'
    });

    const event2 = await Event.create({
      _id: 'even00002',
      title: 'UI/UX Interactive Workshop',
      description: 'Learn modern UI design and wireframing practices. Build responsive layouts, establish design hierarchies, and master Figma.',
      category: 'Workshop',
      venue: 'IT Block Lab 3',
      date: '2026-07-30', // Future
      time: '14:00',
      banner: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800',
      capacity: 3, // Small capacity to test limit triggers
      registeredStudents: ['stud00001'],
      organizer: 'facu00001',
      status: 'approved'
    });

    const event3 = await Event.create({
      _id: 'even00003',
      title: 'Acoustic Night & Open Mic',
      description: 'A relaxing evening of acoustic music, poetry, and storytelling. Perform your favorite songs or listen to campus talents.',
      category: 'Music',
      venue: 'Open Air Amphitheatre',
      date: '2026-08-05', // Future
      time: '18:30',
      banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      capacity: 150,
      registeredStudents: [],
      organizer: 'facu00001',
      status: 'pending' // Pending approval for Admin testing
    });

    const event4 = await Event.create({
      _id: 'even00004',
      title: 'Intro to AI & Machine Learning Seminar',
      description: 'An introductory lecture discussing artificial intelligence, neural networks, and applications. Hosted by the CS department.',
      category: 'Seminar',
      venue: 'Main Auditorium',
      date: '2026-06-15', // Past
      time: '10:00',
      banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      capacity: 80,
      registeredStudents: ['stud00001'],
      organizer: 'facu00001',
      status: 'approved'
    });

    console.log('Created Events.');

    // 6. Create registrations for seed students
    await Registration.create({
      _id: 'reg00001',
      student: 'stud00001',
      event: 'even00002', // UI/UX Workshop
      registrationDate: '2026-07-01',
      qrCode: JSON.stringify({ registrationId: 'reg00001', eventId: 'even00002', studentId: 'stud00001' }),
      status: 'registered'
    });

    await Registration.create({
      _id: 'reg00002',
      student: 'stud00001',
      event: 'even00004', // Intro to AI Seminar (Past)
      registrationDate: '2026-06-10',
      qrCode: JSON.stringify({ registrationId: 'reg00002', eventId: 'even00004', studentId: 'stud00001' }),
      status: 'registered'
    });

    console.log('Created Event Registrations.');

    // 7. Create attendance history
    await Attendance.create({
      _id: 'att00001',
      student: 'stud00001',
      event: 'even00004',
      attendanceStatus: 'present',
      checkInTime: '2026-06-15T10:05:00Z'
    });

    console.log('Created Attendance Records.');

    // 8. Create some initial notifications
    await Notification.create({
      _id: 'not00001',
      user: 'stud00001',
      title: 'Welcome to UniSphere!',
      message: 'Explore campus events, join student clubs, and view recommendations.',
      type: 'info',
      isRead: false
    });

    await Notification.create({
      _id: 'not00002',
      user: 'stud00001',
      title: 'Registration Approved',
      message: 'You have registered for the UI/UX Interactive Workshop on July 30th.',
      type: 'success',
      isRead: false
    });

    console.log('Created Notifications.');
    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
};

seed();
