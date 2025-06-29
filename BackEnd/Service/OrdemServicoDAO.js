// BackEnd/Service/OrdemServicoDAO.js

import conectar from "./conexao.js";
import OrdemServico from "../Model/OrdemServico.js";
import fs from 'fs/promises'; // Importa a versão com Promises da biblioteca fs
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname não é disponível em módulos ES6, então precisamos recriá-lo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

class OrdemServicoDAO {
    async gravar(ordemServico) {
        if (ordemServico instanceof OrdemServico) {
            const conexao = await conectar();
            try {
                if (!ordemServico.id) {
                    // Lógica para INCLUIR uma nova OS
                    const sql = `
                        INSERT INTO ordens_servico 
                        (cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, 
                        urgencia_id, tipo_analise_id, tipo_lacre_id, tipo_limpeza_id, tipo_transporte_id, pagamento_id,
                        etapa, dataCriacao, arquivosAnexados)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const valores = [
                        ordemServico.cliente,
                        ordemServico.modeloEquipamento,
                        ordemServico.defeitoAlegado,
                        ordemServico.numeroSerie,
                        ordemServico.fabricante,
                        ordemServico.urgencia?.id, // Use o operador ?. para evitar erros se a propriedade for nula
                        ordemServico.tipoAnalise?.id,
                        ordemServico.tipoLacre?.id,
                        ordemServico.tipoLimpeza?.id,
                        ordemServico.tipoTransporte?.id,
                        ordemServico.formaPagamento?.id,
                        ordemServico.etapa,
                        ordemServico.dataCriacao,
                        JSON.stringify(ordemServico.arquivosAnexados)
                    ];
                    const resultado = await conexao.query(sql, valores);
                    ordemServico.id = resultado[0].insertId;
                } else {
                    // Lógica para ALTERAR uma OS existente
                    const sql = `
                        UPDATE ordens_servico 
                        SET cliente = ?, modeloEquipamento = ?, defeitoAlegado = ?, 
                        numeroSerie = ?, fabricante = ?, urgencia_id = ?, tipo_analise_id = ?, 
                        tipo_lacre_id = ?, tipo_limpeza_id = ?, tipo_transporte_id = ?, pagamento_id = ?,
                        etapa = ?, arquivosAnexados = ?
                        WHERE id = ?
                    `;
                    const valores = [
                        ordemServico.cliente,
                        ordemServico.modeloEquipamento,
                        ordemServico.defeitoAlegado,
                        ordemServico.numeroSerie,
                        ordemServico.fabricante,
                        ordemServico.urgencia?.id,
                        ordemServico.tipoAnalise?.id,
                        ordemServico.tipoLacre?.id,
                        ordemServico.tipoLimpeza?.id,
                        ordemServico.tipoTransporte?.id,
                        ordemServico.formaPagamento?.id,
                        ordemServico.etapa,
                        JSON.stringify(ordemServico.arquivosAnexados),
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
    }

    async consultar(termoBusca) {
        const conexao = await conectar();
        try {
            const sql = `
                SELECT 
                    os.*,
                    urg.urgencia,
                    ta.tipo_analise,
                    tl.tipo_lacre,
                    tLimp.tipo_limpeza,
                    tt.tipo_transporte,
                    p.pagamento
                FROM ordens_servico os
                LEFT JOIN urgencia urg ON os.urgencia_id = urg.id
                LEFT JOIN tipo_analise ta ON os.tipo_analise_id = ta.id
                LEFT JOIN tipo_lacre tl ON os.tipo_lacre_id = tl.id
                LEFT JOIN tipo_limpeza tLimp ON os.tipo_limpeza_id = tLimp.id
                LEFT JOIN tipo_transporte tt ON os.tipo_transporte_id = tt.id
                LEFT JOIN pagamento p ON os.pagamento_id = p.id
                WHERE os.cliente LIKE ? OR os.modeloEquipamento LIKE ? OR os.numeroSerie LIKE ?
                ORDER BY os.dataCriacao DESC
            `;
            const parametros = [`%${termoBusca}%`, `%${termoBusca}%`, `%${termoBusca}%`];
            const [registros] = await conexao.query(sql, parametros);

            const listaOrdensServico = [];
            for (const registro of registros) {
                const os = new OrdemServico(
                    registro.id,
                    registro.cliente,
                    registro.modeloEquipamento,
                    registro.defeitoAlegado,
                    registro.numeroSerie,
                    registro.fabricante,
                    // Novos campos aninhados, checando se existem
                    registro.urgencia_id ? { id: registro.urgencia_id, urgencia: registro.urgencia } : null,
                    registro.tipo_analise_id ? { id: registro.tipo_analise_id, tipoAnalise: registro.tipo_analise } : null,
                    registro.tipo_lacre_id ? { id: registro.tipo_lacre_id, tipoLacre: registro.tipo_lacre } : null,
                    registro.tipo_limpeza_id ? { id: registro.tipo_limpeza_id, tipoLimpeza: registro.tipo_limpeza } : null,
                    registro.tipo_transporte_id ? { id: registro.tipo_transporte_id, tipoTransporte: registro.tipo_transporte } : null,
                    registro.pagamento_id ? { id: registro.pagamento_id, pagamento: registro.pagamento } : null,
                    registro.arquivosAnexados ? JSON.parse(registro.arquivosAnexados) : [],
                    registro.etapa,
                    registro.dataCriacao
                );
                listaOrdensServico.push(os.toJSON());
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
                    urg.urgencia,
                    ta.tipo_analise,
                    tl.tipo_lacre,
                    tLimp.tipo_limpeza,
                    tt.tipo_transporte,
                    p.pagamento
                FROM ordens_servico os
                LEFT JOIN urgencia urg ON os.urgencia_id = urg.id
                LEFT JOIN tipo_analise ta ON os.tipo_analise_id = ta.id
                LEFT JOIN tipo_lacre tl ON os.tipo_lacre_id = tl.id
                LEFT JOIN tipo_limpeza tLimp ON os.tipo_limpeza_id = tLimp.id
                LEFT JOIN tipo_transporte tt ON os.tipo_transporte_id = tt.id
                LEFT JOIN pagamento p ON os.pagamento_id = p.id
                WHERE os.id = ?
            `;
            const [registros] = await conexao.query(sql, [id]);

            if (registros.length > 0) {
                const registro = registros[0];
                const os = new OrdemServico(
                    registro.id,
                    registro.cliente,
                    registro.modeloEquipamento,
                    registro.defeitoAlegado,
                    registro.numeroSerie,
                    registro.fabricante,
                    registro.urgencia_id ? { id: registro.urgencia_id, urgencia: registro.urgencia } : null,
                    registro.tipo_analise_id ? { id: registro.tipo_analise_id, tipoAnalise: registro.tipo_analise } : null,
                    registro.tipo_lacre_id ? { id: registro.tipo_lacre_id, tipoLacre: registro.tipo_lacre } : null,
                    registro.tipo_limpeza_id ? { id: registro.tipo_limpeza_id, tipoLimpeza: registro.tipo_limpeza } : null,
                    registro.tipo_transporte_id ? { id: registro.tipo_transporte_id, tipoTransporte: registro.tipo_transporte } : null,
                    registro.pagamento_id ? { id: registro.pagamento_id, pagamento: registro.pagamento } : null,
                    registro.arquivosAnexados ? JSON.parse(registro.arquivosAnexados) : [],
                    registro.etapa,
                    registro.dataCriacao
                );
                return os.toJSON();
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
            const sql = "DELETE FROM ordens_servico WHERE id = ?";
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
                const sql = "UPDATE ordens_servico SET arquivosAnexados = ? WHERE id = ?";
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
                const sql = "UPDATE ordens_servico SET arquivosAnexados = ? WHERE id = ?";
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