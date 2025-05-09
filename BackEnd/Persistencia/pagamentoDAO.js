import Pagamento from '../Modelo/pagamento.js';
import conectar from './conexao.js';

export default class PagamentoDAO {
    async incluir(pagamento) {
        if (pagamento instanceof Pagamento) {
            const conexao = await conectar();
            const sql = `INSERT INTO pagamento (pagamento) VALUES (?)`;
            const valores = [pagamento.pagamento];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(pagamento) {
        if (pagamento instanceof Pagamento) {
            const conexao = await conectar();
            const sql = `UPDATE pagamento 
                         SET pagamento = ? 
                         WHERE id = ?`;
            const valores = [
                pagamento.pagamento,
                pagamento.id
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(id) {
        const conexao = await conectar();
        const sql = "DELETE FROM pagamento WHERE id = ?";
        const valores = [id];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        if (resultado.affectedRows === 0) {
            throw new Error("Forma de Pagamento não encontrada ou já excluído.");
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `SELECT * FROM pagamento WHERE pagamento LIKE ? ORDER BY pagamento`;
        const valores = [`%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        const listaPagamentos = [];
        for (const row of rows) {
            const pagamento = new Pagamento(
                row.id,
                row.pagamento
            );
            listaPagamentos.push(pagamento);
        }
        return listaPagamentos;
    }

    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM pagamento WHERE id = ?`;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);
    
        if (rows.length > 0) {
            const row = rows[0];
            return new Pagamento(
                row.id, 
                row.pagamento
            );
        } else {
            return null;
        }
    }
    
}
