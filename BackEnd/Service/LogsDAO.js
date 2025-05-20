import Logs from '../Model/logs.js';
import conectar from './conexao.js';

export default class LogsDAO {
    async incluir(logs) {
        if (logs instanceof Logs) {
            const conexao = await conectar();
            const sql = `INSERT INTO logs (usuario_id, operacao, descricao, criado_em) 
                         VALUES (?, ?, ?, NOW())`;
            const valores = [logs.usuarioId, logs.operacao, logs.descricao];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo = "") {
        const conexao = await conectar();
        const sql = `
            SELECT l.id, l.usuario_id, l.operacao, l.descricao, l.criado_em, 
                   u.nome AS usuario_nome
            FROM logs l
            INNER JOIN usuarios u ON l.usuario_id = u.id
            WHERE l.operacao LIKE ? OR u.nome LIKE ?
            ORDER BY l.criado_em DESC`;
        const valores = [`%${termo}%`, `%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);

        const listaLogs = [];
        for (const row of rows) {
            const log = new Logs(
                row.id, row.usuario_id, row.operacao, row.descricao, row.criado_em
            );
            listaLogs.push({
                log: log,
                usuario_nome: row.usuario_nome
            });
        }
        return listaLogs;
    }

    async consultarPorUsuario(usuarioId) {
        const conexao = await conectar();
        const sql = `
            SELECT l.id, l.usuario_id, l.operacao, l.descricao, l.criado_em, 
                   u.nome AS usuario_nome
            FROM logs l
            INNER JOIN usuarios u ON l.usuario_id = u.id
            WHERE l.usuario_id = ?
            ORDER BY l.criado_em DESC`;
        const [rows] = await conexao.query(sql, [usuarioId]);
        global.poolConexoes.releaseConnection(conexao);

        const listaLogs = [];
        for (const row of rows) {
            const log = new Logs(
                row.id, row.usuario_id, row.operacao, row.descricao, row.criado_em
            );
            listaLogs.push({
                log: log,
                usuario_nome: row.usuario_nome
            });
        }
        return listaLogs;
    }

    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `
            SELECT l.id, l.usuario_id, l.operacao, l.descricao, l.criado_em, 
                   u.nome AS usuario_nome
            FROM logs l
            INNER JOIN usuarios u ON l.usuario_id = u.id
            WHERE l.id = ?`;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);

        if (rows.length > 0) {
            const row = rows[0];
            return {
                log: new Logs(row.id, row.usuario_id, row.operacao, row.descricao, row.criado_em),
                usuario_nome: row.usuario_nome
            };
        } else {
            return null;
        }
    }
}
