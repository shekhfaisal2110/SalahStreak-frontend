import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Download, Share2, BarChart3, Star, CheckCircle,
  Clock, Award, TrendingUp, RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

// ==================== Date Utilities ====================
const formatDate = (date, formatStr) => {
  if (formatStr === 'yyyy-MM') return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  if (formatStr === 'MMMM yyyy') return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  if (formatStr === 'dd MMM yyyy') return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  if (formatStr === 'MMM dd') return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  return date.toLocaleDateString();
};

// ==================== Modern Chart Component ====================
const AnalyticsChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.Offered, d.Missed, 1)));

  return (
    <div className="w-full">
      <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group">
            <div className="relative w-full flex justify-center gap-1 h-48 items-end">
              {/* Offered Bar */}
              <div
                className="bg-emerald-500 w-full max-w-[20px] rounded-t-md transition-all duration-500 ease-out group-hover:bg-emerald-400"
                style={{ height: `${(item.Offered / maxValue) * 100}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                  Offered: {item.Offered}
                </div>
              </div>
              {/* Missed Bar */}
              <div
                className="bg-slate-200 w-full max-w-[20px] rounded-t-md transition-all duration-500 ease-out group-hover:bg-slate-300"
                style={{ height: `${(item.Missed / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="mt-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-tighter sm:tracking-normal">
              {item.name}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-8 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs font-bold text-slate-600">Offered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
          <span className="text-xs font-bold text-slate-600">Missed</span>
        </div>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
const PrayerBookSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerData, setPrayerData] = useState({});
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  // Load data – either from navigation state or from API
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (location.state?.currentDate && location.state?.prayerData) {
      setCurrentDate(new Date(location.state.currentDate));
      setPrayerData(location.state.prayerData);
      fetchStats(new Date(location.state.currentDate));
    } else {
      fetchPrayerBookData();
    }
  }, [user, location.state]);

  const fetchPrayerBookData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/prayerbook');
      if (data.success) {
        const dataObj = {};
        data.data.entries.forEach(entry => {
          dataObj[entry.date] = entry.prayers;
        });
        setPrayerData(dataObj);
        fetchStats(currentDate);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load prayer book data');
      setLoading(false);
    }
  };

  const fetchStats = async (date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1);
      const { data } = await axios.get(`/prayerbook/stats/${year}/${month}`);
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats error:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate('/prayerbook');
  const handleRefresh = () => fetchStats(currentDate);

  const exportPDF = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = formatDate(currentDate, 'yyyy-MM') + '-01';
      const response = await axios.post('/report/generate', {
        period: 'month',
        startDate,
        endDate,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prayer-summary-${formatDate(currentDate, 'yyyy-MM')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate report');
    }
  };

  const shareSummary = async () => {
    const shareData = {
      title: "My Monthly Prayer Summary 📿",
      text: `Here's my prayer summary for ${formatDate(currentDate, 'MMMM yyyy')}:
✅ Total Prayers: ${stats?.offered || 0}
📈 Completion Rate: ${stats?.completionRate || 0}%
🕌 Most Offered: ${stats?.mostOffered || '-'}
🙁 Most Missed: ${stats?.mostMissed || '-'}
⭐ Best Day: ${stats?.bestDay ? formatDate(new Date(stats.bestDay), 'dd MMM yyyy') : 'None'}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Summary shared!');
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}`);
        toast.success('Summary copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        toast.error('Unable to share at this time.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Generating Analytics...</p>
        </div>
      </div>
    );
  }

  const chartData = prayers.map(p => ({
    name: p,
    Offered: stats?.prayerCounts?.[p] || 0,
    Missed: stats?.missedPrayers?.[p] || 0,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={goBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
            Summary: {formatDate(currentDate, 'MMMM yyyy')}
          </h1>
          <button onClick={handleRefresh} className="p-2 hover:bg-slate-50 rounded-full">
            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Hero Stats Card */}
        <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100 overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Global Completion Rate</span>
              <h2 className="text-6xl font-black mt-2">{stats?.completionRate || 0}%</h2>
              <p className="text-emerald-100/80 mt-2 text-sm max-w-xs">
                You've completed {stats?.offered || 0} prayers this month. Keep striving for excellence!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <QuickStat label="Total Offered" value={stats?.offered || 0} />
              <QuickStat label="Days Tracked" value={stats?.totalDays || 0} />
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart and detailed breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Prayer Distribution
                </h3>
              </div>
              <AnalyticsChart data={chartData} />
            </div>

            {/* Detailed Prayer Breakdown Table */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Prayer Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Prayer</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">Offered</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-red-500 uppercase tracking-wider">Missed</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">Completion %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prayers.map(prayer => {
                      const offered = stats?.prayerCounts?.[prayer] || 0;
                      const missed = stats?.missedPrayers?.[prayer] || 0;
                      const total = offered + missed;
                      const percentage = total > 0 ? ((offered / total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={prayer} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{prayer}</td>
                          <td className="px-4 py-3 text-center text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                              {offered}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs">
                              {missed}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-20 bg-slate-200 rounded-full h-2">
                                <div className="bg-emerald-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="font-semibold text-slate-700 text-xs">{percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar – Highlights & Actions */}
          <div className="space-y-6">
            {/* Highlights Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" />
                Monthly Records
              </h3>
              <div className="space-y-4">
                <HighlightRow icon={<Star className="text-blue-500" />} label="Most Consistent" value={stats?.mostOffered || '-'} />
                <HighlightRow icon={<Clock className="text-red-400" />} label="Needs Focus" value={stats?.mostMissed || '-'} />
                <HighlightRow icon={<TrendingUp className="text-emerald-500" />} label="Best Day" value={stats?.bestDay ? formatDate(new Date(stats.bestDay), 'MMM dd') : '-'} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={shareSummary}
                className="w-full bg-slate-900 text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <Share2 className="w-5 h-5" /> Share Report
              </button>
              <button
                onClick={exportPDF}
                className="w-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                <Download className="w-5 h-5" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Islamic Footer */}
        <footer className="text-center py-8">
          <div className="flex items-center justify-center gap-3 text-emerald-600">
            <Star className="w-6 h-6" />
            <p className="text-lg font-medium">May Allah accept your prayers and increase your devotion</p>
            <Star className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm mt-2">اللهم تقبل منا صالح الأعمال</p>
          <p className="text-gray-400 text-xs mt-1">"O Allah, accept from us our righteous deeds"</p>
        </footer>
      </main>
    </div>
  );
};

// ==================== Helper Components ====================
const QuickStat = ({ label, value }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
    <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-tighter">{label}</p>
    <p className="text-xl font-black mt-1">{value}</p>
  </div>
);

const HighlightRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-800">{value}</span>
  </div>
);

export default PrayerBookSummary;