import conectar from "./conexao.js";

class OrdemServicoLogDAO {
    async registrarLog(os_id, usuario_id, campo_alterado, valor_antigo, valor_novo, descricao) {
        const conexao = await conectar();
        try {
            const sql = `
                INSERT INTO ordem_servico_log 
                (os_id, usuario_id, campo_alterado, valor_antigo, valor_novo, descricao)
                VALUES (?, ?, ?, ?, ?, ?)
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
                SELECT osl.*, u.nome as nome_usuario
                FROM ordem_servico_log osl
                LEFT JOIN usuarios u ON osl.usuario_id = u.id
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
}

export default OrdemServicoLogDAO;


