-- Script para verificar a estrutura atual
USE alsten_os;

-- Verificar se as tabelas existem
SHOW TABLES;

-- Verificar estrutura da tabela ordem_servico
DESCRIBE ordem_servico;

-- Verificar se há dados na tabela
SELECT COUNT(*) as total_ordens FROM ordem_servico;

-- Verificar alguns registros para debug
SELECT id, cliente, modeloEquipamento, fabricante, numeroSerie, dataCriacao 
FROM ordem_servico 
LIMIT 5;

-- Verificar se as colunas necessárias existem
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'alsten_os' 
AND TABLE_NAME = 'ordem_servico'
ORDER BY ORDINAL_POSITION; 