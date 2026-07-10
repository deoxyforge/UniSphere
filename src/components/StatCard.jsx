import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, colorClass = 'text-violet-400' }) => {
  return (
    <div className="glass-panel p-5 relative overflow-hidden group">
      {/* Background glow hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-lg bg-brand-dark border border-brand-border/40 group-hover:border-violet-500/30 transition-all ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {trend && (
          <span className={`font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend}
          </span>
        )}
        <span className="text-slate-400 font-medium">{description}</span>
      </div>
    </div>
  );
};

export default StatCard;
