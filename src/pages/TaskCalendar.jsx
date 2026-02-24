// // // import React, { useEffect, useState } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import axios from '../utils/axios';
// // // import {
// // //   ArrowLeft, CheckCircle, Calendar, ChevronLeft, ChevronRight,
// // //   Clock, Loader2, Award
// // // } from 'lucide-react';
// // // import toast from 'react-hot-toast';

// // // const formatDate = (date, formatStr) => {
// // //   const year = date.getFullYear();
// // //   const month = String(date.getMonth() + 1).padStart(2, '0');
// // //   const day = String(date.getDate()).padStart(2, '0');
// // //   if (formatStr === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
// // //   return date.toLocaleDateString();
// // // };
// // // const isToday = (date) => date.toDateString() === new Date().toDateString();
// // // const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// // // const TaskCalendar = () => {
// // //   const { taskId } = useParams();
// // //   const navigate = useNavigate();
// // //   const [task, setTask] = useState(null);
// // //   const [entries, setEntries] = useState({});
// // //   const [currentDate, setCurrentDate] = useState(new Date());
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [stats, setStats] = useState({ streak: 0, totalCompleted: 0 });

// // //   const today = formatDate(new Date(), 'yyyy-MM-dd');

// // //   useEffect(() => {
// // //     fetchTask();
// // //     fetchEntries();
// // //     fetchStats();
// // //   }, [taskId, currentDate]);

// // //   const fetchTask = async () => {
// // //     try {
// // //       const { data } = await axios.get('/tasks');
// // //       const found = data.data.find(t => t._id === taskId);
// // //       setTask(found);
// // //     } catch (error) {
// // //       toast.error('Task not found');
// // //     }
// // //   };

// // //   const fetchEntries = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const { data } = await axios.get(`/tasks/${taskId}/entries`, {
// // //         params: { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1 }
// // //       });
// // //       const entriesObj = {};
// // //       data.data.forEach(e => entriesObj[e.date] = e.completed);
// // //       setEntries(entriesObj);
// // //     } catch (error) {
// // //       toast.error('Failed to load entries');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchStats = async () => {
// // //     try {
// // //       const { data } = await axios.get(`/tasks/${taskId}/stats`);
// // //       setStats(data.data);
// // //     } catch (error) { console.error(error); }
// // //   };

// // //   const handleToggle = async (date) => {
// // //     if (date !== today) {
// // //       toast.error('You can only log today\'s task.');
// // //       return;
// // //     }
// // //     const newValue = !entries[date];
// // //     setEntries(prev => ({ ...prev, [date]: newValue }));
// // //     setSaving(true);
// // //     try {
// // //       await axios.put(`/tasks/${taskId}/entries/${date}`);
// // //       fetchStats();
// // //       toast.success('Task updated');
// // //     } catch (error) {
// // //       setEntries(prev => ({ ...prev, [date]: !newValue }));
// // //       toast.error('Failed to update');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const daysInMonth = Array.from(
// // //     { length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() },
// // //     (_, i) => {
// // //       const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
// // //       const dateStr = formatDate(dateObj, 'yyyy-MM-dd');
// // //       return { date: dateStr, dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), isToday: isToday(dateObj) };
// // //     }
// // //   );

// // //   if (!task) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

// // //   return (
// // //     <div className="min-h-screen bg-[#F8FAFC] pb-20">
// // //       <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
// // //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// // //           <div className="flex items-center gap-3">
// // //             <button onClick={() => navigate('/tasks')} className="p-2 hover:bg-slate-50 rounded-full">
// // //               <ArrowLeft className="w-5 h-5 text-slate-600" />
// // //             </button>
// // //             <div className="bg-emerald-100 p-2 rounded-xl" style={{ backgroundColor: task.color + '20' }}>
// // //               <Calendar className="w-5 h-5" style={{ color: task.color }} />
// // //             </div>
// // //             <div>
// // //               <h1 className="text-lg font-bold text-slate-800">{task.name}</h1>
// // //               <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {task.scheduledTime}</p>
// // //             </div>
// // //           </div>
// // //           <div className="flex items-center gap-4">
// // //             <div><span className="text-[10px] font-bold text-slate-400">Streak</span><p className="text-sm font-bold text-emerald-600">{stats.streak} days</p></div>
// // //             <div><span className="text-[10px] font-bold text-slate-400">Total</span><p className="text-sm font-bold text-emerald-600">{stats.totalCompleted}</p></div>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <main className="max-w-7xl mx-auto p-4 lg:p-8">
// // //         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
// // //           <div className="flex items-center gap-4">
// // //             <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
// // //             <h2 className="text-xl font-bold text-slate-800 min-w-[150px] text-center">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
// // //             <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
// // //           </div>
// // //           <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold">Today</button>
// // //         </div>

// // //         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
// // //           <div className="hidden md:grid grid-cols-7 bg-slate-50 border-b border-slate-200 px-6 py-4">
// // //             <div className="col-span-1 text-sm font-bold text-slate-500 uppercase">Date</div>
// // //             <div className="col-span-5 text-sm font-bold text-slate-500 uppercase text-center">Status</div>
// // //           </div>
// // //           <div className="divide-y divide-slate-100">
// // //             {daysInMonth.map(day => (
// // //               <div key={day.date} className={`flex flex-col md:grid md:grid-cols-7 px-4 py-4 md:px-6 md:py-4 transition-colors ${day.isToday ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}>
// // //                 <div className="col-span-1 flex items-center gap-3 mb-2 md:mb-0">
// // //                   <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border ${day.isToday ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
// // //                     <span className="text-xs font-bold leading-none uppercase">{day.dayName}</span>
// // //                     <span className="text-sm font-extrabold">{day.date.split('-')[2]}</span>
// // //                   </div>
// // //                 </div>
// // //                 <div className="col-span-5 flex items-center justify-center">
// // //                   <button onClick={() => handleToggle(day.date)} disabled={day.date !== today || saving}
// // //                     className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
// // //                       entries[day.date] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-300 border border-slate-100 hover:border-emerald-300'
// // //                     } ${day.date !== today || saving ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-90'}`}>
// // //                     {entries[day.date] && <CheckCircle className="w-6 h-6" />}
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default TaskCalendar;












// // import React, { useEffect, useState, useRef } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from '../utils/axios';
// // import {
// //   ArrowLeft, CheckCircle, Calendar, ChevronLeft, ChevronRight,
// //   Clock, Loader2, Award
// // } from 'lucide-react';
// // import toast from 'react-hot-toast';

// // const formatDate = (date, formatStr) => {
// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, '0');
// //   const day = String(date.getDate()).padStart(2, '0');
// //   if (formatStr === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
// //   return date.toLocaleDateString();
// // };

// // const isToday = (date) => date.toDateString() === new Date().toDateString();

// // const months = ['January', 'February', 'March', 'April', 'May', 'June',
// //   'July', 'August', 'September', 'October', 'November', 'December'];

// // const TaskCalendar = () => {
// //   const { taskId } = useParams();
// //   const navigate = useNavigate();
// //   const [task, setTask] = useState(null);
// //   const [entries, setEntries] = useState({});
// //   const [currentDate, setCurrentDate] = useState(new Date());
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [stats, setStats] = useState({ streak: 0, totalCompleted: 0 });

// //   const today = formatDate(new Date(), 'yyyy-MM-dd');
// //   const todayColRef = useRef(null);

// //   const year = currentDate.getFullYear();
// //   const month = currentDate.getMonth() + 1;
// //   const daysInMonth = new Date(year, month, 0).getDate();

// //   useEffect(() => {
// //     fetchTask();
// //     fetchEntries();
// //     fetchStats();
// //   }, [taskId, currentDate]);

// //   // Auto-scroll to today's column when data loads
// //   useEffect(() => {
// //     if (!loading && todayColRef.current) {
// //       todayColRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
// //     }
// //   }, [loading]);

// //   const fetchTask = async () => {
// //     try {
// //       const { data } = await axios.get('/tasks');
// //       const found = data.data.find(t => t._id === taskId);
// //       setTask(found);
// //     } catch (error) {
// //       toast.error('Task not found');
// //     }
// //   };

// //   const fetchEntries = async () => {
// //     setLoading(true);
// //     try {
// //       const { data } = await axios.get(`/tasks/${taskId}/entries`, {
// //         params: { year, month }
// //       });
// //       const entriesObj = {};
// //       data.data.forEach(e => entriesObj[e.date] = e.completed);
// //       setEntries(entriesObj);
// //     } catch (error) {
// //       toast.error('Failed to load entries');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchStats = async () => {
// //     try {
// //       const { data } = await axios.get(`/tasks/${taskId}/stats`);
// //       setStats(data.data);
// //     } catch (error) { console.error(error); }
// //   };

// //   const handleToggle = async (date) => {
// //     if (date !== today) {
// //       toast.error('You can only log today\'s task.');
// //       return;
// //     }
// //     const newValue = !entries[date];
// //     setEntries(prev => ({ ...prev, [date]: newValue }));
// //     setSaving(true);
// //     try {
// //       await axios.put(`/tasks/${taskId}/entries/${date}`);
// //       fetchStats();
// //       toast.success('Task updated');
// //     } catch (error) {
// //       setEntries(prev => ({ ...prev, [date]: !newValue }));
// //       toast.error('Failed to update');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   if (!task) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

// //   return (
// //     <div className="min-h-screen bg-[#F8FAFC] pb-20">
// //       <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <button onClick={() => navigate('/tasks')} className="p-2 hover:bg-slate-50 rounded-full">
// //               <ArrowLeft className="w-5 h-5 text-slate-600" />
// //             </button>
// //             <div className="bg-emerald-100 p-2 rounded-xl" style={{ backgroundColor: task.color + '20' }}>
// //               <Calendar className="w-5 h-5" style={{ color: task.color }} />
// //             </div>
// //             <div>
// //               <h1 className="text-lg font-bold text-slate-800">{task.name}</h1>
// //               <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {task.scheduledTime}</p>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-4">
// //             <div><span className="text-[10px] font-bold text-slate-400">Streak</span><p className="text-sm font-bold text-emerald-600">{stats.streak} days</p></div>
// //             <div><span className="text-[10px] font-bold text-slate-400">Total</span><p className="text-sm font-bold text-emerald-600">{stats.totalCompleted}</p></div>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-7xl mx-auto p-4 lg:p-8">
// //         {/* Month Navigation */}
// //         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
// //           <div className="flex items-center gap-4">
// //             <button
// //               onClick={() => setCurrentDate(new Date(year, month - 2, 1))}
// //               className="p-2 hover:bg-slate-100 rounded-lg"
// //             >
// //               <ChevronLeft className="w-5 h-5 text-slate-600" />
// //             </button>
// //             <h2 className="text-xl font-bold text-slate-800 min-w-[150px] text-center">
// //               {months[month - 1]} {year}
// //             </h2>
// //             <button
// //               onClick={() => setCurrentDate(new Date(year, month, 1))}
// //               className="p-2 hover:bg-slate-100 rounded-lg"
// //             >
// //               <ChevronRight className="w-5 h-5 text-slate-600" />
// //             </button>
// //           </div>
// //           <button
// //             onClick={() => setCurrentDate(new Date())}
// //             className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold"
// //           >
// //             Today
// //           </button>
// //         </div>

// //         {/* Grid Table */}
// //         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
// //           <div className="min-w-max p-4">
// //             {/* Header Row: Day Numbers */}
// //             <div className="flex border-b border-slate-200 pb-2 mb-2">
// //               <div className="w-32 flex-shrink-0 font-bold text-slate-600">Task</div>
// //               {Array.from({ length: daysInMonth }, (_, i) => {
// //                 const day = i + 1;
// //                 const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// //                 const isTodayCol = dateStr === today;
// //                 return (
// //                   <div
// //                     key={day}
// //                     ref={isTodayCol ? todayColRef : null}
// //                     className={`w-12 flex-shrink-0 text-center font-bold ${isTodayCol ? 'text-emerald-600' : 'text-slate-400'}`}
// //                   >
// //                     {day}
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {/* Task Row */}
// //             <div className="flex items-center">
// //               <div className="w-32 flex-shrink-0 font-medium text-slate-800">
// //                 {task.name}
// //                 <span className="block text-xs text-slate-500">{task.scheduledTime}</span>
// //               </div>
// //               {Array.from({ length: daysInMonth }, (_, i) => {
// //                 const day = i + 1;
// //                 const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// //                 const completed = entries[dateStr];
// //                 const isTodayCol = dateStr === today;
// //                 const canToggle = isTodayCol && !saving;

// //                 return (
// //                   <div key={day} className="w-12 flex-shrink-0 flex justify-center">
// //                     <button
// //                       onClick={() => handleToggle(dateStr)}
// //                       disabled={!canToggle}
// //                       className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
// //                         completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'
// //                       } ${!canToggle ? 'opacity-40 cursor-not-allowed' : 'hover:bg-emerald-100'}`}
// //                     >
// //                       {completed && <CheckCircle size={16} />}
// //                     </button>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default TaskCalendar;








// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from '../utils/axios';
// import {
//   ArrowLeft, CheckCircle, Calendar, ChevronLeft, ChevronRight,
//   Clock, Loader2, Award
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const TaskYearCalendar = () => {
//   const { taskId } = useParams();
//   const navigate = useNavigate();
//   const [task, setTask] = useState(null);
//   const [entries, setEntries] = useState({});
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [stats, setStats] = useState({ streak: 0, totalCompleted: 0 });

//   const today = new Date().toISOString().split('T')[0];
//   const currentMonthRef = useRef(null);
//   const containerRef = useRef(null);

//   // Days in each month for the selected year
//   const daysInMonth = months.map((_, idx) => new Date(currentYear, idx + 1, 0).getDate());

//   useEffect(() => {
//     fetchTask();
//     fetchYearEntries();
//     fetchStats();
//   }, [taskId, currentYear]);

//   // Auto-scroll to current month after loading
//   useEffect(() => {
//     if (!loading && currentMonthRef.current) {
//       currentMonthRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
//     }
//   }, [loading]);

//   const fetchTask = async () => {
//     try {
//       const { data } = await axios.get('/tasks');
//       const found = data.data.find(t => t._id === taskId);
//       setTask(found);
//     } catch (error) {
//       toast.error('Task not found');
//     }
//   };

//   const fetchYearEntries = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`/tasks/${taskId}/year-entries`, {
//         params: { year: currentYear }
//       });
//       setEntries(data.data);
//     } catch (error) {
//       toast.error('Failed to load entries');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const { data } = await axios.get(`/tasks/${taskId}/stats`);
//       setStats(data.data);
//     } catch (error) { console.error(error); }
//   };

//   const handleToggle = async (date) => {
//     if (date !== today) {
//       toast.error('You can only log today\'s task.');
//       return;
//     }
//     const newValue = !entries[date];
//     setEntries(prev => ({ ...prev, [date]: newValue }));
//     setSaving(true);
//     try {
//       await axios.put(`/tasks/${taskId}/entries/${date}`);
//       fetchStats();
//       toast.success('Task updated');
//     } catch (error) {
//       setEntries(prev => ({ ...prev, [date]: !newValue }));
//       toast.error('Failed to update');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const scrollToCurrentMonth = () => {
//     if (currentMonthRef.current) {
//       currentMonthRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
//     }
//   };

//   if (!task) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20">
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button onClick={() => navigate('/tasks')} className="p-2 hover:bg-slate-50 rounded-full">
//               <ArrowLeft className="w-5 h-5 text-slate-600" />
//             </button>
//             <div className="bg-emerald-100 p-2 rounded-xl" style={{ backgroundColor: task.color + '20' }}>
//               <Calendar className="w-5 h-5" style={{ color: task.color }} />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-slate-800">{task.name}</h1>
//               <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {task.scheduledTime}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <div><span className="text-[10px] font-bold text-slate-400">Streak</span><p className="text-sm font-bold text-emerald-600">{stats.streak} days</p></div>
//             <div><span className="text-[10px] font-bold text-slate-400">Total</span><p className="text-sm font-bold text-emerald-600">{stats.totalCompleted}</p></div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto p-4 lg:p-8">
//         {/* Year Navigation */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setCurrentYear(prev => prev - 1)}
//               className="p-2 hover:bg-slate-100 rounded-lg"
//             >
//               <ChevronLeft className="w-5 h-5 text-slate-600" />
//             </button>
//             <h2 className="text-xl font-bold text-slate-800 min-w-[120px] text-center">{currentYear}</h2>
//             <button
//               onClick={() => setCurrentYear(prev => prev + 1)}
//               className="p-2 hover:bg-slate-100 rounded-lg"
//             >
//               <ChevronRight className="w-5 h-5 text-slate-600" />
//             </button>
//           </div>
//           <button
//             onClick={scrollToCurrentMonth}
//             className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold"
//           >
//             Today
//           </button>
//         </div>

//         {/* Year Grid */}
//         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto" ref={containerRef}>
//           <div className="flex p-4 gap-4">
//             {months.map((monthName, monthIdx) => {
//               const monthNum = monthIdx + 1;
//               const days = daysInMonth[monthIdx];
//               const isCurrentMonth = monthNum === new Date().getMonth() + 1 && currentYear === new Date().getFullYear();

//               return (
//                 <div
//                   key={monthName}
//                   ref={isCurrentMonth ? currentMonthRef : null}
//                   className="flex-shrink-0 w-56 border-r border-slate-200 last:border-r-0 pr-4 last:pr-0"
//                 >
//                   {/* Month Header */}
//                   <div className="font-bold text-lg text-slate-700 mb-2 text-center">{monthName}</div>

//                   {/* Day Numbers */}
//                   <div className="grid grid-cols-7 gap-1 mb-2">
//                     {Array.from({ length: days }, (_, i) => {
//                       const day = i + 1;
//                       return (
//                         <div key={day} className="text-xs text-center text-slate-500">
//                           {day}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Task Buttons */}
//                   <div className="grid grid-cols-7 gap-1">
//                     {Array.from({ length: days }, (_, i) => {
//                       const day = i + 1;
//                       const dateStr = `${currentYear}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//                       const completed = entries[dateStr];
//                       const isToday = dateStr === today;
//                       const canToggle = isToday && !saving;

//                       return (
//                         <button
//                           key={day}
//                           onClick={() => handleToggle(dateStr)}
//                           disabled={!canToggle}
//                           className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
//                             completed
//                               ? 'bg-emerald-500 text-white'
//                               : 'bg-slate-100 text-slate-300 hover:bg-emerald-100'
//                           } ${!canToggle ? 'opacity-40 cursor-not-allowed' : ''}`}
//                         >
//                           {completed && <CheckCircle size={12} />}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {loading && (
//           <div className="flex justify-center py-10">
//             <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default TaskYearCalendar;










import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  ArrowLeft, CheckCircle, Calendar, ChevronLeft, ChevronRight,
  Clock, Loader2, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TaskYearCalendar = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [entries, setEntries] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ streak: 0, totalCompleted: 0 });

  const today = new Date().toISOString().split('T')[0];
  const currentMonthRef = useRef(null);
  const containerRef = useRef(null);

  const daysInMonth = months.map((_, idx) => new Date(currentYear, idx + 1, 0).getDate());

  useEffect(() => {
    fetchTask();
    fetchYearEntries();
    fetchStats();
  }, [taskId, currentYear]);

  useEffect(() => {
    if (!loading && currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [loading]);

  const fetchTask = async () => {
    try {
      const { data } = await axios.get('/tasks');
      const found = data.data.find(t => t._id === taskId);
      setTask(found);
    } catch (error) {
      toast.error('Task not found');
    }
  };

  const fetchYearEntries = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/tasks/${taskId}/year-entries`, {
        params: { year: currentYear }
      });
      setEntries(data.data);
    } catch (error) {
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`/tasks/${taskId}/stats`);
      setStats(data.data);
    } catch (error) { console.error(error); }
  };

  const handleToggle = async (date) => {
    if (date !== today) {
      toast.error('You can only log today\'s task.');
      return;
    }
    const newValue = !entries[date];
    setEntries(prev => ({ ...prev, [date]: newValue }));
    setSaving(true);
    try {
      await axios.put(`/tasks/${taskId}/entries/${date}`);
      fetchStats();
      toast.success('Task updated');
    } catch (error) {
      setEntries(prev => ({ ...prev, [date]: !newValue }));
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const scrollToCurrentMonth = () => {
    if (currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  if (!task) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/tasks')} className="p-2 hover:bg-slate-50 rounded-full">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="bg-emerald-100 p-2 rounded-xl" style={{ backgroundColor: task.color + '20' }}>
              <Calendar className="w-5 h-5" style={{ color: task.color }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{task.name}</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {task.scheduledTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div><span className="text-[10px] font-bold text-slate-400">Streak</span><p className="text-sm font-bold text-emerald-600">{stats.streak} days</p></div>
            <div><span className="text-[10px] font-bold text-slate-400">Total</span><p className="text-sm font-bold text-emerald-600">{stats.totalCompleted}</p></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Year Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentYear(prev => prev - 1)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 min-w-[120px] text-center">{currentYear}</h2>
            <button
              onClick={() => setCurrentYear(prev => prev + 1)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <button
            onClick={scrollToCurrentMonth}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold"
          >
            Today
          </button>
        </div>

        {/* Responsive Month Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {months.map((monthName, monthIdx) => {
            const monthNum = monthIdx + 1;
            const days = daysInMonth[monthIdx];
            const isCurrentMonth = monthNum === new Date().getMonth() + 1 && currentYear === new Date().getFullYear();

            return (
              <div
                key={monthName}
                ref={isCurrentMonth ? currentMonthRef : null}
                className={`bg-white rounded-2xl p-4 border shadow-sm ${
                  isCurrentMonth ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200'
                }`}
              >
                <h3 className="font-bold text-lg text-slate-800 text-center mb-3">{monthName}</h3>

                {/* Days grid with date on top and button below */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: days }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentYear}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const completed = entries[dateStr];
                    const isToday = dateStr === today;
                    const canToggle = isToday && !saving;

                    return (
                      <div key={day} className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 mb-1">{day}</span>
                        <button
                          onClick={() => handleToggle(dateStr)}
                          disabled={!canToggle}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                            completed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-300 hover:bg-emerald-100'
                          } ${!canToggle ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {completed && <CheckCircle size={12} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskYearCalendar;