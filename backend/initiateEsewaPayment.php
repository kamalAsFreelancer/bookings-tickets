<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

// eSewa Configuration
define('ESEWA_MERCHANT_CODE', 'EPAYTEST'); // Use your actual merchant code

// Get the host dynamically to work with localhost and mobile IPs
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$baseUrl = $protocol . '://' . $host;

define('ESEWA_SUCCESS_URL', $baseUrl . '/project/#/payment-success');
define('ESEWA_FAILURE_URL', $baseUrl . '/project/#/payment-failure');
define('ESEWA_API_URL', 'https://uat.esewa.com.np/epay/transaction/initiate/'); // UAT URL for testing

$json = file_get_contents('php://input');
$input = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Invalid JSON input', 400);
    exit();
}

if (!isset($input['user_id']) || !isset($input['show_id']) || !isset($input['seat_numbers']) || !isset($input['total_price'])) {
    sendError('Missing payment parameters', 400);
    exit();
}

$userId = intval($input['user_id']);
$showId = intval($input['show_id']);
$seatNumbers = $input['seat_numbers'];
$totalPrice = floatval($input['total_price']);

// Create a unique transaction ID
$transactionId = 'TXN' . time() . $userId;

// Store pending payment in database
$db = new Database();
$conn = $db->getConnection();

try {
    // Create a pending payment record
    $sql = "INSERT INTO payments (user_id, show_id, seat_numbers, amount, transaction_id, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', NOW())";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }
    
    $seatNumbersStr = implode(',', $seatNumbers);
    $stmt->bind_param("iisds", $userId, $showId, $seatNumbersStr, $totalPrice, $transactionId);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to create payment record: " . $stmt->error);
    }

    $paymentId = $conn->insert_id;
    $stmt->close();


// Prepare eSewa payment form data
$esewaPaymentData = [
    'amt' => $totalPrice,
    'psc' => 0, // Service charge
    'pdc' => 0, // Delivery charge
    'txAmt' => 0, // Tax amount
    'total' => $totalPrice,
    'tAmt' => $totalPrice,
    'pid' => $paymentId, // Product/Payment ID
    'scd' => ESEWA_MERCHANT_CODE,
    'su' => ESEWA_SUCCESS_URL,
    'fu' => ESEWA_FAILURE_URL
];

// Generate signature
$message = implode(',', [
    $esewaPaymentData['amt'],
    $esewaPaymentData['psc'],
    $esewaPaymentData['pdc'],
    $esewaPaymentData['txAmt'],
    $esewaPaymentData['total'],
    $esewaPaymentData['pid'],
    $esewaPaymentData['scd']
]);

$signature = hash('sha256', $message);
$esewaPaymentData['sig'] = $signature;

$db->close();

    sendResponse([
        'success' => true,
        'payment_id' => $paymentId,
        'transaction_id' => $transactionId,
        'esewa_data' => $esewaPaymentData,
        'esewa_url' => ESEWA_API_URL,
        'message' => 'Payment initiated. Redirecting to eSewa...'
    ]);

} catch (Exception $e) {
    $db->close();
    sendError('Payment initiation failed: ' . $e->getMessage(), 400);
}

function sendResponse($data) {
    echo json_encode($data);
    exit();
}

function sendError($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode(['success' => false, 'error' => $message]);
    exit();
}
?>
