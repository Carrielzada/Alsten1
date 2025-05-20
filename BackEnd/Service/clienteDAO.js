import conectar from './conexao.js';

export default class ClienteDAO {
    async obterPropagandasPorCliente(userId) {
        const conexao = await conectar();
        const sql = `
            SELECT p.id, p.nome_cliente, p.canal, p.valor, p.data_emissao, p.data_encerramento
            FROM propaganda_pj p
            WHERE p.user_id = ?
        `;
        const [resultados] = await conexao.query(sql, [userId]);
        global.poolConexoes.releaseConnection(conexao);
        return resultados;
    }

    async obterPublicidadesPorIdDados(idDados) {
        const conexao = await conectar();
        const sql = `
            SELECT *
            FROM publicidade_pj
            WHERE id_dados = ?
        `;
        const [resultados] = await conexao.query(sql, [idDados]);
        global.poolConexoes.releaseConnection(conexao);
        return resultados;
    }

    async obterPropagandasPorIdDados(idDados) {
        const conexao = await conectar();
        const sql = `
            SELECT *
            FROM propaganda_pj
            WHERE id_dados = ?
        `;
        const [resultados] = await conexao.query(sql, [idDados]);
        global.poolConexoes.releaseConnection(conexao);
        return resultados;
    }
    
    async obterPropagandasPFPorIdDados(idDados) {
        const conexao = await conectar();
        const sql = `
            SELECT *
            FROM propaganda_pf
            WHERE id_dados = ?
        `;
        const [resultados] = await conexao.query(sql, [idDados]);
        global.poolConexoes.releaseConnection(conexao);
        return resultados;
    }
}
