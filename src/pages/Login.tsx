import { useState } from 'react';
import { Film } from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(email, password);
      if (result.success) {
        login(result.user);
        onNavigate('home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <Film className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          <span className="text-2xl sm:text-3xl font-bold text-white">CineBook</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Welcome Back</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition mb-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-red-400 hover:text-red-300 font-semibold"
          >
            Register
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700 text-center text-gray-400 text-sm">
          <p>Copyright @Kamal Pahan</p>
        </div>
      </div>
    </div>
  );
}
