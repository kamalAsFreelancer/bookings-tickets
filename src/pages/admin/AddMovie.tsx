import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../api/api';

interface AddMovieProps {
  onNavigate: (page: string) => void;
}

export default function AddMovie({ onNavigate }: AddMovieProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: '',
    duration: '',
    language: 'English',
    price: '',
    genre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await api.addMovie({
        title: formData.title,
        description: formData.description,
        poster: formData.poster,
          duration: parseInt(formData.duration),
          language: formData.language,
          price: parseFloat(formData.price || '0'),
          genre: formData.genre
      });

      if (result.success) {
        setSuccess('Movie added successfully!');
        setFormData({
          title: '',
          description: '',
          poster: '',
          duration: '',
          language: 'English',
          price: '',
          genre: ''
        });
        setTimeout(() => onNavigate('admin'), 2000);
      } else {
        setError(result.error || 'Failed to add movie');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add movie. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">Add New Movie</h1>

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
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                required
              />
            </div>

            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                required
              />
            </div>

            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Poster URL</label>
              <input
                type="url"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                placeholder="https://example.com/poster.jpg"
              />
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Use Pexels.com for free stock images</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-5">
              <div>
                <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>
            </div>

            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Price (per ticket)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                required
                min="0"
              />
            </div>

            <div className="mb-6 sm:mb-7">
              <label className="block text-gray-300 mb-2 text-xs sm:text-sm">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                placeholder="Action, Comedy, Drama, etc."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
            >
              {loading ? 'Adding Movie...' : 'Add Movie'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
