
import React from 'react';
import { View, UserProfile } from '../types';

interface SettingsProps {
  onNavigate: (view: View) => void;
  onBack: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate, onBack, userProfile, onUpdateProfile }) => {
  const isApprovedProvider = userProfile.providerStatus === 'approved';
  const isApplied = userProfile.providerStatus === 'applied';
  const isChangesRequired = userProfile.providerStatus === 'changes_required';
  const settings = userProfile.taskerProfileSettings;

  const handleSubmitToGoLive = () => {
    if (settings) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        taskerProfileSettings: {
          ...settings,
          tasker_submission_status: 'submitted'
        }
      };
      onUpdateProfile(updatedProfile);
      alert("🚀 Services submitted! Kyla will review your profile to go live.");
    }
  };

  const mainOptions = [
    { 
      id: 'profile', 
      label: 'My Profile', 
      desc: 'Contact info, preferences, and locations.', 
      icon: 'fa-id-card', 
      color: 'bg-indigo-100 text-indigo-600',
      action: () => onNavigate('Profile')
    },
    { 
      id: 'privacy', 
      label: 'Privacy & Safety', 
      desc: 'Learn how we protect your information.', 
      icon: 'fa-shield-halved', 
      color: 'bg-green-100 text-green-600',
      action: () => onNavigate('PrivacySafetyCenter')
    },
    { 
      id: 'support', 
      label: 'Help & Support', 
      desc: 'Talk to Rumi, find FAQs, and get assistance.', 
      icon: 'fa-circle-question', 
      color: 'bg-blue-100 text-blue-600',
      action: () => onNavigate('SupportCenter')
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-slate-900">Settings</h2>
        <button onClick={onBack} className="text-slate-400 hover:text-slate-900 transition-colors">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="space-y-4">
        {/* UNIFIED TASKER STATUS SYSTEM */}
        {isApprovedProvider && settings && (
          <div className="mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">Professional Launch Status</p>
            
            {settings.tasker_submission_status === 'approved' ? (
              <div className="w-full p-10 rounded-[3rem] bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-200 animate-scale-in">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                    <i className="fa-solid fa-face-laugh-beam"></i>
                  </div>
                  <h3 className="text-2xl font-black mb-2">Your profile has been approved and is now live!</h3>
                  <p className="text-green-50 font-medium text-sm max-w-xs mx-auto">Your business is now fully operational and visible to the neighborhood.</p>
                </div>
              </div>
            ) : settings.tasker_submission_status === 'submitted' ? (
              <div className="w-full p-8 rounded-[2.5rem] bg-orange-50 border-2 border-orange-200 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fa-solid fa-hourglass-half animate-pulse"></i>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg">Portfolio Under Review</p>
                    <p className="text-sm font-medium text-orange-700">Kyla is reviewing your services and pricing.</p>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleSubmitToGoLive}
                className="w-full p-8 rounded-[2.5rem] bg-indigo-600 shadow-xl flex items-center justify-between group transition-all hover:scale-[1.02] border-2 border-transparent active:scale-95"
              >
                <div className="flex items-center gap-5 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                    <i className="fa-solid fa-rocket"></i>
                  </div>
                  <div>
                    <p className="font-black text-lg leading-tight text-white">Submit Services to Go Live</p>
                    <p className="text-sm font-medium text-indigo-100 opacity-90">Ready for neighbors? Submit your portfolio!</p>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right text-white group-hover:translate-x-1 transition-all"></i>
              </button>
            )}
          </div>
        )}

        {isChangesRequired && (
           <button 
              onClick={() => onNavigate('ApplyProvider')}
              className="w-full bg-orange-50 p-8 rounded-[2.5rem] border-2 border-orange-200 mb-4 flex items-center justify-between group hover:bg-orange-100 transition-all"
           >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-user-pen"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-lg">Changes Required</p>
                  <p className="text-sm text-orange-700 font-medium">Owner has requested revisions to your identity application.</p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-orange-400 group-hover:translate-x-2 transition-all"></i>
           </button>
        )}

        {isApplied && !isApprovedProvider && !isChangesRequired && (
           <div className="w-full bg-slate-100 p-8 rounded-[2.5rem] border border-slate-200 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl text-slate-400">
                  <i className="fa-solid fa-id-card animate-pulse"></i>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">Identity Review</p>
                  <p className="text-sm text-slate-500 font-medium">Phase 1: Owner is verifying your application.</p>
                </div>
              </div>
           </div>
        )}

        {isApprovedProvider && (
          <div className="space-y-4 mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">Tasker Tools</p>
            <button 
              onClick={() => onNavigate('ProviderHub')}
              className="w-full bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between group transition-all hover:bg-black"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <div>
                  <p className="font-black text-white text-lg">Work Dashboard</p>
                  <p className="text-sm text-slate-400 font-medium group-hover:text-slate-300">
                    Active bookings & job management.
                  </p>
                </div>
              </div>
              <i className="fa-solid fa-arrow-right text-white group-hover:translate-x-1 transition-all"></i>
            </button>

            <button 
              onClick={() => onNavigate('TaskerProfile')}
              className="w-full bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between group transition-all hover:bg-indigo-700"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-pencil"></i>
                </div>
                <div>
                  <p className="font-black text-white text-lg">Edit My Portfolio</p>
                  <p className="text-sm text-indigo-100 font-medium group-hover:text-white">
                    Bio, services, and rates.
                  </p>
                </div>
              </div>
              <i className="fa-solid fa-gear text-white group-hover:rotate-90 transition-all duration-500"></i>
            </button>
          </div>
        )}

        {!isApprovedProvider && !isApplied && !isChangesRequired && (
          <button 
            onClick={() => onNavigate('ApplyProvider')}
            className="w-full bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between group transition-all hover:bg-black mb-4"
          >
            <div className="flex items-center gap-5 text-left">
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <div>
                <p className="font-black text-white text-lg">Apply as Tasker</p>
                <p className="text-sm text-slate-400 font-medium group-hover:text-slate-300">
                  Join the professional talent pool.
                </p>
              </div>
            </div>
            <i className="fa-solid fa-arrow-right text-white group-hover:translate-x-1 transition-all"></i>
          </button>
        )}

        <div className="pt-4 pb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">Standard Settings</p>
        </div>

        {mainOptions.map(opt => (
          <button 
            key={opt.id}
            onClick={opt.action}
            className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:shadow-md hover:border-indigo-100"
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110`}>
                <i className={`fa-solid ${opt.icon}`}></i>
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 text-lg">{opt.label}</p>
                <p className="text-sm text-slate-400 font-medium">{opt.desc}</p>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Settings;
