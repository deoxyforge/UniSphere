import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { eventAPI, clubAPI, attendanceAPI } from '../services/api';
import EventCard from '../components/EventCard';
import ClubCard from '../components/ClubCard';
import QrPassModal from '../components/QrPassModal';
import { Calendar, Users, Award, Sparkles, BookOpen, Clock, Tag, Heart } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'clubs', 'attendance'
  
  // QR Pass modal states
  const [selectedReg, setSelectedReg] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      const recRes = await eventAPI.getRecommendations();
      const regRes = await eventAPI.getUserRegistrations();
      const clubsRes = await clubAPI.getAll();
      const attRes = await attendanceAPI.getHistory();

      setRecommendations(recRes.data);
      setRegistrations(regRes.data);
      setAttendance(attRes.data);
      
      // Filter clubs where student is a member
      if (user) {
        setClubs(clubsRes.data.filter(c => c.members?.includes(user._id)));
      }
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleOpenQr = (reg) => {
    setSelectedReg(reg);
    setQrModalOpen(true);
  };

  const handleCancelRegistration = async (regId) => {
    if (window.confirm('Are you sure you want to cancel your registration for this event?')) {
      try {
        await eventAPI.cancelRegistration(regId);
        // Refresh
        loadDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel registration.');
      }
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      try {
        await clubAPI.leave(clubId);
        loadDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to leave club.');
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6 animate-pulse">
        <div className="h-10 bg-brand-cardLight/30 w-1/4 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-brand-cardLight/30 rounded"></div>
          <div className="h-96 bg-brand-cardLight/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-brand-border/30">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-200 bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage your digital passes, joined clubs, and discover AI-recommended events.
          </p>
        </div>
        
        <div className="flex gap-4 text-xs bg-brand-cardLight/20 border border-brand-border/40 p-3 rounded-lg">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Department</p>
            <p className="text-white font-bold">{user?.department || 'Not specified'}</p>
          </div>
          <div className="border-l border-brand-border/40 pl-4">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Joined Clubs</p>
            <p className="text-white font-bold">{clubs.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Selector */}
          <div className="flex gap-2 p-1 bg-brand-dark border border-brand-border/40 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'events' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Registered Events ({registrations.length})
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'clubs' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-4 w-4" />
              My Clubs ({clubs.length})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'attendance' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="h-4 w-4" />
              Attendance History ({attendance.length})
            </button>
          </div>

          {/* TAB 1: REGISTERED EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <div className="glass-panel p-10 text-center text-slate-500">
                  <p className="mb-4 text-sm">You haven't registered for any upcoming events yet.</p>
                  <a href="/events" className="btn-primary text-xs w-fit mx-auto px-4 py-2">Discover Events</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {registrations.map((reg) => (
                    <div key={reg._id} className="glass-panel p-4 flex flex-col justify-between border-brand-border/50">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[9px] bg-violet-600/30 text-violet-300 font-bold border border-violet-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                            {reg.event?.category}
                          </span>
                          <span className="text-[10px] text-slate-500">Reg: {formatDate(reg.registrationDate)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">{reg.event?.title}</h4>
                        
                        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                          <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-violet-400" /> {formatDate(reg.event?.date)} at {reg.event?.time}</p>
                          <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-violet-400" /> {reg.event?.venue}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-brand-border/20 mt-auto">
                        <button onClick={() => handleOpenQr(reg)} className="btn-primary text-[10px] flex-1 py-1.5">
                          View QR Pass
                        </button>
                        <button onClick={() => handleCancelRegistration(reg._id)} className="btn-secondary text-[10px] text-red-400 border-red-500/20 hover:border-red-500/40 py-1.5">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY CLUBS */}
          {activeTab === 'clubs' && (
            <div className="space-y-4">
              {clubs.length === 0 ? (
                <div className="glass-panel p-10 text-center text-slate-500">
                  <p className="mb-4 text-sm">You haven't joined any student clubs yet.</p>
                  <a href="/clubs" className="btn-primary text-xs w-fit mx-auto px-4 py-2">Explore Clubs</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clubs.map((club) => (
                    <ClubCard key={club._id} club={club} isJoined={true} onToggleJoin={handleLeaveClub} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATTENDANCE HISTORY */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {attendance.length === 0 ? (
                <div className="glass-panel p-10 text-center text-slate-500 text-sm">
                  No attendance records found. Your scanned entrance passes will be recorded here!
                </div>
              ) : (
                <div className="glass-panel overflow-hidden border border-brand-border/40">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-brand-dark/60 border-b border-brand-border/40 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="p-3">Event Title</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Check-in Time</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((record) => (
                          <tr key={record._id} className="border-b border-brand-border/20 hover:bg-brand-cardLight/10 transition-colors">
                            <td className="p-3 font-bold text-white">{record.event?.title || 'Unknown Event'}</td>
                            <td className="p-3 text-slate-300">{record.event ? formatDate(record.event.date) : 'N/A'}</td>
                            <td className="p-3 text-slate-400">
                              {new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase tracking-wider text-[9px]">
                                Present
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Recommendations Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-5 border border-violet-500/30 bg-gradient-to-b from-brand-card to-violet-950/20 relative">
            {/* Sparkling graphic */}
            <div className="absolute top-4 right-4 text-violet-400 animate-bounce">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5">
              Recommended For You
            </h3>
            <p className="text-slate-400 text-[11px] mb-5 leading-relaxed">
              AI scoring matched events based on your interest in <b>{user?.interests?.join(', ') || 'Tech'}</b> and your department.
            </p>

            {recommendations.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching recommendations found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recommendations.map((rec) => (
                  <div key={rec._id} className="p-3 bg-brand-dark/40 border border-brand-border/40 rounded-lg hover:border-violet-500/30 transition-all flex flex-col gap-2 relative">
                    {/* Tiny badge */}
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-violet-300 font-bold uppercase tracking-wider bg-violet-900/30 px-1.5 py-0.5 rounded">
                        {rec.category}
                      </span>
                      <span className="text-slate-500 font-medium">Match: {rec.aiScore} pts</span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{rec.title}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3 shrink-0 text-slate-500" /> {formatDate(rec.date)} at {rec.time}</p>

                    <div className="text-[9px] text-slate-400 leading-relaxed bg-brand-cardLight/20 p-1.5 rounded flex items-start gap-1">
                      <Heart className="h-3 w-3 text-pink-400 shrink-0 mt-0.5" />
                      <span>{rec.aiReason}</span>
                    </div>

                    <a
                      href={`/events/${rec._id}`}
                      className="text-[9px] font-bold text-violet-400 hover:text-violet-300 self-end flex items-center gap-0.5"
                    >
                      View Details & Register →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* QR Code Pass Modal */}
      <QrPassModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        registration={selectedReg}
        student={user}
      />
    </div>
  );
};

export default StudentDashboard;
