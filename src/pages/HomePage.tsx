import { useEffect, useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { api, Movie } from '../api/api';

interface HomePageProps {
  onNavigate: (page: string, movieId?: number) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await api.getMovies();
      setMovies(data.movies);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load movies';
      setError(errorMessage);
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setLoading(true);
              loadMovies();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">Now Showing</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => onNavigate('movie-details', movie.id)}
            >
              <div className="relative h-48 sm:h-80 lg:h-96">
                <img
                  src={movie.poster || 'https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg'}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.genre}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{movie.title}</h2>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">{movie.description}</p>

                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{movie.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{movie.language}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('movie-details', movie.id);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base rounded-lg transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No movies available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
