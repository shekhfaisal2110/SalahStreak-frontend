import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { ArrowLeft, Calendar, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TasbeehSummary = () => {
  const navigate = useNavigate();
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAllDays, setTotalAllDays] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchDailyTotals(30);
  }, []);

  const fetchDailyTotals = async (days = 30) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/tasbeeh/daily-totals?days=${days}`);
      if (data.success) {
        setDailyData(data.data);
        const sum = data.data.reduce((acc, day) => acc + day.total, 0);
        setTotalAllDays(sum);
      }
    } catch (error) {
      toast.error('Failed to load daily totals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleDownload = async (period, customStart = null, customEnd = null) => {
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

      // Use the correct backend endpoint: /report/tasbeeh-daily
      const response = await axios.post('/report/tasbeeh-daily', {
        startDate: start,
        endDate: end,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasbeeh-report-${period}.pdf`);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/tasbeeh')}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-black text-slate-800">Dhikr Summary</h1>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Daily Totals Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Daily Dhikr (Last 30 Days)</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : dailyData.length === 0 ? (
            <p className="text-slate-500 text-sm">No daily data yet. Start counting!</p>
          ) : (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {dailyData.map((day) => (
                  <div key={day._id} className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">{formatDate(day._id)}</span>
                    <span className="text-sm font-bold text-emerald-700">{day.total}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Total (30 days)</span>
                <span className="text-lg font-black text-emerald-800">{totalAllDays}</span>
              </div>
            </>
          )}
        </div>

        {/* Report Download Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Download Tasbeeh Report</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleDownload('month')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Last Month
            </button>
            <button
              onClick={() => handleDownload('4months')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Last 4 Months
            </button>
            <button
              onClick={() => handleDownload('year')}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Last Year
            </button>
            <button
              onClick={() => handleDownload('all')}
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
              onClick={() => handleDownload('custom', startDate, endDate)}
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

export default TasbeehSummary;