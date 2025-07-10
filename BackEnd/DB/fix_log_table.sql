-- Script para corrigir a estrutura da tabela ordem_servico_log
USE alsten_os;

-- Verificar a estrutura atual da tabela
DESCRIBE ordem_servico_log;

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