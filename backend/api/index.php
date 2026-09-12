<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$endpoint = explode('/', $path)[0];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($endpoint) {
    case 'clinics':
        if ($method === 'GET') {
            $slug = isset($_GET['slug']) ? $_GET['slug'] : null;
            if ($slug) {
                $stmt = $conn->prepare("SELECT * FROM clinics WHERE slug = ?");
                $stmt->execute([$slug]);
                $clinic = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($clinic) {
                    echo json_encode($clinic);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "Clinic not found"]);
                }
            } else {
                $stmt = $conn->prepare("SELECT * FROM clinics");
                $stmt->execute();
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
        }
        break;

    case 'doctors':
        if ($method === 'GET') {
            $clinic_id = isset($_GET['clinic_id']) ? $_GET['clinic_id'] : null;
            if ($clinic_id) {
                $stmt = $conn->prepare("SELECT * FROM doctors WHERE clinic_id = ?");
                $stmt->execute([$clinic_id]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
        }
        break;

    case 'appointments':
        if ($method === 'GET') {
            $clinic_id = isset($_GET['clinic_id']) ? $_GET['clinic_id'] : null;
            $date = isset($_GET['date']) ? $_GET['date'] : null;
            $query = "SELECT * FROM appointments WHERE clinic_id = ?";
            $params = [$clinic_id];
            if ($date) {
                $query .= " AND appointment_date = ?";
                $params[] = $date;
            }
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($method === 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->clinic_id) && isset($data->doctor_id) && isset($data->patient_name) && isset($data->patient_phone) && isset($data->appointment_date) && isset($data->appointment_time)) {
                // Get max queue number for the day
                $stmt = $conn->prepare("SELECT MAX(queue_number) as max_queue FROM appointments WHERE clinic_id = ? AND appointment_date = ?");
                $stmt->execute([$data->clinic_id, $data->appointment_date]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $queue_number = ($row['max_queue'] ? $row['max_queue'] : 0) + 1;

                $query = "INSERT INTO appointments (clinic_id, doctor_id, patient_name, patient_phone, appointment_date, appointment_time, status, queue_number, notes) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)";
                $stmt = $conn->prepare($query);
                if ($stmt->execute([$data->clinic_id, $data->doctor_id, $data->patient_name, $data->patient_phone, $data->appointment_date, $data->appointment_time, $queue_number, isset($data->notes) ? $data->notes : ''])) {
                    echo json_encode(["message" => "Appointment created successfully.", "queue_number" => $queue_number]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to create appointment."]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Incomplete data."]);
            }
        } elseif ($method === 'PUT') {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->id) && isset($data->status)) {
                $stmt = $conn->prepare("UPDATE appointments SET status = ? WHERE id = ?");
                if ($stmt->execute([$data->status, $data->id])) {
                    echo json_encode(["message" => "Status updated."]);
                }
            }
        }
        break;

    case 'auth':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->username) && isset($data->password)) {
                $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
                $stmt->execute([$data->username]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($user && password_verify($data->password, $user['password'])) {
                    echo json_encode([
                        "message" => "Login successful",
                        "session" => ["username" => $user['username'], "clinic_id" => $user['clinic_id']]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(["message" => "Invalid credentials"]);
                }
            }
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found"]);
        break;
}
?>
