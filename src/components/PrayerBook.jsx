import React, { useEffect, useState } from 'react';
import {
  CheckCircle, Calendar, TrendingUp, RotateCcw,
  BarChart3, Star, Clock, User, Award, LogOut,
  ChevronLeft, ChevronRight, Info, AlertCircle,
  ArrowLeft // <-- Added import
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

// ==================== Date Utilities ====================
const formatDate = (date, formatStr) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (formatStr === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
  if (formatStr === 'yyyy-MM') return `${year}-${month}`;
  if (formatStr === 'EEEE') return date.toLocaleDateString('en-US', { weekday: 'long' });
  if (formatStr === 'MMM dd') return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  return date.toLocaleDateString();
};

const isBefore = (date1, date2) => date1.getTime() < date2.getTime();
const isToday = (date) => date.toDateString() === new Date().toDateString();

// ==================== Constants ====================
const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ==================== Main Component ====================
const PrayerBook = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = formatDate(new Date(), 'yyyy-MM-dd');

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerData, setPrayerData] = useState({});
  const [message, setMessage] = useState('');
  const [prayerStreak, setPrayerStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hijriCalendar, setHijriCalendar] = useState({});
  const [loadingHijri, setLoadingHijri] = useState(false);

  // ========== Fetch Prayer Book Data ==========
  useEffect(() => {
    fetchPrayerBook();
  }, []);

  const fetchPrayerBook = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/prayerbook');
      if (data.success) {
        const dataObj = {};
        data.data.entries.forEach(entry => {
          dataObj[entry.date] = entry.prayers;
        });
        setPrayerData(dataObj);
        setPrayerStreak(data.data.streak || 0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load prayer book data');
    } finally {
      setLoading(false);
    }
  };

  // ========== Fetch Hijri Calendar from Aladhan API ==========
  useEffect(() => {
    const fetchHijriCalendar = async () => {
      setLoadingHijri(true);
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const url = `https://api.aladhan.com/v1/calendarByCity?city=Ahmedabad&country=India&method=2&month=${month}&year=${year}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.code === 200 && result.data) {
          const lookup = {};
          result.data.forEach(day => {
            const gregDate = day.date.gregorian.date; // "DD-MM-YYYY"
            const [d, m, y] = gregDate.split('-');
            const isoDate = `${y}-${m}-${d}`;
            lookup[isoDate] = day.date;
          });
          setHijriCalendar(lookup);
        } else {
          console.warn('Hijri API returned non-200:', result);
        }
      } catch (error) {
        console.error('Failed to fetch Hijri calendar:', error);
        toast.error('Could not load Islamic dates');
      } finally {
        setLoadingHijri(false);
      }
    };
    fetchHijriCalendar();
  }, [currentDate]);

  // ========== Generate Days for Current Month ==========
  const daysInMonth = Array.from(
    { length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() },
    (_, i) => {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
      const dateStr = formatDate(dateObj, 'yyyy-MM-dd');
      const hijri = hijriCalendar[dateStr]?.hijri;
      return {
        date: dateStr,
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDayName: formatDate(dateObj, 'EEEE'),
        isToday: isToday(dateObj),
        hijriEn: hijri ? `${hijri.day} ${hijri.month.en}` : '',
      };
    }
  );

  // ========== Handle Prayer Check ==========
  const handleCheck = async (date, prayer) => {
    if (date !== today) {
      setMessage("❌ You can only log today's prayers.");
      setTimeout(() => setMessage(''), 2500);
      return;
    }

    const newValue = !prayerData[date]?.[prayer];
    setPrayerData(prev => ({
      ...prev,
      [date]: { ...prev[date], [prayer]: newValue }
    }));

    setSaving(true);
    try {
      const { data } = await axios.put('/prayerbook/update', {
        date,
        prayer,
        value: newValue
      });

      if (data.success) {
        setPrayerStreak(data.data.streak);
        toast.success('Prayer updated!');
      }
    } catch (error) {
      // Revert on error
      setPrayerData(prev => ({
        ...prev,
        [date]: { ...prev[date], [prayer]: !newValue }
      }));
      toast.error('Failed to update prayer');
    } finally {
      setSaving(false);
    }
  };

  // ========== Monthly Stats ==========
  const getStats = () => {
    const monthPrefix = formatDate(currentDate, 'yyyy-MM');
    const entries = Object.entries(prayerData).filter(([date]) =>
      date.startsWith(monthPrefix)
    );

    let offered = 0, missed = 0;
    const prayerCounts = {};
    const dailyCounts = {};

    entries.forEach(([date, record]) => {
      let dayTotal = 0;
      prayers.forEach(prayer => {
        if (record[prayer]) {
          offered++;
          prayerCounts[prayer] = (prayerCounts[prayer] || 0) + 1;
          dayTotal++;
        } else {
          missed++;
        }
      });
      dailyCounts[date] = dayTotal;
    });

    const mostOffered = Object.entries(prayerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    const mostMissed = Object.entries(prayerCounts).sort((a, b) => a[1] - b[1])[0]?.[0] || '-';
    const bestDay = Object.entries(dailyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return { offered, missed, mostOffered, mostMissed, bestDay };
  };

  const handleReset = () => setCurrentDate(new Date());
  const handleViewSummary = () => {
    navigate('/prayerbook/summary', {
      state: { currentDate: currentDate.toISOString(), prayerData, prayers }
    });
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const { offered, missed, mostOffered, mostMissed, bestDay } = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Sticky Header & Profile */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button to Dashboard */}
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Prayer Book</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current Streak</span>
              <span className="text-sm font-bold text-emerald-600">{prayerStreak} Days</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Message Alert */}
        {message && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Top Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Offered" value={offered} color="emerald" icon={<CheckCircle />} />
          <StatCard label="Missed" value={missed} color="red" icon={<Clock />} />
          <StatCard label="Favorite" value={mostOffered} color="blue" icon={<Star />} />
          <div className="hidden lg:block">
            <StatCard label="Best Day" value={bestDay !== '-' ? formatDate(new Date(bestDay), 'MMM dd') : '-'} color="purple" icon={<Award />} />
          </div>
          <div className="lg:hidden">
            <StatCard label="Streak" value={`${prayerStreak}d`} color="orange" icon={<TrendingUp />} />
          </div>
        </div>

        {/* Month Navigation Control */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 min-w-[150px] text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={handleViewSummary} className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all">
              Monthly Summary
            </button>
            <button onClick={handleReset} className="p-2 text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Tracker View */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-7 bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="col-span-2 text-sm font-bold text-slate-500 uppercase tracking-wider">Date & Hijri</div>
            {prayers.map(p => (
              <div key={p} className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider">{p}</div>
            ))}
          </div>

          {/* List / Table Body */}
          <div className="divide-y divide-slate-100">
            {daysInMonth.map((day) => (
              <div
                key={day.date}
                className={`
                  flex flex-col md:grid md:grid-cols-7 px-4 py-4 md:px-6 md:py-4 transition-colors
                  ${day.isToday ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}
                `}
              >
                {/* Date Info */}
                <div className="col-span-2 flex items-center justify-between md:justify-start gap-4 mb-4 md:mb-0">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-xl flex flex-col items-center justify-center border
                      ${day.isToday ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'}
                    `}>
                      <span className="text-xs font-bold leading-none uppercase">{day.dayName}</span>
                      <span className="text-sm font-extrabold">{day.date.split('-')[2]}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${day.isToday ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {day.isToday ? 'Today' : day.fullDayName}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                        {loadingHijri ? 'Loading...' : day.hijriEn}
                      </p>
                    </div>
                  </div>
                  {/* Mobile Badge */}
                  {day.isToday && <span className="md:hidden bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Current</span>}
                </div>

                {/* Prayer Checks */}
                <div className="grid grid-cols-5 md:contents gap-2">
                  {prayers.map(prayer => {
                    const isChecked = prayerData[day.date]?.[prayer];
                    const isEditable = day.date === today;
                    return (
                      <div key={prayer} className="flex flex-col items-center gap-1">
                        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">{prayer}</span>
                        <button
                          onClick={() => isEditable && handleCheck(day.date, prayer)}
                          disabled={!isEditable || saving}
                          className={`
                            w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all duration-200
                            ${isChecked
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                              : 'bg-slate-50 text-slate-300 border border-slate-100 hover:border-emerald-300'}
                            ${!isEditable ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-90'}
                          `}
                        >
                          <CheckCircle className={`w-5 h-5 ${isChecked ? 'block' : 'opacity-20'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hijri Date Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-medium border border-amber-200">
            <AlertCircle className="w-4 h-4" />
            Hijri dates are approximate and may vary by 1–2 days. Please verify with your local masjid.
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <Info className="w-4 h-4" />
            May Allah grant you consistency in your Ibadaat.
          </div>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">آمين يا رب العالمين</p>
        </footer>
      </main>
    </div>
  );
};

// Helper Stat Card Component
const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className={`p-4 rounded-3xl border ${colors[color]} flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        {React.cloneElement(icon, { className: 'w-4 h-4 opacity-70' })}
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
};

export default PrayerBook;