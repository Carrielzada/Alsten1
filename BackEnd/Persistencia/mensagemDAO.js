import Mensagem from '../Modelo/mensagem.js';
import conectar from './conexao.js';

export default class mensagemDAO {
    async incluir(mensagem) {
        if (mensagem instanceof Mensagem) {
            const conexao = await conectar();
            const sql = `INSERT INTO mensagem (user_id, referencia_id, tipo_referencia, nome_user, cliente_nome, mensagem, arquivo, status, data_hora)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
            const valores = [
                mensagem.user_id,
                mensagem.referencia_id,
                mensagem.tipo_referencia,
                mensagem.nome_user,
                mensagem.cliente_nome,
                mensagem.mensagem,
                mensagem.arquivo,
                mensagem.status
            ];
            const [resultado] = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
            return resultado.insertId; // Retorna o ID gerado pelo banco
        }
    }

    async alterar(mensagem) {
        if (mensagem instanceof Mensagem) {
            const conexao = await conectar();
            const sql = `UPDATE mensagem 
                         SET user_id = ?, referencia_id = ?, tipo_referencia = ?, nome_user = ?, cliente_nome = ?, mensagem = ?, arquivo = ?, status = ?, data_hora = NOW() 
                         WHERE id = ?`;
            const valores = [
                mensagem.user_id,
                mensagem.referencia_id,
                mensagem.tipo_referencia,
                mensagem.nome_user,
                mensagem.cliente_nome,
                mensagem.mensagem,
                mensagem.arquivo,
                mensagem.status,
                mensagem.id
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(id) {
        const conexao = await conectar();
        const sql = `DELETE FROM mensagem WHERE id = ?`;
        const valores = [id];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);

        if (resultado.affectedRows === 0) {
            throw new Error("Mensagem não encontrada ou já excluída.");
        }
    }

    async consultar(termo = "") {
        const conexao = await conectar();
        const sql = `
            SELECT * 
            FROM mensagem 
            ${termo ? "WHERE cliente_nome LIKE ?" : ""} 
            ORDER BY id
        `;
        const valores = termo ? [`%${termo}%`] : [];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        return rows.map(row => {
            const mensagem = new Mensagem(
                row.id,
                row.user_id,
                row.referencia_id,
                row.tipo_referencia,
                row.nome_user,
                row.cliente_nome,
                row.mensagem,
                row.arquivo,
                row.status,
                row.data_hora
            );
            return mensagem.toJson(); // Retorna o objeto JSON em vez do objeto Mensagem
        });
    }
    


    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM mensagem WHERE id = ?`;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);

        if (rows.length > 0) {
            const row = rows[0];
            return new Mensagem(
                row.id,
                row.user_id,
                row.referencia_id,
                row.tipo_referencia,
                row.cliente_nome,
                row.mensagem,
                row.arquivo,
                row.status,
                row.data_hora
            );
        } else {
            return null;
        }
    }

    async consultarPendentes() {
        const conexao = await conectar();
        const sql = `SELECT * FROM mensagem WHERE status = 'Enviada' ORDER BY data_hora DESC`;
        const [rows] = await conexao.query(sql);
        global.poolConexoes.releaseConnection(conexao);
    return rows;
    }

    async atualizarStatus(id, novoStatus) {
        const conexao = await conectar();
        const sql = "UPDATE mensagem SET status = ? WHERE id = ?";
        const [resultado] = await conexao.query(sql, [novoStatus, id]);
        global.poolConexoes.releaseConnection(conexao);
    
        if (resultado.affectedRows === 0) {
            throw new Error("Mensagem não encontrada ou já atualizada.");
        }
    
        return true;
    }
    
    async consultarPorStatus(status) {
        const conexao = await conectar();
        const sql = `SELECT * FROM mensagem WHERE status = ? ORDER BY data_hora DESC`;
        const [rows] = await conexao.query(sql, [status]);
        global.poolConexoes.releaseConnection(conexao);
    
        return rows.map(row => {
            const mensagem = new Mensagem(
                row.id,
                row.user_id,
                row.referencia_id,
                row.tipo_referencia,
                row.nome_user,
                row.cliente_nome,
                row.mensagem,
                row.arquivo,
                row.status,
                row.data_hora
            );
            return mensagem.toJson();
        });
    }
    
}
