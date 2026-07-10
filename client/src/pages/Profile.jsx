import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, BookOpen, Tag, Save, AlertCircle, CheckCircle2, FileText, Code } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [interests, setInterests] = useState((user?.interests || []).join(', '));
  const [skills, setSkills] = useState((user?.skills || []).join(', '));
  const [biography, setBiography] = useState(user?.biography || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await updateProfile({
        name,
        department,
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        biography
      });
      setSuccess('Profile updated!');
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <div className="glass-panel p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-brand-border/30">
          <img
            src={user?.profileImage}
            alt="avatar"
            className="h-16 w-16 rounded-full border-2 border-violet-500"
          />
          <div>
            <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="text-[10px] px-2 py-0.5 mt-1 inline-block rounded bg-violet-600/30 text-violet-300 font-bold uppercase tracking-wider border border-violet-500/20">
              {user?.role}
            </span>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex gap-2"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />{success}</div>}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science" className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500" />
            </div>
          </div>

          {user?.role === 'Student' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Skills (comma-separated)</label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="JavaScript, React, Python" className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Interests (comma-separated)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="Coding, Music, Seminar" className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Biography / About Me</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <textarea value={biography} onChange={e => setBiography(e.target.value)} placeholder="Tell us about yourself..." rows="3" className="w-full pl-10 pr-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 text-sm mt-2">
            <Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
