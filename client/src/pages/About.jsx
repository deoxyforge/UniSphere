import { Globe, Mail, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-3">About <span className="text-purple-400">UniSphere</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Smart Campus Events & Clubs Hub — connecting students, clubs, and faculty at your university.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <BookOpen className="w-8 h-8 text-purple-400 mb-3" />
            <h2 className="text-xl font-bold mb-2">What is UniSphere?</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              UniSphere is a full-stack campus management platform that helps students discover events, join clubs, and track their participation — all in one place. Faculty can create and manage events, while admins have full oversight of campus activities.
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <Mail className="w-8 h-8 text-blue-400 mb-3" />
            <h2 className="text-xl font-bold mb-2">Key Features</h2>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• AI-powered event recommendations</li>
              <li>• Club management & membership</li>
              <li>• QR-based attendance tracking</li>
              <li>• Smart search across events & clubs</li>
              <li>• Role-based dashboards (Student, Faculty, Admin)</li>
              <li>• Real-time notifications</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 to-slate-800 rounded-2xl p-8 border border-purple-800/30 text-center">
          <h2 className="text-2xl font-bold mb-2">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Axios'].map(t => (
              <span key={t} className="bg-slate-700 px-3 py-1 rounded-full text-sm text-slate-300">{t}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <a href="https://github.com/deoxyforge/UniSphere" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <Globe className="w-5 h-5" /> GitHub Repository
          </a>
          <Link to="/contact" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <Mail className="w-5 h-5" /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
