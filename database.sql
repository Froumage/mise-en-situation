-- Create database
CREATE DATABASE IF NOT EXISTS grocery_app;
USE grocery_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Grocery lists table
CREATE TABLE IF NOT EXISTS grocery_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Product list table (items in lists)
CREATE TABLE IF NOT EXISTS product_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    quantity VARCHAR(100) DEFAULT '',
    price DECIMAL(10,2) DEFAULT 0.00,
    done TINYINT(1) DEFAULT 0,
    list_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (list_id) REFERENCES grocery_lists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- List templates table
CREATE TABLE IF NOT EXISTS list_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Template items table
CREATE TABLE IF NOT EXISTS template_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    quantity VARCHAR(100) DEFAULT '',
    FOREIGN KEY (template_id) REFERENCES list_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
('Fruits & Légumes', 'fruit-et-legumes.png'),
('Épicerie', 'epicerie.jpg'),
('Boissons', 'boissons.jpg'),
('Hygiène', 'hygiene.jpg'),
('Boucherie', 'viande.png'),
('Pain', 'pain.png'),
('Électroménager', 'electro.jpg'),
('Électronique', 'electro.png'),
('Autres', NULL);

-- Insert sample templates
INSERT INTO list_templates (name, description) VALUES
('Courses hebdomadaires', 'Liste de courses pour une semaine type'),
('Courses du weekend', 'Courses pour le weekend'),
('Courses de fête', 'Préparation pour une fête'),
('Courses de base', 'Produits essentiels'),
('Courses bio', 'Produits biologiques'),
('Courses végétariennes', 'Liste végétarienne'),
('Courses pour bébé', 'Produits pour bébé'),
('Courses de nettoyage', 'Produits d\'entretien');

-- Insert template items (sample data)
INSERT INTO template_items (template_id, name, category_id, quantity) VALUES
(1, 'Pommes', 1, '1 kg'),
(1, 'Bananes', 1, '1 kg'),
(1, 'Lait', 3, '2 L'),
(1, 'Pain', 6, '1'),
(1, 'Oeufs', 9, '12'),
(1, 'Fromage', 5, '200 g'),
(1, 'Yaourt', 3, '6'),
(1, 'Pâtes', 2, '500 g'),
(1, 'Riz', 2, '1 kg'),
(1, 'Tomates', 1, '500 g'),
(1, 'Concombre', 1, '2'),
(1, 'Carottes', 1, '500 g'),
(1, 'Oignons', 1, '500 g');
