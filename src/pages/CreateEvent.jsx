import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import { Calendar, Plus, AlertCircle, ArrowLeft, Image, Sparkles } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [banner, setBanner] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not Faculty or Admin
  useEffect(() => {
    if (user && user.role !== 'Faculty' && user.role !== 'Admin') {
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !venue || !date || !time || !capacity) {
      return setError('Please fill in all fields.');
    }

    const eventCapacity = parseInt(capacity);
    if (isNaN(eventCapacity) || eventCapacity <= 0) {
      return setError('Capacity must be greater than 0.');
    }

    // Validate future date
    const eventDate = new Date(`${date}T${time}`);
    const today = new Date();
    if (eventDate < today) {
      return setError('Event date and time must be in the future.');
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('venue', venue);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('capacity', eventCapacity);
    if (banner) {
      formData.append('banner', banner);
    }

    try {
      await eventAPI.create(formData);
      // Redirect
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/faculty');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Back */}
      <Link
        to={user?.role === 'Admin' ? '/admin' : '/faculty'}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 font-semibold"
      >
        <ArrowLeft className="h-4 w-4" /> Cancel & Go Back
      </Link>

      <div className="glass-panel p-6 sm:p-8 border border-brand-border/60">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex justify-center items-center gap-2">
            <Plus className="h-7 w-7 text-violet-500" /> Create Campus Event
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure event specifications. Submissions undergo administrator review.</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CodeSprint Hackathon 2026"
              className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed schedule, eligibility, guidelines..."
              rows="4"
              className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              >
                <option value="Coding">Coding</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            {/* Venue */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Venue *</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. IT Block Seminar Hall B"
                className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            {/* Capacity */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Capacity *</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Upload Event Banner</label>
            <div className="flex items-center gap-3 p-3 bg-brand-dark/50 border border-dashed border-brand-border rounded-lg">
              <Image className="h-6 w-6 text-slate-500 shrink-0" />
              <input
                type="file"
                onChange={(e) => setBanner(e.target.files[0])}
                className="text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-violet-600/10 file:text-violet-400 hover:file:bg-violet-600/20"
              />
            </div>
          </div>

          {/* Predictor reminder */}
          <div className="p-3 bg-violet-950/20 border border-violet-900/40 rounded-lg text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
            <span>
              💡 <b>AI Analytics Feature:</b> Once created, the Faculty Dashboard will display expected attendance estimates for this event using the smart turnout scoring model.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 mt-4 text-sm"
          >
            {loading ? 'Creating Event...' : 'Submit Event Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
