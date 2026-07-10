import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import QrPassModal from '../components/QrPassModal';
import { Calendar, MapPin, Users, Clock, Sparkles, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // QR Modal states
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);

  const loadEventDetails = async () => {
    try {
      const eventRes = await eventAPI.getById(id);
      setEvent(eventRes.data);

      const relatedRes = await eventAPI.getRelated(id);
      setRelatedEvents(relatedRes.data);

      // Check if student is already registered, and load that registration details
      if (user && user.role === 'Student') {
        const regRes = await eventAPI.getUserRegistrations();
        const matchedReg = regRes.data.find(r => r.event?._id === id);
        if (matchedReg) {
          setUserRegistration(matchedReg);
        } else {
          setUserRegistration(null);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    setSuccess('');
    loadEventDetails();
  }, [id, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      return navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
    if (user?.role !== 'Student') {
      return setError('Only students can register for events.');
    }

    setRegistering(true);
    setError('');
    setSuccess('');
    try {
      const res = await eventAPI.register(id);
      setSuccess('Successfully registered for the event! QR pass has been generated.');
      
      // Load details again to show updated capacity and registration info
      await loadEventDetails();
      
      // Auto open QR modal
      setTimeout(() => {
        setQrModalOpen(true);
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelReg = async () => {
    if (!userRegistration) return;
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      try {
        await eventAPI.cancelRegistration(userRegistration._id);
        setUserRegistration(null);
        setSuccess('Registration cancelled successfully.');
        loadEventDetails();
      } catch (err) {
        setError('Failed to cancel registration.');
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6 animate-pulse">
        <div className="h-6 w-20 bg-brand-cardLight/30 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-brand-cardLight/30 rounded"></div>
          <div className="h-96 bg-brand-cardLight/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Event Not Found</h2>
        <Link to="/events" className="btn-primary w-fit mx-auto px-4 py-2 text-xs">Back to Events</Link>
      </div>
    );
  }

  const registeredCount = event.registeredStudents ? event.registeredStudents.length : 0;
  const isFull = registeredCount >= event.capacity;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back button */}
      <Link to="/events" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Directory
      </Link>

      {error && (
        <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4.5 w-4.5" /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner image */}
          <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-brand-border/40 shadow-2xl relative">
            <img
              src={event.banner.startsWith('/') ? `http://localhost:5000${event.banner}` : event.banner}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-violet-600 border border-violet-400 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {event.category}
            </span>
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">{event.title}</h1>
            
            {/* Organizer banner */}
            <div className="flex items-center gap-2.5 py-3 border-y border-brand-border/30 mb-6 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Organized By:</span>
              <span>Dr. {event.organizer?.name || 'Faculty Coordinator'}</span>
              <span className="border-l border-brand-border/30 pl-2">{event.organizer?.department || 'Faculty'}</span>
            </div>

            {/* Description */}
            <h3 className="text-base font-bold text-white mb-3">Event Description</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-8">
              {event.description}
            </p>

            {/* Meta details list grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-dark/40 border border-brand-border/30 rounded-xl p-5">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Calendar className="h-5 w-5 text-violet-400 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-0.5">Date</p>
                  <p className="text-slate-400">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Clock className="h-5 w-5 text-violet-400 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-0.5">Time</p>
                  <p className="text-slate-400">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <MapPin className="h-5 w-5 text-violet-400 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-0.5">Venue</p>
                  <p className="text-slate-400">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Users className="h-5 w-5 text-violet-400 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-0.5">Capacity</p>
                  <p className="text-slate-400">{registeredCount} / {event.capacity} registered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Actions & Related */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="glass-panel p-6 border-violet-500/20 bg-gradient-to-b from-brand-card to-brand-dark/30">
            <h3 className="text-base font-bold text-white mb-4 border-b border-brand-border/20 pb-2">Event Status</h3>
            
            {/* Registration state handler */}
            {userRegistration ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>You are successfully registered for this event!</span>
                </div>
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="btn-primary w-full py-2.5 text-xs"
                >
                  View QR Pass
                </button>
                <button
                  onClick={handleCancelReg}
                  className="w-full text-xs py-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-950/40"
                >
                  Cancel Registration
                </button>
              </div>
            ) : isFull ? (
              <div className="space-y-3">
                <p className="text-xs text-red-400 text-center font-bold">⚠️ Event is currently FULL</p>
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">No spots available. Check other upcoming events in the catalog.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Register now to save your seat. Registrations are free but capped at {event.capacity} total attendees.
                </p>
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn-primary w-full py-2.5 text-xs"
                >
                  {registering ? 'Processing...' : 'Register Now'}
                </button>
              </div>
            )}
          </div>

          {/* Related Events list */}
          <div className="glass-panel p-5">
            <h3 className="text-base font-bold text-white mb-4">Related Events</h3>
            {relatedEvents.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No similar events discovered.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {relatedEvents.map(e => (
                  <Link
                    key={e._id}
                    to={`/events/${e._id}`}
                    className="p-3 bg-brand-dark/45 hover:bg-brand-cardLight/20 border border-brand-border/40 rounded-lg block transition-colors"
                  >
                    <div className="flex justify-between items-center text-[9px] mb-1.5">
                      <span className="text-violet-300 font-bold uppercase">{e.category}</span>
                      <span className="text-slate-500">{e.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{e.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-1">{e.venue}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* QR pass modal */}
      {userRegistration && (
        <QrPassModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          registration={userRegistration}
          student={user}
        />
      )}
    </div>
  );
};

export default EventDetails;
