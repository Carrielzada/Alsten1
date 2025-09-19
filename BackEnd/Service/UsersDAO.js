import Users from '../Model/users.js';
import conectar from './conexao.js';
import { 
    validatePaginationParams, 
    buildPaginationMeta, 
    validateUsersFilters, 
    buildOrderBy,
    logPaginationPerformance 
} from './utils/paginationHelper.js';

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
    }

    /**
     * Método de consulta com paginação e filtros avançados para usuários
     * 
     * @param {Object} query - Parâmetros da query (page, limit, filtros)
     * @returns {Object} Resultado paginado com metadata
     */
    async consultarComPaginacao(query = {}) {
        const startTime = Date.now();
        const conexao = await conectar();
        
        try {
            // Validar parâmetros de paginação
            const { page, limit, offset } = validatePaginationParams(query);
            
            // Validar e sanitizar filtros específicos de usuários
            const filters = validateUsersFilters(query);
            
            // Construir condições WHERE dinâmicas
            const whereConditions = [];
            const queryParams = [];
            
            // Filtro por Role ID
            if (filters.roleId) {
                whereConditions.push('u.role_id = ?');
                queryParams.push(filters.roleId);
            }
            
            // Filtro por nome (busca parcial)
            if (filters.nome) {
                whereConditions.push('u.nome LIKE ?');
                queryParams.push(`%${filters.nome}%`);
            }
            
            // Filtro por email (busca parcial)
            if (filters.email) {
                whereConditions.push('u.email LIKE ?');
                queryParams.push(`%${filters.email}%`);
            }
            
            // Busca geral (nome OU email)
            if (filters.search) {
                whereConditions.push('(u.nome LIKE ? OR u.email LIKE ?)');
                const searchTerm = `%${filters.search}%`;
                queryParams.push(searchTerm, searchTerm);
            }
            
            // Filtro por status ativo (futuro - se adicionarmos campo ativo)
            if (filters.ativo !== undefined) {
                whereConditions.push('u.ativo = ?');
                queryParams.push(filters.ativo ? 1 : 0);
            }
            
            // Montar cláusula WHERE final
            const whereClause = whereConditions.length > 0 
                ? `WHERE ${whereConditions.join(' AND ')}` 
                : '';
            
            // Query para contar total de registros
            const sqlCount = `
                SELECT COUNT(*) as total
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                ${whereClause}
            `;
            
            const [countResult] = await conexao.query(sqlCount, queryParams);
            const total = countResult[0].total;
            
            // Campos permitidos para ordenação
            const allowedOrderFields = [
                'nome', 'email', 'role_id', 'criado_em', 'atualizado_em', 'id'
            ];
            
            // Construir ORDER BY dinâmico
            const orderBy = buildOrderBy(
                query.orderBy, 
                query.orderDirection, 
                allowedOrderFields, 
                'u.nome ASC'
            );
            
            // Query principal com LIMIT, OFFSET e JOIN com roles
            const sqlMain = `
                SELECT 
                    u.*,
                    r.nome as role_nome,
                    r.descricao as role_descricao
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                ${whereClause}
                ORDER BY ${orderBy}
                LIMIT ? OFFSET ?
            `;
            
            const mainQueryParams = [...queryParams, limit, offset];
            const [registros] = await conexao.query(sqlMain, mainQueryParams);
            
            // Processar registros (sem expor senhas)
            const listaUsers = registros.map(row => ({
                id: row.id,
                nome: row.nome,
                email: row.email,
                role: {
                    id: row.role_id,
                    nome: row.role_nome || `Role ${row.role_id}`,
                    descricao: row.role_descricao || ''
                },
                criadoEm: row.criado_em,
                atualizadoEm: row.atualizado_em,
                // Não expor senha por segurança
                // password field is intentionally omitted
            }));
            
            // Log de performance
            logPaginationPerformance('Users.consultarComPaginacao', startTime, total, filters);
            
            // Construir metadata de paginação
            const meta = buildPaginationMeta(total, page, limit);
            
            return {
                success: true,
                data: listaUsers,
                meta,
                filters: Object.keys(filters).length > 0 ? filters : undefined
            };
            
        } catch (error) {
            console.error("Erro ao consultar Usuários com paginação:", error);
            throw error;
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
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

