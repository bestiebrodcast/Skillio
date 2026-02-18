
import React, { useState, useMemo } from 'react';
import { UserProfile, Booking, BookingStatus, View, Category, PaymentStatus } from '../types';

interface ProviderDashboardProps {
  userProfile: UserProfile;
  bookings: Booking[];
  services: any[];
  onUpdateBookingStatus: (id: string, status: BookingStatus) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigate: (view: View) => void;
  onBack: () => void;
}

type ProviderMainTab = 'Active Jobs' | 'Financials' | 'Schedule' | 'Clients';

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ 
  userProfile, bookings, onUpdateBookingStatus, onNavigate, onBack 
}) => {
  const [activeMainTab, setActiveMainTab] = useState<ProviderMainTab>('Active Jobs');
  const [isProcessingCompletion, setIsProcessingCompletion] = useState<string | null>(null);

  const myBookings = useMemo(() => {
    return bookings.filter(b => b.providerId === userProfile.id);
  }, [bookings, userProfile.id]);

  const financials = useMemo(() => {
    const escrow = myBookings
      .filter(b => b.paymentStatus === 'Paid to Escrow' && b.status !== 'Completed')
      .reduce((sum, b) => sum + (b.taskerAmount || 0), 0);
    
    const cleared = myBookings
      .filter(b => b.paymentStatus === 'Released to Tasker')
      .reduce((sum, b) => sum + (b.taskerAmount || 0), 0);
    
    const fees = myBookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.platformFee || 0), 0);

    return { escrow, cleared, fees };
  }, [myBookings]);

  const handleCompleteJob = (booking: Booking) => {
    setIsProcessingCompletion(booking.id);
    
    // Simulate automatic M-Pesa payout trigger
    setTimeout(() => {
      onUpdateBookingStatus(booking.id, 'Completed');
      alert(`🎉 JOB COMPLETED! KES ${booking.taskerAmount.toLocaleString()} has been sent to your M-Pesa: ${userProfile.phone}.`);
      setIsProcessingCompletion(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-40 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
               <i className="fa-solid fa-briefcase"></i>
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Tasker Control</h1>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Professional Center</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
             {(['Active Jobs', 'Financials', 'Schedule', 'Clients'] as ProviderMainTab[]).map(t => (
               <button key={t} onClick={() => setActiveMainTab(t)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMainTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`}>{t}</button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {activeMainTab === 'Active Jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Active Work</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{myBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length} Jobs Found</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {myBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100">
                  <p className="text-slate-400 font-bold italic">No active bookings right now.</p>
                </div>
              ) : (
                myBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').map(b => (
                  <div key={b.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-10">
                     <div className="flex-grow text-left">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">{b.serviceTitle}</span>
                           <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                              <i className="fa-solid fa-shield-check"></i> Escrow Secured
                           </span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 mb-1">{b.customerName}</h4>
                        <p className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-3">
                          <i className="fa-solid fa-calendar-day text-indigo-500"></i> {b.date} • {b.startTime} Arrival
                        </p>
                        
                        {/* Detail Breakdown for Multi-Step Hub Bookings */}
                        {b.addOns && b.addOns.length > 0 && (
                          <div className="mb-8">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Add-ons</p>
                             <div className="flex flex-wrap gap-2">
                                {b.addOns.map(add => (
                                  <span key={add} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-xs font-bold">{add}</span>
                                ))}
                             </div>
                          </div>
                        )}

                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 inline-block">
                           <p className="font-black text-slate-400 uppercase text-[8px] mb-1 tracking-widest">Payout Value</p>
                           <p className="text-3xl font-black text-slate-900">KES {b.taskerAmount.toLocaleString()}</p>
                        </div>
                     </div>

                     <div className="flex flex-col gap-3 min-w-[200px] justify-center">
                        <div className="mb-4 text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${b.status === 'Accepted' ? 'bg-blue-100 text-blue-600' : b.status === 'In Progress' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                              {b.status}
                           </span>
                        </div>

                        {b.status === 'Requested' && <button onClick={() => onUpdateBookingStatus(b.id, 'Accepted')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition-all">Confirm Order</button>}
                        {b.status === 'Accepted' && <button onClick={() => onUpdateBookingStatus(b.id, 'In Progress')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all">Arrived & Working</button>}
                        {b.status === 'In Progress' && (
                          <button 
                            onClick={() => handleCompleteJob(b)} 
                            disabled={isProcessingCompletion === b.id}
                            className="w-full py-5 bg-[#4fb23b] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                            {isProcessingCompletion === b.id ? (
                              <><i className="fa-solid fa-spinner animate-spin"></i> Finalizing...</>
                            ) : (
                              <><i className="fa-solid fa-check"></i> Complete & Payout</>
                            )}
                          </button>
                        )}
                        <button className="w-full py-4 text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-indigo-600 transition-colors">Contact Client</button>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeMainTab === 'Financials' && (
          <div className="space-y-12 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Cleared Earnings</p>
                   <h3 className="text-5xl font-black tracking-tighter">KES {financials.cleared.toLocaleString()}</h3>
                   <p className="text-xs text-slate-400 font-medium mt-4">Already paid to your M-Pesa.</p>
                </div>
                
                <div className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-xl shadow-indigo-100">
                   <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Held in Escrow</p>
                   <h3 className="text-5xl font-black tracking-tighter">KES {financials.escrow.toLocaleString()}</h3>
                   <p className="text-xs text-indigo-100/60 font-medium mt-4">Awaiting job completion.</p>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Fee (10%)</p>
                      <h3 className="text-3xl font-black text-slate-900">KES {financials.fees.toLocaleString()}</h3>
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Skillio Service Fee</p>
                </div>
             </div>

             <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <h4 className="font-black text-slate-900">Recent M-Pesa Payouts</h4>
                </div>
                <div className="divide-y divide-slate-50">
                   {myBookings.filter(b => b.paymentStatus === 'Released to Tasker').map(b => (
                     <div key={b.id} className="p-8 flex justify-between items-center">
                        <div className="text-left">
                           <p className="font-black text-slate-900">{b.serviceTitle}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{b.date} • Ref: {b.id}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-green-600">+ KES {b.taskerAmount.toLocaleString()}</p>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Paid out</p>
                        </div>
                     </div>
                   ))}
                   {myBookings.filter(b => b.paymentStatus === 'Released to Tasker').length === 0 && (
                     <p className="p-20 text-center text-slate-400 font-bold italic">No payouts released yet.</p>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
