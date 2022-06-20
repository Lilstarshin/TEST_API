CREATE DATABASE  IF NOT EXISTS `triple_1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `triple`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: triple
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `bookmark_list`
--

DROP TABLE IF EXISTS `bookmark_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmark_list` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `place_id` char(36) NOT NULL COMMENT 'place_info table plcae_id',
  `user_id` char(36) NOT NULL COMMENT 'user_info table user_id',
  PRIMARY KEY (`idx`,`place_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmark_list`
--

LOCK TABLES `bookmark_list` WRITE;
/*!40000 ALTER TABLE `bookmark_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookmark_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_info`
--

DROP TABLE IF EXISTS `event_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_info` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `event_id` char(36) NOT NULL COMMENT 'event 고유 ID',
  `place_id` char(36) NOT NULL COMMENT '장소 ID',
  `reg_user_id` char(36) NOT NULL COMMENT '등록한 유저 ID',
  `star_rating` tinyint NOT NULL DEFAULT '0' COMMENT '장소 평점',
  `content` varchar(2000) NOT NULL DEFAULT '' COMMENT '리뷰 내용',
  `attachment_id` varchar(1000) NOT NULL DEFAULT '' COMMENT '첨부 사진',
  PRIMARY KEY (`idx`,`event_id`),
  KEY `PLACEID_USERID` (`place_id`,`reg_user_id`,`star_rating`) USING BTREE,
  KEY `USERID_PLACEID` (`reg_user_id`,`place_id`,`star_rating`) USING BTREE,
  KEY `EVENT_ID` (`event_id`) USING BTREE COMMENT '''''''EVENT_ID 검색''''''',
  KEY `STAR_RATING` (`star_rating`,`reg_user_id`,`place_id`) USING BTREE,
  CONSTRAINT `EVENT_INFO_FK_PLACE_ID` FOREIGN KEY (`place_id`) REFERENCES `place_info` (`place_id`) ON UPDATE CASCADE,
  CONSTRAINT `EVENT_INFO_FK_USER_ID` FOREIGN KEY (`reg_user_id`) REFERENCES `user_info` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100049 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_info`
--

LOCK TABLES `event_info` WRITE;
/*!40000 ALTER TABLE `event_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_info_hist`
--

DROP TABLE IF EXISTS `event_info_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_info_hist` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `event_id` char(36) NOT NULL COMMENT 'event table event_id',
  `event_type` varchar(20) NOT NULL COMMENT '이벤트 타입(ex: "review")',
  `event_action` varchar(6) NOT NULL COMMENT '이벤트 액션(ex: "ADD", "DELETE")',
  `bef_content` varchar(2000) NOT NULL DEFAULT '' COMMENT '이전 리뷰 내용',
  `aft_content` varchar(2000) NOT NULL DEFAULT '' COMMENT '변경 리뷰 내용',
  `bef_attachment_id` varchar(1000) NOT NULL DEFAULT '' COMMENT '이전 첨부 사진',
  `aft_attachment_id` varchar(1000) NOT NULL DEFAULT '' COMMENT '변경 첨부 사진',
  `bef_star_rating` tinyint NOT NULL DEFAULT '0' COMMENT '이전 별점',
  `aft_star_raintg` tinyint NOT NULL DEFAULT '0' COMMENT '변경 별점',
  `reg_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일시',
  PRIMARY KEY (`idx`,`event_type`,`reg_dttm`,`event_id`),
  KEY `DATETIME` (`reg_dttm`,`event_type`,`event_action`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_info_hist`
--

LOCK TABLES `event_info_hist` WRITE;
/*!40000 ALTER TABLE `event_info_hist` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_info_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `place_info`
--

DROP TABLE IF EXISTS `place_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place_info` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `place_id` char(36) NOT NULL COMMENT '장소 ID',
  `place_type` varchar(20) NOT NULL COMMENT '장소타입(ex: "RESTORENT") ',
  `place_name` varchar(100) NOT NULL COMMENT '장소명',
  `place_description` varchar(1000) NOT NULL DEFAULT '' COMMENT '장소 설명',
  `place_address` varchar(100) NOT NULL DEFAULT '' COMMENT '장소의 주소',
  `bookmark_cnt` bigint NOT NULL DEFAULT '0' COMMENT '장소 북마크 카운트',
  `avg_star_rating` float NOT NULL DEFAULT '0' COMMENT '장소 평점',
  PRIMARY KEY (`idx`,`place_id`,`place_address`),
  KEY `PLACEID` (`place_id`,`place_type`) USING BTREE,
  KEY `PLACENAME` (`place_name`,`place_type`,`place_address`) USING BTREE,
  KEY `STAR_RATING` (`avg_star_rating`,`bookmark_cnt`,`place_address`,`place_type`),
  KEY `EVENT_PLACE` (`place_type`,`avg_star_rating`)
) ENGINE=InnoDB AUTO_INCREMENT=100002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place_info`
--

LOCK TABLES `place_info` WRITE;
/*!40000 ALTER TABLE `place_info` DISABLE KEYS */;
INSERT INTO `place_info` VALUES (1,'2e4baf1c-5acb-4efb-a1af-eddada31b00f','STUDYCAFE','플랜에이스터디카페 서울대입구역센터','공간의 차이가 성적의 차이! 플랜에이 스터디카페 서울대입구역센터!','서울 관악구 남부순환로 1797 3층',0,0);
/*!40000 ALTER TABLE `place_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `place_info_hist`
--

DROP TABLE IF EXISTS `place_info_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place_info_hist` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `reg_user_id` char(36) NOT NULL COMMENT 'user_info table user_id',
  `place_id` char(36) NOT NULL COMMENT 'place_info table plcae_id',
  `hist_type` varchar(20) NOT NULL COMMENT '이벤트 타입(ex: "MOD")',
  `hist_comment` varchar(2000) NOT NULL DEFAULT '' COMMENT '수정 내용',
  `reg_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일시',
  PRIMARY KEY (`idx`,`reg_user_id`,`place_id`,`reg_dttm`),
  KEY `USERID` (`reg_user_id`,`place_id`,`reg_dttm`) USING BTREE,
  KEY `PLACE_ID_idx` (`place_id`),
  CONSTRAINT `PLACE_INFO_HIST_FK_PLACE_ID` FOREIGN KEY (`place_id`) REFERENCES `place_info` (`place_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place_info_hist`
--

LOCK TABLES `place_info_hist` WRITE;
/*!40000 ALTER TABLE `place_info_hist` DISABLE KEYS */;
INSERT INTO `place_info_hist` VALUES (1,'3ede0ef2-92b7-4817-a5f3-0c575361f745','2e4baf1c-5acb-4efb-a1af-eddada31b00f','ADD','신규 장소 추가','2022-06-16 14:17:53');
/*!40000 ALTER TABLE `place_info_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `user_id` char(36) NOT NULL COMMENT '유저ID',
  `user_email` varchar(40) NOT NULL COMMENT '유저 이메일',
  `user_hashed_password` varchar(100) NOT NULL COMMENT '유저 비밀번호',
  `nickname` varchar(20) NOT NULL COMMENT '유저 별칭',
  `token` varchar(100) NOT NULL DEFAULT '' COMMENT '유저 토큰 정보',
  `use_yn` int DEFAULT '1' COMMENT '사용유무',
  `last_login_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '마지막 로그인 일시',
  `verified` tinyint NOT NULL DEFAULT '0' COMMENT '이메일 인증',
  PRIMARY KEY (`user_id`,`user_email`),
  KEY `NICKNAME` (`nickname`,`user_email`,`user_id`,`last_login_dttm`) USING BTREE,
  KEY `EXPIRED` (`use_yn`,`verified`,`nickname`,`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES ('3ede0ef2-92b7-4817-a5f3-0c575361f745','lilstar_0@naver.com','4bcef4d42f067f84d709b6f2d9ff91f6ae1dc706854dd3140849208f148a5a03','새별0','',1,'2022-06-16 19:18:26',0);
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info_hist`
--

DROP TABLE IF EXISTS `user_info_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info_hist` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `reg_user_id` char(36) NOT NULL COMMENT '등록한 유저 ID',
  `tar_user_id` char(36) NOT NULL COMMENT '대상 유저 ID',
  `hist_type` varchar(6) NOT NULL COMMENT '이벤트 타입(ex: "ADD", "DELETE")',
  `hist_comment` varchar(2000) NOT NULL DEFAULT '' COMMENT '수정 내용',
  `reg_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일시',
  PRIMARY KEY (`idx`,`reg_user_id`,`tar_user_id`,`reg_dttm`),
  KEY `DATETIME` (`reg_dttm`,`tar_user_id`,`reg_user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info_hist`
--

LOCK TABLES `user_info_hist` WRITE;
/*!40000 ALTER TABLE `user_info_hist` DISABLE KEYS */;
INSERT INTO `user_info_hist` VALUES (1,'admin','3ede0ef2-92b7-4817-a5f3-0c575361f745','ADD','일반 사용자 추가','2022-06-16 14:12:38');
/*!40000 ALTER TABLE `user_info_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_point_hist`
--

DROP TABLE IF EXISTS `user_point_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_point_hist` (
  `idx` bigint NOT NULL AUTO_INCREMENT COMMENT 'INDEX',
  `event_id` char(36) NOT NULL COMMENT 'event table event_id',
  `user_id` char(36) NOT NULL COMMENT '대상 유저ID',
  `issuer` varchar(20) NOT NULL COMMENT '발행인',
  `hist_type` varchar(6) NOT NULL COMMENT '이벤트 타입(ex: "USE","SAVE")',
  `calcul_point` int NOT NULL DEFAULT '0' COMMENT '사용,저장 포인트',
  `total_point` int NOT NULL DEFAULT '0' COMMENT '누적 포인트',
  `hist_comment` varchar(2000) NOT NULL DEFAULT '' COMMENT '수정 내용',
  `reg_dttm` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일시',
  PRIMARY KEY (`idx`,`user_id`,`reg_dttm`,`event_id`),
  KEY `ISSUER` (`issuer`,`reg_dttm`,`hist_type`),
  KEY `TOTAL_POINT` (`total_point`,`reg_dttm`,`user_id`,`event_id`) USING BTREE,
  KEY `EVENT_ID_idx` (`event_id`),
  KEY `USERID` (`user_id`),
  CONSTRAINT `USER_POINT_HIST_FK_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_point_hist`
--

LOCK TABLES `user_point_hist` WRITE;
/*!40000 ALTER TABLE `user_point_hist` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_point_hist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-20 17:54:06
