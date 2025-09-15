import Pagamento from "../Model/pagamento.js";
import conectar from "./conexao.js";

export default class PagamentoDAO {
    async gravar(pagamento) {
        if (pagamento instanceof Pagamento) {
            const conexao = await conectar();
            const sql = "INSERT INTO pagamento (pagamento) VALUES (?)";
            const parametros = [pagamento.pagamento];
            const resultado = await conexao.query(sql, parametros);
            pagamento.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return pagamento;
        }
    }

    async atualizar(pagamento) {
        if (pagamento instanceof Pagamento) {
            const conexao = await conectar();
            const sql = "UPDATE pagamento SET pagamento = ? WHERE id = ?";
            const parametros = [pagamento.pagamento, pagamento.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(pagamento) {
        if (pagamento instanceof Pagamento) {
            const conexao = await conectar();
            const sql = "DELETE FROM pagamento WHERE id = ?";
            const parametros = [pagamento.id];
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
            sql = "SELECT * FROM pagamento WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { // Senão, pesquisa por tipo de análise
            sql = `SELECT * FROM pagamento WHERE pagamento LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaPagamentos = [];
        for (const registro of registros) {
            const pagamento = new Pagamento(registro.id, registro.pagamento);
            listaPagamentos.push(pagamento);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaPagamentos;
    }
}
