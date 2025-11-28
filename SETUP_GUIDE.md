# Cinema Hall Booking System - Setup & Deployment Guide

## ✅ System Status
- Backend API: **WORKING** ✅
- Database: **CONNECTED** ✅  
- PHP: **8.2.12** ✅
- Frontend: **Ready** ✅

---

## 🚀 Quick Start

### Prerequisites
- XAMPP (Apache + MySQL)
- Node.js 18+
- npm

### Step 1: Setup Database

```bash
# Start XAMPP (Apache + MySQL must be running)

# Create database and import schema
mysql -u root cinema_booking < backend/database.sql

# Verify setup
mysql -u root -e "USE cinema_booking; SHOW TABLES;"
```

### Step 2: Install Dependencies

```bash
cd C:\xampp\htdocs\project
npm install
```

### Step 3: Start Development Server

```bash
npm run dev

# Server will start on:
# http://127.0.0.1:5173 (or 5174 if port busy)
```

### Step 4: Access Application

Open browser: **http://127.0.0.1:5173**

**Test Credentials:**
- Email: `admin@cinema.com`
- Password: `admin123`

---

## 📁 Project Structure

```
project/
├── backend/                  # PHP API
│   ├── config.php           # Database config
│   ├── db.php               # Database class
│   ├── register.php         # User registration
│   ├── login.php            # User login
│   ├── addMovie.php         # Add movie (admin)
│   ├── addShow.php          # Create show (admin)
│   ├── bookTicket.php       # Book tickets
│   ├── getMovies.php        # Get all movies
│   ├── getMovieDetails.php  # Get movie + shows
│   ├── getSeats.php         # Get seats for show
│   ├── getBookings.php      # Get bookings
│   ├── getStats.php         # Admin dashboard stats
│   ├── database.sql         # Database schema
│   ├── health-check.php     # Health check
│   └── .htaccess            # CORS headers
│
├── src/                      # React Frontend
│   ├── api/api.ts           # API client
│   ├── context/AuthContext.tsx  # Auth state
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── MovieDetails.tsx
│   │   ├── SeatBooking.tsx
│   │   ├── MyBookings.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── admin/           # Admin pages
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
│
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind CSS
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

---

## 🔍 API Configuration

**API Base URL:** `http://127.0.0.1/project/backend`

All requests go to backend PHP files. CORS headers are configured for local development.

**Location:** `src/api/api.ts` line 1
```typescript
const API_BASE_URL = 'http://127.0.0.1/project/backend';
```

---

## 🧪 Testing Endpoints

### Check Backend Health
```bash
curl http://127.0.0.1/project/backend/health-check.php
```

### Test Get Movies
```powershell
$response = Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/getMovies.php" -UseBasicParsing
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Test Login
```powershell
$body = @{ email="admin@cinema.com"; password="admin123" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/login.php" `
  -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## 🛠️ Troubleshooting

### "Failed to fetch" Error
1. Verify API URL in `src/api/api.ts` is: `http://127.0.0.1/project/backend`
2. Check XAMPP Apache is running
3. Confirm database exists: `mysql -u root cinema_booking -e "SELECT 1"`
4. Test endpoint: `curl http://127.0.0.1/project/backend/getMovies.php`

### Database Connection Failed
1. Start MySQL: XAMPP Control Panel → MySQL Start
2. Check credentials in `backend/config.php`
3. Create database: `mysql -u root cinema_booking < backend/database.sql`

### Port Already in Use
- Vite will auto-use next available port (5174, 5175, etc.)
- Check terminal output for actual URL

### CORS Issues
- Browser console shows CORS error
- Solution: Already configured in `backend/config.php` and `.htaccess`
- Try clearing cache: `Ctrl+Shift+Del`

### PHP Syntax Error
- Check `backend/error.log` or XAMPP error log
- Verify all PHP files have opening `<?php` tag
- No spaces before `<?php` opening tag

---

## 📊 Database Schema

### Users Table
```sql
- id (INT, Primary Key)
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255, hashed)
- role (ENUM: 'user' or 'admin')
- created_at (TIMESTAMP)
```

### Movies Table
```sql
- id (INT, Primary Key)
- title (VARCHAR 200)
- description (TEXT)
- poster (VARCHAR 255)
- duration (INT, minutes)
- language (VARCHAR 50)
- genre (VARCHAR 100)
- created_at (TIMESTAMP)
```

### Shows Table
```sql
- id (INT, Primary Key)
- movie_id (INT, FK → movies.id)
- date (DATE)
- time (TIME)
- hall_name (VARCHAR 50)
- price (DECIMAL 10,2)
- created_at (TIMESTAMP)
```

### Seats Table (160 per show)
```sql
- id (INT, Primary Key)
- show_id (INT, FK → shows.id)
- seat_number (VARCHAR 5, e.g. "A1", "J16")
- is_booked (TINYINT, 0=available, 1=booked)
- created_at (TIMESTAMP)
```

### Bookings Table
```sql
- id (INT, Primary Key)
- user_id (INT, FK → users.id)
- show_id (INT, FK → shows.id)
- seat_numbers (TEXT, comma-separated)
- total_price (DECIMAL 10,2)
- booking_time (TIMESTAMP)
```

---

## 👤 Default Admin Account
- Email: `admin@cinema.com`
- Password: `admin123`
- Role: Admin

---

## 🔐 Security Features

✅ Password hashing with `PASSWORD_DEFAULT` (bcrypt)
✅ SQL injection prevention with prepared statements
✅ Input validation on all endpoints
✅ CORS headers for API security
✅ Email format validation
✅ Password strength requirements (8+ chars)
✅ HTTP status codes for proper error handling
✅ No sensitive data in error messages

---

## 📝 Features

### User Features
- ✅ Register new account
- ✅ Login/Logout
- ✅ Browse movies
- ✅ View movie details & showtimes
- ✅ Book seats for shows
- ✅ View my bookings
- ✅ Real-time seat availability

### Admin Features
- ✅ Add new movies
- ✅ Create shows (auto-generates 160 seats)
- ✅ View all bookings
- ✅ Dashboard with statistics
  - Total movies
  - Total shows
  - Total bookings
  - Total revenue
  - Total users

---

## 🎨 UI Features
- Dark theme (Tailwind CSS)
- Responsive design (mobile-friendly)
- Lucide React icons
- Smooth animations
- Real-time feedback
- Loading states
- Error handling

---

## 🚢 Production Build

```bash
npm run build

# Output: dist/
# Deploy dist/ folder to web server
```

---

## 📞 Support

For issues:
1. Check `API_TROUBLESHOOTING.md` in project root
2. Run health check: `http://127.0.0.1/project/backend/health-check.php`
3. Check browser console for errors (F12)
4. Review backend logs in XAMPP

---

## ✨ Version Info
- Frontend: React 18 + TypeScript
- Backend: PHP 8.2+
- Database: MySQL 5.7+
- Build Tool: Vite 5
- Styling: Tailwind CSS 3

