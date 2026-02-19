import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import PrayerChecklist from '../components/PrayerChecklist';
import DownloadButtons from '../components/DownloadButtons';
import { Book, CircleDot, Trophy, ArrowRight, Calendar, Star } from 'lucide-react';

export default function Dashboard() {
  const [prayers, setPrayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalDhikr, setTotalDhikr] = useState(0);
  const [monthlyCompletion, setMonthlyCompletion] = useState(0);
  const [globalRank, setGlobalRank] = useState('#?');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayPrayers();
    fetchTotalDhikr();
    fetchMonthlyCompletion();
    fetchUserRank();
  }, []);

  const fetchTodayPrayers = async () => {
    try {
      const res = await axios.get('/prayer/today');
      setPrayers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalDhikr = async () => {
    try {
      const res = await axios.get('/tasbeeh');
      const tasbeehs = res.data.data;
      const total = tasbeehs.reduce((sum, t) => sum + (t.currentCount || 0), 0);
      setTotalDhikr(total);
    } catch (error) {
      console.error('Failed to fetch tasbeeh data');
    }
  };

  const fetchMonthlyCompletion = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1);
      const res = await axios.get(`/prayerbook/stats/${year}/${month}`);
      if (res.data.success) {
        setMonthlyCompletion(res.data.data.completionRate || 0);
      }
    } catch (error) {
      console.error('Failed to fetch monthly stats');
    }
  };

  const fetchUserRank = async () => {
    try {
      const res = await axios.get('/leaderboard/rank');
      if (res.data.success) {
        // Use streak rank if available, otherwise all‑days rank
        const rank = res.data.data.streakRank || res.data.data.allDaysRank;
        setGlobalRank(rank ? `#${rank}` : '#?');
      }
    } catch (error) {
      console.error('Failed to fetch user rank');
    }
  };

  const updatePrayer = async (updates) => {
    try {
      const res = await axios.put('/prayer/today', updates);
      setPrayers(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  const completedCount = prayers ? Object.values(prayers).filter(v => v === true).length : 0;
  const progressPercent = (completedCount / 5) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-slate-600 font-medium">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Decorative Header */}
      <div className="bg-emerald-700 pt-8 pb-24 px-6 mb-[-80px]">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Assalamu Alaikum, <span className="text-emerald-200">{user?.name || 'User'}</span>!
            </h1>
            <p className="text-emerald-100/80 mt-1 text-sm md:text-base">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="hidden md:flex bg-emerald-600/50 backdrop-blur-md rounded-full px-4 py-2 items-center gap-2 border border-emerald-400/30">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-semibold text-sm">
              {user?.streak || 0} Day Streak!
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <NavCard
            title="Prayer Book"
            desc="Monthly stats & streaks"
            icon={<Book className="w-6 h-6 text-emerald-600" />}
            borderColor="hover:border-emerald-500"
            onClick={() => navigate('/prayerbook')}
          />
          <NavCard
            title="Tasbeeh"
            desc="Daily dhikr counter"
            icon={<CircleDot className="w-6 h-6 text-indigo-600" />}
            borderColor="hover:border-indigo-500"
            onClick={() => navigate('/tasbeeh')}
          />
          <NavCard
            title="Leaderboard"
            desc="Compete with friends"
            icon={<Trophy className="w-6 h-6 text-amber-600" />}
            borderColor="hover:border-amber-500"
            onClick={() => navigate('/leaderboard')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Prayer Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Today's Prayers</h2>
                  <p className="text-slate-500 text-sm">Keep up the consistency!</p>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-emerald-700">{completedCount}/5</span>
                </div>
              </div>

              <div className="p-6">
                <PrayerChecklist prayers={prayers} onUpdate={updatePrayer} />
              </div>
            </div>
          </div>

          {/* Sidebar: Downloads & Extras */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Generate Reports</h3>
              <p className="text-emerald-100 text-sm mb-6">Download your prayer history as a PDF or Excel sheet.</p>
              <DownloadButtons variant="light" />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800">Quick Summary</h3>
              </div>
              <div className="space-y-3">
                <SummaryRow label="Total Dhikr" value={totalDhikr.toLocaleString()} />
                <SummaryRow label="This Month" value={`${monthlyCompletion}%`} />
                <SummaryRow label="Global Rank" value={globalRank} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function NavCard({ title, desc, icon, borderColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-transparent shadow-sm transition-all duration-200 ${borderColor} hover:shadow-md active:scale-95 text-left`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-opacity-0 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
    </button>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="font-bold text-slate-700">{value}</span>
    </div>
  );
}