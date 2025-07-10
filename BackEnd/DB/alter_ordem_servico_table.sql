-- ALTER TABLE para adicionar novos campos na tabela ordem_servico
ALTER TABLE ordem_servico
    ADD COLUMN vendedor_id INT NULL,
    ADD COLUMN dias_pagamento_id INT NULL,
    ADD COLUMN data_entrega DATE NULL,
    ADD COLUMN data_aprovacao_orcamento DATE NULL,
    ADD COLUMN dias_reparo INT NULL,
    ADD COLUMN data_equipamento_pronto DATE NULL,
    ADD COLUMN informacoes_confidenciais TEXT NULL,
    ADD COLUMN checklist_items JSON NULL,
    ADD COLUMN agendado BOOLEAN DEFAULT FALSE,
    ADD COLUMN possui_acessorio BOOLEAN DEFAULT FALSE,
    ADD COLUMN tipo_transporte_texto VARCHAR(100) NULL,
    ADD COLUMN transporte_cif_fob ENUM('CIF', 'FOB') NULL,
    ADD COLUMN pedido_compras VARCHAR(100) NULL,
    ADD COLUMN defeito_constatado TEXT NULL,
    ADD COLUMN servico_realizar TEXT NULL,
    ADD COLUMN valor DECIMAL(10,2) DEFAULT 0.00,
    ADD COLUMN etapa_id INT NULL,
    ADD COLUMN comprovante_aprovacao VARCHAR(255) NULL,
    ADD CONSTRAINT fk_ordem_servico_vendedor FOREIGN KEY (vendedor_id) REFERENCES users(id),
    ADD CONSTRAINT fk_ordem_servico_dias_pagamento FOREIGN KEY (dias_pagamento_id) REFERENCES dias_pagamento(id),
    ADD CONSTRAINT fk_ordem_servico_etapa FOREIGN KEY (etapa_id) REFERENCES etapa_os(id);

-- Criação das tabelas auxiliares caso não existam
CREATE TABLE IF NOT EXISTS dias_pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    dias INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checklist_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS etapa_os (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS defeito_alegado_padrao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    defeito TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servico_padrao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    servico TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 