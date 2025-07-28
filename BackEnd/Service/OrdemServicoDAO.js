// BackEnd/Service/OrdemServicoDAO.js

import conectar from "./conexao.js";
import OrdemServico from "../Model/OrdemServico.js";
import fs from 'fs/promises'; // Importa a versão com Promises da biblioteca fs
import path from 'path';
import { fileURLToPath } from 'url';
import BlingApiService from './blingApiService.js';
import { blingAuth } from '../Routers/blingRoutes.js';

// __dirname não é disponível em módulos ES6, então precisamos recriá-lo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Função utilitária para delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função utilitária para tratar datas
function toDateOrNull(val) {
    if (!val || typeof val !== 'string' || val.trim() === '') return null;
    // Regex para validar data YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return null;
    // Checagem extra: se a data é válida (ex: 2024-02-30 é inválida)
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    // Garante que o valor não seja tipo '1111-11-11' ou '11111-11-11'
    if (val.startsWith('1111') || val.startsWith('11111')) return null;
    return val;
}

// Função utilitária para parse seguro de JSON array
function parseJsonArrayOrEmpty(val) {
    if (!val || typeof val !== 'string' || val.trim() === '') return [];
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

class OrdemServicoDAO {
    constructor() {
        this.blingService = new BlingApiService(blingAuth);
    }

    async gravar(ordemServico) {
        const conexao = await conectar();
        try {
            if (!ordemServico.id) {
                // Lógica para INCLUIR uma nova OS
                const sql = `
        INSERT INTO ordem_servico (
            urgencia_id, tipo_analise_id, tipo_lacre_id, tipo_limpeza_id, tipo_transporte_id, pagamento_id,
            cliente, modeloEquipamento, numeroSerie, dataCriacao, defeitoAlegado, fabricante, etapa, arquivosAnexados,
            vendedor_id, dias_pagamento_id, data_entrega, data_aprovacao_orcamento, dias_reparo, data_equipamento_pronto,
            informacoes_confidenciais, checklist_items, agendado, possui_acessorio, tipo_transporte_texto, transporte_cif_fob,
            pedido_compras, defeito_constatado, servico_realizar, valor, etapa_id, comprovante_aprovacao, nota_fiscal
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [
        ordemServico.urgencia?.id || ordemServico.urgencia,
        ordemServico.tipoAnalise?.id || ordemServico.tipoAnalise,
        ordemServico.tipoLacre?.id || ordemServico.tipoLacre,
        ordemServico.tipoLimpeza?.id || ordemServico.tipoLimpeza,
        ordemServico.tipoTransporte?.id || ordemServico.tipoTransporte,
        ordemServico.formaPagamento?.id || ordemServico.formaPagamento,
        ordemServico.cliente?.id || ordemServico.cliente,
        ordemServico.modeloEquipamento?.id || ordemServico.modeloEquipamento,
        ordemServico.numeroSerie,
        ordemServico.dataCriacao,
        ordemServico.defeitoAlegado,
        ordemServico.fabricante?.id || ordemServico.fabricante,
        ordemServico.etapa,
        JSON.stringify(ordemServico.arquivosAnexados || []),
        ordemServico.vendedor?.id || ordemServico.vendedor,
        ordemServico.diasPagamento?.id || ordemServico.diasPagamento,
        toDateOrNull(ordemServico.dataEntrega),
        toDateOrNull(ordemServico.dataAprovacaoOrcamento),
        ordemServico.diasReparo,
        toDateOrNull(ordemServico.dataEquipamentoPronto),
        ordemServico.informacoesConfidenciais,
        JSON.stringify(ordemServico.checklistItems || []),
        ordemServico.agendado ? 1 : 0,
        ordemServico.possuiAcessorio ? 1 : 0,
        ordemServico.tipoTransporteTexto,
        ordemServico.transporteCifFob,
        ordemServico.pedidoCompras,
        ordemServico.defeitoConstatado,
        ordemServico.servicoRealizar,
        ordemServico.valor,
        ordemServico.etapaId?.id || ordemServico.etapaId,
        ordemServico.comprovanteAprovacao,
        ordemServico.notaFiscal
    ];
    const resultado = await conexao.query(sql, valores);
    ordemServico.id = resultado[0].insertId;
} else {
                // Lógica para ALTERAR uma OS existente
                const sql = `
                    UPDATE ordem_servico 
                    SET cliente = ?, modeloEquipamento = ?, defeitoAlegado = ?, 
                    numeroSerie = ?, fabricante = ?, urgencia_id = ?, tipo_analise_id = ?, 
                    tipo_lacre_id = ?, tipo_limpeza_id = ?, tipo_transporte_id = ?, pagamento_id = ?,
                    etapa = ?, arquivosAnexados = ?, vendedor_id = ?, dias_pagamento_id = ?, data_entrega = ?,
                    data_aprovacao_orcamento = ?, dias_reparo = ?, data_equipamento_pronto = ?, informacoes_confidenciais = ?,
                    checklist_items = ?, agendado = ?, possui_acessorio = ?, tipo_transporte_texto = ?, transporte_cif_fob = ?,
                    pedido_compras = ?, defeito_constatado = ?, servico_realizar = ?, valor = ?, etapa_id = ?, comprovante_aprovacao = ?, nota_fiscal = ?
                    WHERE id = ?
                `;
                const valores = [
                    ordemServico.cliente?.id || ordemServico.cliente,
                    ordemServico.modeloEquipamento?.id || ordemServico.modeloEquipamento,
                    ordemServico.defeitoAlegado,
                    ordemServico.numeroSerie,
                    ordemServico.fabricante?.id || ordemServico.fabricante,
                    ordemServico.urgencia?.id || ordemServico.urgencia,
                    ordemServico.tipoAnalise?.id || ordemServico.tipoAnalise,
                    ordemServico.tipoLacre?.id || ordemServico.tipoLacre,
                    ordemServico.tipoLimpeza?.id || ordemServico.tipoLimpeza,
                    ordemServico.tipoTransporte?.id || ordemServico.tipoTransporte,
                    ordemServico.formaPagamento?.id || ordemServico.formaPagamento,
                    ordemServico.etapa,
                    JSON.stringify(ordemServico.arquivosAnexados),
                    ordemServico.vendedor?.id || ordemServico.vendedor,
                    ordemServico.diasPagamento?.id || ordemServico.diasPagamento,
                    toDateOrNull(ordemServico.dataEntrega),
                    toDateOrNull(ordemServico.dataAprovacaoOrcamento),
                    ordemServico.diasReparo,
                    toDateOrNull(ordemServico.dataEquipamentoPronto),
                    ordemServico.informacoesConfidenciais,
                    JSON.stringify(ordemServico.checklistItems || []),
                    ordemServico.agendado ? 1 : 0,
                    ordemServico.possuiAcessorio ? 1 : 0,
                    ordemServico.tipoTransporteTexto,
                    ordemServico.transporteCifFob,
                    ordemServico.pedidoCompras,
                    ordemServico.defeitoConstatado,
                    ordemServico.servicoRealizar,
                    ordemServico.valor,
                    ordemServico.etapaId?.id || ordemServico.etapaId,
                    ordemServico.comprovanteAprovacao,
                    ordemServico.notaFiscal,
                    ordemServico.id
                ];

                await conexao.query(sql, valores);
            }
            return ordemServico;
        } catch (error) {
            console.error("Erro ao gravar Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultar(termoBusca) {
        const conexao = await conectar();
        try {
            const sql = `
                SELECT 
                    os.*,
                    m.modelo as modelo_nome,
                    f.nome_fabricante as fabricante_nome,
                    urg.urgencia,
                    ta.tipo_analise,
                    tl.tipo_lacre,
                    tLimp.tipo_limpeza,
                    tt.tipo_transporte,
                    p.pagamento,
                    u.nome as vendedor_nome,
                    dp.dias as dias_pagamento_valor,
                    eos.nome as etapa_nome
                FROM ordem_servico os
                LEFT JOIN modelo m ON os.modeloEquipamento = m.id OR os.modeloEquipamento = m.modelo
                LEFT JOIN fabricante f ON os.fabricante = f.id OR os.fabricante = f.nome_fabricante
                LEFT JOIN urgencia urg ON os.urgencia_id = urg.id
                LEFT JOIN tipo_analise ta ON os.tipo_analise_id = ta.id
                LEFT JOIN tipo_lacre tl ON os.tipo_lacre_id = tl.id
                LEFT JOIN tipo_limpeza tLimp ON os.tipo_limpeza_id = tLimp.id
                LEFT JOIN tipo_transporte tt ON os.tipo_transporte_id = tt.id
                LEFT JOIN pagamento p ON os.pagamento_id = p.id
                LEFT JOIN users u ON os.vendedor_id = u.id
                LEFT JOIN dias_pagamento dp ON os.dias_pagamento_id = dp.id
                LEFT JOIN etapa_os eos ON os.etapa_id = eos.id
                WHERE os.cliente LIKE ? OR m.modelo LIKE ? OR os.numeroSerie LIKE ?
                ORDER BY os.dataCriacao DESC
            `;
            const parametros = [`%${termoBusca}%`, `%${termoBusca}%`, `%${termoBusca}%`];
            const [registros] = await conexao.query(sql, parametros);

            const listaOrdensServico = [];
            for (const registro of registros) {
                let clienteData = { id: registro.cliente, nome: `Cliente ${registro.cliente}`, numeroDocumento: registro.cliente };
                // Se o cliente parece ser um ID numérico, buscar do Bling com delay
                if (registro.cliente && /^\d+$/.test(registro.cliente)) {
                    try {
                        const blingResponse = await this.blingService.getContato(registro.cliente);
                        if (blingResponse.success && blingResponse.data) {
                            clienteData = {
                                id: blingResponse.data.id,
                                nome: blingResponse.data.nome,
                                numeroDocumento: blingResponse.data.numeroDocumento,
                                telefone: blingResponse.data.telefone,
                                email: blingResponse.data.email,
                                tipo: blingResponse.data.tipo
                            };
                        }
                    } catch (error) {
                        console.log(`Não foi possível buscar cliente ${registro.cliente} no Bling:`, error.message);
                    }
                    // Delay de 350ms entre requisições ao Bling
                    await sleep(80);
                }
                // Retornar objeto direto em vez de usar o modelo para preservar os objetos completos
                const os = {
                    id: registro.id,
                    cliente: clienteData,
                    modeloEquipamento: registro.modelo_nome ? { 
                        id: registro.modeloEquipamento, 
                        modelo: registro.modelo_nome 
                    } : { 
                        id: registro.modeloEquipamento, 
                        modelo: registro.modeloEquipamento || `Modelo ${registro.modeloEquipamento}` 
                    },
                    defeitoAlegado: registro.defeitoAlegado,
                    numeroSerie: registro.numeroSerie,
                    fabricante: registro.fabricante_nome ? { 
                        id: registro.fabricante, 
                        nome_fabricante: registro.fabricante_nome 
                    } : { 
                        id: registro.fabricante, 
                        nome_fabricante: registro.fabricante || `Fabricante ${registro.fabricante}` 
                    },
                    urgencia: registro.urgencia_id ? { id: registro.urgencia_id, urgencia: registro.urgencia } : null,
                    tipoAnalise: registro.tipo_analise_id ? { id: registro.tipo_analise_id, tipo_analise: registro.tipo_analise } : null,
                    tipoLacre: registro.tipo_lacre_id ? { id: registro.tipo_lacre_id, tipo_lacre: registro.tipo_lacre } : null,
                    tipoLimpeza: registro.tipo_limpeza_id ? { id: registro.tipo_limpeza_id, tipo_limpeza: registro.tipo_limpeza } : null,
                    tipoTransporte: registro.tipo_transporte_id ? { id: registro.tipo_transporte_id, tipo_transporte: registro.tipo_transporte } : null,
                    formaPagamento: registro.pagamento_id ? { id: registro.pagamento_id, pagamento: registro.pagamento } : null,
                    arquivosAnexados: registro.arquivosAnexados ? JSON.parse(registro.arquivosAnexados) : [],
                    etapa: registro.etapa,
                    dataCriacao: registro.dataCriacao,
                    vendedor: registro.vendedor_id ? { id: registro.vendedor_id, nome: registro.vendedor_nome } : null,
                    diasPagamento: registro.dias_pagamento_id ? { id: registro.dias_pagamento_id, dias: registro.dias_pagamento_valor } : null,
                    dataEntrega: registro.data_entrega,
                    dataAprovacaoOrcamento: registro.data_aprovacao_orcamento,
                    diasReparo: registro.dias_reparo,
                    dataEquipamentoPronto: registro.data_equipamento_pronto,
                    informacoesConfidenciais: registro.informacoes_confidenciais,
                    checklistItems: parseJsonArrayOrEmpty(registro.checklist_items),
                    agendado: !!registro.agendado,
                    possuiAcessorio: !!registro.possui_acessorio,
                    tipoTransporteTexto: registro.tipo_transporte_texto,
                    transporteCifFob: registro.transporte_cif_fob,
                    pedidoCompras: registro.pedido_compras,
                    defeitoConstatado: registro.defeito_constatado,
                    servicoRealizar: registro.servico_realizar,
                    valor: registro.valor,
                    etapaId: registro.etapa_id ? { id: registro.etapa_id, nome: registro.etapa_nome } : null,
                    notaFiscal: registro.nota_fiscal
                };
                listaOrdensServico.push(os);
            }
            return listaOrdensServico;
        } catch (error) {
            console.error("Erro ao consultar Ordens de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultarPorId(id) {
        const conexao = await conectar();
        try {
            const sql = `
                SELECT 
                    os.*,
                    m.modelo as modelo_nome,
                    f.nome_fabricante as fabricante_nome,
                    urg.urgencia,
                    ta.tipo_analise,
                    tl.tipo_lacre,
                    tLimp.tipo_limpeza,
                    tt.tipo_transporte,
                    p.pagamento,
                    u.nome as vendedor_nome,
                    dp.dias as dias_pagamento_valor,
                    eos.nome as etapa_nome
                FROM ordem_servico os
                LEFT JOIN modelo m ON os.modeloEquipamento = m.id OR os.modeloEquipamento = m.modelo
                LEFT JOIN fabricante f ON os.fabricante = f.id OR os.fabricante = f.nome_fabricante
                LEFT JOIN urgencia urg ON os.urgencia_id = urg.id
                LEFT JOIN tipo_analise ta ON os.tipo_analise_id = ta.id
                LEFT JOIN tipo_lacre tl ON os.tipo_lacre_id = tl.id
                LEFT JOIN tipo_limpeza tLimp ON os.tipo_limpeza_id = tLimp.id
                LEFT JOIN tipo_transporte tt ON os.tipo_transporte_id = tt.id
                LEFT JOIN pagamento p ON os.pagamento_id = p.id
                LEFT JOIN users u ON os.vendedor_id = u.id
                LEFT JOIN dias_pagamento dp ON os.dias_pagamento_id = dp.id
                LEFT JOIN etapa_os eos ON os.etapa_id = eos.id
                WHERE os.id = ?
            `;
            const [registros] = await conexao.query(sql, [id]);

            if (registros.length > 0) {
                const registro = registros[0];
                // Buscar dados do cliente no Bling se for apenas um ID
                let clienteData = { 
                    id: registro.cliente, 
                    nome: `Cliente ${registro.cliente}`,
                    numeroDocumento: registro.cliente
                };
                if (registro.cliente && /^\d+$/.test(registro.cliente)) {
                    try {
                        const blingResponse = await this.blingService.getContato(registro.cliente);
                        if (blingResponse.success && blingResponse.data) {
                            clienteData = {
                                id: blingResponse.data.id,
                                nome: blingResponse.data.nome,
                                numeroDocumento: blingResponse.data.numeroDocumento,
                                telefone: blingResponse.data.telefone,
                                email: blingResponse.data.email,
                                tipo: blingResponse.data.tipo
                            };
                        }
                    } catch (error) {
                        console.log(`Não foi possível buscar cliente ${registro.cliente} no Bling:`, error.message);
                    }
                }
                const os = {
                    id: registro.id,
                    cliente: clienteData,
                    modeloEquipamento: registro.modelo_nome ? { 
                        id: registro.modeloEquipamento, 
                        modelo: registro.modelo_nome 
                    } : { 
                        id: registro.modeloEquipamento, 
                        modelo: registro.modeloEquipamento || `Modelo ${registro.modeloEquipamento}` 
                    },
                    defeitoAlegado: registro.defeitoAlegado,
                    numeroSerie: registro.numeroSerie,
                    fabricante: registro.fabricante_nome ? { 
                        id: registro.fabricante, 
                        nome_fabricante: registro.fabricante_nome 
                    } : { 
                        id: registro.fabricante, 
                        nome_fabricante: registro.fabricante || `Fabricante ${registro.fabricante}` 
                    },
                    urgencia: registro.urgencia_id ? { id: registro.urgencia_id, urgencia: registro.urgencia } : null,
                    tipoAnalise: registro.tipo_analise_id ? { id: registro.tipo_analise_id, tipo_analise: registro.tipo_analise } : null,
                    tipoLacre: registro.tipo_lacre_id ? { id: registro.tipo_lacre_id, tipo_lacre: registro.tipo_lacre } : null,
                    tipoLimpeza: registro.tipo_limpeza_id ? { id: registro.tipo_limpeza_id, tipo_limpeza: registro.tipo_limpeza } : null,
                    tipoTransporte: registro.tipo_transporte_id ? { id: registro.tipo_transporte_id, tipo_transporte: registro.tipo_transporte } : null,
                    formaPagamento: registro.pagamento_id ? { id: registro.pagamento_id, pagamento: registro.pagamento } : null,
                    arquivosAnexados: registro.arquivosAnexados ? JSON.parse(registro.arquivosAnexados) : [],
                    etapa: registro.etapa,
                    dataCriacao: registro.dataCriacao,
                    vendedor: registro.vendedor_id ? { id: registro.vendedor_id, nome: registro.vendedor_nome } : null,
                    diasPagamento: registro.dias_pagamento_id ? { id: registro.dias_pagamento_id, dias: registro.dias_pagamento_valor } : null,
                    dataEntrega: registro.data_entrega,
                    dataAprovacaoOrcamento: registro.data_aprovacao_orcamento,
                    diasReparo: registro.dias_reparo,
                    dataEquipamentoPronto: registro.data_equipamento_pronto,
                    informacoesConfidenciais: registro.informacoes_confidenciais,
                    checklistItems: parseJsonArrayOrEmpty(registro.checklist_items),
                    agendado: !!registro.agendado,
                    possuiAcessorio: !!registro.possui_acessorio,
                    tipoTransporteTexto: registro.tipo_transporte_texto,
                    transporteCifFob: registro.transporte_cif_fob,
                    pedidoCompras: registro.pedido_compras,
                    defeitoConstatado: registro.defeito_constatado,
                    servicoRealizar: registro.servico_realizar,
                    valor: registro.valor,
                    etapaId: registro.etapa_id ? { id: registro.etapa_id, nome: registro.etapa_nome } : null,
                    notaFiscal: registro.nota_fiscal
                };
                return os;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Erro ao consultar Ordem de Serviço por ID:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async excluir(osId) {
        const conexao = await conectar();
        try {
            // Primeiro, obtenha os caminhos dos arquivos para excluí-los do disco
            const os = await this.consultarPorId(osId);
            if (os) {
                // Excluir os arquivos do diretório 'uploads'
                for (const arquivo of os.arquivosAnexados) {
                    const caminhoCompleto = path.join(uploadDir, path.basename(arquivo));
                    try {
                        await fs.unlink(caminhoCompleto);
                        console.log(`Arquivo excluído com sucesso: ${caminhoCompleto}`);
                    } catch (err) {
                        console.error(`Erro ao excluir o arquivo ${caminhoCompleto}:`, err);
                    }
                }
            }
            
            // Depois, exclua o registro da OS do banco de dados
            const sql = "DELETE FROM ordem_servico WHERE id = ?";
            const resultado = await conexao.query(sql, [osId]);
            return resultado[0].affectedRows > 0; // Retorna true se a exclusão foi bem-sucedida
        } catch (error) {
            console.error("Erro ao excluir Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async anexarArquivo(osId, caminhoArquivo) {
        const conexao = await conectar();
        try {
            // Primeiro, consulte a OS para obter a lista atual de arquivos
            const os = await this.consultarPorId(osId);
            if (os) {
                // Adicione o novo arquivo à lista
                os.arquivosAnexados.push(path.basename(caminhoArquivo));
                
                // Atualize a OS no banco de dados com a nova lista de arquivos
                const sql = "UPDATE ordem_servico SET arquivosAnexados = ? WHERE id = ?";
                const valores = [JSON.stringify(os.arquivosAnexados), osId];
                await conexao.query(sql, valores);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao anexar arquivo à Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async removerArquivo(osId, nomeArquivo) {
        const conexao = await conectar();
        try {
            // Consulte a OS para obter a lista de arquivos
            const os = await this.consultarPorId(osId);
            if (os) {
                // Remova o arquivo da lista
                const novaListaArquivos = os.arquivosAnexados.filter(arquivo => arquivo !== nomeArquivo);
                
                // Exclua o arquivo do disco
                const caminhoCompleto = path.join(uploadDir, nomeArquivo);
                try {
                    await fs.unlink(caminhoCompleto);
                    console.log(`Arquivo excluído do disco: ${caminhoCompleto}`);
                } catch (err) {
                    console.error(`Erro ao excluir arquivo do disco:`, err);
                    // Decida se quer lançar o erro ou apenas logar e continuar
                }

                // Atualize a lista de arquivos no banco de dados
                const sql = "UPDATE ordem_servico SET arquivosAnexados = ? WHERE id = ?";
                const valores = [JSON.stringify(novaListaArquivos), osId];
                await conexao.query(sql, valores);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao remover arquivo da Ordem de Serviço:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }
}

export default OrdemServicoDAO;