import Users from '../Model/users.js';
import conectar from './conexao.js';

export default class UsersDAO {
    async incluir(users) {
        if (users instanceof Users) {
            const conexao = await conectar();
            const sql = `INSERT INTO users (nome, email, password, role_id, criado_em, atualizado_em) 
                         VALUES (?, ?, ?, ?, NOW(), NOW())`;
            const valores = [
                users.nome,
                users.email,
                users.password,
                users.role_id,
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
            throw new Error("Usuário não encontrado ou já excluído.");
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
            row.criado_em,
            row.atualizado_em
        ));
    }
    
    async atualizarDadosUsuario(id, dados) {
    const conexao = await conectar();
    
    // Construir a query dinamicamente com base nos campos fornecidos
    let sqlCampos = [];
    let valores = [];
    
    if (dados.nome !== undefined) {
        sqlCampos.push("nome = ?");
        valores.push(dados.nome);
    }
    
    if (dados.email !== undefined) {
        sqlCampos.push("email = ?");
        valores.push(dados.email);
    }
    
    if (dados.role_id !== undefined) {
        sqlCampos.push("role_id = ?");
        valores.push(dados.role_id);
    }
    
    // Se não há campos para atualizar, retornar
    if (sqlCampos.length === 0) {
        global.poolConexoes.releaseConnection(conexao);
        return;
    }
    
    // Adicionar o id ao final do array de valores
    valores.push(id);
    
    const sql = `UPDATE users SET ${sqlCampos.join(", ")}, atualizado_em = NOW() WHERE id = ?`;
    
    try {
        const [resultado] = await conexao.query(sql, valores);
        
        if (resultado.affectedRows === 0) {
            throw new Error("Usuário não encontrado.");
        }
        
        return resultado;
    } finally {
        global.poolConexoes.releaseConnection(conexao);
    }
}


    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = "SELECT * FROM users WHERE id = ?";
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);
        
        if (rows.length === 0) {
            return null;
        }
        
        const row = rows[0];
        return new Users(
            row.id,
            row.nome,
            row.email,
            row.password,
            row.role_id,
            row.criado_em,
            row.atualizado_em
        );
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
            row.criado_em,
            row.atualizado_em
        );
    }
    
}

