
import React from 'react';
import { SUPPORT_LINKS } from '../constants';

export const Footer: React.FC = () => {
  const now = new Date();
  const day = now.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const isOnline = day >= 1 && day <= 4; // Mon-Thu

  return (
    <footer className="bg-white border-t border-emerald-100 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-emerald-900 tracking-tight">Quick Shop</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Delivering premium products right to your doorstep with Cash on Delivery convenience. Quality guaranteed.
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`}></div>
              <span className="text-sm font-semibold text-slate-700">
                Support Status: {isOnline ? 'Online' : 'Offline'}
              </span>
              <span className="text-xs text-slate-400 ml-1">
                ({isOnline ? 'Mon-Thu' : 'Fri-Sun'})
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Help Center</h4>
            <ul className="space-y-4">
              <li>
                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Male Support</div>
                <a 
                  href={`mailto:${SUPPORT_LINKS.maleEmail}`}
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  {SUPPORT_LINKS.maleEmail}
                </a>
              </li>
              <li>
                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Female Support</div>
                <a 
                  href={`https://snapchat.com/add/${SUPPORT_LINKS.femaleSnapchat}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Snapchat: {SUPPORT_LINKS.femaleSnapchat}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Shipping Information</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Track Your Order</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Quick Shop. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-400 grayscale opacity-50">
            {/* Payment Icons Placeholder */}
            <span className="text-[10px] font-bold border border-slate-300 px-2 py-0.5 rounded">VISA</span>
            <span className="text-[10px] font-bold border border-slate-300 px-2 py-0.5 rounded">MASTERCARD</span>
            <span className="text-[10px] font-bold border border-slate-300 px-2 py-0.5 rounded">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
