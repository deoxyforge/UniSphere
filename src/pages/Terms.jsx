export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">Terms of <span className="text-purple-400">Service</span></h1>
        <p className="text-slate-500 mb-8 text-sm">Last updated: July 2026</p>
        {[
          { title: '1. Acceptance', body: 'By using UniSphere, you agree to these terms. If you do not agree, you may not use the platform.' },
          { title: '2. User Responsibilities', body: 'You are responsible for maintaining the confidentiality of your account and for all activities under your account.' },
          { title: '3. Prohibited Conduct', body: 'You may not use the platform for any illegal purpose, to harass other users, or to disrupt campus activities.' },
          { title: '4. Event Content', body: 'Faculty and admins are responsible for the accuracy of event information they post on the platform.' },
          { title: '5. Termination', body: 'We reserve the right to terminate accounts that violate these terms without notice.' },
          { title: '6. Changes', body: 'We may update these terms at any time. Continued use of UniSphere constitutes acceptance of the new terms.' }
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
