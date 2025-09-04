-- =====================================================
-- SCRIPT LIMPO PARA CRIAR O BANCO DE DADOS ALSTEN_OS
-- =====================================================

USE alsten_os;

-- =====================================================
-- TABELAS DE AUTENTICAÇÃO E USUÁRIOS
-- =====================================================

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

-- Tabela de usuários
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

-- Inserir usuário administrador padrão
INSERT INTO users (id, nome, email, password, role_id) VALUES
(1, 'Admin', 'admin@gmail.com', 'admin123', 1);

-- =====================================================
-- TABELAS AUXILIARES DO SISTEMA
-- =====================================================

-- Tabela de urgência
DROP TABLE IF EXISTS urgencia;
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

-- Tabela de tipo de lacre
DROP TABLE IF EXISTS tipo_lacre;
CREATE TABLE tipo_lacre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_lacre VARCHAR(50) NOT NULL
);

INSERT INTO tipo_lacre (tipo_lacre) VALUES
('Alsten'),
('Neutro');

-- Tabela de tipo de análise
DROP TABLE IF EXISTS tipo_analise;
CREATE TABLE tipo_analise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_analise VARCHAR(200) NOT NULL
);

INSERT INTO tipo_analise (tipo_analise) VALUES
('Apenas orçamento'),
('Consertar e orçar'),
('Consertar, orçar e finalizar');

-- Tabela de fabricantes
DROP TABLE IF EXISTS fabricante;
CREATE TABLE fabricante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_fabricante VARCHAR(100) NOT NULL
);

INSERT INTO fabricante (nome_fabricante) VALUES 
('Husqvarna'),
('WEG'),
('Baldor'),
('Siemens'),
('Teste');

-- Tabela de modelos
DROP TABLE IF EXISTS modelo;
CREATE TABLE modelo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    fabricante_id INT,
    FOREIGN KEY (fabricante_id) REFERENCES fabricante(id)
);

INSERT INTO modelo (modelo, fabricante_id) VALUES 
('Motor Husqvarna HSQ422X', 1),
('Bomba de Água', 2),
('Compressor', 3),
('Gerador', 4),
('Outro Modelo', 5);

-- Tabela de tipo de limpeza
DROP TABLE IF EXISTS tipo_limpeza;
CREATE TABLE tipo_limpeza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_limpeza VARCHAR(100) NOT NULL
);

INSERT INTO tipo_limpeza (tipo_limpeza) VALUES
('Limpeza Básica'),
('Limpeza Completa'),
('Limpeza Profunda'),
('Sem Limpeza'),
('Limpeza Especial');

-- Tabela de tipo de transporte
DROP TABLE IF EXISTS tipo_transporte;
CREATE TABLE tipo_transporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_transporte VARCHAR(100) NOT NULL
);

INSERT INTO tipo_transporte (tipo_transporte) VALUES
('Transporte Padrão'),
('Transporte Especial'),
('Transporte Urgente'),
('Retirada no Local'),
('Entrega Agendada');

-- Tabela de pagamento
DROP TABLE IF EXISTS pagamento;
CREATE TABLE pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pagamento VARCHAR(100) NOT NULL
);

INSERT INTO pagamento (pagamento) VALUES
('Dinheiro'),
('Cartão'),
('PIX'),
('Boleto'),
('Transferência'),
('Cheque'),
('Cartão de Crédito'),
('Cartão de Débito'),
('Outro');

-- =====================================================
-- TABELAS DE ORDEM DE SERVIÇO
-- =====================================================

-- Tabela de defeitos alegados padrão
DROP TABLE IF EXISTS defeito_alegado_padrao;
CREATE TABLE defeito_alegado_padrao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    defeito TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de serviços padrão
DROP TABLE IF EXISTS servico_padrao;
CREATE TABLE servico_padrao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    servico TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de dias de pagamento
DROP TABLE IF EXISTS dias_pagamento;
CREATE TABLE dias_pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    dias INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do checklist
DROP TABLE IF EXISTS checklist_item;
CREATE TABLE checklist_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de etapas da OS
DROP TABLE IF EXISTS etapa_os;
CREATE TABLE etapa_os (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela principal de ordem de serviço
DROP TABLE IF EXISTS ordem_servico;
CREATE TABLE ordem_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL, -- Nome do cliente (campo simples)
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
    vendedor_id INT,
    dias_pagamento_id INT,
    data_entrega DATE,
    data_aprovacao_orcamento DATE,
    dias_reparo INT,
    data_equipamento_pronto DATE,
    informacoes_confidenciais TEXT,
    checklist_items JSON,
    agendado BOOLEAN DEFAULT FALSE,
    possui_acessorio BOOLEAN DEFAULT FALSE,
    tipo_transporte_texto VARCHAR(100),
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

-- Tabela de logs de ordem de serviço
DROP TABLE IF EXISTS ordem_servico_log;
CREATE TABLE ordem_servico_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    os_id INT NOT NULL,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    campo_alterado VARCHAR(255),
    valor_antigo TEXT,
    valor_novo TEXT,
    descricao TEXT,
    FOREIGN KEY (os_id) REFERENCES ordem_servico(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INSERÇÃO DE DADOS BÁSICOS
-- =====================================================

-- Inserir defeitos alegados padrão
INSERT INTO defeito_alegado_padrao (titulo, defeito) VALUES 
('Não liga', 'Equipamento não liga quando pressionado o botão de energia'),
('Tela quebrada', 'Tela do equipamento está quebrada ou com rachaduras'),
('Bateria não carrega', 'Bateria não carrega ou descarrega muito rápido'),
('Som não funciona', 'Alto-falantes não emitem som'),
('Botões não funcionam', 'Botões do equipamento não respondem ao toque'),
('Aquecimento excessivo', 'Equipamento esquenta muito durante o uso'),
('Tela com manchas', 'Tela apresenta manchas ou pontos escuros'),
('Fonte não funciona', 'Fonte de alimentação não carrega o equipamento'),
('Wi-Fi não conecta', 'Problemas de conectividade Wi-Fi'),
('Bluetooth não funciona', 'Problemas de conectividade Bluetooth');

-- Inserir serviços padrão
INSERT INTO servico_padrao (titulo, servico) VALUES 
('Troca de bateria', 'Substituição da bateria por uma nova'),
('Reparo na tela', 'Reparo ou substituição da tela'),
('Limpeza interna', 'Limpeza completa do interior do equipamento'),
('Troca de componentes', 'Substituição de componentes danificados'),
('Atualização de software', 'Atualização do sistema operacional'),
('Reparo na fonte', 'Reparo ou substituição da fonte de alimentação'),
('Limpeza de cooler', 'Limpeza e manutenção do sistema de ventilação'),
('Troca de teclado', 'Substituição do teclado'),
('Reparo na placa-mãe', 'Reparo na placa principal do equipamento'),
('Configuração de rede', 'Configuração de conectividade de rede');

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

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Tabelas criadas:' as status;
SHOW TABLES;

SELECT 'Contagem de registros:' as status;
SELECT 'users' as tabela, COUNT(*) as total FROM users UNION ALL
SELECT 'roles' as tabela, COUNT(*) as total FROM roles UNION ALL
SELECT 'fabricante' as tabela, COUNT(*) as total FROM fabricante UNION ALL
SELECT 'modelo' as tabela, COUNT(*) as total FROM modelo UNION ALL
SELECT 'urgencia' as tabela, COUNT(*) as total FROM urgencia UNION ALL
SELECT 'tipo_analise' as tabela, COUNT(*) as total FROM tipo_analise UNION ALL
SELECT 'tipo_lacre' as tabela, COUNT(*) as total FROM tipo_lacre UNION ALL
SELECT 'tipo_limpeza' as tabela, COUNT(*) as total FROM tipo_limpeza UNION ALL
SELECT 'tipo_transporte' as tabela, COUNT(*) as total FROM tipo_transporte UNION ALL
SELECT 'pagamento' as tabela, COUNT(*) as total FROM pagamento UNION ALL
SELECT 'etapa_os' as tabela, COUNT(*) as total FROM etapa_os UNION ALL
SELECT 'checklist_item' as tabela, COUNT(*) as total FROM checklist_item UNION ALL
SELECT 'dias_pagamento' as tabela, COUNT(*) as total FROM dias_pagamento UNION ALL
SELECT 'defeito_alegado_padrao' as tabela, COUNT(*) as total FROM defeito_alegado_padrao UNION ALL
SELECT 'servico_padrao' as tabela, COUNT(*) as total FROM servico_padrao;

SELECT 'Script concluído com sucesso!' as status;
