-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Client: localhost-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Jeu 29 Octobre 2015 à 22:56
-- Version du serveur: 5.5.46
-- Version de PHP: 5.4.45-0+deb7u1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données: `zm` V0.1.3
--

-- --------------------------------------------------------

--
-- Structure de la table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`module`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Déclencheurs `modules`
--
DROP TRIGGER IF EXISTS `modules_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `modules_task_creation_timestamp` BEFORE INSERT ON `modules`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `modules_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `modules_task_update_timestamp` BEFORE UPDATE ON `modules`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `mynetworks`
--

DROP TABLE IF EXISTS `mynetworks`;
CREATE TABLE IF NOT EXISTS `mynetworks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` tinyint(1) NOT NULL,
  `network` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain` (`network`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Déclencheurs `mynetworks`
--
DROP TRIGGER IF EXISTS `mynetworks_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `mynetworks_task_creation_timestamp` BEFORE INSERT ON `mynetworks`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `mynetworks_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `mynetworks_task_update_timestamp` BEFORE UPDATE ON `mynetworks`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `relay_domains`
--

DROP TABLE IF EXISTS `relay_domains`;
CREATE TABLE IF NOT EXISTS `relay_domains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` tinyint(1) NOT NULL,
  `domain` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain` (`domain`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Déclencheurs `relay_domains`
--
DROP TRIGGER IF EXISTS `relay_domains_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `relay_domains_task_creation_timestamp` BEFORE INSERT ON `relay_domains`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `relay_domains_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `relay_domains_task_update_timestamp` BEFORE UPDATE ON `relay_domains`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `smtp_servers`
--

DROP TABLE IF EXISTS `smtp_servers`;
CREATE TABLE IF NOT EXISTS `smtp_servers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` int(11) NOT NULL DEFAULT '0',
  `server` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `server` (`server`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Déclencheurs `smtp_servers`
--
DROP TRIGGER IF EXISTS `smtp_servers_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `smtp_servers_task_creation_timestamp` BEFORE INSERT ON `smtp_servers`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `smtp_servers_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `smtp_servers_task_update_timestamp` BEFORE UPDATE ON `smtp_servers`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `transport`
--

DROP TABLE IF EXISTS `transport`;
CREATE TABLE IF NOT EXISTS `transport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(128) NOT NULL,
  `transport` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain` (`domain`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2108 ;

--
-- Déclencheurs `transport`
--
DROP TRIGGER IF EXISTS `transport_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `transport_task_creation_timestamp` BEFORE INSERT ON `transport`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `transport_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `transport_task_update_timestamp` BEFORE UPDATE ON `transport`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` int(11) NOT NULL DEFAULT '1',
  `state` int(11) NOT NULL DEFAULT '0',
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Déclencheurs `users`
--
DROP TRIGGER IF EXISTS `users_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `users_task_creation_timestamp` BEFORE INSERT ON `users`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `users_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `users_task_update_timestamp` BEFORE UPDATE ON `users`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `usersmodules`
--

DROP TABLE IF EXISTS `usersmodules`;
CREATE TABLE IF NOT EXISTS `usersmodules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `moduleid` int(11) NOT NULL,
  `hasshortcut` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

-- --------------------------------------------------------

--
-- Structure de la table `usersshortcuts2`
--

DROP TABLE IF EXISTS `usersshortcuts2`;
CREATE TABLE IF NOT EXISTS `usersshortcuts2` (
  `userid` int(11) NOT NULL,
  `moduleid` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Généré le: Mer 28 Octobre 2015 à 18:51
-- Version du serveur: 5.5.46
-- Version de PHP: 5.4.45-0+deb7u1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données: `zm` v0.1.2
--

-- --------------------------------------------------------

--
-- Structure de la table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`module`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Déclencheurs `modules`
--
DROP TRIGGER IF EXISTS `modules_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `modules_task_creation_timestamp` BEFORE INSERT ON `modules`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `modules_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `modules_task_update_timestamp` BEFORE UPDATE ON `modules`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `smtp_servers`
--

DROP TABLE IF EXISTS `smtp_servers`;
CREATE TABLE IF NOT EXISTS `smtp_servers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` int(11) NOT NULL DEFAULT '0',
  `server` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `server` (`server`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Déclencheurs `smtp_servers`
--
DROP TRIGGER IF EXISTS `smtp_servers_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `smtp_servers_task_creation_timestamp` BEFORE INSERT ON `smtp_servers`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `smtp_servers_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `smtp_servers_task_update_timestamp` BEFORE UPDATE ON `smtp_servers`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `transport`
--

DROP TABLE IF EXISTS `transport`;
CREATE TABLE IF NOT EXISTS `transport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(128) NOT NULL,
  `transport` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain` (`domain`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2108 ;

--
-- Déclencheurs `transport`
--
DROP TRIGGER IF EXISTS `transport_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `transport_task_creation_timestamp` BEFORE INSERT ON `transport`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `transport_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `transport_task_update_timestamp` BEFORE UPDATE ON `transport`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` int(11) NOT NULL DEFAULT '1',
  `state` int(11) NOT NULL DEFAULT '0',
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Déclencheurs `users`
--
DROP TRIGGER IF EXISTS `users_task_creation_timestamp`;
DELIMITER //
CREATE TRIGGER `users_task_creation_timestamp` BEFORE INSERT ON `users`
 FOR EACH ROW SET NEW.created_date = NOW()
//
DELIMITER ;
DROP TRIGGER IF EXISTS `users_task_update_timestamp`;
DELIMITER //
CREATE TRIGGER `users_task_update_timestamp` BEFORE UPDATE ON `users`
 FOR EACH ROW SET NEW.modified_date = NOW()
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `usersmodules`
--

DROP TABLE IF EXISTS `usersmodules`;
CREATE TABLE IF NOT EXISTS `usersmodules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `moduleid` int(11) NOT NULL,
  `hasshortcut` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

-- --------------------------------------------------------

--
-- Structure de la table `usersshortcuts`
--

DROP TABLE IF EXISTS `usersshortcuts`;
CREATE TABLE IF NOT EXISTS `usersshortcuts` (
  `userid` int(11) NOT NULL,
  `moduleid` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
