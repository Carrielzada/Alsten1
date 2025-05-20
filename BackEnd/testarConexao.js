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
        console.log('Conectando a', process.env.DB_USER, '@', process.env.DB_HOST ?? 'localhost', ':', process.env.DB_PORT ?? '3307');

        await conexao.end();
    } catch (erro) {
        console.error('❌ Erro ao conectar:', erro.message);
    }
}

testar();
