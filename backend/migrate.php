<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    die(json_encode(['error' => 'Database connection failed']));
}

// Check if confirmation_code column exists
$checkColumn = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME='bookings' AND COLUMN_NAME='confirmation_code' AND TABLE_SCHEMA=DATABASE()";
$result = $conn->query($checkColumn);

if ($result->num_rows === 0) {
    // Add confirmation_code column if it doesn't exist
    $alterSql = "ALTER TABLE bookings ADD COLUMN confirmation_code VARCHAR(10) UNIQUE COMMENT 'Unique confirmation code for ticket validation'";
    
    if ($conn->query($alterSql)) {
        echo json_encode([
            'success' => true,
            'message' => 'confirmation_code column added successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to add confirmation_code column: ' . $conn->error
        ]);
    }
} else {
    echo json_encode([
        'success' => true,
        'message' => 'confirmation_code column already exists'
    ]);
}

$db->close();
?>
