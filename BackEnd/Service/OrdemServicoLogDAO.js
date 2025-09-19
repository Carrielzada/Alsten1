import conectar from "./conexao.js";

class OrdemServicoLogDAO {
    async registrarLog(os_id, usuario_id, campo_alterado, valor_antigo, valor_novo, descricao) {
        const conexao = await conectar();
        try {
            const sql = `
                INSERT INTO ordem_servico_log 
                (os_id, usuario_id, campo_alterado, valor_antigo, valor_novo, data_alteracao, descricao)
                VALUES (?, ?, ?, ?, ?, NOW(), ?)
            `;
            const valores = [os_id, usuario_id, campo_alterado, valor_antigo, valor_novo, descricao];
            await conexao.query(sql, valores);
            return true;
        } catch (error) {
            console.error("Erro ao registrar log de Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultarLogsPorOsId(os_id) {
        const conexao = await conectar();
        try {
            const sql = `
                SELECT 
                    osl.id,
                    osl.os_id as ordem_servico_id,
                    osl.usuario_id,
                    osl.campo_alterado,
                    osl.valor_antigo,
                    osl.valor_novo,
                    osl.data_alteracao,
                    osl.descricao,
                    u.nome as nome_usuario
                FROM ordem_servico_log osl
                LEFT JOIN users u ON osl.usuario_id = u.id
                WHERE osl.os_id = ?
                ORDER BY osl.data_alteracao DESC
            `;
            const [registros] = await conexao.query(sql, [os_id]);
            return registros;
        } catch (error) {
            console.error("Erro ao consultar logs de Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultarTodosLogs() {
        const conexao = await conectar();
        try {
            const sql = `
                SELECT 
                    osl.id,
                    osl.os_id as ordem_servico_id,
                    osl.usuario_id,
                    osl.campo_alterado,
                    osl.valor_antigo,
                    osl.valor_novo,
                    osl.data_alteracao,
                    osl.descricao,
                    u.nome as nome_usuario
                FROM ordem_servico_log osl
                LEFT JOIN users u ON osl.usuario_id = u.id
                ORDER BY osl.data_alteracao DESC
            `;
            const [registros] = await conexao.query(sql);
            return registros;
        } catch (error) {
            console.error("Erro ao consultar todos os logs de Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }
}

export default OrdemServicoLogDAO;


