import Fabricante from "../Model/Fabricante.js";
import conectar from "./conexao.js";
import cacheService from "./cacheService.js";

export default class FabricanteDAO {
    async gravar(fabricante) {
        if (fabricante instanceof Fabricante) {
            const conexao = await conectar();
            const sql = "INSERT INTO fabricante (nome_fabricante) VALUES (?)";
            const parametros = [fabricante.nome_fabricante];
            const resultado = await conexao.query(sql, parametros);
            fabricante.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            
            // Limpar cache após inserção
            cacheService.delete('fabricantes_all');
            
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
            
            // Limpar cache após atualização
            cacheService.delete('fabricantes_all');
            cacheService.delete(`fabricante_${fabricante.id}`);
        }
    }

    async excluir(fabricante) {
        if (fabricante instanceof Fabricante) {
            const conexao = await conectar();
            const sql = "DELETE FROM fabricante WHERE id = ?";
            const parametros = [fabricante.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
            
            // Limpar cache após exclusão
            cacheService.delete('fabricantes_all');
            cacheService.delete(`fabricante_${fabricante.id}`);
        }
    }

    async consultar(termoBusca) {
        let sql = "";
        let parametros = [];
        if (!termoBusca) {
            termoBusca = "";
        }

        // Cache para busca por ID específico
        if (!isNaN(parseInt(termoBusca))) {
            const cacheKey = `fabricante_${parseInt(termoBusca)}`;
            const cachedResult = cacheService.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
        }
        
        // Cache para listagem completa (sem termo de busca)
        if (termoBusca === "") {
            const cachedAll = cacheService.get('fabricantes_all');
            if (cachedAll) {
                return cachedAll;
            }
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
        
        // Armazenar no cache
        if (!isNaN(parseInt(termoBusca))) {
            // Cache específico para ID
            cacheService.set(`fabricante_${parseInt(termoBusca)}`, listaFabricantes, 10 * 60 * 1000); // 10 minutos
        } else if (termoBusca === "") {
            // Cache para listagem completa
            cacheService.set('fabricantes_all', listaFabricantes, 5 * 60 * 1000); // 5 minutos
        }
        
        return listaFabricantes;
    }
}
