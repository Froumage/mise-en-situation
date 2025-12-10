<?php
include 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Start session for user authentication
session_start();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT id, name, created_at FROM grocery_lists WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $lists = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'lists' => $lists]);

} elseif ($method === 'POST') {
   
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    $name = htmlspecialchars(strip_tags($data['name'] ?? ''));

    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'List name is required']);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $stmt = $pdo->prepare("INSERT INTO grocery_lists (name, user_id) VALUES (?, ?)");
    if ($stmt->execute([$name, $userId])) {
        $listId = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'message' => 'List created', 'list_id' => $listId]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create list']);
    }

} elseif ($method === 'PUT') {
   
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    $action = $data['action'] ?? '';

    if ($action === 'add_item') {
        $listId = $data['list_id'] ?? 0;
        $name = htmlspecialchars(strip_tags($data['name'] ?? ''));
        $categoryId = (int)($data['category_id'] ?? 0);
        $quantity = htmlspecialchars(strip_tags($data['quantity'] ?? ''));
        $price = (float)($data['price'] ?? 0.00);

        if (empty($name) || !$categoryId) {
            echo json_encode(['success' => false, 'message' => 'Name and category are required']);
            exit;
        }

        $userId = $_SESSION['user_id'];

        
        $stmt = $pdo->prepare("SELECT id FROM grocery_lists WHERE id = ? AND user_id = ?");
        $stmt->execute([$listId, $userId]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'List not found or access denied']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO product_list (name, category_id, quantity, price, list_id) VALUES (?, ?, ?, ?, ?)");
        if ($stmt->execute([$name, $categoryId, $quantity, $price, $listId])) {
            $itemId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Item added', 'item_id' => $itemId]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add item']);
        }

    } elseif ($action === 'update_item') {
        $itemId = $data['item_id'] ?? 0;
        $done = (int)($data['done'] ?? 0);

        $userId = $_SESSION['user_id'];

        
        $stmt = $pdo->prepare("SELECT pl.id FROM product_list pl JOIN grocery_lists gl ON pl.list_id = gl.id WHERE pl.id = ? AND gl.user_id = ?");
        $stmt->execute([$itemId, $userId]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Item not found or access denied']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE product_list SET done = ? WHERE id = ?");
        if ($stmt->execute([$done, $itemId])) {
            echo json_encode(['success' => true, 'message' => 'Item updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update item']);
        }

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} elseif ($method === 'PATCH') {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    $action = $data['action'] ?? '';

    if ($action === 'update_item') {
        $itemId = $data['item_id'] ?? 0;
        $quantity = htmlspecialchars(strip_tags($data['quantity'] ?? ''));
        $price = (float)($data['price'] ?? 0.00);
        $done = isset($data['done']) ? (int)$data['done'] : null;

        $userId = $_SESSION['user_id'];

        
        $stmt = $pdo->prepare("SELECT pl.id FROM product_list pl JOIN grocery_lists gl ON pl.list_id = gl.id WHERE pl.id = ? AND gl.user_id = ?");
        $stmt->execute([$itemId, $userId]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Item not found or access denied']);
            exit;
        }

       
        $updateFields = [];
        $params = [];

        if ($quantity !== '') {
            $updateFields[] = "quantity = ?";
            $params[] = $quantity;
        }

        if ($price !== null) {
            $updateFields[] = "price = ?";
            $params[] = $price;
        }

        if ($done !== null) {
            $updateFields[] = "done = ?";
            $params[] = $done;
        }

        if (empty($updateFields)) {
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            exit;
        }

        $params[] = $itemId;
        $stmt = $pdo->prepare("UPDATE product_list SET " . implode(', ', $updateFields) . " WHERE id = ?");

        if ($stmt->execute($params)) {
            echo json_encode(['success' => true, 'message' => 'Item updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update item']);
        }

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} elseif ($method === 'DELETE') {
   
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    $action = $data['action'] ?? '';

    if ($action === 'delete_list') {
        $listId = $data['list_id'] ?? 0;

        $userId = $_SESSION['user_id'];

        $stmt = $pdo->prepare("DELETE FROM grocery_lists WHERE id = ? AND user_id = ?");
        if ($stmt->execute([$listId, $userId])) {
            echo json_encode(['success' => true, 'message' => 'List deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete list']);
        }

    } elseif ($action === 'delete_item') {
        $itemId = $data['item_id'] ?? 0;

        $userId = $_SESSION['user_id'];


        $stmt = $pdo->prepare("SELECT pl.id FROM product_list pl JOIN grocery_lists gl ON pl.list_id = gl.id WHERE pl.id = ? AND gl.user_id = ?");
        $stmt->execute([$itemId, $userId]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Item not found or access denied']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM product_list WHERE id = ?");
        if ($stmt->execute([$itemId])) {
            echo json_encode(['success' => true, 'message' => 'Item deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete item']);
        }

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
