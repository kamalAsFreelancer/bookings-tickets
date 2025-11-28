<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    sendError('Database connection failed', 500);
    exit();
}

// Get collection data for each movie (revenue, bookings count, seats booked)
$sql = "
    SELECT 
        m.id,
        m.title,
        m.poster,
        m.genre,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.total_price), 0) as collection,
        COUNT(DISTINCT b.id) as seats_booked
    FROM movies m
    LEFT JOIN shows s ON m.id = s.movie_id
    LEFT JOIN bookings b ON s.id = b.show_id
    GROUP BY m.id, m.title, m.poster, m.genre
    ORDER BY collection DESC
";

$result = $conn->query($sql);

if (!$result) {
    sendError('Failed to fetch movie collections: ' . $conn->error, 500);
    exit();
}

$collections = [];
while ($row = $result->fetch_assoc()) {
    $collections[] = [
        'id' => (int)$row['id'],
        'title' => $row['title'],
        'poster' => $row['poster'],
        'genre' => $row['genre'],
        'total_bookings' => (int)$row['total_bookings'],
        'collection' => (float)$row['collection'],
        'seats_booked' => (int)$row['seats_booked']
    ];
}

sendResponse([
    'collections' => $collections
]);

$db->close();
?>
