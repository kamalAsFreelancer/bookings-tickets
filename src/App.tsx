import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import SeatBooking from './pages/SeatBooking';
import MyBookings from './pages/MyBookings';
import Collections from './pages/Collections';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddMovie from './pages/admin/AddMovie';
import ManageShows from './pages/admin/ManageShows';
import ViewBookings from './pages/admin/ViewBookings';
import ValidateTicket from './pages/admin/ValidateTicket';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const { isAdmin } = useAuth();

  const handleNavigate = (page: string, id?: number) => {
    setCurrentPage(page);
    if (page === 'movie-details' && id) {
      setSelectedMovieId(id);
    } else if (page === 'seat-booking' && id) {
      setSelectedShowId(id);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'movie-details':
        return selectedMovieId ? (
          <MovieDetails movieId={selectedMovieId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'seat-booking':
        return selectedShowId ? (
          <SeatBooking showId={selectedShowId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'my-bookings':
        return <MyBookings onNavigate={handleNavigate} />;
      case 'collections':
        return isAdmin ? (
          <Collections onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'admin':
        return isAdmin ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'add-movie':
        return isAdmin ? (
          <AddMovie onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'manage-shows':
        return isAdmin ? (
          <ManageShows onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'view-bookings':
        return isAdmin ? (
          <ViewBookings onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'validate-ticket':
        return isAdmin ? (
          <ValidateTicket onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'payment-success':
        return <PaymentSuccess confirmationCode="" bookingId={0} onNavigate={handleNavigate} />;
      case 'payment-failure':
        return <PaymentFailure onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {!['login', 'register'].includes(currentPage) && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
