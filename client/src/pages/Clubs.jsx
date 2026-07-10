import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { clubAPI } from '../services/api';
import ClubCard from '../components/ClubCard';
import { Award, Search, Sparkles } from 'lucide-react';

const Clubs = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const loadClubs = async () => {
    setLoading(true);
    try {
      const res = await clubAPI.getAll();
      setClubs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleToggleJoin = async (clubId, isJoined) => {
    try {
      if (isJoined) {
        await clubAPI.leave(clubId);
      } else {
        await clubAPI.join(clubId);
      }
      loadClubs();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  // Filtered Clubs
  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === '' || c.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex justify-center items-center gap-2">
          <Award className="h-8 w-8 text-violet-500" /> Student Clubs & Societies
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Expand your horizons. Join student communities, share your passion, and co-organize campus activities.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-panel p-5 mb-10 border border-brand-border/60 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name or keywords..."
            className="w-full pl-11 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500 w-full sm:w-48 appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Music">Music</option>
          <option value="Arts">Arts</option>
          <option value="Sports">Sports</option>
          <option value="Literature">Literature</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel h-56 animate-pulse bg-brand-cardLight/30"></div>
          ))}
        </div>
      ) : filteredClubs.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-500 text-xs">
          No student clubs found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const isJoined = isAuthenticated && club.members?.some(m => (m._id || m) === user?._id);
            return (
              <ClubCard
                key={club._id}
                club={club}
                isJoined={isJoined}
                onToggleJoin={isAuthenticated && user?.role === 'Student' ? handleToggleJoin : null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Clubs;
