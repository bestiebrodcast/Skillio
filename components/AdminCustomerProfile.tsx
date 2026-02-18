
import React, { useState, useMemo } from 'react';
import { Booking, ActivityLog } from '../types';

interface AdminCustomerProfileProps {
  client: {
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    totalSpent: number;
    lastBookingDate: string;
    address: string;
  };
  bookings: Booking[];
  activityLogs: ActivityLog[];
  onBack: () => void;
  onUpdateBookingStatus: (id: string, status: Booking['status']) => void;
}

type Tab = 'Overview' | 'Contact' | 'Bookings' | 'Insights' | 'Notes' | 'Payments' | 'Comms' | 'Actions';

const AdminCustomerProfile: React.FC<AdminCustomerProfileProps> = ({ client, bookings, activityLogs, onBack, onUpdateBookingStatus }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<'Active' | 'Paused'>('Active');
  const [flags, setFlags] = useState({ reliable: true, attention: false });

  const tabs: {id: Tab, icon: string}[] = [
    { id: 'Overview', icon: 'fa-user-gear' },
    { id: 'Contact', icon: 'fa-location-dot' },
    { id: 'Bookings', icon: 'fa-calendar-days' },
    { id: 'Insights', icon: 'fa-chart-pie' },
    { id: 'Notes', icon: 'fa-sticky-note' },
    { id: 'Payments', icon: 'fa-money-bill-trend-up' },
    { id: 'Comms', icon: 'fa-message' },
    { id: 'Actions', icon: 'fa-sliders' },
  ];

  const favoriteService = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => counts[b.serviceTitle] = (counts[b.serviceTitle] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [bookings]);

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{client.name}</h2>
          <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Admin Control Panel</p>
        </div>
        <div className="ml-auto flex gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                Account {status}
            </span>
            {flags.reliable && <span className="bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase"><i className="fa-solid fa-star mr-1"></i> Reliable</span>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Navigation */}
        <div className="lg:w-20 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
          {tabs.map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              title={t.id}
              className={`w-14 h-14 min-w-[3.5rem] rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-400 hover:text-indigo-600'}`}
            >
              <i className={`fa-solid ${t.icon}`}></i>
            </button>
          ))}
        </div>

        {/* Dynamic Admin Content */}
        <div className="flex-grow bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 min-h-[550px] flex flex-col relative overflow-hidden">
          
          {activeTab === 'Overview' && (
            <div className="animate-fade-in space-y-10">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Summary</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-md">Real-time health check of this customer's account activity and engagement level.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-400 uppercase">Last Job</p>
                  <p className="text-lg font-black text-slate-900">{client.lastBookingDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Frequency</p>
                    <p className="text-4xl font-black text-slate-900">{client.totalBookings}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-2">TOTAL JOBS PLACED</p>
                 </div>
                 <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Total Value</p>
                    <p className="text-4xl font-black text-indigo-600">KES {client.totalSpent.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-indigo-400 mt-2">LIFETIME REVENUE</p>
                 </div>
                 <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Category</p>
                    <p className="text-2xl font-black">{client.totalBookings > 5 ? 'High Value' : 'Standard'}</p>
                    <p className="text-[9px] font-bold text-slate-500 mt-2">AUTO-SEGMENTATION</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Contact' && (
            <div className="animate-fade-in space-y-8">
              <h4 className="text-xl font-black text-slate-900">Saved Logistics & Access</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Phone</p>
                       <p className="text-lg font-black text-slate-900">{client.phone}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Address</p>
                       <p className="text-lg font-black text-slate-900">{client.address}</p>
                    </div>
                 </div>
                 <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white">
                    <h5 className="font-black mb-4 flex items-center gap-2"><i className="fa-solid fa-key"></i> Access & Gate Codes</h5>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10 mb-4">
                       <p className="text-xs font-bold text-indigo-200">Current Code</p>
                       <p className="text-2xl font-black">#8821</p>
                    </div>
                    <p className="text-[10px] text-indigo-200 leading-relaxed font-medium">Customer note: "Please use the side gate near the hibiscus bush."</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin-Only Location Notes (Visible only to owners)</label>
                 <textarea className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-bold" placeholder="E.g. Tricky parking, watch out for the slope..." rows={3} />
              </div>
            </div>
          )}

          {activeTab === 'Bookings' && (
            <div className="animate-fade-in h-full flex flex-col">
              <h4 className="text-xl font-black text-slate-900 mb-6">Historical Log for {client.name}</h4>
              <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                 {bookings.map(b => (
                    <div key={b.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center group">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${b.status === 'Completed' ? 'bg-green-500' : 'bg-indigo-600'}`}>
                             <i className={`fa-solid ${b.serviceId === 't1' ? 'fa-book-open-reader' : 'fa-house-sparkles'}`}></i>
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{b.serviceTitle}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.date} • {b.id}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-slate-900">KES {b.totalPrice?.toLocaleString()}</span>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${b.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 border border-slate-100'}`}>{b.status}</span>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'Insights' && (
            <div className="animate-fade-in space-y-10">
              <h4 className="text-xl font-black text-slate-900">Service Preferences (AI Insights)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-5xl opacity-10 text-slate-900"><i className="fa-solid fa-heart"></i></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Favorite Service</p>
                    <p className="text-2xl font-black text-slate-900">{favoriteService}</p>
                    <p className="text-xs font-bold text-indigo-500 mt-2">Booked {bookings.filter(b => b.serviceTitle === favoriteService).length} times</p>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-5xl opacity-10 text-slate-900"><i className="fa-solid fa-clock"></i></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Preferred Time</p>
                    <p className="text-2xl font-black text-slate-900">Mornings</p>
                    <p className="text-xs font-bold text-indigo-500 mt-2">90% of sessions are before 12 PM</p>
                 </div>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                 <h5 className="font-black mb-4 text-indigo-400 flex items-center gap-2"><i className="fa-solid fa-lightbulb"></i> Business Suggestion</h5>
                 <p className="text-sm text-slate-400 leading-relaxed font-medium">This customer frequently books tutoring but hasn't tried the Reading Corner. Consider offering a "Study Bundle" for their next session!</p>
              </div>
            </div>
          )}

          {activeTab === 'Notes' && (
            <div className="animate-fade-in space-y-8">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-slate-900">Owner-Only Memo & Flags</h4>
                  <div className="flex gap-2">
                     <button 
                      onClick={() => setFlags({...flags, reliable: !flags.reliable})}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${flags.reliable ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400'}`}
                     >⭐ Reliable</button>
                     <button 
                      onClick={() => setFlags({...flags, attention: !flags.attention})}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${flags.attention ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                     >⚠️ Attention</button>
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">Keep a paper trail of behavioral notes or special customer quirks. These are <span className="text-red-500 font-bold uppercase">never visible</span> to the customer.</p>
                  <textarea 
                    className="w-full p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] outline-none font-bold text-lg min-h-[250px] focus:border-slate-900 transition-all"
                    placeholder="E.g. Very polite, always has a snack ready for the tutor..."
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                  />
               </div>
            </div>
          )}

          {activeTab === 'Payments' && (
            <div className="animate-fade-in space-y-10">
               <h4 className="text-xl font-black text-slate-900">Financial Performance</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-green-50 p-10 rounded-[3rem] border border-green-100">
                     <p className="text-[10px] font-black text-green-600 uppercase mb-4">Net Lifetime Profit</p>
                     <p className="text-5xl font-black text-green-700">KES {client.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Avg. Booking Value</p>
                     <p className="text-5xl font-black text-slate-900">KES {(client.totalSpent / (client.totalBookings || 1)).toFixed(0)}</p>
                  </div>
               </div>
               <div className="p-8 border-2 border-slate-100 rounded-[2.5rem]">
                  <h5 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">Pending Settlements</h5>
                  <p className="text-slate-400 font-bold italic">No outstanding payments for this client.</p>
               </div>
            </div>
          )}

          {activeTab === 'Comms' && (
            <div className="animate-fade-in space-y-8">
               <h4 className="text-xl font-black text-slate-900">Automated Comm Log</h4>
               <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <p className="text-slate-400 font-bold italic">No recorded communication history.</p>
                  ) : (
                    activityLogs.map(log => (
                      <div key={log.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 text-xs"><i className="fa-solid fa-clock"></i></div>
                         <div>
                            <p className="text-sm font-bold text-slate-700">{log.action}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{log.timestamp}</p>
                         </div>
                      </div>
                    ))
                  )}
               </div>
               <button className="w-full py-4 bg-slate-50 text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 border border-transparent hover:border-indigo-100">
                  <i className="fa-solid fa-paper-plane mr-2"></i> Send Manual Update
               </button>
            </div>
          )}

          {activeTab === 'Actions' && (
            <div className="animate-fade-in space-y-10">
               <h4 className="text-xl font-black text-slate-900">Control Actions</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setStatus(status === 'Active' ? 'Paused' : 'Active')}
                    className={`p-10 rounded-[3rem] text-left border-2 transition-all group ${status === 'Active' ? 'border-red-50 hover:bg-red-50' : 'border-green-50 hover:bg-green-50'}`}
                  >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm ${status === 'Active' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                        <i className={`fa-solid ${status === 'Active' ? 'fa-pause' : 'fa-play'}`}></i>
                     </div>
                     <h5 className="font-black text-slate-900 text-lg">{status === 'Active' ? 'Pause Bookings' : 'Reactivate Bookings'}</h5>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">{status === 'Active' ? 'Temporarily prevent this customer from making new bookings.' : 'Allow the customer to place new service requests.'}</p>
                  </button>
                  <button className="p-10 rounded-[3rem] text-left border-2 border-slate-50 hover:bg-slate-50 transition-all group">
                     <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm">
                        <i className="fa-solid fa-user-xmark"></i>
                     </div>
                     <h5 className="font-black text-slate-900 text-lg">Reset Account</h5>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">Clear historical metadata while keeping core contact info intact.</p>
                  </button>
               </div>
               <div className="p-8 bg-red-600 text-white rounded-[2.5rem] flex items-center justify-between">
                  <div>
                    <h5 className="font-black">Permanent Deletion</h5>
                    <p className="text-xs text-white/60 font-medium">Irreversible: Removes all client data from the platform.</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-900/10">Purge Data</button>
               </div>
            </div>
          )}

          <div className="mt-auto pt-10 border-t border-slate-50 flex items-center justify-between text-slate-400">
             <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-fingerprint"></i> UUID: {client.email}
             </p>
             <p className="text-[10px] font-black uppercase tracking-widest">Skillio Owner Tools v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerProfile;
