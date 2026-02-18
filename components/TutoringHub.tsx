
import React from 'react';
import { QuizResult, StudentProgress } from '../types';

interface TutoringHubProps {
  quiz: QuizResult;
  progress: StudentProgress;
  onBook: () => void;
  onRestartQuiz: () => void;
}

const TutoringHub: React.FC<TutoringHubProps> = ({ quiz, progress, onBook, onRestartQuiz }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex-grow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-3xl flex items-center justify-center text-3xl">
              <i className="fa-solid fa-star"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome, {quiz.childName}!</h2>
              <p className="text-slate-500 font-medium">Ready to become a {quiz.grade} expert?</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Star Progress</span>
                <span className="text-indigo-600 font-black">{progress.totalStars} Stars</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000" 
                  style={{width: `${(progress.totalStars / 50) * 100}%`}}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Earn 50 stars for a special prize from Skillio!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Reading</div>
                <div className="font-black text-slate-800">Lvl 1</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 opacity-50">
                <div className="text-2xl mb-1">🧮</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Math</div>
                <div className="font-black text-slate-800">Locked</div>
              </div>
              {/* Badges could go here */}
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-4">
          <button 
            onClick={onBook}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-3xl text-xl font-black shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-calendar-plus"></i>
            Book Session
          </button>
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-shield-heart text-pink-500"></i>
              Parent Info
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-slate-400"><span className="text-white font-bold">Contact:</span> {quiz.parentName}</p>
              <p className="text-slate-400"><span className="text-white font-bold">Subjects:</span> {quiz.subjects.join(', ')}</p>
              <button 
                onClick={onRestartQuiz}
                className="text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
          <h3 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-clipboard-list text-indigo-500"></i>
            Session History
          </h3>
          {progress.history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 italic">No sessions yet. Let's start learning!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.history.map(note => (
                <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-700">{note.date}</span>
                    <span className="text-yellow-500 font-bold">+{note.starsEarned} Stars</span>
                  </div>
                  <p className="text-slate-600 text-sm">{note.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
          <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
            <i className="fa-solid fa-medal text-yellow-400"></i>
            Achievement Hall
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center text-3xl border border-white/20">
              🥈
            </div>
            <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center text-3xl border border-white/20 grayscale">
              🥇
            </div>
            <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center text-3xl border border-white/20 grayscale">
              🏆
            </div>
          </div>
          <p className="text-sm text-indigo-200 mt-6 text-center">Complete your first 3 sessions to unlock your first trophy!</p>
        </div>
      </div>
    </div>
  );
};

export default TutoringHub;
