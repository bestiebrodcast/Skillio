
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, Booking } from '../types';

interface SupportCenterProps {
  onBack: () => void;
  userProfile: UserProfile;
  bookings: Booking[];
}

type SupportSection = 'Main' | 'RumiChat' | 'FAQs' | 'HowItWorks' | 'BookingsHelp' | 'Payments' | 'Availability' | 'Cancellations' | 'Contact';

const SupportCenter: React.FC<SupportCenterProps> = ({ onBack, userProfile, bookings }) => {
  const [section, setSection] = useState<SupportSection>('Main');
  const [messages, setMessages] = useState<{ role: 'user' | 'rumi'; text: string }[]>([
    { role: 'rumi', text: `Hi ${userProfile.name}! I'm Rumi, your Skillio support friend. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are Rumi, a friendly AI support friend for Skillio, a platform for young entrepreneurs. 
        The CEO of Skillio is Kyla Ndungu, a young girl from Kenya. 
        Your tone is encouraging, clear, and helpful. You help users with questions about how the app works, booking services, and general support. 
        Current user's name is ${userProfile.name}.
        Keep answers simple and suitable for all ages. If asked about technical issues, suggest checking the 'Contact Support' section for human help.
        User question: ${userText}`,
      });

      setMessages(prev => [...prev, { role: 'rumi', text: response.text || "I'm sorry, I'm having a little trouble thinking. Can you try again?" }]);
    } catch (error) {
      console.error("Rumi Error:", error);
      setMessages(prev => [...prev, { role: 'rumi', text: "Oops! My brain hit a little snag. Try asking me something else!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center gap-4 mb-10">
      <button onClick={() => setSection('Main')} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      {section === 'Main' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Support Center</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Rumi Hero Button */}
            <button 
              onClick={() => setSection('RumiChat')}
              className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 rounded-[3rem] text-left relative overflow-hidden group shadow-xl shadow-indigo-100"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-[1.5rem] flex items-center justify-center text-3xl text-white">
                    <i className="fa-solid fa-comment-dots"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Chat with Rumi</h3>
                    <p className="text-indigo-100 font-bold text-sm">Your AI support friend is online!</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform"></div>
            </button>

            {/* Support Topics */}
            {[
              { id: 'FAQs', label: 'Common FAQs', icon: 'fa-circle-question', color: 'text-orange-500', bg: 'bg-orange-50' },
              { id: 'HowItWorks', label: 'How Booking Works', icon: 'fa-wand-magic-sparkles', color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { id: 'BookingsHelp', label: 'My Bookings Help', icon: 'fa-calendar-check', color: 'text-green-500', bg: 'bg-green-50' },
              { id: 'Payments', label: 'Payments & Pricing', icon: 'fa-money-bill-wave', color: 'text-blue-500', bg: 'bg-blue-50' },
              { id: 'Availability', label: 'Location & Availability', icon: 'fa-location-dot', color: 'text-red-500', bg: 'bg-red-50' },
              { id: 'Cancellations', label: 'Changes & Cancellations', icon: 'fa-clock-rotate-left', color: 'text-slate-500', bg: 'bg-slate-50' },
            ].map(topic => (
              <button 
                key={topic.id}
                onClick={() => setSection(topic.id as SupportSection)}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-indigo-100 group"
              >
                <div className={`w-14 h-14 ${topic.bg} ${topic.color} rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${topic.icon}`}></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900">{topic.label}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Learn more</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <h3 className="text-2xl font-black mb-2">Still need help?</h3>
               <p className="text-slate-400 font-medium">Our student team is here to assist you personally.</p>
            </div>
            <button 
              onClick={() => setSection('Contact')}
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-white/5 active:scale-95 transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}

      {section === 'RumiChat' && (
        <div className="h-[700px] flex flex-col animate-fade-in bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSection('Main')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <div>
                <h3 className="font-black text-xl">Rumi AI</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Online & Helpful</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              <i className="fa-solid fa-sparkles"></i>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-6 rounded-[2rem] font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100 flex gap-2">
                  <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 bg-white flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow px-8 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-600 outline-none font-bold transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {section === 'FAQs' && (
        <div className="animate-fade-in">
          {renderSectionHeader('Frequently Asked Questions')}
          <div className="space-y-4">
            {[
              { q: 'Is Skillio safe for my family?', a: 'Yes! All student entrepreneurs are verified members of the local community, and we encourage parent-to-parent communication before any booking begins.' },
              { q: 'How do I pay for a service?', a: 'Payments are currently made directly to the student via Cash, M-Pesa, or Bank Transfer after the job is completed and you are happy!' },
              { q: 'Can I book multiple services at once?', a: 'Absolutely! You can use the marketplace to browse and initiate as many bookings as you need for different tasks.' },
              { q: 'What if I am not happy with the service?', a: 'We value your feedback. Please contact our support team immediately, and we will work with the student to resolve the issue.' },
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all">
                <summary className="p-8 font-black text-slate-900 cursor-pointer list-none flex justify-between items-center group-open:bg-indigo-50/50">
                  {item.q}
                  <i className="fa-solid fa-chevron-down text-slate-300 group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="p-8 pt-0 text-slate-500 font-medium leading-relaxed bg-white">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {section === 'HowItWorks' && (
        <div className="animate-fade-in">
          {renderSectionHeader('How Booking Works')}
          <div className="space-y-12 py-10">
            {[
              { step: '1', title: 'Pick a Service', desc: 'Browse our local marketplace and choose a service that fits your needs.', icon: 'fa-magnifying-glass' },
              { step: '2', title: 'Schedule a Visit', desc: 'Select a date and provide your contact details. Kyla’s automated system takes care of the rest!', icon: 'fa-calendar-days' },
              { step: '3', title: 'Confirmation', desc: 'The student owner will review and confirm your request. You’ll see the status update in your dashboard.', icon: 'fa-check-double' },
              { step: '4', title: 'Real-Time Updates', desc: 'On the day of the job, follow the live tracker to see when the work is starting and finishing.', icon: 'fa-location-crosshairs' },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start relative">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-100 z-10">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'BookingsHelp' && (
        <div className="animate-fade-in">
          {renderSectionHeader('My Bookings Help')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm mb-8">
            <h4 className="font-black text-slate-900 mb-6">Need help with an existing job?</h4>
            <div className="space-y-4">
               {bookings.length === 0 ? (
                 <p className="text-slate-400 font-bold italic">You don't have any bookings yet!</p>
               ) : (
                 bookings.map(b => (
                    <div key={b.id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                      <div>
                        <p className="font-black text-slate-900">{b.serviceTitle}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.date} • {b.id}</p>
                      </div>
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm">Get Help</button>
                    </div>
                 ))
               )}
            </div>
          </div>
          <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
             <p className="text-sm font-bold text-blue-700 flex items-center gap-3"><i className="fa-solid fa-circle-info"></i> Tip: Most scheduling issues can be solved by messaging the student directly!</p>
          </div>
        </div>
      )}

      {section === 'Payments' && (
        <div className="animate-fade-in">
          {renderSectionHeader('Payments & Pricing')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-money-bill-transfer"></i>
              </div>
              <h4 className="font-black text-slate-900 mb-3">Post-Service Payment</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Payment is only requested after the service is delivered and verified by you. No pre-payments are required on the app.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-tags"></i>
              </div>
              <h4 className="font-black text-slate-900 mb-3">Student Pricing</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Our pricing is set by students to be fair and community-friendly. Larger tasks are priced based on home size and complexity.</p>
            </div>
          </div>
          <div className="mt-8 bg-slate-900 text-white p-8 rounded-[2.5rem] text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Accepted Methods</p>
            <p className="text-xl font-black flex items-center justify-center gap-6">
               <span className="flex items-center gap-2"><i className="fa-solid fa-money-bill text-green-400"></i> Cash</span>
               <span className="flex items-center gap-2"><i className="fa-solid fa-mobile-screen text-indigo-400"></i> M-Pesa</span>
               <span className="flex items-center gap-2"><i className="fa-solid fa-building-columns text-blue-400"></i> Bank</span>
            </p>
          </div>
        </div>
      )}

      {section === 'Availability' && (
        <div className="animate-fade-in">
          {renderSectionHeader('Location & Availability')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-2xl">
                <i className="fa-solid fa-earth-africa"></i>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Current Coverage</h4>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Nairobi Metro & Neighborhoods</p>
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Skillio currently serves the local neighborhood and surrounding areas. Students provide their own transport or walk within a safe radius of their homes.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl">
                 <i className="fa-solid fa-circle-check text-green-500"></i>
                 <p className="font-black text-sm text-slate-700">Online Tutoring: Worldwide 🌎</p>
               </div>
               <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl">
                 <i className="fa-solid fa-circle-check text-green-500"></i>
                 <p className="font-black text-sm text-slate-700">Home Cleaning: 5km Radius 🏡</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {section === 'Cancellations' && (
        <div className="animate-fade-in">
          {renderSectionHeader('Changes & Cancellations')}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <h4 className="text-2xl font-black text-slate-900 mb-6">Our Policy</h4>
             <p className="text-slate-500 font-medium leading-relaxed mb-10">
               We understand that plans change! Because our owners are students, we ask for at least <span className="font-black text-slate-900 underline">24 hours notice</span> for any cancellations or rescheduling to help them manage their studies.
             </p>
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xs flex-shrink-0"><i className="fa-solid fa-check"></i></div>
                  <div><p className="font-black text-slate-900">Rescheduling is free</p><p className="text-xs text-slate-400 font-medium">Coordinate a new time directly via the app chat.</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xs flex-shrink-0"><i className="fa-solid fa-xmark"></i></div>
                  <div><p className="font-black text-slate-900">Late Cancellations</p><p className="text-xs text-slate-400 font-medium">Repeated late cancellations may limit your account's booking priority.</p></div>
                </div>
             </div>
          </div>
        </div>
      )}

      {section === 'Contact' && (
        <div className="animate-fade-in">
          {renderSectionHeader('Contact Human Support')}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h4 className="text-2xl font-black text-slate-900 mb-6">Message Us</h4>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert("Message sent! We'll get back to you soon."); setSection('Main'); }}>
                <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" placeholder="Subject" required />
                <textarea className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-medium min-h-[150px]" placeholder="How can we help?" required />
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">Send Message</button>
              </form>
            </div>
            <div className="space-y-6">
               <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-3"><i className="fa-solid fa-clock text-indigo-400"></i> Support Hours</h4>
                  <div className="space-y-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <p className="flex justify-between"><span>Mon - Fri</span> <span className="text-white">9:00 AM - 6:00 PM</span></p>
                    <p className="flex justify-between"><span>Saturday</span> <span className="text-white">10:00 AM - 4:00 PM</span></p>
                    <p className="flex justify-between"><span>Sunday</span> <span className="text-red-400">Closed</span></p>
                  </div>
               </div>
               <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-center gap-6">
                 <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-100"><i className="fa-solid fa-envelope"></i></div>
                 <div>
                   <p className="font-black text-slate-900">Direct Email</p>
                   <p className="text-sm text-indigo-600 font-black">hello@skillio.com</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCenter;
