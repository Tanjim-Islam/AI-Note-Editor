<?php
// Raw PHP word count service
// This script accepts POST requests with text content and returns word count

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get the raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Check if text is provided
    if (!isset($data['text'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Text parameter is required']);
        exit();
    }
    
    $text = $data['text'];
    
    // Calculate word count
    // Remove extra whitespace and split by whitespace
    $words = preg_split('/\s+/', trim($text));
    
    // Filter out empty strings
    $words = array_filter($words, function($word) {
        return strlen(trim($word)) > 0;
    });
    
    $word_count = count($words);
    
    // Return the result
    echo json_encode([
        'word_count' => $word_count,
        'character_count' => strlen($text),
        'line_count' => substr_count($text, "\n") + 1
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}
?>