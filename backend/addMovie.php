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
if (!isset($input['title']) || !isset($input['duration']) || !isset($input['price'])) {
    sendError('Title, duration, and price are required', 400);
    exit();
}

$title = trim($input['title']);
$description = isset($input['description']) ? trim($input['description']) : '';
$poster = isset($input['poster']) ? trim($input['poster']) : '';
$duration = intval($input['duration']);
$language = isset($input['language']) ? trim($input['language']) : 'English';
$genre = isset($input['genre']) ? trim($input['genre']) : '';

// Validate inputs
if (strlen($title) < 1) {
    sendError('Title cannot be empty', 400);
    exit();
}
if ($duration < 1) {
    sendError('Duration must be at least 1 minute', 400);
    exit();
}
if (floatval($input['price']) < 0) {
    sendError('Price cannot be negative', 400);
    exit();
}

$sql = "INSERT INTO movies (title, description, poster, duration, language, genre)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    sendError('Database error: ' . $conn->error, 500);
    exit();
}
$stmt->bind_param("sssiss", $title, $description, $poster, $duration, $language, $genre);

if ($stmt->execute()) {
    $movieId = $conn->insert_id;
    sendResponse([
        'success' => true,
        'movie_id' => $movieId,
        'message' => 'Movie added successfully'
    ], 201);
} else {
    sendError('Failed to add movie: ' . $stmt->error, 500);
    exit();
}

$stmt->close();
$db->close();
?>
