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
-- Table structure for table `approval_logs`
--

DROP TABLE IF EXISTS `approval_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `stage` varchar(50) DEFAULT NULL,
  `comment` text,
  `acted_by` int DEFAULT NULL,
  `acted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_logs`
--

LOCK TABLES `approval_logs` WRITE;
/*!40000 ALTER TABLE `approval_logs` DISABLE KEYS */;
INSERT INTO `approval_logs` VALUES (1,'EXPENSE',24,'REJECTED','RFQ_SUBMITTED','for test',77,'2026-02-26 15:59:23'),(2,'EXPENSE',23,'REJECTED','RFQ_RECOMMENDED_DM','testing 2',75,'2026-02-26 16:20:03'),(3,'EXPENSE',8,'REJECTED','QUOTE_REVIEW_DM','no needed',77,'2026-02-26 17:49:23'),(4,'EXPENSE',25,'REJECTED','QUOTE_APPROVAL_CH','not good',75,'2026-02-27 10:54:32'),(5,'EXPENSE',19,'REJECTED','QUOTE_REVIEW_DM','tesing quote',77,'2026-02-27 15:32:23'),(6,'EXPENSE',38,'REJECTED','PO_REVIEW_DM','tetsing reject po',77,'2026-03-05 13:53:07'),(7,'EXPENSE',42,'APPROVED','RFQ_RECOMMENDED_DM','good choice',75,'2026-03-09 10:36:28'),(8,'EXPENSE',14,'APPROVED','QUOTE_APPROVAL_CH','good quote',75,'2026-03-09 11:14:20'),(9,'EXPENSE',43,'REJECTED','RFQ_SUBMITTED','rejected',77,'2026-03-09 11:58:26'),(10,'EXPENSE',44,'APPROVED','RFQ_RECOMMENDED_DM','testing',75,'2026-03-09 12:11:28'),(11,'EXPENSE',44,'APPROVED','QUOTE_APPROVAL_CH','testig',75,'2026-03-09 12:19:17'),(12,'EXPENSE',46,'APPROVED','RFQ_RECOMMENDED_DM','good one',77,'2026-03-09 16:26:13');
/*!40000 ALTER TABLE `approval_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `action_by` int NOT NULL,
  `role_at_action` varchar(100) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `remarks` text,
  `previous_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rejection_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `action_by` (`action_by`),
  CONSTRAINT `approvals_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expense_requests` (`id`),
  CONSTRAINT `approvals_ibfk_2` FOREIGN KEY (`action_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `AssetID` int NOT NULL AUTO_INCREMENT,
  `AssetCode` varchar(30) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `TypeID` int DEFAULT NULL,
  `SubClassID` int DEFAULT NULL,
  `SerialNumber` varchar(50) DEFAULT NULL,
  `PictureURL` varchar(2083) DEFAULT NULL,
  `SupplierID` int DEFAULT NULL,
  `PurchaseDate` date DEFAULT NULL,
  `IsPurchased` bit(1) DEFAULT NULL,
  `InitialValue` decimal(10,2) DEFAULT NULL,
  `DepreciationStartDate` date DEFAULT NULL,
  `NumberOfYears` int DEFAULT NULL,
  `DepreciationRate` decimal(5,2) DEFAULT NULL,
  `CurrentValue` decimal(10,2) DEFAULT NULL,
  `DepreciationEndDate` date DEFAULT NULL,
  `LocationID` int DEFAULT NULL,
  `AssignedTo` int DEFAULT NULL,
  `WriteOff` bit(1) DEFAULT NULL,
  `WriteOffReason` varchar(255) DEFAULT NULL,
  `DeptID` int DEFAULT NULL,
  `wifi_mac_address` varchar(50) DEFAULT NULL,
  `ethernet_mac_address` varchar(50) DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `created_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `inventory_id` int DEFAULT NULL,
  `ID_No` varchar(25) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `InvoiceID` varchar(10) DEFAULT NULL,
  `last_verified_at` datetime DEFAULT NULL,
  `last_verified_by` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  `model_id` int DEFAULT NULL,
  PRIMARY KEY (`AssetID`),
  UNIQUE KEY `AssetCode` (`AssetCode`),
  UNIQUE KEY `SerialNumber` (`SerialNumber`),
  UNIQUE KEY `AssetCode_2` (`AssetCode`),
  UNIQUE KEY `SerialNumber_2` (`SerialNumber`),
  KEY `TypeID` (`TypeID`),
  KEY `SubClassID` (`SubClassID`),
  KEY `LocationID` (`LocationID`),
  KEY `DeptID` (`DeptID`),
  KEY `AssignedTo` (`AssignedTo`),
  KEY `fk_asset_item` (`item_id`),
  KEY `fk_asset_inventory` (`inventory_id`),
  CONSTRAINT `asset_ibfk_1` FOREIGN KEY (`TypeID`) REFERENCES `assettype` (`TypeID`),
  CONSTRAINT `asset_ibfk_2` FOREIGN KEY (`SubClassID`) REFERENCES `subclasstype` (`SubClassID`),
  CONSTRAINT `asset_ibfk_3` FOREIGN KEY (`LocationID`) REFERENCES `location` (`LocationID`),
  CONSTRAINT `asset_ibfk_4` FOREIGN KEY (`DeptID`) REFERENCES `department` (`DeptID`),
  CONSTRAINT `asset_ibfk_5` FOREIGN KEY (`AssignedTo`) REFERENCES `staff` (`StaffID`),
  CONSTRAINT `fk_asset_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `m_inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_asset_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (3,'123455',NULL,1,NULL,'7367646764',NULL,NULL,'2025-06-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ndjfjbfjfhhf','jhejfhdjhfhf',20,'2025-07-02 13:16:22.653454',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(5,'12345556',NULL,1,NULL,'DL12345ABCt',NULL,NULL,'2025-08-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'232323327','65656557',20,'2025-08-04 12:57:35.081932',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(6,'12345556d',NULL,1,NULL,'DL12345ABCd',NULL,NULL,'2025-08-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,'23232332','23233223',20,'2025-08-04 17:46:47.381504',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(7,'12111111',NULL,3,NULL,'11111111111111',NULL,NULL,'2025-08-04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,'777777888777','5554444333335',21,'2025-08-05 09:50:28.092594',NULL,NULL,NULL,72,NULL,NULL,NULL,0,NULL,NULL,NULL),(8,'ASSET008',NULL,2,NULL,'',NULL,NULL,'2025-07-31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL,NULL,'','',22,'2025-08-05 11:09:40.749485',NULL,'',NULL,72,NULL,NULL,NULL,0,NULL,NULL,NULL),(13,'ASSET09',NULL,1,NULL,'7',NULL,NULL,'2025-08-02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',22,'2025-08-05 11:10:59.366571',NULL,'',NULL,72,NULL,NULL,NULL,0,NULL,NULL,NULL),(15,'ASSET10',NULL,1,NULL,NULL,NULL,NULL,'2025-08-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,'2025-08-05 11:26:45.394957',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(30,'ASSET099',NULL,1,NULL,'DL12345ABCdee',NULL,NULL,'2025-10-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'23232332','23233223',21,'2025-10-16 16:13:59.265371',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(33,'CH01',NULL,1,NULL,'129090',NULL,NULL,'2025-10-16',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,'','',23,'2025-10-17 13:21:47.180957',NULL,'',72,72,NULL,'2025-11-17 17:16:47',72,0,NULL,NULL,NULL),(34,'CHO2','chair',2,NULL,'ADOBE2021XYee',NULL,NULL,'2025-10-24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,16,NULL,NULL,NULL,'','',23,'2025-10-21 10:29:08.287474',NULL,'',72,72,NULL,NULL,NULL,0,NULL,NULL,NULL),(35,'CHO4','dsdsdsd',1,NULL,'ADOBE2021XYeedd',NULL,NULL,'2025-10-21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,23,'2025-10-21 14:34:56.869644',NULL,'dddwdwsds',72,72,NULL,'2025-11-14 14:18:51',72,0,NULL,NULL,NULL),(36,'test asset tag','ssss',1,NULL,'test serial number',NULL,NULL,'2025-10-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sss','sss',20,'2025-10-21 14:54:41.817206',NULL,'12233234',72,72,'14',NULL,NULL,1,'2025-11-18 12:50:44','72',NULL),(37,'ch06',NULL,1,NULL,'12098347',NULL,NULL,'2025-10-21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,'5tfgfgfg','243434',23,'2025-10-23 10:25:15.905034',NULL,'',72,72,'21','2025-11-14 17:58:47',72,0,NULL,NULL,NULL),(38,'B01',NULL,2,NULL,'DL12345ABFHFK',NULL,NULL,'2025-10-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,16,NULL,NULL,NULL,'DJDJDJJDjjjdfdf','rtryrytyty',21,'2025-10-28 11:10:12.308408',NULL,'334434343',72,72,'20','2025-11-14 17:42:08',72,1,'2025-11-18 12:48:03',NULL,NULL),(42,'INT/LAP/2023-24/D0026',NULL,1,NULL,'1244667888998',NULL,NULL,'2025-11-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,40,NULL,NULL,NULL,'WIFI12636','65656557d',20,'2025-11-17 10:09:49.762838',NULL,'123445677887535',72,72,'24','2025-11-18 14:16:57',72,0,NULL,NULL,NULL),(44,'ARB/MON/2025-26/E0017',NULL,1,NULL,'DL12345ABFHFK4',NULL,NULL,'2025-11-18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,18,NULL,NULL,NULL,'12988778',NULL,20,'2025-11-17 18:04:47.491585',NULL,'1234456778876D',72,72,NULL,'2025-11-17 18:22:04',72,1,'2025-11-18 12:47:53',NULL,NULL),(46,'TEST/01',NULL,1,NULL,'ADOBE2021',NULL,NULL,'2025-11-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,'WIFI1263644',NULL,20,'2025-11-19 14:32:22.823039',NULL,'1234456',72,NULL,NULL,'2025-11-19 16:03:59',72,0,NULL,NULL,NULL),(47,'TEST/02',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,22,'2025-11-19 14:34:17.689723',NULL,NULL,72,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(48,'TEST/03',NULL,2,NULL,'122323',NULL,NULL,'2025-11-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-19 14:37:36.202509',NULL,NULL,72,72,NULL,NULL,NULL,0,NULL,NULL,NULL),(49,'TEST04',NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,'11222233445',NULL,20,'2025-11-19 14:40:42.892954',NULL,NULL,72,72,NULL,NULL,NULL,0,NULL,NULL,3),(50,'IND/202511/LAP/0001',NULL,1,NULL,NULL,NULL,NULL,'2025-11-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,'122233',NULL,20,'2025-11-19 15:37:43.974038',NULL,NULL,72,72,NULL,'2026-01-30 15:35:02',72,0,NULL,NULL,3),(51,NULL,NULL,2,NULL,'DL12345AB123',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-19 15:38:16.801799',NULL,NULL,72,72,NULL,NULL,NULL,1,'2025-11-20 17:40:26','72',3),(52,'IND/202511/LAP/0003',NULL,2,NULL,NULL,NULL,NULL,'2025-11-24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-20 18:25:17.017034',NULL,NULL,72,NULL,NULL,NULL,NULL,0,NULL,NULL,3),(53,'IND/202511/LAP/0010',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-21 14:31:49.335919',NULL,NULL,72,NULL,NULL,NULL,NULL,0,NULL,NULL,3),(54,'IND/202511/null/0100',NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,22,'2025-11-21 14:32:19.832924',NULL,NULL,72,NULL,NULL,NULL,NULL,0,NULL,NULL,1),(55,'IND/202511/LAP/1000',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-21 14:32:44.896715',NULL,NULL,72,NULL,'23','2026-01-30 11:19:59',72,0,NULL,NULL,4),(56,'IND/202511/LAP/10000',NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-21 14:33:08.757344',NULL,NULL,72,NULL,'23','2026-01-30 17:21:38',72,0,NULL,NULL,3),(57,'IND/202511/LAP/10001',NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,20,'2025-11-21 14:37:31.579107',NULL,NULL,72,NULL,'24','2026-02-13 15:47:42',72,0,NULL,NULL,3);
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_audit_log`
--

DROP TABLE IF EXISTS `asset_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_audit_log` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `item_id` int DEFAULT NULL,
  `TypeID` int DEFAULT NULL,
  `AssetCode` varchar(255) DEFAULT NULL,
  `SerialNumber` varchar(255) DEFAULT NULL,
  `ID_No` varchar(255) DEFAULT NULL,
  `PurchaseDate` date DEFAULT NULL,
  `wifi_mac_address` varchar(255) DEFAULT NULL,
  `ethernet_mac_address` varchar(255) DEFAULT NULL,
  `AssignedTo` int DEFAULT NULL,
  `LocationID` int DEFAULT NULL,
  `Description` text,
  `InvoiceID` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `changed_by` int DEFAULT NULL,
  `changed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `change_action` enum('UPDATE','DELETE') DEFAULT 'UPDATE',
  PRIMARY KEY (`audit_id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `asset_audit_log_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`AssetID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_audit_log`
--

LOCK TABLES `asset_audit_log` WRITE;
/*!40000 ALTER TABLE `asset_audit_log` DISABLE KEYS */;
INSERT INTO `asset_audit_log` VALUES (1,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjj','rtryrytyty',1,9,NULL,21,72,'2025-11-10 16:22:48',72,'2025-11-10 16:22:48','UPDATE'),(2,37,23,1,'ch06','12098347','','2025-10-21','','',NULL,9,NULL,21,72,'2025-11-10 16:27:23',72,'2025-11-10 16:27:23','UPDATE'),(3,37,23,1,'ch06','12098347','','2025-10-21','hvdhvfdf','dfdfdfx',NULL,9,NULL,21,72,'2025-11-10 16:27:39',72,'2025-11-10 16:27:39','UPDATE'),(4,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',NULL,9,NULL,21,72,'2025-11-11 17:20:04',72,'2025-11-11 17:20:04','UPDATE'),(5,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',15,9,NULL,21,72,'2025-11-11 17:25:23',72,'2025-11-11 17:25:23','UPDATE'),(6,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',16,9,NULL,21,72,'2025-11-11 17:31:51',72,'2025-11-11 17:31:51','UPDATE'),(7,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',16,9,NULL,20,72,'2025-11-11 17:41:05',72,'2025-11-11 17:41:05','UPDATE'),(8,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',16,7,NULL,20,72,'2025-11-11 17:49:19',72,'2025-11-11 17:49:19','UPDATE'),(9,42,20,1,'INT/LAP/2023-24/D0026','12446678889','1234456778876','2025-11-17',NULL,NULL,40,6,NULL,NULL,72,'2025-11-17 17:05:59',72,'2025-11-17 17:05:59','UPDATE'),(10,42,20,1,'INT/LAP/2023-24/D0026','12446678889','1234456778876','2025-11-17','DJDJDJJDjjj','',40,6,NULL,NULL,72,'2025-11-17 17:06:31',72,'2025-11-17 17:06:31','UPDATE'),(11,42,20,1,'INT/LAP/2023-24/D0026','12446678889','1234456778876','2025-11-17','WIFI12636','',40,6,NULL,NULL,72,'2025-11-17 17:07:48',72,'2025-11-17 17:07:48','UPDATE'),(12,44,20,1,'ARB/MON/2025-26/E0017','DL12345ABFHFK4','1234456778876',NULL,NULL,NULL,NULL,9,NULL,NULL,72,'2025-11-17 18:32:17',72,'2025-11-17 18:32:17','UPDATE'),(13,34,23,2,'CHO2','ADOBE2021XYee','','2025-10-18','','',NULL,NULL,'chair',NULL,72,'2025-11-17 18:34:13',72,'2025-11-17 18:34:13','UPDATE'),(14,44,20,1,'ARB/MON/2025-26/E0017','DL12345ABFHFK4','1234456778876d','2025-11-18','','',18,9,NULL,NULL,72,'2025-11-17 18:44:22',72,'2025-11-17 18:44:22','UPDATE'),(15,42,20,1,'INT/LAP/2023-24/D0026','1244667888998','123445677887535','2025-11-17','WIFI12636','',40,6,NULL,NULL,72,'2025-11-17 18:56:20',72,'2025-11-17 18:56:20','UPDATE'),(16,44,20,1,'ARB/MON/2025-26/E0017','DL12345ABFHFK4','1234456778876D','2025-11-18','','',18,9,NULL,NULL,72,'2025-11-17 18:56:37',72,'2025-11-17 18:56:37','UPDATE'),(17,36,20,1,'test asset tag','test serial number','','2025-10-20','sss','sss',NULL,NULL,'ssss',14,72,'2025-11-17 19:09:09',72,'2025-11-17 19:09:09','UPDATE'),(18,42,20,1,'INT/LAP/2023-24/D0026','1244667888998','123445677887535','2025-11-17','WIFI12636','65656557d',40,6,NULL,NULL,72,'2025-11-18 11:56:45',72,'2025-11-18 11:56:45','UPDATE'),(19,51,20,2,'IND/202511/LAP/0002',NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,72,'2025-11-20 17:28:35',72,'2025-11-20 17:28:35','UPDATE'),(20,50,20,1,'IND/202511/LAP/0001',NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,72,'2025-11-20 17:32:27',72,'2025-11-20 17:32:27','UPDATE'),(21,49,20,2,'TEST04',NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,72,'2025-11-20 17:32:40',72,'2025-11-20 17:32:40','UPDATE'),(22,48,20,2,'TEST/03',NULL,NULL,'2025-11-19',NULL,NULL,NULL,9,NULL,NULL,72,'2025-11-20 17:36:41',72,'2025-11-20 17:36:41','UPDATE'),(23,50,20,1,'IND/202511/LAP/0001',NULL,NULL,NULL,'122233',NULL,NULL,9,NULL,NULL,72,'2025-11-20 18:24:18',72,'2025-11-20 18:24:18','UPDATE'),(24,50,20,1,'IND/202511/LAP/0001',NULL,NULL,'2025-11-20','122233',NULL,NULL,9,NULL,NULL,72,'2025-11-20 18:24:34',72,'2025-11-20 18:24:34','UPDATE'),(25,7,21,3,'12111111','11111111111111',NULL,'2025-08-04','777777888777','5554444333335',3,NULL,NULL,NULL,72,'2025-11-21 14:15:14',72,'2025-11-21 14:15:14','UPDATE');
/*!40000 ALTER TABLE `asset_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_sequence`
--

DROP TABLE IF EXISTS `asset_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_sequence` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seq` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_sequence`
--

LOCK TABLES `asset_sequence` WRITE;
/*!40000 ALTER TABLE `asset_sequence` DISABLE KEYS */;
INSERT INTO `asset_sequence` VALUES (1,5);
/*!40000 ALTER TABLE `asset_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_transactions`
--

DROP TABLE IF EXISTS `asset_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `remarks` text,
  `transaction_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `LocationID` int DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `fk_asset` (`asset_id`),
  KEY `fk_location` (`LocationID`),
  KEY `fk_created_by_staff` (`employee_id`),
  KEY `fk_created_by` (`created_by`),
  CONSTRAINT `fk_asset` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`AssetID`),
  CONSTRAINT `fk_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_employee` FOREIGN KEY (`employee_id`) REFERENCES `staff` (`StaffID`),
  CONSTRAINT `fk_location` FOREIGN KEY (`LocationID`) REFERENCES `location` (`LocationID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_transactions`
--

LOCK TABLES `asset_transactions` WRITE;
/*!40000 ALTER TABLE `asset_transactions` DISABLE KEYS */;
INSERT INTO `asset_transactions` VALUES (2,5,4,'REASSIGN','Asset reassigned','2025-08-04 09:59:05',65,1),(3,13,2,'REASSIGN','Asset reassigned','2025-08-05 05:41:27',65,1),(5,15,3,'REASSIGN','Asset reassigned','2025-08-05 06:00:58',65,1),(6,8,4,'REASSIGN','Asset reassigned','2025-08-05 06:01:18',65,1),(7,7,3,'REASSIGN','REASSIGN','2025-08-05 06:28:08',65,1),(8,6,3,'ASSIGN','ASSIGN','2025-08-05 06:32:49',65,1),(9,3,1,'ASSIGN','ASSIGN','2025-08-05 10:14:25',65,1),(12,15,3,'UNASSIGN','Asset unassigned','2025-08-05 10:24:32',65,1),(13,5,4,'UNASSIGN','Asset unassigned','2025-08-06 12:25:30',65,1),(14,8,4,'ASSIGN','ASSIGN','2025-08-06 12:26:07',65,1),(16,8,4,'RELOCATE','Asset moved to another location','2025-10-17 09:11:07',72,1),(17,30,4,'UNASSIGN','Asset unassigned','2025-10-17 09:35:05',72,1),(18,33,NULL,'UNASSIGN','Asset unassigned and removed from location','2025-10-17 09:35:51',72,1),(19,33,NULL,'RELOCATE','Asset moved to another location','2025-10-21 04:50:44',72,3),(20,34,2,'REASSIGN','Reassigned to another staff','2025-10-21 04:59:17',72,NULL),(21,13,1,'REASSIGN','Reassigned to another staff','2025-10-21 04:59:25',72,NULL),(22,34,2,'RELOCATE','Asset moved to another location','2025-10-21 08:39:54',72,2),(23,35,1,'ASSIGN','Initial assignment to staff','2025-10-21 09:04:56',72,3),(24,36,3,'ASSIGN','Initial assignment to staff','2025-10-21 09:24:41',72,2),(25,13,1,'UNASSIGN','Asset unassigned','2025-10-22 04:53:20',72,1),(26,36,3,'UNASSIGN','Asset unassigned and removed from location','2025-10-22 05:26:06',72,2),(27,34,2,'UNASSIGN','Asset unassigned and removed from location','2025-10-22 05:26:09',72,2),(28,35,1,'UNASSIGN','Asset unassigned and removed from location','2025-10-28 04:41:10',72,3),(29,38,1,'REASSIGN','Reassigned to another staff','2025-10-28 05:49:30',72,9),(30,38,1,'UNASSIGN','Asset unassigned','2025-11-11 05:39:07',72,1),(31,42,40,'ASSIGN','Initial assignment to staff','2025-11-17 04:39:49',72,6),(32,7,3,'UNASSIGN','Asset unassigned','2025-11-21 08:45:27',72,1);
/*!40000 ALTER TABLE `asset_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_verifications`
--

DROP TABLE IF EXISTS `asset_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `verified_by` int NOT NULL,
  `verified_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_unverify` tinyint(1) NOT NULL DEFAULT '0',
  `notes` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `verified_by` (`verified_by`),
  CONSTRAINT `asset_verifications_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`AssetID`),
  CONSTRAINT `asset_verifications_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_verifications`
--

LOCK TABLES `asset_verifications` WRITE;
/*!40000 ALTER TABLE `asset_verifications` DISABLE KEYS */;
INSERT INTO `asset_verifications` VALUES (6,35,72,'2025-11-14 14:18:51',0,NULL),(8,38,72,'2025-11-14 17:42:08',0,NULL),(9,37,72,'2025-11-14 17:58:47',0,NULL),(10,42,72,'2025-11-17 10:40:20',0,NULL),(11,42,72,'2025-11-17 10:45:46',0,NULL),(12,42,72,'2025-11-17 17:13:57',0,NULL),(13,33,72,'2025-11-17 17:16:47',0,NULL),(14,42,72,'2025-11-17 17:20:42',0,NULL),(15,44,72,'2025-11-17 18:15:42',0,NULL),(16,44,72,'2025-11-17 18:22:04',0,NULL),(17,42,72,'2025-11-18 14:16:57',0,NULL),(18,46,72,'2025-11-19 16:03:59',0,NULL),(19,50,72,'2025-11-19 16:19:05',0,NULL),(20,50,72,'2025-11-19 16:20:11',0,NULL),(21,50,72,'2025-11-19 16:20:19',1,NULL),(22,57,72,'2025-11-24 16:19:22',0,NULL),(23,56,72,'2026-01-29 16:01:42',0,NULL),(24,55,72,'2026-01-29 16:22:44',0,NULL),(25,57,72,'2026-01-30 11:09:54',0,NULL),(26,55,72,'2026-01-30 11:19:59',0,NULL),(27,57,72,'2026-01-30 14:46:23',0,NULL),(28,50,72,'2026-01-30 14:55:00',0,NULL),(29,50,72,'2026-01-30 15:01:22',0,NULL),(30,50,72,'2026-01-30 15:17:38',0,NULL),(31,50,72,'2026-01-30 15:27:11',0,'Testing1'),(32,50,72,'2026-01-30 15:33:06',0,NULL),(33,50,72,'2026-01-30 15:35:02',0,NULL),(34,56,72,'2026-01-30 17:21:38',0,'verification done'),(35,57,72,'2026-01-30 17:29:56',0,NULL),(36,57,72,'2026-01-30 17:29:58',1,NULL),(37,57,72,'2026-02-13 15:47:42',0,NULL);
/*!40000 ALTER TABLE `asset_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assettype`
--

DROP TABLE IF EXISTS `assettype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assettype` (
  `TypeID` int NOT NULL AUTO_INCREMENT,
  `TypeCode` varchar(8) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDeleted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`TypeID`),
  UNIQUE KEY `TypeCode` (`TypeCode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assettype`
--

LOCK TABLES `assettype` WRITE;
/*!40000 ALTER TABLE `assettype` DISABLE KEYS */;
INSERT INTO `assettype` VALUES (1,'FIN','Financial Asset',_binary '\0'),(2,'INT','Intangible Asset',_binary '\0'),(3,'TAN','Tangible Asset',_binary '\0');
/*!40000 ALTER TABLE `assettype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `allocated` decimal(12,2) DEFAULT NULL,
  `spent` decimal(12,2) DEFAULT NULL,
  `committed` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgets`
--

LOCK TABLES `budgets` WRITE;
/*!40000 ALTER TABLE `budgets` DISABLE KEYS */;
INSERT INTO `budgets` VALUES (1,'Assets',2500000.00,1200000.00,450000.00),(2,'Consumables',500000.00,150000.00,15000.00),(3,'Services',1000000.00,400000.00,22000.00),(4,'Utilities',800000.00,300000.00,3540.00),(5,'Rental',3600000.00,1200000.00,0.00);
/*!40000 ALTER TABLE `budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `DeptID` int NOT NULL AUTO_INCREMENT,
  `DeptCode` varchar(8) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDeleted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`DeptID`),
  UNIQUE KEY `DeptCode` (`DeptCode`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (4,'FAC','Facilities Department',_binary '\0'),(5,'HR','Human Resources Department',_binary '\0'),(6,'ADM','Administration Department',_binary '\0'),(7,'FIN','Finance Department',_binary '\0'),(8,'OPS','Operations Department',_binary '\0'),(9,'IT','Information Technology Department',_binary '\0');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_quote_items`
--

DROP TABLE IF EXISTS `expense_quote_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_quote_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote_id` int NOT NULL,
  `rfq_item_id` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `gst_rate` decimal(5,2) DEFAULT NULL,
  `gst_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quote_id` (`quote_id`),
  KEY `idx_rfq_item_id` (`rfq_item_id`),
  CONSTRAINT `fk_eqi_quote` FOREIGN KEY (`quote_id`) REFERENCES `expense_quotes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_eqi_rfq_item` FOREIGN KEY (`rfq_item_id`) REFERENCES `rfq_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_quote_items`
--

LOCK TABLES `expense_quote_items` WRITE;
/*!40000 ALTER TABLE `expense_quote_items` DISABLE KEYS */;
INSERT INTO `expense_quote_items` VALUES (1,14,6,23.00,276.00,NULL,NULL),(2,14,7,43.00,645.00,NULL,NULL),(3,15,8,23.00,23.00,NULL,NULL),(4,15,9,34.00,68.00,NULL,NULL),(5,16,8,45.00,45.00,NULL,NULL),(6,16,9,66.00,132.00,NULL,NULL),(7,17,10,60.00,1200.00,NULL,NULL),(8,17,11,30.00,300.00,NULL,NULL),(9,18,10,30.00,600.00,NULL,NULL),(10,18,11,40.00,400.00,NULL,NULL),(11,19,12,25.00,300.00,NULL,NULL),(12,19,13,400.00,1600.00,NULL,NULL),(13,20,12,20.00,240.00,NULL,NULL),(14,20,13,450.00,1800.00,NULL,NULL),(15,21,14,15000.00,75000.00,NULL,NULL),(16,21,15,25000.00,150000.00,NULL,NULL),(17,22,14,20000.00,100000.00,NULL,NULL),(18,22,15,30000.00,180000.00,NULL,NULL),(19,23,16,20.00,480.00,NULL,NULL),(20,23,17,30.00,360.00,NULL,NULL),(21,23,18,40.00,1240.00,NULL,NULL),(22,24,16,10.00,240.00,NULL,NULL),(23,24,17,20.00,240.00,NULL,NULL),(24,25,19,3.00,6.00,NULL,NULL),(25,25,20,4.00,12.00,NULL,NULL),(26,26,19,5.00,10.00,NULL,NULL),(27,26,20,6.00,18.00,NULL,NULL),(28,27,21,1.00,3.00,NULL,NULL),(29,27,22,2.00,8.00,NULL,NULL),(30,27,23,3.00,9.00,NULL,NULL),(31,28,21,4.00,12.00,NULL,NULL),(32,28,22,4.00,16.00,NULL,NULL),(33,28,23,5.00,15.00,NULL,NULL),(34,29,21,7.00,21.00,NULL,NULL),(35,29,22,8.00,32.00,NULL,NULL),(36,29,23,9.00,27.00,NULL,NULL),(37,30,24,1.00,2.00,NULL,NULL),(38,30,25,2.00,4.00,NULL,NULL),(39,31,24,3.00,6.00,NULL,NULL),(40,31,25,4.00,8.00,NULL,NULL),(41,32,24,5.00,10.00,NULL,NULL),(42,32,25,6.00,12.00,NULL,NULL),(43,34,26,4.00,9.44,18.00,1.44),(44,34,27,5.00,22.40,12.00,2.40),(45,35,26,6.00,14.16,18.00,2.16),(46,35,27,7.00,31.36,12.00,3.36),(55,40,28,5.00,20.00,18.00,23.60),(56,40,29,6.00,30.00,12.00,33.60),(57,41,28,10.00,40.00,18.00,47.20),(58,41,29,12.00,60.00,12.00,67.20),(59,42,30,55.00,220.00,0.00,220.00),(60,43,30,40.00,160.00,0.00,160.00),(61,44,31,10.00,130.00,18.00,153.40),(62,44,32,20.00,140.00,0.00,140.00),(63,44,33,30.00,150.00,0.00,150.00),(64,45,31,30.00,390.00,18.00,460.20),(65,45,32,39.00,273.00,0.00,273.00),(66,45,33,50.00,250.00,0.00,250.00),(67,46,31,60.00,780.00,18.00,920.40),(68,46,32,70.00,490.00,0.00,490.00),(69,46,33,80.00,400.00,0.00,400.00),(70,47,34,10.00,50.00,0.00,50.00),(71,47,35,15.00,150.00,0.00,150.00),(72,47,36,20.00,300.00,0.00,300.00),(73,48,34,20.00,100.00,0.00,100.00),(74,48,35,25.00,250.00,0.00,250.00),(75,48,36,30.00,450.00,0.00,450.00),(76,49,37,4.00,12.00,0.00,12.00),(77,49,38,5.00,25.00,0.00,25.00),(78,50,37,6.00,18.00,0.00,18.00),(79,50,38,7.00,35.00,0.00,35.00),(80,51,43,5.00,60.00,0.00,60.00),(81,51,44,6.00,24.00,0.00,24.00),(82,52,43,7.00,84.00,0.00,84.00),(83,52,44,8.00,32.00,0.00,32.00),(84,53,45,5.00,20.00,0.00,20.00),(85,53,46,6.00,24.00,0.00,24.00),(86,54,45,7.00,28.00,0.00,28.00),(87,54,46,8.00,32.00,0.00,32.00),(88,55,47,3.00,36.00,0.00,36.00),(89,55,48,5.00,75.00,0.00,75.00),(90,56,47,5.00,60.00,0.00,60.00),(91,56,48,6.00,90.00,0.00,90.00),(92,57,49,5.00,10.00,18.00,11.80),(93,57,50,7.00,28.00,0.00,28.00),(94,58,49,8.00,16.00,18.00,18.88),(95,58,50,4.00,16.00,0.00,16.00),(96,59,55,22.00,66.00,0.00,66.00),(97,59,56,34.00,136.00,0.00,136.00),(98,60,55,15.00,45.00,0.00,45.00),(99,60,56,16.00,64.00,0.00,64.00),(100,61,53,14.00,28.00,0.00,28.00),(101,61,54,45.00,135.00,18.00,159.30),(102,62,53,24.00,48.00,0.00,48.00),(103,62,54,44.00,132.00,18.00,155.76),(108,65,65,12.00,24.00,0.00,24.00),(109,65,66,12.00,36.00,0.00,36.00),(110,66,65,23.00,46.00,0.00,46.00),(111,66,66,34.00,102.00,0.00,102.00),(112,67,76,12.00,144.00,0.00,144.00),(113,67,77,16.00,224.00,0.00,224.00),(114,68,76,25.00,300.00,0.00,300.00),(115,68,77,15.00,210.00,0.00,210.00);
/*!40000 ALTER TABLE `expense_quote_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_quotes`
--

DROP TABLE IF EXISTS `expense_quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `uploaded_by` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `is_recommended` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_selected` tinyint DEFAULT '0',
  `vendor_id` int DEFAULT NULL,
  `reason` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `expense_quotes_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expense_requests` (`id`),
  CONSTRAINT `expense_quotes_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_quotes`
--

LOCK TABLES `expense_quotes` WRITE;
/*!40000 ALTER TABLE `expense_quotes` DISABLE KEYS */;
INSERT INTO `expense_quotes` VALUES (1,1,76,10000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764826330635-sample-invoice%20(1).pdf',0,'2025-12-04 05:32:12',0,NULL,NULL),(2,1,76,99999.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764826348076-sample-invoice%20(1).pdf',0,'2025-12-04 05:32:28',0,NULL,NULL),(3,2,76,9000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764827749685-sample-invoice%20(1).pdf',1,'2025-12-04 05:55:50',1,NULL,NULL),(4,2,76,9000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764827754848-sample-invoice%20(1).pdf',0,'2025-12-04 05:55:55',0,NULL,NULL),(5,2,76,9000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764827811606-sample-invoice%20(1).pdf',0,'2025-12-04 05:56:53',0,NULL,NULL),(6,3,76,2000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764847461601-sample-invoice%20(1).pdf',0,'2025-12-04 11:24:24',0,NULL,NULL),(7,4,76,10000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1764915660541-sample-invoice%20(1).pdf',1,'2025-12-05 06:21:02',1,NULL,NULL),(8,6,76,20000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1765945503653-sample-invoice%20(1).pdf',1,'2025-12-17 04:25:05',1,NULL,NULL),(9,7,76,10000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1765951408109-sample-invoice%20(1).pdf',1,'2025-12-17 06:03:28',1,2,NULL),(10,7,76,12000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1765951408385-1763615067688-sample-invoice%20(1).pdf',0,'2025-12-17 06:03:28',0,2,NULL),(11,8,76,1000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1765965763809-PO00060%20-%20Noster%20(Ceiling%20work).pdf',0,'2025-12-17 10:02:45',0,5,NULL),(12,8,76,16000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1765965765137-PO00060%20-%20Noster%20(Ceiling%20work).pdf',0,'2025-12-17 10:02:45',0,6,NULL),(13,8,76,14000.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1765965765330-PO00060%20-%20Noster%20(Ceiling%20work).pdf',0,'2025-12-17 10:02:45',0,4,NULL),(14,9,76,921.00,NULL,1,'2026-01-15 03:25:32',1,3,NULL),(15,10,76,91.00,NULL,1,'2026-01-15 04:28:41',1,3,NULL),(16,10,76,177.00,NULL,0,'2026-01-15 04:28:41',0,6,NULL),(17,11,76,1500.00,NULL,0,'2026-01-15 11:06:50',0,2,NULL),(18,11,76,1000.00,NULL,1,'2026-01-15 11:06:50',1,6,NULL),(19,12,76,1900.00,NULL,1,'2026-01-20 08:59:31',1,21,NULL),(20,12,76,2040.00,NULL,0,'2026-01-20 08:59:31',0,20,NULL),(21,13,76,225000.00,NULL,1,'2026-01-21 11:23:43',1,21,NULL),(22,13,76,280000.00,NULL,0,'2026-01-21 11:23:43',0,20,NULL),(23,14,76,2080.00,NULL,1,'2026-01-27 05:29:42',1,20,NULL),(24,14,76,480.00,NULL,1,'2026-01-27 05:29:42',0,21,NULL),(25,15,76,18.00,NULL,1,'2026-01-27 09:30:58',0,20,'testing 1'),(26,15,76,28.00,NULL,1,'2026-01-27 09:30:58',0,21,'good test'),(27,16,76,20.00,NULL,1,'2026-01-28 04:54:35',0,21,'test1'),(28,16,76,43.00,NULL,1,'2026-01-28 04:54:35',0,20,'test2'),(29,16,76,80.00,NULL,0,'2026-01-28 04:54:35',0,19,NULL),(30,17,76,6.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1769588382493-PO_PO-2026-1768974280618%20(7).pdf',1,'2026-01-28 08:19:57',0,21,'good 1'),(31,17,76,14.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1769588397912-PO_PO-2026-1768974280618%20(8).pdf',1,'2026-01-28 08:20:06',1,20,'good 2'),(32,17,76,22.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1769588406403-PO_PO-2026-1768974280618%20(10).pdf',0,'2026-01-28 08:20:16',0,19,NULL),(34,19,76,31.84,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1769670155408-PO_PO-2026-1768889981571.pdf',0,'2026-01-29 07:02:35',0,3,NULL),(35,19,76,45.52,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1769670155632-PO_PO-2026-1768974280618%20(4).pdf',0,'2026-01-29 07:02:37',0,2,NULL),(40,20,76,57.20,NULL,1,'2026-02-03 06:18:14',1,4,'good company'),(41,20,76,114.40,NULL,1,'2026-02-03 06:18:14',0,2,'near by'),(42,21,76,220.00,NULL,1,'2026-02-13 09:19:42',1,21,'good 1'),(43,21,76,160.00,NULL,1,'2026-02-13 09:19:42',0,23,'good 2'),(44,22,76,420.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771307108823-PO_PO-2026-1770978924924%20(1).pdf',1,'2026-02-17 05:45:11',1,20,'final 1'),(45,22,76,913.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771307111473-PO_PO-2026-1770978924924.pdf',0,'2026-02-17 05:45:12',0,23,NULL),(46,22,76,1670.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771307112021-PO_21.pdf',1,'2026-02-17 05:45:12',0,19,'final 2'),(47,31,76,500.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771497377180-PO_PO-2026-1771325466550%20(5).pdf',1,'2026-02-19 10:36:20',1,21,'good choice'),(48,31,76,800.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771497380753-PO_PO-2026-1771325466550%20(9).pdf',0,'2026-02-19 10:36:22',0,23,NULL),(49,25,76,37.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771913752933-1771582603653-PO_PO-2026-1771497855336%20(2).pdf',1,'2026-02-24 06:15:56',0,23,'good one'),(50,25,76,53.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1771913756139-1771582603653-PO_PO-2026-1771497855336.pdf',1,'2026-02-24 06:15:57',0,24,'second one'),(51,32,76,84.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1772199927415-PO_PO-2026-1771325466550%20(10).pdf',1,'2026-02-27 13:45:29',1,23,'good'),(52,32,76,116.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1772199929943-PO_PO-2026-1771325466550%20(5).pdf',0,'2026-02-27 13:45:30',0,24,NULL),(53,33,76,44.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1772200488579-PO_PO-2026-1771325466550%20(10).pdf',1,'2026-02-27 13:54:50',1,21,'good'),(54,33,76,60.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1772200490203-PO_PO-2026-1771325466550%20(1).pdf',0,'2026-02-27 13:54:50',0,23,NULL),(55,34,76,111.00,NULL,1,'2026-03-02 05:33:43',1,23,'rfq'),(56,34,76,150.00,NULL,0,'2026-03-02 05:33:43',0,24,NULL),(57,35,76,38.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1772525337134-1765945503653-sample-invoice%20(1).pdf',1,'2026-03-03 08:08:58',1,24,'test'),(58,35,76,32.00,'https://internalstoragearinddev.blob.core.windows.net/expense-files/1772525338731-1770960463826-Cadell%20-%202%20Feb%2726%20(4).pdf',0,'2026-03-03 08:08:59',0,23,NULL),(59,38,76,202.00,NULL,1,'2026-03-04 10:37:30',1,24,'good vendor'),(60,38,76,109.00,NULL,0,'2026-03-04 10:37:30',0,22,NULL),(61,37,76,163.00,NULL,1,'2026-03-04 10:43:52',1,23,'vfvf'),(62,37,76,180.00,NULL,0,'2026-03-04 10:43:52',0,22,NULL),(65,41,76,60.00,NULL,1,'2026-03-06 06:29:52',0,24,'good'),(66,41,76,148.00,NULL,0,'2026-03-06 06:29:52',1,22,NULL),(67,44,76,368.00,NULL,1,'2026-03-09 06:46:02',0,23,'testing'),(68,44,76,510.00,NULL,0,'2026-03-09 06:46:02',1,24,NULL);
/*!40000 ALTER TABLE `expense_quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_requests`
--

DROP TABLE IF EXISTS `expense_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_type` enum('STANDARD','DIRECT') NOT NULL,
  `requested_by` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `category` enum('Assets','Consumables','Services','Utilities','Rental') NOT NULL,
  `current_status` varchar(100) NOT NULL DEFAULT 'RFQ_PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estimated_cost` decimal(12,2) DEFAULT '0.00',
  `selected_vendor_id` int DEFAULT NULL,
  `po_number` varchar(100) DEFAULT NULL,
  `payment_reference` varchar(200) DEFAULT NULL,
  `quote_amount` decimal(12,2) DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `po_file_url` text,
  `po_issued_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requested_by` (`requested_by`),
  CONSTRAINT `expense_requests_ibfk_2` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_requests`
--

LOCK TABLES `expense_requests` WRITE;
/*!40000 ALTER TABLE `expense_requests` DISABLE KEYS */;
INSERT INTO `expense_requests` VALUES (1,'STANDARD',76,'vhair',NULL,'Consumables','QUOTES_PENDING','2025-12-04 05:21:44','2025-12-04 05:21:44',10000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'STANDARD',76,'chair',NULL,'Assets','PO_ISSUED','2025-12-04 05:55:20','2025-12-04 06:20:52',10000.00,NULL,'TEST001',NULL,9000.00,NULL,NULL,NULL),(3,'DIRECT',76,'groccery',NULL,'Utilities','QUOTE_REVIEW_DM','2025-12-04 08:43:31','2025-12-04 11:24:24',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'STANDARD',76,'computer',NULL,'Assets','PO_ISSUED','2025-12-05 04:52:55','2025-12-16 12:43:14',100000.00,NULL,'P001',NULL,10000.00,NULL,NULL,NULL),(5,'STANDARD',76,'table',NULL,'Consumables','RFQ_PENDING','2025-12-10 06:40:48','2025-12-10 06:40:48',1000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'STANDARD',76,'Fridge',NULL,'Assets','PO_PENDING_DM','2025-12-16 12:53:55','2025-12-17 09:42:43',250000.00,NULL,NULL,NULL,20000.00,75,NULL,NULL),(7,'STANDARD',76,'LAP',NULL,'Assets','PO_PENDING_DM','2025-12-17 05:23:42','2025-12-17 06:31:56',10000.00,2,NULL,NULL,10000.00,75,NULL,NULL),(8,'STANDARD',77,'bags',NULL,'Assets','RFQ_REJECTED','2025-12-17 09:48:57','2026-02-26 12:19:23',10000.00,NULL,NULL,NULL,NULL,75,NULL,NULL),(9,'STANDARD',76,'Chair',NULL,'Assets','PO_ISSUED','2025-12-17 12:11:14','2026-02-03 05:52:18',10000.00,3,'PO-2026-1770097938278',NULL,NULL,77,NULL,'2026-02-03 11:22:18'),(10,'STANDARD',76,'AC',NULL,'Assets','PO_ISSUED','2026-01-08 06:44:28','2026-01-15 09:42:25',0.00,3,'PO-2026-1768470145830',NULL,91.00,77,NULL,'2026-01-15 15:12:25'),(11,'STANDARD',76,'car',NULL,'Assets','INVOICE_REVIEW_FM','2026-01-15 10:25:14','2026-01-21 09:31:19',0.00,6,'PO-2026-1768889981571',NULL,NULL,77,NULL,'2026-01-20 11:49:41'),(12,'STANDARD',77,'testing',NULL,'Assets','PO_ISSUED','2026-01-20 08:56:19','2026-01-21 05:44:40',0.00,21,'PO-2026-1768974280618',NULL,NULL,77,NULL,'2026-01-21 11:14:40'),(13,'STANDARD',76,'Laps',NULL,'Assets','PO_ISSUED','2026-01-21 10:45:22','2026-01-21 11:37:51',0.00,21,'PO-2026-1768995471800',NULL,NULL,77,NULL,'2026-01-21 17:07:51'),(14,'STANDARD',77,'TESTING',NULL,'Assets','PO_DRAFT_DE','2026-01-23 11:04:21','2026-03-09 05:44:20',0.00,20,NULL,NULL,NULL,75,NULL,NULL),(15,'STANDARD',77,'TEST@',NULL,'Assets','QUOTE_APPROVAL_CH','2026-01-27 05:33:15','2026-01-27 10:16:10',0.00,NULL,NULL,NULL,NULL,76,NULL,NULL),(16,'STANDARD',75,'TEST##',NULL,'Assets','QUOTE_APPROVAL_CH','2026-01-28 04:51:59','2026-01-28 04:55:30',0.00,NULL,NULL,NULL,NULL,76,NULL,NULL),(17,'STANDARD',75,'TEST$$',NULL,'Assets','PO_ISSUED','2026-01-28 08:17:34','2026-02-03 05:42:52',0.00,20,'PO-2026-1770097372839',NULL,NULL,77,NULL,'2026-02-03 11:12:52'),(19,'STANDARD',76,'TESTING%%',NULL,'Assets','QUOTE_REVIEW_DM_REJECTED','2026-01-29 07:00:06','2026-02-27 10:02:23',0.00,NULL,NULL,NULL,NULL,76,NULL,NULL),(20,'STANDARD',76,'PO TESt',NULL,'Assets','INVOICE_REVIEW_FM','2026-02-03 06:07:53','2026-02-11 07:07:48',0.00,4,'PO-2026-1770100807648',NULL,NULL,77,NULL,'2026-02-03 12:10:07'),(21,'STANDARD',76,'testUI',NULL,'Assets','INVOICE_REVIEW_DM','2026-02-13 07:45:48','2026-02-19 09:52:53',0.00,21,'PO-2026-1770978924924',NULL,NULL,77,NULL,'2026-02-13 16:05:24'),(22,'STANDARD',75,'FINAL TEST',NULL,'Assets','PO_ISSUED','2026-02-17 05:28:26','2026-02-17 10:51:06',0.00,20,'PO-2026-1771325466550',NULL,NULL,77,NULL,'2026-02-17 16:21:06'),(23,'STANDARD',76,'test35',NULL,'Assets','RFQ_REJECTED','2026-02-19 08:32:53','2026-02-26 10:50:03',0.00,NULL,NULL,NULL,NULL,77,NULL,NULL),(24,'STANDARD',76,'test50',NULL,'Assets','RFQ_REJECTED','2026-02-19 08:43:04','2026-02-26 10:25:05',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'DIRECT',76,'test51',NULL,'Utilities','RFQ_REJECTED','2026-02-19 09:12:58','2026-02-27 05:24:32',0.00,NULL,NULL,NULL,NULL,76,NULL,NULL),(31,'STANDARD',76,'chair',NULL,'Assets','INVOICE_REVIEW_FM','2026-02-19 10:19:15','2026-02-20 11:10:33',0.00,21,'PO-2026-1771497855336',NULL,NULL,77,NULL,'2026-02-19 16:14:15'),(32,'STANDARD',77,'PO testing',NULL,'Assets','PO_PENDING_DM','2026-02-27 13:41:41','2026-02-27 13:47:25',0.00,23,NULL,NULL,NULL,75,NULL,NULL),(33,'STANDARD',76,'POtest',NULL,'Assets','PO_REAPPROVAL_CH','2026-02-27 13:52:58','2026-03-01 17:44:29',0.00,21,NULL,NULL,NULL,NULL,NULL,NULL),(34,'STANDARD',76,'RfqTest',NULL,'Assets','PO_ISSUED','2026-03-02 05:32:12','2026-03-04 01:17:38',0.00,23,'PO-2026-1772531201689',NULL,NULL,NULL,NULL,'2026-03-03 15:16:41'),(35,'STANDARD',76,'DErfqtest',NULL,'Assets','PO_ISSUED','2026-03-03 08:05:47','2026-03-03 14:12:34',0.00,24,'PO-2026-1772547154349',NULL,NULL,NULL,NULL,'2026-03-03 19:42:34'),(36,'STANDARD',76,'RFQTEST',NULL,'Assets','RFQ_SUBMITTED','2026-03-03 09:32:05','2026-03-03 09:32:38',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'STANDARD',75,'For test',NULL,'Assets','PO_REAPPROVAL_CH','2026-03-04 09:34:53','2026-03-05 08:31:11',0.00,23,NULL,NULL,NULL,NULL,NULL,NULL),(38,'STANDARD',76,'FOR RFQ TEST',NULL,'Assets','PO_REVIEW_DM_REJECTED','2026-03-04 10:21:45','2026-03-05 08:23:07',0.00,24,NULL,NULL,NULL,NULL,NULL,NULL),(39,'STANDARD',76,'FOR TEST ASSET',NULL,'Assets','RFQ_RECOMMENDED_DM','2026-03-05 09:31:40','2026-03-05 09:33:07',0.00,NULL,NULL,NULL,NULL,77,NULL,NULL),(40,'STANDARD',76,'RF TEst',NULL,'Assets','QUOTES_PENDING','2026-03-05 09:39:17','2026-03-05 09:41:08',0.00,NULL,NULL,NULL,NULL,75,NULL,NULL),(41,'STANDARD',76,'test UNDO',NULL,'Assets','PO_DRAFT_DE','2026-03-05 13:52:17','2026-03-06 09:37:47',0.00,22,NULL,NULL,NULL,75,NULL,NULL),(42,'STANDARD',76,'TEST OFF',NULL,'Assets','QUOTES_PENDING','2026-03-06 06:20:39','2026-03-09 05:06:28',0.00,NULL,NULL,NULL,NULL,75,NULL,NULL),(43,'STANDARD',75,'DEMO',NULL,'Assets','RFQ_SUBMITTED_REJECTED','2026-03-09 06:20:25','2026-03-09 06:28:26',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,'STANDARD',77,'DEMO1',NULL,'Assets','PO_ISSUED','2026-03-09 06:39:34','2026-03-09 06:52:53',0.00,24,'PO-2026-1773039173644',NULL,NULL,77,NULL,'2026-03-09 12:22:53'),(45,'STANDARD',76,'TEST ROLE',NULL,'Assets','RFQ_RECOMMENDED_DM','2026-03-09 10:14:15','2026-03-09 10:31:38',0.00,NULL,NULL,NULL,NULL,77,NULL,NULL),(46,'STANDARD',76,'TEST WORKFLOW',NULL,'Assets','QUOTES_PENDING','2026-03-09 10:55:31','2026-03-09 10:56:13',0.00,NULL,NULL,NULL,NULL,77,NULL,NULL),(47,'STANDARD',77,'CHECK role',NULL,'Assets','RFQ_RECOMMENDED_DM','2026-03-10 09:35:12','2026-03-10 09:40:58',0.00,NULL,NULL,NULL,NULL,77,NULL,NULL),(48,'STANDARD',77,'DEMO3',NULL,'Assets','RFQ_RECOMMENDED_DM','2026-03-10 12:10:08','2026-03-10 12:10:40',0.00,NULL,NULL,NULL,NULL,77,NULL,NULL);
/*!40000 ALTER TABLE `expense_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gst_master`
--

DROP TABLE IF EXISTS `gst_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gst_master` (
  `gst_id` int NOT NULL AUTO_INCREMENT,
  `gst_code` varchar(20) DEFAULT NULL,
  `gst_rate` decimal(5,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `effective_from` date DEFAULT NULL,
  `effective_to` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`gst_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gst_master`
--

LOCK TABLES `gst_master` WRITE;
/*!40000 ALTER TABLE `gst_master` DISABLE KEYS */;
INSERT INTO `gst_master` VALUES (1,'GST_0',0.00,'Nil rated goods',1,'2017-07-01',NULL,'2026-01-29 06:04:21'),(2,'GST_5',5.00,'Essential goods',1,'2017-07-01',NULL,'2026-01-29 06:04:21'),(3,'GST_12',12.00,'Standard goods (lower slab)',1,'2017-07-01',NULL,'2026-01-29 06:04:21'),(4,'GST_18',18.00,'Standard goods (most services)',1,'2017-07-01',NULL,'2026-01-29 06:04:21'),(5,'GST_28',28.00,'Luxury & sin goods',1,'2017-07-01',NULL,'2026-01-29 06:04:21');
/*!40000 ALTER TABLE `gst_master` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `id_cards`
--

LOCK TABLES `id_cards` WRITE;
/*!40000 ALTER TABLE `id_cards` DISABLE KEYS */;
INSERT INTO `id_cards` VALUES (35,'V1','3585851',0,'2025-10-14 10:52:56','Admin','66','2025-10-14 16:22:56',1),(36,'V2','3246232',1,'2025-11-26 08:59:03','Admin','Admin','2025-11-26 14:29:03',1),(37,'V3','23111',0,'2025-10-14 10:46:06','Admin','66','2025-10-14 16:16:06',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,5,65,'MOVE_TO_PANTRY','60','2025-05-06 09:45:56.550000','Approved'),(2,2,65,'MOVE_TO_PANTRY','50','2025-05-06 09:45:56.563000','Approved'),(3,2,65,'MOVE_TO_PANTRY','2','2025-05-06 10:11:51.293000','Approved'),(4,2,65,'MOVE_TO_PANTRY','1','2025-05-06 10:12:26.200000','*TRIAL*T'),(5,2,65,'*TRIAL*TRIAL*T','*','2025-05-06 10:12:54.330000','*TRIAL*T'),(6,3,65,'MOVE_TO_PANTRY','50','2025-05-06 10:13:19.570000','Approved'),(7,3,65,'*TRIAL*TRIAL*T','10','2025-05-06 10:14:51.290000','*TRIAL*T'),(8,3,65,'MOVE_TO_PANTRY','30','2025-05-06 10:16:41.373000','*TRIAL*T'),(9,21,65,'MOVE_TO_PANTRY','3','2025-05-06 12:54:32.410000','Approved'),(11,21,65,'MOVE_TO_PANTRY','*','2025-05-06 13:07:56.807000','*TRIAL*T'),(13,24,65,'MOVE_TO_PANTRY','200','2025-05-06 14:44:49.963000','Approved'),(14,23,65,'*TRIAL*TRIAL*T','14','2025-05-06 14:45:01.547000','Approved'),(16,30,65,'MOVE_TO_PANTRY','5','2025-05-07 12:07:00.997000','Approved'),(17,29,65,'MOVE_TO_PANTRY','14','2025-05-07 12:07:22.987000','*TRIAL*T'),(18,30,65,'MOVE_TO_PANTRY','50','2025-05-07 12:07:23.020000','Approved'),(19,30,65,'MOVE_BACK_TO_INVENTORY','5','2025-05-07 07:42:13.347000','Approved'),(20,30,65,'*TRIAL*TRIAL*TRIAL*TRI','50','2025-05-07 08:34:25.997000','*TRIAL*T'),(21,30,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:08:57.117000','Approved'),(22,30,65,'MOVE_BACK_TO_INVENTORY','50','2025-05-07 14:18:50.530000','Approved'),(23,3,65,'*TRIAL*TRIAL*TRIAL*TRI','10','2025-05-07 14:19:43.450000','Approved'),(24,3,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:19:43.460000','Approved'),(25,3,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:20:13.697000','Approved'),(26,3,65,'MOVE_BACK_TO_INVENTORY','10','2025-05-07 14:20:13.707000','Approved'),(27,29,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:36:01.090000','Approved'),(28,4,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-07 14:56:30.527000','Approved'),(29,24,65,'MOVE_BACK_TO_INVENTORY','100','2025-05-07 14:58:57.300000','Approved'),(31,30,65,'MOVE_BACK_TO_INVENTORY','*TR','2025-05-07 15:42:27.417000','*TRIAL*T'),(32,22,65,'*TRIAL*TRIAL*TRIAL*TRI','55','2025-05-07 15:45:15.090000','Approved'),(34,30,65,'*TRIAL*TRIAL*TRIAL*TRI','150','2025-05-07 16:37:18.287000','Approved'),(36,42,65,'MOVE_BACK_TO_INVENTORY','50','2025-05-08 10:41:35.247000','*TRIAL*T'),(39,1,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-08 15:47:15.773000','*TRIAL*T'),(40,42,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-08 15:47:15.790000','Approved'),(42,43,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-08 17:46:41.790000','Approved'),(43,43,65,'MOVE_TO_PANTRY','*T','2025-05-08 17:48:03.153000','Approved'),(44,42,65,'*TRIAL*TRIAL*T','55','2025-05-08 17:48:03.170000','Approved'),(45,1,65,'MOVE_TO_PANTRY','50','2025-05-08 18:09:30.390000','Approved'),(46,2,65,'MOVE_TO_PANTRY','5','2025-05-08 18:09:30.403000','Approved'),(47,29,65,'*TRIAL*TRIAL*T','14','2025-05-09 12:17:18.197000','Approved'),(48,28,65,'MOVE_TO_PANTRY','50','2025-05-09 12:17:18.207000','Approved'),(49,36,65,'MOVE_TO_PANTRY','55','2025-05-09 14:03:44.677000',NULL),(50,32,65,'MOVE_TO_PANTRY','24','2025-05-09 14:03:44.697000',NULL),(51,4,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:09:59.613000','Rejected'),(52,4,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:10:56.503000','Rejected'),(53,4,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:11:46.283000','*TRIAL*T'),(54,4,65,'*TRIAL*TRIAL*T','*T','2025-05-09 14:13:26.603000','Approved'),(55,5,65,'MOVE_TO_PANTRY','12','2025-05-09 14:13:26.610000','Rejected'),(56,5,65,'*TRIAL*TRIAL*T','12','2025-05-09 14:34:53.837000','*TRIAL*T'),(57,6,65,'MOVE_TO_PANTRY','*T','2025-05-09 14:34:53.843000','rejected'),(58,18,65,'*TRIAL*TRIAL*T','*T','2025-05-09 20:31:45.563000','*TRIAL*T'),(61,30,65,'MOVE_TO_PANTRY','205','2025-05-13 10:22:23.320000','Rejected'),(63,3,65,'MOVE_TO_PANTRY','50','2025-05-13 11:58:15.947000','*TRIAL*T'),(64,21,66,'MOVE_TO_PANTRY','5','2025-05-14 12:44:47.673000','Rejected'),(68,3,65,'MOVE_TO_PANTRY','60','2025-05-14 15:48:26.213000','Rejected'),(69,22,65,'MOVE_TO_PANTRY','25','2025-05-14 15:48:26.230000','*TRIAL*T'),(70,21,65,'MOVE_TO_PANTRY','2','2025-05-14 15:48:26.240000','Rejected'),(77,3,65,'MOVE_TO_PANTRY','5','2025-05-15 12:24:10.880000','Rejected'),(78,3,65,'MOVE_TO_PANTRY','5','2025-05-15 12:31:24.580000','Rejected'),(80,24,65,'MOVE_TO_PANTRY','*T','2025-05-15 12:32:35.843000','*TRIAL*T'),(85,26,65,'MOVE_TO_PANTRY','12','2025-05-15 15:50:16.827000','Rejected'),(86,24,65,'*TRIAL*TRIAL*T','20','2025-05-15 15:57:48.407000','Rejected'),(87,24,65,'MOVE_TO_PANTRY','40','2025-05-15 15:58:58.090000','Rejected'),(88,24,65,'MOVE_TO_PANTRY','49','2025-05-15 16:23:33.267000','Rejected'),(89,21,65,'MOVE_TO_PANTRY','1','2025-05-15 16:24:05.980000','*TRIAL*T'),(90,22,65,'MOVE_TO_PANTRY','3','2025-05-15 16:24:06.000000','Rejected'),(92,30,65,'MOVE_TO_PANTRY','105','2025-05-15 16:24:06.033000','*TRIAL*'),(93,26,65,'*TRIAL*TRIAL*TRIAL*TRI','25','2025-05-15 16:31:08.323000','Approved'),(94,3,65,'*TRIAL*TRIAL*TRIAL*TRI','1','2025-05-15 16:31:08.347000','Approved'),(95,3,65,'MOVE_BACK_TO_INVENTORY','1','2025-05-15 16:31:08.360000','Approved'),(96,24,65,'MOVE_BACK_TO_INVENTORY','*T','2025-05-15 16:31:08.373000','Approved'),(97,3,65,'*TRIAL*TRIAL*TRIAL*TRI','*','2025-05-15 16:31:08.387000','Approved'),(98,3,65,'MOVE_BACK_TO_INVENTORY','5','2025-05-15 16:31:08.397000','Approved'),(99,30,65,'MOVE_BACK_TO_INVENTORY','*TR','2025-05-15 16:31:08.413000','Approved'),(100,22,65,'MOVE_BACK_TO_INVENTORY','*','2025-05-15 16:31:08.427000','*TRIAL*T'),(101,3,65,'MOVE_BACK_TO_INVENTORY','30','2025-05-15 16:31:08.440000','Approved'),(102,22,65,'MOVE_BACK_TO_INVENTORY','20','2025-05-15 16:31:08.453000','Approved'),(103,21,65,'MOVE_BACK_TO_INVENTORY','1','2025-05-15 16:31:08.470000','Approved'),(104,3,65,'MOVE_BACK_TO_INVENTORY','20','2025-05-15 16:31:08.483000','Approved'),(105,22,65,'MOVE_BACK_TO_INVENTORY','10','2025-05-15 16:31:08.500000','*TRIAL*T'),(106,3,65,'*TRIAL*TRIAL*TRIAL*TRI','*T','2025-05-15 16:31:08.513000','*TRIAL*T'),(107,21,65,'MOVE_BACK_TO_INVENTORY','4','2025-05-15 16:31:08.527000','*TRIAL*T'),(108,26,65,'MOVE_BACK_TO_INVENTORY','40','2025-05-15 16:31:08.540000','Approved'),(109,27,65,'MOVE_BACK_TO_INVENTORY','85','2025-05-15 16:31:08.550000','Approved'),(110,7,65,'MOVE_BACK_TO_INVENTORY','100','2025-05-15 16:31:08.563000','Approved'),(111,7,66,'MOVE_TO_PANTRY','50','2025-05-15 17:20:39.207000','Approved'),(112,22,66,'MOVE_TO_PANTRY','30','2025-05-15 17:20:39.220000','Rejected'),(113,24,66,'MOVE_TO_PANTRY','100','2025-05-15 17:20:39.233000','Rejected'),(114,3,65,'MOVE_TO_PANTRY','11','2025-05-23 13:26:28.727674','pending'),(115,3,65,'MOVE_TO_PANTRY','11','2025-05-23 13:27:44.102303','pending'),(116,3,65,'MOVE_TO_PANTRY','12','2025-05-23 13:29:15.848901','pending'),(117,3,65,'MOVE_TO_PANTRY','14','2025-05-23 13:30:21.532715','pending'),(118,3,65,'MOVE_TO_PANTRY','13','2025-05-23 13:45:23.015756','pending'),(119,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:46:07.597005','pending'),(120,3,65,'MOVE_TO_PANTRY','3','2025-05-23 13:48:13.194674','pending'),(121,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:51:51.961478','pending'),(122,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:54:12.005140','pending'),(123,3,65,'MOVE_TO_PANTRY','2','2025-05-23 13:56:41.904721','pending'),(124,3,65,'MOVE_TO_PANTRY','110','2025-05-23 13:57:41.076779','pending'),(125,3,65,'MOVE_TO_PANTRY','110','2025-05-23 13:59:07.987987','pending'),(126,3,65,'MOVE_TO_PANTRY','105','2025-05-23 14:00:10.300622','pending'),(127,3,65,'MOVE_TO_PANTRY','100','2025-05-23 14:01:13.801619','Approved'),(128,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:07:47.847707','pending'),(129,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:08:40.349528','pending'),(130,3,65,'MOVE_TO_PANTRY','10','2025-05-23 14:10:00.375682','pending'),(131,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:10:56.803850','pending'),(132,3,65,'MOVE_TO_PANTRY','50','2025-05-23 14:12:08.580351','Approved'),(133,3,66,'MOVE_TO_PANTRY','20','2025-05-23 14:13:43.888280','Approved'),(134,3,65,'MOVE_TO_PANTRY','2','2025-05-23 14:14:40.080786','Approved'),(135,3,65,'MOVE_TO_PANTRY','3','2025-05-23 14:27:45.167834','Approved'),(136,3,66,'MOVE_TO_PANTRY','2','2025-05-23 14:28:18.358814','pending'),(137,3,86,'MOVE_TO_PANTRY','20','2025-08-13 12:22:11.046033','pending'),(138,1,86,'MOVE_TO_PANTRY','40','2025-08-13 12:23:52.569118','pending'),(139,3,86,'MOVE_TO_PANTRY','35','2025-08-13 12:23:52.577121','pending'),(140,5,86,'MOVE_TO_PANTRY','50','2025-08-13 12:23:52.583358','pending'),(141,7,86,'MOVE_TO_PANTRY','50','2025-08-13 12:23:52.589959','pending'),(142,3,65,'MOVE_TO_PANTRY','3','2025-09-22 14:31:19.360525','Approved'),(143,7,65,'MOVE_TO_PANTRY','5','2025-09-22 14:31:19.384740','Approved'),(144,3,72,'MOVE_TO_PANTRY','30','2025-11-21 12:27:19.148440','Approved'),(145,1,72,'MOVE_TO_PANTRY','30','2026-02-24 21:40:32.215168','Approved'),(146,3,72,'MOVE_TO_PANTRY','1','2026-02-25 00:11:51.846905','Approved'),(147,26,72,'MOVE_TO_PANTRY','50','2026-02-25 00:12:03.136495','Approved'),(148,1,72,'MOVE_TO_PANTRY','5','2026-02-25 00:12:12.321765','Approved');
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
  `vendor_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `asset` int NOT NULL DEFAULT '0',
  `invoice_amount` varchar(50) DEFAULT NULL,
  `expense_id` int NOT NULL DEFAULT '0',
  `taxable_amount` decimal(12,2) DEFAULT NULL,
  `gst_amount` decimal(12,2) DEFAULT NULL,
  `tds_amount` decimal(12,2) DEFAULT NULL,
  `final_amount` decimal(12,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `payee_type` varchar(20) DEFAULT NULL,
  `payee_id` int DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `expense_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (1,'Inv001','*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TR','2025-05-06 15:36:46.250000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(2,'inv002','uploads/invoices/1746546349850-sample-invoice.pdf','2025-05-06 21:15:49.880000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(3,'INV003','uploads/invoices/1754888791024-sample-invoice (1).pdf','2025-08-11 10:36:31.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(4,'Inv005','uploads/invoices/1754888804387-sample-invoice (1).pdf','2025-08-11 10:36:44.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(5,'InV006','uploads/invoices/1754888816167-sample-invoice (1).pdf','2025-08-11 10:36:56.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(6,'IV007','uploads/invoices/1754888826842-sample-invoice (1).pdf','2025-08-11 10:37:06.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(7,'INV09','uploads/invoices/1754888837672-sample-invoice (1).pdf','2025-08-11 10:37:17.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(8,'INV0010','uploads/invoices/1754888850255-sample-invoice (1).pdf','2025-08-11 10:37:30.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(9,'INV010','uploads/invoices/1754888864142-sample-invoice (1).pdf','2025-08-11 10:37:44.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(10,'INV012','uploads/invoices/1754888874855-sample-invoice (1).pdf','2025-08-11 10:37:54.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(11,'inv13','uploads/invoices/1754997112477-sample-invoice (1).pdf','2025-08-12 16:41:52.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(12,'inv14','uploads/invoices/1754997124356-sample-invoice (1).pdf','2025-08-12 16:42:04.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(13,'inv15','uploads/invoices/1754997136673-sample-invoice (1).pdf','2025-08-12 16:42:16.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(14,'1323','uploads/invoices/1758517564011-519bb479-5266-472d-a808-6839033732fa.pdf','2025-09-22 10:36:04.000000',NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(15,'INV5566','uploads/invoices/1758522136428-7080_20250818101124272 (2).pdf','2025-09-22 11:52:16.000000',2,'2025-09-18 00:00:00',0,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(19,'Inv6655','uploads/invoices/1758618398751-ACK341941730160725.pdf','2025-09-23 14:36:38.000000',2,'2025-09-23 00:00:00',1,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(20,'INv9999','uploads/invoices/1758618534161-sample-invoice.pdf','2025-09-23 14:38:54.000000',1,'2025-09-22 00:00:00',1,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(21,'INv9998','uploads/invoices/1758618664242-sample-invoice.pdf','2025-09-23 14:41:04.000000',1,'2025-09-22 00:00:00',1,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(22,'INV90','uploads/invoices/1762172626534-sample-invoice.pdf','2025-11-03 17:53:46.000000',16,'2025-11-03 00:00:00',1,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(23,'INV99','uploads/invoices/1762173090140-sample-invoice.pdf','2025-11-03 18:01:30.000000',14,'2025-11-03 00:00:00',1,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(24,'INVTEST','https://internalstoragearinddev.blob.core.windows.net/invoices/1763447084221-sample-invoice.pdf','2025-11-18 11:54:45.000000',13,'2025-11-18 00:00:00',1,NULL,0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(25,'INVSUPREME','https://internalstoragearinddev.blob.core.windows.net/invoices/1764136505927-sample-invoice.pdf','2025-11-26 11:25:06.000000',16,'2025-11-26 00:00:00',1,'2000',0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(26,'Inv001','https://internalstoragearinddev.blob.core.windows.net/expense-files/1768987742512-PO_PO-2026-1768974280618%20(5).pdf','2026-01-21 14:59:04.000000',6,NULL,0,NULL,11,18.00,18.00,5.00,31.00,'APPROVED',NULL,NULL,NULL,NULL),(27,'INV001','https://internalstoragearinddev.blob.core.windows.net/expense-files/1770790848341-PO_PO-2026-1770100807648%20(8).pdf','2026-02-11 11:50:53.000000',4,NULL,0,NULL,20,18.00,18.00,2.50,33.50,'APPROVED',NULL,NULL,NULL,NULL),(28,'invtest1','https://internalstoragearinddev.blob.core.windows.net/invoices/1770957958387-PO_PO-2026-1770100807648%20(8).pdf','2026-02-13 10:16:00.000000',21,'2026-02-03 00:00:00',0,'5000',0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(29,'INVCAD01','https://internalstoragearinddev.blob.core.windows.net/invoices/1770960463826-Cadell%20-%202%20Feb%2726.pdf','2026-02-13 10:57:45.000000',21,'2026-02-05 00:00:00',0,'400',0,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,NULL),(30,'inv99','https://internalstoragearinddev.blob.core.windows.net/expense-files/1771494770386-PO_PO-2026-1771325466550%20(12).pdf','2026-02-19 15:22:53.000000',21,NULL,0,NULL,21,22.00,23.00,10.00,35.00,'PENDING',NULL,NULL,NULL,NULL),(31,'INV1122','https://internalstoragearinddev.blob.core.windows.net/invoices/1771582603653-PO_PO-2026-1771497855336.pdf','2026-02-20 15:46:45.000000',21,NULL,0,NULL,31,2.00,3.00,4.00,1.00,'APPROVED',NULL,NULL,NULL,NULL);
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
  `asset` tinyint DEFAULT '0',
  `item_code` varchar(50) DEFAULT NULL,
  `gst_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_items_gst` (`gst_id`),
  CONSTRAINT `fk_items_gst` FOREIGN KEY (`gst_id`) REFERENCES `gst_master` (`gst_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Rice','kg',0,NULL,NULL),(2,'Cooking Oil','*TRIA',0,NULL,NULL),(3,'Flour','kg',0,NULL,NULL),(4,'*TRIA','*T',0,NULL,NULL),(5,'Salt','kg',0,NULL,NULL),(6,'Milk','litre',0,NULL,NULL),(7,'Eggs','dozen',0,NULL,NULL),(8,'Tomatoes','kg',0,NULL,NULL),(9,'Detergent','litre',0,NULL,NULL),(10,'*TRIAL*TRIAL','unit',0,NULL,NULL),(11,'cake','piece',0,NULL,NULL),(12,'water','pack',0,NULL,NULL),(13,'cutlet','piece',0,NULL,NULL),(14,'cookies','box',0,NULL,NULL),(15,'*TR','*TRIA',0,NULL,NULL),(16,'*TRIAL','*TRIA',0,NULL,NULL),(17,'books','piece',0,NULL,NULL),(18,'test1','kg',0,NULL,NULL),(19,'test2','kg',0,NULL,NULL),(20,'Laptop','box',1,'LAP',NULL),(21,'bag','piece',1,NULL,NULL),(22,'desktop','piece',1,'DES',NULL),(23,'chair','piece',1,NULL,NULL),(24,'test','g',1,NULL,NULL),(25,'test','g',1,'TES',NULL),(26,'test','kg',1,'testing',NULL),(27,'Books','piece',1,'BOOK',4),(28,'DESK','piece',1,'DES',3),(29,'mango','kg',0,NULL,NULL),(30,'Sugar','kg',0,NULL,NULL),(32,'TEST3','piece',0,NULL,5);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_model`
--

DROP TABLE IF EXISTS `item_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_model` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `model` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `item_model_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_model`
--

LOCK TABLES `item_model` WRITE;
/*!40000 ALTER TABLE `item_model` DISABLE KEYS */;
INSERT INTO `item_model` VALUES (1,22,'Dell'),(2,22,'HP'),(3,20,'Lenovo'),(4,20,'acer'),(5,20,'acer');
/*!40000 ALTER TABLE `item_model` ENABLE KEYS */;
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
INSERT INTO `leave_records` VALUES (29,67,'2025-06-16','2025-10-10','Admin','2025-06-16 12:08:42','Admin','2025-10-10 14:32:58'),(30,68,'2025-10-10','2025-10-10','Admin','2025-10-10 14:32:41','Admin','2025-10-10 14:32:42'),(31,67,'2025-10-10','2025-10-10','Admin','2025-10-10 14:33:02','Admin','2025-10-10 15:00:20'),(32,72,'2025-10-16','2025-10-16','Admin','2025-10-16 14:11:37','Admin','2025-10-16 14:11:38'),(33,72,'2025-10-16','2025-10-16','Admin','2025-10-16 14:11:43','Admin','2025-10-16 14:11:46');
/*!40000 ALTER TABLE `leave_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `LocationID` int NOT NULL AUTO_INCREMENT,
  `LocationCode` varchar(8) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDeleted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'HQ01','Headquarters - Floor 1',_binary '\0'),(2,'branch','Branch Office 5',_binary '\0'),(3,'WH01','Main Warehouse',_binary '\0'),(4,'4','Main Work Area',_binary '\0'),(5,'5','Reception',_binary '\0'),(6,'6','Security Entrance',_binary '\0'),(7,'7','Main Area',_binary '\0'),(8,'8','Pantry',_binary '\0'),(9,'9','Store',_binary '\0'),(10,'10','The Strategy Sphere',_binary '\0'),(11,'11','The Syndicate Chamber',_binary '\0');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
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
  `purchase_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk__m_invento__item___60a75c0f` (`item_id`),
  KEY `fk__m_invento__vendo__619b8048` (`vendor_id`),
  KEY `fk_inventory_invoice` (`invoice_id`),
  CONSTRAINT `fk__m_invento__item___60a75c0f` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `fk__m_invento__vendo__619b8048` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  CONSTRAINT `fk_inventory_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_inventory`
--

LOCK TABLES `m_inventory` WRITE;
/*!40000 ALTER TABLE `m_inventory` DISABLE KEYS */;
INSERT INTO `m_inventory` VALUES (1,1,5,'kg',504.00,1,'2025-05-02 17:08:49.727000',72,1,NULL),(2,2,0,'*TRIA',120.50,2,'2025-05-02 17:08:49.727000',65,1,NULL),(3,3,1,'kg',40.00,3,'2025-05-02 17:08:49.727000',65,2,NULL),(4,4,0,'*T',40.25,1,'2025-05-02 17:08:49.727000',65,2,NULL),(5,5,50,'*T',10.00,4,'2025-05-02 17:08:49.727000',65,1,NULL),(6,4,0,'*T',40.25,1,'2025-05-02 17:34:57.773000',65,2,NULL),(7,4,45,'g',27.00,1,'2025-05-05 12:20:38.320000',66,30,NULL),(18,2,0,'litre',33.00,2,'2025-05-06 10:03:53.843000',65,15,NULL),(21,11,6,'piece',33.00,8,'2025-05-06 12:48:27.280000',65,15,NULL),(22,6,35,'litre',33.00,4,'2025-05-06 13:07:27.580000',65,15,NULL),(23,11,6,'piece',33.00,8,'2025-05-06 13:45:53.540000',65,19,NULL),(24,8,100,'kg',33.00,7,'2025-05-06 14:31:06.680000',65,19,NULL),(26,13,15,'piece',33.00,7,'2025-05-06 21:44:19.447000',65,19,NULL),(27,14,85,'box',5.00,7,'2025-05-06 21:44:38.520000',65,19,NULL),(28,10,0,'*TRI',33.00,6,'2025-05-06 21:44:55.883000',65,28,NULL),(29,9,0,'litre',5.00,8,'2025-05-06 21:45:54.303000',65,26,NULL),(30,14,205,'box',33.00,6,'2025-05-07 10:44:05.403000',65,NULL,NULL),(32,16,20,'*TRIA',5.00,7,'2025-05-07 17:21:49.723000',65,NULL,NULL),(36,2,0,'*TRIA',5.00,7,'2025-05-08 09:48:41.030000',65,13,NULL),(42,2,0,'litre',33.00,7,'2025-05-08 10:04:14.613000',65,13,NULL),(43,1,0,'kg',33.00,7,'2025-05-08 17:43:56.923000',65,1,NULL),(44,6,1,'litre',27.00,1,'2025-08-11 14:43:50.005977',65,29,'2025-08-08'),(45,6,1,'litre',27.00,8,'2025-08-13 11:50:04.498514',86,12,'2025-08-13'),(46,5,1,'kg',33.00,NULL,'2025-09-29 15:46:50.392352',66,21,NULL),(47,1,1,'kg',27.00,NULL,'2025-09-30 17:26:21.098057',66,NULL,NULL);
/*!40000 ALTER TABLE `m_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `initiated_by` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `authorized_by` int DEFAULT NULL,
  `utr_number` varchar(100) DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `initiated_by` (`initiated_by`),
  KEY `approved_by` (`approved_by`),
  KEY `authorized_by` (`authorized_by`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expense_requests` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`initiated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_4` FOREIGN KEY (`authorized_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_items`
--

DROP TABLE IF EXISTS `purchase_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `po_id` int NOT NULL,
  `rfq_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_items`
--

LOCK TABLES `purchase_order_items` WRITE;
/*!40000 ALTER TABLE `purchase_order_items` DISABLE KEYS */;
INSERT INTO `purchase_order_items` VALUES (1,2,8,1,23.00,23.00),(2,2,9,2,34.00,68.00),(3,3,10,24,30.00,720.00),(4,3,11,12,40.00,480.00),(5,4,12,12,25.00,300.00),(6,4,13,4,400.00,1600.00),(7,5,14,5,15000.00,75000.00),(8,5,15,6,25000.00,150000.00),(9,6,24,2,3.00,6.00),(10,6,25,2,4.00,8.00),(11,7,6,12,23.00,276.00),(12,7,7,15,43.00,645.00),(15,9,28,4,5.00,20.00),(16,9,29,5,6.00,30.00),(17,10,30,4,55.00,220.00),(18,11,30,4,55.00,220.00),(19,12,30,4,55.00,220.00),(20,13,30,4,55.00,220.00),(21,14,30,4,55.00,220.00),(22,15,31,17,10.00,170.00),(23,15,32,10,20.00,200.00),(24,15,33,9,30.00,270.00),(25,16,34,8,10.00,80.00),(26,16,35,8,15.00,120.00),(27,16,36,15,20.00,300.00),(28,17,47,12,3.00,36.00),(29,17,48,15,5.00,75.00),(30,18,49,3,5.00,15.00),(31,18,50,5,7.00,35.00),(32,19,76,12,25.00,300.00),(33,19,77,14,15.00,210.00);
/*!40000 ALTER TABLE `purchase_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `po_number` varchar(50) NOT NULL,
  `vendor_id` int NOT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `po_pdf_url` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `terms` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (2,10,'PO-2026-1768470145830',3,91.00,NULL,77,'2026-01-15 09:42:25',NULL),(3,11,'PO-2026-1768889981571',6,1200.00,NULL,77,'2026-01-20 06:19:41',NULL),(4,12,'PO-2026-1768974280618',21,1900.00,NULL,77,'2026-01-21 05:44:40',NULL),(5,13,'PO-2026-1768995471800',21,225000.00,NULL,77,'2026-01-21 11:37:51',NULL),(6,17,'PO-2026-1770097372839',20,14.00,NULL,77,'2026-02-03 05:42:52',NULL),(7,9,'PO-2026-1770097938278',3,921.00,NULL,77,'2026-02-03 05:52:18',NULL),(9,20,'PO-2026-1770100807648',4,50.00,NULL,77,'2026-02-03 06:40:07','1. Price Validity: 60 Days\n2. Delivery Period: Within 30 working days from the date of confirmed order\n3.this is a testing of po t and d'),(10,21,'PO-2026-1770978825530',21,220.00,NULL,77,'2026-02-13 10:33:45','1. Price Validity: 44 Days\n2. Delivery Period: Within 45 working days from the date of confirmed order'),(11,21,'PO-2026-1770978854714',21,220.00,NULL,77,'2026-02-13 10:34:14','1. Price Validity: 44 Days\n2. Delivery Period: Within 45 working days from the date of confirmed order'),(12,21,'PO-2026-1770978918624',21,220.00,NULL,77,'2026-02-13 10:35:18','1. Price Validity: 44 Days\n2. Delivery Period: Within 45 working days from the date of confirmed order'),(13,21,'PO-2026-1770978924559',21,220.00,NULL,77,'2026-02-13 10:35:24','1. Price Validity: 44 Days\n2. Delivery Period: Within 45 working days from the date of confirmed order'),(14,21,'PO-2026-1770978924924',21,220.00,NULL,77,'2026-02-13 10:35:24','1. Price Validity: 44 Days\n2. Delivery Period: Within 45 working days from the date of confirmed order'),(15,22,'PO-2026-1771325466550',20,640.00,NULL,77,'2026-02-17 10:51:06','1. Price Validity: 37 Days\n2. Delivery Period: Within 8 working days from the date of confirmed order'),(16,31,'PO-2026-1771497855336',21,500.00,NULL,77,'2026-02-19 10:44:15','1. Price Validity: 39 Days\n2. Delivery Period: Within 4 working days from the date of confirmed order'),(17,34,'PO-2026-1772531201689',23,111.00,NULL,77,'2026-03-03 09:46:41','1. Price Validity: 30 Days\n2. Delivery Period: Within 3 working days from the date of confirmed order'),(18,35,'PO-2026-1772547154349',24,50.00,NULL,75,'2026-03-03 14:12:34','1. Price Validity: 30 Days\n2. Delivery Period: Within 3 working days from the date of confirmed order'),(19,44,'PO-2026-1773039173644',24,510.00,NULL,77,'2026-03-09 06:52:53','1. Price Validity: 30 Days\n2. Delivery Period: Within 3 working days from the date of confirmed order');
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_items`
--

DROP TABLE IF EXISTS `rfq_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `description` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `original_quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `item_id` (`item_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `rfq_items_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expense_requests` (`id`),
  CONSTRAINT `rfq_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `rfq_items_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_items`
--

LOCK TABLES `rfq_items` WRITE;
/*!40000 ALTER TABLE `rfq_items` DISABLE KEYS */;
INSERT INTO `rfq_items` VALUES (1,6,1,5.00,NULL,76,'2025-12-16 14:32:09',5),(2,6,8,12.00,NULL,76,'2025-12-16 14:32:09',12),(3,7,20,12.00,NULL,76,'2025-12-17 05:23:59',12),(4,8,13,12.00,NULL,76,'2025-12-17 09:58:18',12),(5,8,9,14.00,NULL,76,'2025-12-17 09:58:18',14),(6,9,22,12.00,NULL,76,'2025-12-17 12:19:02',12),(7,9,23,15.00,NULL,76,'2025-12-17 12:19:02',15),(8,10,22,1.00,NULL,76,'2026-01-08 06:52:46',1),(9,10,21,2.00,NULL,76,'2026-01-08 06:52:47',2),(10,11,8,20.00,NULL,76,'2026-01-15 10:26:16',20),(11,11,12,10.00,NULL,76,'2026-01-15 10:26:16',10),(12,12,13,12.00,NULL,76,'2026-01-20 08:57:01',12),(13,12,11,4.00,NULL,76,'2026-01-20 08:57:01',4),(14,13,22,5.00,NULL,76,'2026-01-21 11:18:31',5),(15,13,20,6.00,NULL,76,'2026-01-21 11:18:31',6),(16,14,6,24.00,NULL,76,'2026-01-23 11:05:24',24),(17,14,8,12.00,NULL,76,'2026-01-23 11:05:24',12),(18,14,7,31.00,NULL,76,'2026-01-23 11:05:24',31),(19,15,1,2.00,NULL,76,'2026-01-27 05:33:51',2),(20,15,2,3.00,NULL,76,'2026-01-27 05:33:51',3),(21,16,17,3.00,NULL,76,'2026-01-28 04:52:45',3),(22,16,9,4.00,NULL,76,'2026-01-28 04:52:45',4),(23,16,14,3.00,NULL,76,'2026-01-28 04:52:45',3),(24,17,20,2.00,NULL,76,'2026-01-28 08:18:05',2),(25,17,21,2.00,NULL,76,'2026-01-28 08:18:05',2),(26,19,27,2.00,NULL,76,'2026-01-29 07:00:21',2),(27,19,28,4.00,NULL,76,'2026-01-29 07:00:21',4),(28,20,27,4.00,NULL,76,'2026-02-03 06:08:13',4),(29,20,28,5.00,NULL,76,'2026-02-03 06:08:13',5),(30,21,29,4.00,'frfrf',76,'2026-02-13 09:12:11',4),(31,22,27,13.00,NULL,76,'2026-02-17 05:29:30',13),(32,22,29,7.00,NULL,76,'2026-02-17 05:29:30',7),(33,22,30,5.00,NULL,76,'2026-02-17 05:29:30',5),(34,31,12,5.00,NULL,76,'2026-02-19 10:23:19',5),(35,31,13,10.00,NULL,76,'2026-02-19 10:23:19',10),(36,31,17,15.00,NULL,76,'2026-02-19 10:23:19',15),(37,25,22,3.00,NULL,76,'2026-02-24 06:13:35',3),(38,25,29,5.00,NULL,76,'2026-02-24 06:13:35',5),(39,24,5,12.00,NULL,76,'2026-02-26 10:23:42',12),(40,24,20,23.00,NULL,76,'2026-02-26 10:23:42',23),(41,23,30,13.00,NULL,76,'2026-02-26 10:49:12',13),(42,23,29,34.00,'dffdf',76,'2026-02-26 10:49:12',34),(43,32,30,12.00,NULL,76,'2026-02-27 13:43:41',12),(44,32,29,4.00,NULL,76,'2026-02-27 13:43:41',4),(45,33,30,4.00,NULL,76,'2026-02-27 13:53:17',4),(46,33,29,4.00,NULL,76,'2026-02-27 13:53:17',4),(47,34,29,12.00,NULL,76,'2026-03-02 05:32:31',12),(48,34,30,15.00,NULL,76,'2026-03-02 05:32:31',15),(49,35,27,3.00,NULL,76,'2026-03-03 08:06:05',2),(50,35,29,5.00,NULL,76,'2026-03-03 08:06:05',4),(51,36,29,45.00,NULL,76,'2026-03-03 09:32:38',45),(52,36,30,55.00,NULL,76,'2026-03-03 09:32:38',55),(53,37,29,3.00,NULL,76,'2026-03-04 10:21:15',2),(54,37,27,3.00,NULL,76,'2026-03-04 10:21:15',3),(55,38,29,4.00,NULL,76,'2026-03-04 10:22:09',3),(56,38,30,5.00,NULL,76,'2026-03-04 10:22:09',4),(57,39,30,12.00,NULL,76,'2026-03-05 09:32:23',12),(58,39,29,23.00,NULL,76,'2026-03-05 09:32:23',23),(59,40,29,12.00,NULL,76,'2026-03-05 09:39:36',12),(60,40,30,31.00,NULL,76,'2026-03-05 09:39:36',31),(65,41,29,2.00,NULL,76,'2026-03-05 15:40:37',2),(66,41,30,3.00,NULL,76,'2026-03-05 15:40:37',3),(70,42,29,23.00,NULL,76,'2026-03-09 04:37:13',23),(71,42,30,12.00,NULL,76,'2026-03-09 04:37:13',12),(74,43,30,12.00,NULL,76,'2026-03-09 06:23:00',12),(75,43,30,2.00,NULL,76,'2026-03-09 06:23:00',2),(76,44,29,13.00,NULL,76,'2026-03-09 06:40:08',12),(77,44,30,15.00,NULL,76,'2026-03-09 06:40:08',14),(78,45,30,21.00,NULL,77,'2026-03-09 10:31:35',21),(79,45,30,32.00,NULL,77,'2026-03-09 10:31:35',32),(80,46,30,12.00,NULL,76,'2026-03-09 10:55:49',12),(81,46,29,14.00,NULL,76,'2026-03-09 10:55:49',14),(82,47,30,12.00,NULL,77,'2026-03-10 09:35:26',12),(83,47,29,31.00,NULL,77,'2026-03-10 09:35:26',31),(84,48,29,11.00,NULL,77,'2026-03-10 12:10:34',11),(85,48,30,23.00,'fff',77,'2026-03-10 12:10:34',23);
/*!40000 ALTER TABLE `rfq_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hierarchy_level` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (40,'Admin','2025-12-02 05:22:02',6),(41,'User','2024-12-16 06:45:04',0),(42,'Temp User','2024-12-16 06:45:04',0),(43,'Department Executive','2025-12-02 05:20:25',1),(44,'Department Manager','2025-12-02 05:20:25',2),(45,'Finance Executive','2025-12-02 05:20:25',3),(46,'Finance Manager','2025-12-02 05:20:25',4),(47,'Centre Head','2025-12-02 05:20:25',5);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `StaffID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Team` varchar(100) DEFAULT NULL,
  `Location` varchar(100) DEFAULT NULL,
  `PictureURL` varchar(2083) DEFAULT NULL,
  PRIMARY KEY (`StaffID`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Alice Johnson','Finance','2','uploads/images/1761047399334.jpeg'),(2,'Bob Smith','IT','1','https://example.com/pictures/bob.jpg'),(3,'Charlie Brown','Admin','1','https://example.com/pictures/charlie.jpg'),(4,'testing','arbor','2','uploads/images/1761047360393.png'),(7,'arun','IT','2',NULL),(8,'Anu Ben','Engineering','1',NULL),(9,'Gautham Suresh','Engineering','2',NULL),(10,'Gayathry Gomathy','Finance','1',NULL),(11,'George Chacko Manchimala','Engineering','1',NULL),(12,'Jeenu Janakakumar','Engineering','2',NULL),(13,'Jeeshan Ahamed','Engineering','1',NULL),(14,'Joslin Selva','Engineering','2',NULL),(15,'Kalaivanan M','Engineering','1',NULL),(16,'Kevin Daniel Wilson','Engineering','2',NULL),(17,'Logesh S','Engineering','1',NULL),(18,'Maneesha Krishnan','Engineering','2',NULL),(19,'Mareena Kanakaraj','Engineering','2',NULL),(20,'Megha Miriam John','Engineering','1',NULL),(21,'Mohammed Misab','Engineering','2',NULL),(22,'Mohammed Shahabas E V','Engineering','2',NULL),(23,'Nikhil Chandran','Engineering','2',NULL),(24,'Praveen Surendranath','Engineering','1',NULL),(25,'Rajalakshmi','HR','1',NULL),(26,'Ranimol T George','Engineering','1',NULL),(27,'Ranjith Manoharan','Engineering','1',NULL),(28,'Ritty Varghese','Engineering','2',NULL),(29,'Rufus Mathew','Engineering','2',NULL),(30,'Samynathan Arumugham','Engineering','1',NULL),(31,'Shahul Hameed Raheem','Engineering','2',NULL),(32,'Shameer PP','Engineering','1',NULL),(33,'Shamnadh Abdul','Engineering','2',NULL),(34,'Sharath Anilkumar','Engineering','1',NULL),(35,'Shyam Gopinath','HR','1',NULL),(36,'Smita Panangavil','Admin','1',NULL),(37,'Sruti Ann Chesterfield','Engineering','1',NULL),(38,'Subod Kanakappan Vasantha','Engineering','1',NULL),(39,'Thousiya Mol A S','Engineering','2',NULL),(40,'Unnikrishnan','Engineering','2',NULL),(41,'Vijay Prahladan','Engineering','2',NULL),(42,'Vinushma Jayakumar','Engineering','1',NULL),(43,'Vishnu Dileepkumar','Engineering','2',NULL),(45,'Yedhu Krishnan','Engineering','2',NULL);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subclasstype`
--

DROP TABLE IF EXISTS `subclasstype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subclasstype` (
  `SubClassID` int NOT NULL AUTO_INCREMENT,
  `SubClassCode` varchar(8) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDeleted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`SubClassID`),
  UNIQUE KEY `SubClassCode` (`SubClassCode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subclasstype`
--

LOCK TABLES `subclasstype` WRITE;
/*!40000 ALTER TABLE `subclasstype` DISABLE KEYS */;
INSERT INTO `subclasstype` VALUES (1,'FIN01','Equity Instruments',_binary '\0'),(2,'INT01','Patents & Licenses',_binary '\0'),(3,'TAN01','Office Equipment',_binary '\0');
/*!40000 ALTER TABLE `subclasstype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `profileimage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`DeptID`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (66,'Admin','$2y$12$Rlp/m/W/gZNLuDIsP.vik.4eGfaBD6NeQXl9Z1VFlPesxfN4xdraK',40,'2024-12-17 12:37:08',NULL,1,'2025-10-10 08:52:24','Admin',NULL,'2025-10-10 14:22:24',NULL,NULL),(67,'PradeepkumarSecurity015','$2y$12$l91FF/zU.D2/aQFbi1zUDOVNIwXN3zGgXRvcz.hqO85ojK5zDe4OC',41,'2024-12-17 18:30:00','2025-06-16',1,'2025-10-10 09:30:20','Admin','Admin','2025-10-10 15:00:20',NULL,NULL),(68,'AasishBhadranSecurity014','$2y$12$3OvMn3UZDOGJAeA8R7p/ee5NILoP37TBGiYt8xVwbsawHXd3Urhqi',41,'2024-12-17 18:30:00',NULL,1,'2025-10-10 09:02:42','Admin',NULL,'2025-10-10 14:32:42',NULL,NULL),(69,'LaluTSSecurity013','$2y$12$oB9Bu2GDCcEmuFDvL/XpgO7UHLs7pNhrHFpXhsADpNpvLvrJTEO7a',41,'2024-12-17 18:30:00',NULL,1,'2024-12-18 06:41:56','Admin',NULL,NULL,NULL,NULL),(71,'ArunSasiSecurity015','$2y$12$m8N5C.21dLBJcv9SZpFC1eJhXSM4ksJhqF31cjIKUA6u46A4ztQdy',41,'2025-05-31 18:30:00',NULL,1,'2025-10-10 08:52:00','Admin',NULL,'2025-10-10 14:22:00',NULL,NULL),(72,'unni','$2b$12$vMm9OaeXKNnDQMF31pqj6ef3zG9QkLXyDH/x3xqFNvsxUKFucNU1S',40,'2025-10-14 12:16:42',NULL,1,'2025-10-16 08:41:46','Admin','Admin','2025-10-16 14:11:46',NULL,NULL),(73,'unnik','$2b$12$u0bYjovRkB9KXgS44.g.vOz/k0wu8cZMXLuvrwwJw/kPYTCQYsh5S',41,'2025-10-16 08:44:01',NULL,1,'2025-10-16 08:44:01','Admin',NULL,NULL,NULL,NULL),(75,'CH','$2b$12$H/vjstTkaLBaFE4VSNIxp.120IIURvwzfti4dzOtiLT/nSQ2tI0Je',47,'2025-12-02 06:01:53',NULL,1,'2025-12-03 19:06:21','Admin','Admin','2025-12-04 00:36:21',NULL,NULL),(76,'DE','$2b$12$OkYvlWc.PkY4NCA.85t3Geh94WHKuUuNeI7ce6IRkzZ5umAAajwki',43,'2025-12-03 19:05:14',NULL,1,'2025-12-04 05:23:48','Admin','Admin','2025-12-04 10:53:48',NULL,NULL),(77,'DM','$2b$12$B58t1f4rH92qPMdTSqq3FuDJKkMrr4WUr2DsPl7atnbwl1xKiOIya',44,'2025-12-03 19:05:28',NULL,1,'2025-12-03 19:05:28','Admin',NULL,NULL,NULL,NULL),(78,'FE','$2b$12$Jen3mZlNAr1BteAXDkXPh.XWRz5SJ/KG.qcaKGpgz0YT9RONbJ/X6',45,'2025-12-03 19:05:42',NULL,1,'2025-12-03 19:05:42','Admin',NULL,NULL,NULL,NULL),(79,'FM','$2b$12$a5LE7TV5.QmaLrKCVpqKCet8VaOKzQVrZx7Op2VgMJwQIm5p4XvW2',46,'2025-12-03 19:06:05',NULL,1,'2025-12-03 19:06:05','Admin',NULL,NULL,NULL,NULL),(80,'check','$2b$12$H9ps84PaGBU5S/0KfagDPOakHVCjL200rwLf59p4k3892ZBA9s/1a',41,'2026-03-03 05:10:01',NULL,1,'2026-03-03 05:10:01','Admin',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_verifications`
--

DROP TABLE IF EXISTS `vendor_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_id` int NOT NULL,
  `verified_by` int NOT NULL,
  `verification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `remarks` text,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `verified_by` (`verified_by`),
  CONSTRAINT `vendor_verifications_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expense_requests` (`id`),
  CONSTRAINT `vendor_verifications_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_verifications`
--

LOCK TABLES `vendor_verifications` WRITE;
/*!40000 ALTER TABLE `vendor_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_verifications` ENABLE KEYS */;
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
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `asset` int NOT NULL DEFAULT '0',
  `gstin` varchar(50) DEFAULT NULL,
  `gst_rate` decimal(5,2) DEFAULT '0.00',
  `tds_rate` decimal(5,2) DEFAULT '0.00',
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Fresh Foods Co.','9876543210','*TRIAL*TRIAL*TRIAL*TRI','2025-05-02 17:05:51.380000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(2,'Kitchen Essentials Ltd.','*TRIAL*TRI','support@kitchenessentials.com','2025-05-02 17:05:51.380000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(3,'Global Grocers','9988776655','*TRIAL*TRIAL*TRIAL*TRIA','2025-05-02 17:05:51.380000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(4,'Daily Supply Corp.','9012345678','info@dailysupply.com','2025-05-02 17:05:51.380000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(5,'Urban Pantry','*TRIAL*TRI','*TRIAL*TRIAL*TRIAL*TR','2025-05-02 17:05:51.380000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(6,'supreme','88878737373','','2025-05-06 12:32:40.540000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(7,'*TRI','7288229222','','2025-05-06 12:33:20.727000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(8,'kunnil','8182828282','','2025-05-06 12:34:02.860000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(9,'test','9999999999','test.2345@gmaill.com','2025-06-04 10:35:13.000000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(10,'test','7288229222','test.2345@gmaill.com','2025-06-04 14:39:23.000000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(11,'test','7288229222','test.2345@gmaill.com','2025-06-04 14:41:18.000000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(12,'test','7288229222','test.2345@gmaill.com','2025-06-04 14:41:41.000000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(13,'testasset','7288229222','test.2345@gmaill.com','2025-09-23 15:17:30.000000',1,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(14,'test3','7288229222','unnikrishnan.km@arbor-education.com','2025-09-30 17:10:31.000000',1,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(15,'test','9090909090','test1@gmail.com','2025-11-03 17:17:14.000000',0,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(16,'test','9098909890','test3@gmail.com','2025-11-03 17:25:21.000000',1,NULL,0.00,0.00,'2025-12-03 23:29:07.345949',1),(17,'Furniture World','9876543210','sales@furnitureworld.com','2025-12-03 23:29:30.857954',0,'29ABCDE1234F1Z5',0.18,0.00,'2025-12-03 23:29:30.857954',1),(18,'City Water Supply','9000001122','bill@citywater.com','2025-12-03 23:29:30.857954',0,'29WATSUP1234F1Z0',0.00,0.00,'2025-12-03 23:29:30.857954',1),(19,'Tasty Snacks & Tea','9888899990','orders@tasty.com','2025-12-03 23:29:30.857954',0,'29SNACK1234F1Z5',0.05,0.00,'2025-12-03 23:29:30.857954',1),(20,'Elite Consultants','9877700001','accounts@elitecons.com','2025-12-03 23:29:30.857954',0,'29ELITE1234F1Z9',0.18,0.10,'2025-12-03 23:29:30.857954',1),(21,'SafeGuard Security','9000055551','billing@safeguard.com','2025-12-03 23:29:30.857954',0,'29SECURE1234F1Z5',0.18,0.02,'2025-12-03 23:29:30.857954',1),(22,'Arbion',NULL,NULL,'2026-02-04 14:47:31.539322',0,NULL,0.00,2.00,'2026-02-04 14:47:31.539322',1),(23,'Deepan Trade Solutions Pvt Ltd',NULL,NULL,'2026-02-04 14:55:51.271537',0,NULL,0.00,NULL,'2026-02-04 14:55:51.271537',1),(24,'DTDC Courier',NULL,NULL,'2026-02-04 15:00:09.807210',0,NULL,0.00,0.00,'2026-02-04 15:00:09.807210',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitors`
--

LOCK TABLES `visitors` WRITE;
/*!40000 ALTER TABLE `visitors` DISABLE KEYS */;
INSERT INTO `visitors` VALUES (91,'2025-01-07 10:52:15','Test','AQUEGUARD','3333333333','Visit Smita','2025-01-07 16:22:15','2025-01-07 10:53:26',36,68,68,'',0,1,NULL,NULL),(92,'2025-01-07 10:54:33','VISHNU','AQUEGUARD','6282225732','Visit Smita','2025-01-07 16:24:33','2025-01-07 10:56:47',35,68,68,'REPAIR WATERPURIFY AQUE GUARD',0,1,NULL,NULL),(93,'2025-01-07 10:56:06','reshmi mohan','visitor','9895355777','abilash','2025-01-07 16:26:06','2025-01-07 10:57:17',36,68,68,'',0,1,NULL,NULL),(94,'2025-01-07 11:06:58','Abhilash','RBR Solution','9821800003','Visit Smita','2025-01-07 16:36:58','2025-01-07 11:07:48',36,69,69,'',0,3,NULL,NULL),(95,'2025-01-07 11:16:35','vishnulal s p.','interview','8281235181','shyam','2025-01-07 16:46:35','2025-01-07 11:17:18',35,67,67,'',0,1,NULL,NULL),(96,'2025-01-10 08:05:08','karthik','coffee day','7736303602','service','2025-01-10 13:35:08','2025-01-13 05:18:55',35,67,68,'',0,1,NULL,NULL),(97,'2025-01-11 08:21:05','kiran j','pest control','7012815490','service','2025-01-11 13:51:05','2025-01-13 05:22:14',36,67,68,'',0,1,NULL,NULL),(98,'2025-01-11 09:14:47','bindhu','H K F','8921119757','service','2025-01-11 14:44:47','2025-01-13 05:22:30',37,67,68,'',0,1,NULL,NULL),(99,'2025-01-13 05:21:56','Rizna ','interview','8136918804','shyam','2025-01-13 10:51:56','2025-01-13 06:39:48',35,68,68,'interview',0,1,NULL,NULL),(100,'2025-01-13 05:46:47','Ababeel','interview','8921516377','shyam','2025-01-13 11:16:47','2025-01-13 07:32:33',36,68,68,'interview',0,1,NULL,NULL),(101,'2025-01-14 05:45:17','adwaith s','arbor','9895070149','interview','2025-01-14 11:15:17','2025-01-14 13:03:09',35,67,67,'',0,1,NULL,NULL),(102,'2025-01-15 05:13:03','Anjana M N','Interview','9072929344','Interview','2025-01-15 10:43:03','2025-01-15 06:54:52',35,69,69,'',0,1,NULL,NULL),(103,'2025-01-22 05:48:11','Kanakesh','HI Point Connect','9895925021','Visit Smita/Samy&#039;s Laptop Issue','2025-01-22 11:18:11','2025-01-22 06:12:10',35,68,68,'Laptop service',0,1,'Admin','2025-01-22 16:12:20'),(104,'2025-01-24 05:38:46','Prakash','Hevaco','9567863396','A C Service','2025-01-24 11:08:46','2025-01-24 11:33:59',35,69,69,'',0,3,NULL,NULL),(105,'2025-01-25 05:29:33','Gokul','Rentokil','8138862635','Pest countrol','2025-01-25 10:59:33','2025-01-25 05:49:25',35,68,68,'Pest countrol',0,1,NULL,NULL),(106,'2025-01-25 05:57:01','Abin','Hevaco','7085062782','A/C Maintance','2025-01-25 11:27:01','2025-01-25 07:10:00',35,68,68,'A/C Maintance',0,1,NULL,NULL),(107,'2025-01-28 06:59:39','pradeep','chair service','9847109109','smitha','2025-01-28 12:29:39','2025-01-28 07:01:12',35,67,67,'',0,1,NULL,NULL),(108,'2025-02-03 05:04:46','Sibi','M2','8138833494','Visit Smita','2025-02-03 10:34:46','2025-02-03 05:05:07',35,68,68,'Water Reading',0,1,NULL,NULL),(109,'2025-02-03 05:19:04','Vivek','Arbion','7907157806','Visit Smita','2025-02-03 10:49:04','2025-02-03 05:19:23',35,68,68,'Housekeeping',0,1,NULL,NULL),(110,'2025-02-04 04:20:39','Lewis Tasker','Arbor','8606389644','Guest','2025-02-04 09:50:39','2025-02-04 11:28:49',35,68,69,'Guest',0,1,NULL,NULL),(111,'2025-02-04 05:58:25','Simi','AFC','9061224132','Gayathri','2025-02-04 11:28:25','2025-02-04 08:15:24',36,68,68,'',0,1,NULL,NULL),(112,'2025-02-05 04:08:11','Lewis Tasker','Arbor','8606389644','Guest','2025-02-05 09:38:11','2025-02-05 11:08:20',35,69,68,'Laptop',0,1,NULL,NULL),(113,'2025-02-06 03:49:17','Lewis Tasker','Arbor','8606389644','Guest','2025-02-06 09:19:17','2025-02-06 10:38:35',35,68,69,'Guest',0,1,NULL,NULL),(114,'2025-02-06 07:03:56','Aditi R ','Mitara','9895114581','shyam','2025-02-06 12:33:56','2025-02-06 07:46:47',36,68,68,'',0,1,NULL,NULL),(115,'2025-02-06 12:32:11','Lintu','Rentokil','8956077547','Air fershner Service','2025-02-06 18:02:11','2025-02-06 12:40:06',36,69,69,'',0,2,NULL,NULL),(116,'2025-02-07 05:11:02','Lewis Tasker','Arbor','8606398644','Guest','2025-02-07 10:41:02','2025-02-07 11:35:21',35,68,66,'Guest',0,1,NULL,NULL),(117,'2025-02-08 08:33:19','kiran ','Rentokil','7012845490','Pest control','2025-02-08 14:03:19','2025-02-08 08:34:03',35,68,68,'Pest control',0,1,NULL,NULL),(118,'2025-02-14 07:34:22','karthik','coffee day','7736303607','Coffee mechine service','2025-02-14 13:04:22','2025-02-14 07:39:17',35,68,68,'Coffee mechine service',0,1,NULL,NULL),(119,'2025-02-17 10:37:55','Sreejith','ICICI Bank','7736863524','Gayathri','2025-02-17 16:07:55','2025-02-17 10:44:19',35,68,68,'',0,1,NULL,NULL),(120,'2025-02-19 04:27:04','Vivek','Arbion','7907157806','Visit Smita','2025-02-19 09:57:04','2025-02-19 04:28:22',35,68,68,'',0,1,NULL,NULL),(121,'2025-02-19 05:22:01','Madhu j','Technopark','9387375329','Visit Smita','2025-02-19 10:52:01','2025-02-19 07:30:52',35,68,68,'Fire and Sefty traning',0,1,NULL,NULL),(122,'2025-02-20 06:25:55','Sayanth','Tech Mastors','9846422221','shyam','2025-02-20 11:55:55','2025-02-20 06:42:54',35,68,68,'',0,2,NULL,NULL),(123,'2025-02-22 07:09:27','Gokul','Rentokil','8138862635','Pest control','2025-02-22 12:39:27','2025-02-22 07:10:20',35,69,69,'',0,1,NULL,NULL),(124,'2025-02-24 11:34:17','heedstan','arbion','9061006622','Visit Smita','2025-02-24 17:04:17','2025-02-24 11:35:03',35,67,67,'',0,2,NULL,NULL),(125,'2025-02-25 05:59:26','Vivek','Arbion','7907157806','Visit Smita','2025-02-25 11:29:26','2025-02-25 06:01:17',35,68,68,'',0,2,NULL,NULL),(126,'2025-02-25 07:30:31','Murali','Greenplacement','9447411454','Visit Smita','2025-02-25 13:00:31','2025-02-25 08:01:43',35,68,68,'',0,2,NULL,NULL),(127,'2025-02-27 07:50:42','Amal','Hevaco','8590421213','A/C Maintance','2025-02-27 13:20:42','2025-02-27 07:52:02',35,68,68,'',0,1,NULL,NULL),(128,'2025-03-01 08:04:32','Rajeev','Noster','9995637791','Pantry water pipe repairing','2025-03-01 13:34:32','2025-03-01 08:11:32',35,68,68,'',0,2,NULL,NULL),(129,'2025-03-03 05:23:11','Sushil','SNIQSYS','9895209214','shyam','2025-03-03 10:53:11','2025-03-03 06:31:07',35,68,68,'',0,2,NULL,NULL),(130,'2025-03-03 06:59:05','Sibi','M2','8138833494','Water reading','2025-03-03 12:29:05','2025-03-03 07:00:09',35,68,68,'',0,1,NULL,NULL),(131,'2025-03-07 05:28:39','Revathy','Greenplacement','9995561645','H/K Supervicer','2025-03-07 10:58:39','2025-03-07 05:58:07',35,68,68,'',0,1,NULL,NULL),(132,'2025-03-08 06:36:25','kiran ','Rentokil','7012845490','Pest control','2025-03-08 12:06:25','2025-03-08 06:39:19',35,68,68,'Pest control',0,1,NULL,NULL),(133,'2025-03-12 08:36:23','karthik','coffee day','7736303607','Coffee mechine service','2025-03-12 14:06:23','2025-03-12 08:37:09',35,68,68,'',0,1,NULL,NULL),(134,'2025-03-17 05:17:03','Josli','interview','8714532170','interview','2025-03-17 10:47:03','2025-03-17 08:24:21',35,68,68,'interview',0,1,NULL,NULL),(135,'2025-03-18 07:41:09','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-18 13:11:09','2025-03-18 07:43:02',35,68,68,'',0,1,NULL,NULL),(136,'2025-03-19 05:23:34','Jithin','Giltech','8589995562','Visit Smita','2025-03-19 10:53:34','2025-03-19 05:26:17',35,68,68,'Peppar gilt repairing',0,1,NULL,NULL),(137,'2025-03-19 08:07:20','Vibin','Tamara','6282961971','Visit Smita','2025-03-19 13:37:20','2025-03-19 08:14:00',35,68,68,'',0,1,NULL,NULL),(138,'2025-03-20 05:19:29','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-20 10:49:29','2025-03-20 05:48:53',35,68,68,'',0,1,NULL,NULL),(139,'2025-03-24 05:49:16','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-24 11:19:16','2025-03-24 06:00:50',35,68,68,'',0,1,NULL,NULL),(140,'2025-03-25 05:45:38','Sneha','ICICI Bank','8655980225','Gayathri','2025-03-25 11:15:38','2025-03-25 05:52:55',35,68,68,'',0,2,NULL,NULL),(141,'2025-03-29 06:25:30','Vinod','V S A','9995712232','Measuring','2025-03-29 11:55:30','2025-03-29 07:24:00',36,69,69,'',0,1,NULL,NULL),(142,'2025-03-29 07:20:28','kiran ','Rentokil','7012845490','Pest control','2025-03-29 12:50:28','2025-03-29 07:20:58',35,69,69,'',0,1,NULL,NULL),(143,'2025-04-01 07:23:40','sibi','M2','8138833494','water reading','2025-04-01 12:53:40','2025-04-01 07:24:16',35,67,67,'',0,2,NULL,NULL),(144,'2025-04-02 12:49:34','Shinto','M2','9349769667','Electrical','2025-04-02 18:19:34','2025-04-02 12:49:48',35,69,69,'',0,1,NULL,NULL),(145,'2025-04-05 06:18:22','kiran ','Rentokil','7012845490','Pest control','2025-04-05 11:48:22','2025-04-05 06:18:38',36,69,69,'',0,1,NULL,NULL),(146,'2025-04-07 10:17:00','Sibi','M2','9778688275','ACchecking','2025-04-07 15:47:00','2025-04-09 05:57:04',35,69,68,'',0,1,NULL,NULL),(147,'2025-04-09 05:58:36','VISHNU','AQUEGUARD','6282225738','AQUEGUARD SERVCE','2025-04-09 11:28:36','2025-04-09 06:18:04',35,68,68,'',0,1,NULL,NULL),(148,'2025-04-09 07:22:13','Sreeju','Rentokil','8485093644','Air fershner Service','2025-04-09 12:52:13','2025-04-09 07:23:45',35,68,68,'',0,2,NULL,NULL),(149,'2025-04-10 06:45:16','karthik','coffee day','7736303607','Coffee mechine service','2025-04-10 12:15:16','2025-04-10 06:52:50',35,68,68,'Coffee mechine service',0,1,NULL,NULL),(150,'2025-04-16 05:40:38','Revathy','Greenplacement','9995567645','Visit Smita','2025-04-16 11:10:38','2025-04-16 05:57:33',35,68,68,'',0,1,NULL,NULL),(151,'2025-04-22 09:33:56','Sibi','M square','9778688275','plumbing','2025-04-22 15:03:56','2025-04-22 09:55:37',35,69,69,'',0,4,NULL,NULL),(152,'2025-04-24 05:36:42','Simi','AFC','9061224132','Gayathri','2025-04-24 11:06:42','2025-04-24 10:34:16',35,68,69,'',0,1,NULL,NULL),(153,'2025-04-25 04:29:57','Kanakesh','HI Point ','9895925021','net work checking','2025-04-25 09:59:57','2025-04-25 04:30:08',35,69,69,'',0,1,NULL,NULL),(154,'2025-05-01 05:59:15','Shinto','M2','9349769667','Water reading','2025-05-01 11:29:15','2025-05-01 05:59:38',35,69,69,'',0,1,NULL,NULL),(155,'2025-05-03 06:18:02','Kanakesh','HI Point ','9895925021','net work checking','2025-05-03 11:48:02','2025-05-03 10:23:48',35,69,69,'',0,1,NULL,NULL),(156,'2025-05-08 08:08:52','karthik','coffee day','7736303607','Coffee mechine service','2025-05-08 13:38:52','2025-05-08 08:14:02',35,69,69,'',0,1,NULL,NULL),(157,'2025-05-12 05:25:20','Thushara','Praanaa','8075395651','shyam','2025-05-12 10:55:20','2025-05-12 07:24:49',37,69,69,'',0,1,NULL,NULL),(158,'2025-05-12 08:18:48','Anoop','ICICI Bank','8075811854','George','2025-05-12 13:48:48','2025-05-12 08:35:05',36,69,69,'',0,2,NULL,NULL),(159,'2025-05-12 10:28:48','Thosiya','Arbor','7560816869','interview','2025-05-12 15:58:48','2025-05-12 11:31:04',36,69,69,'',0,1,NULL,NULL),(160,'2025-05-14 12:10:25','faizal','thomascook','9744208040','Gayathri','2025-05-14 17:40:25','2025-05-14 12:11:04',36,67,67,'',0,1,NULL,NULL),(161,'2025-05-21 09:58:37','kavin','Interview','8281862590','interview','2025-05-21 15:28:37','2025-05-21 09:58:58',37,67,67,'',0,1,NULL,NULL),(162,'2025-05-22 08:25:40','Abhishek','HI Point ','8078983484','service','2025-05-22 13:55:40','2025-05-22 09:02:56',37,69,69,'',0,1,NULL,NULL),(163,'2025-05-24 10:01:29','Prashanth ','Rentokil','9995688875','Pest control','2025-05-24 15:31:29','2025-05-24 10:02:05',37,68,68,'',0,1,NULL,NULL),(164,'2025-05-28 05:09:46','Satheesh','Rentokil','9207160863','Air freshner','2025-05-28 10:39:46','2025-05-28 05:10:09',37,69,69,'',0,1,NULL,NULL),(165,'2025-05-28 06:03:59','Revathy','Greenplacement','9995561645','H/K Checking','2025-05-28 11:33:59','2025-05-28 06:32:21',37,69,69,'',0,1,NULL,NULL),(166,'2025-05-28 10:55:12','Test','Test','8778878866','Test','2025-05-28 16:25:12','2025-05-28 11:13:31',36,66,66,'',0,1,NULL,NULL),(167,'2025-05-28 11:58:22','test1','test','9895491596','test','2025-05-28 17:28:22','2025-05-28 12:03:41',36,66,66,'',0,1,NULL,NULL),(168,'2025-05-29 07:38:48','Shinto','M2','9349769617','checking','2025-05-29 13:08:48','2025-05-29 08:38:45',36,69,69,'',0,1,NULL,NULL),(169,'2025-05-29 23:58:37','Godwin','fire','9496153857','fire','2025-05-30 05:28:37','2025-05-29 23:58:44',36,68,68,'27/05/2025',0,1,NULL,NULL),(170,'2025-05-30 00:01:34','Kanagesh','HI Point ','9895985021','Visit Smita','2025-05-30 05:31:34','2025-05-30 00:01:39',36,68,68,'27/05/2025',0,1,NULL,NULL),(171,'2025-05-30 00:03:14','satheesh','Rentokil','9207160863','Air fershner Service','2025-05-30 05:33:14','2025-05-30 00:03:23',36,68,68,'27/05/2025',0,1,NULL,NULL),(172,'2025-05-30 06:09:06','test1','test','9999999999','test','2025-05-30 11:39:06','2025-05-30 09:48:16',36,66,66,'11',0,9,NULL,NULL),(173,'2025-06-02 06:15:51','Sibi','M2','8138833494','Water reading','2025-06-02 11:45:51','2025-06-02 06:16:08',36,69,69,'',0,1,NULL,NULL),(174,'2025-06-05 10:16:43','Satheesh','Rentokil','9207160863','Air fershner Service','2025-06-05 15:46:43','2025-06-05 10:29:36',35,68,68,'',0,1,NULL,NULL),(175,'2025-06-05 15:10:21','Rejin','HI Point ','9496068337','Visit Smita','2025-06-05 20:40:21','2025-06-05 15:10:27',36,68,68,'02/06/2025',0,1,NULL,NULL),(176,'2025-06-05 15:11:54','Rejin','HI Point ','9496068337','Visit Smita','2025-06-05 20:41:54','2025-06-05 15:11:58',36,68,68,'02/06/2025',0,1,NULL,NULL),(177,'2025-06-05 17:17:38','Prakash','Hevaco','9567863396','A C Service','2025-06-05 22:47:38','2025-06-05 17:17:57',36,69,69,'03/06/2025',0,2,NULL,NULL),(178,'2025-06-05 17:23:17','ArunGopal','ICICI Bank','9846002879','Gayathri','2025-06-05 22:53:17','2025-06-05 17:24:01',37,69,69,'04/06/2025',0,1,NULL,NULL),(179,'2025-06-07 06:45:46','Nithin','Rentokil','9526413182','Pest control','2025-06-07 12:15:46','2025-06-07 07:13:35',35,68,68,'',0,1,NULL,NULL),(180,'2025-06-09 05:53:57','Simi','AFC','9061224132','Gayathri','2025-06-09 11:23:57','2025-06-10 05:59:28',35,69,69,'',0,1,NULL,NULL),(181,'2025-06-10 07:21:04','Simi','AFC','9061224132','Gayathri','2025-06-10 12:51:04','2025-06-11 10:02:47',36,69,68,'',0,1,NULL,NULL),(182,'2025-06-11 10:03:32','Revathy','Greenplacement','9995561645','Visit Smita','2025-06-11 15:33:32','2025-06-11 10:03:36',35,68,68,'',0,1,NULL,NULL),(183,'2025-06-11 10:04:41','Simi','AFC','9061224132','Gayathri','2025-06-11 15:34:41','2025-06-11 17:48:56',36,68,69,'',0,1,NULL,NULL),(184,'2025-06-13 09:44:08','Jounne','Arbor','8129078474','George','2025-06-13 15:14:08','2025-06-13 10:21:04',35,68,68,'',0,1,NULL,NULL),(185,'2025-06-16 06:28:16','Jithu','HI Point ','9656984771','System install','2025-06-16 11:58:16','2025-06-16 06:50:26',35,69,69,'',0,1,NULL,NULL),(186,'2025-06-17 08:21:33','EmilyDause','Arbor','8606389644','Guest','2025-06-17 13:51:33','2025-06-19 11:16:58',35,69,68,'',0,1,NULL,NULL),(187,'2025-06-17 08:23:14','Phillipp De Ath','Arbor','8606389644','Guest','2025-06-17 13:53:14','2025-06-19 11:17:07',36,69,68,'',0,1,NULL,NULL),(188,'2025-06-18 12:17:37','Shibu','Sweet Garden','9349141474','plant','2025-06-18 17:47:37','2025-06-18 12:32:20',37,69,69,'',0,1,NULL,NULL),(189,'2025-06-19 08:23:43','Shamnadh','Interview','7034656641','interview','2025-06-19 13:53:43','2025-06-19 09:19:15',37,71,68,'',0,1,NULL,NULL),(190,'2025-06-19 10:40:21','Prakesh','Hevaco','7034170421','A C Service','2025-06-19 16:10:21','2025-06-19 11:36:49',37,68,68,'',0,2,NULL,NULL),(191,'2025-06-21 08:22:58','Rahul','Rentokil','8848656717','Pest control','2025-06-21 13:52:58','2025-06-21 08:23:05',35,68,68,'',0,1,NULL,NULL),(192,'2025-06-23 05:16:52','Prathin','arbor','9656962402','interview','2025-06-23 10:46:52','2025-06-23 06:31:33',35,69,69,'',0,1,NULL,NULL),(193,'2025-06-30 05:56:45','Shinto','M2','9349769662','ACchecking','2025-06-30 11:26:45','2025-06-30 07:45:19',35,69,69,'',0,1,NULL,NULL),(194,'2025-07-01 05:30:22','Giftan','Hevaco','9778719046','A C Service','2025-07-01 11:00:22','2025-07-01 06:01:57',36,69,69,'',0,3,NULL,NULL),(195,'2025-07-01 07:30:06','Sibi','M2','8138833494','Water reading','2025-07-01 13:00:06','2025-07-01 07:32:14',35,69,69,'',0,1,NULL,NULL),(196,'2025-07-01 08:02:43','Shamnadh','Arbor','7034656641','Rajalekshmi','2025-07-01 13:32:43','2025-07-01 09:56:24',36,69,71,'',0,1,NULL,NULL),(197,'2025-07-02 15:02:22','Sibi','M2','8138833494','Wire conncting','2025-07-02 20:32:22','2025-07-02 15:36:46',35,68,68,'',0,2,NULL,NULL),(198,'2025-07-03 05:04:28','Arundhathi','Varma','8848269038','Audit','2025-07-03 10:34:28','2025-07-03 12:12:02',35,71,68,'Audit',0,1,NULL,NULL),(199,'2025-07-03 06:00:57','Simi R','AFC','9061224132','Audit','2025-07-03 11:30:57','2025-07-03 12:12:13',36,71,68,'Audit',0,1,NULL,NULL),(200,'2025-07-04 04:49:24','Arundhathi','Varma','8848269038','Audit','2025-07-04 10:19:24','2025-07-04 12:16:27',35,68,69,'',0,1,NULL,NULL),(201,'2025-07-04 05:08:38','Simi','AFC','9061224132','Gayathri','2025-07-04 10:38:38','2025-07-04 12:16:45',36,68,69,'',0,1,NULL,NULL),(202,'2025-07-04 05:30:10','Kanakesh','HI Point ','9895925021','Visit Smita','2025-07-04 11:00:10','2025-07-04 05:48:46',37,68,68,'',0,1,NULL,NULL),(203,'2025-07-05 06:16:41','kiran ','Rentokil','7012845494','Pest control','2025-07-05 11:46:41','2025-07-05 06:16:48',35,68,68,'',0,1,NULL,NULL),(204,'2025-07-07 05:27:24','Arundhathi','Varma','8848269038','Gayathri','2025-07-07 10:57:24','2025-07-07 11:36:56',35,69,71,'Laptop',0,1,NULL,NULL),(205,'2025-07-07 05:28:45','Simi','AFC','9061224132','Gayathri','2025-07-07 10:58:45','2025-07-07 08:44:40',36,69,71,'Laptop',0,1,NULL,NULL),(206,'2025-07-09 05:35:07','Karthik','Coffee day','7736303607','Service','2025-07-09 11:05:07','2025-07-09 05:40:31',35,71,71,'Service',0,1,NULL,NULL),(207,'2025-07-09 07:58:44','Sneha.','ICICI Bank','8655380225','Gayathri','2025-07-09 13:28:44','2025-07-09 08:27:19',35,71,68,'Bank',0,1,NULL,NULL),(208,'2025-07-14 04:42:27','Hridya','Varma','8971887210','Gayathri','2025-07-14 10:12:27','2025-07-14 12:18:25',35,69,71,'Laptop',0,1,NULL,NULL),(209,'2025-07-14 04:54:51','Arundhathi','Varma','8848269038','Gayathri','2025-07-14 10:24:51','2025-07-14 12:19:55',36,69,71,'Laptop',0,1,NULL,NULL),(210,'2025-07-14 06:14:52','Kanakesh','HI Point ','9895925021','net work checking','2025-07-14 11:44:52','2025-07-14 09:43:36',37,69,71,'Laptop',0,2,NULL,NULL),(211,'2025-07-16 05:42:11','Abhishek','HI Point ','8078983484','Visit Smita','2025-07-16 11:12:11','2025-07-16 06:03:02',35,71,71,'Laptop',0,1,NULL,NULL),(212,'2025-07-16 05:44:17','Revathy','Greenplacement','9995561645','Visit Smita','2025-07-16 11:14:17','2025-07-16 06:09:02',36,71,71,'Green placement',0,1,NULL,NULL),(213,'2025-07-17 04:23:43','Arundhathi','Varma','8848269038','Audit','2025-07-17 09:53:43','2025-07-17 12:15:49',35,71,68,'Laptop',0,1,NULL,NULL),(214,'2025-07-17 05:04:06','Hridya','Varma','8971887210','Audit','2025-07-17 10:34:06','2025-07-17 12:10:41',36,71,68,'Laptop',0,1,NULL,NULL),(215,'2025-07-17 06:32:01','Sibi','M2','8138833494','AC Checking','2025-07-17 12:02:01','2025-07-17 06:38:31',37,71,71,'AC',0,2,NULL,NULL),(216,'2025-07-17 09:11:24','Simi','AFC','9061224132','Gayathri','2025-07-17 14:41:24','2025-07-17 12:03:14',37,68,68,'',0,2,NULL,NULL),(217,'2025-07-19 05:44:52','kiran ','Rentokil','7012845490','Pest control','2025-07-19 11:14:52','2025-07-19 05:46:16',35,69,69,'',0,1,NULL,NULL),(218,'2025-07-21 08:50:08','Satheesh','Rentokil','9209160863','service','2025-07-21 14:20:08','2025-07-21 08:59:05',35,71,71,'Air freshener',0,2,NULL,NULL),(219,'2025-07-22 08:06:56','Ujwal Das','Arbor','9567309815','interview','2025-07-22 13:36:56','2025-07-22 08:58:03',35,71,68,'interview',0,1,NULL,NULL),(220,'2025-07-23 08:29:10','Anitta','Arbor','9074603272','Gayathri','2025-07-23 13:59:10','2025-07-23 09:07:21',35,71,68,'Gayathri',0,1,NULL,NULL),(221,'2025-07-24 04:52:12','Shamnadh','Arbor','7034656641','shyam','2025-07-24 10:22:12','2025-07-24 08:02:25',35,68,68,'',0,1,NULL,NULL),(222,'2025-07-24 06:04:18','Maeena ','interview','6282405368','interview','2025-07-24 11:34:18','2025-07-24 07:19:56',36,68,68,'',0,1,NULL,NULL),(223,'2025-07-30 05:33:47','Revathy','Greenplacement','9995561645','checking','2025-07-30 11:03:47','2025-07-30 05:57:01',35,68,68,'',0,1,NULL,NULL),(224,'2025-07-30 09:36:46','Girish','ICICI Bank','8135747927','Gayathri','2025-07-30 15:06:46','2025-07-30 09:52:58',35,69,69,'',0,2,NULL,NULL),(225,'2025-07-31 09:35:11','Shahim','Noster','8489193652','Visit Smita','2025-07-31 15:05:11','2025-07-31 09:35:22',37,69,69,'',0,1,NULL,NULL),(226,'2025-08-01 05:50:40','Resmi','Green placement','9188314105','H/K','2025-08-01 11:20:40','2025-08-01 08:06:36',35,69,69,'',0,1,NULL,NULL),(227,'2025-08-01 08:08:07','Sibi','M2','8138833494','Water reading','2025-08-01 13:38:07','2025-08-01 08:08:17',36,69,69,'',0,2,NULL,NULL),(228,'2025-08-02 07:07:51','Nikhil','Rentokil','9656088536','Pest control','2025-08-02 12:37:51','2025-08-02 07:08:02',35,69,69,'',0,1,NULL,NULL),(229,'2025-08-04 02:18:59','RESMI','Green placement','9188314105','House Keeping','2025-08-04 07:48:59','2025-08-04 11:41:13',37,71,68,'Housekeeping',0,1,NULL,NULL),(230,'2025-08-04 06:36:39','Karthik','Coffee day','7735303603','Installation','2025-08-04 12:06:39','2025-08-04 06:41:41',35,71,71,'Installation',0,1,NULL,NULL),(231,'2025-08-04 07:21:56','Karthik','Coffee day','7736303607','service','2025-08-04 12:51:56','2025-08-04 07:34:37',35,71,71,'Service',0,1,NULL,NULL),(232,'2025-08-05 04:21:20','Resmi','Green placement','9188914105','House Keeping','2025-08-05 09:51:20','2025-08-05 11:46:12',37,68,69,'',0,1,NULL,NULL),(233,'2025-08-05 06:57:04','Shahabas','interview','7736381687','shyam','2025-08-05 12:27:04','2025-08-05 08:20:04',35,68,68,'',0,1,NULL,NULL),(234,'2025-08-05 10:32:47','Jeenu J S','Arbor','9539985801','Interview','2025-08-05 16:02:47','2025-08-05 11:59:00',35,69,69,'',0,1,NULL,NULL),(235,'2025-08-06 04:31:45','Resmi','Green placement','9788914105','House Keeping','2025-08-06 10:01:45','2025-08-06 11:41:38',37,68,69,'Housekeeping',0,1,NULL,NULL),(236,'2025-08-06 08:39:54','Akhil','Arbor','9567592929','Interview','2025-08-06 14:09:54','2025-08-06 10:01:01',35,69,69,'',0,1,NULL,NULL),(237,'2025-08-06 11:27:56','Jithu K S','HI Point ','9656984771','service','2025-08-06 16:57:56','2025-08-06 11:28:30',36,69,69,'',0,1,NULL,NULL),(238,'2025-08-07 02:05:45','Resmi','Green placement','9188314105','H /K','2025-08-07 07:35:45','2025-08-07 13:00:01',35,69,71,'',0,1,NULL,NULL),(239,'2025-08-07 09:19:37','Siyad','M2','9846013987','Visit Smita','2025-08-07 14:49:37','2025-08-07 09:22:55',36,71,71,'Guest',0,3,NULL,NULL),(240,'2025-08-08 02:29:53','Resmi','Green placement','9188314105','House Keeping','2025-08-08 07:59:53','2025-08-08 08:16:01',35,69,69,'',0,1,NULL,NULL),(241,'2025-08-09 02:24:30','RESMI','Arbor','9188314105','House Keeping','2025-08-09 07:54:30','2025-08-09 10:03:53',35,71,68,'Housekeeping',0,1,NULL,NULL),(242,'2025-08-09 08:14:08','AJIN','Noster','8921939654','Visit Smita','2025-08-09 13:44:08','2025-08-09 08:16:12',36,71,71,'Nostar',0,1,NULL,NULL),(243,'2025-08-11 02:43:42','Resmi','Green placement','9188314105','House Keeping','2025-08-11 08:13:42','2025-08-11 11:41:45',35,68,69,'',0,1,NULL,NULL),(244,'2025-08-11 07:43:08','Rejin','HI Point ','9496068337','George','2025-08-11 13:13:08','2025-08-11 09:09:31',36,68,69,'',0,1,NULL,NULL),(245,'2025-08-13 06:56:33','Revathy','Green placement','9995561645','H/K Supervicer','2025-08-13 12:26:33','2025-08-13 07:06:16',35,69,69,'',0,1,NULL,NULL),(246,'2025-08-19 08:48:11','Sneha','ICICI Bank','8655380225','Gayathri','2025-08-19 14:18:11','2025-08-19 14:16:12',35,71,NULL,'Gayathri',0,1,NULL,NULL),(247,'2025-08-20 06:28:31','Revathy','Green placement','9995561645','H/K Supervicer','2025-08-20 11:58:31','2025-08-20 06:28:39',35,69,69,'',0,1,NULL,NULL),(248,'2025-08-22 07:00:19','Prijas','Coffee day','7994870953','service','2025-08-22 12:30:19','2025-08-22 07:22:36',35,68,68,'',0,1,NULL,NULL),(249,'2025-08-22 09:42:41','VISHNU','AQUEGUARD','6282225738','service','2025-08-22 15:12:41','2025-08-22 09:42:51',35,69,69,'',0,1,NULL,NULL),(250,'2025-08-23 08:39:41','kiran ','Rentokil','7012845490','Pest control','2025-08-23 14:09:41','2025-08-23 08:39:50',37,69,69,'',0,1,NULL,NULL),(251,'2025-08-25 04:06:00','Vinusharma','Arbor','9363394579','New joining','2025-08-25 09:36:00','2025-08-25 08:34:20',35,71,68,'syam',0,1,NULL,NULL),(252,'2025-08-25 04:56:16','Jeenu JS','Arbor','9539985801','New joining','2025-08-25 10:26:16','2025-08-25 08:34:40',36,71,68,'Syam',0,1,NULL,NULL),(253,'2025-08-25 07:16:34','Sibi','M2','9778688275','checking','2025-08-25 12:46:34','2025-08-25 07:23:38',37,71,71,'Check Electric room',0,2,NULL,NULL),(254,'2025-08-26 09:59:15','Sneha','ICICI Bank','8655380225','Gayathri','2025-08-26 15:29:15','2025-08-26 10:31:55',35,68,68,'',0,1,NULL,NULL),(255,'2025-08-26 10:06:58','VISHNU','AQUEGUARD','6282225738','service','2025-08-26 15:36:58','2025-08-26 10:07:26',36,68,68,'',0,1,NULL,NULL),(256,'2025-08-30 05:29:26','kiran ','Rentokil','7012845490','Pest control','2025-08-30 10:59:26','2025-08-30 05:29:37',35,69,69,'',0,1,NULL,NULL),(257,'2025-08-30 08:35:57','karthik','Naveen','7012843594','Security','2025-08-30 14:05:57','2025-08-30 09:03:40',36,71,71,'security',0,1,NULL,NULL),(258,'2025-09-01 10:08:23','Sreejith','ICICI Bank','7736863524','Gayathri','2025-09-01 15:38:23','2025-09-01 10:37:33',37,69,69,'',0,1,NULL,NULL),(259,'2025-09-01 10:39:09','Sibi','M2','8138833494','Water reading','2025-09-01 16:09:09','2025-09-01 10:39:21',36,69,69,'',0,2,NULL,NULL),(260,'2025-09-02 07:06:58','karthik','Coffee day','7736303607','service','2025-09-02 12:36:58','2025-09-02 07:18:01',35,71,71,'Service',0,1,NULL,NULL),(261,'2025-09-10 04:48:52','Nandhitha','Arbor','8075400757','Interview','2025-09-10 10:18:52','2025-09-10 06:24:27',35,71,71,'Syam',0,2,NULL,NULL),(262,'2025-09-10 04:52:52','Meera','Arbor','8078272781','Interview','2025-09-10 10:22:52','2025-09-10 06:24:45',36,71,71,'Syam',0,1,NULL,NULL),(263,'2025-09-10 09:24:00','Ajith S','Arbor','6282990267','interview','2025-09-10 14:54:00','2025-09-10 10:19:08',35,69,69,'',0,1,NULL,NULL),(264,'2025-09-15 03:22:50','Yadhu','Gardence Technolegy','7012415725','Syam','2025-09-15 08:52:50','2025-09-15 04:08:00',35,71,71,'Guest',0,1,NULL,NULL),(265,'2025-09-15 04:13:20','Mohmadh Misab','Arbor','8078048718','Interview','2025-09-15 09:43:20','2025-09-15 09:49:00',35,71,69,'interview',0,1,NULL,NULL),(266,'2025-09-15 04:35:57','Ram Harijith','Arbor','7306117939','Interview','2025-09-15 10:05:57','2025-09-15 07:45:37',36,71,71,'interview',0,1,NULL,NULL),(267,'2025-09-15 04:39:56','Chandra Kanth','Arbor','9961015566','Interview','2025-09-15 10:09:56','2025-09-15 07:45:50',37,71,71,'interview',0,1,NULL,NULL),(268,'2025-09-15 11:05:36','Pradeesh','M2','9048097500','service','2025-09-15 16:35:36','2025-09-15 11:41:57',35,69,69,'',0,4,NULL,NULL),(269,'2025-09-18 05:40:15','Pradheesh','M2','9048037500','Extinguisher Checking','2025-09-18 11:10:15','2025-09-18 05:44:09',35,71,71,'Fire  Safety',0,2,NULL,NULL),(270,'2025-09-18 06:44:22','Raja lekshmi','Arbor','8078972513','Smita','2025-09-18 12:14:22','2025-09-18 12:13:53',35,71,69,'Smita',0,1,NULL,NULL),(271,'2025-09-23 06:47:58','Revathy','Green placement','9995581645','Visit Smita','2025-09-23 12:17:58','2025-09-23 07:28:46',36,71,71,'Green placement',0,1,NULL,NULL),(272,'2025-09-26 06:42:55','Sibi','Hevaco','8138833494','A C Service','2025-09-26 12:12:55','2025-09-26 11:24:40',37,69,71,'',0,3,NULL,NULL),(273,'2025-10-01 06:12:11','Pradheesh','M2','9048037500','Water reading','2025-10-01 11:42:11','2025-10-01 06:16:05',36,71,71,'Water Reading',0,2,NULL,NULL),(274,'2025-10-04 05:11:12','Pradeesh','M2','9048037500','Water leakage','2025-10-04 10:41:12','2025-10-04 06:17:48',37,69,69,'',0,3,NULL,NULL),(275,'2025-10-04 06:20:06','Nikhil','Rentokil','9656088536','Pest control','2025-10-04 11:50:06','2025-10-04 06:20:54',36,69,69,'',0,1,NULL,NULL),(276,'2025-10-06 11:52:41','Sreejith','ICICI Bank','8086860942','Gayathri','2025-10-06 17:22:41','2025-10-06 12:12:40',36,71,71,'ICICI Bank',0,2,NULL,NULL),(277,'2025-10-08 06:04:53','Sreeju','Rentokil','8590975827','service','2025-10-08 11:34:53','2025-10-08 06:15:26',37,71,71,'Air freshener',0,1,NULL,NULL),(278,'2025-10-10 05:36:08','Sachu','Naveen Security','6238128137','Security','2025-10-10 11:06:08','2025-10-10 06:42:43',37,69,69,'',0,1,NULL,NULL),(279,'2025-10-10 06:45:00','Satheesh','K M D R I','7994337292','Visit Smita','2025-10-10 12:15:00','2025-10-16 08:42:19',36,69,72,'Laptop',0,1,NULL,NULL),(280,'2025-10-31 06:11:57','test','arbor','9999999999','test','2025-10-31 11:41:57','2025-10-31 06:13:43',36,72,72,'',0,1,NULL,NULL),(281,'2025-11-26 08:59:03','unni','arbor','9999999999','test','2025-11-26 14:29:03',NULL,36,72,NULL,'',1,1,NULL,NULL);
/*!40000 ALTER TABLE `visitors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow_roles`
--

DROP TABLE IF EXISTS `workflow_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status_code` varchar(50) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow_roles`
--

LOCK TABLES `workflow_roles` WRITE;
/*!40000 ALTER TABLE `workflow_roles` DISABLE KEYS */;
INSERT INTO `workflow_roles` VALUES (2,'RFQ_SUBMITTED',44),(4,'QUOTES_PENDING',43),(5,'QUOTE_REVIEW_DM',44),(6,'QUOTE_APPROVAL_CH',47),(7,'PO_DRAFT_DE',43),(8,'PO_REVIEW_DM',44),(9,'PO_REAPPROVAL_CH',47),(10,'PO_ISSUED',43),(11,'INVOICE_REVIEW_DM',44),(12,'INVOICE_REVIEW_FM',46),(13,'PAYMENT_INITIATION',45),(14,'PAYMENT_APPROVAL_CH',47),(15,'PAYMENT_EXECUTION',45),(31,'RFQ_PENDING',43),(32,'RFQ_PENDING',44),(34,'VENDOR_VERIFICATION',43),(35,'VENDOR_VERIFICATION',45),(41,'RFQ_RECOMMENDED_DM',47),(42,'RFQ_RECOMMENDED_DM',43);
/*!40000 ALTER TABLE `workflow_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow_status`
--

DROP TABLE IF EXISTS `workflow_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_status` (
  `status_code` varchar(50) NOT NULL,
  `status_name` varchar(100) DEFAULT NULL,
  `stage_order` int DEFAULT NULL,
  PRIMARY KEY (`status_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow_status`
--

LOCK TABLES `workflow_status` WRITE;
/*!40000 ALTER TABLE `workflow_status` DISABLE KEYS */;
INSERT INTO `workflow_status` VALUES ('INVOICE_REVIEW_DM','Invoice Review by Manager',11),('INVOICE_REVIEW_FM','Invoice Review by Finance Manager',12),('PAYMENT_APPROVAL_CH','Payment Authorization by Head',14),('PAYMENT_EXECUTION','Execute Payment',15),('PAYMENT_INITIATION','Initiate Payment',13),('PO_DRAFT_DE','Draft Purchase Order',7),('PO_ISSUED','Purchase Order Issued',10),('PO_REAPPROVAL_CH','Final Purchase Order Approval by Head',9),('PO_REVIEW_DM','Purchase Order Review by Manager',8),('QUOTE_APPROVAL_CH','Vendor Approval by Head',6),('QUOTE_REVIEW_DM','Review Vendor Quotes by Manager',5),('QUOTES_PENDING','Upload Vendor Quotes',4),('RFQ_PENDING','Create RFQ',1),('RFQ_RECOMMENDED_DM','RFQ Approval by Head',3),('RFQ_SUBMITTED','RFQ Review by Manager',2),('VENDOR_VERIFICATION','Vendor Payment Verification',16);
/*!40000 ALTER TABLE `workflow_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-10 23:16:43
