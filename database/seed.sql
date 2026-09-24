-- Support Ticket Management System - Seed Data
USE support_tickets;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ticket_comments;
TRUNCATE TABLE tickets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Seed Users
-- Passwords below are bcrypt hashes for 'password123'
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'John Customer', 'customer@example.com', '$2b$10$PwmQaw2P.KF5VvpObxTs8u79XIDEjq1PNbNl2WtlrVMv8/72CqenW', 'customer'),
(2, 'Alice Smith', 'alice@example.com', '$2b$10$PwmQaw2P.KF5VvpObxTs8u79XIDEjq1PNbNl2WtlrVMv8/72CqenW', 'customer'),
(3, 'Support Sarah', 'agent@example.com', '$2b$10$PwmQaw2P.KF5VvpObxTs8u79XIDEjq1PNbNl2WtlrVMv8/72CqenW', 'agent'),
(4, 'Support Bob', 'bob.agent@example.com', '$2b$10$PwmQaw2P.KF5VvpObxTs8u79XIDEjq1PNbNl2WtlrVMv8/72CqenW', 'agent');

-- Insert Seed Tickets
INSERT INTO tickets (id, user_id, subject, description, priority, status, assigned_to) VALUES
(1, 1, 'Cannot access billing invoice', 'I am unable to download my PDF invoice for August 2026. Page returns 500 error.', 'high', 'open', NULL),
(2, 1, 'Feature Request: Dark Mode', 'Would love to have an option to switch to dark theme in customer dashboard.', 'low', 'in_progress', 3),
(3, 2, 'Password reset email not received', 'I requested a password reset email 2 hours ago and have not received it yet.', 'medium', 'open', NULL),
(4, 2, 'Account deletion inquiry', 'Please let me know the procedure to delete my account and data per GDPR.', 'medium', 'closed', 4);

-- Insert Seed Ticket Comments
INSERT INTO ticket_comments (id, ticket_id, user_id, comment) VALUES
(1, 1, 1, 'Here is additional context: I tried on Chrome and Firefox, same error.'),
(2, 2, 3, 'Hello John! We are currently working on this feature, stay tuned for updates.'),
(3, 2, 1, 'Awesome, thanks Sarah!'),
(4, 4, 4, 'Hello Alice, your account deletion request has been processed and confirmed.'),
(5, 4, 2, 'Thank you Bob for the quick assistance!');
