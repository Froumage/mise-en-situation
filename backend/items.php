<?php
include 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_start();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $listId = (int)($_GET['list_id'] ?? 0);

    if (!$listId) {
        echo json_encode(['success' => false, 'message' => 'List ID is required']);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT id FROM grocery_lists WHERE id = ? AND user_id = ?");
    $stmt->execute([$listId, $userId]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'List not found or access denied']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT pl.id, pl.name, pl.quantity, pl.price, pl.done, c.name as category_name, c.icon as category_icon
        FROM product_list pl
        JOIN categories c ON pl.category_id = c.id
        WHERE pl.list_id = ?
        ORDER BY pl.created_at ASC
    ");
    $stmt->execute([$listId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'items' => $items]);

} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
