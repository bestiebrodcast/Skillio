
import React, { useMemo, useEffect } from 'react';
import { UserProfile, Category } from '../types';

interface CategoryDiscoveryProps {
  category: Category;
  users: UserProfile[];
  onSelectTasker: (id: string) => void;
  onBack: () => void;
}

const CategoryDiscovery: React.FC<CategoryDiscoveryProps> = ({ category, users, onSelectTasker, onBack }) => {
  // Fix: Force scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Discovery is strictly controlled by tasker_submission_status === 'approved'
  const filteredTaskers = useMemo(() => {
    return users.filter(u => {
      const settings = u.taskerProfileSettings;
      if (!settings) return false;

      // Base visibility requirements
      const isBaseActive = 
        u.providerStatus === 'approved' &&
        settings.tasker_submission_status === 'approved' && 
        settings.isPubliclyVisible === true &&
        settings.isDeactivated === false;

      // Filter: Tasker must have at least one module in this category
      const hasModule = settings.offeredServices.some(
        s => s.category === category && s.isActive
      );

      // Check legacy preferredJobTypes
      const hasCategoryMatch = settings.preferredJobTypes.includes(category);

      return isBaseActive && (hasModule || hasCategoryMatch);
    });
  }, [users, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in pb-32">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Market Category</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{category}</h2>
        </div>
      </div>

      {filteredTaskers.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200 max-w-4xl mx-auto">
           <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-8"><i className="fa-solid fa-user-clock"></i></div>
           <h3 className="text-2xl font-black text-slate-300 mb-2">Awaiting Local Approval</h3>
           <p className="text-slate-400 font-medium max-w-sm mx-auto">Verified profiles for this category are currently undergoing owner verification. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredTaskers.map(tasker => {
             const settings = tasker.taskerProfileSettings!;
             const module = settings.offeredServices.find(s => s.category === category);
             const displayPrice = module ? `KES ${module.price.toLocaleString()} ${module.priceType.replace('_', ' ')}` : (settings.customRates[category] || "Market Rate");

             return (
               <div key={tasker.id} onClick={() => onSelectTasker(tasker.id)} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col">
                  <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                     {settings.photoUrl ? <img src={settings.photoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={settings.displayName} /> : <span className="text-6xl font-black text-slate-800">{settings.displayName.charAt(0)}</span>}
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                     <h3 className="text-2xl font-black text-slate-900 mb-1">{settings.displayName}</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{settings.headline}</p>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed italic my-6 line-clamp-2">"{settings.publicBio}"</p>
                     <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                        <p className="text-xl font-black text-slate-900">{displayPrice}</p>
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><i className="fa-solid fa-arrow-right"></i></div>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
};

export default CategoryDiscovery;