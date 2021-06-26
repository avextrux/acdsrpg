create database acds;

use acds;

CREATE TABLE `player_type` (
    `player_type_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`player_type_id`)
);

INSERT INTO `player_type` (`name`) VALUES ('keeper');
INSERT INTO `player_type` (`name`) VALUES ('investigator');

CREATE TABLE `player` (
    `player_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_type_id` int(11) UNSIGNED NOT NULL,
    `login` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`player_id`),
    CONSTRAINT `fk_player_player_type_id` FOREIGN KEY (`player_type_id`) REFERENCES `player_type`(`player_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `characteristic` (
    `characteristic_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `rollable` BOOLEAN NOT NULL,
    PRIMARY KEY (`characteristic_id`)
);

INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Força', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Destreza', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Inteligência', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Constituição', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Aparência', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Poder', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Tamanho', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Educação', TRUE);
INSERT INTO `characteristic` (`name`, `rollable`) VALUES ('Movimento', FALSE);

CREATE TABLE `player_characteristic` (
    `player_characteristic_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `characteristic_id` int(11) UNSIGNED NOT NULL,
    `value` bigint NOT NULL,
    PRIMARY KEY (`player_characteristic_id`),
    CONSTRAINT `uk_player_id_characteristic_id` UNIQUE (`player_id`, `characteristic_id`),
    CONSTRAINT `fk_player_characteristic_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_characteristic_characteristic_id` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic`(`characteristic_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `specialization` (
    `specialization_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`specialization_id`)
);

INSERT INTO `specialization` (`name`) VALUES ('Armas de Fogo');
INSERT INTO `specialization` (`name`) VALUES ('Arte e Ofício');
INSERT INTO `specialization` (`name`) VALUES ('Ciência');
INSERT INTO `specialization` (`name`) VALUES ('Língua');
INSERT INTO `specialization` (`name`) VALUES ('Lutar');
INSERT INTO `specialization` (`name`) VALUES ('Pilotar');
INSERT INTO `specialization` (`name`) VALUES ('Sobrevivência');


CREATE TABLE `skill` (
    `skill_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `specialization_id` int(11) UNSIGNED NULL,
    `name` varchar(255) NOT NULL,
    `mandatory` BOOLEAN NOT NULL,
    `start_value` int(11) UNSIGNED NOT NULL,
    PRIMARY KEY (`skill_id`),
    CONSTRAINT `fk_skill_specialization_id` FOREIGN KEY (`specialization_id`) REFERENCES `specialization`(`specialization_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Antropologia', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Arcos', 15, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Armas Pesadas', 10, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Lança-Chamas', 10, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Metralhadoras', 10, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Pistolas', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Rifles/Espingardas', 25, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (1, 'Submetralhadoras', 15, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Arqueologia', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Arremessar', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (2, 'Atuação', 5, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (2, 'Belas Artes', 5, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (2, 'Criptografia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (2, 'Falsificação', 5, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (2, 'Fotografia', 5, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Artilharia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Avaliação', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Cavalgar', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Charme', 15, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Chaveiro', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Astronomia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Biologia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Botânica', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Ciência Forense', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Engenharia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Farmácia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Física', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Geologia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Matemática', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Meteorologia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Química', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (3, 'Zoologia', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Consertos Elétricos', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Consertos Mecânicos', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Contabilidade', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Demolições', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Direito', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Dirigir Automóveis', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Disfarce', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Eletrônica', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Encontrar', 25, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Escalar', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Escutar', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Esquivar', 0, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Furtividade', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Hipnose', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'História', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Intimidação', 15, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Lábia', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Leitura Labial', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (4, 'Nativa', 0, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Briga', 25, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Chicotes', 5, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Espadas', 20, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Garrote', 15, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Lanças', 20, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Machados', 15, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Manguais', 10, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (5, 'Motosserras', 10, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Medicina', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Mergulho', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Mundo Natural', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Natação', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Navegação', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Nível de Crédito', 0, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Ocultismo', 5, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Operar Maquinário Pesado', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Persuasão', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (6, 'Aeronave', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (6, 'Barco', 1, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Prestidigitação', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Primeiros Socorros', 30, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Psicanálise', 1, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Psicologia', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Rastrear', 10, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Saltar', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Treinar Animais', 5, 0);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Usar Bibliotecas', 20, 1);
INSERT INTO `skill` (`specialization_id`, `name`, `start_value`, `mandatory`) VALUES (NULL, 'Usar Computadores', 5, 1);

CREATE TABLE `player_skill` (
    `player_skill_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `skill_id` int(11) UNSIGNED NOT NULL,
    `value` int(11) NOT NULL,
    `checked` BOOLEAN NOT NULL,
    PRIMARY KEY (`player_skill_id`),
    CONSTRAINT `uk_player_id_skill_id` UNIQUE (`player_id`, `skill_id`),
    CONSTRAINT `fk_player_skill_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_skill_skill_id` FOREIGN KEY (`skill_id`) REFERENCES `skill`(`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `attribute` (
    `attribute_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `rollable` BOOLEAN NOT NULL,
    `bg_color` varchar(6) NOT NULL,
    `fill_color` varchar(6) NOT NULL,
    PRIMARY KEY (`attribute_id`)
);

INSERT INTO `attribute` (`name`, `rollable`, `bg_color`, `fill_color`) VALUES ('Vida', 0, '5a1e1e', 'b62323');
INSERT INTO `attribute` (`name`, `rollable`, `bg_color`, `fill_color`) VALUES ('Sanidade', 1, '2c4470', '1f3ce0');
INSERT INTO `attribute` (`name`, `rollable`, `bg_color`, `fill_color`) VALUES ('Magia', 0, '682f5b', 'ae00ff');

CREATE TABLE `attribute_status` (
    `attribute_status_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `attribute_id` int(11) UNSIGNED NOT NULL,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`attribute_status_id`),
    CONSTRAINT `fk_attribute_status_attribute_id` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `attribute_status` (`name`, `attribute_id`) VALUES ('Inconsciente', 1);
INSERT INTO `attribute_status` (`name`, `attribute_id`) VALUES ('Ferimento Grave', 1);
INSERT INTO `attribute_status` (`name`, `attribute_id`) VALUES ('Traumatizado', 2);
INSERT INTO `attribute_status` (`name`, `attribute_id`) VALUES ('Enlouquecido', 2);

CREATE TABLE `player_attribute` (
    `player_attribute_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `attribute_id` int(11) UNSIGNED NOT NULL,
    `value` int(11) NOT NULL,
    `max_value` int(11) NOT NULL,
    PRIMARY KEY (`player_attribute_id`),
    CONSTRAINT `uk_player_id_attribute_id` UNIQUE (`player_id`, `attribute_id`),
    CONSTRAINT `fk_player_attribute_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_attribute_attribute_id` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `player_attribute_status` (
    `player_attribute_status_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `attribute_status_id` int(11) UNSIGNED NOT NULL,
    `value` BOOLEAN NOT NULL,
    PRIMARY KEY (`player_attribute_status_id`),
    CONSTRAINT `uk_player_id_attribute_status_id` UNIQUE (`player_id`, `attribute_status_id`),
    CONSTRAINT `fk_player_attribute_status_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_attribute_status_attribute_status_id` FOREIGN KEY (`attribute_status_id`) REFERENCES `attribute_status`(`attribute_status_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `equipment` (
    `equipment_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `skill_id` int(11) UNSIGNED NOT NULL,
    `damage` varchar(255) NOT NULL,
    `range` varchar(255) NOT NULL,
    `attacks` varchar(255) NOT NULL,
    `ammo` varchar(255) NOT NULL,
    `malfunc` varchar(10) NOT NULL,
    PRIMARY KEY (`equipment_id`),
    CONSTRAINT `fk_equipment_skill_id` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `equipment` (`name`, `skill_id`, `damage`, `range`, `attacks`, `ammo`, `malfunc`) VALUES ('Desarmado', (SELECT `skill_id` FROM `skill` WHERE `name` = 'Briga'), '1d3+DB', '-', '1(2)', '-', '-');
INSERT INTO `equipment` (`name`, `skill_id`, `damage`, `range`, `attacks`, `ammo`, `malfunc`) VALUES ('Soco Inglês', (SELECT `skill_id` FROM `skill` WHERE `name` = 'Briga'), '1d4+1+DB', '-', '1(2)', '-', '-');
INSERT INTO `equipment` (`name`, `skill_id`, `damage`, `range`, `attacks`, `ammo`, `malfunc`) VALUES ('Revólver .41', (SELECT `skill_id` FROM `skill` WHERE `name` = 'Pistolas'), '1d10', '20 metros', '1(3)', '8', '100');
INSERT INTO `equipment` (`name`, `skill_id`, `damage`, `range`, `attacks`, `ammo`, `malfunc`) VALUES ('IME Desert Eagle', (SELECT `skill_id` FROM `skill` WHERE `name` = 'Pistolas'), '1d10+1d6+3', '20 metros', '1(3)', '7', '94');
INSERT INTO `equipment` (`name`, `skill_id`, `damage`, `range`, `attacks`, `ammo`, `malfunc`) VALUES ('M16A2', (SELECT `skill_id` FROM `skill` WHERE `name` = 'Rifles/Espingardas'), '2d6', '120 metros', '1(2)/Rajada', '30', '97');


CREATE TABLE `player_equipment` (
    `player_equipment_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `equipment_id` int(11) UNSIGNED NOT NULL,
    `current_ammo` varchar(255) NOT NULL,
    `using` BOOLEAN NOT NULL,
    PRIMARY KEY (`player_equipment_id`),
    CONSTRAINT `uk_player_id_equipment_id` UNIQUE (`player_id`, `equipment_id`),
    CONSTRAINT `fk_player_equipment_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_equipment_equipment_id` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `spec` (
    `spec_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`spec_id`)
);

INSERT INTO `spec` (`name`) VALUES ('Dano Bônus');
INSERT INTO `spec` (`name`) VALUES ('Corpo');
INSERT INTO `spec` (`name`) VALUES ('Exposição Paranormal');

CREATE TABLE `player_spec` (
    `player_spec_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `spec_id` int(11) UNSIGNED NOT NULL,
    `value` varchar(255) NOT NULL,
    PRIMARY KEY (`player_spec_id`),
    CONSTRAINT `uk_player_id_spec_id` UNIQUE (`player_id`, `spec_id`),
    CONSTRAINT `fk_player_spec_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_spec_spec_id` FOREIGN KEY (`spec_id`) REFERENCES `spec`(`spec_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `item` (
    `item_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`item_id`)
);

CREATE TABLE `player_item` (
    `player_item_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `item_id` int(11) UNSIGNED NOT NULL,
    PRIMARY KEY (`player_item_id`),
    CONSTRAINT `uk_player_id_item_id` UNIQUE (`player_id`, `item_id`),
    CONSTRAINT `fk_player_item_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_item_item_id` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `info` (
    `info_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`info_id`)
);

INSERT INTO `info` (`name`) VALUES ('Nome');
INSERT INTO `info` (`name`) VALUES ('Player');
INSERT INTO `info` (`name`) VALUES ('Ocupação');
INSERT INTO `info` (`name`) VALUES ('Idade');
INSERT INTO `info` (`name`) VALUES ('Sexo');
INSERT INTO `info` (`name`) VALUES ('Residência');
INSERT INTO `info` (`name`) VALUES ('Local de Nascimento');
INSERT INTO `info` (`name`) VALUES ('Peso');
INSERT INTO `info` (`name`) VALUES ('Altura');
INSERT INTO `info` (`name`) VALUES ('Nível de Gasto Diário');
INSERT INTO `info` (`name`) VALUES ('Dinheiro');
INSERT INTO `info` (`name`) VALUES ('Patrimônio e Posses');
INSERT INTO `info` (`name`) VALUES ('Magias');
INSERT INTO `info` (`name`) VALUES ('Personalidade');
INSERT INTO `info` (`name`) VALUES ('Backstory');
INSERT INTO `info` (`name`) VALUES ('Itens, Pessoas e Locais Importantes');
INSERT INTO `info` (`name`) VALUES ('Fobias e Manias');
INSERT INTO `info` (`name`) VALUES ('Notas');

CREATE TABLE `player_info` (
    `player_info_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` int(11) UNSIGNED NOT NULL,
    `info_id` int(11) UNSIGNED NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`player_info_id`),
    CONSTRAINT `uk_player_id_info_id` UNIQUE (`player_id`, `info_id`),
    CONSTRAINT `fk_player_info_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_info_info_id` FOREIGN KEY (`info_id`) REFERENCES `info`(`info_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `keeper_key`
(
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
);

INSERT INTO `keeper_key` (`id`) VALUES (123456);