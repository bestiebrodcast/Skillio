
import React from 'react';
import { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="skillio-logo text-3xl flex items-baseline tracking-tight mb-6 cursor-pointer" onClick={() => onNavigate('Home')}>
            <span style={{ color: '#ff6b6b' }}>s</span>
            <span style={{ color: '#feca57' }}>k</span>
            <span style={{ color: '#ff9ff3' }}>i</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#48dbfb' }}>i</span>
            <span style={{ color: '#ffffff' }}>o</span>
          </div>
          <p className="text-slate-400 font-medium leading-relaxed">
            The neighborhood platform where student talent meets local opportunity. Empowering the next generation of business leaders.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 w-full md:w-auto">
           <div className="flex flex-col gap-4">
             <span className="text-white font-bold text-xs uppercase tracking-[0.2em]">Explore</span>
             <button onClick={() => onNavigate('Home')} className="text-left hover:text-white transition-colors text-sm font-medium">Services</button>
             <button onClick={() => onNavigate('AboutUs')} className="text-left hover:text-white transition-colors text-sm font-medium">Our Story</button>
             <button onClick={() => onNavigate('ApplyProvider')} className="text-left text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-black uppercase tracking-widest">Offer Services</button>
           </div>
           <div className="flex flex-col gap-4">
             <span className="text-white font-bold text-xs uppercase tracking-[0.2em]">Platform</span>
             <button onClick={() => onNavigate('Admin')} className="text-left hover:text-white transition-colors text-sm font-medium">Owner Dash</button>
             <button onClick={() => onNavigate('PrivacySafetyCenter')} className="text-left hover:text-white transition-colors text-sm font-medium">Safety</button>
             <button onClick={() => onNavigate('PrivacySafetyCenter')} className="text-left hover:text-white transition-colors text-sm font-medium">Privacy</button>
           </div>
           <div className="flex flex-col gap-4">
             <span className="text-white font-bold text-xs uppercase tracking-[0.2em]">Social</span>
             <div className="flex gap-4 text-lg">
               <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
               <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-tiktok"></i></a>
             </div>
           </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-600">
        <p>© {new Date().getFullYear()} Skillio. Building the future of work.</p>
        <p className="flex items-center gap-2">Designed by Kyla <i className="fa-solid fa-heart text-red-500"></i></p>
      </div>
    </footer>
  );
};

export default Footer;
