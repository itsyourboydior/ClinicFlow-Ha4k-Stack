-- phpMyAdmin SQL Dump
-- ClinicFlow Initial Schema and Seed Data

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `clinics`
--

CREATE TABLE `clinics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `specialty` varchar(255) NOT NULL,
  `specialty_en` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `logo` varchar(50) NOT NULL,
  `color` varchar(20) NOT NULL,
  `working_hours` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clinics`
--

INSERT INTO `clinics` (`id`, `slug`, `name`, `name_en`, `specialty`, `specialty_en`, `address`, `phone`, `email`, `logo`, `color`, `working_hours`) VALUES
(1, 'klinika-shendetit', 'Klinika Shëndeti', 'Health Clinic', 'Mjekësi e Përgjithshme', 'General Medicine', 'Rr. Nënë Tereza 24, Prishtinë 10000', '+383 44 123 456', 'info@klinikashendetit.com', '🏥', '#0ea5e9', 'E Hënë – E Shtunë: 08:00 – 18:00'),
(2, 'dentisti-beqiri', 'Dentisti Beqiri', 'Beqiri Dental Clinic', 'Stomatologji', 'Dentistry', 'Rr. UCK 87, Prishtinë 10000', '+383 44 987 654', 'kontakt@dentistibeqiri.com', '🦷', '#10b981', 'E Hënë – E Premte: 09:00 – 17:00');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `specialty` varchar(255) NOT NULL,
  `avatar` varchar(10) NOT NULL,
  `color` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clinic_id` (`clinic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `clinic_id`, `name`, `specialty`, `avatar`, `color`) VALUES
(1, 1, 'Dr. Arbëreshë Krasniqi', 'Mjekësi e Përgjithshme', 'AK', '#0ea5e9'),
(2, 1, 'Dr. Mentor Gashi', 'Internistikë', 'MG', '#6366f1'),
(3, 2, 'Dr. Bekim Beqiri', 'Stomatologji', 'BB', '#10b981'),
(4, 2, 'Dr. Liridon Mustafa', 'Ortodonci', 'LM', '#f59e0b');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `patient_name` varchar(255) NOT NULL,
  `patient_phone` varchar(50) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` varchar(10) NOT NULL,
  `status` enum('pending','confirmed','in-progress','completed','cancelled','no-show') NOT NULL DEFAULT 'confirmed',
  `queue_number` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clinic_id` (`clinic_id`),
  KEY `doctor_id` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`clinic_id`, `doctor_id`, `patient_name`, `patient_phone`, `appointment_date`, `appointment_time`, `status`, `queue_number`, `notes`) VALUES
(1, 1, 'Fjolla Berisha', '+383 44 111 222', CURDATE(), '08:00', 'completed', 1, 'Kontroll rutinë'),
(1, 1, 'Agim Syla', '+383 44 333 444', CURDATE(), '08:30', 'completed', 2, ''),
(1, 2, 'Rina Morina', '+383 45 555 666', CURDATE(), '09:00', 'in-progress', 3, 'Tension i lartë'),
(1, 1, 'Dardan Kelmendi', '+383 44 777 888', CURDATE(), '09:30', 'confirmed', 4, ''),
(1, 1, 'Blerta Haliti', '+383 44 999 000', CURDATE(), '10:00', 'confirmed', 5, 'Alergjia sezonale'),
(1, 2, 'Mentor Rexha', '+383 49 111 333', CURDATE(), '10:30', 'pending', 6, ''),
(1, 1, 'Valentina Osmani', '+383 44 444 555', CURDATE(), '11:00', 'pending', 7, ''),
(1, 2, 'Arbnor Jashari', '+383 45 666 777', CURDATE(), '11:30', 'pending', 8, '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clinic_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `clinic_id` (`clinic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `clinic_id`, `username`, `password`) VALUES
(1, 1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: admin123

--
-- Constraints for dumped tables
--

ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE;

ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
