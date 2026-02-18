
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, Booking, Review, Service, TaskerService, Category, TaskerProfileSettings, ProviderApplication, PublishState } from '../types';

interface TaskerProfileEditorProps {
  userProfile: UserProfile;
  bookings: Booking[];
  reviews: Review[];
  services: Service[];
  applications: ProviderApplication[];
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

type ProfileTab = 'Identity' | 'Services' | 'Pricing' | 'Availability' | 'Performance' | 'Account';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TaskerProfileEditor: React.FC<TaskerProfileEditorProps> = ({ 
  userProfile, bookings, reviews, services, applications, onUpdateProfile, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Identity');
  
  const initialSettings = userProfile.taskerProfileSettings || {} as TaskerProfileSettings;

  // Local state for profile details (email/phone are part of UserProfile)
  const [localUser, setLocalUser] = useState({
    email: userProfile.email,
    phone: userProfile.phone
  });

  // Global fix: Scroll reset on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const [localSettings, setLocalSettings] = useState<TaskerProfileSettings>({
    displayName: initialSettings.displayName || userProfile.name,
    headline: initialSettings.headline || "Neighborhood Assistant",
    photoUrl: initialSettings.photoUrl || "",
    publicBio: initialSettings.publicBio || userProfile.bio || "Dedicated student entrepreneur.",
    serviceArea: initialSettings.serviceArea || userProfile.city || "Local Neighborhood",
    languages: initialSettings.languages || ['English'],
    isAgeEligible: initialSettings.isAgeEligible ?? false,
    isPubliclyVisible: initialSettings.isPubliclyVisible ?? true,
    weeklySchedule: initialSettings.weeklySchedule || "Mon-Fri: 4pm-7pm",
    customRates: initialSettings.customRates || {},
    experienceLevel: initialSettings.experienceLevel || 'Beginner',
    yearsExperience: initialSettings.yearsExperience || 0,
    specialStrengths: initialSettings.specialStrengths || [],
    certifications: initialSettings.certifications || "",
    experienceHighlights: initialSettings.experienceHighlights || [],
    workingStyle: initialSettings.workingStyle || "",
    introMessage: initialSettings.introMessage || "",
    pendingApproval: initialSettings.pendingApproval ?? false,
    offeredServices: initialSettings.offeredServices || [],
    availabilityGrid: initialSettings.availabilityGrid || DAYS.reduce((acc, day) => ({
      ...acc, [day]: { isClosed: false, start: '16:00', end: '19:00' }
    }), {}),
    blockedDates: initialSettings.blockedDates || [],
    blockedDateReasons: initialSettings.blockedDateReasons || {},
    isUnavailableMode: initialSettings.isUnavailableMode ?? false,
    acceptingNewBookings: initialSettings.acceptingNewBookings ?? true,
    preferredJobTypes: initialSettings.preferredJobTypes || [],
    isDeactivated: initialSettings.isDeactivated ?? false,
    tasker_submission_status: initialSettings.tasker_submission_status || 'draft',
    acceptedGuidelines: initialSettings.acceptedGuidelines || false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const adminFeedback = useMemo(() => {
    const userApp = applications.find(a => a.userId === userProfile.id);
    return userApp?.adminFeedback;
  }, [applications, userProfile.id]);

  const metrics = useMemo(() => {
    const myJobs = bookings.filter(b => b.providerId === userProfile.id);
    const completed = myJobs.filter(b => b.status === 'Completed').length;
    const earnings = myJobs.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.taskerAmount || 0), 0);
    return { completed, earnings };
  }, [bookings, userProfile.id]);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^(\+254|0)[17]\d{8}$/.test(phone.replace(/\s+/g, ''));

  const handleSave = () => {
    if (!isEmailValid(localUser.email)) {
      alert("Invalid email format.");
      return;
    }
    if (!isPhoneValid(localUser.phone)) {
      alert("Invalid Kenya phone number format.");
      return;
    }

    onUpdateProfile({ 
      ...userProfile, 
      email: localUser.email,
      phone: localUser.phone,
      taskerProfileSettings: localSettings 
    });
    setHasChanges(false);
    alert("Portfolio data synchronized!");
  };

  const updateService = (id: string, updates: Partial<TaskerService>) => {
    setLocalSettings({
      ...localSettings,
      offeredServices: localSettings.offeredServices.map(s => s.id === id ? { ...s, ...updates } : s)
    });
    setHasChanges(true);
  };

  const toggleDay = (day: string) => {
    setLocalSettings({
      ...localSettings,
      availabilityGrid: { ...localSettings.availabilityGrid, [day]: { ...localSettings.availabilityGrid[day], isClosed: !localSettings.availabilityGrid[day].isClosed } }
    });
    setHasChanges(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in pb-32">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><i className="fa-solid fa-chevron-left"></i></button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Manager</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Build your professional profile here.</p>
          </div>
        </div>
        {hasChanges && <button onClick={handleSave} className="px-6 md:px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl animate-scale-in">Sync Portfolio 💾</button>}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-inner overflow-hidden">
              {localSettings.photoUrl ? <img src={localSettings.photoUrl} className="w-full h-full object-cover" alt="" /> : <i className="fa-solid fa-user text-4xl text-slate-300"></i>}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">{localSettings.displayName}</h3>
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-8">{localSettings.headline}</p>
            <div className={`p-4 rounded-2xl border-2 ${localSettings.tasker_submission_status === 'approved' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400'} text-[10px] font-black uppercase tracking-widest`}>
              {localSettings.tasker_submission_status === 'approved' ? 'Active in Market' : 'Building Portfolio'}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-visible flex flex-col min-h-[600px]">
            <div className="flex border-b border-slate-50 bg-slate-50/30 p-2 overflow-x-auto no-scrollbar">
              {(['Identity', 'Services', 'Pricing', 'Availability', 'Performance', 'Account'] as ProfileTab[]).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-grow py-5 px-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all rounded-3xl ${activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
              ))}
            </div>

            <div className="p-8 md:p-12 flex-grow h-auto">
              
              {activeTab === 'Identity' && (
                <div className="animate-fade-in space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Public Name</label>
                        <input className="w-full px-8 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localSettings.displayName} onChange={e => { setLocalSettings({...localSettings, displayName: e.target.value}); setHasChanges(true); }} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Headline</label>
                        <input className="w-full px-8 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localSettings.headline} onChange={e => { setLocalSettings({...localSettings, headline: e.target.value}); setHasChanges(true); }} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Professional Email</label>
                        <input className="w-full px-8 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localUser.email} onChange={e => { setLocalUser({...localUser, email: e.target.value}); setHasChanges(true); }} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Phone Number</label>
                        <input className="w-full px-8 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localUser.phone} onChange={e => { setLocalUser({...localUser, phone: e.target.value}); setHasChanges(true); }} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Bio Narrative</label>
                      <textarea className="w-full p-8 rounded-[2rem] bg-slate-50 min-h-[150px] outline-none border-2 border-transparent focus:border-indigo-600 font-medium" value={localSettings.publicBio} onChange={e => { setLocalSettings({...localSettings, publicBio: e.target.value}); setHasChanges(true); }} />
                   </div>
                </div>
              )}

              {activeTab === 'Services' && (
                <div className="animate-fade-in space-y-10">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-black text-slate-900">Module Definitions</h4>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{localSettings.offeredServices.length} Total Services</p>
                   </div>

                   <div className="space-y-4">
                      {localSettings.offeredServices.map(os => (
                        <div key={os.id} className="p-8 rounded-[2.5rem] border-2 bg-slate-50 border-slate-100 hover:border-indigo-100 transition-all">
                           <div className="flex flex-col md:flex-row justify-between gap-6">
                              <div className="flex-grow">
                                 <h5 className="text-xl font-black text-slate-900 mb-2">{os.title}</h5>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{os.category}</p>
                                 <textarea className="w-full p-4 bg-white border border-slate-50 rounded-xl outline-none text-xs font-medium" value={os.description} onChange={e => updateService(os.id, { description: e.target.value })} />
                              </div>
                           </div>
                        </div>
                      ))}
                      {localSettings.offeredServices.length === 0 && <p className="text-center py-20 text-slate-400 italic">No services currently added. Apply for more categories to expand!</p>}
                   </div>
                </div>
              )}

              {activeTab === 'Pricing' && (
                <div className="animate-fade-in space-y-8">
                   {localSettings.offeredServices.map(os => (
                    <div key={os.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-200">
                       <div className="flex justify-between items-center mb-8">
                          <div><h5 className="text-xl font-black text-slate-900">{os.title}</h5><p className="text-[10px] font-black text-indigo-500 uppercase">{os.category}</p></div>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex-grow"><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Set Rate (KES)</label><input type="number" className="w-full px-6 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 font-black text-xl shadow-sm bg-white" value={os.price} onChange={e => updateService(os.id, { price: parseInt(e.target.value) || 0 })} /></div>
                          <div className="w-32"><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Type</label><select className="w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 font-bold text-xs bg-white shadow-sm" value={os.priceType} onChange={e => updateService(os.id, { priceType: e.target.value as any })}><option value="per_hour">/ Hr</option><option value="per_task">/ Task</option></select></div>
                       </div>
                    </div>
                   ))}
                </div>
              )}

              {activeTab === 'Availability' && (
                <div className="animate-fade-in space-y-12">
                   <div className="bg-slate-900 p-8 md:p-10 rounded-[3rem] text-white shadow-xl">
                      <h5 className="text-2xl font-black mb-8">Service Hours</h5>
                      <div className="space-y-4">
                         {DAYS.map(day => (
                           <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10">
                              <button onClick={() => toggleDay(day)} className={`w-32 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${!localSettings.availabilityGrid[day].isClosed ? 'bg-indigo-600' : 'bg-slate-700'}`}>{day}</button>
                              {!localSettings.availabilityGrid[day].isClosed && (
                                <div className="flex items-center gap-4"><input type="time" className="bg-transparent text-white font-black text-lg outline-none" value={localSettings.availabilityGrid[day].start} onChange={e => {setLocalSettings({...localSettings, availabilityGrid: {...localSettings.availabilityGrid, [day]: {...localSettings.availabilityGrid[day], start: e.target.value}}}); setHasChanges(true);}} /><span className="text-slate-500 uppercase text-xs">to</span><input type="time" className="bg-transparent text-white font-black text-lg outline-none" value={localSettings.availabilityGrid[day].end} onChange={e => {setLocalSettings({...localSettings, availabilityGrid: {...localSettings.availabilityGrid, [day]: {...localSettings.availabilityGrid[day], end: e.target.value}}}); setHasChanges(true);}} /></div>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}
              
              {activeTab === 'Performance' && (
                <div className="animate-fade-in space-y-12">
                   {adminFeedback && <div className="p-10 bg-indigo-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"><div className="relative z-10"><h5 className="text-xl font-black mb-4">Owner Guidance</h5><p className="italic font-medium leading-relaxed text-indigo-100">"{adminFeedback}"</p></div></div>}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100"><p className="text-[8px] font-black uppercase mb-3 opacity-60">Jobs Done</p><p className="text-5xl font-black">{metrics.completed}</p></div>
                      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white"><p className="text-[8px] font-black uppercase mb-3 opacity-60">Earnings</p><p className="text-xl font-black">KES {metrics.earnings.toLocaleString()}</p></div>
                   </div>
                </div>
              )}

              {activeTab === 'Account' && (
                <div className="animate-fade-in space-y-12">
                   <div className="p-10 rounded-[3.5rem] border-2 bg-red-50 border-red-100">
                      <h5 className="text-xl font-black text-slate-900 mb-2">Portfolio Management</h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mb-8">Changes reflect in the marketplace once synced. You can temporarily hide your profile here.</p>
                      <button onClick={() => { setLocalSettings({...localSettings, isDeactivated: !localSettings.isDeactivated}); setHasChanges(true); }} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest ${localSettings.isDeactivated ? 'bg-green-600 text-white' : 'bg-red-50 text-red-600'}`}>{localSettings.isDeactivated ? 'Enable Profile' : 'Disable Profile'}</button>
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskerProfileEditor;
