<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

define('ESEWA_MERCHANT_CODE', 'EPAYTEST');
define('ESEWA_VERIFY_URL', 'https://uat.esewa.com.np/epay/transaction/status/'); // UAT URL for testing

$json = file_get_contents('php://input');
$input = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Invalid JSON input', 400);
    exit();
}

if (!isset($input['payment_id']) || !isset($input['esewa_ref_id'])) {
    sendError('Missing verification parameters', 400);
    exit();
}

$paymentId = intval($input['payment_id']);
$esewaRefId = $input['esewa_ref_id'];

$db = new Database();
$conn = $db->getConnection();

try {
    // Get payment record
    $sql = "SELECT * FROM payments WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }
    
    $stmt->bind_param("i", $paymentId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Payment record not found');
    }

    $payment = $result->fetch_assoc();
    $stmt->close();

    // Verify with eSewa API
    $verifyData = [
        'amt' => $payment['amount'],
        'scd' => ESEWA_MERCHANT_CODE,
        'rid' => $esewaRefId,
        'pid' => $paymentId
    ];

    // Make request to eSewa verification API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, ESEWA_VERIFY_URL);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($verifyData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        throw new Exception("eSewa API error: " . $curlError);
    }

    // Parse eSewa response
    if ($response && strpos($response, 'success') !== false) {
        // Payment successful - update payment status
        $updateSql = "UPDATE payments SET status = 'completed', esewa_ref_id = ?, completed_at = NOW() WHERE id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("si", $esewaRefId, $paymentId);
        $updateStmt->execute();
        $updateStmt->close();    // Now create the actual booking with confirmation code
    $conn->begin_transaction();

    try {
        // Generate unique confirmation code
        do {
            $confirmationCode = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 8));
            
            $checkCode = "SELECT id FROM bookings WHERE confirmation_code = ?";
            $codeStmt = $conn->prepare($checkCode);
            $codeStmt->bind_param('s', $confirmationCode);
            $codeStmt->execute();
            $codeResult = $codeStmt->get_result();
            $codeStmt->close();
        } while ($codeResult->num_rows > 0);

        // Parse seat numbers
        $seatNumbers = explode(',', $payment['seat_numbers']);

        // Check and lock seats
        $placeholders = str_repeat('?,', count($seatNumbers) - 1) . '?';
        $checkSql = "SELECT seat_number, is_booked FROM seats
                     WHERE show_id = ? AND seat_number IN ($placeholders) FOR UPDATE";
        $checkStmt = $conn->prepare($checkSql);

        $types = str_repeat('s', count($seatNumbers));
        $checkStmt->bind_param("i" . $types, $payment['show_id'], ...$seatNumbers);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        $bookedSeats = [];
        while ($row = $checkResult->fetch_assoc()) {
            if ($row['is_booked']) {
                $bookedSeats[] = $row['seat_number'];
            }
        }
        $checkStmt->close();

        if (!empty($bookedSeats)) {
            throw new Exception('Seats already booked: ' . implode(', ', $bookedSeats));
        }

        // Update seats to booked
        $updateSeatsSQL = "UPDATE seats SET is_booked = 1
                           WHERE show_id = ? AND seat_number IN ($placeholders)";
        $updateSeatsStmt = $conn->prepare($updateSeatsSQL);
        $updateSeatsStmt->bind_param("i" . $types, $payment['show_id'], ...$seatNumbers);
        $updateSeatsStmt->execute();
        $updateSeatsStmt->close();

        // Create booking with confirmation code
        $bookingSql = "INSERT INTO bookings (user_id, show_id, seat_numbers, total_price, confirmation_code, payment_id)
                       VALUES (?, ?, ?, ?, ?, ?)";
        $bookingStmt = $conn->prepare($bookingSql);
        $bookingStmt->bind_param("iisdsi", $payment['user_id'], $payment['show_id'], $payment['seat_numbers'], $payment['amount'], $confirmationCode, $paymentId);
        $bookingStmt->execute();
        $bookingId = $conn->insert_id;
        $bookingStmt->close();

        $conn->commit();

        sendResponse([
            'success' => true,
            'booking_id' => $bookingId,
            'confirmation_code' => $confirmationCode,
            'message' => 'Payment verified and booking confirmed!'
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        sendError($e->getMessage(), 400);
        exit();
    }

    } else {
        // Payment failed - update payment status
        $updateSql = "UPDATE payments SET status = 'failed', esewa_ref_id = ?, completed_at = NOW() WHERE id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("si", $esewaRefId, $paymentId);
        $updateStmt->execute();
        $updateStmt->close();

        throw new Exception('Payment verification failed');
    }

} catch (Exception $e) {
    $db->close();
    sendError($e->getMessage(), 400);
    exit();
}

$db->close();

?>
