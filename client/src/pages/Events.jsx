import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { eventAPI, clubAPI } from '../services/api';
import EventCard from '../components/EventCard';
import { Search, CalendarDays, Award, RefreshCw, Sparkles } from 'lucide-react';

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [clubId, setClubId] = useState('');
  const [dateScope, setDateScope] = useState('upcoming'); // default upcoming

  const loadData = async () => {
    setLoading(true);
    try {
      const clubsRes = await clubAPI.getAll();
      setClubs(clubsRes.data);

      const params = {
        search: search.trim() || undefined,
        category: category || undefined,
        clubId: clubId || undefined,
        dateScope: dateScope || undefined,
        status: 'approved'
      };
      
      const eventsRes = await eventAPI.getAll(params);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category, clubId, dateScope]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Campus Events Directory</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Find upcoming hackathons, music shows, technical seminars, and workshops.</p>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-5 mb-10 border border-brand-border/60">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-11 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Coding">Coding</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
          </select>

          {/* Submit/Reset Button */}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 text-xs">
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('');
                setClubId('');
                setDateScope('upcoming');
                // trigger load manual
                setTimeout(loadData, 50);
              }}
              className="btn-secondary px-3"
            >
              <RefreshCw className="h-4.5 w-4.5 text-slate-400" />
            </button>
          </div>
        </form>

        {/* Secondary filters row */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-brand-border/30 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4 text-violet-400" /> Date Scope:</span>
            <div className="flex bg-brand-dark p-0.5 rounded border border-brand-border/30">
              <button
                type="button"
                onClick={() => setDateScope('upcoming')}
                className={`px-2.5 py-1 rounded font-semibold ${dateScope === 'upcoming' ? 'bg-violet-600 text-white' : 'hover:text-slate-200'}`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setDateScope('past')}
                className={`px-2.5 py-1 rounded font-semibold ${dateScope === 'past' ? 'bg-violet-600 text-white' : 'hover:text-slate-200'}`}
              >
                Past Events
              </button>
              <button
                type="button"
                onClick={() => setDateScope('')}
                className={`px-2.5 py-1 rounded font-semibold ${dateScope === '' ? 'bg-violet-600 text-white' : 'hover:text-slate-200'}`}
              >
                All
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><Award className="h-4 w-4 text-violet-400" /> Organizing Club:</span>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className="bg-brand-dark px-2.5 py-1 rounded border border-brand-border/40 focus:outline-none focus:border-violet-500"
            >
              <option value="">All Clubs</option>
              {clubs.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of events */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel h-80 animate-pulse bg-brand-cardLight/30"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-panel p-16 text-center text-slate-500 flex flex-col items-center justify-center">
          <CalendarDays className="h-10 w-10 text-slate-600 mb-3" />
          <p className="text-sm font-semibold mb-2">No Events Found</p>
          <p className="text-xs text-slate-500 max-w-xs">Adjust your search parameters or category filter and try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} isRegistered={event.registeredStudents?.includes(user?._id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
