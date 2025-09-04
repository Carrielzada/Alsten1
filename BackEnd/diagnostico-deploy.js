import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('🔍 INICIANDO DIAGNÓSTICO DE DEPLOY...\n');

// Função para verificar variáveis de ambiente
function verificarVariaveisAmbiente() {
    console.log('📋 VERIFICANDO VARIÁVEIS DE AMBIENTE:');
    
    const variaveis = [
        'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_SENHA', 'DB_NOME',
        'NODE_ENV', 'PORT', 'CHAVE_SECRETA'
    ];
    
    let todasConfiguradas = true;
    
    variaveis.forEach(variavel => {
        const valor = process.env[variavel];
        if (valor) {
            console.log(`✅ ${variavel}: ${variavel.includes('SENHA') ? '***' : valor}`);
        } else {
            console.log(`❌ ${variavel}: NÃO CONFIGURADA`);
            todasConfiguradas = false;
        }
    });
    
    console.log('');
    return todasConfiguradas;
}

// Função para testar conexão com banco
async function testarConexaoBanco() {
    console.log('🗄️ TESTANDO CONEXÃO COM BANCO:');
    
    try {
        const conexao = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_SENHA,
            database: process.env.DB_NOME,
            connectTimeout: 10000,
            acquireTimeout: 10000,
            timeout: 10000
        });
        
        console.log('✅ Conexão com banco estabelecida com sucesso!');
        
        // Testar query simples
        const [rows] = await conexao.execute('SELECT 1 as teste');
        console.log('✅ Query de teste executada com sucesso:', rows[0]);
        
        // Verificar tabelas
        const [tabelas] = await conexao.execute('SHOW TABLES');
        console.log(`✅ Banco possui ${tabelas.length} tabelas`);
        
        await conexao.end();
        return true;
        
    } catch (error) {
        console.log('❌ Erro na conexão com banco:', error.message);
        return false;
    }
}

// Função para verificar arquivos críticos
function verificarArquivosCriticos() {
    console.log('📁 VERIFICANDO ARQUIVOS CRÍTICOS:');
    
    const arquivos = [
        'index.js',
        'package.json',
        'Service/conexao.js',
        'Service/urgenciaDAO.js',
        'Model/urgencia.js',
        'Routers/rotaUrgencia.js'
    ];
    
    let todosExistem = true;
    
    arquivos.forEach(arquivo => {
        const caminho = path.join(process.cwd(), arquivo);
        if (fs.existsSync(caminho)) {
            console.log(`✅ ${arquivo}: EXISTE`);
        } else {
            console.log(`❌ ${arquivo}: NÃO ENCONTRADO`);
            todosExistem = false;
        }
    });
    
    console.log('');
    return todosExistem;
}

// Função para verificar dependências
function verificarDependencias() {
    console.log('📦 VERIFICANDO DEPENDÊNCIAS:');
    
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            console.log(`✅ Package.json encontrado - versão: ${packageJson.version}`);
            console.log(`✅ Dependências: ${Object.keys(packageJson.dependencies).length}`);
            console.log(`✅ DevDependencies: ${Object.keys(packageJson.devDependencies).length}`);
        } else {
            console.log('❌ Package.json não encontrado');
            return false;
        }
    } catch (error) {
        console.log('❌ Erro ao ler package.json:', error.message);
        return false;
    }
    
    console.log('');
    return true;
}

// Função para verificar permissões
function verificarPermissoes() {
    console.log('🔐 VERIFICANDO PERMISSÕES:');
    
    try {
        const diretorioAtual = process.cwd();
        const stats = fs.statSync(diretorioAtual);
        
        console.log(`✅ Diretório atual: ${diretorioAtual}`);
        console.log(`✅ Permissões: ${stats.mode.toString(8)}`);
        console.log(`✅ Proprietário: ${stats.uid}`);
        console.log(`✅ Grupo: ${stats.gid}`);
        
        // Verificar se pode escrever no diretório
        try {
            fs.accessSync(diretorioAtual, fs.constants.W_OK);
            console.log('✅ Diretório tem permissão de escrita');
        } catch {
            console.log('❌ Diretório NÃO tem permissão de escrita');
        }
        
    } catch (error) {
        console.log('❌ Erro ao verificar permissões:', error.message);
    }
    
    console.log('');
}

// Função para verificar recursos do sistema
function verificarRecursosSistema() {
    console.log('💻 VERIFICANDO RECURSOS DO SISTEMA:');
    
    try {
        const memoria = process.memoryUsage();
        console.log(`✅ Memória em uso: ${Math.round(memoria.heapUsed / 1024 / 1024)} MB`);
        console.log(`✅ Memória total: ${Math.round(memoria.heapTotal / 1024 / 1024)} MB`);
        console.log(`✅ Versão Node.js: ${process.version}`);
        console.log(`✅ Plataforma: ${process.platform}`);
        console.log(`✅ Arquitetura: ${process.arch}`);
        console.log(`✅ PID: ${process.pid}`);
        console.log(`✅ Diretório de trabalho: ${process.cwd()}`);
        
    } catch (error) {
        console.log('❌ Erro ao verificar recursos:', error.message);
    }
    
    console.log('');
}

// Função para testar importações
async function testarImportacoes() {
    console.log('📥 TESTANDO IMPORTAÇÕES:');
    
    try {
        // Testar importação da conexão
        const { default: conectar } = await import('./Service/conexao.js');
        console.log('✅ Importação de conexao.js: OK');
        
        // Testar importação do modelo
        const { default: Urgencia } = await import('./Model/urgencia.js');
        console.log('✅ Importação de urgencia.js: OK');
        
        // Testar importação do DAO
        const { default: UrgenciaDAO } = await import('./Service/urgenciaDAO.js');
        console.log('✅ Importação de urgenciaDAO.js: OK');
        
        // Testar criação de instâncias
        const urgencia = new Urgencia(1, 'Teste');
        console.log('✅ Criação de instância Urgencia: OK');
        
        const dao = new UrgenciaDAO();
        console.log('✅ Criação de instância UrgenciaDAO: OK');
        
        return true;
        
    } catch (error) {
        console.log('❌ Erro nas importações:', error.message);
        console.log('❌ Stack trace:', error.stack);
        return false;
    }
}

// Função principal
async function executarDiagnostico() {
    console.log('🚀 DIAGNÓSTICO COMPLETO INICIADO\n');
    
    const resultados = {
        variaveis: verificarVariaveisAmbiente(),
        arquivos: verificarArquivosCriticos(),
        dependencias: verificarDependencias(),
        permissoes: true, // Sempre true para verificação
        recursos: true,    // Sempre true para verificação
        banco: false,
        importacoes: false
    };
    
    verificarPermissoes();
    verificarRecursosSistema();
    
    // Testar conexão com banco
    resultados.banco = await testarConexaoBanco();
    
    // Testar importações
    resultados.importacoes = await testarImportacoes();
    
    // Resumo final
    console.log('📊 RESUMO DO DIAGNÓSTICO:');
    console.log('=====================================');
    console.log(`✅ Variáveis de ambiente: ${resultados.variaveis ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Arquivos críticos: ${resultados.arquivos ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Dependências: ${resultados.dependencias ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Conexão com banco: ${resultados.banco ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Importações: ${resultados.importacoes ? 'OK' : 'FALHOU'}`);
    console.log('=====================================');
    
    const todosOk = Object.values(resultados).every(r => r);
    
    if (todosOk) {
        console.log('\n🎉 TODOS OS TESTES PASSARAM! O backend está pronto para deploy.');
        console.log('💡 Se ainda houver problemas no Coolify, verifique:');
        console.log('   - Logs do Coolify');
        console.log('   - Configuração da aplicação no Coolify');
        console.log('   - Variáveis de ambiente no Coolify');
        console.log('   - Recursos da VPS (CPU, RAM, disco)');
    } else {
        console.log('\n⚠️ ALGUNS TESTES FALHARAM. Corrija os problemas antes do deploy.');
        console.log('💡 Verifique os erros acima e corrija-os.');
    }
    
    console.log('\n🔍 DIAGNÓSTICO CONCLUÍDO');
}

// Executar diagnóstico
executarDiagnostico().catch(error => {
    console.error('❌ ERRO CRÍTICO NO DIAGNÓSTICO:', error);
    process.exit(1);
});
