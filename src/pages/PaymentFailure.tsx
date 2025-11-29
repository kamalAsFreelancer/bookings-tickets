import { XCircle, AlertCircle } from 'lucide-react';

interface PaymentFailureProps {
  onNavigate: (page: string) => void;
}

export default function PaymentFailure({ onNavigate }: PaymentFailureProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-8 px-4">
      <div className="bg-slate-800 rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-4" />
        
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Payment Failed
        </h1>
        
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Your payment could not be processed. Please try again.
        </p>

        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-red-400 text-sm">
              The payment transaction could not be completed. Your seat selection has been cleared.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base"
          >
            Try Again
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
