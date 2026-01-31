
import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
  currentPin: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel, currentPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === currentPin) {
      onSuccess();
    } else {
      setError('Invalid Access PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Sukoon Base</h1>
          <p className="text-slate-500 text-sm font-medium">Internal Admin Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Access PIN</label>
            <input 
              type="password" 
              required
              autoFocus
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-2xl tracking-[0.5em] font-bold placeholder:tracking-normal placeholder:font-normal"
            />
          </div>

          {error && (
            <div className="text-rose-600 text-xs font-bold text-center bg-rose-50 py-3 rounded-xl border border-rose-100 animate-shake">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
            >
              Verify PIN
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full text-slate-400 hover:text-slate-600 text-sm font-bold py-2 transition-all"
            >
              Return to Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
