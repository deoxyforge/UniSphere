import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: <CheckCircle className="w-5 h-5 text-green-400" />, error: <XCircle className="w-5 h-5 text-red-400" />, info: <Info className="w-5 h-5 text-blue-400" /> };
  const borders = { success: 'border-green-700', error: 'border-red-700', info: 'border-blue-700' };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-start gap-3 bg-slate-800 border ${borders[t.type] || borders.success} rounded-xl px-4 py-3 shadow-xl`}>
            {icons[t.type] || icons.success}
            <span className="text-sm text-slate-200 flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-slate-500 hover:text-white transition"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
