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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (1,'ASSET001','Dell Laptop',3,3,'DL12345ABC','https://example.com/assets/laptop.jpg',NULL,'2021-05-15',_binary '',1200.00,'2021-06-01',5,20.00,480.00,'2026-06-01',1,1,_binary '\0',NULL,1,NULL,NULL,NULL,'2025-07-02 13:13:07.529124',NULL,NULL,NULL,NULL,NULL,'2025-11-14 14:17:23',72),(2,'ASSET002','Software License - Adobe',2,2,'ADOBE2021XYZ','https://example.com/assets/adobe.jpg',NULL,'2022-01-10',_binary '',500.00,'2022-01-15',3,33.33,166.67,'2025-01-15',2,2,_binary '\0',NULL,2,NULL,NULL,NULL,'2025-07-02 13:13:07.529124',NULL,NULL,NULL,NULL,NULL,'2025-11-14 14:25:54',72),(3,'123455',NULL,1,NULL,'7367646764',NULL,NULL,'2025-06-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ndjfjbfjfhhf','jhejfhdjhfhf',20,'2025-07-02 13:16:22.653454',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'12345556',NULL,1,NULL,'DL12345ABCt',NULL,NULL,'2025-08-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'232323327','65656557',20,'2025-08-04 12:57:35.081932',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'12345556d',NULL,1,NULL,'DL12345ABCd',NULL,NULL,'2025-08-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,'23232332','23233223',20,'2025-08-04 17:46:47.381504',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'12111111',NULL,3,NULL,'11111111111111',NULL,NULL,'2025-08-04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,'777777888777','5554444333335',21,'2025-08-05 09:50:28.092594',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'ASSET008',NULL,2,NULL,'',NULL,NULL,'2025-07-31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL,NULL,'','',22,'2025-08-05 11:09:40.749485',NULL,'',NULL,72,NULL,NULL,NULL),(13,'ASSET09',NULL,1,NULL,'7',NULL,NULL,'2025-08-02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',22,'2025-08-05 11:10:59.366571',NULL,'',NULL,72,NULL,NULL,NULL),(15,'ASSET10',NULL,1,NULL,NULL,NULL,NULL,'2025-08-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,'2025-08-05 11:26:45.394957',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '',55555.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,22,'2025-10-10 11:56:17.836000',50,NULL,NULL,NULL,NULL,NULL,NULL),(26,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '',55555.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,22,'2025-10-10 11:56:17.836000',50,NULL,NULL,NULL,NULL,NULL,NULL),(27,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '',55555.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,22,'2025-10-10 11:56:17.836000',50,NULL,NULL,NULL,NULL,NULL,NULL),(28,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '',55555.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,22,'2025-10-10 11:56:17.836000',50,NULL,NULL,NULL,NULL,NULL,NULL),(29,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '',55555.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,22,'2025-10-10 11:56:17.836000',50,NULL,NULL,NULL,NULL,NULL,NULL),(30,'ASSET099',NULL,1,NULL,'DL12345ABCdee',NULL,NULL,'2025-10-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'23232332','23233223',21,'2025-10-16 16:13:59.265371',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'CH01',NULL,1,NULL,'129090',NULL,NULL,'2025-10-16',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,'','',23,'2025-10-17 13:21:47.180957',NULL,'',72,72,NULL,NULL,NULL),(34,'CHO2','chair',2,NULL,'ADOBE2021XYee',NULL,NULL,'2025-10-18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',23,'2025-10-21 10:29:08.287474',NULL,'',72,72,NULL,NULL,NULL),(35,'CHO4','dsdsdsd',1,NULL,'ADOBE2021XYeedd',NULL,NULL,'2025-10-21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,NULL,23,'2025-10-21 14:34:56.869644',NULL,'dddwdwsds',72,72,NULL,'2025-11-14 14:18:51',72),(36,'test asset tag','ssss',1,NULL,'test serial number',NULL,NULL,'2025-10-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sss','sss',20,'2025-10-21 14:54:41.817206',NULL,'',72,72,'14',NULL,NULL),(37,'ch06',NULL,1,NULL,'12098347',NULL,NULL,'2025-10-21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,NULL,NULL,NULL,'5tfgfgfg','243434',23,'2025-10-23 10:25:15.905034',NULL,'',72,72,'21','2025-11-14 17:58:47',72),(38,'B01',NULL,2,NULL,'DL12345ABFHFK',NULL,NULL,'2025-10-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,16,NULL,NULL,NULL,'DJDJDJJDjjjdfdf','rtryrytyty',21,'2025-10-28 11:10:12.308408',NULL,'334434343',72,72,'20','2025-11-14 17:42:08',72),(42,'INT/LAP/2023-24/D0026',NULL,1,NULL,'12446678889',NULL,NULL,'2025-11-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,40,NULL,NULL,NULL,NULL,NULL,20,'2025-11-17 10:09:49.762838',NULL,'1234456778876',72,NULL,NULL,'2025-11-17 10:45:46',72);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_audit_log`
--

LOCK TABLES `asset_audit_log` WRITE;
/*!40000 ALTER TABLE `asset_audit_log` DISABLE KEYS */;
INSERT INTO `asset_audit_log` VALUES (1,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjj','rtryrytyty',1,9,NULL,21,72,'2025-11-10 16:22:48',72,'2025-11-10 16:22:48','UPDATE'),(2,37,23,1,'ch06','12098347','','2025-10-21','','',NULL,9,NULL,21,72,'2025-11-10 16:27:23',72,'2025-11-10 16:27:23','UPDATE'),(3,37,23,1,'ch06','12098347','','2025-10-21','hvdhvfdf','dfdfdfx',NULL,9,NULL,21,72,'2025-11-10 16:27:39',72,'2025-11-10 16:27:39','UPDATE'),(4,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',NULL,9,NULL,21,72,'2025-11-11 17:20:04',72,'2025-11-11 17:20:04','UPDATE'),(5,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',15,9,NULL,21,72,'2025-11-11 17:25:23',72,'2025-11-11 17:25:23','UPDATE'),(6,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',16,9,NULL,21,72,'2025-11-11 17:31:51',72,'2025-11-11 17:31:51','UPDATE'),(7,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',16,9,NULL,20,72,'2025-11-11 17:41:05',72,'2025-11-11 17:41:05','UPDATE'),(8,38,21,2,'B01','DL12345ABFHFK','334434343','2025-10-19','DJDJDJJDjjjdfdf','rtryrytyty',16,7,NULL,20,72,'2025-11-11 17:49:19',72,'2025-11-11 17:49:19','UPDATE');
/*!40000 ALTER TABLE `asset_audit_log` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_transactions`
--

LOCK TABLES `asset_transactions` WRITE;
/*!40000 ALTER TABLE `asset_transactions` DISABLE KEYS */;
INSERT INTO `asset_transactions` VALUES (2,5,4,'REASSIGN','Asset reassigned','2025-08-04 09:59:05',65,1),(3,13,2,'REASSIGN','Asset reassigned','2025-08-05 05:41:27',65,1),(5,15,3,'REASSIGN','Asset reassigned','2025-08-05 06:00:58',65,1),(6,8,4,'REASSIGN','Asset reassigned','2025-08-05 06:01:18',65,1),(7,7,3,'REASSIGN','REASSIGN','2025-08-05 06:28:08',65,1),(8,6,3,'ASSIGN','ASSIGN','2025-08-05 06:32:49',65,1),(9,3,1,'ASSIGN','ASSIGN','2025-08-05 10:14:25',65,1),(12,15,3,'UNASSIGN','Asset unassigned','2025-08-05 10:24:32',65,1),(13,5,4,'UNASSIGN','Asset unassigned','2025-08-06 12:25:30',65,1),(14,8,4,'ASSIGN','ASSIGN','2025-08-06 12:26:07',65,1),(16,8,4,'RELOCATE','Asset moved to another location','2025-10-17 09:11:07',72,1),(17,30,4,'UNASSIGN','Asset unassigned','2025-10-17 09:35:05',72,1),(18,33,NULL,'UNASSIGN','Asset unassigned and removed from location','2025-10-17 09:35:51',72,1),(19,33,NULL,'RELOCATE','Asset moved to another location','2025-10-21 04:50:44',72,3),(20,34,2,'REASSIGN','Reassigned to another staff','2025-10-21 04:59:17',72,NULL),(21,13,1,'REASSIGN','Reassigned to another staff','2025-10-21 04:59:25',72,NULL),(22,34,2,'RELOCATE','Asset moved to another location','2025-10-21 08:39:54',72,2),(23,35,1,'ASSIGN','Initial assignment to staff','2025-10-21 09:04:56',72,3),(24,36,3,'ASSIGN','Initial assignment to staff','2025-10-21 09:24:41',72,2),(25,13,1,'UNASSIGN','Asset unassigned','2025-10-22 04:53:20',72,1),(26,36,3,'UNASSIGN','Asset unassigned and removed from location','2025-10-22 05:26:06',72,2),(27,34,2,'UNASSIGN','Asset unassigned and removed from location','2025-10-22 05:26:09',72,2),(28,35,1,'UNASSIGN','Asset unassigned and removed from location','2025-10-28 04:41:10',72,3),(29,38,1,'REASSIGN','Reassigned to another staff','2025-10-28 05:49:30',72,9),(30,38,1,'UNASSIGN','Asset unassigned','2025-11-11 05:39:07',72,1),(31,42,40,'ASSIGN','Initial assignment to staff','2025-11-17 04:39:49',72,6);
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
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `verified_by` (`verified_by`),
  CONSTRAINT `asset_verifications_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`AssetID`),
  CONSTRAINT `asset_verifications_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_verifications`
--

LOCK TABLES `asset_verifications` WRITE;
/*!40000 ALTER TABLE `asset_verifications` DISABLE KEYS */;
INSERT INTO `asset_verifications` VALUES (1,2,72,'2025-11-14 13:51:04'),(2,1,72,'2025-11-14 14:01:12'),(3,2,72,'2025-11-14 14:14:15'),(4,2,72,'2025-11-14 14:14:39'),(5,1,72,'2025-11-14 14:17:23'),(6,35,72,'2025-11-14 14:18:51'),(7,2,72,'2025-11-14 14:25:54'),(8,38,72,'2025-11-14 17:42:08'),(9,37,72,'2025-11-14 17:58:47'),(10,42,72,'2025-11-17 10:40:20'),(11,42,72,'2025-11-17 10:45:46');
/*!40000 ALTER TABLE `asset_verifications` ENABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (1,'Inv001','*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TRIAL*TR','2025-05-06 15:36:46.250000',NULL,NULL,0),(2,'inv002','uploads/invoices/1746546349850-sample-invoice.pdf','2025-05-06 21:15:49.880000',NULL,NULL,0),(3,'INV003','uploads/invoices/1754888791024-sample-invoice (1).pdf','2025-08-11 10:36:31.000000',NULL,NULL,0),(4,'Inv005','uploads/invoices/1754888804387-sample-invoice (1).pdf','2025-08-11 10:36:44.000000',NULL,NULL,0),(5,'InV006','uploads/invoices/1754888816167-sample-invoice (1).pdf','2025-08-11 10:36:56.000000',NULL,NULL,0),(6,'IV007','uploads/invoices/1754888826842-sample-invoice (1).pdf','2025-08-11 10:37:06.000000',NULL,NULL,0),(7,'INV09','uploads/invoices/1754888837672-sample-invoice (1).pdf','2025-08-11 10:37:17.000000',NULL,NULL,0),(8,'INV0010','uploads/invoices/1754888850255-sample-invoice (1).pdf','2025-08-11 10:37:30.000000',NULL,NULL,0),(9,'INV010','uploads/invoices/1754888864142-sample-invoice (1).pdf','2025-08-11 10:37:44.000000',NULL,NULL,0),(10,'INV012','uploads/invoices/1754888874855-sample-invoice (1).pdf','2025-08-11 10:37:54.000000',NULL,NULL,0),(11,'inv13','uploads/invoices/1754997112477-sample-invoice (1).pdf','2025-08-12 16:41:52.000000',NULL,NULL,0),(12,'inv14','uploads/invoices/1754997124356-sample-invoice (1).pdf','2025-08-12 16:42:04.000000',NULL,NULL,0),(13,'inv15','uploads/invoices/1754997136673-sample-invoice (1).pdf','2025-08-12 16:42:16.000000',NULL,NULL,0),(14,'1323','uploads/invoices/1758517564011-519bb479-5266-472d-a808-6839033732fa.pdf','2025-09-22 10:36:04.000000',NULL,NULL,0),(15,'INV5566','uploads/invoices/1758522136428-7080_20250818101124272 (2).pdf','2025-09-22 11:52:16.000000',2,'2025-09-18 00:00:00',0),(19,'Inv6655','uploads/invoices/1758618398751-ACK341941730160725.pdf','2025-09-23 14:36:38.000000',2,'2025-09-23 00:00:00',1),(20,'INv9999','uploads/invoices/1758618534161-sample-invoice.pdf','2025-09-23 14:38:54.000000',1,'2025-09-22 00:00:00',1),(21,'INv9998','uploads/invoices/1758618664242-sample-invoice.pdf','2025-09-23 14:41:04.000000',1,'2025-09-22 00:00:00',1),(22,'INV90','uploads/invoices/1762172626534-sample-invoice.pdf','2025-11-03 17:53:46.000000',16,'2025-11-03 00:00:00',1),(23,'INV99','uploads/invoices/1762173090140-sample-invoice.pdf','2025-11-03 18:01:30.000000',14,'2025-11-03 00:00:00',1);
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
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
INSERT INTO `location` VALUES (1,'HQ01','Headquarters - Floor 1',_binary '\0'),(2,'BR01','Branch Office 1',_binary '\0'),(3,'WH01','Main Warehouse',_binary '\0'),(4,'4','Main Work Area',_binary '\0'),(5,'5','Reception',_binary '\0'),(6,'6','Security Entrance',_binary '\0'),(7,'7','Main Area',_binary '\0'),(8,'8','Pantry',_binary '\0'),(9,'9','Store',_binary '\0'),(10,'10','The Strategy Sphere',_binary '\0'),(11,'11','The Syndicate Chamber',_binary '\0'),(12,'12','The Zen Den',_binary '\0');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (66,'Admin','$2y$12$Rlp/m/W/gZNLuDIsP.vik.4eGfaBD6NeQXl9Z1VFlPesxfN4xdraK',40,'2024-12-17 12:37:08',NULL,1,'2025-10-10 08:52:24','Admin',NULL,'2025-10-10 14:22:24',NULL),(67,'PradeepkumarSecurity015','$2y$12$l91FF/zU.D2/aQFbi1zUDOVNIwXN3zGgXRvcz.hqO85ojK5zDe4OC',41,'2024-12-17 18:30:00','2025-06-16',1,'2025-10-10 09:30:20','Admin','Admin','2025-10-10 15:00:20',NULL),(68,'AasishBhadranSecurity014','$2y$12$3OvMn3UZDOGJAeA8R7p/ee5NILoP37TBGiYt8xVwbsawHXd3Urhqi',41,'2024-12-17 18:30:00',NULL,1,'2025-10-10 09:02:42','Admin',NULL,'2025-10-10 14:32:42',NULL),(69,'LaluTSSecurity013','$2y$12$oB9Bu2GDCcEmuFDvL/XpgO7UHLs7pNhrHFpXhsADpNpvLvrJTEO7a',41,'2024-12-17 18:30:00',NULL,1,'2024-12-18 06:41:56','Admin',NULL,NULL,NULL),(71,'ArunSasiSecurity015','$2y$12$m8N5C.21dLBJcv9SZpFC1eJhXSM4ksJhqF31cjIKUA6u46A4ztQdy',41,'2025-05-31 18:30:00',NULL,1,'2025-10-10 08:52:00','Admin',NULL,'2025-10-10 14:22:00',NULL),(72,'unni','$2b$12$vMm9OaeXKNnDQMF31pqj6ef3zG9QkLXyDH/x3xqFNvsxUKFucNU1S',40,'2025-10-14 12:16:42',NULL,1,'2025-10-16 08:41:46','Admin','Admin','2025-10-16 14:11:46',NULL),(73,'unnik','$2b$12$u0bYjovRkB9KXgS44.g.vOz/k0wu8cZMXLuvrwwJw/kPYTCQYsh5S',41,'2025-10-16 08:44:01',NULL,1,'2025-10-16 08:44:01','Admin',NULL,NULL,NULL);
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
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `asset` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Fresh Foods Co.','9876543210','*TRIAL*TRIAL*TRIAL*TRI','2025-05-02 17:05:51.380000',0),(2,'Kitchen Essentials Ltd.','*TRIAL*TRI','support@kitchenessentials.com','2025-05-02 17:05:51.380000',0),(3,'Global Grocers','9988776655','*TRIAL*TRIAL*TRIAL*TRIA','2025-05-02 17:05:51.380000',0),(4,'Daily Supply Corp.','9012345678','info@dailysupply.com','2025-05-02 17:05:51.380000',0),(5,'Urban Pantry','*TRIAL*TRI','*TRIAL*TRIAL*TRIAL*TR','2025-05-02 17:05:51.380000',0),(6,'supreme','88878737373','','2025-05-06 12:32:40.540000',0),(7,'*TRI','7288229222','','2025-05-06 12:33:20.727000',0),(8,'kunnil','8182828282','','2025-05-06 12:34:02.860000',0),(9,'test','9999999999','test.2345@gmaill.com','2025-06-04 10:35:13.000000',0),(10,'test','7288229222','test.2345@gmaill.com','2025-06-04 14:39:23.000000',0),(11,'test','7288229222','test.2345@gmaill.com','2025-06-04 14:41:18.000000',0),(12,'test','7288229222','test.2345@gmaill.com','2025-06-04 14:41:41.000000',0),(13,'testasset','7288229222','test.2345@gmaill.com','2025-09-23 15:17:30.000000',1),(14,'test3','7288229222','unnikrishnan.km@arbor-education.com','2025-09-30 17:10:31.000000',1),(15,'test','9090909090','test1@gmail.com','2025-11-03 17:17:14.000000',0),(16,'test','9098909890','test3@gmail.com','2025-11-03 17:25:21.000000',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitors`
--

LOCK TABLES `visitors` WRITE;
/*!40000 ALTER TABLE `visitors` DISABLE KEYS */;
INSERT INTO `visitors` VALUES (91,'2025-01-07 10:52:15','Test','AQUEGUARD','3333333333','Visit Smita','2025-01-07 16:22:15','2025-01-07 10:53:26',36,68,68,'',0,1,NULL,NULL),(92,'2025-01-07 10:54:33','VISHNU','AQUEGUARD','6282225732','Visit Smita','2025-01-07 16:24:33','2025-01-07 10:56:47',35,68,68,'REPAIR WATERPURIFY AQUE GUARD',0,1,NULL,NULL),(93,'2025-01-07 10:56:06','reshmi mohan','visitor','9895355777','abilash','2025-01-07 16:26:06','2025-01-07 10:57:17',36,68,68,'',0,1,NULL,NULL),(94,'2025-01-07 11:06:58','Abhilash','RBR Solution','9821800003','Visit Smita','2025-01-07 16:36:58','2025-01-07 11:07:48',36,69,69,'',0,3,NULL,NULL),(95,'2025-01-07 11:16:35','vishnulal s p.','interview','8281235181','shyam','2025-01-07 16:46:35','2025-01-07 11:17:18',35,67,67,'',0,1,NULL,NULL),(96,'2025-01-10 08:05:08','karthik','coffee day','7736303602','service','2025-01-10 13:35:08','2025-01-13 05:18:55',35,67,68,'',0,1,NULL,NULL),(97,'2025-01-11 08:21:05','kiran j','pest control','7012815490','service','2025-01-11 13:51:05','2025-01-13 05:22:14',36,67,68,'',0,1,NULL,NULL),(98,'2025-01-11 09:14:47','bindhu','H K F','8921119757','service','2025-01-11 14:44:47','2025-01-13 05:22:30',37,67,68,'',0,1,NULL,NULL),(99,'2025-01-13 05:21:56','Rizna ','interview','8136918804','shyam','2025-01-13 10:51:56','2025-01-13 06:39:48',35,68,68,'interview',0,1,NULL,NULL),(100,'2025-01-13 05:46:47','Ababeel','interview','8921516377','shyam','2025-01-13 11:16:47','2025-01-13 07:32:33',36,68,68,'interview',0,1,NULL,NULL),(101,'2025-01-14 05:45:17','adwaith s','arbor','9895070149','interview','2025-01-14 11:15:17','2025-01-14 13:03:09',35,67,67,'',0,1,NULL,NULL),(102,'2025-01-15 05:13:03','Anjana M N','Interview','9072929344','Interview','2025-01-15 10:43:03','2025-01-15 06:54:52',35,69,69,'',0,1,NULL,NULL),(103,'2025-01-22 05:48:11','Kanakesh','HI Point Connect','9895925021','Visit Smita/Samy&#039;s Laptop Issue','2025-01-22 11:18:11','2025-01-22 06:12:10',35,68,68,'Laptop service',0,1,'Admin','2025-01-22 16:12:20'),(104,'2025-01-24 05:38:46','Prakash','Hevaco','9567863396','A C Service','2025-01-24 11:08:46','2025-01-24 11:33:59',35,69,69,'',0,3,NULL,NULL),(105,'2025-01-25 05:29:33','Gokul','Rentokil','8138862635','Pest countrol','2025-01-25 10:59:33','2025-01-25 05:49:25',35,68,68,'Pest countrol',0,1,NULL,NULL),(106,'2025-01-25 05:57:01','Abin','Hevaco','7085062782','A/C Maintance','2025-01-25 11:27:01','2025-01-25 07:10:00',35,68,68,'A/C Maintance',0,1,NULL,NULL),(107,'2025-01-28 06:59:39','pradeep','chair service','9847109109','smitha','2025-01-28 12:29:39','2025-01-28 07:01:12',35,67,67,'',0,1,NULL,NULL),(108,'2025-02-03 05:04:46','Sibi','M2','8138833494','Visit Smita','2025-02-03 10:34:46','2025-02-03 05:05:07',35,68,68,'Water Reading',0,1,NULL,NULL),(109,'2025-02-03 05:19:04','Vivek','Arbion','7907157806','Visit Smita','2025-02-03 10:49:04','2025-02-03 05:19:23',35,68,68,'Housekeeping',0,1,NULL,NULL),(110,'2025-02-04 04:20:39','Lewis Tasker','Arbor','8606389644','Guest','2025-02-04 09:50:39','2025-02-04 11:28:49',35,68,69,'Guest',0,1,NULL,NULL),(111,'2025-02-04 05:58:25','Simi','AFC','9061224132','Gayathri','2025-02-04 11:28:25','2025-02-04 08:15:24',36,68,68,'',0,1,NULL,NULL),(112,'2025-02-05 04:08:11','Lewis Tasker','Arbor','8606389644','Guest','2025-02-05 09:38:11','2025-02-05 11:08:20',35,69,68,'Laptop',0,1,NULL,NULL),(113,'2025-02-06 03:49:17','Lewis Tasker','Arbor','8606389644','Guest','2025-02-06 09:19:17','2025-02-06 10:38:35',35,68,69,'Guest',0,1,NULL,NULL),(114,'2025-02-06 07:03:56','Aditi R ','Mitara','9895114581','shyam','2025-02-06 12:33:56','2025-02-06 07:46:47',36,68,68,'',0,1,NULL,NULL),(115,'2025-02-06 12:32:11','Lintu','Rentokil','8956077547','Air fershner Service','2025-02-06 18:02:11','2025-02-06 12:40:06',36,69,69,'',0,2,NULL,NULL),(116,'2025-02-07 05:11:02','Lewis Tasker','Arbor','8606398644','Guest','2025-02-07 10:41:02','2025-02-07 11:35:21',35,68,66,'Guest',0,1,NULL,NULL),(117,'2025-02-08 08:33:19','kiran ','Rentokil','7012845490','Pest control','2025-02-08 14:03:19','2025-02-08 08:34:03',35,68,68,'Pest control',0,1,NULL,NULL),(118,'2025-02-14 07:34:22','karthik','coffee day','7736303607','Coffee mechine service','2025-02-14 13:04:22','2025-02-14 07:39:17',35,68,68,'Coffee mechine service',0,1,NULL,NULL),(119,'2025-02-17 10:37:55','Sreejith','ICICI Bank','7736863524','Gayathri','2025-02-17 16:07:55','2025-02-17 10:44:19',35,68,68,'',0,1,NULL,NULL),(120,'2025-02-19 04:27:04','Vivek','Arbion','7907157806','Visit Smita','2025-02-19 09:57:04','2025-02-19 04:28:22',35,68,68,'',0,1,NULL,NULL),(121,'2025-02-19 05:22:01','Madhu j','Technopark','9387375329','Visit Smita','2025-02-19 10:52:01','2025-02-19 07:30:52',35,68,68,'Fire and Sefty traning',0,1,NULL,NULL),(122,'2025-02-20 06:25:55','Sayanth','Tech Mastors','9846422221','shyam','2025-02-20 11:55:55','2025-02-20 06:42:54',35,68,68,'',0,2,NULL,NULL),(123,'2025-02-22 07:09:27','Gokul','Rentokil','8138862635','Pest control','2025-02-22 12:39:27','2025-02-22 07:10:20',35,69,69,'',0,1,NULL,NULL),(124,'2025-02-24 11:34:17','heedstan','arbion','9061006622','Visit Smita','2025-02-24 17:04:17','2025-02-24 11:35:03',35,67,67,'',0,2,NULL,NULL),(125,'2025-02-25 05:59:26','Vivek','Arbion','7907157806','Visit Smita','2025-02-25 11:29:26','2025-02-25 06:01:17',35,68,68,'',0,2,NULL,NULL),(126,'2025-02-25 07:30:31','Murali','Greenplacement','9447411454','Visit Smita','2025-02-25 13:00:31','2025-02-25 08:01:43',35,68,68,'',0,2,NULL,NULL),(127,'2025-02-27 07:50:42','Amal','Hevaco','8590421213','A/C Maintance','2025-02-27 13:20:42','2025-02-27 07:52:02',35,68,68,'',0,1,NULL,NULL),(128,'2025-03-01 08:04:32','Rajeev','Noster','9995637791','Pantry water pipe repairing','2025-03-01 13:34:32','2025-03-01 08:11:32',35,68,68,'',0,2,NULL,NULL),(129,'2025-03-03 05:23:11','Sushil','SNIQSYS','9895209214','shyam','2025-03-03 10:53:11','2025-03-03 06:31:07',35,68,68,'',0,2,NULL,NULL),(130,'2025-03-03 06:59:05','Sibi','M2','8138833494','Water reading','2025-03-03 12:29:05','2025-03-03 07:00:09',35,68,68,'',0,1,NULL,NULL),(131,'2025-03-07 05:28:39','Revathy','Greenplacement','9995561645','H/K Supervicer','2025-03-07 10:58:39','2025-03-07 05:58:07',35,68,68,'',0,1,NULL,NULL),(132,'2025-03-08 06:36:25','kiran ','Rentokil','7012845490','Pest control','2025-03-08 12:06:25','2025-03-08 06:39:19',35,68,68,'Pest control',0,1,NULL,NULL),(133,'2025-03-12 08:36:23','karthik','coffee day','7736303607','Coffee mechine service','2025-03-12 14:06:23','2025-03-12 08:37:09',35,68,68,'',0,1,NULL,NULL),(134,'2025-03-17 05:17:03','Josli','interview','8714532170','interview','2025-03-17 10:47:03','2025-03-17 08:24:21',35,68,68,'interview',0,1,NULL,NULL),(135,'2025-03-18 07:41:09','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-18 13:11:09','2025-03-18 07:43:02',35,68,68,'',0,1,NULL,NULL),(136,'2025-03-19 05:23:34','Jithin','Giltech','8589995562','Visit Smita','2025-03-19 10:53:34','2025-03-19 05:26:17',35,68,68,'Peppar gilt repairing',0,1,NULL,NULL),(137,'2025-03-19 08:07:20','Vibin','Tamara','6282961971','Visit Smita','2025-03-19 13:37:20','2025-03-19 08:14:00',35,68,68,'',0,1,NULL,NULL),(138,'2025-03-20 05:19:29','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-20 10:49:29','2025-03-20 05:48:53',35,68,68,'',0,1,NULL,NULL),(139,'2025-03-24 05:49:16','Revathy','Greenplacement','9995567645','Visit Smita','2025-03-24 11:19:16','2025-03-24 06:00:50',35,68,68,'',0,1,NULL,NULL),(140,'2025-03-25 05:45:38','Sneha','ICICI Bank','8655980225','Gayathri','2025-03-25 11:15:38','2025-03-25 05:52:55',35,68,68,'',0,2,NULL,NULL),(141,'2025-03-29 06:25:30','Vinod','V S A','9995712232','Measuring','2025-03-29 11:55:30','2025-03-29 07:24:00',36,69,69,'',0,1,NULL,NULL),(142,'2025-03-29 07:20:28','kiran ','Rentokil','7012845490','Pest control','2025-03-29 12:50:28','2025-03-29 07:20:58',35,69,69,'',0,1,NULL,NULL),(143,'2025-04-01 07:23:40','sibi','M2','8138833494','water reading','2025-04-01 12:53:40','2025-04-01 07:24:16',35,67,67,'',0,2,NULL,NULL),(144,'2025-04-02 12:49:34','Shinto','M2','9349769667','Electrical','2025-04-02 18:19:34','2025-04-02 12:49:48',35,69,69,'',0,1,NULL,NULL),(145,'2025-04-05 06:18:22','kiran ','Rentokil','7012845490','Pest control','2025-04-05 11:48:22','2025-04-05 06:18:38',36,69,69,'',0,1,NULL,NULL),(146,'2025-04-07 10:17:00','Sibi','M2','9778688275','ACchecking','2025-04-07 15:47:00','2025-04-09 05:57:04',35,69,68,'',0,1,NULL,NULL),(147,'2025-04-09 05:58:36','VISHNU','AQUEGUARD','6282225738','AQUEGUARD SERVCE','2025-04-09 11:28:36','2025-04-09 06:18:04',35,68,68,'',0,1,NULL,NULL),(148,'2025-04-09 07:22:13','Sreeju','Rentokil','8485093644','Air fershner Service','2025-04-09 12:52:13','2025-04-09 07:23:45',35,68,68,'',0,2,NULL,NULL),(149,'2025-04-10 06:45:16','karthik','coffee day','7736303607','Coffee mechine service','2025-04-10 12:15:16','2025-04-10 06:52:50',35,68,68,'Coffee mechine service',0,1,NULL,NULL),(150,'2025-04-16 05:40:38','Revathy','Greenplacement','9995567645','Visit Smita','2025-04-16 11:10:38','2025-04-16 05:57:33',35,68,68,'',0,1,NULL,NULL),(151,'2025-04-22 09:33:56','Sibi','M square','9778688275','plumbing','2025-04-22 15:03:56','2025-04-22 09:55:37',35,69,69,'',0,4,NULL,NULL),(152,'2025-04-24 05:36:42','Simi','AFC','9061224132','Gayathri','2025-04-24 11:06:42','2025-04-24 10:34:16',35,68,69,'',0,1,NULL,NULL),(153,'2025-04-25 04:29:57','Kanakesh','HI Point ','9895925021','net work checking','2025-04-25 09:59:57','2025-04-25 04:30:08',35,69,69,'',0,1,NULL,NULL),(154,'2025-05-01 05:59:15','Shinto','M2','9349769667','Water reading','2025-05-01 11:29:15','2025-05-01 05:59:38',35,69,69,'',0,1,NULL,NULL),(155,'2025-05-03 06:18:02','Kanakesh','HI Point ','9895925021','net work checking','2025-05-03 11:48:02','2025-05-03 10:23:48',35,69,69,'',0,1,NULL,NULL),(156,'2025-05-08 08:08:52','karthik','coffee day','7736303607','Coffee mechine service','2025-05-08 13:38:52','2025-05-08 08:14:02',35,69,69,'',0,1,NULL,NULL),(157,'2025-05-12 05:25:20','Thushara','Praanaa','8075395651','shyam','2025-05-12 10:55:20','2025-05-12 07:24:49',37,69,69,'',0,1,NULL,NULL),(158,'2025-05-12 08:18:48','Anoop','ICICI Bank','8075811854','George','2025-05-12 13:48:48','2025-05-12 08:35:05',36,69,69,'',0,2,NULL,NULL),(159,'2025-05-12 10:28:48','Thosiya','Arbor','7560816869','interview','2025-05-12 15:58:48','2025-05-12 11:31:04',36,69,69,'',0,1,NULL,NULL),(160,'2025-05-14 12:10:25','faizal','thomascook','9744208040','Gayathri','2025-05-14 17:40:25','2025-05-14 12:11:04',36,67,67,'',0,1,NULL,NULL),(161,'2025-05-21 09:58:37','kavin','Interview','8281862590','interview','2025-05-21 15:28:37','2025-05-21 09:58:58',37,67,67,'',0,1,NULL,NULL),(162,'2025-05-22 08:25:40','Abhishek','HI Point ','8078983484','service','2025-05-22 13:55:40','2025-05-22 09:02:56',37,69,69,'',0,1,NULL,NULL),(163,'2025-05-24 10:01:29','Prashanth ','Rentokil','9995688875','Pest control','2025-05-24 15:31:29','2025-05-24 10:02:05',37,68,68,'',0,1,NULL,NULL),(164,'2025-05-28 05:09:46','Satheesh','Rentokil','9207160863','Air freshner','2025-05-28 10:39:46','2025-05-28 05:10:09',37,69,69,'',0,1,NULL,NULL),(165,'2025-05-28 06:03:59','Revathy','Greenplacement','9995561645','H/K Checking','2025-05-28 11:33:59','2025-05-28 06:32:21',37,69,69,'',0,1,NULL,NULL),(166,'2025-05-28 10:55:12','Test','Test','8778878866','Test','2025-05-28 16:25:12','2025-05-28 11:13:31',36,66,66,'',0,1,NULL,NULL),(167,'2025-05-28 11:58:22','test1','test','9895491596','test','2025-05-28 17:28:22','2025-05-28 12:03:41',36,66,66,'',0,1,NULL,NULL),(168,'2025-05-29 07:38:48','Shinto','M2','9349769617','checking','2025-05-29 13:08:48','2025-05-29 08:38:45',36,69,69,'',0,1,NULL,NULL),(169,'2025-05-29 23:58:37','Godwin','fire','9496153857','fire','2025-05-30 05:28:37','2025-05-29 23:58:44',36,68,68,'27/05/2025',0,1,NULL,NULL),(170,'2025-05-30 00:01:34','Kanagesh','HI Point ','9895985021','Visit Smita','2025-05-30 05:31:34','2025-05-30 00:01:39',36,68,68,'27/05/2025',0,1,NULL,NULL),(171,'2025-05-30 00:03:14','satheesh','Rentokil','9207160863','Air fershner Service','2025-05-30 05:33:14','2025-05-30 00:03:23',36,68,68,'27/05/2025',0,1,NULL,NULL),(172,'2025-05-30 06:09:06','test1','test','9999999999','test','2025-05-30 11:39:06','2025-05-30 09:48:16',36,66,66,'11',0,9,NULL,NULL),(173,'2025-06-02 06:15:51','Sibi','M2','8138833494','Water reading','2025-06-02 11:45:51','2025-06-02 06:16:08',36,69,69,'',0,1,NULL,NULL),(174,'2025-06-05 10:16:43','Satheesh','Rentokil','9207160863','Air fershner Service','2025-06-05 15:46:43','2025-06-05 10:29:36',35,68,68,'',0,1,NULL,NULL),(175,'2025-06-05 15:10:21','Rejin','HI Point ','9496068337','Visit Smita','2025-06-05 20:40:21','2025-06-05 15:10:27',36,68,68,'02/06/2025',0,1,NULL,NULL),(176,'2025-06-05 15:11:54','Rejin','HI Point ','9496068337','Visit Smita','2025-06-05 20:41:54','2025-06-05 15:11:58',36,68,68,'02/06/2025',0,1,NULL,NULL),(177,'2025-06-05 17:17:38','Prakash','Hevaco','9567863396','A C Service','2025-06-05 22:47:38','2025-06-05 17:17:57',36,69,69,'03/06/2025',0,2,NULL,NULL),(178,'2025-06-05 17:23:17','ArunGopal','ICICI Bank','9846002879','Gayathri','2025-06-05 22:53:17','2025-06-05 17:24:01',37,69,69,'04/06/2025',0,1,NULL,NULL),(179,'2025-06-07 06:45:46','Nithin','Rentokil','9526413182','Pest control','2025-06-07 12:15:46','2025-06-07 07:13:35',35,68,68,'',0,1,NULL,NULL),(180,'2025-06-09 05:53:57','Simi','AFC','9061224132','Gayathri','2025-06-09 11:23:57','2025-06-10 05:59:28',35,69,69,'',0,1,NULL,NULL),(181,'2025-06-10 07:21:04','Simi','AFC','9061224132','Gayathri','2025-06-10 12:51:04','2025-06-11 10:02:47',36,69,68,'',0,1,NULL,NULL),(182,'2025-06-11 10:03:32','Revathy','Greenplacement','9995561645','Visit Smita','2025-06-11 15:33:32','2025-06-11 10:03:36',35,68,68,'',0,1,NULL,NULL),(183,'2025-06-11 10:04:41','Simi','AFC','9061224132','Gayathri','2025-06-11 15:34:41','2025-06-11 17:48:56',36,68,69,'',0,1,NULL,NULL),(184,'2025-06-13 09:44:08','Jounne','Arbor','8129078474','George','2025-06-13 15:14:08','2025-06-13 10:21:04',35,68,68,'',0,1,NULL,NULL),(185,'2025-06-16 06:28:16','Jithu','HI Point ','9656984771','System install','2025-06-16 11:58:16','2025-06-16 06:50:26',35,69,69,'',0,1,NULL,NULL),(186,'2025-06-17 08:21:33','EmilyDause','Arbor','8606389644','Guest','2025-06-17 13:51:33','2025-06-19 11:16:58',35,69,68,'',0,1,NULL,NULL),(187,'2025-06-17 08:23:14','Phillipp De Ath','Arbor','8606389644','Guest','2025-06-17 13:53:14','2025-06-19 11:17:07',36,69,68,'',0,1,NULL,NULL),(188,'2025-06-18 12:17:37','Shibu','Sweet Garden','9349141474','plant','2025-06-18 17:47:37','2025-06-18 12:32:20',37,69,69,'',0,1,NULL,NULL),(189,'2025-06-19 08:23:43','Shamnadh','Interview','7034656641','interview','2025-06-19 13:53:43','2025-06-19 09:19:15',37,71,68,'',0,1,NULL,NULL),(190,'2025-06-19 10:40:21','Prakesh','Hevaco','7034170421','A C Service','2025-06-19 16:10:21','2025-06-19 11:36:49',37,68,68,'',0,2,NULL,NULL),(191,'2025-06-21 08:22:58','Rahul','Rentokil','8848656717','Pest control','2025-06-21 13:52:58','2025-06-21 08:23:05',35,68,68,'',0,1,NULL,NULL),(192,'2025-06-23 05:16:52','Prathin','arbor','9656962402','interview','2025-06-23 10:46:52','2025-06-23 06:31:33',35,69,69,'',0,1,NULL,NULL),(193,'2025-06-30 05:56:45','Shinto','M2','9349769662','ACchecking','2025-06-30 11:26:45','2025-06-30 07:45:19',35,69,69,'',0,1,NULL,NULL),(194,'2025-07-01 05:30:22','Giftan','Hevaco','9778719046','A C Service','2025-07-01 11:00:22','2025-07-01 06:01:57',36,69,69,'',0,3,NULL,NULL),(195,'2025-07-01 07:30:06','Sibi','M2','8138833494','Water reading','2025-07-01 13:00:06','2025-07-01 07:32:14',35,69,69,'',0,1,NULL,NULL),(196,'2025-07-01 08:02:43','Shamnadh','Arbor','7034656641','Rajalekshmi','2025-07-01 13:32:43','2025-07-01 09:56:24',36,69,71,'',0,1,NULL,NULL),(197,'2025-07-02 15:02:22','Sibi','M2','8138833494','Wire conncting','2025-07-02 20:32:22','2025-07-02 15:36:46',35,68,68,'',0,2,NULL,NULL),(198,'2025-07-03 05:04:28','Arundhathi','Varma','8848269038','Audit','2025-07-03 10:34:28','2025-07-03 12:12:02',35,71,68,'Audit',0,1,NULL,NULL),(199,'2025-07-03 06:00:57','Simi R','AFC','9061224132','Audit','2025-07-03 11:30:57','2025-07-03 12:12:13',36,71,68,'Audit',0,1,NULL,NULL),(200,'2025-07-04 04:49:24','Arundhathi','Varma','8848269038','Audit','2025-07-04 10:19:24','2025-07-04 12:16:27',35,68,69,'',0,1,NULL,NULL),(201,'2025-07-04 05:08:38','Simi','AFC','9061224132','Gayathri','2025-07-04 10:38:38','2025-07-04 12:16:45',36,68,69,'',0,1,NULL,NULL),(202,'2025-07-04 05:30:10','Kanakesh','HI Point ','9895925021','Visit Smita','2025-07-04 11:00:10','2025-07-04 05:48:46',37,68,68,'',0,1,NULL,NULL),(203,'2025-07-05 06:16:41','kiran ','Rentokil','7012845494','Pest control','2025-07-05 11:46:41','2025-07-05 06:16:48',35,68,68,'',0,1,NULL,NULL),(204,'2025-07-07 05:27:24','Arundhathi','Varma','8848269038','Gayathri','2025-07-07 10:57:24','2025-07-07 11:36:56',35,69,71,'Laptop',0,1,NULL,NULL),(205,'2025-07-07 05:28:45','Simi','AFC','9061224132','Gayathri','2025-07-07 10:58:45','2025-07-07 08:44:40',36,69,71,'Laptop',0,1,NULL,NULL),(206,'2025-07-09 05:35:07','Karthik','Coffee day','7736303607','Service','2025-07-09 11:05:07','2025-07-09 05:40:31',35,71,71,'Service',0,1,NULL,NULL),(207,'2025-07-09 07:58:44','Sneha.','ICICI Bank','8655380225','Gayathri','2025-07-09 13:28:44','2025-07-09 08:27:19',35,71,68,'Bank',0,1,NULL,NULL),(208,'2025-07-14 04:42:27','Hridya','Varma','8971887210','Gayathri','2025-07-14 10:12:27','2025-07-14 12:18:25',35,69,71,'Laptop',0,1,NULL,NULL),(209,'2025-07-14 04:54:51','Arundhathi','Varma','8848269038','Gayathri','2025-07-14 10:24:51','2025-07-14 12:19:55',36,69,71,'Laptop',0,1,NULL,NULL),(210,'2025-07-14 06:14:52','Kanakesh','HI Point ','9895925021','net work checking','2025-07-14 11:44:52','2025-07-14 09:43:36',37,69,71,'Laptop',0,2,NULL,NULL),(211,'2025-07-16 05:42:11','Abhishek','HI Point ','8078983484','Visit Smita','2025-07-16 11:12:11','2025-07-16 06:03:02',35,71,71,'Laptop',0,1,NULL,NULL),(212,'2025-07-16 05:44:17','Revathy','Greenplacement','9995561645','Visit Smita','2025-07-16 11:14:17','2025-07-16 06:09:02',36,71,71,'Green placement',0,1,NULL,NULL),(213,'2025-07-17 04:23:43','Arundhathi','Varma','8848269038','Audit','2025-07-17 09:53:43','2025-07-17 12:15:49',35,71,68,'Laptop',0,1,NULL,NULL),(214,'2025-07-17 05:04:06','Hridya','Varma','8971887210','Audit','2025-07-17 10:34:06','2025-07-17 12:10:41',36,71,68,'Laptop',0,1,NULL,NULL),(215,'2025-07-17 06:32:01','Sibi','M2','8138833494','AC Checking','2025-07-17 12:02:01','2025-07-17 06:38:31',37,71,71,'AC',0,2,NULL,NULL),(216,'2025-07-17 09:11:24','Simi','AFC','9061224132','Gayathri','2025-07-17 14:41:24','2025-07-17 12:03:14',37,68,68,'',0,2,NULL,NULL),(217,'2025-07-19 05:44:52','kiran ','Rentokil','7012845490','Pest control','2025-07-19 11:14:52','2025-07-19 05:46:16',35,69,69,'',0,1,NULL,NULL),(218,'2025-07-21 08:50:08','Satheesh','Rentokil','9209160863','service','2025-07-21 14:20:08','2025-07-21 08:59:05',35,71,71,'Air freshener',0,2,NULL,NULL),(219,'2025-07-22 08:06:56','Ujwal Das','Arbor','9567309815','interview','2025-07-22 13:36:56','2025-07-22 08:58:03',35,71,68,'interview',0,1,NULL,NULL),(220,'2025-07-23 08:29:10','Anitta','Arbor','9074603272','Gayathri','2025-07-23 13:59:10','2025-07-23 09:07:21',35,71,68,'Gayathri',0,1,NULL,NULL),(221,'2025-07-24 04:52:12','Shamnadh','Arbor','7034656641','shyam','2025-07-24 10:22:12','2025-07-24 08:02:25',35,68,68,'',0,1,NULL,NULL),(222,'2025-07-24 06:04:18','Maeena ','interview','6282405368','interview','2025-07-24 11:34:18','2025-07-24 07:19:56',36,68,68,'',0,1,NULL,NULL),(223,'2025-07-30 05:33:47','Revathy','Greenplacement','9995561645','checking','2025-07-30 11:03:47','2025-07-30 05:57:01',35,68,68,'',0,1,NULL,NULL),(224,'2025-07-30 09:36:46','Girish','ICICI Bank','8135747927','Gayathri','2025-07-30 15:06:46','2025-07-30 09:52:58',35,69,69,'',0,2,NULL,NULL),(225,'2025-07-31 09:35:11','Shahim','Noster','8489193652','Visit Smita','2025-07-31 15:05:11','2025-07-31 09:35:22',37,69,69,'',0,1,NULL,NULL),(226,'2025-08-01 05:50:40','Resmi','Green placement','9188314105','H/K','2025-08-01 11:20:40','2025-08-01 08:06:36',35,69,69,'',0,1,NULL,NULL),(227,'2025-08-01 08:08:07','Sibi','M2','8138833494','Water reading','2025-08-01 13:38:07','2025-08-01 08:08:17',36,69,69,'',0,2,NULL,NULL),(228,'2025-08-02 07:07:51','Nikhil','Rentokil','9656088536','Pest control','2025-08-02 12:37:51','2025-08-02 07:08:02',35,69,69,'',0,1,NULL,NULL),(229,'2025-08-04 02:18:59','RESMI','Green placement','9188314105','House Keeping','2025-08-04 07:48:59','2025-08-04 11:41:13',37,71,68,'Housekeeping',0,1,NULL,NULL),(230,'2025-08-04 06:36:39','Karthik','Coffee day','7735303603','Installation','2025-08-04 12:06:39','2025-08-04 06:41:41',35,71,71,'Installation',0,1,NULL,NULL),(231,'2025-08-04 07:21:56','Karthik','Coffee day','7736303607','service','2025-08-04 12:51:56','2025-08-04 07:34:37',35,71,71,'Service',0,1,NULL,NULL),(232,'2025-08-05 04:21:20','Resmi','Green placement','9188914105','House Keeping','2025-08-05 09:51:20','2025-08-05 11:46:12',37,68,69,'',0,1,NULL,NULL),(233,'2025-08-05 06:57:04','Shahabas','interview','7736381687','shyam','2025-08-05 12:27:04','2025-08-05 08:20:04',35,68,68,'',0,1,NULL,NULL),(234,'2025-08-05 10:32:47','Jeenu J S','Arbor','9539985801','Interview','2025-08-05 16:02:47','2025-08-05 11:59:00',35,69,69,'',0,1,NULL,NULL),(235,'2025-08-06 04:31:45','Resmi','Green placement','9788914105','House Keeping','2025-08-06 10:01:45','2025-08-06 11:41:38',37,68,69,'Housekeeping',0,1,NULL,NULL),(236,'2025-08-06 08:39:54','Akhil','Arbor','9567592929','Interview','2025-08-06 14:09:54','2025-08-06 10:01:01',35,69,69,'',0,1,NULL,NULL),(237,'2025-08-06 11:27:56','Jithu K S','HI Point ','9656984771','service','2025-08-06 16:57:56','2025-08-06 11:28:30',36,69,69,'',0,1,NULL,NULL),(238,'2025-08-07 02:05:45','Resmi','Green placement','9188314105','H /K','2025-08-07 07:35:45','2025-08-07 13:00:01',35,69,71,'',0,1,NULL,NULL),(239,'2025-08-07 09:19:37','Siyad','M2','9846013987','Visit Smita','2025-08-07 14:49:37','2025-08-07 09:22:55',36,71,71,'Guest',0,3,NULL,NULL),(240,'2025-08-08 02:29:53','Resmi','Green placement','9188314105','House Keeping','2025-08-08 07:59:53','2025-08-08 08:16:01',35,69,69,'',0,1,NULL,NULL),(241,'2025-08-09 02:24:30','RESMI','Arbor','9188314105','House Keeping','2025-08-09 07:54:30','2025-08-09 10:03:53',35,71,68,'Housekeeping',0,1,NULL,NULL),(242,'2025-08-09 08:14:08','AJIN','Noster','8921939654','Visit Smita','2025-08-09 13:44:08','2025-08-09 08:16:12',36,71,71,'Nostar',0,1,NULL,NULL),(243,'2025-08-11 02:43:42','Resmi','Green placement','9188314105','House Keeping','2025-08-11 08:13:42','2025-08-11 11:41:45',35,68,69,'',0,1,NULL,NULL),(244,'2025-08-11 07:43:08','Rejin','HI Point ','9496068337','George','2025-08-11 13:13:08','2025-08-11 09:09:31',36,68,69,'',0,1,NULL,NULL),(245,'2025-08-13 06:56:33','Revathy','Green placement','9995561645','H/K Supervicer','2025-08-13 12:26:33','2025-08-13 07:06:16',35,69,69,'',0,1,NULL,NULL),(246,'2025-08-19 08:48:11','Sneha','ICICI Bank','8655380225','Gayathri','2025-08-19 14:18:11','2025-08-19 14:16:12',35,71,NULL,'Gayathri',0,1,NULL,NULL),(247,'2025-08-20 06:28:31','Revathy','Green placement','9995561645','H/K Supervicer','2025-08-20 11:58:31','2025-08-20 06:28:39',35,69,69,'',0,1,NULL,NULL),(248,'2025-08-22 07:00:19','Prijas','Coffee day','7994870953','service','2025-08-22 12:30:19','2025-08-22 07:22:36',35,68,68,'',0,1,NULL,NULL),(249,'2025-08-22 09:42:41','VISHNU','AQUEGUARD','6282225738','service','2025-08-22 15:12:41','2025-08-22 09:42:51',35,69,69,'',0,1,NULL,NULL),(250,'2025-08-23 08:39:41','kiran ','Rentokil','7012845490','Pest control','2025-08-23 14:09:41','2025-08-23 08:39:50',37,69,69,'',0,1,NULL,NULL),(251,'2025-08-25 04:06:00','Vinusharma','Arbor','9363394579','New joining','2025-08-25 09:36:00','2025-08-25 08:34:20',35,71,68,'syam',0,1,NULL,NULL),(252,'2025-08-25 04:56:16','Jeenu JS','Arbor','9539985801','New joining','2025-08-25 10:26:16','2025-08-25 08:34:40',36,71,68,'Syam',0,1,NULL,NULL),(253,'2025-08-25 07:16:34','Sibi','M2','9778688275','checking','2025-08-25 12:46:34','2025-08-25 07:23:38',37,71,71,'Check Electric room',0,2,NULL,NULL),(254,'2025-08-26 09:59:15','Sneha','ICICI Bank','8655380225','Gayathri','2025-08-26 15:29:15','2025-08-26 10:31:55',35,68,68,'',0,1,NULL,NULL),(255,'2025-08-26 10:06:58','VISHNU','AQUEGUARD','6282225738','service','2025-08-26 15:36:58','2025-08-26 10:07:26',36,68,68,'',0,1,NULL,NULL),(256,'2025-08-30 05:29:26','kiran ','Rentokil','7012845490','Pest control','2025-08-30 10:59:26','2025-08-30 05:29:37',35,69,69,'',0,1,NULL,NULL),(257,'2025-08-30 08:35:57','karthik','Naveen','7012843594','Security','2025-08-30 14:05:57','2025-08-30 09:03:40',36,71,71,'security',0,1,NULL,NULL),(258,'2025-09-01 10:08:23','Sreejith','ICICI Bank','7736863524','Gayathri','2025-09-01 15:38:23','2025-09-01 10:37:33',37,69,69,'',0,1,NULL,NULL),(259,'2025-09-01 10:39:09','Sibi','M2','8138833494','Water reading','2025-09-01 16:09:09','2025-09-01 10:39:21',36,69,69,'',0,2,NULL,NULL),(260,'2025-09-02 07:06:58','karthik','Coffee day','7736303607','service','2025-09-02 12:36:58','2025-09-02 07:18:01',35,71,71,'Service',0,1,NULL,NULL),(261,'2025-09-10 04:48:52','Nandhitha','Arbor','8075400757','Interview','2025-09-10 10:18:52','2025-09-10 06:24:27',35,71,71,'Syam',0,2,NULL,NULL),(262,'2025-09-10 04:52:52','Meera','Arbor','8078272781','Interview','2025-09-10 10:22:52','2025-09-10 06:24:45',36,71,71,'Syam',0,1,NULL,NULL),(263,'2025-09-10 09:24:00','Ajith S','Arbor','6282990267','interview','2025-09-10 14:54:00','2025-09-10 10:19:08',35,69,69,'',0,1,NULL,NULL),(264,'2025-09-15 03:22:50','Yadhu','Gardence Technolegy','7012415725','Syam','2025-09-15 08:52:50','2025-09-15 04:08:00',35,71,71,'Guest',0,1,NULL,NULL),(265,'2025-09-15 04:13:20','Mohmadh Misab','Arbor','8078048718','Interview','2025-09-15 09:43:20','2025-09-15 09:49:00',35,71,69,'interview',0,1,NULL,NULL),(266,'2025-09-15 04:35:57','Ram Harijith','Arbor','7306117939','Interview','2025-09-15 10:05:57','2025-09-15 07:45:37',36,71,71,'interview',0,1,NULL,NULL),(267,'2025-09-15 04:39:56','Chandra Kanth','Arbor','9961015566','Interview','2025-09-15 10:09:56','2025-09-15 07:45:50',37,71,71,'interview',0,1,NULL,NULL),(268,'2025-09-15 11:05:36','Pradeesh','M2','9048097500','service','2025-09-15 16:35:36','2025-09-15 11:41:57',35,69,69,'',0,4,NULL,NULL),(269,'2025-09-18 05:40:15','Pradheesh','M2','9048037500','Extinguisher Checking','2025-09-18 11:10:15','2025-09-18 05:44:09',35,71,71,'Fire  Safety',0,2,NULL,NULL),(270,'2025-09-18 06:44:22','Raja lekshmi','Arbor','8078972513','Smita','2025-09-18 12:14:22','2025-09-18 12:13:53',35,71,69,'Smita',0,1,NULL,NULL),(271,'2025-09-23 06:47:58','Revathy','Green placement','9995581645','Visit Smita','2025-09-23 12:17:58','2025-09-23 07:28:46',36,71,71,'Green placement',0,1,NULL,NULL),(272,'2025-09-26 06:42:55','Sibi','Hevaco','8138833494','A C Service','2025-09-26 12:12:55','2025-09-26 11:24:40',37,69,71,'',0,3,NULL,NULL),(273,'2025-10-01 06:12:11','Pradheesh','M2','9048037500','Water reading','2025-10-01 11:42:11','2025-10-01 06:16:05',36,71,71,'Water Reading',0,2,NULL,NULL),(274,'2025-10-04 05:11:12','Pradeesh','M2','9048037500','Water leakage','2025-10-04 10:41:12','2025-10-04 06:17:48',37,69,69,'',0,3,NULL,NULL),(275,'2025-10-04 06:20:06','Nikhil','Rentokil','9656088536','Pest control','2025-10-04 11:50:06','2025-10-04 06:20:54',36,69,69,'',0,1,NULL,NULL),(276,'2025-10-06 11:52:41','Sreejith','ICICI Bank','8086860942','Gayathri','2025-10-06 17:22:41','2025-10-06 12:12:40',36,71,71,'ICICI Bank',0,2,NULL,NULL),(277,'2025-10-08 06:04:53','Sreeju','Rentokil','8590975827','service','2025-10-08 11:34:53','2025-10-08 06:15:26',37,71,71,'Air freshener',0,1,NULL,NULL),(278,'2025-10-10 05:36:08','Sachu','Naveen Security','6238128137','Security','2025-10-10 11:06:08','2025-10-10 06:42:43',37,69,69,'',0,1,NULL,NULL),(279,'2025-10-10 06:45:00','Satheesh','K M D R I','7994337292','Visit Smita','2025-10-10 12:15:00','2025-10-16 08:42:19',36,69,72,'Laptop',0,1,NULL,NULL),(280,'2025-10-31 06:11:57','test','arbor','9999999999','test','2025-10-31 11:41:57','2025-10-31 06:13:43',36,72,72,'',0,1,NULL,NULL);
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

-- Dump completed on 2025-11-17 16:17:48
