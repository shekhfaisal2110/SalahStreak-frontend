import React from 'react';
import { Download, Calendar, CalendarRange, Infinity } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const periods = [
  { label: 'This Week', value: 'week', icon: Calendar },
  { label: 'This Month', value: 'month', icon: CalendarRange },
  { label: 'Last 4 Months', value: '4months', icon: CalendarRange },
  { label: 'This Year', value: 'year', icon: CalendarRange },
  { label: 'All Time', value: 'all', icon: Infinity },
];

export default function DownloadButtons() {
  const handleDownload = async (period) => {
    try {
      // Calculate date range based on period
      const endDate = new Date().toISOString().split('T')[0];
      let startDate;
      const now = new Date();

      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
          break;
        case '4months':
          startDate = new Date(now.setMonth(now.getMonth() - 4)).toISOString().split('T')[0];
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
          break;
        case 'all':
          startDate = '2000-01-01'; // far past
          break;
        default:
          startDate = endDate;
      }

      const response = await axios.post('/report/generate', {
        period,
        startDate,
        endDate,
      }, { responseType: 'blob' });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prayer-report-${period}.pdf`);
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

  return (
    <div className="flex flex-wrap gap-3">
      {periods.map(({ label, value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => handleDownload(value)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
          <Download className="w-4 h-4 ml-1" />
        </button>
      ))}
    </div>
  );
}