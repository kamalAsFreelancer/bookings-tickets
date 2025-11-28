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

if (!isset($input['user_id']) || !isset($input['show_id']) || !isset($input['seat_numbers']) || !is_array($input['seat_numbers'])) {
    sendError('Invalid booking data', 400);
    exit();
}

$userId = intval($input['user_id']);
$showId = intval($input['show_id']);
$seatNumbers = $input['seat_numbers'];

if (empty($seatNumbers)) {
    sendError('Please select at least one seat', 400);
    exit();
}

// Start transaction
$conn->begin_transaction();

try {
    // Generate unique confirmation code
    do {
        $confirmationCode = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 8));
        
        // Check if code already exists
        $checkCode = "SELECT id FROM bookings WHERE confirmation_code = ?";
        $codeStmt = $conn->prepare($checkCode);
        $codeStmt->bind_param('s', $confirmationCode);
        $codeStmt->execute();
        $codeResult = $codeStmt->get_result();
        $codeStmt->close();
    } while ($codeResult->num_rows > 0);

    // Get show price
    $showSql = "SELECT price FROM shows WHERE id = ?";
    $showStmt = $conn->prepare($showSql);
    $showStmt->bind_param("i", $showId);
    $showStmt->execute();
    $showResult = $showStmt->get_result();

    if ($showResult->num_rows === 0) {
        throw new Exception('Show not found');
    }

    $show = $showResult->fetch_assoc();
    $pricePerSeat = $show['price'];

    // Check if seats are available and lock them
    $placeholders = str_repeat('?,', count($seatNumbers) - 1) . '?';
    $checkSql = "SELECT seat_number, is_booked FROM seats
                 WHERE show_id = ? AND seat_number IN ($placeholders) FOR UPDATE";
    $checkStmt = $conn->prepare($checkSql);

    $types = str_repeat('s', count($seatNumbers));
    $checkStmt->bind_param("i" . $types, $showId, ...$seatNumbers);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    $bookedSeats = [];
    while ($row = $checkResult->fetch_assoc()) {
        if ($row['is_booked']) {
            $bookedSeats[] = $row['seat_number'];
        }
    }

    if (!empty($bookedSeats)) {
        throw new Exception('Seats already booked: ' . implode(', ', $bookedSeats));
    }

    // Update seats to booked
    $updateSql = "UPDATE seats SET is_booked = 1
                  WHERE show_id = ? AND seat_number IN ($placeholders)";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("i" . $types, $showId, ...$seatNumbers);
    $updateStmt->execute();

    // Calculate total price
    $totalPrice = $pricePerSeat * count($seatNumbers);

    // Create booking record with confirmation code
    $seatNumbersStr = implode(',', $seatNumbers);
    $bookingSql = "INSERT INTO bookings (user_id, show_id, seat_numbers, total_price, confirmation_code)
                   VALUES (?, ?, ?, ?, ?)";
    $bookingStmt = $conn->prepare($bookingSql);
    $bookingStmt->bind_param("iisds", $userId, $showId, $seatNumbersStr, $totalPrice, $confirmationCode);
    $bookingStmt->execute();

    $bookingId = $conn->insert_id;

    // Commit transaction
    $conn->commit();

    sendResponse([
        'success' => true,
        'booking_id' => $bookingId,
        'confirmation_code' => $confirmationCode,
        'total_price' => $totalPrice,
        'message' => 'Booking successful!'
    ]);

} catch (Exception $e) {
    $conn->rollback();
    sendError($e->getMessage(), 400);
    exit();
}

$db->close();
?>
