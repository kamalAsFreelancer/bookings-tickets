<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
    exit();
}

// Get JSON input
$json = file_get_contents('php://input');
$input = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Invalid JSON input: ' . json_last_error_msg(), 400);
    exit();
}

if (!isset($input['confirmation_code'])) {
    sendError('Confirmation code required', 400);
    exit();
}

$confirmationCode = trim($input['confirmation_code']);

if (strlen($confirmationCode) !== 8) {
    sendError('Invalid confirmation code format', 400);
    exit();
}

// Get booking details by confirmation code
$sql = "SELECT b.id, b.user_id, b.show_id, b.seat_numbers, b.total_price, b.confirmation_code,
               m.title as movie_title, s.date, s.time, s.hall_name,
               u.name, u.email
        FROM bookings b
        JOIN shows s ON b.show_id = s.id
        JOIN movies m ON s.movie_id = m.id
        JOIN users u ON b.user_id = u.id
        WHERE b.confirmation_code = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    sendError('Prepare failed: ' . $conn->error, 500);
    exit();
}

$stmt->bind_param('s', $confirmationCode);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendError('Confirmation code not found', 404);
    exit();
}

$booking = $result->fetch_assoc();
$stmt->close();

sendResponse([
    'booking' => [
        'id' => (int)$booking['id'],
        'user_name' => $booking['name'],
        'user_email' => $booking['email'],
        'movie_title' => $booking['movie_title'],
        'date' => $booking['date'],
        'time' => $booking['time'],
        'hall_name' => $booking['hall_name'],
        'seat_numbers' => $booking['seat_numbers'],
        'total_price' => (float)$booking['total_price'],
        'confirmation_code' => $booking['confirmation_code']
    ]
]);

$db->close();
?>
