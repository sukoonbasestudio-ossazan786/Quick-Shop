
import React, { useState } from 'react';
import { firebaseService } from '../services/firebase';

interface UserLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserLogin: React.FC<UserLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Password, 3: Reset Sent
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await firebaseService.signup(email, password);
      } else {
        await firebaseService.login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      await firebaseService.resetPassword(email);
      setStep(3);
      setError('');
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white md:bg-slate-50 p-4">
      <div className="w-full max-w-[450px] bg-white rounded-lg md:border md:border-slate-200 p-6 md:p-10 md:shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">Sukoon Base</span>
          </div>
          
          <h1 className="text-2xl font-normal text-slate-900 mb-2">
            {step === 3 ? 'Check your email' : (isSignup ? 'Create account' : 'Sign in')}
          </h1>
          <p className="text-slate-800 font-medium">
            {step === 3 ? 'Follow instructions to reset your password' : 'Use your Sukoon Account'}
          </p>
        </div>

        {step === 3 ? (
          <div className="space-y-6 text-center">
            <p className="text-sm text-slate-600">A password reset link has been sent to <strong>{email}</strong>.</p>
            <button 
              onClick={() => setStep(1)}
              className="text-blue-600 font-bold text-sm hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleNext} className="space-y-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="peer w-full bg-white border border-slate-300 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-transparent"
                    placeholder="Email or phone"
                    id="emailInput"
                  />
                  <label 
                    htmlFor="emailInput"
                    className="absolute left-4 top-1 text-xs text-blue-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 bg-white px-1 -ml-1 pointer-events-none"
                  >
                    Email or phone
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    type="button" 
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    {isSignup ? 'Sign in instead' : 'Create account'}
                  </button>
                </div>
                
                <div className="text-sm text-slate-600 leading-relaxed">
                  Not your computer? Use Guest mode to sign in privately. <a href="#" className="text-blue-600 font-bold">Learn more</a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full w-fit mb-4">
                  <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <span className="text-sm text-slate-700">{email}</span>
                  <button type="button" onClick={() => setStep(1)} className="ml-1 text-slate-400 hover:text-slate-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    autoFocus
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="peer w-full bg-white border border-slate-300 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-transparent"
                    placeholder="Enter your password"
                    id="passwordInput"
                  />
                  <label 
                    htmlFor="passwordInput"
                    className="absolute left-4 top-1 text-xs text-blue-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 bg-white px-1 -ml-1 pointer-events-none"
                  >
                    Enter your password
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

            <div className="flex items-center justify-between pt-4">
              <button 
                type="button" 
                onClick={onCancel}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Processing...' : (step === 1 ? 'Next' : (isSignup ? 'Sign up' : 'Login'))}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 flex gap-6 text-xs text-slate-500 font-medium">
        <a href="#" className="hover:text-slate-800">English (United States)</a>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-800">Help</a>
          <a href="#" className="hover:text-slate-800">Privacy</a>
          <a href="#" className="hover:text-slate-800">Terms</a>
        </div>
      </div>
    </div>
  );
};
