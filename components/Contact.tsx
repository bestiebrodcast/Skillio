
import React, { useState, useMemo } from 'react';
import { Service, Booking } from '../types';

interface ContactProps {
  service: Service | null;
  bookings: Booking[];
  targetProviderId?: string;
  providerName?: string;
  onSubmit: (booking: Booking) => void;
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ service, bookings, targetProviderId, providerName, onSubmit, onBack }) => {
  const [payStep, setPayStep] = useState<'details' | 'mpesa' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    type: 'In-Person' as 'Online' | 'In-Person'
  });

  const basePrice = parseInt(service?.price.replace(/\D/g, '') || '0');
  const platformFee = Math.round(basePrice * 0.1);
  const totalPrice = basePrice; 

  const serviceDuration = service?.durationMinutes || 60;

  const calculatedEndTime = useMemo(() => {
    const [h, m] = formData.startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + serviceDuration, 0);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }, [formData.startTime, serviceDuration]);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPayStep('mpesa');
  };

  const handleConfirmMpesa = () => {
    const newBooking: Booking = {
      id: `BK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      serviceId: service?.id || 'general',
      serviceTitle: service?.title || 'General Inquiry',
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      providerId: targetProviderId,
      providerName: providerName,
      message: formData.message,
      status: 'Requested',
      paymentStatus: 'Paid to Escrow', 
      date: formData.date,
      startTime: formData.startTime,
      endTime: calculatedEndTime,
      type: formData.type,
      createdAt: new Date().toISOString(),
      totalPrice: basePrice,
      platformFee: platformFee,
      taskerAmount: basePrice - platformFee
    };
    
    setPayStep('success');
    setTimeout(() => {
      onSubmit(newBooking);
    }, 2000);
  };

  if (payStep === 'success') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in">
        <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-100 text-center">
          <div className="w-28 h-28 bg-green-500 text-white rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-xl animate-bounce">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6">Payment Confirmed!</h2>
          <p className="text-xl text-slate-500 mb-8 max-w-xl mx-auto">
            KES {totalPrice.toLocaleString()} is safely held in Skillio Escrow. 
            The tasker has been notified to confirm your slot!
          </p>
          <div className="bg-slate-50 p-6 rounded-3xl inline-block">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">M-Pesa Transaction Verified</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {payStep === 'mpesa' ? (
        <div className="max-w-md mx-auto animate-scale-in">
          <div className="bg-[#4fb23b] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl"><i className="fa-solid fa-mobile-screen"></i></div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-black mb-2">M-PESA Checkout</h3>
              <p className="text-white/80 font-bold mb-8 uppercase text-[10px] tracking-widest">Secure Escrow Payment</p>
              
              <div className="bg-white/10 rounded-3xl p-8 mb-8 border border-white/20">
                <p className="text-xs font-bold uppercase text-white/60 mb-1">Pay to Skillio</p>
                <p className="text-5xl font-black">KES {totalPrice.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white text-slate-900 p-6 rounded-2xl text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Instructions</p>
                  <p className="text-sm font-bold leading-relaxed">1. Check your phone for the STK pop-up.<br/>2. Enter your M-Pesa PIN.<br/>3. Click confirm below after you pay.</p>
                </div>
                <button 
                  onClick={handleConfirmMpesa}
                  className="w-full bg-white text-[#4fb23b] py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
                >
                  I have entered my PIN
                </button>
                <button onClick={() => setPayStep('details')} className="text-white/60 text-xs font-black uppercase tracking-widest">Cancel Transaction</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Instant Booking.</h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Skillio uses **M-Pesa Escrow**. We hold your money until the task is finished perfectly. No cash needed.
            </p>

            <div className="space-y-6">
               <div className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 flex items-center gap-6">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    <i className="fa-solid fa-shield-check"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-green-900 text-lg">Escrow Guarantee</h4>
                    <p className="text-sm text-green-700 font-medium">Money is only released when the job is done.</p>
                  </div>
               </div>
               
               <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black">Order Summary</h4>
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">Secure Checkout</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold">{service?.title}</span><span className="font-black">KES {basePrice.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-3 font-black text-xl"><span>Total to Pay</span><span>KES {totalPrice.toLocaleString()}</span></div>
                  </div>
               </div>
            </div>
          </div>

          <form onSubmit={handleStartPayment} className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl border border-slate-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">M-Pesa Number</label>
                <input type="tel" placeholder="07XX XXX XXX" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date</label>
                <input type="date" required value={formData.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Time</label>
                <input type="time" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Notes for Tasker</label>
              <textarea rows={3} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-medium" placeholder="E.g. House with the red roof..." />
            </div>

            <button type="submit" className="w-full bg-[#4fb23b] hover:bg-[#45a033] text-white py-6 rounded-[2rem] text-2xl font-black shadow-2xl flex items-center justify-center gap-4 transition-all">
              Pay with M-Pesa <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contact;
