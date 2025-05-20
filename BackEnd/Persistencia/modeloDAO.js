import Modelo from '../Modelo/modelo.js';
import conectar from './conexao.js';

export default class ModeloDAO {
    async incluir(modelo) {
        if (modelo instanceof Modelo) {
            const conexao = await conectar();
            const sql = `INSERT INTO modelo (modelo) VALUES (?)`;
            const valores = [modelo.modelo];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(modelo) {
        if (modelo instanceof Modelo) {
            const conexao = await conectar();
            const sql = `UPDATE modelo 
                         SET modelo = ? 
                         WHERE id = ?`;
            const valores = [
                modelo.modelo,
                modelo.id
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(id) {
        const conexao = await conectar();
        const sql = "DELETE FROM modelo WHERE id = ?";
        const valores = [id];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        if (resultado.affectedRows === 0) {
            throw new Error("Forma de Modelo não encontrada ou já excluído.");
        }
    }

async consultar(termo = "") {
    const conexao = await conectar();
    const sql = `SELECT * FROM modelo ORDER BY modelo`; // ❌ removido WHERE
    const [rows] = await conexao.query(sql); // ❌ removido valores
    global.poolConexoes.releaseConnection(conexao);

    const listaModelos = [];
    for (const row of rows) {
        const modelo = new Modelo(row.id, row.modelo);
        listaModelos.push(modelo);
    }
    return listaModelos;
}


    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM modelo WHERE id = ?`;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);
    
        if (rows.length > 0) {
            const row = rows[0];
            return new Modelo(
                row.id, 
                row.modelo
            );
        } else {
            return null;
        }
    }

    async filtrar(termobusca) {
    const conexao = await conectar();
    const sql = `SELECT * FROM modelo WHERE modelo LIKE ? ORDER BY modelo`;
    const valores = [`%${termobusca}%`];
    const [rows] = await conexao.query(sql, valores);
    global.poolConexoes.releaseConnection(conexao);

    const lista = [];
    for (const row of rows) {
        const modelo = new Modelo(row.id, row.modelo);
        lista.push(modelo);
    }
    return lista;
}

    
}
