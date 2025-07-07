const mysql = require('mysql2/promise');

class TokenService {
    constructor() {
        this.useDatabase = process.env.NODE_ENV === 'production';
        this.memoryStorage = {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            userId: null
        };
    }

    // Configuração do banco de dados
    async getDbConnection() {
        if (!this.useDatabase) return null;
        
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            return connection;
        } catch (error) {
            console.error('Erro ao conectar com o banco:', error);
            throw error;
        }
    }

    // Cria a tabela de tokens se não existir
    async initializeDatabase() {
        if (!this.useDatabase) return;
        
        const connection = await this.getDbConnection();
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS bling_tokens (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id VARCHAR(255) DEFAULT 'default',
                    access_token TEXT NOT NULL,
                    refresh_token TEXT NOT NULL,
                    expires_at BIGINT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_user (user_id)
                )
            `);
            console.log('Tabela bling_tokens criada/verificada com sucesso');
        } finally {
            await connection.end();
        }
    }

    // Salva tokens no armazenamento apropriado
    async saveTokens(accessToken, refreshToken, expiresIn, userId = 'default') {
        const expiresAt = Date.now() + (expiresIn * 1000);
        
        if (this.useDatabase) {
            const connection = await this.getDbConnection();
            try {
                await connection.execute(`
                    INSERT INTO bling_tokens (user_id, access_token, refresh_token, expires_at)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    access_token = VALUES(access_token),
                    refresh_token = VALUES(refresh_token),
                    expires_at = VALUES(expires_at),
                    updated_at = CURRENT_TIMESTAMP
                `, [userId, accessToken, refreshToken, expiresAt]);
                
                console.log('Tokens salvos no banco de dados');
            } finally {
                await connection.end();
            }
        } else {
            // Armazenamento em memória para desenvolvimento
            this.memoryStorage = {
                accessToken,
                refreshToken,
                expiresAt,
                userId
            };
            console.log('Tokens salvos em memória');
        }
    }

    // Recupera tokens do armazenamento
    async getTokens(userId = 'default') {
        if (this.useDatabase) {
            const connection = await this.getDbConnection();
            try {
                const [rows] = await connection.execute(
                    'SELECT access_token, refresh_token, expires_at FROM bling_tokens WHERE user_id = ?',
                    [userId]
                );
                
                if (rows.length === 0) {
                    return null;
                }
                
                const token = rows[0];
                return {
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token,
                    expiresAt: token.expires_at
                };
            } finally {
                await connection.end();
            }
        } else {
            // Retorna do armazenamento em memória
            if (this.memoryStorage.userId === userId) {
                return {
                    accessToken: this.memoryStorage.accessToken,
                    refreshToken: this.memoryStorage.refreshToken,
                    expiresAt: this.memoryStorage.expiresAt
                };
            }
            return null;
        }
    }

    // Atualiza apenas o access token
    async updateAccessToken(accessToken, expiresIn, userId = 'default') {
        const expiresAt = Date.now() + (expiresIn * 1000);
        
        if (this.useDatabase) {
            const connection = await this.getDbConnection();
            try {
                await connection.execute(`
                    UPDATE bling_tokens 
                    SET access_token = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = ?
                `, [accessToken, expiresAt, userId]);
                
                console.log('Access token atualizado no banco');
            } finally {
                await connection.end();
            }
        } else {
            if (this.memoryStorage.userId === userId) {
                this.memoryStorage.accessToken = accessToken;
                this.memoryStorage.expiresAt = expiresAt;
                console.log('Access token atualizado em memória');
            }
        }
    }

    // Remove tokens do armazenamento
    async clearTokens(userId = 'default') {
        if (this.useDatabase) {
            const connection = await this.getDbConnection();
            try {
                await connection.execute(
                    'DELETE FROM bling_tokens WHERE user_id = ?',
                    [userId]
                );
                console.log('Tokens removidos do banco');
            } finally {
                await connection.end();
            }
        } else {
            if (this.memoryStorage.userId === userId) {
                this.memoryStorage = {
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    userId: null
                };
                console.log('Tokens removidos da memória');
            }
        }
    }

    // Verifica se o token está válido
    isTokenValid(expiresAt) {
        return expiresAt && Date.now() < (expiresAt - 60000); // 1 minuto de margem
    }

    // Verifica se existe token para o usuário
    async hasValidToken(userId = 'default') {
        const tokens = await this.getTokens(userId);
        return tokens && this.isTokenValid(tokens.expiresAt);
    }

    // Lista todos os usuários com tokens (útil para debug)
    async listTokenUsers() {
        if (this.useDatabase) {
            const connection = await this.getDbConnection();
            try {
                const [rows] = await connection.execute(`
                    SELECT user_id, expires_at, created_at, updated_at 
                    FROM bling_tokens 
                    ORDER BY updated_at DESC
                `);
                return rows.map(row => ({
                    userId: row.user_id,
                    expiresAt: row.expires_at,
                    isValid: this.isTokenValid(row.expires_at),
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                }));
            } finally {
                await connection.end();
            }
        } else {
            if (this.memoryStorage.accessToken) {
                return [{
                    userId: this.memoryStorage.userId,
                    expiresAt: this.memoryStorage.expiresAt,
                    isValid: this.isTokenValid(this.memoryStorage.expiresAt),
                    storage: 'memory'
                }];
            }
            return [];
        }
    }

    // Limpa tokens expirados (limpeza automática)
    async cleanupExpiredTokens() {
        if (this.useDatabase) {
            const connection = await this.getDbConnection();
            try {
                const [result] = await connection.execute(
                    'DELETE FROM bling_tokens WHERE expires_at < ?',
                    [Date.now()]
                );
                console.log(`${result.affectedRows} tokens expirados removidos`);
                return result.affectedRows;
            } finally {
                await connection.end();
            }
        } else {
            if (this.memoryStorage.expiresAt && this.memoryStorage.expiresAt < Date.now()) {
                this.memoryStorage = {
                    accessToken: null,
                    refreshToken: null,
                    expiresAt: null,
                    userId: null
                };
                console.log('Token expirado removido da memória');
                return 1;
            }
            return 0;
        }
    }
}

module.exports = TokenService;

