<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
    exit();
}

// Get total movies
$moviesSql = "SELECT COUNT(*) as total FROM movies";
$moviesResult = $conn->query($moviesSql);
if (!$moviesResult) {
    sendError('Failed to fetch statistics: ' . $conn->error, 500);
    exit();
}
$totalMovies = $moviesResult->fetch_assoc()['total'];

// Get total shows
$showsSql = "SELECT COUNT(*) as total FROM shows";
$showsResult = $conn->query($showsSql);
$totalShows = $showsResult->fetch_assoc()['total'];

// Get total bookings
$bookingsSql = "SELECT COUNT(*) as total FROM bookings";
$bookingsResult = $conn->query($bookingsSql);
$totalBookings = $bookingsResult->fetch_assoc()['total'];

// Get total revenue
$revenueSql = "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings";
$revenueResult = $conn->query($revenueSql);
$totalRevenue = $revenueResult->fetch_assoc()['total'];

// Get total users
$usersSql = "SELECT COUNT(*) as total FROM users WHERE role = 'user'";
$usersResult = $conn->query($usersSql);
$totalUsers = $usersResult->fetch_assoc()['total'];

sendResponse([
    'stats' => [
        'totalMovies' => (int)$totalMovies,
        'totalShows' => (int)$totalShows,
        'totalBookings' => (int)$totalBookings,
        'totalRevenue' => (float)$totalRevenue,
        'totalUsers' => (int)$totalUsers
    ]
]);

$db->close();
?>
