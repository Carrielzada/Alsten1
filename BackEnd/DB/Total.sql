CREATE DATABASE IF NOT EXISTS alsten_os;
USE alsten_os;

SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM urgencia;
SELECT * FROM tipo_lacre;
SHOW TABLES;

-- Tabela de papéis (roles)
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) COMMENT = 'Níveis de acesso dos usuários';

-- Inserção de papéis
INSERT INTO roles (id, name) VALUES
  (1, 'Admin'),
  (2, 'Diretoria'),
  (3, 'PCM'),
  (4, 'Comercial'),
  (5, 'Logística'),
  (6, 'Técnico');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
) COMMENT = 'Usuários cadastrados no sistema, com vínculo à role';

INSERT INTO users (id, nome, email, password, role_id) VALUES
(1, 'Vitor Carriel', 'carrielcontato@gmail.com', 'admin123', 1);

CREATE TABLE urgencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urgencia VARCHAR(100) NOT NULL
);

INSERT INTO urgencia (urgencia) VALUES
('Urgente'),
('Muito urgente'),
('Emergência'),
('Pouco urgente'),
('Não urgente');

CREATE TABLE tipo_lacre (
id INT AUTO_INCREMENT PRIMARY KEY,
tipo_lacre VARCHAR(50) NOT NULL
);

INSERT INTO tipo_lacre (tipo_lacre) VALUES
('Alsten'),
('Neutro');

CREATE TABLE tipo_analise (
id INT AUTO_INCREMENT PRIMARY KEY,
tipo_analise VARCHAR(200) NOT NULL
);

INSERT INTO tipo_analise (tipo_analise) VALUES
('Apenas orçamento'),
('Consertar e orçar'),
('Consertar, orçar e finalizar');

DROP TABLE IF EXISTS `cliente_pj`;

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
);
INSERT INTO cliente_pj (cnpj, nome, contato, endereco, cidade, bairro, estado, cep) VALUES
('57.324.090/0001-93', 'Vitor Medeiros Carriel', '55 15 99772-3051', 'Rua Barão do Rio Branco, 198', 'Boituva', 'Centro', 'SP', 18550-041);
