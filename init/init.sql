-- Initialization SQL for smart_door_lock (converted from db_init.py)
-- This will be executed by the MariaDB docker entrypoint on first startup

CREATE DATABASE IF NOT EXISTS `smart_door_lock` DEFAULT CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci';
USE `smart_door_lock`;

-- ------------------- USERS TABLE (Updated for login) -------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------- KEYS -------------------
CREATE TABLE IF NOT EXISTS access_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_uid VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(100),
    user_id INT,
    status VARCHAR(50) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------- DOORS -------------------
CREATE TABLE IF NOT EXISTS doors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    device_ip VARCHAR(100) NOT NULL,
    status ENUM('locked','unlocked') DEFAULT 'locked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------- PERMISSIONS -------------------
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_id INT NOT NULL,
    door_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'operator',
    FOREIGN KEY (key_id) REFERENCES access_keys(id) ON DELETE CASCADE,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
    UNIQUE (key_id, door_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------- ACCESS LOGS -------------------
CREATE TABLE IF NOT EXISTS access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    door_id INT,
    action VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
