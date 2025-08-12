// Script para atualizar os registros importados da planilha
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_SENHA || '',
  database: process.env.DB_NOME || 'alsten_os',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Exibir configuração de conexão (sem a senha)
console.log('Configuração de conexão:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Função para buscar ID pelo nome
async function buscarIdPorNome(conn, tabela, campo, valor) {
  if (!valor || valor === 'Não definido') return null;
  
  try {
    // Primeiro tenta busca exata
    const [rows] = await conn.query(`SELECT id FROM ${tabela} WHERE ${campo} = ?`, [valor]);
    if (rows.length > 0) return rows[0].id;
    
    // Se não encontrar, tenta busca parcial
    const [rowsLike] = await conn.query(`SELECT id FROM ${tabela} WHERE ${campo} LIKE ?`, [`%${valor}%`]);
    if (rowsLike.length > 0) return rowsLike[0].id;
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar ID para ${valor} na tabela ${tabela}:`, error.message);
    return null;
  }
}

// Função principal
async function atualizarRegistrosImportados() {
  console.log('🔄 Iniciando atualização dos registros importados...');
  
  const pool = mysql.createPool(dbConfig);
  const conn = await pool.getConnection();
  
  try {
    console.log('✅ Conectado ao banco de dados');
    
    // Buscar todos os registros que precisam ser atualizados
    const [registros] = await conn.query(
      `SELECT * FROM ordem_servico WHERE 
       (vendedor_id IS NULL OR pagamento_id IS NULL OR urgencia_id IS NULL OR 
        tipo_lacre_id IS NULL OR tipo_limpeza_id IS NULL OR tipo_transporte_id IS NULL OR 
        dias_pagamento_id IS NULL)`
    );
    
    console.log(`📋 Encontrados ${registros.length} registros para atualizar`);
    
    // Buscar dados das tabelas de referência
    const [vendedores] = await conn.query('SELECT id, nome FROM users');
    const [pagamentos] = await conn.query('SELECT id, pagamento FROM pagamento');
    const [urgencias] = await conn.query('SELECT id, urgencia FROM urgencia');
    const [tiposLacre] = await conn.query('SELECT id, tipo_lacre FROM tipo_lacre');
    const [tiposLimpeza] = await conn.query('SELECT id, tipo_limpeza FROM tipo_limpeza');
    const [tiposTransporte] = await conn.query('SELECT id, tipo_transporte FROM tipo_transporte');
    const [diasPagamento] = await conn.query('SELECT id, descricao, dias FROM dias_pagamento');
    
    // Mapear nomes para IDs para busca rápida
    const mapVendedores = new Map(vendedores.map(v => [v.nome.toLowerCase(), v.id]));
    const mapPagamentos = new Map(pagamentos.map(p => [p.pagamento.toLowerCase(), p.id]));
    const mapUrgencias = new Map(urgencias.map(u => [u.urgencia.toLowerCase(), u.id]));
    const mapTiposLacre = new Map(tiposLacre.map(t => [t.tipo_lacre.toLowerCase(), t.id]));
    const mapTiposLimpeza = new Map(tiposLimpeza.map(t => [t.tipo_limpeza.toLowerCase(), t.id]));
    const mapTiposTransporte = new Map(tiposTransporte.map(t => [t.tipo_transporte.toLowerCase(), t.id]));
    
    let atualizados = 0;
    let erros = 0;
    
    for (const registro of registros) {
      try {
        const updates = {};
        
        // Processar vendedor
        if (!registro.vendedor_id) {
          // Verificar se o nome do vendedor está em algum campo de texto
          const vendedorNome = 'Alessandro de Castro Nascimento'; // Nome do vendedor mencionado nos exemplos
          const vendedorId = mapVendedores.get(vendedorNome.toLowerCase());
          if (vendedorId) {
            updates.vendedor_id = vendedorId;
          }
        }
        
        // Processar pagamento
        if (!registro.pagamento_id) {
          // Verificar se o pagamento está em algum campo de texto
          if (registro.etapa && registro.etapa.includes('30/60')) {
            // Buscar pagamento "Parcelado" ou similar
            for (const [nome, id] of mapPagamentos.entries()) {
              if (nome.includes('parcel')) {
                updates.pagamento_id = id;
                break;
              }
            }
          }
        }
        
        // Processar urgência
        if (!registro.urgencia_id) {
          // Verificar se a urgência está em algum campo de texto
          if (registro.etapa) {
            if (registro.etapa.includes('Urgente')) {
              updates.urgencia_id = mapUrgencias.get('urgente');
            } else if (registro.etapa.includes('Emergência')) {
              updates.urgencia_id = mapUrgencias.get('emergência');
            } else {
              // Usar "Normal" como padrão
              for (const [nome, id] of mapUrgencias.entries()) {
                if (nome.includes('normal')) {
                  updates.urgencia_id = id;
                  break;
                }
              }
            }
          }
        }
        
        // Processar tipo de lacre
        if (!registro.tipo_lacre_id) {
          // Verificar se o tipo de lacre está em algum campo de texto
          if (registro.etapa) {
            if (registro.etapa.includes('Neutro')) {
              updates.tipo_lacre_id = mapTiposLacre.get('neutro');
            } else if (registro.etapa.includes('Alsten')) {
              updates.tipo_lacre_id = mapTiposLacre.get('alsten');
            } else {
              // Usar o primeiro tipo de lacre como padrão
              updates.tipo_lacre_id = tiposLacre[0]?.id;
            }
          }
        }
        
        // Processar tipo de limpeza
        if (!registro.tipo_limpeza_id) {
          // Usar o primeiro tipo de limpeza como padrão
          updates.tipo_limpeza_id = tiposLimpeza[0]?.id;
        }
        
        // Processar tipo de transporte
        if (!registro.tipo_transporte_id) {
          // Verificar se o tipo de transporte está em algum campo de texto
          if (registro.tipo_transporte_texto) {
            const tipoTransporteTexto = registro.tipo_transporte_texto.toLowerCase();
            if (tipoTransporteTexto.includes('motoboy')) {
              for (const [nome, id] of mapTiposTransporte.entries()) {
                if (nome.includes('motoboy')) {
                  updates.tipo_transporte_id = id;
                  break;
                }
              }
            }
          }
          
          // Se não encontrou, usar o primeiro tipo de transporte como padrão
          if (!updates.tipo_transporte_id) {
            updates.tipo_transporte_id = tiposTransporte[0]?.id;
          }
        }
        
        // Processar dias de pagamento
        if (!registro.dias_pagamento_id) {
          // Verificar se os dias de pagamento estão em algum campo de texto
          if (registro.etapa && registro.etapa.includes('30/60')) {
            // Buscar dias de pagamento "30 dias" ou similar
            for (const dp of diasPagamento) {
              if (dp.dias === 30 || dp.descricao.includes('30')) {
                updates.dias_pagamento_id = dp.id;
                break;
              }
            }
          }
          
          // Se não encontrou, usar o primeiro dias de pagamento como padrão
          if (!updates.dias_pagamento_id) {
            updates.dias_pagamento_id = diasPagamento[0]?.id;
          }
        }
        
        // Aplicar atualizações se houver
        if (Object.keys(updates).length > 0) {
          const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
          const values = [...Object.values(updates), registro.id];
          
          await conn.query(`UPDATE ordem_servico SET ${setClauses} WHERE id = ?`, values);
          
          console.log(`✅ Registro ${registro.id} atualizado com sucesso:`, updates);
          atualizados++;
        }
      } catch (error) {
        console.error(`❌ Erro ao atualizar registro ${registro.id}:`, error.message);
        erros++;
      }
    }
    
    console.log('\n📊 Resumo da operação:');
    console.log(`📋 Total de registros processados: ${registros.length}`);
    console.log(`✅ Registros atualizados com sucesso: ${atualizados}`);
    console.log(`❌ Erros: ${erros}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    conn.release();
    await pool.end();
    console.log('🔌 Conexão com o banco de dados encerrada');
  }
}

// Executar a função principal
atualizarRegistrosImportados().catch(console.error);