-- Script para criar a tabela ordem_servico
USE alsten_os;

-- Criar tabelas de referência se não existirem
CREATE TABLE IF NOT EXISTS fabricante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_fabricante VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS modelo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    fabricante_id INT,
    FOREIGN KEY (fabricante_id) REFERENCES fabricante(id)
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

-- Criar a tabela principal ordem_servico
DROP TABLE IF EXISTS ordem_servico;
CREATE TABLE ordem_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(18) NOT NULL, -- CNPJ do cliente
    modeloEquipamento INT,
    defeitoAlegado TEXT NOT NULL,
    numeroSerie VARCHAR(100),
    fabricante INT,
    urgencia_id INT,
    tipo_analise_id INT,
    tipo_lacre_id INT,
    tipo_limpeza_id INT,
    tipo_transporte_id INT,
    pagamento_id INT,
    etapa VARCHAR(50) DEFAULT 'Previsto',
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    arquivosAnexados JSON,
    
    -- Foreign Keys
    FOREIGN KEY (modeloEquipamento) REFERENCES modelo(id),
    FOREIGN KEY (fabricante) REFERENCES fabricante(id),
    FOREIGN KEY (urgencia_id) REFERENCES urgencia(id),
    FOREIGN KEY (tipo_analise_id) REFERENCES tipo_analise(id),
    FOREIGN KEY (tipo_lacre_id) REFERENCES tipo_lacre(id),
    FOREIGN KEY (tipo_limpeza_id) REFERENCES tipo_limpeza(id),
    FOREIGN KEY (tipo_transporte_id) REFERENCES tipo_transporte(id),
    FOREIGN KEY (pagamento_id) REFERENCES pagamento(id)
);

-- Inserir dados de exemplo nas tabelas de referência
INSERT INTO fabricante (nome_fabricante) VALUES 
('Fabricante A'),
('Fabricante B'),
('Fabricante C');

INSERT INTO modelo (modelo, fabricante_id) VALUES 
('Modelo 1', 1),
('Modelo 2', 1),
('Modelo 3', 2);

INSERT INTO tipo_limpeza (tipo_limpeza) VALUES 
('Limpeza Básica'),
('Limpeza Completa'),
('Sem Limpeza');

INSERT INTO tipo_transporte (tipo_transporte) VALUES 
('Retirada'),
('Entrega'),
('Retirada e Entrega');

INSERT INTO pagamento (pagamento) VALUES 
('À Vista'),
('Parcelado'),
('Boleto'),
('Cartão de Crédito'),
('Cartão de Débito'); 