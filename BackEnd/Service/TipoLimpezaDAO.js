import TipoLimpeza from "../Model/TipoLimpeza.js";
import conectar from "./conexao.js";

export default class TipoLimpezaDAO {
    async gravar(tipoLimpeza) {
        if (tipoLimpeza instanceof TipoLimpeza) {
            const conexao = await conectar();
            const sql = "INSERT INTO tipo_limpeza (tipo_limpeza) VALUES (?)";
            const parametros = [tipoLimpeza.tipo_limpeza];
            const resultado = await conexao.query(sql, parametros);
            tipoLimpeza.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return tipoLimpeza;
        }
    }

    async atualizar(tipoLimpeza) {
        if (tipoLimpeza instanceof TipoLimpeza) {
            const conexao = await conectar();
            const sql = "UPDATE tipo_limpeza SET tipo_limpeza = ? WHERE id = ?";
            const parametros = [tipoLimpeza.tipo_limpeza, tipoLimpeza.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(tipoLimpeza) {
        if (tipoLimpeza instanceof TipoLimpeza) {
            const conexao = await conectar();
            const sql = "DELETE FROM tipo_limpeza WHERE id = ?";
            const parametros = [tipoLimpeza.id];
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
            sql = "SELECT * FROM tipo_limpeza WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { // Senão, pesquisa por tipo de análise
            sql = `SELECT * FROM tipo_limpeza WHERE tipo_limpeza LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaTiposLimpeza = [];
        for (const registro of registros) {
            const tipoLimpeza = new TipoLimpeza(registro.id, registro.tipo_limpeza);
            listaTiposLimpeza.push(tipoLimpeza);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaTiposLimpeza;
    }
}
