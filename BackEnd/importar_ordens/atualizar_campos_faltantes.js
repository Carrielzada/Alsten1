// Script para atualizar os campos faltantes nas ordens de serviço importadas
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
  connectTimeout: 60000,
};

// Exibir configuração de conexão (sem a senha)
console.log('Configuração de conexão:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Função para mapear valores textuais para IDs
async function mapearValorParaId(conn, tabela, campoNome, valorTexto) {
  if (!valorTexto || valorTexto === 'Não definido' || valorTexto === '') {
    return null;
  }

  try {
    // Primeiro tenta encontrar uma correspondência exata
    const [rows] = await conn.query(
      `SELECT id FROM ${tabela} WHERE ${campoNome} = ?`,
      [valorTexto]
    );

    if (rows.length > 0) {
      return rows[0].id;
    }

    // Se não encontrar, tenta uma busca parcial
    const [rowsLike] = await conn.query(
      `SELECT id FROM ${tabela} WHERE ${campoNome} LIKE ?`,
      [`%${valorTexto}%`]
    );
    
    // Adiciona busca por palavras-chave específicas para melhorar a correspondência
    if (rowsLike.length === 0) {
      // Casos especiais por tabela
      if (tabela === 'pagamento') {
        // Caso especial para pagamentos como "30/60", "à vista", etc.
        let termo = '%parcel%';
        if (valorTexto.includes('/')) {
          termo = '%parcel%';
        } else if (valorTexto.toLowerCase().includes('vista')) {
          termo = '%vista%';
        } else if (valorTexto.toLowerCase().includes('dia')) {
          termo = '%prazo%';
        }
        
        const [rowsEspecial] = await conn.query(
          `SELECT id FROM ${tabela} WHERE ${campoNome} LIKE ?`,
          [termo]
        );
        if (rowsEspecial.length > 0) {
          return rowsEspecial[0].id;
        }
      } else if (tabela === 'dias_pagamento') {
        // Caso especial para dias de pagamento
        let termos = [];
        let params = [];
        
        if (valorTexto.includes('/')) {
          // Para "30/60"
          termos.push(`descricao LIKE ?`);
          params.push('%30%60%');
          termos.push(`descricao LIKE ?`);
          params.push('%parcel%');
        } else if (valorTexto.toLowerCase().includes('vista')) {
          // Para "à vista"
          termos.push(`descricao LIKE ?`);
          params.push('%vista%');
          termos.push(`dias = ?`);
          params.push(0);
        } else if (valorTexto.match(/\d+/)) {
          // Se contém números, busca por esses números
          const numeros = valorTexto.match(/\d+/g);
          if (numeros && numeros.length > 0) {
            numeros.forEach(num => {
              termos.push(`descricao LIKE ?`);
              params.push(`%${num}%`);
              termos.push(`dias = ?`);
              params.push(parseInt(num));
            });
          }
        }
        
        if (termos.length > 0) {
          const [rowsEspecial] = await conn.query(
            `SELECT id FROM dias_pagamento WHERE ${termos.join(' OR ')}`,
            params
          );
          if (rowsEspecial.length > 0) {
            return rowsEspecial[0].id;
          }
        }
      } else if (tabela === 'urgencia') {
        // Caso especial para urgência
        let termo = '';
        if (valorTexto.toLowerCase().includes('urgent')) {
          termo = '%urgent%';
        } else if (valorTexto.toLowerCase().includes('emerg')) {
          termo = '%emerg%';
        } else if (valorTexto.toLowerCase().includes('normal')) {
          termo = '%normal%';
        } else if (valorTexto.toLowerCase().includes('baixa')) {
          termo = '%baixa%';
        }
        
        if (termo) {
          const [rowsEspecial] = await conn.query(
            `SELECT id FROM ${tabela} WHERE ${campoNome} LIKE ?`,
            [termo]
          );
          if (rowsEspecial.length > 0) {
            return rowsEspecial[0].id;
          }
        }
      } else if (tabela === 'tipo_transporte') {
        // Caso especial para tipo de transporte
        let termo = '';
        if (valorTexto.toLowerCase().includes('motoboy')) {
          termo = '%motoboy%';
        } else if (valorTexto.toLowerCase().includes('correio')) {
          termo = '%correio%';
        } else if (valorTexto.toLowerCase().includes('transport')) {
          termo = '%transport%';
        } else if (valorTexto.toLowerCase() === 'cif' || valorTexto.toLowerCase() === 'fob') {
          // Buscar qualquer tipo de transporte, já que CIF/FOB são condições e não tipos
          const [rowsQualquer] = await conn.query(`SELECT id FROM ${tabela} LIMIT 1`);
          if (rowsQualquer.length > 0) {
            return rowsQualquer[0].id;
          }
        }
        
        if (termo) {
          const [rowsEspecial] = await conn.query(
            `SELECT id FROM ${tabela} WHERE ${campoNome} LIKE ?`,
            [termo]
          );
          if (rowsEspecial.length > 0) {
            return rowsEspecial[0].id;
          }
        }
      } else if (tabela === 'tipo_lacre') {
        // Caso especial para tipo de lacre
        let termo = '';
        if (valorTexto.toLowerCase().includes('neutro')) {
          termo = '%neutro%';
        } else if (valorTexto.toLowerCase().includes('alsten')) {
          termo = '%alsten%';
        } else if (valorTexto.toLowerCase().includes('client')) {
          termo = '%client%';
        }
        
        if (termo) {
          const [rowsEspecial] = await conn.query(
            `SELECT id FROM ${tabela} WHERE ${campoNome} LIKE ?`,
            [termo]
          );
          if (rowsEspecial.length > 0) {
            return rowsEspecial[0].id;
          }
        }
      }
    }

    if (rowsLike.length > 0) {
      return rowsLike[0].id;
    }

    console.log(`Valor não encontrado: ${valorTexto} na tabela ${tabela}`);
    return null;
  } catch (error) {
    console.error(`Erro ao mapear valor para ID: ${error.message}`);
    return null;
  }
}

// Função principal
async function atualizarCamposFaltantes() {
  const pool = mysql.createPool(dbConfig);
  const conn = await pool.getConnection();
  
  try {
    console.log('✅ Conectado ao banco de dados');
    
    // Buscar todas as ordens de serviço importadas
    const [ordensServico] = await conn.query(
      'SELECT * FROM ordem_servico WHERE urgencia_id IS NULL OR vendedor_id IS NULL OR pagamento_id IS NULL OR tipo_lacre_id IS NULL OR tipo_limpeza_id IS NULL OR tipo_transporte_id IS NULL OR dias_pagamento_id IS NULL OR tipo_analise_id IS NULL'
    );
    
    console.log(`📋 Total de registros para atualizar: ${ordensServico.length}`);
    
    let atualizados = 0;
    let erros = 0;
    
    for (const os of ordensServico) {
      try {
        // Mapear valores textuais para IDs
        const updates = {};
        
        // Mapear urgência
        if (os.etapa && !os.urgencia_id) {
          // Valores comuns de urgência na planilha
          if (os.etapa.includes('Urgente')) {
            updates.urgencia_id = await mapearValorParaId(conn, 'urgencia', 'urgencia', 'Urgente');
          } else if (os.etapa.includes('Emergência')) {
            updates.urgencia_id = await mapearValorParaId(conn, 'urgencia', 'urgencia', 'Emergência');
          } else if (os.etapa.includes('Normal')) {
            updates.urgencia_id = await mapearValorParaId(conn, 'urgencia', 'urgencia', 'Normal');
          }
        }
        
        // Mapear vendedor
        if (!os.vendedor_id && os.etapa) {
          // Extrair nome do vendedor do campo etapa ou de outro campo
          const vendedorMatch = os.etapa.match(/vendedor:\s*([^,]+)/i);
          if (vendedorMatch && vendedorMatch[1]) {
            updates.vendedor_id = await mapearValorParaId(conn, 'users', 'nome', vendedorMatch[1].trim());
          }
          
          // Tentar encontrar o vendedor Alessandro que aparece nos exemplos
          if (!updates.vendedor_id) {
            updates.vendedor_id = await mapearValorParaId(conn, 'users', 'nome', 'Alessandro de Castro Nascimento');
          }
        }
        
        // Mapear pagamento
        if (!os.pagamento_id && os.etapa) {
          // Extrair forma de pagamento do campo etapa ou de outro campo
          const pagamentoMatch = os.etapa.match(/pagamento:\s*([^,]+)/i);
          if (pagamentoMatch && pagamentoMatch[1]) {
            updates.pagamento_id = await mapearValorParaId(conn, 'pagamento', 'pagamento', pagamentoMatch[1].trim());
          }
          
          // Verificar valores comuns como "30/60"
          if (!updates.pagamento_id && os.etapa.includes('30/60')) {
            updates.pagamento_id = await mapearValorParaId(conn, 'pagamento', 'pagamento', 'Parcelado');
          }
        }
        
        // Mapear tipo de lacre
        if (!os.tipo_lacre_id && os.etapa) {
          // Extrair tipo de lacre do campo etapa
          const lacreMatch = os.etapa.match(/lacre:\s*([^,]+)/i);
          if (lacreMatch && lacreMatch[1]) {
            updates.tipo_lacre_id = await mapearValorParaId(conn, 'tipo_lacre', 'tipo_lacre', lacreMatch[1].trim());
          }
          
          // Verificar valores comuns como "Neutro" ou "Alsten"
          if (!updates.tipo_lacre_id) {
            if (os.etapa.includes('Neutro')) {
              updates.tipo_lacre_id = await mapearValorParaId(conn, 'tipo_lacre', 'tipo_lacre', 'Neutro');
            } else if (os.etapa.includes('Alsten')) {
              updates.tipo_lacre_id = await mapearValorParaId(conn, 'tipo_lacre', 'tipo_lacre', 'Alsten');
            }
          }
        }
        
        // Mapear tipo de limpeza
        if (!os.tipo_limpeza_id) {
          // Usar um valor padrão para tipo de limpeza
          updates.tipo_limpeza_id = await mapearValorParaId(conn, 'tipo_limpeza', 'tipo_limpeza', 'Limpeza Básica');
        }
        
        // Mapear tipo de transporte
        if (!os.tipo_transporte_id && os.etapa) {
          // Extrair tipo de transporte do campo etapa
          const transporteMatch = os.etapa.match(/transporte:\s*([^,]+)/i);
          if (transporteMatch && transporteMatch[1]) {
            updates.tipo_transporte_id = await mapearValorParaId(conn, 'tipo_transporte', 'tipo_transporte', transporteMatch[1].trim());
          }
          
          // Verificar valores comuns como "MOTOBOY"
          if (!updates.tipo_transporte_id) {
            if (os.tipo_transporte_texto === 'MOTOBOY') {
              updates.tipo_transporte_id = await mapearValorParaId(conn, 'tipo_transporte', 'tipo_transporte', 'Motoboy');
            } else if (os.tipo_transporte_texto) {
              updates.tipo_transporte_id = await mapearValorParaId(conn, 'tipo_transporte', 'tipo_transporte', os.tipo_transporte_texto);
            }
          }
        }
        
        // Mapear dias de pagamento
        if (!os.dias_pagamento_id && os.etapa) {
          // Extrair dias de pagamento do campo etapa
          const diasPagamentoMatch = os.etapa.match(/(\d+\/\d+)/i);
          if (diasPagamentoMatch && diasPagamentoMatch[1]) {
            const diasTexto = diasPagamentoMatch[1].trim();
            if (diasTexto === '30/60') {
              updates.dias_pagamento_id = await mapearValorParaId(conn, 'dias_pagamento', 'descricao', 'Para 30 dias');
            }
          }
          
          // Se não encontrou, tentar outros padrões
          if (!updates.dias_pagamento_id) {
            if (os.etapa.includes('à vista') || os.etapa.includes('avista')) {
              updates.dias_pagamento_id = await mapearValorParaId(conn, 'dias_pagamento', 'descricao', 'À vista');
            }
          }
        }
        
        // Mapear tipo de análise
        if (!os.tipo_analise_id) {
          // Verificar se há menção de análise no serviço a realizar ou defeito constatado
          let tipoAnaliseEncontrado = false;
          
          if (os.servico_realizar) {
            const servicoLower = os.servico_realizar.toLowerCase();
            if (servicoLower.includes('análise') || servicoLower.includes('analise') || 
                servicoLower.includes('diagnóstico') || servicoLower.includes('diagnostico') || 
                servicoLower.includes('teste')) {
              updates.tipo_analise_id = await mapearValorParaId(conn, 'tipo_analise', 'tipo_analise', 'Análise Padrão');
              tipoAnaliseEncontrado = true;
            }
          }
          
          if (!tipoAnaliseEncontrado && os.defeito_constatado) {
            const defeitoLower = os.defeito_constatado.toLowerCase();
            if (defeitoLower.includes('análise') || defeitoLower.includes('analise') || 
                defeitoLower.includes('diagnóstico') || defeitoLower.includes('diagnostico')) {
              updates.tipo_analise_id = await mapearValorParaId(conn, 'tipo_analise', 'tipo_analise', 'Análise Padrão');
              tipoAnaliseEncontrado = true;
            }
          }
          
          // Se ainda não encontrou, usar um valor padrão
          if (!tipoAnaliseEncontrado) {
            // Buscar o primeiro tipo de análise disponível
            const [tiposAnalise] = await conn.query('SELECT id FROM tipo_analise LIMIT 1');
            if (tiposAnalise.length > 0) {
              updates.tipo_analise_id = tiposAnalise[0].id;
            }
          }
        }
        
        // Se houver atualizações, aplicá-las
        if (Object.keys(updates).length > 0) {
          const setClauses = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
          
          const values = Object.values(updates);
          values.push(os.id);
          
          await conn.query(
            `UPDATE ordem_servico SET ${setClauses} WHERE id = ?`,
            values
          );
          
          atualizados++;
          console.log(`✅ OS ${os.id} atualizada com sucesso`);
        }
      } catch (error) {
        erros++;
        console.error(`❌ Erro ao atualizar OS ${os.id}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Resumo da operação:`);
    console.log(`📋 Total de registros processados: ${ordensServico.length}`);
    console.log(`✅ Registros atualizados com sucesso: ${atualizados}`);
    console.log(`❌ Erros: ${erros}`);
    
  } catch (error) {
    console.error(`❌ Erro geral: ${error.message}`);
  } finally {
    conn.release();
    await pool.end();
    console.log('🔌 Conexão com o banco de dados encerrada');
  }
}

// Executar a função principal
atualizarCamposFaltantes().catch(console.error);