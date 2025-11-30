const API_BASE_URL = 'https://booking-tk.infinityferrapp.com/backend/db.php';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
  duration: number;
  language: string;
  price?: number;
  genre: string;
}

export interface Show {
  id: number;
  movie_id: number;
  date: string;
  time: string;
  hall_name: string;
  price: number;
  movie_title?: string;
}

export interface Seat {
  id: number;
  seatNumber: string;
  isBooked: boolean;
}

export interface Booking {
  id: number;
  user_id: number;
  show_id: number;
  seat_numbers: string;
  total_price: number;
  booking_time: string;
  confirmation_code?: string;
  movie_title?: string;
  date?: string;
  time?: string;
  hall_name?: string;
  user_name?: string;
  user_email?: string;
}

export interface MovieCollection {
  id: number;
  title: string;
  poster: string;
  genre: string;
  total_bookings: number;
  collection: number;
  seats_booked: number;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.error || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(response);
  },

  async getMovies(): Promise<{ movies: Movie[] }> {
    const response = await fetch(`${API_BASE_URL}/getMovies.php`);
    return handleResponse(response);
  },

  async getMovieDetails(id: number): Promise<{ movie: Movie & { shows: Show[] } }> {
    const response = await fetch(`${API_BASE_URL}/getMovieDetails.php?id=${id}`);
    return handleResponse(response);
  },

  async getSeats(showId: number): Promise<{ show: Show; seats: Seat[] }> {
    const response = await fetch(`${API_BASE_URL}/getSeats.php?show_id=${showId}`);
    return handleResponse(response);
  },

  async bookTicket(userId: number, showId: number, seatNumbers: string[]) {
    const response = await fetch(`${API_BASE_URL}/bookTicket.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, show_id: showId, seat_numbers: seatNumbers })
    });
    return handleResponse(response);
  },

  async getUserBookings(userId: number): Promise<{ bookings: Booking[] }> {
    const response = await fetch(`${API_BASE_URL}/getBookings.php?user_id=${userId}`);
    return handleResponse(response);
  },

  async getAllBookings(): Promise<{ bookings: Booking[] }> {
    const response = await fetch(`${API_BASE_URL}/getBookings.php?admin=true`);
    return handleResponse(response);
  },

  async addMovie(movieData: Partial<Movie>) {
    const response = await fetch(`${API_BASE_URL}/addMovie.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData)
    });
    return handleResponse(response);
  },

  async addShow(showData: Partial<Show>) {
    const response = await fetch(`${API_BASE_URL}/addShow.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(showData)
    });
    return handleResponse(response);
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/getStats.php`);
    return handleResponse(response);
  },

  async getMovieCollections(): Promise<{ collections: MovieCollection[] }> {
    const response = await fetch(`${API_BASE_URL}/getMovieCollections.php`);
    return handleResponse(response);
  },

  async validateConfirmationCode(confirmationCode: string) {
    const response = await fetch(`${API_BASE_URL}/validateConfirmationCode.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation_code: confirmationCode })
    });
    return handleResponse(response);
  },

  async initiateEsewaPayment(userId: number, showId: number, seatNumbers: string[], totalPrice: number) {
    const response = await fetch(`${API_BASE_URL}/initiateEsewaPayment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        show_id: showId,
        seat_numbers: seatNumbers,
        total_price: totalPrice
      })
    });
    return handleResponse(response);
  },

  async verifyEsewaPayment(paymentId: number, esewaRefId: string) {
    const response = await fetch(`${API_BASE_URL}/verifyEsewaPayment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: paymentId,
        esewa_ref_id: esewaRefId
      })
    });
    return handleResponse(response);
  }
};
