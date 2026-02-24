// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from '../utils/axios';
// // import {
// //   ArrowLeft, Plus, Edit2, Trash2, Calendar as CalendarIcon,
// //   Loader2, Clock, ListTodo
// // } from 'lucide-react';
// // import toast from 'react-hot-toast';

// // const Tasks = () => {
// //   const navigate = useNavigate();
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentTask, setCurrentTask] = useState(null);
// //   const [name, setName] = useState('');
// //   const [scheduledTime, setScheduledTime] = useState('');
// //   const [color, setColor] = useState('#10b981');

// //   useEffect(() => {
// //     fetchTasks();
// //   }, []);

// //   const fetchTasks = async () => {
// //     try {
// //       const { data } = await axios.get('/tasks');
// //       setTasks(data.data);
// //     } catch (error) {
// //       toast.error('Failed to load tasks');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       if (currentTask) {
// //         const { data } = await axios.put(`/tasks/${currentTask._id}`, { name, scheduledTime, color });
// //         setTasks(prev => prev.map(t => t._id === currentTask._id ? data.data : t));
// //         toast.success('Task updated');
// //       } else {
// //         const { data } = await axios.post('/tasks', { name, scheduledTime, color });
// //         setTasks(prev => [data.data, ...prev]);
// //         toast.success('Task created');
// //       }
// //       setShowModal(false);
// //       resetForm();
// //     } catch (error) {
// //       toast.error('Operation failed');
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm('Delete this task? All progress will be lost.')) return;
// //     try {
// //       await axios.delete(`/tasks/${id}`);
// //       setTasks(prev => prev.filter(t => t._id !== id));
// //       toast.success('Task deleted');
// //     } catch (error) {
// //       toast.error('Failed to delete');
// //     }
// //   };

// //   const openEdit = (task) => {
// //     setCurrentTask(task);
// //     setName(task.name);
// //     setScheduledTime(task.scheduledTime);
// //     setColor(task.color || '#10b981');
// //     setShowModal(true);
// //   };

// //   const resetForm = () => {
// //     setCurrentTask(null);
// //     setName('');
// //     setScheduledTime('');
// //     setColor('#10b981');
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#F8FAFC] pb-12">
// //       <nav className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20">
// //         <div className="max-w-5xl mx-auto flex justify-between items-center">
// //           <div className="flex items-center gap-4">
// //             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
// //               <ArrowLeft className="w-5 h-5 text-slate-600" />
// //             </button>
// //             <h1 className="text-2xl font-black text-slate-800">Daily Tasks</h1>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <button
// //               onClick={() => navigate('/tasks/log')}
// //               className="p-2 hover:bg-slate-100 rounded-full transition-colors"
// //               title="View Completion Log"
// //             >
// //               <ListTodo className="w-6 h-6 text-slate-600" />
// //             </button>
// //             <button
// //               onClick={() => { resetForm(); setShowModal(true); }}
// //               className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-lg"
// //             >
// //               <Plus className="w-6 h-6" />
// //             </button>
// //           </div>
// //         </div>
// //       </nav>

// //       <div className="max-w-5xl mx-auto p-6">
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {tasks.map(task => (
// //             <div
// //               key={task._id}
// //               className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition"
// //               style={{ borderLeftColor: task.color, borderLeftWidth: '6px' }}
// //             >
// //               <div className="flex justify-between items-start">
// //                 <div>
// //                   <h3 className="text-xl font-bold text-slate-800">{task.name}</h3>
// //                   <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
// //                     <Clock size={14} /> {task.scheduledTime}
// //                   </p>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button onClick={() => navigate(`/tasks/${task._id}`)} className="p-2 text-emerald-600 hover:text-emerald-700" title="View Calendar">
// //                     <CalendarIcon size={20} />
// //                   </button>
// //                   <button onClick={() => openEdit(task)} className="p-2 text-slate-400 hover:text-slate-600">
// //                     <Edit2 size={18} />
// //                   </button>
// //                   <button onClick={() => handleDelete(task._id)} className="p-2 text-slate-400 hover:text-red-500">
// //                     <Trash2 size={18} />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         {tasks.length === 0 && (
// //           <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
// //             <p className="text-slate-500">No tasks yet. Create your first daily task!</p>
// //           </div>
// //         )}
// //       </div>

// //       {showModal && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-3xl max-w-md w-full p-6">
// //             <h2 className="text-xl font-bold mb-4">{currentTask ? 'Edit Task' : 'New Task'}</h2>
// //             <form onSubmit={handleSubmit}>
// //               <div className="mb-4">
// //                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Task Name</label>
// //                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
// //               </div>
// //               <div className="mb-4">
// //                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Scheduled Time</label>
// //                 <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
// //               </div>
// //               <div className="mb-6">
// //                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Color (optional)</label>
// //                 <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded-xl" />
// //               </div>
// //               <div className="flex gap-3">
// //                 <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold">{currentTask ? 'Update' : 'Create'}</button>
// //                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold">Cancel</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Tasks;












// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from '../utils/axios';
// import {
//   ArrowLeft, Plus, Edit2, Trash2, Calendar as CalendarIcon,
//   Loader2, Clock, ListTodo, CalendarRange
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const Tasks = () => {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);
//   const [name, setName] = useState('');
//   const [scheduledTime, setScheduledTime] = useState('');
//   const [color, setColor] = useState('#10b981');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const { data } = await axios.get('/tasks');
//       setTasks(data.data);
//     } catch (error) {
//       toast.error('Failed to load tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentTask) {
//         const { data } = await axios.put(`/tasks/${currentTask._id}`, { name, scheduledTime, color });
//         setTasks(prev => prev.map(t => t._id === currentTask._id ? data.data : t));
//         toast.success('Task updated');
//       } else {
//         const { data } = await axios.post('/tasks', { name, scheduledTime, color });
//         setTasks(prev => [data.data, ...prev]);
//         toast.success('Task created');
//       }
//       setShowModal(false);
//       resetForm();
//     } catch (error) {
//       toast.error('Operation failed');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this task? All progress will be lost.')) return;
//     try {
//       await axios.delete(`/tasks/${id}`);
//       setTasks(prev => prev.filter(t => t._id !== id));
//       toast.success('Task deleted');
//     } catch (error) {
//       toast.error('Failed to delete');
//     }
//   };

//   const openEdit = (task) => {
//     setCurrentTask(task);
//     setName(task.name);
//     setScheduledTime(task.scheduledTime);
//     setColor(task.color || '#10b981');
//     setShowModal(true);
//   };

//   const resetForm = () => {
//     setCurrentTask(null);
//     setName('');
//     setScheduledTime('');
//     setColor('#10b981');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-12">
//       <nav className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20">
//         <div className="max-w-5xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
//               <ArrowLeft className="w-5 h-5 text-slate-600" />
//             </button>
//             <h1 className="text-2xl font-black text-slate-800">Daily Tasks</h1>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* Yearly Overview Button */}
//             <button
//               onClick={() => navigate('/tasks/yearly')}
//               className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//               title="Yearly Overview"
//             >
//               <CalendarRange className="w-6 h-6 text-slate-600" />
//             </button>
//             {/* Completion Log Button */}
//             <button
//               onClick={() => navigate('/tasks/log')}
//               className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//               title="View Completion Log"
//             >
//               <ListTodo className="w-6 h-6 text-slate-600" />
//             </button>
//             {/* Add Task Button */}
//             <button
//               onClick={() => { resetForm(); setShowModal(true); }}
//               className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-lg"
//             >
//               <Plus className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {tasks.map(task => (
//             <div
//               key={task._id}
//               className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition"
//               style={{ borderLeftColor: task.color, borderLeftWidth: '6px' }}
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-xl font-bold text-slate-800">{task.name}</h3>
//                   <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
//                     <Clock size={14} /> {task.scheduledTime}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => navigate(`/tasks/${task._id}`)}
//                     className="p-2 text-emerald-600 hover:text-emerald-700"
//                     title="View Calendar"
//                   >
//                     <CalendarIcon size={20} />
//                   </button>
//                   <button
//                     onClick={() => openEdit(task)}
//                     className="p-2 text-slate-400 hover:text-slate-600"
//                   >
//                     <Edit2 size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(task._id)}
//                     className="p-2 text-slate-400 hover:text-red-500"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {tasks.length === 0 && (
//           <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
//             <p className="text-slate-500">No tasks yet. Create your first daily task!</p>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full p-6">
//             <h2 className="text-xl font-bold mb-4">{currentTask ? 'Edit Task' : 'New Task'}</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Task Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Scheduled Time</label>
//                 <input
//                   type="time"
//                   value={scheduledTime}
//                   onChange={(e) => setScheduledTime(e.target.value)}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
//                   required
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Color (optional)</label>
//                 <input
//                   type="color"
//                   value={color}
//                   onChange={(e) => setColor(e.target.value)}
//                   className="w-full h-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded-xl"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold"
//                 >
//                   {currentTask ? 'Update' : 'Create'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tasks;









import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  ArrowLeft, Plus, Edit2, Trash2, Calendar as CalendarIcon,
  Loader2, Clock, ListTodo, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [name, setName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [color, setColor] = useState('#10b981');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/tasks');
      setTasks(data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        // Update existing task
        const { data } = await axios.put(`/tasks/${currentTask._id}`, { name, scheduledTime, color });
        setTasks(prev => prev.map(t => t._id === currentTask._id ? data.data : t));
        toast.success('Task updated');
      } else {
        // Create new task
        const { data } = await axios.post('/tasks', { name, scheduledTime, color });
        setTasks(prev => [data.data, ...prev]);
        toast.success('Task created');
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? All progress will be lost.')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (task) => {
    setCurrentTask(task);
    setName(task.name);
    setScheduledTime(task.scheduledTime);
    setColor(task.color || '#10b981');
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentTask(null);
    setName('');
    setScheduledTime('');
    setColor('#10b981');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-800">Daily Tasks</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Completion Log Button */}
            <button
              onClick={() => navigate('/tasks/log')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Completion Log"
            >
              <ListTodo className="w-6 h-6 text-slate-600" />
            </button>
            {/* Add Task Button */}
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition"
              style={{ borderLeftColor: task.color, borderLeftWidth: '6px' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{task.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Clock size={14} /> {task.scheduledTime}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Calendar View Button */}
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="p-2 text-emerald-600 hover:text-emerald-700"
                    title="View Calendar"
                  >
                    <CalendarIcon size={20} />
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={() => openEdit(task)}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <Edit2 size={18} />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">No tasks yet. Create your first daily task!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{currentTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Task Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Scheduled Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Color (optional)</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                >
                  {currentTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;