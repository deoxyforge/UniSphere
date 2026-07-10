import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { Calendar, Bell, LogOut, User, Menu, X, Award, ShieldAlert, QrCode } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (user) {
      try {
        const res = await notificationAPI.getAll();
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [user]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await notificationAPI.markRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'Admin') return '/admin';
    if (user.role === 'Faculty') return '/faculty';
    return '/dashboard';
  };

  const navLinks = user ? [
    { name: 'Dashboard', path: getDashboardLink() },
    { name: 'Events', path: '/events' },
    { name: 'Clubs', path: '/clubs' },
  ] : [
    { name: 'Events', path: '/events' },
    { name: 'Clubs', path: '/clubs' },
  ];

  return (
    <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 bg-brand-dark bg-opacity-80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-white tracking-tight glow-text">
          <Calendar className="h-7 w-7 text-violet-500" />
          <span>Uni<span className="text-violet-400">Sphere</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium transition-colors hover:text-white ${
                location.pathname === link.path ? 'text-violet-400 border-b-2 border-violet-500 pb-1' : 'text-slate-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile & Notifications (Auth) / Login buttons (Guest) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen) handleMarkAsRead();
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-brand-cardLight transition-all relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-violet-600 text-[10px] text-white font-bold flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 glass-panel border border-brand-border bg-brand-card shadow-2xl p-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-brand-border mb-2">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-violet-400 cursor-pointer hover:underline" onClick={handleMarkAsRead}>
                          Mark all as read
                        </span>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-2.5 rounded-lg text-xs leading-relaxed transition-colors border ${
                              notif.isRead ? 'bg-transparent border-transparent' : 'bg-brand-cardLight/30 border-brand-border/40'
                            }`}
                          >
                            <div className="flex justify-between font-medium text-slate-200 mb-0.5">
                              <span>{notif.title}</span>
                              <span className="h-2 w-2 rounded-full bg-violet-500 self-center" style={{ visibility: notif.isRead ? 'hidden' : 'visible' }}></span>
                            </div>
                            <p className="text-slate-400">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-brand-cardLight p-1 rounded-lg transition-all"
                >
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                    alt="profile"
                    className="h-8 w-8 rounded-full border border-violet-500"
                  />
                  <span className="text-sm font-medium text-slate-300 hidden xl:inline">{user.name}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 glass-panel border border-brand-border bg-brand-card shadow-2xl overflow-hidden py-1">
                    <div className="px-4 py-2 border-b border-brand-border">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[9px] px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 font-bold uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-brand-cardLight hover:text-white"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-brand-cardLight hover:text-red-300 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-xs px-4 py-2">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary text-xs px-4 py-2">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-brand-cardLight rounded-lg"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 glass-panel p-4 flex flex-col gap-4 border-t border-brand-border">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1 border-b border-brand-border/20"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 py-2 border-b border-brand-border/30">
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                  alt="avatar"
                  className="h-10 w-10 rounded-full border border-violet-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.role}</p>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white text-sm flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-brand-border/30">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-1/2 text-center text-xs py-2.5">
                Log In
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-1/2 text-center text-xs py-2.5">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
