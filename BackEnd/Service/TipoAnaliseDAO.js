import TipoAnalise from "../Model/TipoAnalise.js";
import conectar from "./conexao.js";
import cacheService from "./cacheService.js";

export default class TipoAnaliseDAO {
    async gravar(tipoAnalise) {
        if (tipoAnalise instanceof TipoAnalise) {
            const conexao = await conectar();
            const sql = "INSERT INTO tipo_analise (tipo_analise) VALUES (?)";
            const parametros = [tipoAnalise.tipo_analise];
            const resultado = await conexao.query(sql, parametros);
            tipoAnalise.id = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
            
            // Limpar cache após inserção
            cacheService.delete('tipos_analise_all');
            
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
            
            // Limpar cache após atualização
            cacheService.delete('tipos_analise_all');
            // Limpar caches de busca que podem conter este item
            for (const key of cacheService.cache.keys()) {
                if (key.startsWith('tipo_analise_search_')) {
                    cacheService.delete(key);
                }
            }
        }
    }

    async excluir(tipoAnalise) {
        if (tipoAnalise instanceof TipoAnalise) {
            const conexao = await conectar();
            const sql = "DELETE FROM tipo_analise WHERE id = ?";
            const parametros = [tipoAnalise.id];
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
            
            // Limpar cache após exclusão
            cacheService.delete('tipos_analise_all');
            // Limpar caches de busca que podem conter este item
            for (const key of cacheService.cache.keys()) {
                if (key.startsWith('tipo_analise_search_')) {
                    cacheService.delete(key);
                }
            }
        }
    }

    async consultar(termoBusca) {
        let sql = "";
        let parametros = [];
        if (!termoBusca) {
            termoBusca = "";
        }

        // Verificar cache primeiro
        const cacheKey = termoBusca === "" ? 'tipos_analise_all' : `tipo_analise_search_${termoBusca}`;
        const cachedResult = cacheService.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
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
        
        // Armazenar no cache (TTL maior para listagens completas)
        const ttl = termoBusca === "" ? 10 * 60 * 1000 : 5 * 60 * 1000;
        cacheService.set(cacheKey, listaTiposAnalise, ttl);
        
        return listaTiposAnalise;
    }
}
