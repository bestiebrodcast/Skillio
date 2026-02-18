
import React, { useState, useMemo, useEffect } from 'react';
import { Booking, UserProfile, BookingStatus, PaymentStatus } from '../types';

interface CleaningHubProps {
  onBack: () => void;
  bookings: Booking[];
  onBookingCreated: (b: Booking) => void;
  onUpdateBookingStatus: (id: string, status: BookingStatus) => void;
  userProfile: UserProfile;
}

type Step = 'type' | 'extras' | 'schedule' | 'summary' | 'success';

interface ExtraService {
  id: string;
  name: string;
  price: number;
  icon: string;
}

const CLEANING_TYPES = [
  { id: 'full', title: 'Full Home Cleaning', price: 2500, desc: 'Deep scrubbing of all rooms, floors, and surfaces.' },
  { id: 'standard', title: 'Standard Cleaning', price: 1500, desc: 'A thorough tidy up, dusting, and floor vacuuming.' },
  { id: 'light', title: 'Light Cleaning', price: 800, desc: 'Quick refresh of main living areas and surfaces.' },
];

const EXTRAS: ExtraService[] = [
  { id: 'yard', name: 'Yard Sweeping', price: 500, icon: '🧹' },
  { id: 'car', name: 'Car Washing', price: 1000, icon: '🚗' },
  { id: 'laundry', name: 'Laundry Folding', price: 400, icon: '👕' },
  { id: 'plants', name: 'Plant Watering', price: 300, icon: '🌱' },
  { id: 'windows', name: 'Window Polishing', price: 600, icon: '🪟' },
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const CleaningHub: React.FC<CleaningHubProps> = ({ onBack, bookings, onBookingCreated, userProfile }) => {
  const [step, setStep] = useState<Step>('type');
  
  // Persistent workflow state
  const [cleaningType, setCleaningType] = useState<typeof CLEANING_TYPES[0] | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<ExtraService[]>([]);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  // Sync scroll on step change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [step]);

  // Pricing Logic (Step 3)
  const totals = useMemo(() => {
    const base = cleaningType?.price || 0;
    const extrasSum = selectedExtras.reduce((sum, item) => sum + item.price, 0);
    const subtotal = base + extrasSum;
    
    // Rule: If total services (base + extras) >= 3, apply 10% discount
    const totalServiceCount = (cleaningType ? 1 : 0) + selectedExtras.length;
    const isBundle = totalServiceCount >= 3;
    const discount = isBundle ? Math.round(subtotal * 0.1) : 0;
    const finalTotal = subtotal - discount;

    return { subtotal, discount, finalTotal, isBundle };
  }, [cleaningType, selectedExtras]);

  // Date Selection Logic (Step 4)
  const availableDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Show next 14 days
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  // Time Selection Logic (Step 5)
  // Hide already booked slots for the owner (user_1) on that specific day
  const availableTimeSlots = useMemo(() => {
    if (!bookingDate) return [];
    const takenSlots = bookings
      .filter(b => b.date === bookingDate && b.status !== 'Cancelled' && b.providerId === 'user_1')
      .map(b => b.startTime);
    return TIME_SLOTS.filter(slot => !takenSlots.includes(slot));
  }, [bookingDate, bookings]);

  const toggleExtra = (extra: ExtraService) => {
    setSelectedExtras(prev => 
      prev.find(e => e.id === extra.id) 
        ? prev.filter(e => e.id !== extra.id) 
        : [...prev, extra]
    );
  };

  const handleConfirmBooking = () => {
    if (!cleaningType || !bookingDate || !bookingTime) return;

    setIsProcessing(true);
    const bookingId = `SKL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const newBooking: Booking = {
      id: bookingId,
      serviceId: 'owner-cleaning-hub',
      serviceTitle: cleaningType.title,
      customerName: userProfile.name,
      customerEmail: userProfile.email,
      customerPhone: userProfile.phone,
      providerId: 'user_1', // Owner Direct Account
      providerName: 'Kyla Ndungu (Owner)',
      message: `Direct Cleaning Booking: ${cleaningType.title}. Extras: ${selectedExtras.map(e => e.name).join(', ') || 'None'}`,
      status: 'Confirmed',
      paymentStatus: 'Paid to Escrow',
      date: bookingDate,
      startTime: bookingTime,
      type: 'In-Person',
      createdAt: new Date().toISOString(),
      totalPrice: totals.finalTotal,
      platformFee: 0, // Direct owner service = no fee
      taskerAmount: totals.finalTotal,
      addOns: selectedExtras.map(e => e.name)
    };

    // Simulate payment processing delay
    setTimeout(() => {
      onBookingCreated(newBooking);
      setConfirmedId(bookingId);
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in pb-40">
      {/* Dynamic Header */}
      {step !== 'success' && (
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <button onClick={onBack} className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2 hover:text-indigo-600 transition-colors">
                <i className="fa-solid fa-arrow-left"></i> Exit Hub
              </button>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Direct Home Booking</h2>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Running Total</p>
              <p className="text-2xl font-black text-indigo-600">KES {totals.finalTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div className={`h-full bg-indigo-600 transition-all duration-700 ${
              step === 'type' ? 'w-1/4' : step === 'extras' ? 'w-2/4' : step === 'schedule' ? 'w-3/4' : 'w-full'
            }`}></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[550px] flex flex-col">
        
        {/* STEP 1: SERVICE TYPE */}
        {step === 'type' && (
          <div className="p-10 md:p-16 animate-fade-in flex flex-col flex-grow">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-black">01</span>
              Select Cleaning Tier
            </h3>
            <div className="space-y-4 flex-grow">
              {CLEANING_TYPES.map(tier => (
                <button 
                  key={tier.id}
                  onClick={() => setCleaningType(tier)}
                  className={`w-full p-8 rounded-[2.5rem] border-2 text-left transition-all flex items-center justify-between group ${cleaningType?.id === tier.id ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <div className="flex-grow pr-6">
                    <h4 className="text-xl font-black text-slate-900 mb-2">{tier.title}</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{tier.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-black text-slate-900">KES {tier.price.toLocaleString()}</p>
                    <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest bg-white border border-indigo-50 px-3 py-1 rounded-full mt-2 inline-block">Starting Price</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-12 flex justify-end">
              <button 
                onClick={() => setStep('extras')} 
                disabled={!cleaningType}
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all"
              >
                Choose Extra Services <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXTRA SERVICES */}
        {step === 'extras' && (
          <div className="p-10 md:p-16 animate-fade-in flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-black">02</span>
                Extra Neighborhood Help
              </h3>
              {totals.isBundle && (
                <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                  10% Bundle Discount Applied! 🎉
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
              {EXTRAS.map(extra => {
                const isActive = selectedExtras.some(e => e.id === extra.id);
                return (
                  <button 
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    className={`p-6 rounded-[2rem] border-2 flex items-center gap-6 transition-all ${isActive ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50'}`}
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">{extra.icon}</div>
                    <div className="flex-grow text-left">
                      <h4 className="font-black text-slate-900">{extra.name}</h4>
                      <p className="text-xs font-black text-indigo-500 uppercase">KES {extra.price.toLocaleString()}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-indigo-600 text-white' : 'bg-white text-slate-200 shadow-inner'}`}>
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button onClick={() => setStep('type')} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Back</button>
              <button 
                onClick={() => setStep('schedule')} 
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Pick Arrival Date <i className="fa-solid fa-calendar-days ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 & 5: DAY & TIME SELECTION */}
        {step === 'schedule' && (
          <div className="p-10 md:p-16 animate-fade-in flex flex-col flex-grow">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-black">03</span>
              Owner Arrival Schedule
            </h3>

            <div className="space-y-10 flex-grow">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Choose an Available Day</label>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
                  {availableDays.map(date => (
                    <button 
                      key={date}
                      onClick={() => { setBookingDate(date); setBookingTime(''); }}
                      className={`min-w-[120px] p-6 rounded-[2rem] border-2 flex flex-col items-center transition-all ${bookingDate === date ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                    >
                      <span className="text-[10px] font-black uppercase opacity-60 mb-1">{new Date(date).toLocaleString('default', { weekday: 'short' })}</span>
                      <span className="text-2xl font-black">{new Date(date).getDate()}</span>
                      <span className="text-[10px] font-bold uppercase">{new Date(date).toLocaleString('default', { month: 'short' })}</span>
                    </button>
                  ))}
                </div>
              </div>

              {bookingDate && (
                <div className="animate-fade-in space-y-4 pt-6 border-t border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select an Open Time Slot</label>
                  {availableTimeSlots.length === 0 ? (
                    <div className="p-10 bg-orange-50 text-orange-600 rounded-3xl text-center font-bold">
                      Fully Booked! Please choose another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {availableTimeSlots.map(slot => (
                        <button 
                          key={slot}
                          onClick={() => setBookingTime(slot)}
                          className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${bookingTime === slot ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-50">
              <button onClick={() => setStep('extras')} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
              <button 
                onClick={() => setStep('summary')} 
                disabled={!bookingDate || !bookingTime}
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all"
              >
                Review Summary <i className="fa-solid fa-receipt ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY PAGE */}
        {step === 'summary' && (
          <div className="p-10 md:p-16 animate-fade-in flex flex-col flex-grow">
            <h3 className="text-2xl font-black text-slate-900 mb-10">Confirm Booking Details</h3>
            
            <div className="bg-slate-50 rounded-[3rem] p-10 space-y-8 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Tier</p>
                    <p className="text-xl font-black text-slate-900">{cleaningType?.title}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Extra Services</p>
                    {selectedExtras.length === 0 ? (
                      <p className="text-slate-500 italic">No extras selected</p>
                    ) : (
                      <ul className="space-y-1">
                        {selectedExtras.map(e => <li key={e.id} className="text-sm font-bold text-slate-700 flex items-center gap-2"><i className="fa-solid fa-plus text-[10px] text-indigo-500"></i> {e.name}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                    <p className="text-xl font-black text-indigo-600">{bookingDate} @ {bookingTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                    <p className="text-[10px] font-medium text-slate-500">{userProfile.email}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Base + Extras Subtotal</span>
                    <span>KES {totals.subtotal.toLocaleString()}</span>
                  </div>
                  {totals.isBundle && (
                    <div className="flex justify-between items-center text-sm font-black text-green-600">
                      <span>Skillio Bundle Discount (10%)</span>
                      <span>- KES {totals.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-6">
                    <span className="text-xl font-black text-slate-900">Total Escrow Amount</span>
                    <span className="text-4xl font-black text-indigo-600 tracking-tighter">KES {totals.finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep('schedule')} className="px-8 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Reschedule</button>
              <button 
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className="flex-grow py-6 bg-[#4fb23b] text-white rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
              >
                {isProcessing ? 'Processing M-Pesa...' : 'Confirm & Pay with M-Pesa'}
                {!isProcessing && <i className="fa-solid fa-lock"></i>}
              </button>
            </div>
            <button onClick={onBack} className="mt-6 text-red-500 font-black uppercase text-[10px] tracking-widest hover:underline text-center">Cancel Booking Process</button>
          </div>
        )}

        {/* STEP 7: SUCCESS SCREEN */}
        {step === 'success' && (
          <div className="p-16 text-center animate-fade-in flex flex-col items-center justify-center flex-grow">
            <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center text-6xl mb-10 shadow-2xl animate-bounce">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Booking Confirmed!</h2>
            <p className="text-xl text-slate-500 max-w-md mx-auto mb-12 font-medium leading-relaxed">
              Your neighborhood help is scheduled! Ref: <span className="font-black text-slate-900">{confirmedId}</span>. Funds are held safely in escrow.
            </p>
            <div className="flex gap-4">
              <button onClick={onBack} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Back to Marketplace</button>
              <button onClick={() => alert("Check your settings to view all active trackers.")} className="px-12 py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest border border-indigo-100">Live Tracker</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleaningHub;
