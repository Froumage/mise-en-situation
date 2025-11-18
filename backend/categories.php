<?php
include 'config.php';

// Hardcoded categories since DB setup failed
$categories = [
    ['id' => 1, 'name' => 'Fruits & Légumes', 'icon' => 'fruit-et-legumes.png'],
    ['id' => 2, 'name' => 'Épicerie', 'icon' => 'epicerie.jpg'],
    ['id' => 3, 'name' => 'Boissons', 'icon' => 'boissons.jpg'],
    ['id' => 4, 'name' => 'Hygiène', 'icon' => 'hygiene.jpg'],
    ['id' => 5, 'name' => 'Boucherie', 'icon' => 'viande.png'],
    ['id' => 6, 'name' => 'Pain', 'icon' => 'pain.png'],
    ['id' => 7, 'name' => 'Électroménager', 'icon' => 'electro.jpg'],
    ['id' => 8, 'name' => 'Électronique', 'icon' => 'electro.png'],
    ['id' => 9, 'name' => 'Autres', 'icon' => null]
];

echo json_encode($categories);
?>
