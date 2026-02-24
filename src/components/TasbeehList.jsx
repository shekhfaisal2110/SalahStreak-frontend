import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  Plus, RotateCcw, Trash2, CheckCircle, Star, PlusCircle, Fingerprint,
  X, Edit2, ArrowLeft, Pin, Eye, EyeOff, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const TasbeehList = () => {
  const [tasbeehs, setTasbeehs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTasbeeh, setSelectedTasbeeh] = useState(null);
  const [customCount, setCustomCount] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasbeehs();
  }, []);

  const fetchTasbeehs = async () => {
    try {
      const { data } = await axios.get('/tasbeeh');
      setTasbeehs(data.data);
    } catch (error) {
      toast.error('Failed to load tasbeeh list');
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (id) => {
    try {
      const { data } = await axios.put(`/tasbeeh/${id}/pin`);
      if (data.success) {
        setTasbeehs(prev => prev.map(t => t._id === id ? data.data : t));
      }
    } catch (error) {
      toast.error('Failed to update pin');
    }
  };

  const toggleShowCount = async (id) => {
    try {
      const { data } = await axios.put(`/tasbeeh/${id}/show`);
      if (data.success) {
        setTasbeehs(prev => prev.map(t => t._id === id ? data.data : t));
      }
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleIncrement = async (id, count = 1) => {
    const targetTasbeeh = tasbeehs.find(t => t._id === id);
    if (!targetTasbeeh || targetTasbeeh.completed) return;

    setTasbeehs(prev => prev.map(t =>
      t._id === id
        ? { ...t, currentCount: Math.min(t.currentCount + count, t.targetCount) }
        : t
    ));

    try {
      const { data } = await axios.put(`/tasbeeh/${id}/increment`, { count });
      if (data.data.completed) {
        toast.success(
          <div className="text-center py-2">
            <p className="font-bold text-xl mb-1">ماشاء اللہ</p>
            <p className="text-sm">Tasbeeh Completed!</p>
          </div>,
          { duration: 5000 }
        );
      }
    } catch (error) {
      toast.error('Failed to update count');
      fetchTasbeehs();
    }
  };

  const openAddModal = (tasbeeh) => {
    setSelectedTasbeeh(tasbeeh);
    setCustomCount('');
    setShowAddModal(true);
  };

  const handleAddCustom = () => {
    const count = parseInt(customCount, 10);
    if (isNaN(count) || count <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    handleIncrement(selectedTasbeeh._id, count);
    setShowAddModal(false);
  };

  const openEditModal = (tasbeeh) => {
    setSelectedTasbeeh(tasbeeh);
    setNewTarget(tasbeeh.targetCount);
    setShowEditModal(true);
  };

  const handleUpdateTarget = async () => {
    const target = parseInt(newTarget, 10);
    if (isNaN(target) || target < 1) {
      toast.error('Please enter a valid positive number');
      return;
    }

    setTasbeehs(prev => prev.map(t =>
      t._id === selectedTasbeeh._id
        ? { ...t, targetCount: target, completed: t.currentCount >= target }
        : t
    ));

    try {
      await axios.put(`/tasbeeh/${selectedTasbeeh._id}/target`, { targetCount: target });
      toast.success('Goal updated');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update goal');
      fetchTasbeehs();
    }
  };

  const handleReset = async (id) => {
    if (!window.confirm('Are you sure you want to reset this tasbeeh?')) return;

    setTasbeehs(prev => prev.map(t =>
      t._id === id ? { ...t, currentCount: 0, completed: false, completedAt: null } : t
    ));

    try {
      const { data } = await axios.put(`/tasbeeh/${id}/reset`);
      setTasbeehs(prev => prev.map(t =>
        t._id === id ? { ...data.data, pinned: t.pinned, showCount: t.showCount } : t
      ));
    } catch (error) {
      toast.error('Failed to reset');
      fetchTasbeehs();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/tasbeeh/${id}`);
      setTasbeehs(prev => prev.filter(t => t._id !== id));
      toast.success('Tasbeeh deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const sortedTasbeehs = [...tasbeehs].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header with back button and summary icon */}
      <nav className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dhikr Station</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Tasbeeh</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* New icon to navigate to summary page */}
            <button
              onClick={() => navigate('/tasbeeh/summary')}
              className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-full transition-colors"
              aria-label="View Summary"
            >
              <BarChart3 className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/tasbeeh/new')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-90"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTasbeehs.map(tasbeeh => {
            const progress = (tasbeeh.currentCount / tasbeeh.targetCount) * 100;
            const isDone = tasbeeh.completed;

            return (
              <div key={tasbeeh._id} className={`bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group ${tasbeeh.pinned ? 'ring-2 ring-amber-400' : ''}`}>
                <div
                  className="absolute bottom-0 left-0 w-full bg-emerald-50/50 transition-all duration-1000 ease-in-out"
                  style={{ height: `${progress}%` }}
                />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{tasbeeh.name}</h3>
                      {tasbeeh.arabicName && (
                        <p className="text-3xl font-bold text-slate-800 font-arabic leading-relaxed">
                          {tasbeeh.arabicName}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => togglePin(tasbeeh._id)}
                        className={`p-2 rounded-full transition-colors ${
                          tasbeeh.pinned
                            ? 'text-amber-600 hover:text-amber-700 bg-amber-50'
                            : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Pin size={18} fill={tasbeeh.pinned ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => toggleShowCount(tasbeeh._id)}
                        className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                      >
                        {tasbeeh.showCount ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleReset(tasbeeh._id)}
                        className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tasbeeh._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative mb-8">
                      <div className="text-center">
                        <span className="text-7xl font-black text-slate-900 tabular-nums">
                          {tasbeeh.showCount ? tasbeeh.currentCount : '•••'}
                        </span>
                        <div className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest flex items-center justify-center gap-2">
                          <span>Goal: {tasbeeh.targetCount}</span>
                          {!isDone && (
                            <>
                              <button
                                onClick={() => openAddModal(tasbeeh)}
                                className="text-emerald-600 hover:text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full"
                              >
                                + Add
                              </button>
                              <button
                                onClick={() => openEditModal(tasbeeh)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <Edit2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {isDone ? (
                      <div className="w-full bg-emerald-500 text-white py-5 rounded-3xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-emerald-100 animate-in fade-in zoom-in duration-300">
                        <CheckCircle size={24} /> Finished
                      </div>
                    ) : (
                      <button
                        onClick={() => handleIncrement(tasbeeh._id, 1)}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold flex items-center justify-center gap-4 hover:bg-slate-800 transition-all active:scale-[0.95] active:bg-emerald-600 shadow-xl shadow-slate-200 tap-highlight-transparent"
                      >
                        <Fingerprint size={28} className="opacity-50" />
                        <span className="text-xl uppercase tracking-tighter">Tap to count</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasbeehs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your Dhikr list is empty</h2>
            <p className="text-slate-400 mt-2 mb-8">Start your spiritual journey by adding a tasbeeh.</p>
            <button
              onClick={() => navigate('/tasbeeh/new')}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2"
            >
              <PlusCircle size={20} /> Create First Tasbeeh
            </button>
          </div>
        )}
      </div>

      {/* Custom Increment Modal (unchanged) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Add Custom Count</h3>
            <p className="text-sm text-slate-500 mb-6">
              How many times did you recite <span className="font-bold text-emerald-600">{selectedTasbeeh?.name}</span>?
            </p>
            <input
              type="number"
              min="1"
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
              placeholder="Enter number"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddCustom}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal (unchanged) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Edit Goal</h3>
            <p className="text-sm text-slate-500 mb-6">
              Set a new target for <span className="font-bold text-emerald-600">{selectedTasbeeh?.name}</span>
            </p>
            <input
              type="number"
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="New target"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateTarget}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasbeehList;