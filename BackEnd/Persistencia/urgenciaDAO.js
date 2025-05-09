import Urgencia from '../Modelo/urgencia.js';
import conectar from './conexao.js';

export default class UrgenciaDAO {
    async incluir(urgencia) {
        if (urgencia instanceof Urgencia) {
            const conexao = await conectar();
            const sql = `INSERT INTO urgencia (urgencia) VALUES (?)`;
            const valores = [urgencia.urgencia];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(urgencia) {
        if (urgencia instanceof Urgencia) {
            const conexao = await conectar();
            const sql = `UPDATE urgencia 
                         SET urgencia = ? 
                         WHERE id = ?`;
            const valores = [
                urgencia.urgencia,
                urgencia.id
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(id) {
        const conexao = await conectar();
        const sql = "DELETE FROM urgencia WHERE id = ?";
        const valores = [id];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        if (resultado.affectedRows === 0) {
            throw new Error("Forma de Urgencia não encontrada ou já excluído.");
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `SELECT * FROM urgencia WHERE urgencia LIKE ? ORDER BY urgencia`;
        const valores = [`%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        const listaUrgencias = [];
        for (const row of rows) {
            const urgencia = new Urgencia(
                row.id,
                row.urgencia
            );
            listaUrgencias.push(urgencia);
        }
        return listaUrgencias;
    }

    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM urgencia WHERE id = ?`;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);
    
        if (rows.length > 0) {
            const row = rows[0];
            return new Urgencia(
                row.id, 
                row.urgencia
            );
        } else {
            return null;
        }
    }
    
}
