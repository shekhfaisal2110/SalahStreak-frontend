import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  ArrowLeft, Plus, Edit2, Trash2, CheckCircle, Clock,
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const TaskOverview = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editColor, setEditColor] = useState('#10b981');

  const today = new Date().toISOString().split('T')[0];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    fetchOverview();
  }, [year, month]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/tasks/overview', { params: { year, month } });
      setTasks(data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskId, date) => {
    if (date !== today) {
      toast.error('You can only log today\'s task.');
      return;
    }
    setTasks(prev => prev.map(t => {
      if (t._id === taskId) {
        const newEntries = { ...t.entries, [date]: !t.entries[date] };
        return { ...t, entries: newEntries };
      }
      return t;
    }));
    setSaving(true);
    try {
      await axios.put(`/tasks/${taskId}/entries/${date}`);
      toast.success('Task updated');
    } catch (error) {
      fetchOverview();
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task? All progress will be lost.')) return;
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setEditName(task.name);
    setEditTime(task.scheduledTime);
    setEditColor(task.color || '#10b981');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/tasks/${editingTask._id}`, {
        name: editName,
        scheduledTime: editTime,
        color: editColor
      });
      setTasks(prev => prev.map(t => t._id === editingTask._id ? data.data : t));
      setShowEditModal(false);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <nav className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-800">Task Overview</h1>
          </div>
          <button onClick={() => navigate('/tasks')} className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-lg">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 2, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-slate-800">{monthName} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold">Today</button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">Task</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isToday = dateStr === today;
                  return (
                    <th key={day} className={`px-2 py-3 text-center text-xs font-bold ${isToday ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {day}
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={daysInMonth + 3} className="px-6 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" /></td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={daysInMonth + 3} className="px-6 py-20 text-center text-slate-500">No tasks. Create your first task!</td></tr>
              ) : (
                tasks.map(task => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10" style={{ borderLeft: `4px solid ${task.color || '#10b981'}` }}>
                      <span className="font-medium text-slate-800">{task.name}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                      <Clock size={14} className="inline mr-1" /> {task.scheduledTime}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const completed = task.entries?.[dateStr];
                      const isToday = dateStr === today;
                      const canToggle = isToday && !saving;
                      return (
                        <td key={day} className="px-2 py-3 text-center">
                          <button
                            onClick={() => canToggle && handleToggle(task._id, dateStr)}
                            disabled={!canToggle}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all mx-auto ${
                              completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 hover:bg-emerald-100'
                            } ${!canToggle ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {completed && <CheckCircle size={16} />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(task)} className="p-1 text-slate-400 hover:text-slate-600"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(task._id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Task Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Scheduled Time</label>
                <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Color</label>
                <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="w-full h-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold">Update</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskOverview;