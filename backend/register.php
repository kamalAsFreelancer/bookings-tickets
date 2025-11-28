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

if (!isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
    sendError('Name, email, and password are required', 400);
    exit();
}

// Trim and validate inputs
$name = trim($input['name']);
$email = trim($input['email']);
$password = $input['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Invalid email format', 400);
    exit();
}

// Validate password length
if (strlen($password) < 8) {
    sendError('Password must be at least 8 characters long', 400);
    exit();
}

// Validate name (basic check)
if (strlen($name) < 2) {
    sendError('Name must be at least 2 characters long', 400);
    exit();
}

$password = password_hash($password, PASSWORD_DEFAULT);

// Check if email already exists
$checkSql = "SELECT id FROM users WHERE email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    sendError('Email already registered', 409);
    exit();
}

// Insert new user
$sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $password);

if ($stmt->execute()) {
    $userId = $conn->insert_id;

    sendResponse([
        'success' => true,
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'user'
        ],
        'message' => 'Registration successful'
    ], 201);
} else {
    sendError('Registration failed', 500);
    exit();
}

$checkStmt->close();
$stmt->close();
$db->close();
?>
