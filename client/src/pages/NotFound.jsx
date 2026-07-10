import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4">
      <Frown className="w-24 h-24 text-purple-400 mb-6" />
      <h1 className="text-8xl font-extrabold text-purple-400 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-slate-400 text-center max-w-md mb-8">
        Looks like this page doesn't exist on the UniSphere campus. Maybe it moved, or you took a wrong turn.
      </p>
      <Link to="/" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-semibold">
        <Home className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
