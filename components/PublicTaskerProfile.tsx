
import React, { useState, useMemo } from 'react';
import { UserProfile, Booking } from '../types';

interface PublicTaskerProfileProps {
  tasker: UserProfile;
  bookings: Booking[];
  onBook: (id: string) => void;
  onBack: () => void;
}

const PublicTaskerProfile: React.FC<PublicTaskerProfileProps> = ({ tasker, bookings, onBook, onBack }) => {
  const settings = tasker.taskerProfileSettings!;
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const approvedModules = useMemo(() => {
    return settings.offeredServices.filter(s => s.service_publish_state === 'approved' && s.isActive);
  }, [settings.offeredServices]);

  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const today = new Date(); today.setHours(0,0,0,0);
    
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const isBlocked = settings.blockedDates.includes(dateStr);
      const isBooked = bookings.some(b => b.date === dateStr && b.providerId === tasker.id && b.status !== 'Cancelled');
      const isPast = date < today;
      days.push({ num: i, dateStr, status: isPast ? 'past' : isBlocked ? 'blocked' : isBooked ? 'booked' : 'available' });
    }
    return days;
  }, [currentCalendarDate, settings, bookings, tasker.id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in pb-32">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-10 transition-colors uppercase text-[10px] tracking-widest"><i className="fa-solid fa-arrow-left"></i> Back to Discovery</button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Card Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden text-center p-12">
              <div className="w-40 h-40 bg-slate-900 rounded-[3rem] mx-auto mb-8 overflow-hidden border-4 border-white shadow-xl relative">
                 {settings.photoUrl ? <img src={settings.photoUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-6xl font-black text-slate-800 bg-slate-50">{settings.displayName.charAt(0)}</div>}
                 <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm"><i className="fa-solid fa-bolt text-[10px]"></i></div>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-1">{settings.displayName}</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-8">{settings.headline}</p>
              <div className="space-y-4">
                 <button onClick={() => onBook(tasker.id)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3"><i className="fa-solid fa-calendar-check"></i> Initiate Booking</button>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Only approved services are currently bookable.</p>
              </div>
           </div>
        </div>

        {/* Main Profile Details */}
        <div className="lg:col-span-2 space-y-12">
           <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 md:p-16">
              <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Professional Bio</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed italic">"{settings.publicBio}"</p>
           </div>

           {/* Professional Portfolio Categories */}
           <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12">
              <h3 className="text-3xl font-black text-slate-900 mb-10">Available Modules</h3>
              {approvedModules.length === 0 ? (
                <p className="text-slate-400 italic">No approved service modules currently indexed for this profile.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {approvedModules.map(os => (
                     <div key={os.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:border-indigo-600 transition-all">
                        <div>
                           <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-1">{os.title}</h4>
                           <p className="text-[10px] font-bold text-indigo-500 uppercase">Live Module</p>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-slate-900">KES {os.price.toLocaleString()}</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{os.priceType.replace('_', ' ')}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12">
              <div className="flex justify-between items-center mb-10"><div><h3 className="text-3xl font-black text-slate-900 mb-1">Schedule Sync</h3><p className="text-sm text-slate-400 font-medium">Real-time availability synchronization.</p></div><div className="flex items-center gap-4"><button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))} className="w-10 h-10 bg-slate-50 rounded-xl"><i className="fa-solid fa-chevron-left"></i></button><span className="font-black text-sm uppercase tracking-widest">{currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span><button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))} className="w-10 h-10 bg-slate-50 rounded-xl"><i className="fa-solid fa-chevron-right"></i></button></div></div>
              <div className="grid grid-cols-7 gap-3">{calendarDays.map((day, i) => <div key={i} className="aspect-square">{!day ? <div className="w-full h-full" /> : <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center border-2 transition-all relative overflow-hidden ${day.status === 'blocked' ? 'bg-slate-50 border-transparent text-slate-200' : day.status === 'booked' ? 'bg-indigo-50 border-indigo-200 text-indigo-300' : day.status === 'past' ? 'opacity-30 grayscale' : 'bg-green-50 border-green-200 text-green-700 cursor-pointer hover:shadow-lg'}`}><span className="text-sm font-black">{day.num}</span>{day.status === 'available' && <span className="text-[6px] font-black uppercase tracking-tighter mt-1">Open</span>}</div>}</div>)}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTaskerProfile;
