/**
 * AI Service for UniSphere Event Recommendations and Attendance Predictions
 */

/**
 * Ranks events for a student using a scoring algorithm based on interests,
 * joined clubs, previous registrations, and department.
 * 
 * @param {Object} student - The user document
 * @param {Array} events - All active/approved events
 * @param {Array} registrations - The student's event registrations
 * @param {Array} clubs - All clubs in the system
 * @returns {Array} List of events with scores, sorted descending
 */
const recommendEvents = (student, events, registrations, clubs) => {
  if (!student) return events;

  // Get the categories of events the student previously registered for
  const registeredEventIds = registrations
    .filter(r => r.student === student._id && r.status === 'registered')
    .map(r => r.event);
  
  const pastRegisteredEvents = events.filter(e => registeredEventIds.includes(e._id));
  const pastCategories = pastRegisteredEvents.map(e => e.category);

  // Get clubs the student has joined
  const joinedClubIds = student.joinedClubs || [];
  const joinedClubs = clubs.filter(c => joinedClubIds.includes(c._id));
  const joinedClubCoordinators = joinedClubs.map(c => c.coordinator);

  return events
    .filter(event => event.status === 'approved')
    .map(event => {
      let score = 0;
      const reasons = [];

      // 1. Check matching interests
      if (student.interests && student.interests.includes(event.category)) {
        score += 30;
        reasons.push('Matches your interests');
      }

      // 2. Check if event organizer is coordinator of student's club
      if (joinedClubCoordinators.includes(event.organizer)) {
        score += 40;
        reasons.push('Organized by a club you joined');
      }

      // 3. Match categories of past registered events
      const categoryFrequency = pastCategories.filter(cat => cat === event.category).length;
      if (categoryFrequency > 0) {
        const points = Math.min(categoryFrequency * 20, 60);
        score += points;
        reasons.push(`You register for ${event.category} events often`);
      }

      // 4. Department match (case-insensitive string search in title/description)
      if (student.department) {
        const dept = student.department.toLowerCase();
        if (
          event.title.toLowerCase().includes(dept) || 
          event.description.toLowerCase().includes(dept)
        ) {
          score += 15;
          reasons.push('Relevant to your department');
        }
      }

      // 5. Popularity score (number of registered students)
      const popularity = event.registeredStudents ? event.registeredStudents.length : 0;
      score += Math.min(popularity * 2, 15);
      if (popularity > 10) {
        reasons.push('Trending event');
      }

      // Default label if no matches
      if (reasons.length === 0) {
        reasons.push('Upcoming Event');
      }

      const eventObj = typeof event.toObject === 'function' ? event.toObject() : event;
      return {
        ...eventObj,
        aiScore: score,
        aiReason: reasons[0], // Primary recommendation reason
        allReasons: reasons
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore);
};

/**
 * Predicts attendance rate and count for an event.
 * 
 * @param {Object} event - The event document
 * @param {Array} registrations - All registrations in the system for this event
 * @param {Array} clubs - All clubs
 * @returns {Object} { predictedRate, predictedCount, analysis }
 */
const predictAttendance = (event, registrations, clubs) => {
  const registeredCount = event.registeredStudents ? event.registeredStudents.length : 0;
  if (registeredCount === 0) {
    return {
      predictedRate: 0,
      predictedCount: 0,
      analysis: 'No registrations yet.'
    };
  }

  let rate = 0.75; // Base expected attendance rate (75%)
  const factors = [];

  // Factor 1: Date is on weekend
  if (event.date) {
    const day = new Date(event.date).getDay();
    const isWeekend = day === 0 || day === 6; // 0=Sunday, 6=Saturday
    if (isWeekend) {
      rate -= 0.10;
      factors.push('Weekend event (-10% attendance expected)');
    } else {
      rate += 0.05;
      factors.push('Weekday event (+5% attendance expected)');
    }
  }

  // Factor 2: Event capacity
  if (event.capacity > 100) {
    rate -= 0.05;
    factors.push('Large capacity venue (-5% rate due to scale)');
  } else if (event.capacity < 30) {
    rate += 0.10;
    factors.push('Small scale/focused group (+10% rate)');
  }

  // Factor 3: Category adjustment
  const highAttendanceCategories = ['Tech', 'Coding', 'Workshop'];
  if (highAttendanceCategories.includes(event.category)) {
    rate += 0.08;
    factors.push('High engagement category (+8%)');
  }

  // Factor 4: Club organizer popularity
  const organizerClub = clubs.find(c => c.coordinator === event.organizer);
  if (organizerClub && organizerClub.members && organizerClub.members.length > 50) {
    rate += 0.05;
    factors.push('Organized by a large club (+5%)');
  }

  // Limit rate to realistic bounds: 40% to 95%
  rate = Math.max(0.40, Math.min(rate, 0.95));

  const predictedCount = Math.round(registeredCount * rate);

  return {
    predictedRate: Math.round(rate * 100),
    predictedCount,
    analysis: factors.join(', ') || 'Normal campus traffic expectations.'
  };
};

module.exports = {
  recommendEvents,
  predictAttendance
};
