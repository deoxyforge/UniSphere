import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Tag } from 'lucide-react';

const ClubCard = ({ club, isJoined, onToggleJoin }) => {
  const memberCount = club.members ? club.members.length : 0;

  // Category styles
  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'tech':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      case 'music':
      case 'arts':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'sports':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'literature':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover flex flex-col p-5 h-full">
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Logo */}
        <img
          src={club.logo.startsWith('/') ? `http://localhost:5000${club.logo}` : club.logo}
          alt={club.name}
          className="h-14 w-14 rounded-xl object-cover border border-brand-border bg-slate-900"
        />
        {/* Category Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(club.category)}`}>
          {club.category}
        </span>
      </div>

      {/* Title & Desc */}
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-violet-400 transition-colors">
        <Link to={`/clubs/${club._id}`}>{club.name}</Link>
      </h3>
      <p className="text-slate-400 text-xs line-clamp-3 mb-5 leading-relaxed flex-1">
        {club.description}
      </p>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-slate-300 mb-5 pt-3 border-t border-brand-border/40">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-violet-400" />
          <span>{memberCount} Members</span>
        </div>
        <div className="flex items-center gap-1.5 truncate max-w-[150px]">
          <Shield className="h-4 w-4 text-violet-400" />
          <span className="truncate">Dr. {club.coordinator ? (club.coordinator.name || 'Faculty') : 'Faculty'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <Link to={`/clubs/${club._id}`} className="btn-secondary flex-1 text-xs py-2">
          View Club
        </Link>
        {onToggleJoin && (
          <button
            onClick={() => onToggleJoin(club._id, isJoined)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isJoined
                ? 'bg-transparent border-red-500/40 text-red-400 hover:bg-red-950/20'
                : 'bg-violet-600/25 border-violet-500/40 text-violet-300 hover:bg-violet-600/40'
            }`}
          >
            {isJoined ? 'Leave' : 'Join'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubCard;
