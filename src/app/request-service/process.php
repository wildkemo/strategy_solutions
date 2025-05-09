<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Debug information
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log the received data
$postData = file_get_contents("php://input");
error_log("Received POST data: " . $postData);
error_log("POST array: " . print_r($_POST, true));

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$service = $_POST['service'] ?? '';
$message = $_POST['message'] ?? '';

// Create response array
$response = [
    'status' => 'success',
    'data' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'service' => $service,
        'message' => $message
    ]
];

// Send JSON response
echo json_encode($response);
?> 