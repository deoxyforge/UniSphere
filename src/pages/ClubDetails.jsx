import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clubAPI, eventAPI } from '../services/api';
import EventCard from '../components/EventCard';
import { Users, Shield, Tag, Calendar, ChevronRight, AlertCircle } from 'lucide-react';

const ClubDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadClubData = async () => {
    try {
      const clubRes = await clubAPI.getById(id);
      setClub(clubRes.data);

      const eventsRes = await eventAPI.getAll({ clubId: id });
      setEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load club details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubData();
  }, [id]);

  const handleJoinToggle = async () => {
    if (!isAuthenticated) return;
    setJoining(true);
    setError('');
    setSuccess('');

    const isMember = club.members?.some(m => m._id === user?._id);

    try {
      if (isMember) {
        await clubAPI.leave(id);
        setSuccess('You have successfully left the club.');
      } else {
        await clubAPI.join(id);
        setSuccess('Welcome to the club! You are now a member.');
      }
      await loadClubData();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6 animate-pulse">
        <div className="h-20 bg-brand-cardLight/30 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-brand-cardLight/30 rounded"></div>
          <div className="h-96 bg-brand-cardLight/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Club Not Found</h2>
        <Link to="/clubs" className="btn-primary w-fit mx-auto px-4 py-2 text-xs">Back to Clubs</Link>
      </div>
    );
  }

  const isMember = club.members?.some(m => m._id === user?._id);
  const memberCount = club.members ? club.members.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border-brand-border/60 bg-gradient-to-r from-brand-card via-brand-card to-violet-950/15 mb-10 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">
          <img
            src={club.logo.startsWith('/') ? `http://localhost:5000${club.logo}` : club.logo}
            alt={club.name}
            className="h-20 w-20 rounded-2xl border border-brand-border object-cover bg-slate-900"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-600/30 text-violet-300 border border-violet-500/20 rounded uppercase tracking-wider">
                {club.category}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                • <Users className="h-3.5 w-3.5" /> {memberCount} Members
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate">{club.name}</h1>
          </div>
        </div>

        {/* Action Button */}
        {isAuthenticated && user?.role === 'Student' && (
          <button
            onClick={handleJoinToggle}
            disabled={joining}
            className={`px-6 py-2.5 text-xs font-bold rounded-lg border transition-all ${
              isMember
                ? 'bg-transparent border-red-500/40 text-red-400 hover:bg-red-950/20'
                : 'btn-primary shadow-lg shadow-violet-600/20'
            }`}
          >
            {joining ? 'Processing...' : isMember ? 'Leave Club' : 'Join Club'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: About & Organized Events */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="glass-panel p-6">
            <h3 className="text-base font-bold text-white mb-3">About the Club</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {club.description}
            </p>
          </div>

          {/* Club Events */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-violet-400" /> Events Organized By Us ({events.length})
            </h3>
            {events.length === 0 ? (
              <div className="glass-panel p-10 text-center text-slate-500 text-xs">
                No events currently scheduled under this club.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.map(event => (
                  <EventCard key={event._id} event={event} isRegistered={event.registeredStudents?.includes(user?._id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Coordinator & Member List */}
        <div className="space-y-6">
          {/* Coordinator card */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <Shield className="h-4 w-4 text-violet-400" /> Club Coordinator
            </h3>
            <div className="flex items-center gap-3 bg-brand-dark/40 border border-brand-border/40 p-3 rounded-lg">
              <img
                src={club.coordinator?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=Evelyn`}
                alt="coordinator"
                className="h-10 w-10 rounded-full border border-violet-500 shrink-0"
              />
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-white truncate">Dr. {club.coordinator?.name || 'Faculty Coordinator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{club.coordinator?.email || 'faculty@unisphere.edu'}</p>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">{club.coordinator?.department || 'Faculty'}</p>
              </div>
            </div>
          </div>

          {/* Members Roster */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="h-4 w-4 text-violet-400" /> Members List ({memberCount})
            </h3>
            {memberCount === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Be the first to join this club!</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {club.members.map((member) => (
                  <div key={member._id} className="flex items-center gap-2.5 p-2 bg-brand-dark/25 rounded border border-brand-border/20">
                    <img
                      src={member.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${member.name}`}
                      alt="member"
                      className="h-7 w-7 rounded-full border border-brand-border shrink-0"
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-semibold text-white truncate">{member.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{member.department || 'Student'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClubDetails;
