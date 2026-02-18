
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface TaskerActivationProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

const TaskerActivation: React.FC<TaskerActivationProps> = ({ userProfile, onUpdateProfile, onBack }) => {
  const settings = userProfile.taskerProfileSettings!;
  const [agreed, setAgreed] = useState(settings?.acceptedGuidelines || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRequest = () => {
    if (!agreed) {
      alert("Please accept the Excellence Guidelines first.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulation of manual submission
    setTimeout(() => {
      onUpdateProfile({
        ...userProfile,
        taskerProfileSettings: {
          ...settings,
          activationRequestStatus: 'submitted',
          acceptedGuidelines: true
        }
      });
      setIsSubmitting(false);
      alert("🚀 Profile submitted for activation! Kyla will review it shortly.");
    }, 1000);
  };

  const status = settings.isProfileActive ? 'active' : settings.activationRequestStatus;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in pb-32">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Activation Status</h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Manual Launch Protocol</p>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left: Global Status */}
        <div className="md:w-80 bg-slate-900 p-12 text-white flex flex-col justify-between">
           <div>
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl mb-8 shadow-2xl ${status === 'active' ? 'bg-green-500' : status === 'submitted' ? 'bg-orange-500' : 'bg-indigo-600'}`}>
                 {status === 'active' ? '🚀' : status === 'submitted' ? '⏳' : '🏁'}
              </div>
              <h3 className="text-2xl font-black mb-4 leading-tight">Business Status</h3>
              <div className="space-y-4">
                {status === 'active' ? (
                   <p className="text-sm text-green-400 font-bold uppercase tracking-widest">Profile is Live</p>
                ) : status === 'submitted' ? (
                   <p className="text-sm text-orange-400 font-bold uppercase tracking-widest">Awaiting Review</p>
                ) : (
                   <p className="text-sm text-indigo-400 font-bold uppercase tracking-widest">Ready to Launch</p>
                )}
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Only the platform owner can manually activate your professional business profile.
                </p>
              </div>
           </div>
           
           <div className="pt-12">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Verification Engine v3.0</p>
           </div>
        </div>

        {/* Right: Interaction Area */}
        <div className="flex-grow p-12 flex flex-col">
           {status === 'active' ? (
             <div className="text-center py-20 space-y-8">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto shadow-xl">
                   <i className="fa-solid fa-check-double"></i>
                </div>
                <div className="space-y-3">
                   <h4 className="text-3xl font-black text-slate-900">You are Operational!</h4>
                   <p className="text-slate-500 max-w-sm mx-auto">Your profile has been manually activated by the owner. You are now visible to the neighborhood.</p>
                </div>
                <button onClick={onBack} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Return to Settings</button>
             </div>
           ) : status === 'submitted' ? (
             <div className="text-center py-20 space-y-8">
                <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-5xl mx-auto shadow-xl animate-pulse">
                   <i className="fa-solid fa-user-clock"></i>
                </div>
                <div className="space-y-3">
                   <h4 className="text-3xl font-black text-slate-900">Under Review</h4>
                   <p className="text-slate-500 max-w-sm mx-auto">Kyla is reviewing your portfolio, services, and pricing. You will be activated once everything is verified.</p>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl inline-block mx-auto">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Review Time: 24 - 48 Hours</p>
                </div>
             </div>
           ) : (
             <div className="space-y-10">
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-slate-900">Launch Checklist</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Before you submit, please double check that your "My Tasker Profile" is fully filled out. 
                    The owner will verify your Bio, Services, and Schedule before activation.
                  </p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                         <i className="fa-solid fa-pen-nib"></i>
                      </div>
                      <div>
                         <p className="font-black text-slate-900">Profile Content Ready?</p>
                         <p className="text-xs text-slate-400 font-medium">Bio, Headline, and Photo are set up.</p>
                      </div>
                   </div>

                   <div className="pt-6">
                    <label className={`flex items-start gap-4 p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all ${agreed ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                       <input 
                        type="checkbox" 
                        checked={agreed} 
                        onChange={e => setAgreed(e.target.checked)} 
                        className="mt-1 w-5 h-5 accent-indigo-600" 
                       />
                       <div>
                          <p className="font-black text-indigo-900 leading-tight">Accept Excellence Guidelines</p>
                          <p className="text-xs text-indigo-700 mt-1">I promise to provide professional service and follow all safety protocols.</p>
                       </div>
                    </label>
                  </div>
                </div>

                <div className="pt-10 mt-auto border-t border-slate-100 flex flex-col gap-4">
                   <button 
                    disabled={isSubmitting || !agreed}
                    onClick={handleSubmitRequest}
                    className="w-full py-7 bg-indigo-600 text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                     {isSubmitting ? 'Transmitting...' : 'Submit Profile for Activation'}
                     {!isSubmitting && <i className="fa-solid fa-paper-plane"></i>}
                   </button>
                   <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">This starts the manual verification process.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TaskerActivation;
