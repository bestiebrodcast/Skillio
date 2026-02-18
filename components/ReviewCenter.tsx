
import React, { useState } from 'react';
import { Review, Service } from '../types';

interface ReviewCenterProps {
  reviews: Review[];
  services: Service[];
  onAddReview: (review: Review) => void;
}

const ReviewCenter: React.FC<ReviewCenterProps> = ({ reviews, services, onAddReview }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serviceId: services[0]?.id || '',
    rating: 5,
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.id === formData.serviceId);
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: formData.serviceId,
      serviceTitle: service?.title || 'Unknown Service',
      customerName: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString().split('T')[0],
      isVerified: false,
      isFeatured: false
    };
    onAddReview(newReview);
    setIsFormOpen(false);
    setFormData({ name: '', serviceId: services[0]?.id || '', rating: 5, comment: '' });
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Community Review Center</h2>
            <p className="text-slate-500 font-medium mt-2">Real feedback from our amazing neighborhood families.</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            {isFormOpen ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 mb-12 animate-fade-in">
            <h3 className="text-2xl font-black mb-8 text-slate-900">Tell us about your experience!</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Name</label>
                  <input 
                    type="text" required value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold"
                    placeholder="Ex: Mrs. Henderson"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Service Experience</label>
                  <select 
                    value={formData.serviceId}
                    onChange={e => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold appearance-none"
                  >
                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num} type="button" 
                        onClick={() => setFormData({...formData, rating: num})}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${formData.rating >= num ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-300'}`}
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Detailed Feedback</label>
                  <textarea 
                    required rows={5} value={formData.comment}
                    onChange={e => setFormData({...formData, comment: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-medium"
                    placeholder="How was the service? What did you like most?"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Submit My Review</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1 text-yellow-400 text-sm">
                  {Array.from({ length: review.rating }).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                </div>
                {review.isVerified && (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <i className="fa-solid fa-circle-check"></i> Verified
                  </span>
                )}
              </div>
              <p className="text-slate-600 font-medium italic mb-6 leading-relaxed">"{review.comment}"</p>
              <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-black text-slate-900">{review.customerName}</p>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{review.serviceTitle}</p>
                </div>
                <p className="text-[9px] font-bold text-slate-400">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewCenter;
