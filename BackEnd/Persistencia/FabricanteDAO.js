import Fabricante from "../Modelo/Fabricante.js";
import conectar from "./conexao.js";

export default class FabricanteDAO {
    async gravar(fabricante) {
        if (fabricante instanceof Fabricante) {
            const conexao = await conectar();
            const sql = "INSERT INTO fabricante (nome_fabricante) VALUES (?)";
            const parametros = [fabricante.nome_fabricante];
            const resultado = await conexao.query(sql, parametros);
            fabricante.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            return fabricante;
        }
    }

    async atualizar(fabricante) {
        if (fabricante instanceof Fabricante) {
            const conexao = await conectar();
            const sql = "UPDATE fabricante SET nome_fabricante = ? WHERE id = ?";
            const parametros = [fabricante.nome_fabricante, fabricante.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(fabricante) {
        if (fabricante instanceof Fabricante) {
            const conexao = await conectar();
            const sql = "DELETE FROM fabricante WHERE id = ?";
            const parametros = [fabricante.id];
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
            sql = "SELECT * FROM fabricante WHERE id = ?";
            parametros = [parseInt(termoBusca)];
        }
        else { 
            sql = `SELECT * FROM fabricante WHERE nome_fabricante LIKE ?`;
            parametros = ["%" + termoBusca + "%"];
        }
        
        const [registros] = await conexao.query(sql, parametros);
        let listaFabricantes = [];
        for (const registro of registros) {
            const fabricante = new Fabricante(registro.id, registro.nome_fabricante);
            listaFabricantes.push(fabricante);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaFabricantes;
    }
}
