<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!isset($_GET['show_id'])) {
    sendError('Show ID is required', 400);
    exit();
}

$showId = intval($_GET['show_id']);

// Verify show exists
$showSql = "SELECT s.*, m.title as movie_title FROM shows s
            JOIN movies m ON s.movie_id = m.id
            WHERE s.id = ?";
$showStmt = $conn->prepare($showSql);
$showStmt->bind_param("i", $showId);
$showStmt->execute();
$showResult = $showStmt->get_result();

if ($showResult->num_rows === 0) {
    $showStmt->close();
    sendError('Show not found', 404);
    exit();
}

$show = $showResult->fetch_assoc();

// Get all seats for this show
$seatSql = "SELECT id, seat_number, is_booked FROM seats WHERE show_id = ? ORDER BY seat_number";
$seatStmt = $conn->prepare($seatSql);
$seatStmt->bind_param("i", $showId);
$seatStmt->execute();
$seatResult = $seatStmt->get_result();

$seats = [];
while ($row = $seatResult->fetch_assoc()) {
    $seats[] = [
        'id' => $row['id'],
        'seatNumber' => $row['seat_number'],
        'isBooked' => (bool)$row['is_booked']
    ];
}

sendResponse([
    'show' => $show,
    'seats' => $seats
]);

$showStmt->close();
$seatStmt->close();
$db->close();
?>
