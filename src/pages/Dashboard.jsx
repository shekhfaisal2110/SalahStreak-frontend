import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import DownloadButtons from '../components/DownloadButtons';
import StepCounter from '../components/StepCounter';
import {
  Book, CircleDot, Trophy, ArrowRight, Calendar, Star,
  Heart, RefreshCw, Sun, Moon, Loader2, BookOpen,
  CheckCircle, XCircle, ListTodo
} from 'lucide-react';
import duas from '../data/dua';

const prayerList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function Dashboard() {
  const [totalDhikr, setTotalDhikr] = useState(0);
  const [monthlyCompletion, setMonthlyCompletion] = useState(0);
  const [globalRank, setGlobalRank] = useState('#?');
  const [duaOfDay, setDuaOfDay] = useState(null);
  const [todayPrayers, setTodayPrayers] = useState(null);
  const [todayDhikr, setTodayDhikr] = useState(0);
  const [topTasbeehs, setTopTasbeehs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalDhikr();
    fetchMonthlyCompletion();
    fetchUserRank();
    fetchTodayPrayers();
    fetchTodayDhikr();
    setDailyDua();
  }, []);

  const getDailyDuaIndex = () => {
    const today = new Date();
    const dateNum = today.getFullYear() * 1000 + (today.getMonth() + 1) * 50 + today.getDate();
    return dateNum % duas.length;
  };

  const setDailyDua = () => {
    const index = getDailyDuaIndex();
    setDuaOfDay(duas[index]);
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
      const month = String(now.getMonth() + 1).padStart(2, '0');
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
        const rank = res.data.data.streakRank || res.data.data.allDaysRank;
        setGlobalRank(rank ? `#${rank}` : '#?');
      }
    } catch (error) {
      console.error('Failed to fetch user rank');
    }
  };

  const fetchTodayPrayers = async () => {
    try {
      const res = await axios.get('/prayerbook/today');
      setTodayPrayers(res.data);
    } catch (error) {
      console.error('Failed to fetch today’s prayers');
      setTodayPrayers({ Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false });
    }
  };

  const fetchTodayDhikr = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`/tasbeeh/daily-totals?days=1`);
      if (res.data.success && res.data.data.length > 0) {
        const dayData = res.data.data.find(d => d._id === today);
        setTodayDhikr(dayData ? dayData.total : 0);
      }
      const tasbeehRes = await axios.get('/tasbeeh');
      const sorted = tasbeehRes.data.data
        .sort((a, b) => (b.currentCount || 0) - (a.currentCount || 0))
        .slice(0, 3);
      setTopTasbeehs(sorted);
    } catch (error) {
      console.error('Failed to fetch today’s dhikr');
    }
  };

  const pickRandomDua = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * duas.length);
    } while (duas[newIndex] === duaOfDay && duas.length > 1);
    setDuaOfDay(duas[newIndex]);
  };

  const prayerProgress = todayPrayers
    ? (Object.values(todayPrayers).filter(Boolean).length / 5) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Decorative Header */}
      <div className="bg-emerald-700 pt-8 pb-24 px-6 mb-[-80px]">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Assalamu Alaikum,{' '}
              <span className="text-emerald-200">{user?.name || 'User'}</span>!
            </h1>
            <p className="text-emerald-100/80 mt-1 text-sm md:text-base">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
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
        {/* First row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            title="Quran Tracker"
            desc="Track your Quran reading"
            icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
            borderColor="hover:border-emerald-500"
            onClick={() => navigate('/quran')}
          />
        </div>

        {/* Second row: 2 cards (centered on medium screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-2xl md:mx-auto lg:max-w-full lg:mx-0">
          <NavCard
            title="Tasks"
            desc="Manage daily tasks"
            icon={<ListTodo className="w-6 h-6 text-emerald-600" />}
            borderColor="hover:border-emerald-500"
            onClick={() => navigate('/tasks')}
          />
          
          <NavCard
            title="Leaderboard"
            desc="Compete with friends"
            icon={<Trophy className="w-6 h-6 text-amber-600" />}
            borderColor="hover:border-amber-500"
            onClick={() => navigate('/leaderboard')}
          />
        </div>

        {/* Reports, Summary, and Step Counter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Generate Reports</h3>
            <p className="text-emerald-100 text-sm mb-6">
              Download your prayer history as a PDF.
            </p>
            <DownloadButtons variant="light" />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
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

          <StepCounter />
        </div>

        {/* Second Row: Today's Prayer & Today's Dhikr */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Today's Prayer Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-800">Today's Prayer Progress</h3>
            </div>
            {!todayPrayers ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Completed</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {Object.values(todayPrayers).filter(Boolean).length} / 5
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${prayerProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-2 mb-3">
                  {prayerList.map((prayer) => {
                    const completed = todayPrayers[prayer];
                    return (
                      <div key={prayer} className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 mb-1">{prayer}</span>
                        {completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  {prayerProgress === 100
                    ? 'Masha’Allah! All prayers completed today.'
                    : 'Keep going – complete your prayers to maintain your streak.'}
                </p>
              </>
            )}
          </div>

          {/* Today's Dhikr Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800">Today's Dhikr</h3>
            </div>
            <div className="text-center mb-4">
              <span className="text-4xl font-black text-emerald-700">{todayDhikr}</span>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Dhikr Today</p>
            </div>
            {topTasbeehs.length > 0 && (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Top Tasbeehs</p>
                <div className="space-y-2">
                  {topTasbeehs.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 truncate max-w-[150px]">{t.name}</span>
                      <span className="text-sm font-bold text-emerald-700">{t.currentCount}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Daily Dua Section */}
        {duaOfDay && (
          <div className="mt-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-bold text-lg text-slate-800">دعائے امروز • आज की दुआ</h3>
                  <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 rounded-full">Daily Dua</span>
                </div>
                <button
                  onClick={pickRandomDua}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  title="New Dua"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">العربية</span>
                  </div>
                  <p className="font-arabic text-xl md:text-2xl text-emerald-700 leading-loose" dir="rtl">
                    {duaOfDay.arabic}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">اردو</span>
                  </div>
                  <p className="text-slate-600 text-base md:text-lg font-urdu" dir="rtl">
                    {duaOfDay.urdu}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">हिन्दी</span>
                  </div>
                  <p className="text-slate-600 text-base md:text-lg">
                    {duaOfDay.hindi}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {duaOfDay.reference}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="font-bold text-slate-700">{value}</span>
    </div>
  );
}