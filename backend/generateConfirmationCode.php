<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
    exit();
}

// Check if bookings table has confirmation_code column
$checkColumn = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME='bookings' AND COLUMN_NAME='confirmation_code'";
$result = $conn->query($checkColumn);

if ($result->num_rows === 0) {
    // Add column if it doesn't exist
    $alterSql = "ALTER TABLE bookings ADD COLUMN confirmation_code VARCHAR(10) UNIQUE NOT NULL DEFAULT '' AFTER booking_time";
    if (!$conn->query($alterSql)) {
        sendError('Failed to add confirmation_code column: ' . $conn->error, 500);
        exit();
    }
}

// Generate unique confirmation code
do {
    $confirmationCode = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 8));
    
    // Check if code already exists
    $checkCode = "SELECT id FROM bookings WHERE confirmation_code = ?";
    $stmt = $conn->prepare($checkCode);
    if (!$stmt) {
        sendError('Prepare failed: ' . $conn->error, 500);
        exit();
    }
    $stmt->bind_param('s', $confirmationCode);
    $stmt->execute();
    $codeResult = $stmt->get_result();
    $stmt->close();
} while ($codeResult->num_rows > 0);

sendResponse([
    'confirmation_code' => $confirmationCode
]);

$db->close();
?>
