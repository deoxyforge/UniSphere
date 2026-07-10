import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, AlertCircle, User, Mail, Key, Shield, BookOpen } from 'lucide-react';

const Signup = () => {
  const { register, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Faculty') navigate('/faculty');
      else navigate('/dashboard');
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return setError('Please fill in all required fields.');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    setLoading(true);
    setError('');

    // Parse interests from comma-separated string
    const interests = interestsInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      const userData = await register(name, email, password, role, department, interests);
      if (userData.role === 'Faculty') navigate('/faculty');
      else navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-panel p-8 relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-white mb-2 glow-text">
            <Calendar className="h-6 w-6 text-violet-500" />
            <span>Uni<span className="text-violet-400">Sphere</span></span>
          </Link>
          <p className="text-slate-400 text-xs">Create your smart campus hub account</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@unisphere.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password * (Min 8 chars)</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Role & Dept row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors appearance-none"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty Coordinator</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. CS, EE"
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Interests (For recommendations) */}
          {role === 'Student' && (
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Interests (Comma separated)</label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="e.g. Coding, Music, Seminar, Tech, Sports"
                className="w-full px-3.5 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-4 text-sm">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
