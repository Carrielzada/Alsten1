-- Script para verificar e corrigir a estrutura da tabela ordem_servico_log
USE alsten_os;

-- Verificar a estrutura atual da tabela
DESCRIBE ordem_servico_log;

-- Verificar se a coluna valor_anterior existe
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'alsten_os' 
AND TABLE_NAME = 'ordem_servico_log' 
AND COLUMN_NAME IN ('valor_anterior', 'valor_antigo');

-- Se a tabela não tiver a estrutura correta, recriar
DROP TABLE IF EXISTS ordem_servico_log;

CREATE TABLE ordem_servico_log (
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

-- Verificar se a tabela foi criada corretamente
DESCRIBE ordem_servico_log;

-- Inserir alguns logs de teste para verificar se está funcionando
INSERT INTO ordem_servico_log (ordem_servico_id, user_id, campo_alterado, valor_anterior, valor_novo, data_alteracao) VALUES
(1, 1, 'etapa', 'Previsto', 'Em Andamento', NOW()),
(1, 1, 'defeitoAlegado', 'Problema inicial', 'Problema identificado e corrigido', NOW());

-- Verificar os logs inseridos
SELECT * FROM ordem_servico_log; 