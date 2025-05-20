import conectar from './Service/conexao.js';

class Database {
    constructor() {
        // O pool de conexões é gerenciado globalmente em conexao.js
    }

    async ExecutaComando(sql, params = []) {
        let conexao = null;
        try {
            conexao = await conectar();
            const [rows] = await conexao.query(sql, params);
            return rows;
        } catch (error) {
            console.error("Erro ao executar comando:", error);
            throw error;
        } finally {
            if (conexao) {
                conexao.release();
            }
        }
    }

    async ExecutaComandoNonQuery(sql, params = []) {
        let conexao = null;
        try {
            conexao = await conectar();
            const [result] = await conexao.query(sql, params);
            return result;
        } catch (error) {
            console.error("Erro ao executar comando NonQuery:", error);
            throw error;
        } finally {
            if (conexao) {
                conexao.release();
            }
        }
    }
}

export default Database;

