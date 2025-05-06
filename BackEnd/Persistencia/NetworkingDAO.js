import Networking from '../Modelo/networking.js';
import conectar from './conexao.js';

export default class NetworkingDAO {
    async incluir(networking) {
        if (networking instanceof Networking) {
            const conexao = await conectar();
            const sql = `INSERT INTO networking (nome, categoria, contato, email, data_nascimento, observacoes, criado_em, atualizado_em)
                         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
            const valores = [
                networking.nome,
                networking.categoria,
                networking.contato,
                networking.email,
                networking.data_nascimento ? new Date(networking.data_nascimento).toISOString().split('T')[0] : null,
                networking.observacoes
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    

    async alterar(networking) {
        if (networking instanceof Networking) {
            const conexao = await conectar();
            const sql = `UPDATE networking 
                         SET nome = ?, categoria = ?, contato = ?, email = ?, data_nascimento = ?, observacoes = ?, atualizado_em = NOW() 
                         WHERE id = ?`;
            const valores = [networking.nome, networking.categoria, networking.contato, networking.email, networking.data_nascimento, networking.observacoes, networking.id];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(id) {
            const conexao = await conectar();
            const sql = `DELETE FROM networking WHERE id = ?`;
            const valores = [id];
            const [resultado] = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);

            if (resultado.affectedRows === 0) {
                throw new Error("Networking nao encontrado ou ja excluido.");
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `SELECT * FROM networking WHERE nome LIKE ? OR email LIKE ? ORDER BY nome`;
        const valores = [`%${termo}%`, `%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);

        const listaNetworking = [];
        for (const row of rows) {
            const networking = new Networking(
                row.id, row.nome, row.categoria, row.contato, row.email, row.data_nascimento, row.observacoes, row.criado_em, row.atualizado_em
            );
            listaNetworking.push(networking);
        }
        return listaNetworking;
    }

    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM networking WHERE id = ?`;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);

        if (rows.length > 0) {
            const row = rows[0];
            return new Networking(
                row.id, row.nome, row.categoria, row.contato, row.email, row.data_nascimento, row.observacoes, row.criado_em, row.atualizado_em
            );
        } else {
            return null;
        }
    }
}
