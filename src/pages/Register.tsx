import { useState } from 'react';
import { Film } from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [name, setName] = useState('');
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
      const result = await api.register(name, email, password);
      if (result.success) {
        login(result.user);
        onNavigate('home');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <Film className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          <span className="text-2xl sm:text-3xl font-bold text-white">CineBook</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="mb-6 sm:mb-7">
            <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition mb-4 text-sm sm:text-base"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-gray-400 text-xs sm:text-sm">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-red-400 hover:text-red-300 font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
