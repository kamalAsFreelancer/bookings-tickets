# Cinema Booking System - Deployment Instructions

This guide will help you deploy the Cinema Booking System with PHP backend and React frontend.

## System Requirements

- XAMPP/WAMP/LAMP (Apache + MySQL + PHP 7.4+)
- Node.js 18+ and npm
- Modern web browser

## Part 1: Backend Setup (PHP + MySQL)

### Step 1: Install XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP to `C:\xampp` (Windows) or `/opt/lampp` (Linux)
3. Start Apache and MySQL from XAMPP Control Panel

### Step 2: Setup Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose file: `backend/database.sql`
4. Click "Go" to import the database
   - This will create the `cinema_booking` database
   - Creates all tables (users, movies, shows, seats, bookings)
   - Inserts sample data including admin user

### Step 3: Deploy Backend Files
1. Copy the entire `backend` folder to XAMPP's htdocs:
   ```
   Copy: backend/
   To: C:\xampp\htdocs\cinema-booking\backend\
   ```

2. Your folder structure should look like:
   ```
   C:\xampp\htdocs\cinema-booking\backend\
   ├── config.php
   ├── db.php
   ├── database.sql
   ├── getMovies.php
   ├── getMovieDetails.php
   ├── getSeats.php
   ├── bookTicket.php
   ├── getBookings.php
   ├── addMovie.php
   ├── addShow.php
   ├── login.php
   ├── register.php
   └── getStats.php
   ```

### Step 4: Configure Database Connection
1. Open `backend/config.php`
2. Update if needed (default values work for XAMPP):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'cinema_booking');
   ```

### Step 5: Test Backend
1. Open browser: http://localhost/cinema-booking/backend/getMovies.php
2. You should see JSON response with movies data
3. If you see errors, check:
   - Apache is running in XAMPP
   - MySQL is running in XAMPP
   - Database was imported correctly
   - File paths are correct

## Part 2: Frontend Setup (React)

### Step 1: Configure API URL
1. Open `src/api/api.ts`
2. Update API_BASE_URL if needed:
   ```typescript
   const API_BASE_URL = 'http://localhost/cinema-booking/backend';
   ```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

The React app will open at http://localhost:5173

## Part 3: Using the Application

### Default Admin Account
- Email: admin@cinema.com
- Password: admin123

### User Features
1. **Browse Movies**: View all available movies
2. **View Movie Details**: See showtimes and details
3. **Book Seats**: Select from 160 seats (A1-J16)
4. **My Bookings**: View booking history

### Admin Features
1. **Dashboard**: View statistics
2. **Add Movie**: Create new movies
3. **Manage Shows**: Create showtimes (automatically generates 160 seats)
4. **View Bookings**: See all customer bookings

## Seat Layout
- Total: 160 seats per show
- Configuration: 10 rows × 16 seats
- Rows: A, B, C, D, E, F, G, H, I, J
- Seats per row: 1-16
- Example: A1, A2, ..., A16, B1, B2, ..., J16

## Troubleshooting

### Backend Issues

**Error: "Connection failed"**
- Make sure MySQL is running in XAMPP
- Check database credentials in config.php
- Verify database was imported correctly

**Error: "Access denied"**
- Check MySQL username/password in config.php
- Default XAMPP: user=root, password=empty

**CORS errors in browser console**
- Make sure config.php has correct CORS headers
- Check that React dev server is running on port 5173

### Frontend Issues

**Error: "Network Error" or "Failed to fetch"**
- Verify backend URL in src/api/api.ts
- Make sure Apache is running
- Test backend directly: http://localhost/cinema-booking/backend/getMovies.php

**Blank page or white screen**
- Check browser console for errors
- Run `npm run build` to check for TypeScript errors
- Make sure all dependencies are installed

## Production Deployment

### Backend
1. Use a production-ready web host with PHP + MySQL
2. Update database credentials in config.php
3. Change CORS headers in config.php to match your domain:
   ```php
   header('Access-Control-Allow-Origin: https://yourdomain.com');
   ```

### Frontend
1. Build the React app:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your web server
3. Update API_BASE_URL in src/api/api.ts to your production API

## Database Schema

### Tables
- **users**: User accounts (customers + admin)
- **movies**: Movie information
- **shows**: Showtimes for movies
- **seats**: 160 seats per show (auto-generated)
- **bookings**: Customer ticket bookings

### Key Features
- Password hashing with PHP password_hash()
- Transaction support for bookings
- Foreign key constraints
- Seat locking during booking process

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /getMovies.php | GET | Get all movies |
| /getMovieDetails.php | GET | Get movie + shows |
| /getSeats.php | GET | Get seats for a show |
| /bookTicket.php | POST | Book seats |
| /getBookings.php | GET | Get bookings |
| /login.php | POST | User login |
| /register.php | POST | User registration |
| /addMovie.php | POST | Add movie (admin) |
| /addShow.php | POST | Add show (admin) |
| /getStats.php | GET | Get dashboard stats |

## Support

If you encounter any issues:
1. Check XAMPP logs: xampp/apache/logs/error.log
2. Check browser console for frontend errors
3. Verify all files are in correct locations
4. Make sure all services are running

## Security Notes

- Change default admin password in production
- Use HTTPS in production
- Implement proper session management
- Validate all user inputs
- Use prepared statements (already implemented)
- Add rate limiting for API endpoints
