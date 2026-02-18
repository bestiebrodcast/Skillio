
import React, { useState, useEffect } from 'react';
import { Service, Category, View, Review, UserProfile } from '../types';
import ReviewCenter from './ReviewCenter';

interface HomeProps {
  services: Service[];
  reviews: Review[];
  userProfile: UserProfile;
  onSelectService: (service: Service) => void;
  onSelectCategory: (category: Category) => void; 
  onNavigate: (view: View) => void;
  onAddReview: (review: Review) => void;
}

const Home: React.FC<HomeProps> = ({ services, reviews, userProfile, onSelectService, onSelectCategory, onNavigate, onAddReview }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const categories: (Category | 'All')[] = [
    'All',
    'Learning & Tutoring',
    'Kids & Child Services',
    'Home Help & Cleaning',
    'Creative & Handmade',
    'Digital & Tech Help',
    'School & Study Support',
    'Community & Errands',
    'Special Programs & Clubs'
  ];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const isTasker = userProfile.providerStatus === 'approved';

  return (
    <div className="animate-fade-in block w-full">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
            Future Business Leaders Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
            Explore <span className="skillio-logo inline-flex">
              <span style={{ color: '#ff6b6b' }}>s</span>
              <span style={{ color: '#feca57' }}>k</span>
              <span style={{ color: '#ff9ff3' }}>i</span>
              <span style={{ color: '#5f27cd' }}>l</span>
              <span style={{ color: '#5f27cd' }}>l</span>
              <span style={{ color: '#48dbfb' }}>i</span>
              <span style={{ color: '#ffffff' }}>o</span>
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-indigo-300 mb-8 tracking-tight italic">
            “Where Young Ideas Become Real.”
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl text-lg font-black hover:bg-slate-100 transition-all shadow-xl active:scale-95"
            >
              Discover Talent
            </button>
            
            {!isTasker && (
              <button 
                onClick={() => onNavigate('ApplyProvider')}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3"
              >
                <i className="fa-solid fa-user-plus"></i>
                Become an Approved Assistant
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Join the Talent Pool Section */}
      {!isTasker && (
        <section className="bg-white py-12 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4">
             <div className="bg-indigo-50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">
                      <i className="fa-solid fa-briefcase"></i>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900">Neighborhood Opportunities</h2>
                      <p className="text-slate-500 font-medium">Join our verified assistant pool and help your neighbors with local tasks.</p>
                   </div>
                </div>
                <button 
                  onClick={() => onNavigate('ApplyProvider')}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all relative z-10"
                >
                  Start Application
                </button>
             </div>
          </div>
        </section>
      )}

      {/* Category Discovery Section */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 py-20 block">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Browse by Role</h2>
          <p className="text-slate-500 font-medium">Find specialized student professionals by their expertise.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
           {categories.filter(c => c !== 'All').map(cat => (
             <button 
               key={cat} 
               onClick={() => onSelectCategory(cat as Category)}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-600 transition-all group text-left flex flex-col h-full"
             >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <i className={`fa-solid ${
                    cat === 'Learning & Tutoring' ? 'fa-book-open-reader' :
                    cat === 'Kids & Child Services' ? 'fa-baby-carriage' :
                    cat === 'Home Help & Cleaning' ? 'fa-broom' :
                    cat === 'Creative & Handmade' ? 'fa-palette' :
                    cat === 'Digital & Tech Help' ? 'fa-laptop-code' :
                    cat === 'School & Study Support' ? 'fa-pencil' :
                    cat === 'Community & Errands' ? 'fa-person-walking' : 'fa-star'
                  }`}></i>
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest leading-tight mb-2 flex-grow">{cat}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Find Taskers <i className="fa-solid fa-arrow-right ml-1"></i></p>
             </button>
           ))}
        </div>

        <div className="mb-12">
          <p className="text-pink-500 font-black text-xs uppercase tracking-widest mb-3">Part of the Skillio fam.💖</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Popular Market Modules</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-slate-400">Coming Soon!</h3>
            <p className="text-slate-400 max-w-xs mx-auto">We don't have services in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                <div className="h-60 overflow-hidden relative">
                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 backdrop-blur shadow-lg px-4 py-1.5 rounded-full text-[10px] font-black text-slate-800 tracking-wider uppercase">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-2xl font-black text-slate-900">{service.price}</span>
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Flagship: Part of the Skillio Family Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-200 block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Part of the Skillio Family</h2>
            <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium mt-6 max-w-xl mx-auto">Explore our three flagship service collections that defined where we started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* card 1: Expert Tutoring */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-violet-100 text-violet-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 group-hover:rotate-6 transition-transform">
                  <i className="fa-solid fa-graduation-cap"></i>
               </div>
               <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.3em] mb-3">Legacy Module</span>
               <h3 className="text-2xl font-black text-slate-900 mb-4">Expert Tutoring</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">Advanced learning support for primary students. Personalized revision, math practice, and reading literacy.</p>
               <button 
                onClick={() => onSelectCategory('Learning & Tutoring')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-violet-600 transition-colors"
               >
                 Discover Tutors
               </button>
            </div>

            {/* card 2: Home & Yard Help */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-ocean-100 text-ocean-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 group-hover:rotate-6 transition-transform">
                  <i className="fa-solid fa-house-chimney-window"></i>
               </div>
               <span className="text-[10px] font-black text-ocean-500 uppercase tracking-[0.3em] mb-3">Service Module</span>
               <h3 className="text-2xl font-black text-slate-900 mb-4">Home & Yard Help</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">From yard sweeping to car washing and plant care. Professional help to keep your family home sparkling.</p>
               <button 
                onClick={() => onNavigate('CleaningHub')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-ocean-600 transition-colors"
               >
                 Direct Booking
               </button>
            </div>

            {/* card 3: The Reading Corner */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-coral-100 text-coral-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 group-hover:rotate-6 transition-transform">
                  <i className="fa-solid fa-book-open"></i>
               </div>
               <span className="text-[10px] font-black text-coral-500 uppercase tracking-[0.3em] mb-3">Community Hub</span>
               <h3 className="text-2xl font-black text-slate-900 mb-4">The Reading Corner</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">Our signature community library. Request any book you want to read, and we'll lend it to your doorstep.</p>
               <button 
                onClick={() => onNavigate('BookBoutique')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-coral-600 transition-colors"
               >
                 Borrow a Book
               </button>
            </div>
          </div>
        </div>
      </section>

      <ReviewCenter 
        reviews={reviews} 
        services={services} 
        onAddReview={onAddReview} 
      />
    </div>
  );
};

export default Home;
