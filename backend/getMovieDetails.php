<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!isset($_GET['id'])) {
    sendError('Movie ID is required', 400);
    exit();
}

$movieId = intval($_GET['id']);

$sql = "SELECT * FROM movies WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $movieId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    sendError('Movie not found', 404);
    exit();
}

$movie = $result->fetch_assoc();

// Get shows for this movie
$showSql = "SELECT * FROM shows WHERE movie_id = ? AND date >= CURDATE() ORDER BY date, time";
$showStmt = $conn->prepare($showSql);
$showStmt->bind_param("i", $movieId);
$showStmt->execute();
$showResult = $showStmt->get_result();

$shows = [];
while ($row = $showResult->fetch_assoc()) {
    $shows[] = $row;
}

$movie['shows'] = $shows;

sendResponse(['movie' => $movie]);

$stmt->close();
$showStmt->close();
$db->close();
?>
