import { useState } from 'react';
import { Mail, Globe, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-slate-900 text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">Contact <span className="text-purple-400">Us</span></h1>
        <p className="text-slate-400 mb-10">Have questions, feedback, or need support? Reach out below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <a href="https://github.com/deoxyforge/UniSphere" target="_blank" rel="noopener noreferrer" className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-purple-500 transition flex items-center gap-4">
            <Globe className="w-8 h-8 text-slate-300" />
            <div><div className="font-semibold">GitHub</div><div className="text-slate-400 text-sm">deoxyforge/UniSphere</div></div>
          </a>
          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex items-center gap-4">
            <Mail className="w-8 h-8 text-purple-400" />
            <div><div className="font-semibold">Email</div><div className="text-slate-400 text-sm">admin@unisphere.campus</div></div>
          </div>
        </div>
        {!sent ? (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div><label className="text-sm text-slate-400 mb-1 block">Your Name</label><input required className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition" /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Email</label><input type="email" required className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition" /></div>
            <div><label className="text-sm text-slate-400 mb-1 block">Message</label><textarea required rows="4" className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition resize-none" /></div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" /> Send Message</button>
          </form>
        ) : (
          <div className="bg-green-900/30 border border-green-700 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <div className="font-bold text-green-400 text-lg">Message Sent!</div>
            <p className="text-slate-400 text-sm mt-2">We'll get back to you as soon as possible.</p>
          </div>
        )}
      </div>
    </div>
  );
}
