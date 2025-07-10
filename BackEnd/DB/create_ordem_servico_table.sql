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

-- Nova tabela para defeitos alegados padrão
CREATE TABLE IF NOT EXISTS defeito_alegado_padrao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    defeito TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nova tabela para serviços padrão
CREATE TABLE IF NOT EXISTS servico_padrao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    servico TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nova tabela para dias de pagamento
CREATE TABLE IF NOT EXISTS dias_pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    dias INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nova tabela para checklist
CREATE TABLE IF NOT EXISTS checklist_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nova tabela para etapas da OS
CREATE TABLE IF NOT EXISTS etapa_os (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar a tabela principal ordem_servico atualizada
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
    
    -- Novos campos
    vendedor_id INT,
    dias_pagamento_id INT,
    data_entrega DATE,
    data_aprovacao_orcamento DATE,
    dias_reparo INT,
    data_equipamento_pronto DATE,
    informacoes_confidenciais TEXT,
    checklist_items JSON, -- Array de IDs dos itens do checklist
    agendado BOOLEAN DEFAULT FALSE,
    possui_acessorio BOOLEAN DEFAULT FALSE,
    tipo_transporte_texto VARCHAR(100), -- Campo de texto para tipo de transporte
    transporte_cif_fob ENUM('CIF', 'FOB'),
    pedido_compras VARCHAR(100),
    defeito_constatado TEXT,
    servico_realizar TEXT,
    valor DECIMAL(10,2) DEFAULT 0.00,
    etapa_id INT,
    comprovante_aprovacao VARCHAR(255),
    
    -- Foreign Keys
    FOREIGN KEY (modeloEquipamento) REFERENCES modelo(id),
    FOREIGN KEY (fabricante) REFERENCES fabricante(id),
    FOREIGN KEY (urgencia_id) REFERENCES urgencia(id),
    FOREIGN KEY (tipo_analise_id) REFERENCES tipo_analise(id),
    FOREIGN KEY (tipo_lacre_id) REFERENCES tipo_lacre(id),
    FOREIGN KEY (tipo_limpeza_id) REFERENCES tipo_limpeza(id),
    FOREIGN KEY (tipo_transporte_id) REFERENCES tipo_transporte(id),
    FOREIGN KEY (pagamento_id) REFERENCES pagamento(id),
    FOREIGN KEY (vendedor_id) REFERENCES users(id),
    FOREIGN KEY (dias_pagamento_id) REFERENCES dias_pagamento(id),
    FOREIGN KEY (etapa_id) REFERENCES etapa_os(id)
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

-- Inserir defeitos alegados padrão
INSERT INTO defeito_alegado_padrao (titulo, defeito) VALUES 
('Não liga', 'Equipamento não liga quando pressionado o botão de energia'),
('Tela quebrada', 'Tela do equipamento está quebrada ou com rachaduras'),
('Bateria não carrega', 'Bateria não carrega ou descarrega muito rápido'),
('Som não funciona', 'Alto-falantes não emitem som'),
('Botões não funcionam', 'Botões do equipamento não respondem ao toque');

-- Inserir serviços padrão
INSERT INTO servico_padrao (titulo, servico) VALUES 
('Troca de bateria', 'Substituição da bateria por uma nova'),
('Reparo na tela', 'Reparo ou substituição da tela'),
('Limpeza interna', 'Limpeza completa do interior do equipamento'),
('Troca de componentes', 'Substituição de componentes danificados'),
('Atualização de software', 'Atualização do sistema operacional');

-- Inserir dias de pagamento
INSERT INTO dias_pagamento (descricao, dias) VALUES 
('À vista', 0),
('Para 7 dias', 7),
('Para 15 dias', 15),
('Para 28 dias', 28),
('Para 30 dias', 30),
('Para 45 dias', 45),
('Para 60 dias', 60);

-- Inserir itens do checklist
INSERT INTO checklist_item (item) VALUES 
('Lavado'),
('Reparado'),
('Teste Final Realizado'),
('Lacrado'),
('Etiquetado');

-- Inserir etapas da OS
INSERT INTO etapa_os (nome, descricao) VALUES 
('PREVISTO', 'O responsável pela logística inclui a OS nessa etapa quando o cliente envia um equipamento para reparo'),
('RECEBIDO', 'O responsável pela logística recebe o equipamento'),
('EM ANÁLISE', 'O técnico responsável pela OS passa a etapa de recebido para em análise'),
('ANALISADO', 'O técnico responsável pela OS passa a etapa de em análise para analisado'),
('AGUARDANDO APROVAÇÃO', 'O setor comercial passa a etapa de analisado para aguardando aprovação'),
('PRÉ-APROVADO', 'O vendedor passará de ag. Aprovação para essa etapa somente se o cliente tiver alguma pendência'),
('APROVADO', 'O vendedor passará para essa etapa APENAS se já estiver tudo negociado e sem nenhuma pendência'),
('REPROVADO', 'O vendedor passará para essa etapa se o orçamento for reprovado pelo cliente'),
('AGUARDANDO INFORMAÇÃO', 'Após o técnico finalizar todo o reparo do equipamento de uma OS que estava na etapa PRÉ-APROVADO'),
('SEM CUSTO', 'O vendedor passará para essa etapa caso o serviço seja em garantia ou cortesia'),
('EXPEDIÇÃO', 'O técnico após finalizar todo reparo e o comercial finalizar toda a negociação com o cliente'),
('DESPACHO', 'Essa etapa informará a logística para seguir com o retorno do equipamento'),
('CONCLUÍDO', 'O responsável pela logística concluirá a OS assim que o equipamento for enviado para o cliente'); 