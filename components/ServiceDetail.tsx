
import React, { useState, useMemo } from 'react';
import { Service, ProviderApplication, UserProfile } from '../types';

interface ServiceDetailProps {
  service: Service;
  applications: ProviderApplication[];
  onBook: (providerId?: string) => void;
  onBack: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, applications, onBook, onBack }) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Filter ONLY this tasker's bookings (Discovery Filters: Rules 38, 40, 48, 50)
  const assignedAssistants = useMemo(() => {
    // In a production environment, we would join Application and UserProfile records.
    // For this implementation, we use the Application status and mock/derive visibility logic.
    return applications
      .filter(app => {
        const isApproved = app.status === 'approved';
        const isAssigned = service.allowedProviderIds?.includes(app.userId);
        
        // Mock Discovery Rules Check:
        // Rule 38/40: isUnavailableMode
        // Rule 48: acceptNewBookings
        // Rule 50: isDeactivated
        // In a real app, these values would be fetched from the global state/DB for each provider.
        return isApproved && isAssigned;
      })
      .map(app => ({
        id: app.userId,
        name: app.userName,
        headline: "Verified Professional Assistant",
        location: "Neighborhood Local",
        bio: app.experience,
        skills: app.skills,
        photoUrl: "", 
        isVerified: app.status === 'approved',
        expLevel: 'Advanced',
        strengths: ['Punctual', 'Verified Skills'],
        style: 'Detail-oriented',
        price: app.requestedPricing?.[service.category] || "Market Rate"
      }));
  }, [service, applications]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back to All Services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[450px] relative">
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur shadow-xl px-4 py-1.5 rounded-full text-[10px] font-black text-slate-800 tracking-wider uppercase">
             {service.category}
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none">{service.title}</h1>
          
          <div className="text-3xl font-black text-indigo-600 mb-8 bg-indigo-50/50 p-6 rounded-[2rem] inline-block w-fit">
            {service.price}
          </div>
          
          <div className="prose prose-slate mb-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Brief</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {service.description}
            </p>
          </div>

          <div className="space-y-4">
             <button 
                onClick={() => onBook(selectedProviderId || undefined)}
                disabled={assignedAssistants.length > 0 && !selectedProviderId}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2.5rem] text-xl font-black shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <i className="fa-solid fa-calendar-check"></i>
                {assignedAssistants.length > 0 && !selectedProviderId ? 'Select a Professional' : 'Secure Booking Slot'}
              </button>
              <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Safe Protocol: Discussion first, payment only after work.
              </p>
          </div>
        </div>
      </div>

      {/* Assistant Selection Panel */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
         <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className="text-3xl font-black text-slate-900">Available Professionals</h3>
            <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-4 py-2 rounded-full tracking-widest">
               {assignedAssistants.length} Verified Partners Found
            </span>
         </div>

         {assignedAssistants.length === 0 ? (
           <div className="p-16 bg-slate-50 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl text-slate-300 mx-auto mb-6 shadow-sm"><i className="fa-solid fa-user-clock"></i></div>
              <p className="text-slate-400 font-bold italic">No specialized assistants currently assigned to this specific module.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {assignedAssistants.map(assistant => (
                <button 
                  key={assistant.id}
                  onClick={() => setSelectedProviderId(assistant.id)}
                  className={`p-8 rounded-[3rem] border-2 text-left transition-all flex flex-col relative group ${selectedProviderId === assistant.id ? 'border-indigo-600 bg-indigo-50/50 shadow-xl' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 text-xl font-black border border-slate-100 overflow-hidden shadow-sm">
                        {assistant.photoUrl ? <img src={assistant.photoUrl} className="w-full h-full object-cover" /> : assistant.name.charAt(0)}
                     </div>
                     <div className="flex-grow">
                        <div className="flex items-center justify-between">
                           <h4 className="font-black text-slate-900">{assistant.name}</h4>
                           {assistant.isVerified && <i className="fa-solid fa-circle-check text-indigo-500 text-[10px]"></i>}
                        </div>
                        <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{assistant.headline}</p>
                     </div>
                  </div>

                  <div className="space-y-4 mb-6 flex-grow">
                     <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-[7px] font-black uppercase">{assistant.expLevel}</span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[7px] font-black uppercase">5.0 ★</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{assistant.bio}"</p>
                     <div className="flex flex-wrap gap-1">
                        {assistant.strengths.slice(0, 3).map(s => <span key={s} className="text-[7px] font-black text-indigo-400 uppercase tracking-widest bg-white border border-indigo-50 px-2 py-0.5 rounded-full">{s}</span>)}
                     </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                     <span className="text-sm font-black text-slate-900">{assistant.price}</span>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedProviderId === assistant.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-200'}`}>
                        <i className="fa-solid fa-check text-[10px]"></i>
                     </div>
                  </div>

                  {selectedProviderId === assistant.id && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-scale-in">
                       <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </button>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default ServiceDetail;
