-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u1
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Jeu 12 Novembre 2015 à 16:07
-- Version du serveur :  5.5.46-0+deb8u1
-- Version de PHP :  5.6.14-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `zm` V0.1.4
--
CREATE DATABASE IF NOT EXISTS `zm` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `zm`;

-- --------------------------------------------------------

--
-- Structure de la table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
`id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `module` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

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
`id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `network` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

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
`id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `domain` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

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
`id` int(11) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `server` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

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
`id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '1',
  `domain` varchar(128) NOT NULL,
  `transport` varchar(128) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM AUTO_INCREMENT=2108 DEFAULT CHARSET=utf8;

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
`id` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT '1',
  `state` int(11) NOT NULL DEFAULT '0',
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

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
`id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `moduleid` int(11) NOT NULL,
  `hasshortcut` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;

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

--
-- Index pour les tables exportées
--

--
-- Index pour la table `modules`
--
ALTER TABLE `modules`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `UNIQUE` (`module`);

--
-- Index pour la table `mynetworks`
--
ALTER TABLE `mynetworks`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `domain` (`network`);

--
-- Index pour la table `relay_domains`
--
ALTER TABLE `relay_domains`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `domain` (`domain`);

--
-- Index pour la table `smtp_servers`
--
ALTER TABLE `smtp_servers`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `server` (`server`);

--
-- Index pour la table `transport`
--
ALTER TABLE `transport`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `domain` (`domain`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `usersmodules`
--
ALTER TABLE `usersmodules`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `modules`
--
ALTER TABLE `modules`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT pour la table `mynetworks`
--
ALTER TABLE `mynetworks`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `relay_domains`
--
ALTER TABLE `relay_domains`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT pour la table `smtp_servers`
--
ALTER TABLE `smtp_servers`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `transport`
--
ALTER TABLE `transport`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2108;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT pour la table `usersmodules`
--
ALTER TABLE `usersmodules`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=57;