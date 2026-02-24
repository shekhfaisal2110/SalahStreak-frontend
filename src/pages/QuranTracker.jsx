import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { ArrowLeft, CheckCircle, Download, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QuranTracker = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completions, setCompletions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchProgress();
    fetchCompletions();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get('/quran/progress');
      setProgress(data.data);
    } catch (error) {
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletions = async () => {
    try {
      const { data } = await axios.get('/quran/completions');
      setCompletions(data.data);
    } catch (error) {
      toast.error('Failed to load history');
    }
  };

  const handleStartNew = async () => {
    try {
      const { data } = await axios.post('/quran/start');
      setProgress(data.data);
      toast.success('New Quran reading goal started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start');
    }
  };

  const handleMarkPara = async (para) => {
    if (!progress) return;
    try {
      const { data } = await axios.put(`/quran/para/${para}`);
      setProgress(data.data);
      if (data.data.completed) {
        toast.success(
          <div className="text-center">
            <p className="font-bold text-xl">मुबारक हो!</p>
            <p>आपने क़ुरआन पाक मुकम्मल किया।</p>
            <p>اللہ تعالیٰ آپ کے تمام نیک اعمال قبول فرمائے۔</p>
          </div>,
          { duration: 7000 }
        );
        fetchCompletions(); // refresh history
      }
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDownloadReport = async (period, customStart = null, customEnd = null) => {
    setDownloading(true);
    try {
      let start = '';
      let end = new Date().toISOString().split('T')[0];
      const now = new Date();

      if (period === 'custom' && customStart && customEnd) {
        start = customStart;
        end = customEnd;
      } else {
        switch (period) {
          case 'month':
            start = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
            break;
          case '4months':
            start = new Date(now.setMonth(now.getMonth() - 4)).toISOString().split('T')[0];
            break;
          case 'year':
            start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
            break;
          case 'all':
            start = '2000-01-01';
            break;
          default:
            start = end;
        }
      }

      const response = await axios.post('/report/quran', {
        startDate: start,
        endDate: end,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quran-report-${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setDownloading(false);
    }
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
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-black text-slate-800">Quran Reading Tracker</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Current Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Current Progress</h2>
          {!progress ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">You haven't started a Quran reading goal yet.</p>
              <button
                onClick={handleStartNew}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
              >
                Start New Goal
              </button>
            </div>
          ) : progress.completed ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-slate-800">Congratulations!</p>
              <p className="text-slate-600 mb-4">You completed all 30 paras on {new Date(progress.completedAt).toLocaleDateString()}.</p>
              <button
                onClick={handleStartNew}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
              >
                Start New Cycle
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-2">Started: {new Date(progress.startDate).toLocaleDateString()}</p>
              <div className="grid grid-cols-6 md:grid-cols-10 gap-2 mb-6">
                {progress.paras.map((completed, idx) => (
                  <button
                    key={idx}
                    onClick={() => !completed && handleMarkPara(idx + 1)}
                    className={`
                      p-3 rounded-xl text-sm font-bold transition-all
                      ${completed
                        ? 'bg-emerald-500 text-white cursor-default'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                      }
                    `}
                  >
                    {idx + 1}
                    {completed && <CheckCircle className="w-4 h-4 inline ml-1" />}
                  </button>
                ))}
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${(progress.paras.filter(p => p).length / 30) * 100}%` }}
                />
              </div>
              <p className="text-sm text-right mt-2 text-slate-600">
                {progress.paras.filter(p => p).length} / 30 completed
              </p>
            </>
          )}
        </div>

        {/* Completion History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Past Completions</h2>
          {completions.length === 0 ? (
            <p className="text-slate-500">No completions yet.</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {completions.map((comp, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">{new Date(comp.completedAt).toLocaleDateString()}</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {comp.durationDays ? `${comp.durationDays} days` : 'Completed'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Download */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Download Report</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleDownloadReport('month')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Last Month
            </button>
            <button
              onClick={() => handleDownloadReport('4months')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Last 4 Months
            </button>
            <button
              onClick={() => handleDownloadReport('year')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Last Year
            </button>
            <button
              onClick={() => handleDownloadReport('all')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              All Time
            </button>
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              onClick={() => handleDownloadReport('custom', startDate, endDate)}
              disabled={downloading || !startDate || !endDate}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Download Custom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranTracker;