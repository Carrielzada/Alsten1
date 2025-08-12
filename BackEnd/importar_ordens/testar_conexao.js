// Script para testar a conexão com o banco de dados
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Exibir variáveis de ambiente carregadas (sem senhas)
console.log('Variáveis de ambiente carregadas:');
console.log('DB_NOME:', process.env.DB_NOME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_SENHA || '',
  database: process.env.DB_NOME || 'alsten_os',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
  connectTimeout: 60000,
};

// Exibir configuração de conexão (sem a senha)
console.log('\nConfiguração de conexão:');
console.log('host:', dbConfig.host);
console.log('port:', dbConfig.port);
console.log('user:', dbConfig.user);
console.log('database:', dbConfig.database);

// Função para testar a conexão
async function testarConexao() {
  console.log('\n🔄 Testando conexão com o banco de dados...');
  
  try {
    // Tentar conectar diretamente ao MySQL sem especificar o banco de dados
    const configSemDB = { ...dbConfig };
    delete configSemDB.database;
    
    console.log('\n1. Testando conexão ao MySQL sem especificar banco de dados...');
    const poolSemDB = mysql.createPool(configSemDB);
    const connSemDB = await poolSemDB.getConnection();
    console.log('✅ Conexão ao MySQL bem-sucedida!');
    
    // Listar bancos de dados disponíveis
    const [databases] = await connSemDB.query('SHOW DATABASES');
    console.log('\nBancos de dados disponíveis:');
    databases.forEach(db => console.log(`- ${db.Database}`));
    
    connSemDB.release();
    await poolSemDB.end();
    
    // Tentar conectar ao banco de dados específico
    console.log(`\n2. Testando conexão ao banco de dados '${dbConfig.database}'...`);
    const pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    console.log(`✅ Conexão ao banco de dados '${dbConfig.database}' bem-sucedida!`);
    
    // Listar tabelas do banco de dados
    const [tables] = await conn.query('SHOW TABLES');
    console.log('\nTabelas disponíveis:');
    const tableKey = `Tables_in_${dbConfig.database}`;
    tables.forEach(table => console.log(`- ${table[tableKey]}`));
    
    conn.release();
    await pool.end();
    
    console.log('\n✅ Teste de conexão concluído com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao conectar ao banco de dados:', error.message);
    console.error('Detalhes do erro:', error);
    
    // Sugestões para resolver o problema
    console.log('\n🔍 Sugestões para resolver o problema:');
    console.log('1. Verifique se o serviço MySQL está em execução');
    console.log('2. Verifique se as credenciais no arquivo .env estão corretas');
    console.log('3. Verifique se o banco de dados existe');
    console.log('4. Verifique se o usuário tem permissão para acessar o banco de dados');
    console.log('5. Verifique se o MySQL está configurado para aceitar conexões do endereço especificado');
    
    // Verificar se o MySQL está em execução (apenas para Windows)
    try {
      const { execSync } = await import('child_process');
      console.log('\n🔍 Verificando se o serviço MySQL está em execução...');
      const output = execSync('sc query mysql').toString();
      console.log(output);
    } catch (e) {
      console.log('Não foi possível verificar o status do serviço MySQL:', e.message);
    }
  }
}

// Executar a função de teste
testarConexao().catch(console.error);