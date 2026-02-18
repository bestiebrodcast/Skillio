
import React from 'react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack} 
          className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">About Us</h2>
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-50 rounded-full translate-y-1/2 -translate-x-1/2 -z-0"></div>
        
        <div className="p-10 md:p-16 relative z-10">
          <div className="skillio-logo text-4xl md:text-5xl flex items-baseline tracking-tight mb-12 justify-center md:justify-start">
            <span style={{ color: '#ff6b6b' }}>s</span>
            <span style={{ color: '#feca57' }}>k</span>
            <span style={{ color: '#ff9ff3' }}>i</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#48dbfb' }}>i</span>
            <span style={{ color: '#1e293b' }}>o</span>
          </div>

          <div className="space-y-8 text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
            <h3 className="text-2xl font-black text-slate-900 mb-6 border-l-4 border-indigo-600 pl-6">Our Story</h3>
            
            <p>
              <span className="font-black text-slate-900">Skillio</span> is a service platform created in Kenya to make everyday services simple, clear, and easy to book.
            </p>

            <p>
              The idea for Skillio came from a strong interest in entrepreneurship, creativity, and problem-solving from a young age. Over time, this interest grew into building a platform that brings together helpful services such as cleaning, tutoring, dog sitting, and book borrowing and more in one organized place.
            </p>

            <p>
              Skillio focuses on structure, transparency, and reliability, helping customers understand exactly what they are booking and how the service works.
            </p>

            <div className="pt-8 mt-12 border-t border-slate-100 flex flex-col md:flex-row items-center gap-8">
               <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-xl">
                  <i className="fa-solid fa-lightbulb"></i>
               </div>
               <p className="italic text-slate-500 font-bold text-center md:text-left">
                "Skillio represents innovation, responsibility, and the belief that good ideas can start early and grow with time."
               </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Innovation', icon: 'fa-bolt', color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Responsibility', icon: 'fa-shield-heart', color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Reliability', icon: 'fa-handshake', color: 'text-green-500', bg: 'bg-green-50' },
        ].map(val => (
          <div key={val.label} className="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm">
            <div className={`w-12 h-12 ${val.bg} ${val.color} rounded-2xl flex items-center justify-center text-xl mb-3`}>
              <i className={`fa-solid ${val.icon}`}></i>
            </div>
            <p className="font-black text-slate-900 text-sm uppercase tracking-widest">{val.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
