
import React, { useState, useMemo } from 'react';
import { Book, BookStatus } from '../types';

interface AdminBookManagerProps {
  books: Book[];
  onUpdateBooks: (bk: Book[]) => void;
}

type BookTab = 'Requests' | 'Buying' | 'Active' | 'Library' | 'Returns' | 'Borrowers' | 'Rules' | 'Reports';

const AdminBookManager: React.FC<AdminBookManagerProps> = ({ books, onUpdateBooks }) => {
  const [activeTab, setActiveTab] = useState<BookTab>('Requests');

  const updateStatus = (id: string, next: BookStatus) => {
    onUpdateBooks(books.map(b => b.id === id ? { ...b, status: next } : b));
  };

  const tabs: {id: BookTab, icon: string, color: string}[] = [
    { id: 'Requests', icon: 'fa-envelope-open-text', color: 'indigo' },
    { id: 'Buying', icon: 'fa-cart-shopping', color: 'orange' },
    { id: 'Active', icon: 'fa-hand-holding-heart', color: 'green' },
    { id: 'Library', icon: 'fa-book-atlas', color: 'blue' },
    { id: 'Returns', icon: 'fa-rotate-left', color: 'red' },
    { id: 'Borrowers', icon: 'fa-users', color: 'purple' },
    { id: 'Rules', icon: 'fa-gavel', color: 'slate' },
    { id: 'Reports', icon: 'fa-chart-line', color: 'emerald' },
  ];

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Side Tab Nav */}
      <div className="md:w-20 flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
        {tabs.map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            title={t.id}
            className={`w-14 h-14 min-w-[3.5rem] rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm ${activeTab === t.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:text-slate-600'}`}
          >
            <i className={`fa-solid ${t.icon}`}></i>
          </button>
        ))}
      </div>

      <div className="flex-grow bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 min-h-[600px] flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab} Manager</h3>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Book Borrow Service v3.0</p>
          </div>
          <div className="text-right">
             <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">On-Demand Flow</span>
          </div>
        </div>

        {activeTab === 'Requests' && (
          <div className="space-y-4">
            {books.filter(b => b.status === 'Requested').length === 0 ? (
              <p className="text-slate-400 font-bold italic py-20 text-center">No new requests pending.</p>
            ) : (
              books.filter(b => b.status === 'Requested').map(book => (
                <div key={book.id} className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between group">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{book.title}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">By {book.author}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-white px-3 py-1 rounded-full text-[9px] font-black uppercase border border-slate-200">User: {book.customerName}</span>
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{book.borrowDuration} Days</span>
                    </div>
                  </div>
                  <button onClick={() => updateStatus(book.id, 'Approved')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100">Approve Request</button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Buying' && (
          <div className="space-y-4">
            {books.filter(b => b.status === 'Approved').map(book => (
              <div key={book.id} className="p-8 border-2 border-orange-50 bg-orange-50/20 rounded-[2.5rem] flex items-center justify-between">
                <div>
                   <h4 className="text-xl font-black text-orange-900">{book.title}</h4>
                   <p className="text-xs font-bold text-orange-400 uppercase">Waitlist: {book.customerName}</p>
                </div>
                <button onClick={() => updateStatus(book.id, 'Purchased')} className="px-8 py-3 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">Mark as Purchased</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Active' && (
           <div className="space-y-4">
              {books.filter(b => b.status === 'Borrowed').map(book => (
                <div key={book.id} className="p-8 bg-white border border-green-100 rounded-[2.5rem] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl"><i className="fa-solid fa-book-reader"></i></div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900">{book.title}</h4>
                      <p className="text-xs font-black text-green-600 uppercase">Due: {book.dueDate || '7 Days'}</p>
                    </div>
                  </div>
                  <button onClick={() => updateStatus(book.id, 'Returned')} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Confirm Return</button>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'Library' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.filter(b => b.status === 'Purchased').map(book => (
                <div key={book.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <h4 className="font-black text-slate-900">{book.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">In Inventory</p>
                   <button onClick={() => updateStatus(book.id, 'Borrowed')} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase">Assign to Client</button>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'Rules' && (
          <div className="space-y-8 animate-fade-in">
             <div className="p-8 bg-slate-900 text-white rounded-[2.5rem]">
                <h4 className="font-black mb-6 text-indigo-400">Library Policy Dashboard</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-white/10"><span className="text-xs font-bold uppercase tracking-widest">Max Books / User</span><span className="font-black text-xl">3</span></div>
                   <div className="flex justify-between items-center py-2 border-b border-white/10"><span className="text-xs font-bold uppercase tracking-widest">Standard Deposit</span><span className="font-black text-xl">KES 200</span></div>
                   <div className="flex justify-between items-center py-2"><span className="text-xs font-bold uppercase tracking-widest">Late Fee / Day</span><span className="font-black text-xl">KES 50</span></div>
                </div>
             </div>
             <p className="text-sm font-medium text-slate-400 italic">Rules are applied to all new requests automatically.</p>
          </div>
        )}

        {/* Other tabs can be empty placeholders or detailed views depending on use case */}
        {['Returns', 'Borrowers', 'Reports'].includes(activeTab) && (
          <div className="flex-grow flex items-center justify-center text-center py-20">
            <div>
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Analytical Tab Coming in v3.1</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminBookManager;
