
import React, { useState } from 'react';

interface PrivacySafetyCenterProps {
  onBack: () => void;
}

type Section = 'Main' | 'PrivacyOverview' | 'DataCollected' | 'LocationSafety' | 'FamilySafety' | 'ServiceGuidelines' | 'StorageControl' | 'Contact';

const PrivacySafetyCenter: React.FC<PrivacySafetyCenterProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<Section>('Main');

  const renderHeader = (title: string) => (
    <div className="flex items-center gap-4 mb-10">
      <button 
        onClick={() => setActiveSection('Main')} 
        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      {activeSection === 'Main' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-12">
             <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Privacy & Safety Hub</h2>
          </div>

          <p className="text-slate-500 font-medium mb-10 max-w-2xl leading-relaxed">
            Your trust is our most important priority. We believe in being open and clear about how Skillio protects you and your information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'PrivacyOverview', label: 'User Privacy Overview', desc: 'Our commitment to you.', icon: 'fa-user-shield', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'DataCollected', label: 'Data Collected', desc: 'What we know and why.', icon: 'fa-database', color: 'text-blue-600', bg: 'bg-blue-50' },
              { id: 'LocationSafety', label: 'Location & Address Safety', desc: 'Keeping your home secure.', icon: 'fa-house-lock', color: 'text-red-600', bg: 'bg-red-50' },
              { id: 'FamilySafety', label: 'Child & Family Safety', desc: 'Protocols for young users.', icon: 'fa-people-roof', color: 'text-green-600', bg: 'bg-green-50' },
              { id: 'ServiceGuidelines', label: 'Service Safety Guidelines', desc: 'Rules for safe visits.', icon: 'fa-handshake-angle', color: 'text-orange-600', bg: 'bg-orange-50' },
              { id: 'StorageControl', label: 'Data Storage & Control', desc: 'Your data, your power.', icon: 'fa-gear', color: 'text-slate-600', bg: 'bg-slate-50' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-start gap-6 transition-all hover:shadow-md hover:border-indigo-100 group text-left"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">{item.label}</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">{item.desc}</p>
                </div>
              </button>
            ))}
            
            <button 
              onClick={() => setActiveSection('Contact')}
              className="md:col-span-2 bg-slate-900 p-8 rounded-[3rem] text-white flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <p className="font-black text-lg">Privacy Concerns?</p>
                  <p className="text-sm text-slate-400 font-medium">Contact our safety team directly.</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-500 mr-4"></i>
            </button>
          </div>
        </div>
      )}

      {activeSection === 'PrivacyOverview' && (
        <div className="animate-fade-in">
          {renderHeader('User Privacy Overview')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="p-8 bg-indigo-50 rounded-[2.5rem]">
               <h4 className="font-black text-indigo-900 text-xl mb-4">The Skillio Promise</h4>
               <p className="text-indigo-700 font-medium leading-relaxed">
                 We will never sell your data to advertisers. We only use your information to help you connect with amazing student services and to keep the platform running smoothly.
               </p>
            </div>
            <div className="space-y-6">
               <h4 className="font-black text-slate-900">Key Principles</h4>
               <ul className="space-y-4">
                 {[
                   { t: 'Transparency', d: 'We are always open about what data we use.' },
                   { t: 'User Control', d: 'You decide what information to share with owners.' },
                   { t: 'Security', d: 'We use modern tech to keep your details locked away.' },
                 ].map((p, i) => (
                   <li key={i} className="flex gap-4">
                     <i className="fa-solid fa-check text-green-500 mt-1"></i>
                     <div><p className="font-black text-slate-900">{p.t}</p><p className="text-sm text-slate-500">{p.d}</p></div>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'DataCollected' && (
        <div className="animate-fade-in">
          {renderHeader('Data Collected')}
          <div className="space-y-6">
            {[
              { t: 'Account Information', d: 'We store your name, email, and phone number so you can log in and manage your bookings.', icon: 'fa-id-card' },
              { t: 'Booking History', d: 'We keep a record of your past services so you can easily rebook and see your receipts.', icon: 'fa-clock-rotate-left' },
              { t: 'Preferences', d: 'We save your visitation preferences (e.g., "Morning Visits") to save you time during booking.', icon: 'fa-sliders' },
              { t: 'Service Notes', d: 'Instructions you give to owners (like gate codes) are stored to ensure a smooth visit.', icon: 'fa-sticky-note' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1">{item.t}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'LocationSafety' && (
        <div className="animate-fade-in">
          {renderHeader('Location & Address Safety')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="w-32 h-32 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-5xl flex-shrink-0">
                  <i className="fa-solid fa-map-location-dot"></i>
               </div>
               <div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">Protected Address Details</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your physical address is never listed publicly on the marketplace. It is only shared with the specific student owner <span className="font-black text-slate-900">after</span> a booking is initiated and you have confirmed the visit.
                  </p>
               </div>
            </div>
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
               <h4 className="font-black mb-4 flex items-center gap-2 text-red-400">
                  <i className="fa-solid fa-shield-halved"></i> Security Protocols
               </h4>
               <ul className="text-sm space-y-3 font-medium text-slate-400">
                 <li>• Addresses are removed from common logs after job completion.</li>
                 <li>• Gate codes and access info are encrypted within your private profile.</li>
                 <li>• Students are trained to keep client locations confidential.</li>
               </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'FamilySafety' && (
        <div className="animate-fade-in">
          {renderHeader('Child & Family Safety')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <h4 className="text-2xl font-black text-slate-900 mb-8">Community Security</h4>
             <div className="space-y-8">
                {[
                  { t: 'Verified Students', d: 'Owners are local students verified by the Skillio neighborhood committee.', icon: 'fa-user-check' },
                  { t: 'Parental Controls', d: 'We encourage parents to manage accounts and be present during first-time service visits.', icon: 'fa-hands-holding-child' },
                  { t: 'Safe Communication', d: 'All messaging stays within the Skillio platform for visibility and safety.', icon: 'fa-comment-shield' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 mb-1">{item.t}</h5>
                      <p className="text-sm text-slate-500 font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeSection === 'ServiceGuidelines' && (
        <div className="animate-fade-in">
          {renderHeader('Service Safety Guidelines')}
          <div className="space-y-6">
            <div className="p-8 bg-orange-50 border-2 border-orange-100 rounded-[2.5rem]">
               <h4 className="font-black text-orange-900 mb-2">Visitor Guidelines</h4>
               <p className="text-orange-700 font-medium">Please follow these rules for every in-person job.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { t: 'Supervision', d: 'Have an adult present at home during cleaning or tutoring sessions.', icon: 'fa-eye' },
                { t: 'Public Meetings', d: 'For first-time tutoring, we suggest starting in a local library or cafe.', icon: 'fa-building-columns' },
                { t: 'Clear Entry', d: 'Ensure pets are secured and paths are clear before a student arrives.', icon: 'fa-door-open' },
                { t: 'Instant Feedback', d: 'If something doesn\'t feel right, you can cancel a job immediately in the app.', icon: 'fa-hand' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4"><i className={`fa-solid ${item.icon}`}></i></div>
                  <h5 className="font-black text-slate-900 text-sm mb-1">{item.t}</h5>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'StorageControl' && (
        <div className="animate-fade-in">
          {renderHeader('Data Storage & Control')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-10">
             <div>
                <h4 className="text-xl font-black text-slate-900 mb-4">You are in the driver's seat.</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  We believe your data belongs to you. You have the right to see, change, or delete your information at any time.
                </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="text-center">
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"><i className="fa-solid fa-eye"></i></div>
                  <p className="font-black text-slate-900 text-sm">Review</p>
               </div>
               <div className="text-center">
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"><i className="fa-solid fa-pen-to-square"></i></div>
                  <p className="font-black text-slate-900 text-sm">Update</p>
               </div>
               <div className="text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"><i className="fa-solid fa-trash-can"></i></div>
                  <p className="font-black text-slate-900 text-sm">Delete</p>
               </div>
             </div>
             <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] flex items-center justify-between">
                <div><p className="font-black text-slate-900">Right to be Forgotten</p><p className="text-xs text-slate-400">Request permanent account deletion.</p></div>
                <button className="text-red-500 font-black text-[10px] uppercase tracking-widest px-6 py-3 bg-red-50 rounded-xl">Contact Request</button>
             </div>
          </div>
        </div>
      )}

      {activeSection === 'Contact' && (
        <div className="animate-fade-in">
          {renderHeader('Privacy Support')}
          <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-xl text-center">
             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 text-indigo-400">
                <i className="fa-solid fa-shield-check"></i>
             </div>
             <h4 className="text-3xl font-black mb-4">Direct Safety Line</h4>
             <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
               Have a specific question about your data or a safety incident? Our human support team is ready to help.
             </p>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 inline-block mb-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Safety Email</p>
                <p className="text-xl font-black text-white">safety@skillio.com</p>
             </div>
             <p className="text-xs text-slate-500 italic">We aim to respond to all safety concerns within 4 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySafetyCenter;
