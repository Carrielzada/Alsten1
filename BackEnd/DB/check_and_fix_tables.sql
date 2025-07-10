-- Script para verificar e corrigir tabelas necessárias
USE alsten_os;

-- Verificar se as tabelas existem
SHOW TABLES;

-- Verificar estrutura da tabela ordem_servico
DESCRIBE ordem_servico;

-- Verificar se as tabelas relacionadas existem
SELECT 'modelo' as tabela, COUNT(*) as registros FROM modelo UNION ALL
SELECT 'fabricante' as tabela, COUNT(*) as registros FROM fabricante UNION ALL
SELECT 'urgencia' as tabela, COUNT(*) as registros FROM urgencia UNION ALL
SELECT 'tipo_analise' as tabela, COUNT(*) as registros FROM tipo_analise UNION ALL
SELECT 'tipo_lacre' as tabela, COUNT(*) as registros FROM tipo_lacre UNION ALL
SELECT 'tipo_limpeza' as tabela, COUNT(*) as registros FROM tipo_limpeza UNION ALL
SELECT 'tipo_transporte' as tabela, COUNT(*) as registros FROM tipo_transporte UNION ALL
SELECT 'pagamento' as tabela, COUNT(*) as registros FROM pagamento;

-- Criar tabelas que podem estar faltando
CREATE TABLE IF NOT EXISTS modelo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS fabricante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_fabricante VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS tipo_limpeza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_limpeza VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tipo_transporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_transporte VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pagamento VARCHAR(100) NOT NULL
);

-- Inserir dados básicos se as tabelas estiverem vazias
INSERT IGNORE INTO modelo (modelo) VALUES 
('Modelo Padrão'),
('Outro Modelo');

INSERT IGNORE INTO fabricante (nome_fabricante) VALUES 
('Fabricante Padrão'),
('Outro Fabricante');

INSERT IGNORE INTO tipo_limpeza (tipo_limpeza) VALUES 
('Limpeza Básica'),
('Limpeza Completa');

INSERT IGNORE INTO tipo_transporte (tipo_transporte) VALUES 
('Transporte Padrão'),
('Transporte Especial');

INSERT IGNORE INTO pagamento (pagamento) VALUES 
('Dinheiro'),
('Cartão'),
('PIX'),
('Boleto');

-- Verificar se a tabela ordem_servico_log existe
CREATE TABLE IF NOT EXISTS ordem_servico_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_servico_id INT NOT NULL,
    user_id INT NOT NULL,
    campo_alterado VARCHAR(100) NOT NULL,
    valor_anterior TEXT,
    valor_novo TEXT,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ordem_servico_id) REFERENCES ordem_servico(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verificar estrutura final
SHOW TABLES; 