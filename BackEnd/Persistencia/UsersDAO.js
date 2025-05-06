import Users from '../Modelo/users.js';
import conectar from './conexao.js';

export default class UsersDAO {
    async incluir(users) {
        if (users instanceof Users) {
            const conexao = await conectar();
            const sql = `INSERT INTO users (nome, email, password, role_id, id_dados, criado_em, atualizado_em) 
                         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
            const valores = [
                users.nome,
                users.email,
                users.password,
                users.role_id,
                users.id_dados,
                users.criado_em,
                users.atualizado_em
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(users) {
        if (users instanceof Users) {
            const conexao = await conectar();
            const sql = `UPDATE users SET password = ? WHERE email = ?`;
            const valores = [
                users.password,      
                users.email
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    
    

    async excluir(id) {
        const conexao = await conectar();
        const sql = "DELETE FROM users WHERE id = ?";
        const valores = [id];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        if (resultado.affectedRows === 0) {
            throw new Error("Cliente não encontrado ou já excluído.");
        }
    }
    
    
    

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `SELECT * FROM users WHERE nome LIKE ? ORDER BY nome`;
        const valores = [`%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        const listaUsers = [];
        for (const row of rows) {
            const users = new Users(
                row.id, 
                row.nome,
                row.email,
                row.password,
                row.role_id,
                row.id_dados,
                row.criado_em,
                row.atualizado_em
            );
            listaUsers.push(users);
        }
        return listaUsers;
    }
    

    async consultarPorRole(role_id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM users WHERE role_id = ? ORDER BY nome`;
        const [rows] = await conexao.query(sql, [role_id]);
        global.poolConexoes.releaseConnection(conexao);
    
        return rows.map((row) => new Users(
            row.id,
            row.nome,
            row.email,
            row.password,
            row.role_id,
            row.id_dados,
            row.criado_em,
            row.atualizado_em
        ));
    }
    
    async atualizarIdDados(id, prop_publ, novoId) {
        const conexao = await conectar();
    
        // Buscar o valor atual de id_dados no banco
        const sqlBusca = "SELECT id_dados FROM users WHERE id = ?";
        const [rows] = await conexao.query(sqlBusca, [id]);
    
        if (rows.length === 0) {
            throw new Error("Usuário não encontrado.");
        }
    
        // Obter a lista de IDs existente ou inicializar um array vazio
        const id_dadosAtual = rows[0].id_dados 
            ? rows[0].id_dados.split(",").map(Number).filter((num) => !isNaN(num)) 
            : [];
    
        // Adicionar o novo ID à lista, evitando duplicatas
        if (!id_dadosAtual.includes(Number(novoId))) {
            id_dadosAtual.push(Number(novoId));
        }
    
        // Converter de volta para string separada por vírgulas
        const novosIdDados = id_dadosAtual.join(",");
    
        // Atualizar o banco
        const sqlAtualiza = "UPDATE users SET prop_publ = ?, id_dados = ? WHERE id = ?";
        await conexao.query(sqlAtualiza, [prop_publ, novosIdDados, id]);
    
        global.poolConexoes.releaseConnection(conexao);
    }
    
    

    async consultarPorEmail(email) {
        const conexao = await conectar();
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await conexao.query(sql, [email]);
        global.poolConexoes.releaseConnection(conexao);
    
        if (rows.length === 0) {
            return null; // Retorna null se o usuário não for encontrado
        }
    
        const row = rows[0];
        return new Users(
            row.id,
            row.nome,
            row.email,
            row.password,
            row.role_id,
            row.prop_publ,
            row.id_dados,
            row.criado_em,
            row.atualizado_em
        );
    }
    
}

