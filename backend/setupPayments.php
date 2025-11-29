<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

try {
    // Check if payments table exists
    $checkTable = "SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' LIMIT 1";
    $result = $conn->query($checkTable);
    
    if ($result && $result->num_rows === 0) {
        // Create payments table
        $createPayments = "
            CREATE TABLE payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                show_id INT NOT NULL,
                seat_numbers VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                transaction_id VARCHAR(100) UNIQUE NOT NULL,
                esewa_ref_id VARCHAR(100) DEFAULT NULL,
                status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP NULL DEFAULT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (show_id) REFERENCES shows(id),
                INDEX idx_transaction_id (transaction_id),
                INDEX idx_user_id (user_id),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ";
        
        if ($conn->query($createPayments)) {
            echo json_encode(['success' => true, 'message' => 'Payments table created successfully']);
        } else {
            echo json_encode(['error' => 'Failed to create payments table: ' . $conn->error]);
        }
    } else {
        // Check if payment_id column exists in bookings
        $checkColumn = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'payment_id'";
        $columnResult = $conn->query($checkColumn);
        
        if ($columnResult && $columnResult->num_rows === 0) {
            // Add payment_id column
            $alterBookings = "ALTER TABLE bookings ADD COLUMN payment_id INT DEFAULT NULL AFTER confirmation_code";
            if ($conn->query($alterBookings)) {
                echo json_encode(['success' => true, 'message' => 'Added payment_id column to bookings']);
            } else {
                echo json_encode(['error' => 'Failed to add payment_id column: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => true, 'message' => 'Schema already up to date']);
        }
    }

} catch (Exception $e) {
    echo json_encode(['error' => 'Migration error: ' . $e->getMessage()]);
}

$db->close();
?>
