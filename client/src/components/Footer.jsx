import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-white font-bold text-lg">UniSphere <span className="text-purple-400 text-xs font-normal bg-purple-900/40 px-2 py-0.5 rounded-full ml-1">v1.0.0</span></div>
            <div className="text-slate-500 text-sm mt-1">Smart Campus Events & Clubs Hub</div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link to="/about" className="hover:text-purple-400 transition">About</Link>
            <Link to="/events" className="hover:text-purple-400 transition">Events</Link>
            <Link to="/clubs" className="hover:text-purple-400 transition">Clubs</Link>
            <Link to="/contact" className="hover:text-purple-400 transition">Contact</Link>
            <Link to="/privacy" className="hover:text-purple-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-purple-400 transition">Terms</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/deoxyforge/UniSphere" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition" aria-label="GitHub">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} UniSphere. Built by <span className="text-slate-400">deoxyforge</span>.
        </div>
      </div>
    </footer>
  );
}
