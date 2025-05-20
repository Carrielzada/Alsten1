import DefeitoAlegado from "../Model/DefeitoAlegado.js";
import conectar from "./conexao.js";

export default class DefeitoAlegadoDAO {
    async gravar(defeitoAlegado) {
        if (defeitoAlegado instanceof DefeitoAlegado) {
            const conexao = await conectar();
            const sql = "INSERT INTO defeito_alegado (defeito_alegado_padrao) VALUES (?)";
            const parametros = [defeitoAlegado.defeito_alegado_padrao];
            const resultado = await conexao.query(sql, parametros);
            defeitoAlegado.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return defeitoAlegado;
        }
    }

    async atualizar(defeitoAlegado) {
        if (defeitoAlegado instanceof DefeitoAlegado) {
            const conexao = await conectar();
            const sql = "UPDATE defeito_alegado SET defeito_alegado_padrao = ? WHERE id = ?";
            const parametros = [defeitoAlegado.defeito_alegado_padrao, defeitoAlegado.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(defeitoAlegado) {
        if (defeitoAlegado instanceof DefeitoAlegado) {
            const conexao = await conectar();
            const sql = "DELETE FROM defeito_alegado WHERE id = ?";
            const parametros = [defeitoAlegado.id];
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

        if (!isNaN(parseInt(termoBusca))) { 
            sql = "SELECT * FROM defeito_alegado WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { 
            sql = `SELECT * FROM defeito_alegado WHERE defeito_alegado_padrao LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaDefeitosAlegados = [];
        for (const registro of registros) {
            const defeitoAlegado = new DefeitoAlegado(registro.id, registro.defeito_alegado_padrao);
            listaDefeitosAlegados.push(defeitoAlegado);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaDefeitosAlegados;
    }
}
