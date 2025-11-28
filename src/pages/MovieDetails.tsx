import { useEffect, useState } from 'react';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { api, Movie, Show } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface MovieDetailsProps {
  movieId: number;
  onNavigate: (page: string, showId?: number) => void;
}

export default function MovieDetails({ movieId, onNavigate }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie & { shows: Show[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      const data = await api.getMovieDetails(movieId);
      setMovie(data.movie);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load movie details';
      setError(errorMessage);
      console.error('Error loading movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookShow = (showId: number) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    onNavigate('seat-booking', showId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-xl text-white">Loading...</div>
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

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Movie not found</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Movies
        </button>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <img
              src={movie.poster || 'https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg'}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>

          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full">
                {movie.genre}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{movie.language}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{movie.description}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Select Showtime</h2>

          {movie.shows.length === 0 ? (
            <p className="text-gray-400 text-sm sm:text-base">No shows available for this movie.</p>
          ) : (
            <div className="grid gap-4">
              {movie.shows.map((show) => (
                <div
                  key={show.id}
                  className="bg-slate-700 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-600 transition"
                >
                  <div className="text-white w-full sm:w-auto">
                    <div className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2">{show.hall_name}</div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                      {new Date(show.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">Time: {show.time}</div>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">{'Rs. '}{show.price}</div>
                    <button
                      onClick={() => handleBookShow(show.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 sm:py-3 rounded-lg transition text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Book Seats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
