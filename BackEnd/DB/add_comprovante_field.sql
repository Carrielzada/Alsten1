-- Script para adicionar o campo comprovante na tabela ordem_servico
-- Execute este script no banco de dados para adicionar o novo campo

ALTER TABLE ordem_servico 
ADD COLUMN comprovante VARCHAR(255) NULL 
COMMENT 'Campo para armazenar o nome do arquivo de comprovante (UMA imagem apenas)';

-- Verificar se a coluna foi adicionada corretamente
DESCRIBE ordem_servico;