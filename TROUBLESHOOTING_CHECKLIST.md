# 🔧 Quick Troubleshooting Checklist

## If you see "Failed to Fetch" error:

### ✓ Step 1: Start XAMPP
- [ ] Open XAMPP Control Panel
- [ ] Click "Start" for Apache
- [ ] Click "Start" for MySQL
- [ ] Both should show "Running" in green

### ✓ Step 2: Verify API URL
Open `src/api/api.ts` and check line 1:
```typescript
const API_BASE_URL = 'http://127.0.0.1/project/backend';
```
Should be exactly this (not localhost, not cinema-booking)

### ✓ Step 3: Test Backend Directly
Open in browser: http://127.0.0.1/project/backend/getMovies.php

Expected result: JSON with 3 movies
```json
{"movies":[{"id":"1","title":"The Grand Adventure",...}]}
```

If you see HTML error instead → Apache/PHP issue (see Step 4)

### ✓ Step 4: Check Database
Run in Windows PowerShell:
```powershell
$response = Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/health-check.php" -UseBasicParsing
$response.Content | ConvertFrom-Json | Format-List
```

Should show all "OK" ✅

### ✓ Step 5: Install Dependencies
```bash
cd C:\xampp\htdocs\project
npm install
```

### ✓ Step 6: Start Dev Server
```bash
npm run dev
```

Wait for: `VITE v5.4.8 ready in X ms`

Look for: `Local:   http://localhost:517X/`

### ✓ Step 7: Open in Browser
Go to: http://127.0.0.1:5173 (or 5174 if shown in terminal)

---

## Common Issues & Quick Fixes

### ❌ "Cannot GET /project/backend/getMovies.php"
**Cause:** Apache not configured to serve PHP
**Fix:** 
1. Restart Apache (XAMPP Control Panel)
2. Check file exists: `C:\xampp\htdocs\project\backend\getMovies.php`

### ❌ "MySQL connection failed"
**Cause:** MySQL not running
**Fix:**
1. Start MySQL in XAMPP Control Panel
2. Wait 5 seconds
3. Retry

### ❌ "Database cinema_booking not found"
**Cause:** Database not created
**Fix:**
```bash
mysql -u root cinema_booking < C:\xampp\htdocs\project\backend\database.sql
```

### ❌ "CORS error" in browser console
**Cause:** Browser blocking cross-origin request
**Fix:**
1. Clear browser cache: Ctrl+Shift+Del
2. Try incognito mode (Ctrl+Shift+N)
3. Check CORS headers in `backend/config.php`

### ❌ "Port 5173 already in use"
**Cause:** Another process using port
**Fix:** 
1. Vite automatically tries 5174, 5175, etc.
2. Check terminal for actual URL
3. If stuck, try: `npm run dev -- --port 3000`

### ❌ "npm ERR! Missing dependencies"
**Cause:** node_modules not installed
**Fix:**
```bash
npm install
npm run dev
```

### ❌ "White blank screen"
**Cause:** API request failing silently
**Fix:**
1. Open F12 (Developer Tools)
2. Check Console tab for errors
3. Check Network tab - do requests show 200 OK?
4. Verify API URL matches: `http://127.0.0.1/project/backend`

---

## Diagnostic Commands

### Test Backend Endpoints
```powershell
# Get all movies
Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/getMovies.php" | ConvertFrom-Json

# Login as admin
$body = @{email="admin@cinema.com"; password="admin123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/login.php" -Method Post -ContentType "application/json" -Body $body | ConvertFrom-Json

# Check health
Invoke-WebRequest -Uri "http://127.0.0.1/project/backend/health-check.php" | ConvertFrom-Json
```

### Test Database
```bash
# Connect to MySQL
mysql -u root

# Inside MySQL:
USE cinema_booking;
SHOW TABLES;
SELECT COUNT(*) FROM movies;
SELECT * FROM users;
```

### Check Logs
- Apache errors: `C:\xampp\apache\logs\error.log`
- PHP errors: Check XAMPP error window
- Browser console: F12 → Console tab

---

## Still Not Working?

1. **Close everything** (browser, terminal, dev server)
2. **Restart XAMPP** (stop all, start all)
3. **Clear browser cache** (Ctrl+Shift+Del)
4. **Run DIAGNOSE.bat** (double-click in project folder)
5. **Reinstall dependencies:**
   ```bash
   rm -r node_modules package-lock.json
   npm install
   npm run dev
   ```

6. **Check these files exist:**
   - ✓ `C:\xampp\htdocs\project\backend\getMovies.php`
   - ✓ `C:\xampp\htdocs\project\backend\config.php`
   - ✓ `C:\xampp\htdocs\project\backend\db.php`
   - ✓ `C:\xampp\htdocs\project\src\api\api.ts`

7. **Verify database import:**
   ```bash
   mysql -u root cinema_booking -e "SHOW TABLES;"
   # Should list: bookings, movies, seats, shows, users
   ```

---

## 📞 Getting Help

Include these when asking for help:
1. Screenshot of error message
2. Full terminal output
3. Browser console errors (F12)
4. Output of: `npm --version` and `node --version`
5. Screenshot of XAMPP Control Panel status

---

## When Everything Works ✅

You should see:
- ✅ Terminal shows: `VITE v5... ready`
- ✅ Browser shows: CineBook homepage
- ✅ Movies load on home page
- ✅ Can see 3 sample movies
- ✅ No errors in console (F12)
- ✅ Network requests show 200 OK

**Test Login:**
- Email: `admin@cinema.com`
- Password: `admin123`

Should redirect to home and show admin in top-right corner.

---

## 🎉 Success!

Once everything loads without "Failed to Fetch":
1. Create test account (Register button)
2. Browse movies
3. Try booking seats
4. Access admin dashboard (if logged in as admin)

Your Cinema Booking System is ready! 🎬

