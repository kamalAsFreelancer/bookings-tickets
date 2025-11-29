import { CheckCircle, Copy } from 'lucide-react';

interface PaymentSuccessProps {
  confirmationCode: string;
  bookingId: number;
  onNavigate: (page: string) => void;
}

export default function PaymentSuccess({
  confirmationCode,
  bookingId,
  onNavigate
}: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-8 px-4">
      <div className="bg-slate-800 rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Your booking has been confirmed and seats are reserved.
        </p>

        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 sm:p-6 mb-6">
          <div className="text-gray-300 text-xs sm:text-sm mb-2 font-semibold">
            Confirmation Code
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-white font-mono text-xl sm:text-2xl tracking-widest">
              {confirmationCode}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(confirmationCode)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
              title="Copy confirmation code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 mb-6 text-sm text-gray-300">
          <p>
            <strong>Booking ID:</strong> {bookingId}
          </p>
          <p className="mt-2">
            Save your confirmation code. You'll need it at the counter to collect your tickets.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('my-bookings')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base"
          >
            View My Bookings
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
