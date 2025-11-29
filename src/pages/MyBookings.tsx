import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { api, Booking } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface MyBookingsProps {
  onNavigate: (page: string) => void;
}

export default function MyBookings({ onNavigate }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      const data = await api.getUserBookings(user.id);
      setBookings(data.bookings);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings';
      setError(errorMessage);
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please login to view your bookings</p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-xl text-white">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setLoading(true);
              if (user) loadBookings();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 sm:p-12 text-center">
            <Ticket className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-400 text-lg sm:text-xl mb-4">No bookings yet</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition text-sm sm:text-base"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-4">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-lg sm:text-2xl font-bold text-white mb-1">
                      {booking.movie_title}
                    </h2>
                    <div className="text-xs sm:text-sm text-gray-400">
                      Booking ID: #{booking.id}
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">
                      {'Rs. '}{booking.total_price}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <span>{new Date(booking.date!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm col-span-2 sm:col-span-1">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <span>{booking.hall_name}</span>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                  <div className="text-gray-400 text-xs sm:text-sm mb-1">Seats:</div>
                  <div className="text-white font-semibold text-sm sm:text-lg">
                    {booking.seat_numbers}
                  </div>
                </div>

                {booking.confirmation_code && (
                  <div className="mt-3 sm:mt-4 bg-blue-500/20 border border-blue-500 rounded-lg p-3 sm:p-4">
                    <div className="text-gray-300 text-xs sm:text-sm mb-2 font-semibold">Confirmation Code:</div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-white font-mono text-lg sm:text-xl tracking-widest">
                        {booking.confirmation_code}
                      </div>
                      <button
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(booking.confirmation_code || '');
                          } catch (e) {
                            // fallback
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:py-2 rounded text-xs sm:text-sm whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                  Booked on: {new Date(booking.booking_time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
