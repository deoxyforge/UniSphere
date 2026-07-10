import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, AlertCircle, Key, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectUser(user.role);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (searchParams.get('expired')) {
      setError('Your session has expired. Please login again.');
    }
  }, [searchParams]);

  const redirectUser = (role) => {
    if (role === 'Admin') navigate('/admin');
    else if (role === 'Faculty') navigate('/faculty');
    else navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    setLoading(true);
    setError('');
    try {
      const userData = await login(email, password);
      redirectUser(userData.role);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Autofill helpers for evaluation
  const handleQuickLogin = (demoRole) => {
    setError('');
    let demoEmail = '';
    switch (demoRole) {
      case 'student':
        demoEmail = 'student@unisphere.edu';
        break;
      case 'faculty':
        demoEmail = 'faculty@unisphere.edu';
        break;
      case 'admin':
        demoEmail = 'admin@unisphere.edu';
        break;
      default:
        break;
    }
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-panel p-8 relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-white mb-2 glow-text">
            <Calendar className="h-6 w-6 text-violet-500" />
            <span>Uni<span className="text-violet-400">Sphere</span></span>
          </Link>
          <p className="text-slate-400 text-xs">Sign in to your smart campus hub</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@unisphere.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            </div>
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

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2 text-sm">
            {loading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        {/* Demo Accounts Panel */}
        <div className="mt-8 pt-6 border-t border-brand-border/40">
          <div className="flex items-center gap-1.5 justify-center mb-3">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Accounts Quick Seed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('student')}
              className="px-2 py-1.5 text-[10px] bg-violet-950/40 hover:bg-violet-900/40 border border-violet-800/30 text-violet-300 rounded font-semibold transition-colors"
            >
              Student
            </button>
            <button
              onClick={() => handleQuickLogin('faculty')}
              className="px-2 py-1.5 text-[10px] bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/30 text-emerald-300 rounded font-semibold transition-colors"
            >
              Faculty
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="px-2 py-1.5 text-[10px] bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/30 text-blue-300 rounded font-semibold transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-400 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
