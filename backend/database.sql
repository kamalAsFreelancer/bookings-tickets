-- Cinema Hall Booking System Database Schema
-- Import this file into phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS cinema_booking;
USE cinema_booking;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    poster VARCHAR(255),
    duration INT NOT NULL COMMENT 'Duration in minutes',
    language VARCHAR(50),
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    hall_name VARCHAR(50) DEFAULT 'Main Hall',
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Seats table (160 seats per show: A1-A16, B1-B16, ... J1-J16)
CREATE TABLE IF NOT EXISTS seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    seat_number VARCHAR(5) NOT NULL COMMENT 'e.g., A1, B5, J16',
    is_booked TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat_per_show (show_id, seat_number)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    seat_numbers TEXT NOT NULL COMMENT 'Comma-separated seat numbers',
    total_price DECIMAL(10, 2) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmation_code VARCHAR(10) UNIQUE COMMENT 'Unique confirmation code for ticket validation',
    payment_id INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    seat_numbers VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    esewa_ref_id VARCHAR(100) DEFAULT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Insert default admin user (password: admin123)
-- Password is hashed using PHP password_hash()
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@cinema.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample movies
INSERT INTO movies (title, description, poster, duration, language, genre) VALUES
('The Grand Adventure', 'An epic journey through unknown lands filled with mystery and excitement.', 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg', 148, 'English', 'Adventure'),
('Night Shadows', 'A thrilling mystery that unfolds in the dark corners of the city.', 'https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg', 132, 'English', 'Thriller'),
('Love in Paris', 'A romantic tale set against the beautiful backdrop of Paris.', 'https://images.pexels.com/photos/8263928/pexels-photo-8263928.jpeg', 118, 'English', 'Romance');

-- Insert sample shows (current date + upcoming days)
INSERT INTO shows (movie_id, date, time, hall_name, price) VALUES
(1, CURDATE(), '14:00:00', 'Hall A', 250.00),
(1, CURDATE(), '18:30:00', 'Hall A', 300.00),
(2, CURDATE(), '15:00:00', 'Hall B', 250.00),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'Hall B', 300.00),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', 'Hall A', 250.00);

-- Create stored procedure to initialize seats for a show
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS initialize_seats(IN p_show_id INT)
BEGIN
    DECLARE v_row CHAR(1);
    DECLARE v_seat_num INT;
    DECLARE v_rows VARCHAR(10) DEFAULT 'ABCDEFGHIJ';
    DECLARE v_row_index INT DEFAULT 1;

    -- Loop through rows A to J (10 rows)
    WHILE v_row_index <= 10 DO
        SET v_row = SUBSTRING(v_rows, v_row_index, 1);
        SET v_seat_num = 1;

        -- Loop through seats 1 to 16 per row
        WHILE v_seat_num <= 16 DO
            INSERT INTO seats (show_id, seat_number, is_booked)
            VALUES (p_show_id, CONCAT(v_row, v_seat_num), 0);
            SET v_seat_num = v_seat_num + 1;
        END WHILE;

        SET v_row_index = v_row_index + 1;
    END WHILE;
END$$
DELIMITER ;

-- Initialize seats for all sample shows
CALL initialize_seats(1);
CALL initialize_seats(2);
CALL initialize_seats(3);
CALL initialize_seats(4);
CALL initialize_seats(5);
