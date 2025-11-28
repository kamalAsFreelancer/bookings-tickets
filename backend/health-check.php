<?php
// Backend Health Check Script
// Place in: backend/health-check.php

header('Content-Type: application/json');

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'checks' => []
];

// Check 1: Database Connection
try {
    require_once 'config.php';
    require_once 'db.php';
    $db = new Database();
    $conn = $db->getConnection();
    
    if ($conn) {
        $results['checks']['database'] = [
            'status' => 'OK',
            'message' => 'Connected to ' . DB_NAME
        ];
    } else {
        $results['checks']['database'] = [
            'status' => 'ERROR',
            'message' => 'Failed to connect to database'
        ];
    }
} catch (Exception $e) {
    $results['checks']['database'] = [
        'status' => 'ERROR',
        'message' => $e->getMessage()
    ];
}

// Check 2: Tables Exist
try {
    $tables = ['users', 'movies', 'shows', 'seats', 'bookings'];
    $missing = [];
    
    foreach ($tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if ($result->num_rows === 0) {
            $missing[] = $table;
        }
    }
    
    if (empty($missing)) {
        $results['checks']['tables'] = [
            'status' => 'OK',
            'message' => 'All required tables exist'
        ];
    } else {
        $results['checks']['tables'] = [
            'status' => 'ERROR',
            'message' => 'Missing tables: ' . implode(', ', $missing)
        ];
    }
} catch (Exception $e) {
    $results['checks']['tables'] = [
        'status' => 'ERROR',
        'message' => $e->getMessage()
    ];
}

// Check 3: Sample Endpoints
$endpoints = [
    'getMovies.php' => 'GET /backend/getMovies.php',
    'getStats.php' => 'GET /backend/getStats.php'
];

$baseUrl = 'http://127.0.0.1/project/backend/';

foreach ($endpoints as $file => $name) {
    $url = $baseUrl . $file;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    $response = @curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $results['checks'][$file] = [
            'status' => 'OK',
            'endpoint' => $name,
            'http_code' => $httpCode
        ];
    } else {
        $results['checks'][$file] = [
            'status' => 'ERROR',
            'endpoint' => $name,
            'http_code' => $httpCode,
            'error' => $error
        ];
    }
}

// Check 4: PHP Version & Extensions
$results['system'] = [
    'php_version' => phpversion(),
    'extensions' => [
        'mysqli' => extension_loaded('mysqli') ? 'OK' : 'MISSING',
        'json' => extension_loaded('json') ? 'OK' : 'MISSING',
        'curl' => extension_loaded('curl') ? 'OK' : 'MISSING'
    ]
];

// Overall Status
$hasErrors = false;
foreach ($results['checks'] as $check) {
    if ($check['status'] !== 'OK') {
        $hasErrors = true;
        break;
    }
}

$results['overall_status'] = $hasErrors ? 'ERROR' : 'OK';

http_response_code($hasErrors ? 500 : 200);
echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
