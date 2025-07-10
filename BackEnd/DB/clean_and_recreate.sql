-- Script para limpar e recriar os dados do zero
USE alsten_os;

-- Limpar dados existentes (manter a estrutura das tabelas)
DELETE FROM ordem_servico_log;
DELETE FROM ordem_servico;

-- Verificar se as tabelas relacionadas têm dados básicos
SELECT 'modelo' as tabela, COUNT(*) as registros FROM modelo UNION ALL
SELECT 'fabricante' as tabela, COUNT(*) as registros FROM fabricante UNION ALL
SELECT 'urgencia' as tabela, COUNT(*) as registros FROM urgencia UNION ALL
SELECT 'tipo_analise' as tabela, COUNT(*) as registros FROM tipo_analise UNION ALL
SELECT 'tipo_lacre' as tabela, COUNT(*) as registros FROM tipo_lacre UNION ALL
SELECT 'tipo_limpeza' as tabela, COUNT(*) as registros FROM tipo_limpeza UNION ALL
SELECT 'tipo_transporte' as tabela, COUNT(*) as registros FROM tipo_transporte UNION ALL
SELECT 'pagamento' as tabela, COUNT(*) as registros FROM pagamento;

-- Se alguma tabela estiver vazia, inserir dados básicos
INSERT IGNORE INTO modelo (modelo) VALUES 
('Motor Husqvarna HSQ422X'),
('Bomba de Água'),
('Compressor'),
('Gerador'),
('Outro Modelo');

INSERT IGNORE INTO fabricante (nome_fabricante) VALUES 
('Husqvarna'),
('WEG'),
('Baldor'),
('Siemens'),
('Teste');

INSERT IGNORE INTO urgencia (urgencia) VALUES
('Urgente'),
('Muito urgente'),
('Emergência'),
('Pouco urgente'),
('Não urgente');

INSERT IGNORE INTO tipo_analise (tipo_analise) VALUES
('Apenas orçamento'),
('Consertar e orçar'),
('Consertar, orçar e finalizar');

INSERT IGNORE INTO tipo_lacre (tipo_lacre) VALUES
('Alsten'),
('Neutro');

INSERT IGNORE INTO tipo_limpeza (tipo_limpeza) VALUES
('Limpeza Básica'),
('Limpeza Completa'),
('Limpeza Profunda'),
('Sem Limpeza'),
('Limpeza Especial');

INSERT IGNORE INTO tipo_transporte (tipo_transporte) VALUES
('Transporte Padrão'),
('Transporte Especial'),
('Transporte Urgente'),
('Retirada no Local'),
('Entrega Agendada');

INSERT IGNORE INTO pagamento (pagamento) VALUES
('Dinheiro'),
('Cartão'),
('PIX'),
('Boleto'),
('Transferência'),
('Cheque'),
('Cartão de Crédito'),
('Cartão de Débito'),
('Outro');

-- Verificar se tudo foi criado corretamente
SELECT 'modelo' as tabela, COUNT(*) as registros FROM modelo UNION ALL
SELECT 'fabricante' as tabela, COUNT(*) as registros FROM fabricante UNION ALL
SELECT 'urgencia' as tabela, COUNT(*) as registros FROM urgencia UNION ALL
SELECT 'tipo_analise' as tabela, COUNT(*) as registros FROM tipo_analise UNION ALL
SELECT 'tipo_lacre' as tabela, COUNT(*) as registros FROM tipo_lacre UNION ALL
SELECT 'tipo_limpeza' as tabela, COUNT(*) as registros FROM tipo_limpeza UNION ALL
SELECT 'tipo_transporte' as tabela, COUNT(*) as registros FROM tipo_transporte UNION ALL
SELECT 'pagamento' as tabela, COUNT(*) as registros FROM pagamento;

-- Verificar se as tabelas estão vazias
SELECT COUNT(*) as total_ordens FROM ordem_servico;
SELECT COUNT(*) as total_logs FROM ordem_servico_log; 