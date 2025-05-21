import TipoTransporte from "../Model/TipoTransporte.js";
import conectar from "./conexao.js";

export default class TipoTransporteDAO {
    async gravar(tipoTransporte) {
        if (tipoTransporte instanceof TipoTransporte) {
            const conexao = await conectar();
            const sql = "INSERT INTO tipo_transporte (tipo_transporte) VALUES (?)";
            const parametros = [tipoTransporte.tipo_transporte];
            const resultado = await conexao.query(sql, parametros);
            tipoTransporte.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return tipoTransporte;
        }
    }

    async atualizar(tipoTransporte) {
        if (tipoTransporte instanceof TipoTransporte) {
            const conexao = await conectar();
            const sql = "UPDATE tipo_transporte SET tipo_transporte = ? WHERE id = ?";
            const parametros = [tipoTransporte.tipo_transporte, tipoTransporte.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(tipoTransporte) {
        if (tipoTransporte instanceof TipoTransporte) {
            const conexao = await conectar();
            const sql = "DELETE FROM tipo_transporte WHERE id = ?";
            const parametros = [tipoTransporte.id];
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
            sql = "SELECT * FROM tipo_transporte WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { // Senão, pesquisa por tipo de análise
            sql = `SELECT * FROM tipo_transporte WHERE tipo_transporte LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaTiposTransporte = [];
        for (const registro of registros) {
            const tipoTransporte = new TipoTransporte(registro.id, registro.tipo_transporte);
            listaTiposTransporte.push(tipoTransporte);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaTiposTransporte;
    }
}
