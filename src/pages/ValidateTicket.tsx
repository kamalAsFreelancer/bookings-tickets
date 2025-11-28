import { useState } from 'react';
import { ArrowLeft, Check, X, QrCode } from 'lucide-react';
import { api } from '../api/api';

interface ValidateTicketProps {
  onNavigate: (page: string) => void;
}

interface BookingDetail {
  id: number;
  user_name: string;
  user_email: string;
  movie_title: string;
  date: string;
  time: string;
  hall_name: string;
  seat_numbers: string;
  total_price: number;
  confirmation_code: string;
}

export default function ValidateTicket({ onNavigate }: ValidateTicketProps) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBooking(null);
    setValidated(false);
    setLoading(true);

    try {
      const data = await api.validateConfirmationCode(confirmationCode.trim().toUpperCase());
      setBooking(data.booking);
      setValidated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate confirmation code';
      setError(errorMessage);
      setValidated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfirmationCode('');
    setBooking(null);
    setError('');
    setValidated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Dashboard
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Validate Ticket</h1>
          </div>

          <form onSubmit={handleValidate} className="mb-8">
            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm font-semibold">
                Confirmation Code
              </label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                placeholder="e.g., A1B2C3D4"
                className="w-full bg-slate-700 text-white px-4 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg sm:text-2xl font-mono uppercase"
                maxLength={8}
                required
                disabled={validated}
              />
              <p className="text-gray-400 text-xs sm:text-sm mt-2">Enter the 8-character code from the ticket</p>
            </div>

            <button
              type="submit"
              disabled={loading || validated}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
            >
              {loading ? 'Validating...' : validated ? 'Code Validated' : 'Validate Code'}
            </button>
          </form>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-4 rounded-lg mb-6 flex items-start gap-3">
              <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm sm:text-base">{error}</div>
                <p className="text-xs sm:text-sm mt-1">Please check the confirmation code and try again</p>
              </div>
            </div>
          )}

          {validated && booking && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-4 rounded-lg flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm sm:text-base">Ticket Valid</div>
                  <p className="text-xs sm:text-sm mt-1">Booking found. Details below.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Customer Name</div>
                  <div className="text-white text-lg sm:text-xl font-semibold">{booking.user_name}</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Email</div>
                  <div className="text-white text-sm sm:text-base truncate">{booking.user_email}</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Movie</div>
                  <div className="text-white text-lg sm:text-xl font-semibold">{booking.movie_title}</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Hall</div>
                  <div className="text-white text-lg sm:text-xl font-semibold">{booking.hall_name}</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Date</div>
                  <div className="text-white text-lg sm:text-xl font-semibold">
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Time</div>
                  <div className="text-white text-lg sm:text-xl font-semibold">{booking.time}</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Seats</div>
                  <div className="text-white text-lg sm:text-xl font-mono font-semibold break-all">{booking.seat_numbers}</div>
                </div>

                <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-300 text-xs sm:text-sm font-semibold mb-1">Total Price</div>
                  <div className="text-green-400 text-lg sm:text-xl font-bold">Rs. {booking.total_price.toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 sm:p-6">
                <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-2">Confirmation Code</div>
                <div className="text-center">
                  <div className="text-blue-400 text-3xl sm:text-4xl font-mono font-bold tracking-widest">
                    {booking.confirmation_code}
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
              >
                Validate Another Code
              </button>
            </div>
          )}

          {!validated && !error && !booking && (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">Enter a confirmation code to validate a ticket</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
