
USE `alsten`;

DROP TABLE IF EXISTS `cliente_pj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_pj` (
  `cnpj` varchar(18) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `nome_fantasia` varchar(100) DEFAULT NULL,
  `contato` varchar(20) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`cnpj`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_pj`
--

LOCK TABLES `cliente_pj` WRITE;
/*!40000 ALTER TABLE `cliente_pj` DISABLE KEYS */;
INSERT INTO `cliente_pj` VALUES ('48191454001135','Dilce Nogueira Borges Camponêz','Bar JB - Mauro Dias Camponêz','44998841556','Rua Vereador Fermino Luiz, 230','Santa Inês','Centro','PR','86660000','2025-01-08 20:56:50','2025-01-08 20:57:48'),('48295562001884','Usina Alto Alegre Açúcar e Alcool SA','Usina Alto Alegre','44999944444','Colônia Zacarias de Goes S/N','Santo Inácio','Zona Rural','Pa','86650000','2024-12-19 01:00:25','2024-12-19 01:00:25'),('48295562002025','Leandro e Cia Ltda','Mercado JB - Santa Inês','44998837608','Rua Amazonas, 215','Santa Inês','Centro','PR','86660000','2025-01-06 12:21:43','2025-01-06 12:21:43'),('48551495000110','Prefeitura Municipal de Santa Inês','PM Santa Inês','44999994444','Rua Rio Branco','Santa Inês','Centro','PR','86660000','2025-01-03 12:16:52','2025-01-03 12:16:52');
/*!40000 ALTER TABLE `cliente_pj` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(2,'Gerente'),(3,'Cliente'),(4,'Gerente de Publicidades');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `prop_publ` varchar(100) DEFAULT NULL,
  `id_dados` varchar(255) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Vitor Carriel','admin@gmail.com','$2a$10$Rsio2stC6V/KOKIKhXTB5Ox5jY/R2qHg/bDTM6hCY.WTBeMJY9g4e',1,NULL,NULL,'2025-01-03 14:04:54','2025-01-06 13:49:19'),(2,'João Carlos','gerente@gmail.com','$2a$10$fKsv3650ZKNXV1pNgWR5ve9p7bJ0ejA8XeNVgz8DewrCQWgJT1QdS',2,NULL,NULL,'2025-01-03 14:04:54','2025-01-06 13:49:44'),(11,'Thiago Camponêz','thiago@gmail.com','$2a$10$jvvTSrHTbo8qNvFzCd5qoemNl46biY8nazxJ6SdIvDWtO5DLIgztq',3,'prop','10','2025-01-10 16:04:30','2025-01-19 23:38:09'),(12,'Laís Camponêz','lais@gmail.com','$2a$10$hD0qwJRNGv14Bm5Z1MPp/u1G2QWjgvwerVNsM0V2nedG0rsAFayAi',3,'prop','9','2025-01-10 16:04:55','2025-01-10 16:05:18'),(13,'Manu','manu@gmail.com','$2a$10$uZsgc08k6sljD1S7Ks8QNuent.eKTR3yQd2oeWh.7ajkOLZr77y3q',3,'propF','48','2025-01-11 20:42:30','2025-01-17 15:01:41'),(14,'Davi','davi@gmail.com','$2a$10$XSIDBmOSxW..lJfQNA61kOLpKHde3ifNKzcuJUemBZNrCYeOxXSn6',3,'publ','38','2025-01-15 12:21:38','2025-01-15 23:41:28'),(15,'Teste','teste1@gmail.com','$2a$10$JeGE.n0e4krYY/UDXJbmV.WCb533XpwT8zzqTNDDykHujEtMZT/CG',3,'propF','48','2025-01-16 20:17:01','2025-01-16 20:20:13'),(16,'Niandra','niandra@gmail.com','$2a$10$dWBxf50rPSyKhNHgBlMJ9uW.nkt9BfdWXuV47V3K1./zlJhE1xvGK',4,'publ','37,38,39','2025-01-17 12:58:03','2025-01-25 14:50:54');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-25 21:45:14
