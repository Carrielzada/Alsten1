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
            host: 'localhost',
            port: 3306,
            user: process.env.USUARIO_BD,
            password: process.env.SENHA_BD,
            database: 'publicidadepropaganda',
            connectionLimit: 50,
            maxIdle: 30,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        global.poolConexoes = pool;
        console.log('Nova pool de conexões criada.');
        return await global.poolConexoes.getConnection();
    } catch (erro) {
        console.error('Erro ao criar pool de conexões:', erro.message);
        throw erro;
    }
}
