import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  ArrowLeft, Download, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const TaskLog = () => {
  const navigate = useNavigate();
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('4months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCompletions();
  }, [period]);

  const getDateRange = (period) => {
    const end = new Date().toISOString().split('T')[0];
    const now = new Date();
    let start;
    switch (period) {
      case '1month': start = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0]; break;
      case '4months': start = new Date(now.setMonth(now.getMonth() - 4)).toISOString().split('T')[0]; break;
      case '1year': start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0]; break;
      case 'all': start = '2000-01-01'; break;
      default: start = end;
    }
    return { start, end };
  };

  const fetchCompletions = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange(period);
      const { data } = await axios.get('/tasks/completions', { params: { startDate: start, endDate: end } });
      setCompletions(data.data);
    } catch (error) {
      toast.error('Failed to load completions');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSearch = async () => {
    if (!startDate || !endDate) { toast.error('Select both start and end dates'); return; }
    setLoading(true);
    try {
      const { data } = await axios.get('/tasks/completions', { params: { startDate, endDate } });
      setCompletions(data.data);
      setPeriod('custom');
    } catch (error) {
      toast.error('Failed to load completions');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { start, end } = period === 'custom' ? { start: startDate, end: endDate } : getDateRange(period);
      const response = await axios.post('/report/tasks', {
        startDate: start,
        endDate: end,
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `task-log-${period}.pdf`);
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

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full flex-shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 truncate">Task Completion Log</h1>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Download size={18} />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col gap-4">
            {/* Period buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-500 mr-2 w-full sm:w-auto">Period:</span>
              <div className="flex flex-wrap gap-2">
                {['1month','4months','1year','all'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                      period === p ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p === '1month' ? '1 Month' : p === '4months' ? '4 Months' : p === '1year' ? '1 Year' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom date range */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm font-bold text-slate-500">Custom:</span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <span className="text-slate-400 hidden sm:inline">to</span>
                  <span className="text-slate-400 sm:hidden">–</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <button
                  onClick={handleCustomSearch}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Time</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Task Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                ) : completions.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center text-slate-500">
                      No completions in this period.
                    </td>
                  </tr>
                ) : (
                  completions.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {item.time || '--:--'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.taskName}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskLog;