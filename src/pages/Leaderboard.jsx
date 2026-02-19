import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { Trophy, Medal, TrendingUp, CalendarCheck, Crown, ChevronRight, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('allDays');
  const [allDaysData, setAllDaysData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [dhikrData, setDhikrData] = useState([]);
  const [userRank, setUserRank] = useState({ allDaysRank: null, streakRank: null, dhikrRank: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard(activeTab);
    fetchUserRank();
  }, []);

  const fetchLeaderboard = async (type) => {
    setLoading(true);
    try {
      let endpoint;
      if (type === 'allDays') endpoint = '/leaderboard/all-days-completed';
      else if (type === 'streak') endpoint = '/leaderboard/streak';
      else endpoint = '/leaderboard/total-dhikr';

      const { data } = await axios.get(endpoint);
      if (data.success) {
        if (type === 'allDays') setAllDaysData(data.data);
        else if (type === 'streak') setStreakData(data.data);
        else setDhikrData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const { data } = await axios.get('/leaderboard/rank');
      if (data.success) {
        setUserRank(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user rank');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'allDays' && allDaysData.length === 0) {
      fetchLeaderboard('allDays');
    } else if (tab === 'streak' && streakData.length === 0) {
      fetchLeaderboard('streak');
    } else if (tab === 'dhikr' && dhikrData.length === 0) {
      fetchLeaderboard('dhikr');
    }
  };

  const data = activeTab === 'allDays' ? allDaysData : activeTab === 'streak' ? streakData : dhikrData;
  let unit, rankKey;
  if (activeTab === 'allDays') {
    unit = 'Days';
    rankKey = 'count';
  } else if (activeTab === 'streak') {
    unit = 'Streak';
    rankKey = 'streak';
  } else {
    unit = 'Dhikr';
    rankKey = 'totalDhikr';
  }

  const topThree = data.slice(0, 3);
  const remaining = data.slice(3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-2">
                <Trophy size={16} /> Community
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hall of Fame</h1>
            </div>
          </div>

          {/* User's Personal Stats Card – three blocks */}
          <div className="flex bg-slate-900 rounded-[2rem] p-2 shadow-xl shadow-slate-200">
            <UserStatBlock
              label="Days Rank"
              value={userRank.allDaysRank ? `#${userRank.allDaysRank}` : '--'}
              active={activeTab === 'allDays'}
            />
            <div className="w-[1px] bg-slate-800 my-4" />
            <UserStatBlock
              label="Streak Rank"
              value={userRank.streakRank ? `#${userRank.streakRank}` : '--'}
              active={activeTab === 'streak'}
            />
            <div className="w-[1px] bg-slate-800 my-4" />
            <UserStatBlock
              label="Dhikr Rank"
              value={userRank.dhikrRank ? `#${userRank.dhikrRank}` : '--'}
              active={activeTab === 'dhikr'}
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
          <TabButton
            active={activeTab === 'allDays'}
            onClick={() => handleTabChange('allDays')}
            icon={<CalendarCheck size={18} />}
            label="Consistency"
          />
          <TabButton
            active={activeTab === 'streak'}
            onClick={() => handleTabChange('streak')}
            icon={<TrendingUp size={18} />}
            label="Active Streaks"
          />
          <TabButton
            active={activeTab === 'dhikr'}
            onClick={() => handleTabChange('dhikr')}
            icon={<Star size={18} />}
            label="Total Dhikr"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Gathering Champions...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Podium Section */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-10 pb-4">
                {/* 2nd Place */}
                {topThree[1] && (
                  <PodiumCard
                    item={topThree[1]}
                    rank={2}
                    color="text-slate-400"
                    unit={unit}
                    rankKey={rankKey}
                  />
                )}
                {/* 1st Place */}
                {topThree[0] && (
                  <PodiumCard
                    item={topThree[0]}
                    rank={1}
                    color="text-amber-400"
                    unit={unit}
                    rankKey={rankKey}
                    isGold
                  />
                )}
                {/* 3rd Place */}
                {topThree[2] && (
                  <PodiumCard
                    item={topThree[2]}
                    rank={3}
                    color="text-amber-700"
                    unit={unit}
                    rankKey={rankKey}
                  />
                )}
              </div>
            )}

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-50">
                {remaining.map((item, index) => (
                  <LeaderboardRow
                    key={index}
                    item={item}
                    rank={index + 4}
                    isUser={item.email === user?.email}
                    rankKey={rankKey}
                    unit={unit}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Sub-Components (unchanged) ---
const UserStatBlock = ({ label, value, active }) => (
  <div className={`px-6 py-3 rounded-[1.5rem] text-center transition-colors ${active ? 'bg-emerald-600' : ''}`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
    <p className={`text-xl font-black ${active ? 'text-white' : 'text-slate-200'}`}>{value}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {icon} {label}
  </button>
);

const PodiumCard = ({ item, rank, color, unit, rankKey, isGold }) => (
  <div
    className={`relative bg-white rounded-[2rem] p-6 text-center border border-slate-100 shadow-sm transition-transform hover:scale-105 ${
      isGold ? 'md:-translate-y-6 md:shadow-xl ring-2 ring-amber-400/20' : ''
    }`}
  >
    <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-slate-50 ${color}`}>
      {rank === 1 ? <Crown size={24} fill="currentColor" /> : <Medal size={24} />}
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rank #{rank}</p>
    <h3 className="font-black text-slate-800 truncate mb-2">{item.name || item.userInfo?.name}</h3>
    <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-black">
      {item[rankKey]} {unit}
    </div>
  </div>
);

const LeaderboardRow = ({ item, rank, isUser, rankKey, unit }) => (
  <div
    className={`flex items-center justify-between p-6 transition-colors ${
      isUser ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-6">
      <span className="w-8 text-sm font-black text-slate-300">#{rank}</span>
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase">
        {(item.name || 'U').charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          {item.name || item.userInfo?.name}
          {isUser && (
            <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">You</span>
          )}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Achiever</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-lg font-black text-slate-900">{item[rankKey]}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{unit}</p>
      </div>
      <ChevronRight className="text-slate-200" size={16} />
    </div>
  </div>
);