import { useEffect, useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface PaymentPageProps {
  showId: number;
  selectedSeats: string[];
  totalPrice: number;
  onSuccess: (confirmationCode: string, bookingId: number) => void;
  onCancel: () => void;
}

export default function PaymentPage({
  showId,
  selectedSeats,
  totalPrice,
  onSuccess,
  onCancel
}: PaymentPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [bookingId, setBookingId] = useState(0);
  const { user } = useAuth();

  const handleEsewaPayment = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Step 1: Initiate eSewa payment
      const response = await api.initiateEsewaPayment(
        user.id,
        showId,
        selectedSeats,
        totalPrice
      );

      if (!response.success) {
        setError('Failed to initiate payment');
        setLoading(false);
        return;
      }

      // Store payment ID in session for verification after return
      sessionStorage.setItem('pendingPaymentId', response.payment_id.toString());

      // Step 2: Submit form to eSewa - redirect immediately
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.esewa_url;

      Object.keys(response.esewa_data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = response.esewa_data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initiation failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Check for payment verification on component mount
  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const refId = params.get('oid');
      const esewaRef = params.get('refId');

      if (refId && esewaRef) {
        try {
          const paymentId = sessionStorage.getItem('pendingPaymentId');
          if (paymentId) {
            const result = await api.verifyEsewaPayment(
              parseInt(paymentId),
              esewaRef
            );

            if (result.success) {
              setSuccess(true);
              setConfirmationCode(result.confirmation_code);
              setBookingId(result.booking_id);
              sessionStorage.removeItem('pendingPaymentId');

              // Auto-redirect after 3 seconds
              setTimeout(() => {
                onSuccess(result.confirmation_code, result.booking_id);
              }, 3000);
            }
          }
        } catch (err) {
          setError('Payment verification failed. Please contact support.');
        }
      }
    };

    verifyPayment();
  }, [onSuccess]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-8 px-4">
        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-4">Your booking has been confirmed.</p>
          
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm mb-2">Confirmation Code:</p>
            <p className="text-2xl font-mono font-bold text-white">{confirmationCode}</p>
          </div>

          <button
            onClick={() => onSuccess(confirmationCode, bookingId)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Payment</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <div className="text-gray-400 text-sm mb-1">Selected Seats:</div>
            <p className="text-white font-semibold mb-4">{selectedSeats.sort().join(', ')}</p>

            <div className="border-t border-slate-600 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-2xl font-bold text-white">Rs. {totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-400 text-sm">
              You will be redirected to eSewa to complete the payment securely.
            </p>
          </div>

          <button
            onClick={handleEsewaPayment}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
          >
            {loading ? 'Processing...' : 'Pay with eSewa'}
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full mt-3 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-600 text-white font-semibold py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
