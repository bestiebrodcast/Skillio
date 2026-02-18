
import React, { useState } from 'react';
import { UserProfile, Booking } from '../types';

interface CustomerProfileProps {
  userProfile: UserProfile;
  bookings: Booking[];
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

type Tab = 'Overview' | 'Contact' | 'Preferences' | 'Bookings' | 'Notes' | 'Notifications' | 'Account';

const CustomerProfile: React.FC<CustomerProfileProps> = ({ userProfile, bookings, onUpdateProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [localProfile, setLocalProfile] = useState(userProfile);

  const tabs: Tab[] = ['Overview', 'Contact', 'Preferences', 'Bookings', 'Notes', 'Notifications', 'Account'];

  const handleSave = () => {
    onUpdateProfile(localProfile);
    alert("Profile synchronized successfully!");
  };

  const myBookings = bookings.filter(b => b.customerEmail === userProfile.email);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Profile</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 space-y-1">
          {tabs.map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === t ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}
            >
              <i className={`fa-solid ${t === 'Overview' ? 'fa-user' : t === 'Contact' ? 'fa-location-dot' : t === 'Preferences' ? 'fa-sliders' : t === 'Bookings' ? 'fa-calendar-days' : t === 'Notes' ? 'fa-comment-dots' : t === 'Notifications' ? 'fa-bell' : 'fa-gear'} w-5`}></i>
              {t}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 min-h-[500px] flex flex-col">
          
          {activeTab === 'Overview' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black">
                  {localProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{localProfile.name}</h3>
                  <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Skillio Member since {localProfile.joinedDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Member Name</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localProfile.name} onChange={e => setLocalProfile({...localProfile, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Email</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localProfile.email} readOnly />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Contact' && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localProfile.phone} onChange={e => setLocalProfile({...localProfile, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Address</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localProfile.address} onChange={e => setLocalProfile({...localProfile, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Neighborhood</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={localProfile.city} onChange={e => setLocalProfile({...localProfile, city: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'Preferences' && (
            <div className="animate-fade-in space-y-6">
              <h4 className="font-black text-slate-900 mb-4">Service Delivery Preferences</h4>
              <div className="space-y-4">
                {['Morning', 'Afternoon', 'Evening'].map(time => (
                  <button 
                    key={time}
                    onClick={() => setLocalProfile({...localProfile, preferences: {...localProfile.preferences, preferredTime: time}})}
                    className={`w-full p-6 rounded-2xl border-2 text-left flex justify-between items-center transition-all ${localProfile.preferences.preferredTime === time ? 'border-indigo-600 bg-indigo-50 font-black text-indigo-600' : 'border-slate-50 bg-slate-50 font-bold text-slate-500'}`}
                  >
                    {time} Visitation
                    {localProfile.preferences.preferredTime === time && <i className="fa-solid fa-circle-check"></i>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Bookings' && (
            <div className="animate-fade-in">
              <h4 className="font-black text-slate-900 mb-6">Your Recent History</h4>
              {myBookings.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <i className="fa-solid fa-calendar-xmark text-4xl text-slate-200 mb-4"></i>
                  <p className="font-bold text-slate-400">No bookings found for this email.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map(b => (
                    <div key={b.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="font-black text-slate-900">{b.serviceTitle}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.date} • {b.id}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${b.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Notes' && (
            <div className="animate-fade-in space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gate / Security Code</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" placeholder="E.g. #1234" value={localProfile.notes.gateCode} onChange={e => setLocalProfile({...localProfile, notes: {...localProfile.notes, gateCode: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pet Information</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold" placeholder="E.g. Friendly dog inside" value={localProfile.notes.petInfo} onChange={e => setLocalProfile({...localProfile, notes: {...localProfile.notes, petInfo: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">General Instructions for Kyla</label>
                <textarea className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-bold min-h-[120px]" value={localProfile.notes.generalInstructions} onChange={e => setLocalProfile({...localProfile, notes: {...localProfile.notes, generalInstructions: e.target.value}})} />
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                <div><p className="font-black text-slate-900">Email Updates</p><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Receive receipts and status logs</p></div>
                <button onClick={() => setLocalProfile({...localProfile, preferences: {...localProfile.preferences, newsletter: !localProfile.preferences.newsletter}})} className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${localProfile.preferences.newsletter ? 'bg-indigo-600' : 'bg-slate-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${localProfile.preferences.newsletter ? 'translate-x-6' : ''}`}></div></button>
              </div>
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                <div><p className="font-black text-slate-900">Service Reminders</p><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">24-hour visit alerts</p></div>
                <button onClick={() => setLocalProfile({...localProfile, preferences: {...localProfile.preferences, serviceReminders: !localProfile.preferences.serviceReminders}})} className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${localProfile.preferences.serviceReminders ? 'bg-indigo-600' : 'bg-slate-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${localProfile.preferences.serviceReminders ? 'translate-x-6' : ''}`}></div></button>
              </div>
            </div>
          )}

          {activeTab === 'Account' && (
            <div className="animate-fade-in space-y-8">
              <div className="p-8 border-2 border-red-50 bg-red-50/20 rounded-[2rem]">
                 <h4 className="font-black text-red-600 mb-2">Danger Zone</h4>
                 <p className="text-sm text-slate-500 font-medium mb-6">Once you delete your account, there is no going back. All booking history will be purged.</p>
                 <button className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Delete Account</button>
              </div>
            </div>
          )}

          {activeTab !== 'Bookings' && (
            <button 
              onClick={handleSave}
              className="mt-auto w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
            >
              Synchronize Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
