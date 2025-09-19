import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export default async function conectar() {
    if (global.poolConexoes) {
        try {
            const conexao = await global.poolConexoes.getConnection();
            await conexao.ping(); // Valida se a conexão está ativa
            return conexao;
        } catch (erro) {
            console.error('Conexão inativa. Tentando reconectar...', erro.message);
        }
    }

    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_SENHA || '',
            database: process.env.DB_NOME || 'alsten_os',
            connectionLimit: 15, // Otimizado para VPS (era 50)
            maxIdle: 5, // Reduzido para economizar memória (era 30)
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        global.poolConexoes = pool;
        console.log('Nova pool de conexões MySQL criada.');
        return await global.poolConexoes.getConnection();
    } catch (erro) {
        console.error('Erro ao criar pool de conexões:', erro.message);
        throw erro;
    }
}
