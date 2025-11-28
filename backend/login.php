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

if (!isset($input['email']) || !isset($input['password'])) {
    sendError('Email and password are required', 400);
    exit();
}

$email = trim($input['email']);
$password = $input['password'];

$sql = "SELECT id, name, email, password, role FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendError('Invalid email or password', 401);
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    sendError('Invalid email or password', 401);
    exit();
}

// Remove password from response
unset($user['password']);

sendResponse([
    'success' => true,
    'user' => $user,
    'message' => 'Login successful'
]);

$stmt->close();
$db->close();
?>
