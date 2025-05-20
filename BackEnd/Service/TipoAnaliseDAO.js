import TipoAnalise from "../Model/TipoAnalise.js";
import conectar from "./conexao.js";

export default class TipoAnaliseDAO {
    async gravar(tipoAnalise) {
        if (tipoAnalise instanceof TipoAnalise) {
            const conexao = await conectar();
            const sql = "INSERT INTO tipo_analise (tipo_analise) VALUES (?)";
            const parametros = [tipoAnalise.tipo_analise];
            const resultado = await conexao.query(sql, parametros);
            tipoAnalise.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return tipoAnalise;
        }
    }

    async atualizar(tipoAnalise) {
        if (tipoAnalise instanceof TipoAnalise) {
            const conexao = await conectar();
            const sql = "UPDATE tipo_analise SET tipo_analise = ? WHERE id = ?";
            const parametros = [tipoAnalise.tipo_analise, tipoAnalise.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(tipoAnalise) {
        if (tipoAnalise instanceof TipoAnalise) {
            const conexao = await conectar();
            const sql = "DELETE FROM tipo_analise WHERE id = ?";
            const parametros = [tipoAnalise.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termoBusca) {
        let sql = "";
        let parametros = [];
        if (!termoBusca) {
            termoBusca = "";
        }

        const conexao = await conectar();

        if (!isNaN(parseInt(termoBusca))) { // Se o termo de busca for um número, pesquisa por ID
            sql = "SELECT * FROM tipo_analise WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { // Senão, pesquisa por tipo de análise
            sql = `SELECT * FROM tipo_analise WHERE tipo_analise LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaTiposAnalise = [];
        for (const registro of registros) {
            const tipoAnalise = new TipoAnalise(registro.id, registro.tipo_analise);
            listaTiposAnalise.push(tipoAnalise);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaTiposAnalise;
    }
}
