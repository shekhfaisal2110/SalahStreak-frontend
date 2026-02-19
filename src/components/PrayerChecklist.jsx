// import React from 'react';
// import { CheckCircle } from 'lucide-react';

// const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// export default function PrayerChecklist({ prayers: prayerStatus, onUpdate }) {
//   const handleToggle = (prayer) => {
//     const updated = { ...prayerStatus, [prayer]: !prayerStatus[prayer] };
//     onUpdate(updated);
//   };

//   if (!prayerStatus) return <div>Loading prayers...</div>;

//   return (
//     <div className="space-y-3">
//       {prayers.map((prayer) => (
//         <div
//           key={prayer}
//           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <span className="font-medium text-gray-800">{prayer}</span>
//           <button
//             onClick={() => handleToggle(prayer)}
//             className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
//               prayerStatus[prayer]
//                 ? 'bg-emerald-600 border-emerald-600 text-white'
//                 : 'border-gray-300 text-gray-400 hover:border-emerald-400'
//             }`}
//           >
//             {prayerStatus[prayer] && <CheckCircle className="w-5 h-5" />}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }















import React from 'react';
import { CheckCircle, Circle, Flame } from 'lucide-react';

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerChecklist({ prayers: prayerStatus, onUpdate }) {
  const handleToggle = (prayer) => {
    const updated = { ...prayerStatus, [prayer]: !prayerStatus[prayer] };
    onUpdate(updated);
  };

  if (!prayerStatus) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const completedCount = prayers.filter(p => prayerStatus[p]).length;
  const progressPercent = (completedCount / prayers.length) * 100;

  return (
    <div className="space-y-4">
      {/* Dynamic Progress Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Today's Progress</h3>
          <p className="text-xs text-slate-500 font-medium">{completedCount} of 5 prayers completed</p>
        </div>
        {completedCount === 5 && (
          <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold animate-bounce">
            <Flame className="w-3 h-3" /> PERFECT DAY
          </div>
        )}
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-emerald-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 gap-3">
        {prayers.map((prayer) => {
          const isDone = prayerStatus[prayer];
          
          return (
            <button
              key={prayer}
              onClick={() => handleToggle(prayer)}
              className={`
                group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200
                active:scale-[0.98] tap-highlight-transparent
                ${isDone 
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm shadow-emerald-100' 
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                  ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}
                `}>
                  {isDone ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <div className="text-left">
                  <span className={`text-base font-bold transition-colors ${isDone ? 'text-emerald-900' : 'text-slate-700'}`}>
                    {prayer}
                  </span>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isDone ? 'Completed' : 'Tap to log'}
                  </p>
                </div>
              </div>

              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}
              `}>
                {isDone && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}