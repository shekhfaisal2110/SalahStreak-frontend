import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { Save, Hash, Languages, Target, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const TasbeehCounter = () => {
  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [targetCount, setTargetCount] = useState(33);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const presets = [33, 99, 100, 1000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/tasbeeh', { name, arabicName, targetCount });
      toast.success('New Dhikr added to your list');
      navigate('/tasbeeh');
    } catch (error) {
      toast.error('Could not save Tasbeeh');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/tasbeeh')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Add New Dhikr</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Names */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                <Languages size={14} /> Identification
              </label>
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name (e.g. SubhanAllah)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="سُبْحَانَ ٱللَّٰهِ"
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 font-bold text-xl text-emerald-700 placeholder:text-slate-300 text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Section: Target */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                <Target size={14} /> Goal Setting
              </label>
              
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                  <Hash size={20} />
                </div>
                <input
                  type="number"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value) || '')}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                  required
                />
              </div>

              {/* Presets */}
              <div className="grid grid-cols-4 gap-2">
                {presets.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTargetCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      targetCount === num 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Create Tasbeeh'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasbeeh')}
              className="w-full py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TasbeehCounter;