import TipoLacre from "../Modelo/TipoLacre.js";
import conectar from "./conexao.js";

export default class TipoLacreDAO {
    async gravar(tipoLacre) {
        if (tipoLacre instanceof TipoLacre) {
            const conexao = await conectar();
            const sql = "INSERT INTO tipo_lacre (tipo_lacre) VALUES (?)";
            const parametros = [tipoLacre.tipo_lacre];
            const resultado = await conexao.query(sql, parametros);
            tipoLacre.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return tipoLacre;
        }
    }

    async atualizar(tipoLacre) {
        if (tipoLacre instanceof TipoLacre) {
            const conexao = await conectar();
            const sql = "UPDATE tipo_lacre SET tipo_lacre = ? WHERE id = ?";
            const parametros = [tipoLacre.tipo_lacre, tipoLacre.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(tipoLacre) {
        if (tipoLacre instanceof TipoLacre) {
            const conexao = await conectar();
            const sql = "DELETE FROM tipo_lacre WHERE id = ?";
            const parametros = [tipoLacre.id];
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
            sql = "SELECT * FROM tipo_lacre WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { // Senão, pesquisa por tipo de lacre
            sql = `SELECT * FROM tipo_lacre WHERE tipo_lacre LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaTiposLacre = [];
        for (const registro of registros) {
            const tipoLacre = new TipoLacre(registro.id, registro.tipo_lacre);
            listaTiposLacre.push(tipoLacre);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaTiposLacre;
    }
}
