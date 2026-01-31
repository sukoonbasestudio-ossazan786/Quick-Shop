
import React from 'react';
import { Currency, ViewState } from '../types';

interface NavbarProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currentView: ViewState;
  onNavigate: (v: ViewState) => void;
  isAdminAuthenticated: boolean;
  isUserAuthenticated: boolean;
  onUserLoginToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currency, 
  setCurrency, 
  currentView, 
  onNavigate,
  isAdminAuthenticated,
  isUserAuthenticated,
  onUserLoginToggle
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-100 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('shop')}
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-emerald-900 tracking-tight leading-none">Quick Shop</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Sukoon Base Branch</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="bg-emerald-50 p-1 rounded-lg hidden md:flex items-center gap-1">
            {(['PKR', 'USD', 'AED'] as Currency[]).map((cur) => (
              <button 
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${currency === cur ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700 hover:bg-emerald-100'}`}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onUserLoginToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isUserAuthenticated ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              {isUserAuthenticated ? 'Hi, User' : 'Login'}
            </button>

            <button
              onClick={() => onNavigate(isAdminAuthenticated ? 'admin' : 'login')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'admin' 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {isAdminAuthenticated ? 'Admin' : 'Admin'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
