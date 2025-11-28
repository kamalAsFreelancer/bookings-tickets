<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$isAdmin = isset($_GET['admin']) && $_GET['admin'] === 'true';

if (!$isAdmin && !$userId) {
    sendError('User ID is required', 400);
    exit();
}

if ($isAdmin) {
    // Get all bookings for admin
    $sql = "SELECT b.*, u.name as user_name, u.email as user_email,
            m.title as movie_title, s.date, s.time, s.hall_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN shows s ON b.show_id = s.id
            JOIN movies m ON s.movie_id = m.id
            ORDER BY b.booking_time DESC";
    $result = $conn->query($sql);
} elseif ($userId) {
    // Get bookings for specific user
    $sql = "SELECT b.*, m.title as movie_title, s.date, s.time, s.hall_name
            FROM bookings b
            JOIN shows s ON b.show_id = s.id
            JOIN movies m ON s.movie_id = m.id
            WHERE b.user_id = ?
            ORDER BY b.booking_time DESC";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        sendError('Database error: ' . $conn->error, 500);
        exit();
    }
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
}

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

sendResponse(['bookings' => $bookings]);

if (isset($stmt)) {
    $stmt->close();
}
$db->close();
?>
