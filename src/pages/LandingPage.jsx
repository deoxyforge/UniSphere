import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventAPI, clubAPI } from '../services/api';
import EventCard from '../components/EventCard';
import ClubCard from '../components/ClubCard';
import { Calendar, Users, Award, Shield, ArrowRight, Zap, GraduationCap, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const eventsRes = await eventAPI.getAll({ dateScope: 'upcoming' });
        const clubsRes = await clubAPI.getAll();
        setEvents(eventsRes.data.slice(0, 3)); // show top 3
        setClubs(clubsRes.data.slice(0, 3));   // show top 3
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLandingData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Background glow auras */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/30 text-violet-300 text-xs font-semibold animate-pulse">
            <Zap className="h-3.5 w-3.5" />
            <span>Introducing UniSphere v1.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            The Smart Hub for Campus <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent glow-text">
              Events & Student Clubs
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create, manage, and discover university hackathons, workshops, and music shows. Connect with active campus clubs, scan QR passes at the entrance, and get personalized recommendations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to={user.role === 'Admin' ? '/admin' : user.role === 'Faculty' ? '/faculty' : '/dashboard'} className="btn-primary w-full sm:w-auto px-8 py-3">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary w-full sm:w-auto px-8 py-3">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/events" className="btn-secondary w-full sm:w-auto px-8 py-3">
                  Browse Events
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full">
          <div className="glass-panel p-5 text-center">
            <h4 className="text-2xl font-extrabold text-white mb-1">50+</h4>
            <p className="text-slate-400 text-xs font-medium">Active Events</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <h4 className="text-2xl font-extrabold text-white mb-1">12+</h4>
            <p className="text-slate-400 text-xs font-medium">Student Clubs</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <h4 className="text-2xl font-extrabold text-white mb-1">100%</h4>
            <p className="text-slate-400 text-xs font-medium">Digital QR Passes</p>
          </div>
          <div className="glass-panel p-5 text-center">
            <h4 className="text-2xl font-extrabold text-white mb-1">AI</h4>
            <p className="text-slate-400 text-xs font-medium">Recommendations</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6 bg-brand-card/20 border-t border-brand-border/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Upcoming Events</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Don't miss out! Register to secure your spot.</p>
            </div>
            <Link to="/events" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-panel h-80 animate-pulse bg-brand-cardLight/30"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500">
              No upcoming events found. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} isRegistered={event.registeredStudents?.includes(user?._id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Designed for Smart Campuses</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Empowering students, coordinators, and administrators with role-specific tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="p-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl w-fit">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">For Students</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Browse upcoming hackathons and workshops
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Generate and download digital QR entrance passes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Get AI recommendations matching your interests
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">For Faculty & Coordinators</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Create and manage club event schedules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Scan QR passes using webcam to mark attendance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Verify AI attendance predictions & student rosters
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl w-fit">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">For Administrators</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Audit and approve pending event registrations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Manage campus clubs and assign coordinators
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Track platform analytics and user accounts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Clubs */}
      <section className="py-16 px-6 bg-brand-card/20 border-t border-brand-border/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Campus Clubs</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Join active clubs to expand your campus network.</p>
            </div>
            <Link to="/clubs" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View All Clubs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-panel h-56 animate-pulse bg-brand-cardLight/30"></div>
              ))}
            </div>
          ) : clubs.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500">
              No campus clubs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 border-t border-brand-border/40 text-center text-xs text-slate-500 bg-brand-dark">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 UniSphere Hub. All Rights Reserved. Built with MERN Stack.</p>
          <div className="flex gap-4">
            <Link to="/events" className="hover:underline">Events</Link>
            <Link to="/clubs" className="hover:underline">Clubs</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
