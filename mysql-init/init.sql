-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: inventorymanagement
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `id_cards`
--

DROP TABLE IF EXISTS `id_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `id_cards` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `card_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `serial_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `id_cards`
--

LOCK TABLES `id_cards` WRITE;
/*!40000 ALTER TABLE `id_cards` DISABLE KEYS */;
INSERT INTO `id_cards` VALUES (35,'V1','3585851',0,'2025-06-02 10:49:56','Admin','Admin','2025-06-02 16:18:43',1),(36,'V2','3246232',0,'2025-06-03 04:29:21','Admin','Admin','2025-06-02 12:55:29',1),(37,'V3','23111',1,'2025-06-02 10:50:12','Admin','Admin','2025-06-02 16:20:12',1),(38,'V4','5566',0,'2025-06-03 04:29:22','65',NULL,NULL,1),(39,'v5','2211',0,'2025-06-03 04:29:23','65',NULL,NULL,1),(40,'V6','11111111',0,'2025-06-03 04:29:35','65',NULL,NULL,1);
/*!40000 ALTER TABLE `id_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `user_id` int NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `transaction_date` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk__inventory__inven__656c112c` (`inventory_id`),
  KEY `fk__inventory__user___66603565` (`user_id`),
  CONSTRAINT `fk__inventory__inven__656c112c` FOREIGN KEY (`inventory_id`) REFERENCES `m_inventory` (`id`),
  CONSTRAINT `fk__inventory__user___66603565` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,5,65,'MOVE_TO_PANTRY','60','2025-05-06 09:45:56.550000','Approved'),(2,2,65,'MOVE_TO_PANTRY','50','2025-05-06 09:45:56.563000','Approved'),(3,2,65,'MOVE_TO_PANTRY','2','2025-05-06 10:11:51.293000','Approved'),(4,2,65,'MOVE_TO_PANTRY','1','2025-05-06 10:12:26.200000','*TRIAL*T'),(5,2,65,'*TRIAL*TRIAL*T','*','2025-05-06 10:12:54.330000','*TRIAL*T'),(6,3,65,'MOVE_TO_PANTRY','50','2025-05-06 10:13:19.570000','Approved'),(7,3,65,'*TRIAL*TRIAL*T','10','2025-05-06 10:14:51.290000','*TRIAL*T'),(8,3,65,'MOVE_TO_PANTRY','30','2025-05-06 10:16:41.373000','*TRIAL*T'),(9,21,65,'MOVE_TO_PANTRY','3','2025-05-06 12:54:32.410000','Approved'),(11,21,65,'MOVE_TO_PANTRY','*','2025-05-06 13:07:56.807000','*TRIAL*T'),(13,24,65,'MOVE_TO_PANTRY','200','2025-05-06 14:44:49.963000','Approved'),(14,23,65,'*TRIAL*TRIAL*T','14','2025-05-06 14:45:01.547000','Approved'),(16,30,65,'MOVE_TO_PANTRY','5','2025-05-07 12:07:00.997000','Approved'),(17,29,65,'MOVE_TO_PANTRY','14','2025-05-07 12:07:22.987000','*TRIAL*T'),(18,30,65,'MOVE_TO_PANTRY','50','2025-05-07 12:07:23.020000','Approved'),(19,30,65,'MOVE_BACK_TO_INVENTORY','5','2025-05-07 07:42:13.347000','Approved'),(20,30,65,'*TRIAL*TRIAL*TRIAL*TRI','50','2025-05-07 08:34:25.997000','*TRIAL*T'),(21,30,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:08:57.117000','Approved'),(22,30,65,'MOVE_BACK_TO_INVENTORY','50','2025-05-07 14:18:50.530000','Approved'),(23,3,65,'*TRIAL*TRIAL*TRIAL*TRI','10','2025-05-07 14:19:43.450000','Approved'),(24,3,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:19:43.460000','Approved'),(25,3,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:20:13.697000','Approved'),(26,3,65,'MOVE_BACK_TO_INVENTORY','10','2025-05-07 14:20:13.707000','Approved'),(27,29,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:36:01.090000','Approved'),(28,4,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:56:30.527000','Approved'),(29,24,65,'MOVE_BACK_TO_INVENTORY','100','2025-05-07 14:58:57.300000','Approved'),(31,30,65,'MOVE_BACK_TO_INVENTORY','*TR','2025-05-07 15:42:27.417000','*TRIAL*T'),(32,22,65,'*TRIAL*TRIAL*TRIAL*TRI','55','2025-05-07 15:45:15.090000','Approved'),(34,30,65,'*TRIAL*TRIAL*TRIAL*TRI','150','2025-05-07 16:37:18.287000','Approved'),(36,42,65,'MOVE_BACK_TO_INVENTORY','50','2025-05-08 10:41:35.247000','*TRIAL*T'),(39,1,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-08 15:47:15.773000','*TRIAL*T'),(40,42,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-08 15:47:15.790000','Approved'),(42,43,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-08 17:46:41.790000','Approved'),(43,43,65,'MOVE_TO_PANTRY','*T','2025-05-08 17:48:03.153000','Approved'),(44,42,65,'*TRIAL*TRIAL*T','55','2025-05-08 17:48:03.170000','Approved'),(45,1,65,'MOVE_TO_PANTRY','50','2025-05-08 18:09:30.390000','Approved'),(46,2,65,'MOVE_TO_PANTRY','5','2025-05-08 18:09:30.403000','Approved'),(47,29,65,'*TRIAL*TRIAL*T','14','2025-05-09 12:17:18.197000','Approved'),(48,28,65,'MOVE_TO_PANTRY','50','2025-05-09 12:17:18.207000','Approved'),(49,36,65,'MOVE_TO_PANTRY','55','2025-05-09 14:03:44.677000',NULL),(50,32,65,'MOVE_TO_PANTRY','24','2025-05-09 14:03:44.697000',NULL),(51,4,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:09:59.613000','Rejected'),(52,4,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:10:56.503000','Rejected'),(53,4,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:11:46.283000','*TRIAL*T'),(54,4,65,'*TRIAL*TRIAL*T','*T','2025-05-09 14:13:26.603000','Approved'),(55,5,65,'MOVE_TO_PANTRY','12','2025-05-09 14:13:26.610000','Rejected'),(56,5,65,'*TRIAL*TRIAL*T','12','2025-05-09 14:34:53.837000','*TRIAL*T'),(57,6,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:34:53.843000','rejected'),(58,18,65,'*TRIAL*TRIAL*T','*T','2025-05-09 20:31:45.563000','*TRIAL*T'),(61,30,65,'MOVE_TO_PANTRY','205','2025-05-13 10:22:23.320000','Rejected'),(63,3,65,'MOVE_TO_PANTRY','50','2025-05-13 11:58:15.947000','*TRIAL*T'),(64,21,66,'MOVE_TO_PANTRY','5','2025-05-14 12:44:47.673000','Rejected'),(68,3,65,'MOVE_TO_PANTRY','60','2025-05-14 15:48:26.213000','Rejected'),(69,22,65,'MOVE_TO_PANTRY','25','2025-05-14 15:48:26.230000','*TRIAL*T'),(70,21,65,'MOVE_TO_PANTRY','2','2025-05-14 15:48:26.240000','Rejected'),(77,3,65,'MOVE_TO_PANTRY','5','2025-05-15 12:24:10.880000','Rejected'),(78,3,65,'MOVE_TO_PANTRY','5','2025-05-15 12:31:24.580000','Rejected'),(80,24,65,'MOVE_TO_PANTRY','*T','2025-05-15 12:32:35.843000','*TRIAL*T'),(85,26,65,'MOVE_TO_PANTRY','12','2025-05-15 15:50:16.827000','Rejected'),(86,24,65,'*TRIAL*TRIAL*T','20','2025-05-15 15:57:48.407000','Rejected'),(87,24,65,'MOVE_TO_PANTRY','40','2025-05-15 15:58:58.090000','Rejected'),(88,24,65,'MOVE_TO_PANTRY','49','2025-05-15 16:23:33.267000','Rejected'),(89,21,65,'MOVE_TO_PANTRY','1','2025-05-15 16:24:05.980000','*TRIAL*T'),(90,22,65,'MOVE_TO_PANTRY','3','2025-05-15 16:24:06.000000','Rejected'),(92,30,65,'MOVE_TO_PANTRY','105','2025-05-15 16:24:06.033000','*TRIAL*'),(93,26,65,'*TRIAL*TRIAL*TRIAL*TRI','25','2025-05-15 16:31:08.323000','Approved'),(94,3,65,'*TRIAL*TRIAL*TRIAL*TRI','1','2025-05-15 16:31:08.347000','Approved'),(95,3,65,'MOVE_BACK_TO_INVENTORY','1','2025-05-15 16:31:08.360000','Approved'),(96,24,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-15 16:31:08.373000','Approved'),(97,3,65,'*TRIAL*TRIAL*TRIAL*TRI','*','2025-05-15 16:31:08.387000','Approved'),(98,3,65,'MOVE_BACK_TO_INVENTORY','5','2025-05-15 16:31:08.397000','Approved'),(99,30,65,'MOVE_BACK_TO_INVENTORY','*TR','2025-05-15 16:31:08.413000','Approved'),(100,22,65,'MOVE_BACK_TO_INVENTORY','*','2025-05-15 16:31:08.427000','*TRIAL*T'),(101,3,65,'MOVE_BACK_TO_INVENTORY','30','2025-05-15 16:31:08.440000','Approved'),(102,22,65,'MOVE_BACK_TO_INVENTORY','20','2025-05-15 16:31:08.453000','Approved'),(103,21,65,'MOVE_BACK_TO_INVENTORY','1','2025-05-15 16:31:08.470000','Approved'),(104,3,65,'MOVE_BACK_TO_INVENTORY','20','2025-05-15 16:31:08.483000','Approved'),(105,22,65,'MOVE_BACK_TO_INVENTORY','10','2025-05-15 16:31:08.500000','*TRIAL*T'),(106,3,65,'*TRIAL*TRIAL*TRIAL*TRI','*T','2025-05-15 16:31:08.513000','*TRIAL*T'),(107,21,65,'MOVE_BACK_TO_INVENTORY','4','2025-05-15 16:31:08.527000','*TRIAL*T'),(108,26,65,'MOVE_BACK_TO_INVENTORY','40','2025-05-15 16:31:08.540000','Approved'),(109,27,65,'MOVE_BACK_TO_INVENTORY','85','2025-05-15 16:31:08.550000','Approved'),(110,7,65,'MOVE_BACK_TO_INVENTORY','100','2025-05-15 16:31:08.563000','Approved'),(111,7,66,'MOVE_TO_PANTRY','50','2025-05-15 17:20:39.207000','pending'),(112,22,66,'MOVE_TO_PANTRY','30','2025-05-15 17:20:39.220000','Rejected'),(113,24,66,'MOVE_TO_PANTRY','100','2025-05-15 17:20:39.233000','Rejected'),(114,3,65,'MOVE_TO_PANTRY','11','2025-05-23 13:26:28.727674','pending'),(115,3,65,'MOVE_TO_PANTRY','11','2025-05-23 13:27:44.102303','pending'),(116,3,65,'MOVE_TO_PANTRY','12','2025-05-23 13:29:15.848901','pending'),(117,3,65,'MOVE_TO_PANTRY','14','2025-05-23 13:30:21.532715','pending'),(118,3,65,'MOVE_TO_PANTRY','13','2025-05-23 13:45:23.015756','pending'),(119,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:46:07.597005','pending'),(120,3,65,'MOVE_TO_PANTRY','3','2025-05-23 13:48:13.194674','pending'),(121,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:51:51.961478','pending'),(122,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:54:12.005140','pending'),(123,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:56:41.904721','pending'),(124,3,65,'MOVE_TO_PANTRY','110','2025-05-23 13:57:41.076779','pending'),(125,3,65,'MOVE_TO_PANTRY','110','2025-05-23 13:59:07.987987','pending'),(126,3,65,'MOVE_TO_PANTRY','105','2025-05-23 14:00:10.300622','pending'),(127,3,65,'MOVE_TO_PANTRY','100','2025-05-23 14:01:13.801619','Approved'),(128,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:07:47.847707','pending'),(129,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:08:40.349528','pending'),(130,3,65,'MOVE_TO_PANTRY','10','2025-05-23 14:10:00.375682','pending'),(131,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:10:56.803850','pending'),(132,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:12:08.580351','Approved'),(133,3,66,'MOVE_TO_PANTRY','20','2025-05-23 14:13:43.888280','pending'),(134,3,65,'MOVE_TO_PANTRY','2','2025-05-23 14:14:40.080786','Approved'),(135,3,65,'MOVE_TO_PANTRY','3','2025-05-23 14:27:45.167834','Approved'),(136,3,66,'MOVE_TO_PANTRY','2','2025-05-23 14:28:18.358814','pending');
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(255) NOT NULL,
  `invoice_file_path` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (1,'Inv001','*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TR','2025-05-06 15:36:46.250000'),(2,'inv002','uploads/invoices/1746546349850-sample-invoice.pdf','2025-05-06 21:15:49.880000');
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Rice','kg'),(2,'Cooking Oil','*TRIA'),(3,'Flour','kg'),(4,'*TRIA','*T'),(5,'Salt','kg'),(6,'Milk','litre'),(7,'Eggs','dozen'),(8,'Tomatoes','kg'),(9,'Detergent','litre'),(10,'*TRIAL*TRIAL','unit'),(11,'cake','piece'),(12,'water','pack'),(13,'cutlet','piece'),(14,'cookies','box'),(15,'*TR','*TRIA'),(16,'*TRIAL','*TRIA'),(17,'books','piece');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_records`
--

DROP TABLE IF EXISTS `leave_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `leave_start_date` date DEFAULT NULL,
  `leave_end_date` date DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` varchar(244) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_records`
--

LOCK TABLES `leave_records` WRITE;
/*!40000 ALTER TABLE `leave_records` DISABLE KEYS */;
INSERT INTO `leave_records` VALUES (33,66,'2025-06-03','2025-06-03','Admin','2025-06-03 08:50:22','Admin','2025-06-03 09:11:15');
/*!40000 ALTER TABLE `leave_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_inventory`
--

DROP TABLE IF EXISTS `m_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit` longtext NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `vendor_id` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `userid` int DEFAULT NULL,
  `invoice_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk__m_invento__item___60a75c0f` (`item_id`),
  KEY `fk__m_invento__vendo__619b8048` (`vendor_id`),
  KEY `fk_inventory_invoice` (`invoice_id`),
  CONSTRAINT `fk__m_invento__item___60a75c0f` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `fk__m_invento__vendo__619b8048` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  CONSTRAINT `fk_inventory_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_inventory`
--

LOCK TABLES `m_inventory` WRITE;
/*!40000 ALTER TABLE `m_inventory` DISABLE KEYS */;
INSERT INTO `m_inventory` VALUES (1,1,0,'kg',50.00,1,'2025-05-02 17:08:49.727000',65,1),(2,2,0,'*TRIA',120.50,2,'2025-05-02 17:08:49.727000',65,1),(3,3,55,'kg',40.00,3,'2025-05-02 17:08:49.727000',65,2),(4,4,0,'*T',40.25,1,'2025-05-02 17:08:49.727000',65,2),(5,5,0,'*T',10.00,4,'2025-05-02 17:08:49.727000',65,1),(6,4,0,'*T',40.25,1,'2025-05-02 17:34:57.773000',65,2),(7,4,100,'g',27.00,1,'2025-05-05 12:20:38.320000',66,1),(18,2,0,'litre',33.00,2,'2025-05-06 10:03:53.843000',65,NULL),(21,11,6,'piece',33.00,8,'2025-05-06 12:48:27.280000',65,NULL),(22,6,35,'litre',33.00,4,'2025-05-06 13:07:27.580000',65,NULL),(23,11,0,'piece',33.00,8,'2025-05-06 13:45:53.540000',65,NULL),(24,8,100,'kg',33.00,7,'2025-05-06 14:31:06.680000',65,NULL),(26,13,65,'piece',33.00,7,'2025-05-06 21:44:19.447000',65,NULL),(27,14,85,'box',5.00,7,'2025-05-06 21:44:38.520000',65,NULL),(28,10,0,'*TRI',33.00,6,'2025-05-06 21:44:55.883000',65,NULL),(29,9,0,'litre',5.00,8,'2025-05-06 21:45:54.303000',65,NULL),(30,14,205,'box',33.00,6,'2025-05-07 10:44:05.403000',65,NULL),(32,16,0,'*TRIA',5.00,7,'2025-05-07 17:21:49.723000',65,NULL),(36,2,0,'*TRIA',5.00,7,'2025-05-08 09:48:41.030000',65,NULL),(42,2,0,'litre',33.00,7,'2025-05-08 10:04:14.613000',65,NULL),(43,1,0,'kg',33.00,7,'2025-05-08 17:43:56.923000',65,1);
/*!40000 ALTER TABLE `m_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `trial_created_date_3` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (40,'*TRIA','2024-12-16 06:45:04.000000'),(41,'*TRI','2024-12-16 06:45:04.000000'),(42,'*TRIAL*TR','2024-12-16 06:45:04.000000');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `start_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `trial_end_date_6` date DEFAULT NULL,
  `is_active` bit(1) DEFAULT b'1',
  `created_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` varchar(50) DEFAULT NULL,
  `trial_updated_by_10` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `trial_profileimage_12` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_roles` (`role_id`),
  CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (64,'Admin','*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL',40,'2024-12-17 07:17:26.000000',NULL,_binary '','2024-12-17 07:17:26.000000','*TRIA',NULL,NULL,NULL),(65,'unni','$2a$12$E8yLYvfEey.9TMzAoVrOx.qhiuz2iIKIu0aBd4wy8RULiRoLo0Ffi',40,'2024-12-17 07:17:26.000000',NULL,_binary '','2024-12-17 07:17:26.000000','*TRIA',NULL,NULL,NULL),(66,'Tom','$2b$12$GzD92bwPEDKeS6NS8wrZKOFye8yG8p8kbmBTWe5VFqimlxbgORbxa',41,'2025-05-14 06:32:49.843000',NULL,_binary '','2025-05-14 06:32:49.843000','*TRIA',NULL,'2025-06-03 09:11:15.000000',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `trial_created_at_5` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Fresh Foods Co.','9876543210','*TRIAL*TRIAL*TRIAL*TRI','2025-05-02 17:05:51.380000'),(2,'Kitchen Essentials Ltd.','*TRIAL*TRI','support@kitchenessentials.com','2025-05-02 17:05:51.380000'),(3,'Global Grocers','9988776655','*TRIAL*TRIAL*TRIAL*TRIA','2025-05-02 17:05:51.380000'),(4,'Daily Supply Corp.','9012345678','info@dailysupply.com','2025-05-02 17:05:51.380000'),(5,'Urban Pantry','*TRIAL*TRI','*TRIAL*TRIAL*TRIAL*TR','2025-05-02 17:05:51.380000'),(6,'supreme','88878737373','','2025-05-06 12:32:40.540000'),(7,'*TRI','7288229222','','2025-05-06 12:33:20.727000'),(8,'kunnil','8182828282','','2025-05-06 12:34:02.860000');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitors`
--

DROP TABLE IF EXISTS `visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `visited_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visitor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `purpose_of_visit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `time_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_out` timestamp NULL DEFAULT NULL,
  `card_id` int DEFAULT NULL,
  `security_id` int DEFAULT NULL,
  `checkout_id` int DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `guest_count` int DEFAULT NULL,
  `updated_by` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `card_id` (`card_id`),
  KEY `security_id` (`security_id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitors`
--

LOCK TABLES `visitors` WRITE;
/*!40000 ALTER TABLE `visitors` DISABLE KEYS */;
INSERT INTO `visitors` VALUES (91,'2025-01-07 10:52:15','Test','AQUEGUARD','3333333333','Visit Smita','2025-01-07 16:22:15','2025-05-30 09:13:51',36,68,68,'',0,1,NULL,NULL),(92,'2025-01-07 10:54:33','VISHNU','AQUEGUARD','6282225732','Visit Smita','2025-01-07 16:24:33','2025-05-30 09:15:25',35,68,68,'REPAIR WATERPURIFY AQUE GUARD',0,1,NULL,NULL),(93,'2025-01-07 10:56:06','reshmi mohan','visitor','9895355777','abilash','2025-01-07 16:26:06','2025-05-30 09:15:25',36,68,68,'',0,1,NULL,NULL),(94,'2025-01-07 11:06:58','Abhilash','RBR Solution','9821800003','Visit Smita','2025-01-07 16:36:58','2025-05-30 09:15:25',36,69,69,'',0,3,NULL,NULL),(95,'2025-01-07 11:16:35','vishnulal s p.','interview','8281235181','shyam','2025-01-07 16:46:35','2025-05-30 09:15:25',35,67,67,'',0,1,NULL,NULL),(96,'2025-01-10 08:05:08','karthik','coffee day','7736303602','service','2025-01-10 13:35:08','2025-05-30 09:15:25',35,67,68,'',0,1,NULL,NULL),(97,'2025-01-11 08:21:05','kiran j','pest control','7012815490','service','2025-01-11 13:51:05','2025-05-30 09:15:25',36,67,68,'',0,1,NULL,NULL),(98,'2025-01-11 09:14:47','bindhu','H K F','8921119757','service','2025-01-11 14:44:47','2025-05-30 09:15:25',37,67,68,'',0,1,NULL,NULL),(99,'2025-01-13 05:21:56','Rizna ','interview','8136918804','shyam','2025-01-13 10:51:56','2025-05-30 09:15:25',35,68,68,'interview',0,1,NULL,NULL),(100,'2025-01-13 05:46:47','Ababeel','interview','8921516377','shyam','2025-01-13 11:16:47','2025-05-30 09:15:25',36,68,68,'interview',0,1,NULL,NULL),(101,'2025-01-14 05:45:17','adwaith s','arbor','9895070149','interview','2025-01-14 11:15:17','2025-05-30 09:15:25',35,67,67,'',0,1,NULL,NULL),(102,'2025-01-15 05:13:03','Anjana M N','Interview','9072929344','Interview','2025-01-15 10:43:03','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(103,'2025-01-22 05:48:11','Kanakesh','HI Point Connect','9895925021','Visit Smita/Samy&#039;s Laptop Issue','2025-01-22 11:18:11','2025-05-30 09:15:25',35,68,68,'Laptop service',0,1,'Admin','2025-01-22 16:12:20'),(104,'2025-01-24 05:38:46','Prakash','Hevaco','9567863396','A C Service','2025-01-24 11:08:46','2025-05-30 09:15:25',35,69,69,'',0,3,NULL,NULL),(105,'2025-01-25 05:29:33','Gokul','Rentokil','8138862635','Pest countrol','2025-01-25 10:59:33','2025-05-30 09:15:25',35,68,68,'Pest countrol',0,1,NULL,NULL),(106,'2025-01-25 05:57:01','Abin','Hevaco','7085062782','A/C Maintance','2025-01-25 11:27:01','2025-05-30 09:15:25',35,68,68,'A/C Maintance',0,1,NULL,NULL),(107,'2025-01-28 06:59:39','pradeep','chair service','9847109109','smitha','2025-01-28 12:29:39','2025-05-30 09:15:25',35,67,67,'',0,1,NULL,NULL),(108,'2025-02-03 05:04:46','Sibi','M2','8138833494','Visit Smita','2025-02-03 10:34:46','2025-05-30 09:15:25',35,68,68,'Water Reading',0,1,NULL,NULL),(109,'2025-02-03 05:19:04','Vivek','Arbion','7907157806','Visit Smita','2025-02-03 10:49:04','2025-05-30 09:15:25',35,68,68,'Housekeeping',0,1,NULL,NULL),(110,'2025-02-04 04:20:39','Lewis Tasker','Arbor','8606389644','Guest','2025-02-04 09:50:39','2025-05-30 09:15:25',35,68,69,'Guest',0,1,NULL,NULL),(111,'2025-02-04 05:58:25','Simi','AFC','9061224132','Gayathri','2025-02-04 11:28:25','2025-05-30 09:15:25',36,68,68,'',0,1,NULL,NULL),(112,'2025-02-05 04:08:11','Lewis Tasker','Arbor','8606389644','Guest','2025-02-05 09:38:11','2025-05-30 09:15:25',35,69,68,'Laptop',0,1,NULL,NULL),(113,'2025-02-06 03:49:17','Lewis Tasker','Arbor','8606389644','Guest','2025-02-06 09:19:17','2025-05-30 09:15:25',35,68,69,'Guest',0,1,NULL,NULL),(114,'2025-02-06 07:03:56','Aditi R ','Mitara','9895114581','shyam','2025-02-06 12:33:56','2025-05-30 09:15:25',36,68,68,'',0,1,NULL,NULL),(115,'2025-02-06 12:32:11','Lintu','Rentokil','8956077547','Air fershner Service','2025-02-06 18:02:11','2025-05-30 09:15:25',36,69,69,'',0,2,NULL,NULL),(116,'2025-02-07 05:11:02','Lewis Tasker','Arbor','8606398644','Guest','2025-02-07 10:41:02','2025-05-30 09:15:25',35,68,66,'Guest',0,1,NULL,NULL),(117,'2025-02-08 08:33:19','kiran ','Rentokil','7012845490','Pest control','2025-02-08 14:03:19','2025-05-30 09:15:25',35,68,68,'Pest control',0,1,NULL,NULL),(118,'2025-02-14 07:34:22','karthik','coffee day','7736303607','Coffee mechine service','2025-02-14 13:04:22','2025-05-30 09:15:25',35,68,68,'Coffee mechine service',0,1,NULL,NULL),(119,'2025-02-17 10:37:55','Sreejith','ICICI Bank','7736863524','Gayathri','2025-02-17 16:07:55','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(120,'2025-02-19 04:27:04','Vivek','Arbion','7907157806','Visit Smita','2025-02-19 09:57:04','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(121,'2025-02-19 05:22:01','Madhu j','Technopark','9387375329','Visit Smita','2025-02-19 10:52:01','2025-05-30 09:15:25',35,68,68,'Fire and Sefty traning',0,1,NULL,NULL),(122,'2025-02-20 06:25:55','Sayanth','Tech Mastors','9846422221','shyam','2025-02-20 11:55:55','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(123,'2025-02-22 07:09:27','Gokul','Rentokil','8138862635','Pest control','2025-02-22 12:39:27','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(124,'2025-02-24 11:34:17','heedstan','arbion','9061006622','Visit Smita','2025-02-24 17:04:17','2025-05-30 09:15:25',35,67,67,'',0,2,NULL,NULL),(125,'2025-02-25 05:59:26','Vivek','Arbion','7907157806','Visit Smita','2025-02-25 11:29:26','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(126,'2025-02-25 07:30:31','Murali','Greenplacement','9447411454','Visit Smita','2025-02-25 13:00:31','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(127,'2025-02-27 07:50:42','Amal','Hevaco','8590421213','A/C Maintance','2025-02-27 13:20:42','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(128,'2025-03-01 08:04:32','Rajeev','Noster','9995637791','Pantry water pipe repairing','2025-03-01 13:34:32','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(129,'2025-03-03 05:23:11','Sushil','SNIQSYS','9895209214','shyam','2025-03-03 10:53:11','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(130,'2025-03-03 06:59:05','Sibi','M2','8138833494','Water reading','2025-03-03 12:29:05','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(131,'2025-03-07 05:28:39','Revathy','Greenplacement','9995561645','H/K Supervicer','2025-03-07 10:58:39','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(132,'2025-03-08 06:36:25','kiran ','Rentokil','7012845490','Pest control','2025-03-08 12:06:25','2025-05-30 09:15:25',35,68,68,'Pest control',0,1,NULL,NULL),(133,'2025-03-12 08:36:23','karthik','coffee day','7736303607','Coffee mechine service','2025-03-12 14:06:23','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(134,'2025-03-17 05:17:03','Josli','interview','8714532170','interview','2025-03-17 10:47:03','2025-05-30 09:15:25',35,68,68,'interview',0,1,NULL,NULL),(135,'2025-03-18 07:41:09','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-18 13:11:09','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(136,'2025-03-19 05:23:34','Jithin','Giltech','8589995562','Visit Smita','2025-03-19 10:53:34','2025-05-30 09:15:25',35,68,68,'Peppar gilt repairing',0,1,NULL,NULL),(137,'2025-03-19 08:07:20','Vibin','Tamara','6282961971','Visit Smita','2025-03-19 13:37:20','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(138,'2025-03-20 05:19:29','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-20 10:49:29','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(139,'2025-03-24 05:49:16','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-24 11:19:16','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(140,'2025-03-25 05:45:38','Sneha','ICICI Bank','8655980225','Gayathri','2025-03-25 11:15:38','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(141,'2025-03-29 06:25:30','Vinod','V S A','9995712232','Measuring','2025-03-29 11:55:30','2025-05-30 09:15:25',36,69,69,'',0,1,NULL,NULL),(142,'2025-03-29 07:20:28','kiran ','Rentokil','7012845490','Pest control','2025-03-29 12:50:28','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(143,'2025-04-01 07:23:40','sibi','M2','8138833494','water reading','2025-04-01 12:53:40','2025-05-30 09:15:25',35,67,67,'',0,2,NULL,NULL),(144,'2025-04-02 12:49:34','Shinto','M2','9349769667','Electrical','2025-04-02 18:19:34','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(145,'2025-04-05 06:18:22','kiran ','Rentokil','7012845490','Pest control','2025-04-05 11:48:22','2025-05-30 09:15:25',36,69,69,'',0,1,NULL,NULL),(146,'2025-04-07 10:17:00','Sibi','M2','9778688275','ACchecking','2025-04-07 15:47:00','2025-05-30 09:15:25',35,69,68,'',0,1,NULL,NULL),(147,'2025-04-09 05:58:36','VISHNU','AQUEGUARD','6282225738','AQUEGUARD SERVCE','2025-04-09 11:28:36','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(148,'2025-04-09 07:22:13','Sreeju','Rentokil','8485093644','Air fershner Service','2025-04-09 12:52:13','2025-05-30 09:15:25',35,68,68,'',0,2,NULL,NULL),(149,'2025-04-10 06:45:16','karthik','coffee day','7736303607','Coffee mechine service','2025-04-10 12:15:16','2025-05-30 09:15:25',35,68,68,'Coffee mechine service',0,1,NULL,NULL),(150,'2025-04-16 05:40:38','Revathy','Greenplacement','9995567645','Visit Smita','2025-04-16 11:10:38','2025-05-30 09:15:25',35,68,68,'',0,1,NULL,NULL),(151,'2025-04-22 09:33:56','Sibi','M square','9778688275','plumbing','2025-04-22 15:03:56','2025-05-30 09:15:25',35,69,69,'',0,4,NULL,NULL),(152,'2025-04-24 05:36:42','Simi','AFC','9061224132','Gayathri','2025-04-24 11:06:42','2025-05-30 09:15:25',35,68,69,'',0,1,NULL,NULL),(153,'2025-04-25 04:29:57','Kanakesh','HI Point ','9895925021','net work checking','2025-04-25 09:59:57','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(154,'2025-05-01 05:59:15','Shinto','M2','9349769667','Water reading','2025-05-01 11:29:15','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(155,'2025-05-03 06:18:02','Kanakesh','HI Point ','9895925021','net work checking','2025-05-03 11:48:02','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(156,'2025-05-08 08:08:52','karthik','coffee day','7736303607','Coffee mechine service','2025-05-08 13:38:52','2025-05-30 09:15:25',35,69,69,'',0,1,NULL,NULL),(157,'2025-05-12 05:25:20','Thushara','Praanaa','8075395651','shyam','2025-05-12 10:55:20','2025-05-30 09:15:25',37,69,69,'',0,1,NULL,NULL),(158,'2025-05-12 08:18:48','Anoop','ICICI Bank','8075811854','George','2025-05-12 13:48:48','2025-05-30 09:15:25',36,69,69,'',0,2,NULL,NULL),(159,'2025-05-12 10:28:48','Thosiya','Arbor','7560816869','interview','2025-05-12 15:58:48','2025-05-30 09:15:25',36,69,69,'',0,1,NULL,NULL),(160,'2025-05-14 12:10:25','faizal','thomascook','9744208040','Gayathri','2025-05-14 17:40:25','2025-05-30 09:15:25',36,67,67,'',0,1,NULL,NULL),(161,'2025-05-21 09:58:37','kavin','Interview','8281862590','interview','2025-05-21 15:28:37','2025-05-30 09:15:25',37,67,67,'',0,1,NULL,NULL),(162,'2025-05-22 08:25:40','Abhishek','HI Point ','8078983484','service','2025-05-22 13:55:40','2025-05-30 09:15:25',37,69,69,'',0,1,NULL,NULL),(163,'2025-05-24 10:01:29','Prashanth ','Rentokil','9995688875','Pest control','2025-05-24 15:31:29','2025-05-30 09:38:48',37,68,68,'',0,1,NULL,NULL),(164,'2025-05-30 10:29:18','unni','arbor','9999999999','test','2025-05-30 15:59:18','2025-05-30 10:34:36',35,NULL,NULL,'',0,1,NULL,NULL),(165,'2025-05-30 10:34:55','test','arbor','9999999999','test','2025-05-30 16:04:55','2025-05-30 10:36:55',36,NULL,NULL,'11',0,3,NULL,NULL),(166,'2025-05-30 10:37:10','test','arbor','9999999999','test','2025-05-30 16:07:10','2025-05-30 11:07:47',35,NULL,65,'11',0,0,NULL,NULL),(167,'2025-05-30 11:13:12','test','arbor','9999999999','fvfv','2025-05-30 16:43:12','2025-05-30 11:17:56',36,65,65,'',0,4,NULL,NULL),(168,'2025-05-30 11:18:10','test','arbor','9999999999','fvfv','2025-05-30 16:48:10','2025-05-30 11:18:24',35,65,65,'',0,0,NULL,NULL),(169,'2025-06-02 06:44:10','test','arbor','9999999999','test','2025-06-02 12:14:10','2025-06-02 06:51:53',35,65,65,'xxxxx',0,3,NULL,NULL),(170,'2025-06-02 06:59:05','test','arbor','9999999999','test','2025-06-02 12:29:05','2025-06-02 07:12:04',36,65,65,'xxxxx',0,0,NULL,NULL),(171,'2025-06-02 07:12:23','test','arbor','9999999999','test','2025-06-02 12:42:23','2025-06-02 07:21:44',37,65,65,'xxxxx',0,3,NULL,NULL),(172,'2025-06-02 07:25:29','test','arbor','9999999999','test','2025-06-02 12:55:29','2025-06-02 07:25:47',36,65,65,'11',0,2,NULL,NULL),(173,'2025-06-02 07:25:58','test','arbor','9999999999','test','2025-06-02 12:55:58','2025-06-02 07:26:33',37,65,65,'11',0,0,NULL,NULL),(174,'2025-06-02 10:37:46','test','arbor','9999999999','test','2025-06-02 16:07:46','2025-06-02 10:50:00',37,65,65,'11',0,1,NULL,NULL),(175,'2025-06-02 10:48:43','unni','arbor','9999999999','test','2025-06-02 16:18:43','2025-06-02 10:49:56',35,65,65,'11',0,1,NULL,NULL),(176,'2025-06-02 10:50:12','unni','arbor','9999999999','test','2025-06-02 16:20:12',NULL,37,65,NULL,'11',1,0,NULL,NULL);
/*!40000 ALTER TABLE `visitors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-03 10:24:48
