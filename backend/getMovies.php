<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

$sql = "SELECT * FROM movies ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result) {
    $movies = [];
    while ($row = $result->fetch_assoc()) {
        $movies[] = $row;
    }
    sendResponse(['movies' => $movies]);
} else {
    sendError('Failed to fetch movies', 500);
    exit();
}

$db->close();
?>
