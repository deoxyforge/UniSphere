import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { eventAPI, clubAPI, attendanceAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import QrScannerModal from '../components/QrScannerModal';
import StatCard from '../components/StatCard';
import { Calendar, Users, Award, Percent, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  // Statistics
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [selectedEventIdForReport, setSelectedEventIdForReport] = useState('');

  const loadFacultyData = async () => {
    try {
      const eventsRes = await eventAPI.getAll({ status: 'approved' }); // gets all approved
      const clubsRes = await clubAPI.getAll();

      // Find clubs coordinated by this faculty
      const coordinatedClub = clubsRes.data.find(c => c.coordinator?._id === user?._id || c.coordinator === user?._id);
      setClub(coordinatedClub);

      // Filter events created by this faculty
      const facultyEvents = eventsRes.data.filter(e => e.organizer?._id === user?._id || e.organizer === user?._id);
      setEvents(facultyEvents);

      // Set default report event
      if (facultyEvents.length > 0) {
        setSelectedEventIdForReport(facultyEvents[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFacultyData();
    }
  }, [user]);

  // Load attendance report for selected event
  useEffect(() => {
    const loadReport = async () => {
      if (selectedEventIdForReport) {
        try {
          const reportRes = await attendanceAPI.getReport(selectedEventIdForReport);
          setAttendanceReport(reportRes.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    loadReport();
  }, [selectedEventIdForReport]);

  const handleOpenScanner = (event) => {
    setSelectedEventForAttendance(event);
    setScannerOpen(true);
  };

  const handleAttendanceSuccess = () => {
    // Reload attendance report
    if (selectedEventIdForReport) {
      attendanceAPI.getReport(selectedEventIdForReport).then(res => setAttendanceReport(res.data));
    }
  };

  // Prepare chart data (Registrations per Event)
  const chartData = events.map(e => ({
    name: e.title.length > 15 ? `${e.title.substr(0, 12)}...` : e.title,
    registrations: e.registeredStudents ? e.registeredStudents.length : 0
  }));

  const totalRegistrationsCount = events.reduce((sum, e) => sum + (e.registeredStudents ? e.registeredStudents.length : 0), 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6 animate-pulse">
        <div className="h-10 bg-brand-cardLight/30 w-1/4 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-brand-border/30">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            Faculty Coordinator Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage your events, analyze registrations, run AI predictions, and scan student passes.
          </p>
        </div>
        
        <Link to="/events/create" className="btn-primary text-xs py-2.5 px-4">
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Events Organized"
          value={events.length}
          icon={Calendar}
          description="Approved campus events"
          colorClass="text-violet-400"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrationsCount}
          icon={Users}
          description="Across all your events"
          colorClass="text-emerald-400"
        />
        {club ? (
          <StatCard
            title="Club Members"
            value={club.members?.length || 0}
            icon={ShieldCheck}
            description={`Coordinating: ${club.name}`}
            colorClass="text-blue-400"
          />
        ) : (
          <div className="glass-panel p-5 text-slate-500 text-xs flex flex-col justify-center">
            No coordinated club assigned yet.
          </div>
        )}
      </div>

      {/* Main Grid: Charts & Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Visual Analytics */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-white mb-6">Registrations Analytics</h3>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              No registration data available. Create approved events to track!
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#223254" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131B2E', borderColor: '#223254', borderRadius: 8 }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#c084fc' }}
                  />
                  <Bar dataKey="registrations" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* My Events List */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">My Events</h3>
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">You haven't created any events yet.</p>
            ) : (
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {events.map((e) => (
                  <div key={e._id} className="p-3 bg-brand-dark/45 border border-brand-border/40 hover:border-violet-500/30 rounded-lg flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{e.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(e.date).toLocaleDateString()} • {e.time}</p>
                    </div>
                    <button
                      onClick={() => handleOpenScanner(e)}
                      className="btn-primary text-[10px] py-1.5 px-3 shrink-0"
                    >
                      Check In
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance & AI Predictions Section */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selector & attendance list */}
          <div className="lg:col-span-2 glass-panel p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-brand-border/30 pb-4">
              <h3 className="text-lg font-bold text-white">Event Attendance Roster</h3>
              <select
                value={selectedEventIdForReport}
                onChange={(e) => setSelectedEventIdForReport(e.target.value)}
                className="px-3 py-1.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              >
                {events.map(e => (
                  <option key={e._id} value={e._id}>{e.title}</option>
                ))}
              </select>
            </div>

            {attendanceReport ? (
              <div className="space-y-4">
                <div className="flex gap-4 text-xs font-medium bg-brand-dark/40 p-3 rounded-lg border border-brand-border/30 mb-4">
                  <span>Registered: <b className="text-white">{attendanceReport.totalRegistered}</b></span>
                  <span className="border-l border-brand-border/30 pl-4">Present: <b className="text-emerald-400">{attendanceReport.presentCount}</b></span>
                  <span className="border-l border-brand-border/30 pl-4">Absent: <b className="text-red-400">{attendanceReport.absentCount}</b></span>
                </div>

                {attendanceReport.attendanceList.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No students registered for this event yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-brand-border/40 text-slate-400 font-bold pb-2">
                          <th className="pb-2">Student Name</th>
                          <th className="pb-2">Department</th>
                          <th className="pb-2">Check-in Status</th>
                          <th className="pb-2">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceReport.attendanceList.map((record) => (
                          <tr key={record.student?._id} className="border-b border-brand-border/10">
                            <td className="py-2.5 font-bold text-white">{record.student?.name}</td>
                            <td className="py-2.5 text-slate-400">{record.student?.department || 'N/A'}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                record.status === 'present'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-500">
                              {record.checkInTime
                                ? new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                : '--'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500 text-xs text-center py-10">Select an event to view roster.</div>
            )}
          </div>

          {/* AI Attendance Prediction Widget */}
          <div className="glass-panel p-6 border border-violet-500/30 bg-gradient-to-b from-brand-card to-violet-950/20 relative flex flex-col justify-between">
            <div className="absolute top-4 right-4 text-violet-400 animate-bounce">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5">
                AI Expected Attendance
              </h3>
              <p className="text-slate-400 text-[11px] mb-6 leading-relaxed">
                Evaluating expected attendance rate for the event based on weekend factors, engagement history, and category filters.
              </p>

              {attendanceReport?.aiPrediction ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-5 rounded-full bg-violet-600/15 border-2 border-violet-500/30 text-white font-extrabold text-3xl mb-2">
                      {attendanceReport.aiPrediction.predictedRate}%
                    </div>
                    <p className="text-xs font-semibold text-slate-300">Expected Turnout Rate</p>
                  </div>

                  <div className="space-y-3 bg-brand-dark/40 border border-brand-border/40 p-3.5 rounded-lg text-xs leading-relaxed">
                    <div className="flex justify-between font-bold text-white">
                      <span>Predicted Attendees:</span>
                      <span className="text-violet-400">{attendanceReport.aiPrediction.predictedCount} Students</span>
                    </div>
                    <div className="text-slate-400 text-[10px] mt-1 pt-2 border-t border-brand-border/20">
                      <b>Contributing Factors:</b>
                      <p className="mt-1 text-slate-300">{attendanceReport.aiPrediction.analysis}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-10">No event report selected for prediction.</p>
              )}
            </div>
            
            <div className="text-[10px] text-slate-500 leading-relaxed mt-6 border-t border-brand-border/20 pt-4">
              📌 Estimates adjust dynamically as registrations increase.
            </div>
          </div>
        </div>
      )}

      {/* QR Attendance Scanner Modal */}
      <QrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        event={selectedEventForAttendance}
        onAttendanceMarked={handleAttendanceSuccess}
      />
    </div>
  );
};

export default FacultyDashboard;
