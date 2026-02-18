
import React from 'react';
import { View, UserProfile } from '../types';

interface HeaderProps {
  setView: (view: View) => void;
  currentView: View;
  userProfile?: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ setView, currentView, userProfile }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-1 cursor-pointer group"
          onClick={() => setView('Home')}
        >
          <div className="skillio-logo text-2xl md:text-3xl flex items-baseline tracking-tight transition-transform group-hover:scale-105">
            <span style={{ color: '#ff6b6b' }}>s</span>
            <span style={{ color: '#feca57' }}>k</span>
            <span style={{ color: '#ff9ff3' }}>i</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#48dbfb' }}>i</span>
            <span style={{ color: '#1e293b' }}>o</span>
          </div>
        </div>

        <nav className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView('Home')}
              className={`font-semibold text-sm uppercase tracking-wider transition-all ${currentView === 'Home' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              Services
            </button>
            
            {userProfile?.providerStatus === 'approved' && (
              <button 
                onClick={() => setView('ProviderHub')}
                className={`font-black text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-xl border-2 transition-all ${currentView === 'ProviderHub' ? 'bg-indigo-600 text-white border-indigo-600' : 'text-indigo-600 border-indigo-100 hover:bg-indigo-50'}`}
              >
                Provider Hub
              </button>
            )}

            <button 
              onClick={() => setView('Contact')}
              className={`font-semibold text-sm uppercase tracking-wider transition-all ${currentView === 'Contact' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView('Admin')}
              className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm font-bold text-sm transition-all hover:border-indigo-500 hover:text-indigo-600 ${currentView === 'Admin' ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50' : 'text-slate-600'}`}
            >
              <i className="fa-solid fa-user-gear text-xs"></i>
              Owner
            </button>
            
            <button 
              onClick={() => setView('Settings')}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all hover:bg-slate-50 border-2 ${currentView === 'Settings' || currentView === 'Profile' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'}`}
            >
              <i className={`fa-solid fa-circle-user text-2xl ${currentView === 'Settings' || currentView === 'Profile' ? 'text-indigo-600' : 'text-slate-400'}`}></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
