import React, { useEffect, useState } from 'react';
import { eventAPI, clubAPI, authAPI } from '../services/api';
import StatCard from '../components/StatCard';
import { Calendar, Users, Award, ShieldAlert, Check, X, Plus, Trash2 } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Club Creation states
  const [createClubOpen, setCreateClubOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubDesc, setClubDesc] = useState('');
  const [clubCategory, setClubCategory] = useState('Tech');
  const [clubCoordinator, setClubCoordinator] = useState('');
  const [clubLogo, setClubLogo] = useState(null);
  const [clubError, setClubError] = useState('');

  const loadAdminData = async () => {
    try {
      const allEvents = await eventAPI.getAll({ status: 'pending' }); // pending approvals
      const allClubs = await clubAPI.getAll();
      
      // Get all approved events just to count them
      const approvedEvents = await eventAPI.getAll({ status: 'approved' });
      
      // Fetch users from API (Create a custom call since it's admin only, or query custom)
      // Since we have a mock DB we can fetch users by calling GET /api/auth/profile if we adjust, 
      // but wait, we need a list of users. Let's make sure our backend has an admin-only user list query, or we define it in authRoutes: router.get('/users', auth, verifyAdmin, ...)
      // Wait, did we add /api/auth/users to backend? Let's check! No, we didn't add it to routes yet.
      // But we can easily fetch it or write a simple route. Let's look at authRoutes:
      // Oh, let's see. In authController, we didn't define a getusers, but we can write a simple custom API.get('/auth/users') or just mock it locally based on users data. 
      // Actually, let's look at if we can call API.get('/auth/users'). Let's implement /api/auth/users in our backend authController. It is very simple to add!
      // Let's first implement the admin dashboard using a fetch to `/auth/users`.
      
      const usersRes = await API.get('/auth/users');
      setUsers(usersRes.data);
      setEvents(allEvents.data);
      setClubs(allClubs.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveEvent = async (id) => {
    try {
      await eventAPI.approve(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      loadAdminData(); // Refresh counts
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleRejectEvent = async (id) => {
    try {
      await eventAPI.reject(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      loadAdminData();
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  const handleDeleteClub = async (id) => {
    if (window.confirm('Are you sure you want to disband this club?')) {
      try {
        await clubAPI.delete(id);
        setClubs(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to disband club.');
      }
    }
  };

  const handleCreateClubSubmit = async (e) => {
    e.preventDefault();
    setClubError('');

    if (!clubName || !clubDesc || !clubCoordinator) {
      return setClubError('Please fill in all fields.');
    }

    const formData = new FormData();
    formData.append('name', clubName);
    formData.append('description', clubDesc);
    formData.append('category', clubCategory);
    formData.append('coordinator', clubCoordinator);
    if (clubLogo) {
      formData.append('logo', clubLogo);
    }

    try {
      await clubAPI.create(formData);
      setCreateClubOpen(false);
      setClubName('');
      setClubDesc('');
      setClubCoordinator('');
      setClubLogo(null);
      loadAdminData();
    } catch (err) {
      setClubError(err.response?.data?.message || 'Failed to create club. Coordinator must be a valid Faculty ID.');
    }
  };

  const facultyUsers = users.filter(u => u.role === 'Faculty');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6 animate-pulse">
        <div className="h-10 bg-brand-cardLight/30 w-1/4 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
          <div className="h-28 bg-brand-cardLight/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-brand-border/30">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            System Administration Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Approve pending campus events, dispatch new student clubs, and monitor users.
          </p>
        </div>
        
        <button
          onClick={() => setCreateClubOpen(true)}
          className="btn-primary text-xs py-2.5 px-4"
        >
          <Plus className="h-4 w-4" />
          Create New Club
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={users.length} icon={Users} description="Registered accounts" colorClass="text-blue-400" />
        <StatCard title="Total Clubs" value={clubs.length} icon={Award} description="Active campus organizations" colorClass="text-emerald-400" />
        <StatCard title="Pending Approvals" value={events.length} icon={ShieldAlert} description="Events requiring audit" colorClass="text-violet-400" />
        <StatCard title="Faculty Hosts" value={facultyUsers.length} icon={Calendar} description="Club event coordinators" colorClass="text-pink-400" />
      </div>

      {/* Main Grid: Approvals, Clubs, Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Approvals & Clubs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Event Approvals */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Pending Event Approvals ({events.length})
            </h3>
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">No events currently pending approval. All caught up!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.map((e) => (
                  <div key={e._id} className="p-4 bg-brand-dark/45 border border-brand-border/40 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[9px] mb-2">
                        <span className="text-violet-300 font-bold uppercase tracking-wider bg-violet-900/30 px-1.5 py-0.5 rounded">
                          {e.category}
                        </span>
                        <span className="text-slate-500">{e.date} • {e.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{e.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4">{e.description}</p>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-brand-border/20 mt-auto">
                      <button
                        onClick={() => handleApproveEvent(e._id)}
                        className="btn-success text-[10px] flex-1 py-1.5 flex justify-center items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectEvent(e._id)}
                        className="btn-danger text-[10px] flex-1 py-1.5 flex justify-center items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manage Clubs */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-4">Manage Clubs ({clubs.length})</h3>
            {clubs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No clubs seeded in the database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-border/40 text-slate-400 font-bold pb-2">
                      <th className="pb-2">Club Name</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Coordinator</th>
                      <th className="pb-2">Members</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.map((c) => (
                      <tr key={c._id} className="border-b border-brand-border/10">
                        <td className="py-2.5 font-bold text-white">{c.name}</td>
                        <td className="py-2.5 text-slate-300">{c.category}</td>
                        <td className="py-2.5 text-slate-400">Dr. {c.coordinator?.name || 'Faculty'}</td>
                        <td className="py-2.5 text-slate-400">{c.members?.length || 0}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteClub(c._id)}
                            className="p-1.5 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded border border-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Users list */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-white mb-4">User Directory ({users.length})</h3>
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {users.map((u) => (
              <div key={u._id} className="p-3 bg-brand-dark/45 border border-brand-border/40 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={u.profileImage} alt="avatar" className="h-8 w-8 rounded-full border border-violet-500 shrink-0" />
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{u.department || 'No Dept'}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                  u.role === 'Admin'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : u.role === 'Faculty'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal: Create Club */}
      {createClubOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md glass-panel bg-brand-card p-6 border border-brand-border/60">
            <button
              onClick={() => setCreateClubOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-brand-cardLight transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-6 text-center">Dispatch New Club</h3>

            {clubError && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{clubError}</span>
              </div>
            )}

            <form onSubmit={handleCreateClubSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Club Name</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="e.g. ByteCraft Code Club"
                  className="w-full px-3.5 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={clubDesc}
                  onChange={(e) => setClubDesc(e.target.value)}
                  placeholder="Brief summary of club goals..."
                  rows="3"
                  className="w-full px-3.5 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={clubCategory}
                    onChange={(e) => setClubCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Arts">Arts</option>
                    <option value="Sports">Sports</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Coordinator (Faculty ID)</label>
                  <select
                    value={clubCoordinator}
                    onChange={(e) => setClubCoordinator(e.target.value)}
                    className="w-full px-3.5 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                    required
                  >
                    <option value="">Select Faculty</option>
                    {facultyUsers.map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Club Logo (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setClubLogo(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-violet-600/10 file:text-violet-400 hover:file:bg-violet-600/20"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 text-sm mt-4"
              >
                Create Club
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
