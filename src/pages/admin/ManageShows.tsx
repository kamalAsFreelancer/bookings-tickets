import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api, Movie } from '../../api/api';

interface ManageShowsProps {
  onNavigate: (page: string) => void;
}

export default function ManageShows({ onNavigate }: ManageShowsProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState({
    movie_id: '',
    date: '',
    time: '',
    hall_name: 'Hall A',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await api.getMovies();
      setMovies(data.movies);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await api.addShow({
        movie_id: parseInt(formData.movie_id),
        date: formData.date,
        time: formData.time,
        hall_name: formData.hall_name,
        price: parseFloat(formData.price)
      });

      if (result.success) {
        setSuccess('Show added successfully with 160 seats!');
        setFormData({
          movie_id: '',
          date: '',
          time: '',
          hall_name: 'Hall A',
          price: ''
        });
      } else {
        setError(result.error || 'Failed to add show');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add show. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Dashboard
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">Create Show</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-4 text-xs sm:text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Select Movie</label>
              <select
                name="movie_id"
                value={formData.movie_id}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                required
              >
                <option value="">Choose a movie</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-5">
              <div>
                <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-7">
              <div>
                <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Hall Name</label>
                <select
                  name="hall_name"
                  value={formData.hall_name}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                >
                  <option value="Hall A">Hall A</option>
                  <option value="Hall B">Hall B</option>
                  <option value="Hall C">Hall C</option>
                  <option value="Main Hall">Main Hall</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Price per Seat (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 mb-6 sm:mb-7">
              <p className="text-gray-300 text-xs sm:text-sm">
                <strong>Note:</strong> Creating a show will automatically generate 160 seats (8 rows × 20 seats: A1-A20, B1-B20, ..., H1-H20)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
            >
              {loading ? 'Creating Show...' : 'Create Show'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
