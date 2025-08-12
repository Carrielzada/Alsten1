import xlsx from 'xlsx';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente de múltiplos locais possíveis
const possibleEnvPaths = [
  path.join(process.cwd(), '..', '.env'), // Raiz do projeto
  path.join(process.cwd(), '.env'), // Diretório atual
  path.join(process.cwd(), '..', 'BackEnd', '.env'), // BackEnd
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Arquivo .env carregado de:', envPath);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('⚠️  Nenhum arquivo .env encontrado. Usando configurações padrão.');
}

// Configuração do MySQL (usando a mesma configuração do projeto)
const dbConfig = {
  host: 'localhost',
  port: 3307,
  user: process.env.DB_USER || 'root', // Fallback para desenvolvimento
  password: process.env.DB_SENHA || '', // Fallback para desenvolvimento
  database: process.env.DB_NOME || 'alsten_os', // Fallback para desenvolvimento
  // Configurações para resolver problemas de autenticação
  authPlugins: {
    mysql_native_password: () => () => Buffer.alloc(0)
  },
  // Configurações adicionais de conexão
  charset: 'utf8mb4',
  timezone: 'local',
  // Configurações de SSL (desabilitar para desenvolvimento local)
  ssl: false,
  // Configurações de timeout
  connectTimeout: 60000,
};

(async () => {
  try {
    // Verificar se as variáveis de ambiente estão carregadas
    console.log('🔍 Verificando configurações...');
    console.log('📁 Diretório atual:', process.cwd());
    console.log('📊 Host:', dbConfig.host);
    console.log('🔌 Porta:', dbConfig.port);
    console.log('👤 Usuário:', dbConfig.user);
    console.log('🔑 Senha:', dbConfig.password ? '✅ Definida' : '❌ Não definida');
    console.log('🗄️  Banco:', dbConfig.database);
    
    // Verificar se o arquivo .env existe
    const envPath = path.join(process.cwd(), '..', '.env');
    if (!fs.existsSync(envPath)) {
      console.warn('⚠️  Arquivo .env não encontrado em:', envPath);
      console.warn('💡 Usando configurações padrão para desenvolvimento');
      console.warn('💡 Para usar configurações personalizadas, crie um arquivo .env na raiz do projeto');
    }
    
    // Ler planilha
    console.log('📊 Lendo arquivo Excel...');
    const workbook = xlsx.readFile('order-services-1749231640.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(`📋 Total de registros encontrados: ${data.length}`);

    // Criar pool de conexões
    const pool = mysql.createPool({
      ...dbConfig,
      connectionLimit: 10,
      queueLimit: 0,
    });
    
    const conn = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados');

    // Contador para acompanhar o progresso
    let processados = 0;
    let sucessos = 0;
    let erros = 0;

    for (const row of data) {
      processados++;
      
      try {
        // Preparar dados para inserção baseado na estrutura real da tabela
        const insertData = {
          cliente: row['Cliente'] || null,
          modeloEquipamento: row['Modelo'] || null,
          numeroSerie: row['Serial'] || null,
          dataCriacao: (() => {
            const dataCriacao = row['Data de criação'];
            if (!dataCriacao) {
              return new Date();
            }
            try {
              const date = new Date(dataCriacao);
              if (isNaN(date.getTime())) {
                return new Date();
              }
              return date;
            } catch (error) {
              return new Date();
            }
          })(),
          defeitoAlegado: String(row['Defeito alegado'] || '').substring(0, 255),
          fabricante: row['Fabricantes'] || null,
          etapa: row['Etapa'] || null,
          informacoes_confidenciais: row['informações confidenciais'] || null,
          defeito_constatado: row['Defeito constatado'] || null,
          servico_realizar: row['Serviço a ser realizado'] || null,
          dias_reparo: row['Tempo para reparo (dias)'] && !isNaN(parseInt(row['Tempo para reparo (dias)'])) 
                        ? parseInt(row['Tempo para reparo (dias)']) 
                        : null,
          valor: row['Valor total'] ? parseFloat(row['Valor total']) : 0.00,
          nota_fiscal: String(row['Nota fiscal'] || '').substring(0, 50),
          data_entrega: (() => {
            const previsao = row['Previsão de faturamento'];
            if (!previsao || previsao === 'Não definido' || previsao === '') {
              return null;
            }
            try {
              // Tentar diferentes formatos de data
              const date = new Date(previsao);
              if (isNaN(date.getTime())) {
                // Se falhar, tentar formato DD/MM/YYYY
                const parts = previsao.split('/');
                if (parts.length === 3) {
                  const day = parseInt(parts[0]);
                  const month = parseInt(parts[1]) - 1; // Mês começa em 0
                  const year = parseInt(parts[2]);
                  const newDate = new Date(year, month, day);
                  if (!isNaN(newDate.getTime())) {
                    return newDate;
                  }
                }
                return null;
              }
              return date;
            } catch (error) {
              return null;
            }
          })(),
          // Campos com valores padrão
          agendado: 0,
          possui_acessorio: 0,
          checklist_items: null,
          // Campos que podem ser nulos
          urgencia_id: null,
          tipo_analise_id: null,
          tipo_lacre_id: null,
          tipo_limpeza_id: null,
          tipo_transporte_id: null,
          pagamento_id: null,
          vendedor_id: null,
          dias_pagamento_id: null,
          etapa_id: null
        };

        const fields = Object.keys(insertData).join(',');
        const placeholders = Object.keys(insertData).map(() => '?').join(',');
        const values = Object.values(insertData);

        await conn.execute(
          `INSERT INTO ordem_servico (${fields}) VALUES (${placeholders})`,
          values
        );

        sucessos++;
        
        // Mostrar progresso a cada 100 registros
        if (processados % 100 === 0) {
          console.log(`📈 Processados: ${processados}/${data.length} (${Math.round(processados/data.length*100)}%)`);
        }

      } catch (rowError) {
        erros++;
        console.error(`❌ Erro ao processar linha ${processados}:`, rowError.message);
        
        // Log específico para problemas de data
        if (rowError.message.includes('Incorrect date value')) {
          console.error('📅 Problema com data detectado. Verificando dados...');
          console.error('   - Previsão de faturamento:', row['Previsão de faturamento']);
          console.error('   - Data de criação:', row['Data de criação']);
        }
        
        // Log apenas dos primeiros 5 erros para não poluir o console
        if (erros <= 5) {
          console.error('Dados da linha:', row);
        } else if (erros === 6) {
          console.error('... (outros erros similares ocultados para brevidade)');
        }
      }
    }

    console.log('\n✅ Importação concluída!');
    console.log(`📊 Resumo:`);
    console.log(`   - Total processado: ${processados}`);
    console.log(`   - Sucessos: ${sucessos}`);
    console.log(`   - Erros: ${erros}`);

    conn.release();
    await pool.end();

  } catch (err) {
    console.error('❌ Erro ao importar:', err);
    
    // Log específico para problemas de conexão
    if (err.code === 'ER_PLUGIN_IS_NOT_LOADED') {
      console.error('🔧 Problema de autenticação MySQL detectado.');
      console.error('💡 Verifique se o usuário MySQL tem permissões adequadas.');
      console.error('💡 Tente usar um usuário com autenticação mais recente (caching_sha2_password).');
    }
    
    if (err.code === 'ECONNREFUSED') {
      console.error('🔧 Problema de conexão detectado.');
      console.error('💡 Verifique se o MySQL está rodando na porta 3307.');
      console.error('💡 Verifique se as credenciais no arquivo .env estão corretas.');
    }

    if (err.code === 'ER_NO_SUCH_TABLE') {
      console.error('🔧 Tabela não encontrada.');
      console.error('💡 Verifique se a tabela ordem_servico existe no banco de dados.');
      console.error('💡 Verifique se o nome do banco está correto.');
    }
  }
})();
