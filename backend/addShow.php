<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

// Get JSON input
$json = file_get_contents('php://input');
$input = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Invalid JSON input: ' . json_last_error_msg(), 400);
    exit();
}

// Validate required fields
if (!isset($input['movie_id']) || !isset($input['date']) || !isset($input['time']) || !isset($input['price'])) {
    sendError('Movie ID, date, time, and price are required', 400);
    exit();
}

$movieId = intval($input['movie_id']);
$date = trim($input['date']);
$time = trim($input['time']);
$hallName = isset($input['hall_name']) ? trim($input['hall_name']) : 'Main Hall';
$price = floatval($input['price']);

// Validate inputs
if ($movieId < 1) {
    sendError('Invalid movie ID', 400);
    exit();
}
if (strtotime($date) === false) {
    sendError('Invalid date format', 400);
    exit();
}
if (strtotime($time) === false) {
    sendError('Invalid time format', 400);
    exit();
}
if ($price < 0) {
    sendError('Price cannot be negative', 400);
    exit();
}

// Verify movie exists
$movieCheck = $conn->prepare("SELECT id FROM movies WHERE id = ?");
if (!$movieCheck) {
    sendError('Database error: ' . $conn->error, 500);
    exit();
}
$movieCheck->bind_param("i", $movieId);
$movieCheck->execute();
$movieResult = $movieCheck->get_result();

if ($movieResult->num_rows === 0) {
    $movieCheck->close();
    sendError('Movie not found', 404);
    exit();
}

try {
    // Insert show
    $sql = "INSERT INTO shows (movie_id, date, time, hall_name, price)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Database error: ' . $conn->error);
    }
    $stmt->bind_param("isssd", $movieId, $date, $time, $hallName, $price);
    if (!$stmt->execute()) {
        throw new Exception('Failed to insert show: ' . $stmt->error);
    }

    $showId = $conn->insert_id;

    // Initialize 160 seats for this show (A1-A20, B1-B20, ..., H1-H20)
    // Layout: 8 rows (A-H) x 20 seats = 160 seats. Passage after 10 seats handled in frontend.
    $rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    $seatInsertSql = "INSERT INTO seats (show_id, seat_number, is_booked) VALUES (?, ?, 0)";
    $seatStmt = $conn->prepare($seatInsertSql);
    if (!$seatStmt) {
        throw new Exception('Database error: ' . $conn->error);
    }

    foreach ($rows as $row) {
        for ($seatNum = 1; $seatNum <= 20; $seatNum++) {
            $seatNumber = $row . $seatNum;
            $seatStmt->bind_param("is", $showId, $seatNumber);
            if (!$seatStmt->execute()) {
                throw new Exception('Failed to insert seats: ' . $seatStmt->error);
            }
        }
    }

    $conn->commit();

    sendResponse([
        'success' => true,
        'show_id' => $showId,
        'message' => 'Show added successfully with 160 seats (8 rows x 20 seats)'
    ], 201);

} catch (Exception $e) {
    $conn->rollback();
    sendError('Failed to add show: ' . $e->getMessage(), 500);
    exit();
}

$movieCheck->close();
$stmt->close();
$seatStmt->close();
$db->close();
?>
