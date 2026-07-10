export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">Privacy <span className="text-purple-400">Policy</span></h1>
        <p className="text-slate-500 mb-8 text-sm">Last updated: July 2026</p>
        {[
          { title: '1. Data Collection', body: 'We collect your name, email, department, and campus activity data to provide a personalized experience. We do not sell your data to third parties.' },
          { title: '2. Data Usage', body: 'Your data is used to display your profile, generate event recommendations, track attendance, and provide dashboard insights.' },
          { title: '3. Storage & Security', body: 'All data is securely stored on MongoDB Atlas with encrypted connections. Passwords are hashed before storage.' },
          { title: '4. Cookies', body: 'We use localStorage for authentication tokens. No tracking cookies are used.' },
          { title: '5. Your Rights', body: 'You can update or delete your profile information at any time from the Profile page. Contact an admin for full account deletion.' },
          { title: '6. Contact', body: 'For privacy concerns, contact the system administrator through the Contact page.' }
        ].map(s => (
          <div key={s.title} className="mb-6">
            <h2 className="text-lg font-bold text-purple-300 mb-1">{s.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
