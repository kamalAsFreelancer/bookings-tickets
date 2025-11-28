import { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { api, MovieCollection } from '../api/api';

interface CollectionsProps {
  onNavigate: (page: string) => void;
}

export default function Collections({ onNavigate }: CollectionsProps) {
  const [collections, setCollections] = useState<MovieCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCollection, setTotalCollection] = useState(0);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await api.getMovieCollections();
      setCollections(data.collections);
      const total = data.collections.reduce((sum, movie) => sum + movie.collection, 0);
      setTotalCollection(total);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load collections';
      setError(errorMessage);
      console.error('Error loading collections:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-lg sm:text-xl text-white">Loading collections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white hover:text-red-400 transition mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Home
          </button>
          <div className="bg-slate-800 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-red-400 text-base sm:text-lg lg:text-xl mb-4">{error}</p>
            <button
              onClick={() => {
                setError('');
                setLoading(true);
                loadCollections();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white hover:text-red-400 transition mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Home
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Movie Collections</h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">
            Total box office collection across all movies
          </p>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-400">
            Rs. {totalCollection.toLocaleString()}
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-lg">No movies with bookings yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {collections.map((movie, index) => (
              <div
                key={movie.id}
                className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition group"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <span className="text-gray-400">No poster</span>
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold">
                    #{index + 1}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{movie.genre}</p>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4">
                      <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Collection</div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
                        Rs. {movie.collection.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4">
                      <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Bookings</div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400">
                        {movie.total_bookings}
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 col-span-2">
                      <div className="text-gray-400 text-xs sm:text-sm font-semibold mb-1">Seats Booked</div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">
                        {movie.seats_booked}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
