
import React, { useState } from 'react';

// Removed UserProfile import as it does not align with the form's data structure
// import { UserProfile } from '../types';

interface ProfileFormProps {
  // Fix: Adjusted the onSubmit callback to accept the actual data collected by this form
  onSubmit: (profile: { age: string; grade: string }) => void;
  onBack: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, onBack }) => {
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('Kindergarten');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age) {
      // Fix: The object now matches the updated interface type, resolving the "unknown property 'age'" error
      onSubmit({ age, grade });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back to Services
      </button>

      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-user-graduate"></i>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Student Profile</h2>
          <p className="text-slate-500 mb-8 font-medium">To get started with tutoring, please tell me a bit about yourself!</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">How old are you?</label>
              <input 
                type="number" 
                required
                min="3"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 8"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What grade are you in?</label>
              <div className="grid grid-cols-1 gap-3">
                {['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`px-5 py-3 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
                      grade === g 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {g}
                    {grade === g && <i className="fa-solid fa-circle-check"></i>}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-100 transition-all mt-4"
            >
              Continue to Tutoring
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
