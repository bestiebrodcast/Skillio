
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, ProviderApplication, Category } from '../types';

interface ProviderApplicationFormProps {
  userProfile: UserProfile;
  existingApplication?: ProviderApplication;
  onSubmit: (app: ProviderApplication) => void;
  onBack: () => void;
}

const CATEGORIES: Category[] = [
  'Learning & Tutoring', 
  'Kids & Child Services', 
  'Home Help & Cleaning', 
  'Creative & Handmade', 
  'Digital & Tech Help', 
  'School & Study Support', 
  'Community & Errands', 
  'Special Programs & Clubs'
];

interface SubService {
  id: string;
  title: string;
  desc: string;
}

const CATEGORY_SERVICES: Record<string, SubService[]> = {
  'Learning & Tutoring': [
    { id: 'lt1', title: 'One-on-One Tutoring (Primary level)', desc: 'Personalized support for primary school students.' },
    { id: 'lt2', title: 'Homework Help Session', desc: 'Assisting with daily school assignments.' },
    { id: 'lt3', title: 'Reading & Literacy Support', desc: 'Improving phonics, fluency, and comprehension.' },
    { id: 'lt4', title: 'Math Practice & Revision', desc: 'Focusing on core math concepts and practice.' },
    { id: 'lt5', title: 'Exam Revision Help', desc: 'Preparing for upcoming school tests.' },
    { id: 'lt6', title: 'Study Skills Coaching', desc: 'Teaching how to organize notes and manage time.' },
    { id: 'lt7', title: 'Group Tutoring (per student)', desc: 'Small group sessions for collaborative learning.' },
    { id: 'lt8', title: 'Online Tutoring Session', desc: 'Safe learning via video call.' },
    { id: 'lt9', title: 'Learning Games Session', desc: 'Making education fun through educational games.' },
    { id: 'lt10', title: 'Subject Catch-Up Support', desc: 'Helping students catch up on missed school topics.' }
  ],
  'Kids & Child Services': [
    { id: 'cs1', title: 'Child Supervision (at home)', desc: 'General supervision in a safe home environment.' },
    { id: 'cs2', title: 'After-School Care', desc: 'Care for children until parents return from work.' },
    { id: 'cs3', title: 'Weekend Child Care', desc: 'Support for working parents during Saturdays/Sundays.' },
    { id: 'cs4', title: 'Short-Term Babysitting', desc: 'Brief care sessions for a few hours.' },
    { id: 'cs5', title: 'Play & Activity Supervision', desc: 'Engaging kids in active play and games.' },
    { id: 'cs6', title: 'Routine Support (snacks, rest, play)', desc: 'Managing daily schedules and basic needs.' },
    { id: 'cs7', title: 'Homework Supervision (not teaching)', desc: 'Monitoring study time to ensure completion.' },
    { id: 'cs8', title: 'Reading Time / Story Time', desc: 'Encouraging a love for books and stories.' },
    { id: 'cs9', title: 'Learning Through Play', desc: 'Educational activities hidden inside play.' },
    { id: 'cs10', title: 'Study Time Monitoring', desc: 'Ensuring focus during designated study hours.' },
    { id: 'cs11', title: 'Basic Skill Practice (reading, counting)', desc: 'Helping with the basics in a friendly way.' },
    { id: 'cs12', title: 'Drawing & Painting Time', desc: 'Supporting artistic creativity.' },
    { id: 'cs13', title: 'DIY Craft Activities', desc: 'Hands-on projects with simple materials.' },
    { id: 'cs14', title: 'Music & Rhythm Play (basic)', desc: 'Exploring sounds and simple instruments.' },
    { id: 'cs15', title: 'Reading Club', desc: 'Group storytelling and sharing.' },
    { id: 'cs16', title: 'Homework Club (light)', desc: 'Working on school tasks with peers.' },
    { id: 'cs17', title: 'Art Club', desc: 'Regular group creative sessions.' },
    { id: 'cs18', title: 'Holiday Activity Program', desc: 'Structured fun during school breaks.' },
    { id: 'cs19', title: 'Weekend Kids Workshop', desc: 'Focused Saturday/Sunday skill sessions.' }
  ],
  'Home Help & Cleaning': [
    { id: 'hc1', title: 'Car washing', desc: 'Exterior and interior cleaning of family vehicles.' },
    { id: 'hc2', title: 'Yard sweeping', desc: 'Keeping compound paths and porches clear.' },
    { id: 'hc3', title: 'Watering plants', desc: 'Care for indoor and outdoor garden areas.' },
    { id: 'hc4', title: 'Dog walking', desc: 'Safe local exercise for community pets.' },
    { id: 'hc5', title: 'Window cleaning', desc: 'Making glass surfaces sparkle.' },
    { id: 'hc6', title: 'Bike washing', desc: 'Detailing bicycles and outdoor gear.' },
    { id: 'hc7', title: 'Laundry folding + Washing', desc: 'Helping with essential clothing care.' },
    { id: 'hc8', title: 'Room tidying', desc: 'Organizing spaces and putting things away.' },
    { id: 'hc9', title: 'Deep room cleaning', desc: 'Thorough dusting and scrubbing.' }
  ],
  'Creative & Handmade': [
    { id: 'cr1', title: 'Creative Lab (Crafting)', desc: 'Bespoke handmade items and creative support.' }
  ],
  'Digital & Tech Help': [
    { id: 'dt1', title: 'Device Setup & First-Time Use', desc: 'Setting up accounts, basic settings, and safety.' },
    { id: 'dt2', title: 'Parental Controls & Child Safety Setup ⭐', desc: 'Screen-time limits and app restrictions.' },
    { id: 'dt3', title: 'Online Class / Learning App Setup', desc: 'Google Classroom, Zoom, and school portals.' },
    { id: 'dt4', title: 'Email & Account Setup (Basic)', desc: 'Creating and organizing professional emails.' },
    { id: 'dt5', title: 'Document Typing & Formatting', desc: 'Formatting letters, forms, and assignments.' },
    { id: 'dt6', title: 'Presentation Creation (Slides Only)', desc: 'Designing clean and simple school presentations.' },
    { id: 'dt7', title: 'Phone / Device Storage Clean-Up', desc: 'Organizing photos and removing unused apps.' },
    { id: 'dt8', title: 'App Installation & Guidance', desc: 'Installing and explaining how to use helpful apps.' },
    { id: 'dt9', title: 'Basic Tech Troubleshooting', desc: 'Helping with Wi-Fi or app settings confusion.' },
    { id: 'dt10', title: 'Canva Basics for School Projects', desc: 'Creating posters and simple graphics.' }
  ],
  'School & Study Support': [
    { id: 'ss1', title: 'Assignment Planning Help', desc: 'Breaking big tasks into manageable steps.' },
    { id: 'ss2', title: 'Study Timetable Setup', desc: 'Creating a balanced weekly learning schedule.' },
    { id: 'ss3', title: 'Note Organisation & Summaries', desc: 'Making notes easier to read and remember.' },
    { id: 'ss4', title: 'Exam Preparation Planning', desc: 'Mapping out revision goals for tests.' },
    { id: 'ss5', title: 'Research Help (Safe Sources)', desc: 'Finding reliable information online safely.' },
    { id: 'ss6', title: 'Study Accountability Partner', desc: 'Being there to ensure focus during study time.' },
    { id: 'ss7', title: 'Time Management Coaching', desc: 'Tips for finishing work without rushing.' },
    { id: 'ss8', title: 'Group Revision Session', desc: 'Hosting peer-to-peer review sessions.' },
    { id: 'ss9', title: 'Online Learning Support', desc: 'Assisting with navigation of digital courses.' },
    { id: 'ss10', title: 'Project Organisation Help', desc: 'Keeping supplies and documents ready for school projects.' }
  ],
  'Community & Errands': [
    { id: 'ce1', title: 'House movers (helper)', desc: 'Assisting with light carrying and packing.' },
    { id: 'ce2', title: 'Elderly helper', desc: 'Friendly assistance with small household tasks.' },
    { id: 'ce3', title: 'Shopping Helper (Groceries)', desc: 'Picking up essentials from local shops.' },
    { id: 'ce4', title: 'Package Pick-Up & Drop-Off', desc: 'Collecting small deliveries locally.' },
    { id: 'ce5', title: 'School Errand Helper ⭐', desc: 'Picking up or dropping off school materials.' },
    { id: 'ce6', title: 'Library Helper', desc: 'Returning or picking up reserved books.' },
    { id: 'ce7', title: 'Queue Assistance', desc: 'Saving time by standing in line for simple services.' },
    { id: 'ce8', title: 'Event Setup Helper', desc: 'Arranging furniture and decorations for events.' },
    { id: 'ce9', title: 'Community Clean-Up Helper', desc: 'Supporting shared space cleanliness.' },
    { id: 'ce10', title: 'Donation Sorting & Packing', desc: 'Organizing items to be given away.' },
    { id: 'ce11', title: 'Local Delivery Helper', desc: 'Delivering light items within walking distance.' },
    { id: 'ce12', title: 'Volunteer Activity Assistant', desc: 'Helping organizers at charity events.' }
  ],
  'Special Programs & Clubs': [
    { id: 'sp1', title: 'After-School Care Program ⭐', desc: 'Supervised care with routines and rest.' },
    { id: 'sp2', title: 'Holiday Care Program', desc: 'Full-day care during school breaks.' },
    { id: 'sp3', title: 'Reading Club (Program)', desc: 'Group storytelling and discussion sessions.' },
    { id: 'sp4', title: 'Homework Club (Program)', desc: 'Supervised peer study and task completion.' },
    { id: 'sp5', title: 'Creative Arts Club', desc: 'Regular guided art and DIY projects.' },
    { id: 'sp6', title: 'Weekend Kids Activity Program', desc: 'Fun weekend schedules for children.' },
    { id: 'sp7', title: 'Study & Focus Time Program', desc: 'Quiet, structured learning blocks.' },
    { id: 'sp8', title: 'Holiday Workshop Series', desc: 'Short-term themed learning intensives.' },
    { id: 'sp9', title: 'Kids Routine Support Program', desc: 'Structured support for daily habits.' },
    { id: 'sp10', title: 'Introductory Tech for Kids', desc: 'Teaching safe and basic device usage.' }
  ]
};

interface PriceRule {
  default: number;
  min: number;
  max: number;
  units: string[];
}

const PRICING_RULES: Record<string, PriceRule> = {
  'Learning & Tutoring': { default: 500, min: 300, max: 2500, units: ['Per Hour', 'Per Session'] },
  'Kids & Child Services': { default: 400, min: 200, max: 3500, units: ['Per Hour', 'Per Day'] },
  'Home Help & Cleaning': { default: 500, min: 200, max: 4000, units: ['Per Hour', 'Per Task', 'Per Day'] },
  'Creative & Handmade': { default: 400, min: 100, max: 10000, units: ['Per Item', 'Per Project'] },
  'Digital & Tech Help': { default: 700, min: 500, max: 5000, units: ['Per Hour', 'Per Task'] },
  'School & Study Support': { default: 600, min: 350, max: 2000, units: ['Per Hour', 'Per Session'] },
  'Community & Errands': { default: 350, min: 100, max: 2000, units: ['Per Task', 'Per Hour'] },
  'Special Programs & Clubs': { default: 800, min: 300, max: 8000, units: ['Per Child', 'Per Session', 'Per Week'] },
};

const ProviderApplicationForm: React.FC<ProviderApplicationFormProps> = ({ userProfile, existingApplication, onSubmit, onBack }) => {
  // If changes required, start at Step 0 (Status Screen)
  const initialStep = existingApplication?.status === 'changes_required' ? 0 : 1;
  const [step, setStep] = useState(initialStep);
  
  const parsePricingStrings = (pricing: Record<string, string>) => {
    const prices: Record<string, number> = {};
    const units: Record<string, string> = {};
    Object.entries(pricing).forEach(([id, str]) => {
      const match = str.match(/KES ([\d,]+) (.+)/);
      if (match) {
        prices[id] = parseInt(match[1].replace(/,/g, ''));
        units[id] = match[2];
      }
    });
    return { prices, units };
  };

  const initialData = useMemo(() => {
    if (existingApplication) {
      const { prices, units } = parsePricingStrings(existingApplication.requestedPricing);
      return {
        email: existingApplication.userEmail,
        phone: existingApplication.userPhone,
        skills: existingApplication.skills,
        specificServices: existingApplication.specificServices || [],
        experience: existingApplication.experience,
        availability: existingApplication.availability,
        requestedPricing: prices,
        requestedUnits: units,
        terms: true
      };
    }
    return {
      email: userProfile.email || '',
      phone: userProfile.phone || '',
      skills: [] as string[], 
      specificServices: [] as string[], 
      experience: '',
      availability: '',
      requestedPricing: {} as Record<string, number>, 
      requestedUnits: {} as Record<string, string>, 
      terms: false
    };
  }, [existingApplication, userProfile]);

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [step]);

  const ALL_SERVICES_MAP = useMemo(() => {
    const map: Record<string, SubService & { category: string }> = {};
    Object.entries(CATEGORY_SERVICES).forEach(([cat, srvs]) => {
      srvs.forEach(s => { map[s.id] = { ...s, category: cat }; });
    });
    return map;
  }, []);

  useEffect(() => {
    const updatedPricing = { ...formData.requestedPricing };
    const updatedUnits = { ...formData.requestedUnits };
    
    formData.specificServices.forEach(srvId => {
      const srvData = ALL_SERVICES_MAP[srvId];
      if (srvData && !updatedPricing[srvId]) {
        updatedPricing[srvId] = PRICING_RULES[srvData.category]?.default || 500;
        updatedUnits[srvId] = PRICING_RULES[srvData.category]?.units[0] || 'Per Hour';
      }
    });
    
    setFormData(prev => ({ 
      ...prev, 
      requestedPricing: updatedPricing,
      requestedUnits: updatedUnits
    }));
  }, [formData.specificServices, ALL_SERVICES_MAP]);

  const hasPricingErrors = () => {
    return formData.specificServices.some(srvId => {
      const srvData = ALL_SERVICES_MAP[srvId];
      if (!srvData) return false;
      const price = formData.requestedPricing[srvId];
      const rule = PRICING_RULES[srvData.category];
      return rule && (price > rule.max || price < rule.min);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPricingErrors()) return;

    const pricingStrings: Record<string, string> = {};
    formData.specificServices.forEach(srvId => {
      const price = formData.requestedPricing[srvId];
      const unit = formData.requestedUnits[srvId];
      pricingStrings[srvId] = `KES ${price.toLocaleString()} ${unit}`;
    });

    const appToSubmit: ProviderApplication = {
      id: existingApplication?.id || `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userProfile.id,
      userName: userProfile.name,
      userEmail: formData.email,
      userPhone: formData.phone,
      skills: formData.skills,
      specificServices: formData.specificServices,
      experience: formData.experience,
      availability: formData.availability,
      requestedPricing: pricingStrings,
      status: 'applied',
      appliedDate: existingApplication?.appliedDate || new Date().toISOString().split('T')[0],
      submissionTimestamp: new Date().toISOString(),
      adminFeedback: '' 
    };
    onSubmit(appToSubmit);
    setStep(7); 
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(cat) ? prev.skills.filter(s => s !== cat) : [...prev.skills, cat]
    }));
  };

  const toggleSpecificService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      specificServices: prev.specificServices.includes(serviceId) ? prev.specificServices.filter(id => id !== serviceId) : [...prev.specificServices, serviceId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-20 animate-fade-in relative z-10">
      
      {step === 0 && (
         <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 p-12 md:p-16 text-center animate-fade-in">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl">
               <i className="fa-solid fa-user-pen"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Status: Changes Required</h2>
            <div className="max-w-xl mx-auto p-8 bg-orange-50 border-2 border-orange-100 rounded-[2.5rem] text-left mb-10">
               <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">Owner Feedback</p>
               <p className="text-orange-900 font-bold leading-relaxed italic">"{existingApplication?.adminFeedback}"</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={onBack} className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all">Not Now</button>
               <button onClick={() => setStep(2)} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"><i className="fa-solid fa-edit"></i> Edit Application</button>
            </div>
         </div>
      )}

      {step > 0 && step < 7 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Talent Onboarding</h2>
             <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">Step {step} of 6</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full flex gap-1">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className={`h-full flex-grow rounded-full transition-all duration-700 ${step >= i ? 'bg-indigo-600' : 'bg-slate-200 opacity-30'}`}></div>
             ))}
          </div>
        </div>
      )}

      {step > 0 && step < 7 && (
        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-visible min-h-[500px] flex flex-col">
          {step === 1 && (
            <div className="animate-fade-in space-y-10 flex flex-col flex-grow">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-100">
                 <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">The Talent Blueprint</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                  Skillio is built on trust and community excellence. Before you apply, please understand our core provider values:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-black text-slate-900 mb-2">Punctuality</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Always arrive 5 minutes early. Time management is a core business skill.</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-black text-slate-900 mb-2">Safety First</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Never enter a home alone. Always follow platform safety guidelines.</p>
                 </div>
              </div>
              <div className="pt-8 mt-auto border-t border-slate-50 flex justify-between">
                 <button onClick={onBack} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Return Home</button>
                 <button onClick={() => setStep(2)} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Begin Application</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-10 flex flex-col flex-grow">
              <h3 className="text-3xl font-black text-slate-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Professional Email</label>
                  <input type="email" required className="w-full px-8 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">M-Pesa Phone Number</label>
                  <input type="tel" required className="w-full px-8 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4 flex-grow">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Experience Mapping</label>
                 <textarea className="w-full p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent focus:border-indigo-600 outline-none font-medium min-h-[150px]" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between">
                 <button onClick={() => setStep(initialStep)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                 <button onClick={() => setStep(3)} disabled={!formData.experience || !formData.email || !formData.phone} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Select Categories</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-10 flex flex-col flex-grow">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Main Service Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                 {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => toggleCategory(cat)} className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${formData.skills.includes(cat) ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-slate-50 border-slate-50'}`}>
                      <div><h4 className={`font-black text-sm uppercase tracking-widest ${formData.skills.includes(cat) ? 'text-indigo-600' : 'text-slate-600'}`}>{cat}</h4></div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${formData.skills.includes(cat) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}><i className="fa-solid fa-check text-[10px]"></i></div>
                    </button>
                 ))}
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between">
                 <button onClick={() => setStep(2)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                 <button onClick={() => setStep(4)} disabled={formData.skills.length === 0} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Choose Detailed Services</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in space-y-10 flex flex-col flex-grow">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Services by Category</h3>
              <div className="space-y-12 flex-grow">
                 {formData.skills.map(cat => (
                   <div key={cat} className="space-y-6">
                      <div className="flex items-center gap-4"><h4 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">{cat}</h4><div className="h-px bg-slate-100 flex-grow"></div></div>
                      <div className="grid grid-cols-1 gap-4">
                         {CATEGORY_SERVICES[cat]?.map(service => (
                           <button key={service.id} onClick={() => toggleSpecificService(service.id)} className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-start gap-5 ${formData.specificServices.includes(service.id) ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50 border-slate-50'}`}>
                              <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${formData.specificServices.includes(service.id) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-200 border border-slate-100'}`}><i className="fa-solid fa-check text-[10px]"></i></div>
                              <div><p className={`font-black text-sm ${formData.specificServices.includes(service.id) ? 'text-indigo-900' : 'text-slate-700'}`}>{service.title}</p><p className="text-xs text-slate-400 mt-1">{service.desc}</p></div>
                           </button>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between">
                 <button onClick={() => setStep(3)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                 <button onClick={() => setStep(5)} disabled={formData.specificServices.length === 0} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Availability</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in space-y-10 flex flex-col flex-grow">
              <h3 className="text-3xl font-black text-slate-900">Availability Profile</h3>
              <div className="space-y-8 flex-grow">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">When are you typically free?</label>
                 <input className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" placeholder="e.g. Weekends only..." value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} required />
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between">
                 <button onClick={() => setStep(4)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                 <button onClick={() => setStep(6)} disabled={!formData.availability} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Set Pricing Strategy</button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-fade-in space-y-10 flex flex-col flex-grow">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Pricing Strategy</h3>
              <div className="space-y-10 flex-grow">
                 {formData.skills.map(cat => {
                   const servicesInCat = formData.specificServices.filter(sid => ALL_SERVICES_MAP[sid]?.category === cat);
                   if (servicesInCat.length === 0) return null;
                   return (
                     <div key={cat} className="space-y-6">
                        <div className="flex items-center gap-4"><h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{cat}</h4><div className="h-px bg-slate-100 flex-grow"></div></div>
                        {servicesInCat.map(srvId => {
                          const rule = PRICING_RULES[cat];
                          return (
                            <div key={srvId} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <h5 className="font-black text-slate-900">{ALL_SERVICES_MAP[srvId].title}</h5>
                              <div className="flex gap-4">
                                <div className="w-28"><label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Rate</label><input type="number" value={formData.requestedPricing[srvId] || rule.default} onChange={(e) => setFormData({...formData, requestedPricing: {...formData.requestedPricing, [srvId]: parseInt(e.target.value) || 0}})} className="w-full px-4 py-2 rounded-xl bg-white border-2 border-slate-100 focus:border-indigo-600 outline-none font-black text-right" /></div>
                                <div className="w-32"><label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Billing</label><select value={formData.requestedUnits[srvId] || rule.units[0]} onChange={(e) => setFormData({...formData, requestedUnits: {...formData.requestedUnits, [srvId]: e.target.value}})} className="w-full px-4 py-2 rounded-xl bg-white border-2 border-slate-100 outline-none font-black text-xs appearance-none">{rule.units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                              </div>
                            </div>
                          );
                        })}
                     </div>
                   );
                 })}
              </div>
              <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
                 <input type="checkbox" id="terms" className="mt-1.5 w-5 h-5 accent-indigo-600" checked={formData.terms} onChange={e => setFormData(prev => ({ ...prev, terms: e.target.checked }))} required />
                 <label htmlFor="terms" className="text-sm font-medium text-indigo-900 leading-relaxed">I confirm that these rates are fair and I agree to the platform holding client payments in M-Pesa escrow.</label>
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between">
                 <button onClick={() => setStep(5)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                 <button onClick={handleSubmit} disabled={!formData.terms || hasPricingErrors()} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Resubmit for Review 🚀</button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 7 && (
        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 p-12 text-center animate-fade-in flex flex-col items-center justify-center flex-grow min-h-[500px]">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center text-4xl mb-8 shadow-xl shadow-green-100 animate-scale-in"><i className="fa-solid fa-paper-plane-circle-check"></i></div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Resubmitted!</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
            Kyla and the Owner committee have received your updated details. We will review them shortly.
          </p>
          <button onClick={onBack} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Back to Marketplace</button>
        </div>
      )}
    </div>
  );
};

export default ProviderApplicationForm;
