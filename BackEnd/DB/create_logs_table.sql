-- Script para criar a tabela de logs de Ordem de Serviço
USE alsten_os;

-- Criar a tabela de logs se não existir
CREATE TABLE IF NOT EXISTS ordem_servico_log (
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

-- Inserir alguns logs de exemplo (opcional)
-- INSERT INTO ordem_servico_log (os_id, usuario_id, campo_alterado, valor_antigo, valor_novo, descricao) VALUES
-- (1, 1, 'etapa', 'Previsto', 'Em Andamento', 'Campo "etapa" alterado de "Previsto" para "Em Andamento"'),
-- (1, 1, 'defeitoAlegado', 'Problema inicial', 'Problema identificado e corrigido', 'Campo "defeitoAlegado" alterado de "Problema inicial" para "Problema identificado e corrigido"'); 