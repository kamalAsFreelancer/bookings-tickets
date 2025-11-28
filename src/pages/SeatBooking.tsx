import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api, Seat, Show } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface SeatBookingProps {
  showId: number;
  onNavigate: (page: string) => void;
}

export default function SeatBooking({ showId, onNavigate }: SeatBookingProps) {
  const [show, setShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadSeats();
  }, [showId]);

  const loadSeats = async () => {
    try {
      const data = await api.getSeats(showId);
      setShow(data.show);
      setSeats(data.seats);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load seats';
      setError(errorMessage);
      console.error('Error loading seats:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber: string, isBooked: boolean) => {
    if (isBooked) return;

    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    if (!user || selectedSeats.length === 0) return;

    setBooking(true);
    try {
      const result = await api.bookTicket(user.id, showId, selectedSeats);
      if (result.success) {
        // store confirmation code and refresh seat layout so user can see their code
        if (result.confirmation_code) {
          setConfirmationCode(result.confirmation_code);
        }
        // refresh seats to reflect booked state
        await loadSeats();
        // show a success message inline instead of navigating away immediately
        setError('');
      } else {
        const errorMsg = result.error || 'Booking failed';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Booking failed. Please try again.';
      setError(errorMessage);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-xl text-white">Loading seats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 20;

  const getSeatStatus = (seatNumber: string) => {
    const seat = seats.find(s => s.seatNumber === seatNumber);
    if (!seat) return 'available';
    if (seat.isBooked) return 'booked';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const totalPrice = show ? show.price * selectedSeats.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back
        </button>

        {show && (
          <div className="bg-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{show.movie_title}</h1>
            <div className="text-xs sm:text-sm text-gray-400">
              {show.hall_name} | {new Date(show.date).toLocaleDateString()} | {show.time}
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="bg-slate-700 h-1 sm:h-2 rounded-t-full mb-1 sm:mb-2"></div>
            <div className="text-center text-gray-400 text-xs sm:text-sm">SCREEN</div>
          </div>

          <div className="flex flex-col items-center gap-1 sm:gap-2 lg:gap-3 mb-6 sm:mb-8 overflow-x-auto">
            {rows.map(row => (
              <div key={row} className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 sm:w-8 text-white font-semibold text-xs sm:text-base text-center">{row}</div>
                <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-full py-1">
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatNumber = `${row}${i + 1}`;
                    const status = getSeatStatus(seatNumber);

                    const button = (
                      <button
                        key={seatNumber}
                        onClick={() => toggleSeat(seatNumber, status === 'booked')}
                        disabled={status === 'booked'}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg text-sm sm:text-base font-semibold transition ${
                          status === 'booked'
                            ? 'bg-red-600 cursor-not-allowed text-white'
                            : status === 'selected'
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-600 hover:bg-slate-500 text-white'
                        }`}
                        title={seatNumber}
                      >
                        <span className="text-sm sm:text-base">{i + 1}</span>
                      </button>
                    );

                    // Insert a passage (gap) after the 10th seat (i === 9)
                    if (i === 10) {
                      return (
                        <React.Fragment key={`${seatNumber}-frag`}>
                          <div className="w-3 sm:w-6" />
                          {button}
                        </React.Fragment>
                      );
                    }

                    return button;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 text-xs sm:text-sm flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-600 rounded-t-lg"></div>
              <span className="text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-t-lg"></div>
              <span className="text-gray-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-t-lg"></div>
              <span className="text-gray-300">Booked</span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-white font-semibold mb-1 text-sm sm:text-base">Selected Seats:</div>
                  <div className="text-gray-300 text-xs sm:text-sm">{selectedSeats.sort().join(', ')}</div>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <div className="text-gray-400 text-xs mb-1">Total Amount</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{'Rs. '}{totalPrice}</div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={booking}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition"
              >
                {booking ? 'Processing...' : `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {confirmationCode && (
            <div className="mt-4 bg-slate-700 rounded-lg p-4 sm:p-6">
              <div className="text-gray-400 text-xs sm:text-sm mb-2">Your confirmation code</div>
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-2xl sm:text-3xl text-white tracking-widest">{confirmationCode}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(confirmationCode);
                      } catch (e) {
                        // fallback: do nothing
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm sm:text-base"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => onNavigate('my-bookings')}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm sm:text-base"
                  >
                    My Bookings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
