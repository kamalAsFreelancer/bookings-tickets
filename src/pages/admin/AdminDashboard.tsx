import { useEffect, useState } from 'react';
import { Film, Calendar, Ticket, DollarSign, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { api } from '../../api/api';

interface Stats {
  totalMovies: number;
  totalShows: number;
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalMovies: 0,
    totalShows: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data.stats);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics';
      setError(errorMessage);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Film, label: 'Total Movies', value: stats.totalMovies, color: 'bg-blue-500' },
    { icon: Calendar, label: 'Total Shows', value: stats.totalShows, color: 'bg-green-500' },
    { icon: Ticket, label: 'Total Bookings', value: stats.totalBookings, color: 'bg-purple-500' },
    { icon: DollarSign, label: 'Total Revenue', value: `Rs. ${stats.totalRevenue}`, color: 'bg-red-500' },
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-orange-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-lg sm:text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center px-4">
          <p className="text-red-400 text-base sm:text-lg lg:text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setLoading(true);
              loadStats();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`${card.color} p-3 sm:p-4 rounded-lg flex-shrink-0`}>
                  <card.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-gray-400 text-xs sm:text-sm">{card.label}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white break-words">{card.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <button
            onClick={() => onNavigate('add-movie')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 sm:p-8 text-center transition group"
          >
            <Film className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Add Movie</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Add a new movie to the system</p>
          </button>

          <button
            onClick={() => onNavigate('manage-shows')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 sm:p-8 text-center transition group"
          >
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Manage Shows</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Create and manage showtimes</p>
          </button>

          <button
            onClick={() => onNavigate('view-bookings')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 sm:p-8 text-center transition group"
          >
            <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">View Bookings</h3>
            <p className="text-gray-400 text-xs sm:text-sm">See all customer bookings</p>
          </button>

          <button
            onClick={() => onNavigate('collections')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 sm:p-8 text-center transition group"
          >
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Collections</h3>
            <p className="text-gray-400 text-xs sm:text-sm">View box office collections</p>
          </button>

          <button
            onClick={() => onNavigate('validate-ticket')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 sm:p-8 text-center transition group"
          >
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Verify Ticket</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Validate customer tickets by code</p>
          </button>
        </div>
      </div>
    </div>
  );
}
