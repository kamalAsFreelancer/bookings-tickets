import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { api, Booking } from '../../api/api';

interface ViewBookingsProps {
  onNavigate: (page: string) => void;
}

export default function ViewBookings({ onNavigate }: ViewBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking =>
        booking.movie_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  const loadBookings = async () => {
    try {
      const data = await api.getAllBookings();
      setBookings(data.bookings);
      setFilteredBookings(data.bookings);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings';
      setError(errorMessage);
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-lg sm:text-xl text-white">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400 text-base sm:text-lg lg:text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setLoading(true);
              loadBookings();
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
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Dashboard
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">All Bookings</h1>
            <div className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
              Total: <span className="text-white font-semibold">{filteredBookings.length}</span> bookings
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by movie, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg sm:text-xl">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:-mx-8">
              <div className="inline-block min-w-full px-6 sm:px-8">
                <div className="space-y-3 sm:space-y-0 sm:border-t sm:border-slate-700">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-slate-700/30 sm:border-b sm:border-slate-700 sm:hover:bg-slate-700/50 transition p-4 sm:p-0 rounded-lg sm:rounded-none"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 sm:items-center gap-2 sm:gap-4 sm:py-4 sm:px-4">
                        <div className="sm:col-span-1">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">ID</div>
                          <div className="text-white text-sm sm:text-base">#{booking.id}</div>
                        </div>
                        
                        <div className="sm:col-span-1">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">Customer</div>
                          <div className="text-white font-medium text-sm sm:text-base">{booking.user_name}</div>
                          <div className="text-gray-400 text-xs">{booking.user_email}</div>
                        </div>
                        
                        <div className="sm:col-span-1">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">Movie</div>
                          <div className="text-white text-sm sm:text-base">{booking.movie_title}</div>
                        </div>
                        
                        <div className="sm:col-span-1">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">Date & Time</div>
                          <div className="text-white text-sm sm:text-base">{new Date(booking.date!).toLocaleDateString()}</div>
                          <div className="text-gray-400 text-xs">{booking.time}</div>
                        </div>
                        
                        <div className="sm:col-span-1">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">Hall</div>
                          <div className="text-white text-sm sm:text-base">{booking.hall_name}</div>
                        </div>
                        
                        <div className="sm:col-span-1">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">Seats</div>
                          <div className="text-white font-mono text-xs sm:text-sm break-all">{booking.seat_numbers}</div>
                        </div>
                        
                        <div className="sm:col-span-1 sm:text-right">
                          <div className="text-xs text-gray-400 sm:hidden font-semibold">Amount</div>
                          <div className="text-green-400 font-semibold text-sm sm:text-base">{'Rs. '}{booking.total_price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
