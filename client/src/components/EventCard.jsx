import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Sparkles, Clock } from 'lucide-react';

const EventCard = ({ event, isRegistered }) => {
  const registeredCount = event.registeredStudents ? event.registeredStudents.length : 0;
  const isFull = registeredCount >= event.capacity;
  
  // Format Date nicely
  const formatDate = (dateStr) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Determine Category Badge Styles
  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'coding':
      case 'tech':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      case 'workshop':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'seminar':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'music':
      case 'cultural':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  // Check if AI recommendations metadata is attached
  const showAiBadge = event.aiScore !== undefined && event.aiScore > 20;

  return (
    <div className="glass-panel glass-panel-hover flex flex-col overflow-hidden h-full">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={event.banner.startsWith('/') ? `http://localhost:5000${event.banner}` : event.banner}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${getCategoryColor(event.category)}`}>
          {event.category}
        </span>

        {/* AI recommended Badge */}
        {showAiBadge && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-400 text-white rounded-full flex items-center gap-1 animate-pulse-slow shadow-lg shadow-violet-500/30">
            <Sparkles className="h-3 w-3" />
            AI Match ({event.aiScore} pts)
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-violet-400 transition-colors">
          <Link to={`/events/${event._id}`}>{event.title}</Link>
        </h3>
        
        <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Details list */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-300 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-violet-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-violet-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-400 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>Capacity: {registeredCount}/{event.capacity}</span>
                {isFull && <span className="text-red-400 font-bold">FULL</span>}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`} 
                  style={{ width: `${Math.min((registeredCount / event.capacity) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI recommendation reason tag */}
        {showAiBadge && event.aiReason && (
          <div className="mb-4 text-[10px] text-violet-300 bg-violet-950/40 border border-violet-900/50 p-2 rounded flex items-start gap-1">
            <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
            <span>{event.aiReason}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-brand-border/40 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 font-medium">
            By Dr. {event.organizer ? (event.organizer.name || 'Faculty') : 'Faculty'}
          </div>
          <div className="flex items-center gap-2">
            {isRegistered && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-semibold uppercase tracking-wider">
                Registered
              </span>
            )}
            <Link to={`/events/${event._id}`} className="btn-secondary py-1.5 px-3 text-xs">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
