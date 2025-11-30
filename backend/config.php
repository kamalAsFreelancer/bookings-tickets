<?php
// Database configuration
define('DB_HOST', 'sql321.infinityfree.com');
define('DB_USER', 'if0_40543717');
define('DB_PASS', 'stM1FJgm5rU');
define('DB_NAME', 'if0_40543717_cinema_booking');

// CORS headers for React frontend
header('Access-Control-Allow-Origin: https://booking-tk.netlify.app');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
