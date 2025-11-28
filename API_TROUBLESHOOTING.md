# API Troubleshooting Guide

## "Failed to Fetch" Error - Solutions

### Issue 1: Incorrect API URL
**Problem:** `http://localhost/cinema-booking/backend` doesn't exist

**Solution:** Update API_BASE_URL in `src/api/api.ts`
```typescript
// BEFORE (incorrect)
const API_BASE_URL = 'http://localhost/cinema-booking/backend';

// AFTER (correct)
const API_BASE_URL = 'http://127.0.0.1/project/backend';
```

### Issue 2: CORS (Cross-Origin Resource Sharing)
**Problem:** Browser blocks requests from different origin

**Solution:** Backend already has CORS headers configured:
```php
// In backend/config.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

And .htaccess handles preflight requests.

### Issue 3: Database Connection
**Problem:** Backend can't connect to MySQL

**Check:** 
1. Is XAMPP running? (Apache + MySQL)
2. Is database `cinema_booking` created?
3. Are credentials correct in `backend/config.php`?
   - DB_HOST: localhost
   - DB_USER: root
   - DB_PASS: (empty)
   - DB_NAME: cinema_booking

### Issue 4: Port Issues
**Problem:** Development server not on expected port

**Solution:** Vite dev server runs on:
- Primary: http://localhost:5173
- If 5173 busy: http://localhost:5174
- Check terminal output for actual port

### Quick Test - Verify Backend Works

```powershell
# Test getMovies endpoint
$response = Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/getMovies.php" -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
Write-Host "Response: $($response.Content)" | ConvertFrom-Json

# Should return:
# Status: 200
# Response: { "movies": [...] }
```

### Quick Test - Check API URL

In browser console (F12):
```javascript
// Test if backend is reachable
fetch('http://127.0.0.1/project/backend/getMovies.php')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Failed:', e.message))
```

## Setup Checklist

- [ ] XAMPP is running (Apache + MySQL visible in tray)
- [ ] Database exists: `mysql -u root -e "USE cinema_booking; SHOW TABLES;"`
- [ ] Backend files in: `C:\xampp\htdocs\project\backend\`
- [ ] Frontend running on http://127.0.0.1:5173 or http://127.0.0.1:5174
- [ ] API URL correct: `http://127.0.0.1/project/backend`
- [ ] No browser console errors (F12 → Console)
- [ ] Network tab shows requests are being sent

## Common Errors & Fixes

### "Failed to fetch"
- Check API_BASE_URL spelling
- Ensure backend files exist
- Verify Apache is running

### "Invalid JSON response"
- Backend returned HTML error instead of JSON
- Check backend logs: `C:\xampp\apache\logs\error.log`
- Verify PHP syntax is correct

### "CORS error"
- Headers already configured
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito mode
- Verify .htaccess is readable

### "Database connection failed"
- Start MySQL from XAMPP Control Panel
- Check DB credentials in config.php
- Import database.sql: `mysql -u root cinema_booking < database.sql`

## Manual Setup Steps

If errors persist, do this:

```bash
# 1. Start XAMPP Apache + MySQL

# 2. Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS cinema_booking;"

# 3. Import schema
mysql -u root cinema_booking < "C:\xampp\htdocs\project\backend\database.sql"

# 4. Verify backend can be accessed
curl http://127.0.0.1/project/backend/getMovies.php

# 5. Check that it returns JSON
# Should see: {"movies":[...]}

# 6. Start dev server
cd C:\xampp\htdocs\project
npm run dev

# 7. Open in browser
# http://127.0.0.1:5173 or 5174
```

## Still Not Working?

1. Check backend/config.php - correct DB name/user/password?
2. Check Apache error log - any PHP errors?
3. Check if getMovies.php can execute without errors
4. Verify all PHP files have correct syntax (no <?php typos)
5. Check firewall isn't blocking localhost:80

