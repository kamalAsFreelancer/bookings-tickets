import { Film, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const handleNavClick = (page: string) => {
    onNavigate(page);
    closeMenu();
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => onNavigate('home')}
          >
            <Film className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold">CineBook</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className={`hover:text-red-400 transition ${currentPage === 'home' ? 'text-red-400' : ''}`}
                >
                  Movies
                </button>

                <button
                  onClick={() => onNavigate('my-bookings')}
                  className={`hover:text-red-400 transition ${currentPage === 'my-bookings' ? 'text-red-400' : ''}`}
                >
                  My Bookings
                </button>

                {isAdmin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`hover:text-red-400 transition ${currentPage === 'admin' ? 'text-red-400' : ''}`}
                  >
                    Admin
                  </button>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                  <User className="w-5 h-5" />
                  <span className="font-medium hidden lg:inline">{user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('home');
                    }}
                    className="p-2 hover:bg-slate-800 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 hover:bg-slate-800 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-slate-700 pt-4">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg transition text-gray-300"
                >
                  Movies
                </button>
                <button
                  onClick={() => handleNavClick('my-bookings')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg transition text-gray-300"
                >
                  My Bookings
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('collections')}
                    className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg transition text-gray-300"
                  >
                    Collections
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg transition text-gray-300"
                  >
                    Admin
                  </button>
                )}
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="flex items-center gap-2 px-4 py-2 text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                      onNavigate('home');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg transition text-gray-300"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
