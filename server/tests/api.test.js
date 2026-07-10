// Integration test for UniSphere REST API endpoints
process.env.PORT = 5001; // Run tests on port 5001
process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');

// Start the server
console.log('Starting test server on port 5001...');
require('../server');

const BASE_URL = 'http://localhost:5001/api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runTests = async () => {
  try {
    // Wait for database connection and server startup
    await sleep(3000);
    console.log('\n--- Starting API Integration Tests ---');

    let studentToken = '';
    let facultyToken = '';
    let adminToken = '';
    let testEventId = '';
    let testRegistrationId = '';

    // 1. Test Login (Student)
    console.log('\n[Test 1] Logging in as student...');
    const loginStudentRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@unisphere.edu', password: 'password123' })
    });
    const loginStudentData = await loginStudentRes.json();
    if (loginStudentRes.status !== 200 || !loginStudentData.token) {
      throw new Error(`Student login failed with status ${loginStudentRes.status}: ${JSON.stringify(loginStudentData)}`);
    }
    studentToken = loginStudentData.token;
    console.log('✔ Student login successful.');

    // 2. Test Login (Faculty)
    console.log('\n[Test 2] Logging in as faculty...');
    const loginFacultyRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'faculty@unisphere.edu', password: 'password123' })
    });
    const loginFacultyData = await loginFacultyRes.json();
    if (loginFacultyRes.status !== 200 || !loginFacultyData.token) {
      throw new Error(`Faculty login failed: ${JSON.stringify(loginFacultyData)}`);
    }
    facultyToken = loginFacultyData.token;
    console.log('✔ Faculty login successful.');

    // 3. Test Login (Admin)
    console.log('\n[Test 3] Logging in as admin...');
    const loginAdminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@unisphere.edu', password: 'password123' })
    });
    const loginAdminData = await loginAdminRes.json();
    adminToken = loginAdminData.token;
    console.log('✔ Admin login successful.');

    // 4. Test Event Creation (Faculty)
    console.log('\n[Test 4] Faculty creating a pending event...');
    const createEventRes = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${facultyToken}`
      },
      body: JSON.stringify({
        title: 'Blockchain Workshop 2026',
        description: 'An advanced workshop discussing distributed ledgers and smart contracts.',
        category: 'Tech',
        venue: 'Engineering Block Auditorium',
        date: '2026-07-28',
        time: '15:00',
        capacity: 40
      })
    });
    const createEventData = await createEventRes.json();
    if (createEventRes.status !== 201) {
      throw new Error(`Failed to create event: ${JSON.stringify(createEventData)}`);
    }
    testEventId = createEventData._id;
    console.log(`✔ Event created successfully with ID: ${testEventId}. Status: ${createEventData.status}`);

    // 5. Test Admin Approving Event
    console.log('\n[Test 5] Admin approving the pending event...');
    const approveEventRes = await fetch(`${BASE_URL}/events/${testEventId}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const approveEventData = await approveEventRes.json();
    if (approveEventRes.status !== 200 || approveEventData.status !== 'approved') {
      throw new Error(`Failed to approve event: ${JSON.stringify(approveEventData)}`);
    }
    console.log('✔ Event approved successfully.');

    // 6. Test Student Registering for Event
    console.log('\n[Test 6] Student registering for the approved event...');
    const registerRes = await fetch(`${BASE_URL}/events/${testEventId}/register`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const registerData = await registerRes.json();
    if (registerRes.status !== 201) {
      throw new Error(`Failed to register for event: ${JSON.stringify(registerData)}`);
    }
    testRegistrationId = registerData._id;
    console.log(`✔ Registered successfully. Registration ID: ${testRegistrationId}`);

    // 7. Test AI Recommendations
    console.log('\n[Test 7] Fetching AI Event Recommendations for student...');
    const recommendRes = await fetch(`${BASE_URL}/events/recommendations/user`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const recommendData = await recommendRes.json();
    if (recommendRes.status !== 200 || !Array.isArray(recommendData)) {
      throw new Error(`Failed to get recommendations: ${JSON.stringify(recommendData)}`);
    }
    console.log(`✔ AI returned ${recommendData.length} recommended events.`);
    if (recommendData.length > 0) {
      console.log(`  Top recommendation: "${recommendData[0].title}" (AI Score: ${recommendData[0].aiScore}, Reason: ${recommendData[0].aiReason})`);
    }

    // 8. Test Faculty Scanning QR Code / Marking Attendance
    console.log('\n[Test 8] Faculty marking attendance via QR code simulation...');
    const qrPayload = JSON.stringify({
      registrationId: testRegistrationId,
      eventId: testEventId,
      studentId: loginStudentData.user._id
    });
    const attendanceRes = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${facultyToken}`
      },
      body: JSON.stringify({ qrData: qrPayload })
    });
    const attendanceData = await attendanceRes.json();
    if (attendanceRes.status !== 201) {
      throw new Error(`Failed to mark attendance: ${JSON.stringify(attendanceData)}`);
    }
    console.log('✔ Attendance marked successfully.');

    // 9. Fetch Attendance Report with AI Prediction
    console.log('\n[Test 9] Faculty fetching event attendance report & predictions...');
    const reportRes = await fetch(`${BASE_URL}/attendance/event/${testEventId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${facultyToken}` }
    });
    const reportData = await reportRes.json();
    if (reportRes.status !== 200) {
      throw new Error(`Failed to fetch attendance report: ${JSON.stringify(reportData)}`);
    }
    console.log(`✔ Report loaded. Total Registered: ${reportData.totalRegistered}, Present: ${reportData.presentCount}`);
    console.log(`✔ AI Attendance Prediction: ${reportData.aiPrediction.predictedRate}% rate (${reportData.aiPrediction.predictedCount} attendees predicted). Analysis: ${reportData.aiPrediction.analysis}`);

    console.log('\n=============================================');
    console.log('🏆 SUCCESS: All API integration tests passed!');
    console.log('=============================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ FAIL: API Integration Test Failed!');
    console.error(err.message);
    process.exit(1);
  }
};

runTests();
