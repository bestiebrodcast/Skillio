
import React, { useState } from 'react';
import { QuizResult } from '../types';

interface IntakeQuizProps {
  onSubmit: (data: QuizResult) => void;
  onBack: () => void;
}

const IntakeQuiz: React.FC<IntakeQuizProps> = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuizResult>>({
    childName: '',
    childAge: '',
    grade: 'Grade 1',
    subjects: [],
    strengths: '',
    struggles: '',
    testScore: 0,
    safetyNotes: '',
    parentName: ''
  });

  const subjects = ['Math 🔢', 'Reading 📚', 'Phonics 🗣️', 'Writing ✍️'];
  const grades = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];

  const toggleSubject = (sub: string) => {
    const current = formData.subjects || [];
    if (current.includes(sub)) {
      setFormData({...formData, subjects: current.filter(i => i !== sub)});
    } else {
      setFormData({...formData, subjects: [...current, sub]});
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onBack();

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Step 1: Welcome! Who are you? 👋</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Student's Name</label>
              <input 
                type="text" 
                value={formData.childName} 
                onChange={e => setFormData({...formData, childName: e.target.value})}
                placeholder="Ex: Leo"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                <input 
                  type="number" 
                  value={formData.childAge} 
                  onChange={e => setFormData({...formData, childAge: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Grade</label>
                <select 
                  value={formData.grade} 
                  onChange={e => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200"
                >
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Step 2: What are we learning? 🧠</h3>
            <p className="text-slate-500">Pick as many as you like!</p>
            <div className="grid grid-cols-2 gap-4">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                    formData.subjects?.includes(sub) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md' 
                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in text-center">
            <h3 className="text-2xl font-bold text-slate-800">Step 3: Mini-Challenge! 🏆</h3>
            <p className="text-slate-500">Let's try a quick brain teaser. What is 10 + 5?</p>
            <div className="grid grid-cols-3 gap-4 py-4">
              {[12, 15, 20].map(val => (
                <button
                  key={val}
                  onClick={() => setFormData({...formData, testScore: val === 15 ? 100 : 0})}
                  className={`p-6 rounded-2xl border-2 font-black text-2xl ${formData.testScore === 100 && val === 15 ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-slate-100'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-sm italic">"I use these to see how smart you already are!" - Kyla</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Step 4: Parent's Turn 👨‍👩‍👧</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What does your child love doing? (Strengths)</label>
              <textarea 
                value={formData.strengths} 
                onChange={e => setFormData({...formData, strengths: e.target.value})}
                className="w-full px-5 py-3 rounded-xl border border-slate-200"
                placeholder="Ex: Loves stories about dragons"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What do they need help with? (Struggles)</label>
              <textarea 
                value={formData.struggles} 
                onChange={e => setFormData({...formData, struggles: e.target.value})}
                className="w-full px-5 py-3 rounded-xl border border-slate-200"
                placeholder="Ex: Finding the main idea in a paragraph"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Final Step: Safety 🛡️</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Parent/Guardian Name</label>
              <input 
                type="text" 
                value={formData.parentName} 
                onChange={e => setFormData({...formData, parentName: e.target.value})}
                className="w-full px-5 py-3 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Anything else I should know? (Medical, allergy, etc.)</label>
              <textarea 
                value={formData.safetyNotes} 
                onChange={e => setFormData({...formData, safetyNotes: e.target.value})}
                className="w-full px-5 py-3 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-2 bg-slate-100">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{width: `${(step/5)*100}%`}}></div>
        </div>
        <div className="p-8 md:p-12">
          {renderStep()}
          
          <div className="mt-12 flex justify-between items-center">
            <button onClick={handleBack} className="text-slate-400 font-bold hover:text-slate-600 flex items-center gap-2">
              <i className="fa-solid fa-chevron-left text-xs"></i>
              Back
            </button>
            {step < 5 ? (
              <button 
                onClick={handleNext}
                disabled={!formData.childName && step === 1}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={() => onSubmit(formData as QuizResult)}
                className="bg-green-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-600 transition-all"
              >
                Let's Learn! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeQuiz;
