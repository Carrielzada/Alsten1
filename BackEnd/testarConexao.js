import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testar() {
    try {
        const conexao = await mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_SENHA,
            database: process.env.DB_NOME,
        });
        console.log('✅ Conexão bem-sucedida com o banco!');
        await conexao.end();
    } catch (erro) {
        console.error('❌ Erro ao conectar:', erro.message);
    }
}

testar();
