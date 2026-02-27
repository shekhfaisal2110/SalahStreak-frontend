import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  ArrowLeft, Loader2, Eye, BarChart2, TrendingUp, Calendar,
  Download, FileText, Smartphone, Monitor
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('30days');
  const [chartType, setChartType] = useState('line');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState({ csv: false, pdf: false });

  useEffect(() => {
    fetchAllData();
  }, [timePeriod]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [summaryRes, dailyRes, devicesRes] = await Promise.all([
        axios.get('/analytics/summary'),
        fetchDailyDataInternal(),
        axios.get('/analytics/devices'),
      ]);
      setSummary(summaryRes.data.data);
      setDailyData(dailyRes);
      setDeviceData(devicesRes.data.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyDataInternal = async () => {
    const { start, end } = getDateParams();
    const { data } = await axios.get('/analytics/daily-views', {
      params: { startDate: start, endDate: end }
    });
    return data.data;
  };

  const getDateParams = () => {
    const end = new Date().toISOString().split('T')[0];
    const now = new Date();
    let start;
    switch (timePeriod) {
      case 'today': start = end; break;
      case 'week': start = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0]; break;
      case 'month': start = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0]; break;
      case 'year': start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0]; break;
      case 'all': start = '2000-01-01'; break;
      default: start = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
    }
    return { start, end };
  };

  const handleCustomSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Select both start and end dates');
      return;
    }
    setTimePeriod('custom');
    fetchAllData();
  };

  const downloadCSV = async () => {
    if (dailyData.length === 0) {
      toast.error('No data to download');
      return;
    }
    setDownloading(prev => ({ ...prev, csv: true }));
    try {
      const csvContent = "Date,Views\n" + dailyData.map(d => `${d._id},${d.count}`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `daily-views-${timePeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (error) {
      toast.error('Failed to download CSV');
    } finally {
      setDownloading(prev => ({ ...prev, csv: false }));
    }
  };

  const downloadPDF = async () => {
    setDownloading(prev => ({ ...prev, pdf: true }));
    try {
      const { start, end } = getDateParams();
      const response = await axios.get('/analytics/report', {
        params: { startDate: start, endDate: end },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${timePeriod}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF report downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF report');
    } finally {
      setDownloading(prev => ({ ...prev, pdf: false }));
    }
  };

  const totalViews = summary?.totalPageViews || 0;
  const totalEvents = summary?.totalEvents || 0;
  const uniqueRoutes = summary?.routeStats?.length || 0;
  const mobileViews = deviceData.find(d => d.name === 'Mobile')?.value || 0;
  const desktopViews = deviceData.find(d => d.name === 'Desktop')?.value || 0;

  const renderChart = () => {
    if (!dailyData || dailyData.length === 0) {
      return <div className="flex items-center justify-center h-full text-slate-400">No data</div>;
    }
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tickFormatter={(str) => str.slice(5)} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tickFormatter={(str) => str.slice(5)} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tickFormatter={(str) => str.slice(5)} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 truncate">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={downloadCSV} disabled={downloading.csv} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
              <Download size={18} /> {downloading.csv ? 'Preparing...' : 'CSV'}
            </button>
            <button onClick={downloadPDF} disabled={downloading.pdf} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
              <FileText size={18} /> {downloading.pdf ? 'Generating...' : 'PDF Report'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Time Period Selector */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-3 sm:mb-4 flex items-center gap-2"><Calendar size={20} /> Select Time Period</h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {['today','week','month','year','all'].map(p => (
              <button key={p} onClick={() => setTimePeriod(p)} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${timePeriod === p ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : p === 'year' ? 'This Year' : 'All Time'}
              </button>
            ))}
            <div className="flex flex-wrap items-center gap-2 ml-auto mt-2 sm:mt-0">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm" />
              <span className="text-slate-400">to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm" />
              <button onClick={handleCustomSearch} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold">Go</button>
            </div>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-xl">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-600">Total Page Views</h3>
            </div>
            <p className="text-2xl sm:text-4xl font-black text-emerald-700">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-600">Total Events</h3>
            </div>
            <p className="text-2xl sm:text-4xl font-black text-indigo-700">{totalEvents.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-amber-100 rounded-xl">
                <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-600">Unique Routes</h3>
            </div>
            <p className="text-2xl sm:text-4xl font-black text-amber-700">{uniqueRoutes.toLocaleString()}</p>
          </div>
        </div>
        

        {/* Device Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-xl">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-600">Mobile Views</h3>
            </div>
            <p className="text-2xl sm:text-4xl font-black text-indigo-700">{mobileViews.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-amber-100 rounded-xl">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-600">Desktop Views</h3>
            </div>
            <p className="text-2xl sm:text-4xl font-black text-amber-700">{desktopViews.toLocaleString()}</p>
          </div>
        </div>

        {/* Visualization Type Selector */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-3 sm:mb-4 flex items-center gap-2"><BarChart2 size={20} /> Choose Visualization Type</h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {['line','area','bar','pie'].map(type => (
              <button key={type} onClick={() => setChartType(type)} className={`p-2 sm:p-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1 sm:gap-2 ${chartType === type ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {type === 'line' ? '📈 Line' : type === 'area' ? '📊 Area' : type === 'bar' ? '📊 Bar' : '🥧 Pie'}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Trend Chart */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-3 sm:mb-4">📈 Daily Visits Trend</h3>
          <div className="h-64 sm:h-80 w-full min-h-[250px] sm:min-h-[320px]">
            {loading ? (
              <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
            ) : dailyData.length === 0 ? (
              <p className="text-center text-slate-500">No data for this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Device Usage Breakdown (only chart remains) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-3 sm:mb-4 flex items-center gap-2"><Smartphone size={20} /> Device Usage Breakdown</h3>
          <div className="h-56 sm:h-64 min-h-[180px] sm:min-h-[200px]">
            {deviceData.length === 0 ? (
              <p className="text-center text-slate-400">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;