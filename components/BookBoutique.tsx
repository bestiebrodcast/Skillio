
import React, { useState } from 'react';
import { Book, UserProfile } from '../types';

interface BookBoutiqueProps {
  books: Book[];
  onBorrow: (bookData: Partial<Book>) => void;
  onBack: () => void;
  userProfile?: UserProfile;
}

const BookBoutique: React.FC<BookBoutiqueProps> = ({ books, onBorrow, onBack, userProfile }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', duration: 14 as 7 | 14 | 30 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBorrow({
      id: `BK-${Math.floor(Math.random() * 90000)}`,
      title: formData.title,
      author: formData.author,
      customerName: userProfile?.name || 'Guest User',
      customerEmail: userProfile?.email || 'guest@skillio.com',
      status: 'Requested',
      borrowDuration: formData.duration,
      requestDate: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'
    });
    setFormData({ title: '', author: '', duration: 14 });
    setShowRequestForm(false);
  };

  const myBooks = books.filter(b => b.customerEmail === userProfile?.email);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <button onClick={onBack} className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2 hover:text-indigo-600 transition-colors">
            <i className="fa-solid fa-arrow-left"></i> Back to Marketplace
          </button>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">The Reading Corner</h2>
          <p className="text-xl text-slate-500 font-medium">Community Library: Request. Approve. Learn.</p>
        </div>
        <button 
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-4"
        >
          <i className="fa-solid fa-plus"></i>
          Request a Book
        </button>
      </div>

      {showRequestForm && (
        <div className="mb-20 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h3 className="text-3xl font-black text-slate-900 mb-8">What do you want to read?</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Book Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-black text-xl" placeholder="Ex: Harry Potter" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Author Name</label>
              <input required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-black text-xl" placeholder="Ex: J.K. Rowling" />
            </div>
            <div className="md:col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-4">Borrow Duration</label>
               <div className="flex gap-4">
                  {[7, 14, 30].map(d => (
                    <button key={d} type="button" onClick={() => setFormData({...formData, duration: d as any})} className={`flex-grow py-4 rounded-2xl font-black text-lg border-2 transition-all ${formData.duration === d ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-transparent'}`}>
                       {d} Days
                    </button>
                  ))}
               </div>
            </div>
            <button type="submit" className="md:col-span-2 w-full py-6 bg-slate-900 text-white rounded-[2rem] text-2xl font-black shadow-xl hover:bg-black transition-all">Submit Request 🚀</button>
          </form>
        </div>
      )}

      <div className="space-y-12">
        <h3 className="text-3xl font-black text-slate-900">Your Current Library Journey</h3>
        
        {myBooks.length === 0 ? (
          <div className="bg-slate-50 py-32 rounded-[4rem] border-4 border-dashed border-slate-100 text-center">
            <div className="w-24 h-24 bg-white text-slate-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm">
              <i className="fa-solid fa-book"></i>
            </div>
            <p className="text-2xl font-black text-slate-300">Your shelf is empty.</p>
            <p className="text-slate-400 font-medium">Request your first book above to start your reading adventure!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {myBooks.map(book => (
              <div key={book.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
                <div className="h-64 bg-slate-50 relative overflow-hidden p-10 flex items-center justify-center">
                  <div className="w-32 h-44 bg-white rounded-lg shadow-2xl flex items-center justify-center text-5xl text-slate-100 font-black overflow-hidden relative group-hover:scale-110 transition-transform">
                    <img src={book.imageUrl} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:hidden">📖</span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      book.status === 'Requested' ? 'bg-indigo-50 text-indigo-600' :
                      book.status === 'Approved' ? 'bg-orange-50 text-orange-600' :
                      book.status === 'Purchased' ? 'bg-green-50 text-green-600' :
                      book.status === 'Borrowed' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <h4 className="text-2xl font-black text-slate-900 leading-tight mb-2">{book.title}</h4>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-6">{book.author} • {book.borrowDuration} Days</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Ref ID</span>
                      <span className="text-slate-900">{book.id}</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full flex gap-1">
                      {['Requested', 'Approved', 'Purchased', 'Borrowed', 'Returned'].map((s, i) => {
                        const statuses = ['Requested', 'Approved', 'Purchased', 'Borrowed', 'Returned'];
                        const activeIndex = statuses.indexOf(book.status);
                        return <div key={s} className={`h-full flex-grow rounded-full ${i <= activeIndex ? 'bg-indigo-600' : 'bg-slate-100 opacity-20'}`}></div>
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-24 p-12 bg-slate-900 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div>
           <h4 className="text-3xl font-black mb-4">How it works?</h4>
           <div className="space-y-4 max-w-md">
             {[
               { s: '1', t: 'Request', d: 'Tell us what you want to read.' },
               { s: '2', t: 'Approve', d: 'Kyla reviews and approves the choice.' },
               { s: '3', t: 'Buy & Borrow', d: 'We buy the book and hand it to you!' },
             ].map(item => (
               <div key={item.s} className="flex gap-4 items-center">
                 <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-black">{item.s}</span>
                 <p className="text-sm font-medium"><span className="text-indigo-400 font-black mr-2 uppercase text-xs">{item.t}:</span> {item.d}</p>
               </div>
             ))}
           </div>
         </div>
         <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center text-7xl opacity-20">📚</div>
      </div>
    </div>
  );
};

export default BookBoutique;
