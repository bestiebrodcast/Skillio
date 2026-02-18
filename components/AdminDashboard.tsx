
import React, { useState, useMemo } from 'react';
import { Service, Booking, Book, ActivityLog, Review, ProviderApplication, UserProfile, Category, BookingStatus, ProviderStatus, TaskerSubmissionStatus } from '../types';

interface AdminDashboardProps {
  services: Service[];
  bookings: Booking[];
  reviews: Review[];
  books: Book[];
  applications: ProviderApplication[];
  activityLogs: ActivityLog[];
  allUsers?: UserProfile[]; // Added to see users for portfolio review
  onUpdateServices: (s: Service[]) => void;
  onUpdateBookings: (b: Booking[]) => void;
  onUpdateBookingStatus: (id: string, status: BookingStatus) => void;
  onUpdateBooks: (bk: Book[]) => void;
  onUpdateReviews: (rvs: Review[]) => void;
  onUpdateApplicationStatus: (id: string, status: ProviderStatus) => void;
  onUpdateApplicationFeedback: (id: string, feedback: string) => void;
  onUpdateUserProfile?: (profile: UserProfile) => void; // Added for portfolio updates
  onAssignProvider: (serviceId: string, providerId: string) => void;
}

type AdminTab = 'Bookings' | 'Treasury' | 'Submissions' | 'Talent' | 'Logs' | 'Calendar';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  services, bookings, reviews, books, applications, activityLogs, allUsers = [], onUpdateServices, onUpdateBookings, onUpdateBookingStatus, onUpdateReviews, onUpdateBooks, onUpdateApplicationStatus, onUpdateApplicationFeedback, onUpdateUserProfile, onAssignProvider
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('Bookings');
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  
  // Filter states
  const [bookingFilter, setBookingFilter] = useState({ date: '', service: '', tasker: '' });
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.user === 'K' && credentials.pass === '2026') setIsUnlocked(true);
    else alert("Invalid Credentials.");
  };

  const treasuryStats = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'Completed' || b.paymentStatus === 'Paid to Escrow');
    const totalPaid = completed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const platformFees = Math.round(totalPaid * 0.15);
    const taskerPayouts = totalPaid - platformFees;
    return { totalPaid, platformFees, taskerPayouts };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchDate = !bookingFilter.date || b.date === bookingFilter.date;
      const matchService = !bookingFilter.service || b.serviceTitle.toLowerCase().includes(bookingFilter.service.toLowerCase());
      const matchTasker = !bookingFilter.tasker || b.providerName?.toLowerCase().includes(bookingFilter.tasker.toLowerCase());
      return matchDate && matchService && matchTasker;
    });
  }, [bookings, bookingFilter]);

  // Find taskers who have submitted their portfolios for review
  const pendingPortfolios = useMemo(() => {
    return allUsers.filter(u => u.taskerProfileSettings?.tasker_submission_status === 'submitted');
  }, [allUsers]);

  const handlePortfolioAction = (userId: string, status: TaskerSubmissionStatus | 'changes_required', feedback: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user && user.taskerProfileSettings && onUpdateUserProfile) {
      const updatedUser: UserProfile = {
        ...user,
        taskerProfileSettings: {
          ...user.taskerProfileSettings,
          tasker_submission_status: status === 'changes_required' ? 'draft' : status, // internal state is draft if changes required
          // We can use a custom property for portfolio feedback since it's not in base ProviderApplication
        }
      };
      // For this implementation, we reuse adminFeedback in the application record if it exists
      const app = applications.find(a => a.userId === userId);
      if (app) {
        onUpdateApplicationFeedback(app.id, feedback);
        if (status === 'changes_required') {
           onUpdateApplicationStatus(app.id, 'changes_required');
        }
      }
      onUpdateUserProfile(updatedUser);
      alert(`Portfolio ${status === 'approved' ? 'Approved' : 'Feedback Sent'}!`);
    }
  };

  if (!isUnlocked) return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 className="text-3xl font-black mb-2">Owner Access</h2>
        <p className="text-slate-400 text-sm font-medium mb-8">Enter your secure credentials to manage Skillio.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none font-bold" type="text" placeholder="Username" onChange={e => setCredentials({...credentials, user: e.target.value})} />
          <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold" type="password" placeholder="Password" onChange={e => setCredentials({...credentials, pass: e.target.value})} />
          <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all">Unlock Hub</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative animate-fade-in flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 h-auto md:h-screen sticky top-0 z-50 flex flex-col">
        <div className="p-8 border-b border-slate-100">
           <div className="skillio-logo text-2xl flex items-baseline tracking-tight mb-2">
            <span style={{ color: '#ff6b6b' }}>s</span>
            <span style={{ color: '#feca57' }}>k</span>
            <span style={{ color: '#ff9ff3' }}>i</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#5f27cd' }}>l</span>
            <span style={{ color: '#48dbfb' }}>i</span>
            <span style={{ color: '#1e293b' }}>o</span>
            <span className="ml-2 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Admin</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Control Centre</p>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
          {(['Bookings', 'Treasury', 'Submissions', 'Talent', 'Calendar', 'Logs'] as AdminTab[]).map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === t 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid w-5 ${
                t === 'Bookings' ? 'fa-calendar-check' :
                t === 'Treasury' ? 'fa-vault' :
                t === 'Submissions' ? 'fa-paper-plane' :
                t === 'Talent' ? 'fa-users-viewfinder' :
                t === 'Calendar' ? 'fa-calendar-days' : 'fa-list-ul'
              }`}></i>
              {t}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
           <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all">
             <i className="fa-solid fa-power-off"></i> Logout
           </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-10 max-w-full overflow-x-hidden">
        
        {activeTab === 'Bookings' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platform Bookings</h2>
                <p className="text-slate-500 font-medium">Monitor every task happening across the Skillio network.</p>
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <input 
                  type="date" 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  value={bookingFilter.date}
                  onChange={e => setBookingFilter({...bookingFilter, date: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Filter Service..." 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  value={bookingFilter.service}
                  onChange={e => setBookingFilter({...bookingFilter, service: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Filter Tasker..." 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  value={bookingFilter.tasker}
                  onChange={e => setBookingFilter({...bookingFilter, tasker: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasker</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 font-black text-indigo-600 text-sm">{b.id}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900 text-sm">{b.serviceTitle}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">KES {b.totalPrice?.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-700">{b.providerName || 'Unassigned'}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-500">{b.customerName}</td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase">{b.date} <span className="block text-slate-300">{b.startTime}</span></td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          b.status === 'Completed' ? 'bg-green-100 text-green-600' :
                          b.status === 'Requested' ? 'bg-indigo-100 text-indigo-600' :
                          b.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-black italic uppercase text-xs tracking-widest">No bookings found for these filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Treasury' && (
          <div className="space-y-10 animate-fade-in">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Skillio Treasury</h2>
              <p className="text-slate-500 font-medium">Financial overview and payout management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Total App Flow</p>
                <h3 className="text-5xl font-black tracking-tighter">KES {treasuryStats.totalPaid.toLocaleString()}</h3>
                <p className="text-xs text-slate-500 mt-4 font-bold uppercase tracking-widest">Gross Managed Funds</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Platform Earnings (15%)</p>
                  <h3 className="text-5xl font-black text-green-600 tracking-tighter">KES {treasuryStats.platformFees.toLocaleString()}</h3>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Net Cleared Revenue</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tasker Obligations (85%)</p>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter">KES {treasuryStats.taskerPayouts.toLocaleString()}</h3>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pending & Cleared Payouts</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-black text-slate-900">Tasker Payout Queue</h4>
                <button className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Export for M-Pesa Bulk</button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-6">Job Ref</th>
                    <th className="px-8 py-6">Tasker</th>
                    <th className="px-8 py-6">Gross Amount</th>
                    <th className="px-8 py-6">To Pay (85%)</th>
                    <th className="px-8 py-6">Payment Status</th>
                    <th className="px-8 py-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.filter(b => b.status === 'Completed').map(b => (
                    <tr key={b.id}>
                      <td className="px-8 py-6 font-bold text-sm text-slate-900">{b.id}</td>
                      <td className="px-8 py-6 font-black text-slate-700 text-sm">{b.providerName}</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-400">KES {b.totalPrice.toLocaleString()}</td>
                      <td className="px-8 py-6 font-black text-indigo-600 text-lg">KES {Math.round(b.totalPrice * 0.85).toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          b.paymentStatus === 'Released to Tasker' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                        }`}>{b.paymentStatus}</span>
                      </td>
                      <td className="px-8 py-6">
                        {b.paymentStatus === 'Paid to Escrow' && (
                          <button 
                            onClick={() => {
                              onUpdateBookings(bookings.map(book => book.id === b.id ? {...book, paymentStatus: 'Released to Tasker'} : book));
                            }}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all"
                          >Mark Paid</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Submissions' && (
          <div className="space-y-12 animate-fade-in">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Review Queue</h2>
              <p className="text-slate-500 font-medium">Manage submitted tasker applications and portfolio edits.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Tasker Applications */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><i className="fa-solid fa-user-plus text-sm"></i></span>
                  Identity Submissions
                </h3>
                {applications.filter(a => a.status === 'applied' || a.status === 'changes_required').length === 0 ? (
                  <div className="p-20 bg-white border border-dashed border-slate-200 rounded-[2.5rem] text-center text-slate-400 font-black uppercase text-xs tracking-widest">No pending applications.</div>
                ) : (
                  applications.filter(a => a.status === 'applied' || a.status === 'changes_required').map(app => (
                    <div key={app.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
                       <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900">{app.userName}</h4>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Submitted: {app.submissionTimestamp?.split('T')[0] || app.appliedDate}</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${app.status === 'changes_required' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600 animate-pulse'}`}>
                             {app.status === 'changes_required' ? 'Changes Requested' : 'Awaiting Review'}
                          </span>
                       </div>
                       <div className="space-y-4">
                          <div className="p-4 bg-slate-50 rounded-2xl text-sm font-medium text-slate-600 italic">"{app.experience}"</div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="text-xs font-bold text-slate-400 uppercase">Contact: <span className="text-slate-900 font-black block">{app.userPhone}</span></div>
                             <div className="text-xs font-bold text-slate-400 uppercase">Email: <span className="text-slate-900 font-black block">{app.userEmail}</span></div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {app.skills.map(s => <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">{s}</span>)}
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Request Changes (Reason)</label>
                          <textarea 
                            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none text-sm font-medium" 
                            placeholder="Type exactly what needs to be changed..."
                            value={feedbackInput[app.id] || ''}
                            onChange={e => setFeedbackInput({...feedbackInput, [app.id]: e.target.value})}
                          />
                       </div>
                       <div className="flex gap-3 pt-4">
                          <button 
                            onClick={() => {
                              onUpdateApplicationFeedback(app.id, feedbackInput[app.id] || "Application approved! Welcome to the team.");
                              onUpdateApplicationStatus(app.id, 'approved');
                            }}
                            className="flex-grow py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-green-600 transition-all"
                          >Approve</button>
                          <button 
                            onClick={() => {
                              if (!feedbackInput[app.id]) return alert("Please provide feedback for what needs changing.");
                              onUpdateApplicationFeedback(app.id, feedbackInput[app.id]);
                              onUpdateApplicationStatus(app.id, 'changes_required');
                            }}
                            className="px-6 py-4 bg-orange-50 text-orange-600 rounded-2xl font-black uppercase text-xs tracking-widest border border-orange-100 hover:bg-orange-100 transition-all"
                          >Request Changes</button>
                       </div>
                    </div>
                  ))
                )}
              </div>

              {/* Portfolio Submissions */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><i className="fa-solid fa-layer-group text-sm"></i></span>
                  Portfolio Submissions
                </h3>
                {pendingPortfolios.length === 0 ? (
                  <div className="p-20 bg-white border border-dashed border-slate-200 rounded-[2.5rem] text-center text-slate-400 font-black uppercase text-xs tracking-widest">No portfolios pending review.</div>
                ) : (
                  pendingPortfolios.map(user => (
                    <div key={user.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
                       <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900">{user.taskerProfileSettings?.displayName || user.name}</h4>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Portfolio Module Audit</p>
                          </div>
                          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                             Pending Activation
                          </span>
                       </div>
                       
                       <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Proposed Services</p>
                          <div className="space-y-2">
                             {user.taskerProfileSettings?.offeredServices.map(s => (
                               <div key={s.id} className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-700">{s.title}</span>
                                  <span className="font-black text-indigo-600">KES {s.price} / {s.priceType}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Audit Feedback</label>
                          <textarea 
                            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none text-sm font-medium" 
                            placeholder="Reason for change request (e.g. Price too high for yard work)..."
                            value={feedbackInput[user.id] || ''}
                            onChange={e => setFeedbackInput({...feedbackInput, [user.id]: e.target.value})}
                          />
                       </div>

                       <div className="flex gap-3 pt-4">
                          <button 
                            onClick={() => handlePortfolioAction(user.id, 'approved', feedbackInput[user.id] || "Your portfolio is excellent and now live!")}
                            className="flex-grow py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-green-600 transition-all"
                          >Approve & Go Live</button>
                          <button 
                            onClick={() => {
                              if (!feedbackInput[user.id]) return alert("Please provide feedback for what needs changing.");
                              handlePortfolioAction(user.id, 'changes_required', feedbackInput[user.id]);
                            }}
                            className="px-6 py-4 bg-orange-50 text-orange-600 rounded-2xl font-black uppercase text-xs tracking-widest border border-orange-100 hover:bg-orange-100 transition-all"
                          >Request Changes</button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: TALENT */}
        {activeTab === 'Talent' && (
          <div className="space-y-10 animate-fade-in">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Talent Ecosystem</h2>
              <p className="text-slate-500 font-medium">Manage and monitor verified student taskers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allUsers.filter(u => u.providerStatus === 'approved').map(u => (
                <div key={u.id} className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
                  <div className="p-10 text-center flex-grow">
                     <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                        {u.taskerProfileSettings?.photoUrl ? <img src={u.taskerProfileSettings.photoUrl} className="w-full h-full object-cover rounded-[2rem]" /> : u.name.charAt(0)}
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 mb-1">{u.name}</h4>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">Verified Assistant</p>
                     
                     <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</p>
                           <p className="text-xs font-black text-green-600 uppercase">Active</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Joined</p>
                           <p className="text-xs font-black text-slate-900">{u.joinedDate}</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 flex gap-2">
                     <button className="flex-grow py-3 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all">View Analytics</button>
                     <button 
                       onClick={() => onUpdateApplicationStatus(u.id, 'suspended')}
                       className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Pause</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CALENDAR */}
        {activeTab === 'Calendar' && (
          <div className="space-y-10 animate-fade-in">
             <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platform Calendar</h2>
                <p className="text-slate-500 font-medium">Blackout specific dates for school breaks or platform maintenance.</p>
             </div>

             <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-3xl font-black text-slate-900">Global Bookings Calendar</h3>
                   <div className="flex gap-2">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-600 rounded-full"></div><span className="text-[10px] font-black uppercase text-slate-400">Booked Slot</span></div>
                      <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-[10px] font-black uppercase text-slate-400">Owner Blackout</span></div>
                   </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                     <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{d}</div>
                   ))}
                   {Array.from({ length: 31 }).map((_, i) => (
                     <button key={i} className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center group hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                        <span className="text-lg font-black text-slate-700">{i + 1}</span>
                        <span className="text-[7px] font-black uppercase text-slate-300 group-hover:text-indigo-600">Open Slot</span>
                     </button>
                   ))}
                </div>

                <div className="mt-12 p-8 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg"><i className="fa-solid fa-calendar-xmark"></i></div>
                      <div>
                         <h4 className="text-xl font-black">Admin Blackout Mode</h4>
                         <p className="text-sm text-slate-400 font-medium leading-relaxed">Select dates above to prevent any neighborhood bookings.</p>
                      </div>
                   </div>
                   <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Apply Global Lock</button>
                </div>
             </div>
          </div>
        )}

        {/* TAB: LOGS */}
        {activeTab === 'Logs' && (
          <div className="space-y-10 animate-fade-in">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Audit Trail</h2>
              <p className="text-slate-500 font-medium">Historical record of every critical system and owner action.</p>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                 <h4 className="font-black text-slate-900">System Logs</h4>
               </div>
               <div className="divide-y divide-slate-100">
                  {activityLogs.map(log => (
                    <div key={log.id} className="p-8 flex items-start gap-8 hover:bg-slate-50/50 transition-colors">
                       <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm flex-shrink-0">
                          <i className={`fa-solid ${
                            log.action.includes('PAYMENT') ? 'fa-money-bill-wave text-green-500' : 
                            log.action.includes('Booking') ? 'fa-calendar-check text-indigo-500' :
                            log.action.includes('Profile') ? 'fa-user-gear text-slate-700' : 'fa-info-circle'
                          }`}></i>
                       </div>
                       <div className="flex-grow">
                          <p className="text-sm font-black text-slate-900 mb-1">{log.action}</p>
                          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span className="flex items-center gap-1"><i className="fa-solid fa-clock"></i> {log.timestamp}</span>
                             <span className="flex items-center gap-1"><i className="fa-solid fa-user"></i> BY: {log.user}</span>
                          </div>
                       </div>
                       <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[8px] font-black uppercase">Ref: {log.id}</span>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-black italic uppercase text-xs tracking-widest">No logs recorded yet.</div>
                  )}
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
