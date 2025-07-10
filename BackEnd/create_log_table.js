import conectar from "./Service/conexao.js";

async function createLogTable() {
    const conexao = await conectar();
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS ordem_servico_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                os_id INT NOT NULL,
                data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                usuario_id INT, -- Assumindo que você terá uma tabela de usuários
                campo_alterado VARCHAR(255),
                valor_antigo TEXT,
                valor_novo TEXT,
                descricao TEXT,
                FOREIGN KEY (os_id) REFERENCES ordem_servico(id) ON DELETE CASCADE
            );
        `;
        await conexao.query(sql);
        console.log("Tabela 'ordem_servico_log' criada ou já existente.");
    } catch (error) {
        console.error("Erro ao criar tabela 'ordem_servico_log':", error);
    } finally {
        conexao.release();
    }
}

createLogTable();


