-- Support Ticket Management System - Database Schema
-- Compatible with MySQL 5.5+ and MySQL 8.0+

CREATE DATABASE IF NOT EXISTS support_tickets;
USE support_tickets;

-- Drop tables if they exist to allow clean recreation
DROP TABLE IF EXISTS ticket_comments;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- 1. Users table (Stores both customers and support agents)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'agent') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tickets table (Stores customer support tickets)
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    assigned_to INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_priority (priority),
    INDEX idx_tickets_user_id (user_id),
    INDEX idx_tickets_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Ticket Comments table (Stores communication/responses per ticket)
CREATE TABLE ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_comments_ticket_id (ticket_id),
    INDEX idx_comments_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
