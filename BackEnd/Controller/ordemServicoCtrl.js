import OrdemServico from "../Model/OrdemServico.js";
import OrdemServicoDAO from "../Service/OrdemServicoDAO.js";
import OrdemServicoLogDAO from "../Service/OrdemServicoLogDAO.js";
import upload from '../Service/uploadService.js'; // Importa o middleware de upload
import { criarLock, verificarLock, removerLock } from '../Service/OrdemServicoLockService.js';

class OrdemServicoCtrl {
    constructor() {
        this.gravar = this.gravar.bind(this);
        this.consultar = this.consultar.bind(this);
        this.consultarPorId = this.consultarPorId.bind(this);
        this.excluir = this.excluir.bind(this);
        this.anexarArquivo = this.anexarArquivo.bind(this);
        this.removerArquivo = this.removerArquivo.bind(this);
        this.consultarLogs = this.consultarLogs.bind(this);
        this.registrarLogsAlteracoes = this.registrarLogsAlteracoes.bind(this);
    }

    async gravar(req, res) {
        console.log('=== MÉTODO GRAVAR CHAMADO ===');
        console.log('Método HTTP:', req.method);
        console.log('Body:', req.body);
        
        res.type("application/json");
        if ((req.method === "POST" || req.method === "PUT") && req.is("application/json")) {
            const { 
                id, cliente, modeloEquipamento, defeitoAlegado, numeroSerie, 
                fabricante, urgencia, tipoAnalise, tipoLacre, tipoLimpeza, 
                tipoTransporte, formaPagamento, arquivosAnexados, etapa,
                vendedor, diasPagamento, dataEntrega, dataAprovacaoOrcamento,
                diasReparo, dataEquipamentoPronto, informacoesConfidenciais,
                checklistItems, agendado, possuiAcessorio, tipoTransporteTexto,
                transporteCifFob, pedidoCompras, defeitoConstatado, servicoRealizar,
                valor, etapaId, comprovanteAprovacao, notaFiscal
            } = req.body;

            // Para PUT, usar o ID da URL se não estiver no body
            const osId = req.method === "PUT" ? req.params.id : id;

            if (cliente && modeloEquipamento && defeitoAlegado) {
                const os = new OrdemServico(
                    osId, 
                    cliente, 
                    modeloEquipamento, 
                    defeitoAlegado, 
                    numeroSerie, 
                    fabricante, 
                    urgencia,
                    tipoAnalise,
                    tipoLacre,
                    tipoLimpeza,
                    tipoTransporte,
                    formaPagamento,
                    arquivosAnexados,
                    etapa,
                    undefined, // dataCriacao
                    vendedor,
                    diasPagamento,
                    dataEntrega,
                    dataAprovacaoOrcamento,
                    diasReparo,
                    dataEquipamentoPronto,
                    informacoesConfidenciais,
                    checklistItems,
                    agendado,
                    possuiAcessorio,
                    tipoTransporteTexto,
                    transporteCifFob,
                    pedidoCompras,
                    defeitoConstatado,
                    servicoRealizar,
                    valor,
                    etapaId,
                    comprovanteAprovacao,
                    notaFiscal
                );

                const osDAO = new OrdemServicoDAO();
                const logDAO = new OrdemServicoLogDAO();
                
                try {
                    // Se for uma atualização, buscar dados antigos para comparação
                    let dadosAntigos = null;
                    if (req.method === "PUT" && osId) {
                        dadosAntigos = await osDAO.consultarPorId(osId);
                    }

                    await osDAO.gravar(os);

                    // Registrar logs de auditoria para atualizações
                    if (req.method === "PUT" && dadosAntigos) {
                        const usuarioId = req.user?.id;
                        console.log('Dados antigos para comparação:', dadosAntigos);
                        console.log('Dados novos para comparação:', os);
                        await this.registrarLogsAlteracoes(dadosAntigos, os, usuarioId, logDAO);
                    }

                    if (osId) {
                        res.status(200).json({
                            status: true,
                            mensagem: "Ordem de Serviço atualizada com sucesso!",
                            os_id: os.id
                        });
                    } else {
                        res.status(201).json({
                            status: true,
                            mensagem: "Ordem de Serviço cadastrada com sucesso!",
                            os_id: os.id
                        });
                    }
                } catch (erro) {
                    res.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar a Ordem de Serviço: " + erro.message,
                    });
                }
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: "Informe os dados obrigatórios da Ordem de Serviço (Cliente, Modelo, Defeito Alegado).",
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido ou formato JSON não fornecido para cadastrar Ordem de Serviço.",
            });
        }
    }

    async consultar(req, res) {
        res.type("application/json");
        if (req.method === "GET") {
            const osDAO = new OrdemServicoDAO();
            try {
                const termoBusca = req.query.termo || "";
                const listaOrdensServico = await osDAO.consultar(termoBusca);
                res.status(200).json({
                    status: true,
                    listaOrdensServico
                });
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar Ordens de Serviço: " + erro.message,
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido para consultar Ordens de Serviço.",
            });
        }
    }

    async consultarPorId(req, res) {
        res.type("application/json");
        const osDAO = new OrdemServicoDAO();
        const id = req.params.id;
        try {
            const os = await osDAO.consultarPorId(id);
            if (os) {
                res.status(200).json(os);
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Ordem de Serviço não encontrada.",
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                mensagem: "Erro ao consultar Ordem de Serviço por ID: " + error.message,
            });
        }
    }

    async excluir(req, res) {
        res.type("application/json");
        if (req.method === "DELETE") {
            const osDAO = new OrdemServicoDAO();
            const id = req.params.id;
            try {
                const sucesso = await osDAO.excluir(id);
                if (sucesso) {
                    res.status(200).json({
                        status: true,
                        mensagem: "Ordem de Serviço excluída com sucesso.",
                    });
                } else {
                    res.status(404).json({
                        status: false,
                        mensagem: "Ordem de Serviço não encontrada para exclusão.",
                    });
                }
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao excluir a Ordem de Serviço: " + erro.message,
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido para exclusão.",
            });
        }
    }

    async anexarArquivo(req, res) {
        res.type("application/json");
        const osDAO = new OrdemServicoDAO();
        const osId = req.params.id;

        // Usa o middleware de upload 'single' para um único arquivo com o nome do campo 'arquivo'
        upload.single('arquivo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Erro no upload do arquivo: " + err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Nenhum arquivo enviado."
                });
            }

            try {
                const caminhoArquivo = req.file.path;
                const sucesso = await osDAO.anexarArquivo(osId, caminhoArquivo);
                if (sucesso) {
                    res.status(200).json({
                        status: true,
                        mensagem: "Arquivo anexado com sucesso!",
                        caminho: req.file.filename // Retorna o nome do arquivo no servidor
                    });
                } else {
                    res.status(404).json({
                        status: false,
                        mensagem: "Ordem de Serviço não encontrada para anexar o arquivo."
                    });
                }
            } catch (error) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao anexar arquivo: " + error.message,
                });
            }
        });
    }

    async removerArquivo(req, res) {
        res.type("application/json");
        if (req.method === "DELETE") {
            const osDAO = new OrdemServicoDAO();
            const { id: osId, nomeArquivo } = req.params;
            
            if (!nomeArquivo) {
                return res.status(400).json({
                    status: false,
                    mensagem: "O nome do arquivo a ser removido não foi fornecido."
                });
            }
            
            try {
                const sucesso = await osDAO.removerArquivo(osId, nomeArquivo);
                if (sucesso) {
                    res.status(200).json({
                        status: true,
                        mensagem: "Arquivo removido com sucesso!"
                    });
                } else {
                    res.status(404).json({
                        status: false,
                        mensagem: "Ordem de Serviço ou arquivo não encontrado."
                    });
                }
            } catch (error) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao remover arquivo: " + error.message,
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido."
            });
        }
    }

    async consultarLogs(req, res) {
        res.type("application/json");
        const logDAO = new OrdemServicoLogDAO();
        const osId = req.params.id;
        try {
            const logs = await logDAO.consultarLogsPorOsId(osId);
            
            res.status(200).json({
                status: true,
                logs: logs
            });
        } catch (error) {
            console.error('Erro ao consultar logs:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro ao consultar logs da Ordem de Serviço: " + error.message,
            });
        }
    }

    // --- LOCK DE EDIÇÃO CONCORRENTE ---
    async criarLock(req, res) {
        const osId = req.params.id;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ status: false, mensagem: 'Usuário não autenticado!' });
        const ok = criarLock(osId, userId);
        if (ok) {
            res.json({ status: true, mensagem: 'Lock adquirido com sucesso!' });
        } else {
            const lock = verificarLock(osId);
            res.status(409).json({ status: false, mensagem: 'OS já está sendo editada por outro usuário!', lock });
        }
    }

    async verificarLock(req, res) {
        const osId = req.params.id;
        const lock = verificarLock(osId);
        if (!lock) {
            res.json({ status: false, livre: true });
        } else {
            res.json({ status: true, livre: false, lock });
        }
    }

    async removerLock(req, res) {
        const osId = req.params.id;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ status: false, mensagem: 'Usuário não autenticado!' });
        const ok = removerLock(osId, userId);
        if (ok) {
            res.json({ status: true, mensagem: 'Lock removido com sucesso!' });
        } else {
            res.status(403).json({ status: false, mensagem: 'Você não possui o lock desta OS.' });
        }
    }

    // Método auxiliar para registrar logs de alterações
    async registrarLogsAlteracoes(dadosAntigos, dadosNovos, usuarioId, logDAO) {
        const camposParaMonitorar = [
            'cliente', 'modeloEquipamento', 'defeitoAlegado', 'numeroSerie', 
            'fabricante', 'urgencia', 'tipoAnalise', 'tipoLacre', 'tipoLimpeza', 
            'tipoTransporte', 'formaPagamento', 'etapa'
        ];

        for (const campo of camposParaMonitorar) {
            const valorAntigo = dadosAntigos[campo];
            const valorNovo = dadosNovos[campo];

            // Normalizar valores para comparação
            const valorAntigoNormalizado = this.normalizarValor(valorAntigo);
            const valorNovoNormalizado = this.normalizarValor(valorNovo);

            // Só registrar se realmente houve mudança
            if (valorAntigoNormalizado !== valorNovoNormalizado) {
                const valorAntigoStr = await this.extrairNomeDoValor(valorAntigo, campo);
                const valorNovoStr = await this.extrairNomeDoValor(valorNovo, campo);

                const descricao = `Campo "${campo}" alterado de "${valorAntigoStr}" para "${valorNovoStr}"`;
                await logDAO.registrarLog(
                    dadosNovos.id,
                    usuarioId,
                    campo,
                    valorAntigoStr,
                    valorNovoStr,
                    descricao
                );
            }
        }
    }

    // Método auxiliar para normalizar valores para comparação
    normalizarValor(valor) {
        if (!valor) return null;
        
        // Se for objeto, extrair o ID
        if (typeof valor === 'object' && valor !== null) {
            return valor.id || valor.numeroDocumento || valor;
        }
        
        // Se for primitivo, retornar como está
        return valor;
    }

    // Método auxiliar para extrair nomes dos valores (agora assíncrono)
    async extrairNomeDoValor(valor, campo) {
        // console.log(`=== EXTRAINDO NOME PARA CAMPO: ${campo} ===`);
        // console.log(`Valor recebido:`, valor);
        // console.log(`Tipo do valor:`, typeof valor);
        
        if (!valor) {
            // console.log(`Valor é null/undefined, retornando N/A`);
            return 'N/A';
        }

        // Se for objeto, extrai normalmente
        if (typeof valor === 'object') {
            // console.log(`Valor é objeto, extraindo nome...`);
            switch (campo) {
                case 'cliente':
                    const nomeCliente = valor.nome || valor.numeroDocumento || valor.id || 'Cliente';
                    // console.log(`Nome do cliente extraído: ${nomeCliente}`);
                    return nomeCliente;
                case 'modeloEquipamento':
                    const nomeModelo = valor.modelo || valor.id || 'Modelo';
                    // console.log(`Nome do modelo extraído: ${nomeModelo}`);
                    return nomeModelo;
                case 'fabricante':
                    const nomeFabricante = valor.nome_fabricante || valor.id || 'Fabricante';
                    // console.log(`Nome do fabricante extraído: ${nomeFabricante}`);
                    return nomeFabricante;
                case 'urgencia':
                    const nomeUrgencia = valor.urgencia || valor.id || 'Urgência';
                    // console.log(`Nome da urgência extraído: ${nomeUrgencia}`);
                    return nomeUrgencia;
                case 'tipoAnalise':
                    const nomeTipoAnalise = valor.tipoAnalise || valor.id || 'Tipo de Análise';
                    // console.log(`Nome do tipo de análise extraído: ${nomeTipoAnalise}`);
                    return nomeTipoAnalise;
                case 'tipoLacre':
                    const nomeTipoLacre = valor.tipoLacre || valor.id || 'Tipo de Lacre';
                    // console.log(`Nome do tipo de lacre extraído: ${nomeTipoLacre}`);
                    return nomeTipoLacre;
                case 'tipoLimpeza':
                    const nomeTipoLimpeza = valor.tipoLimpeza || valor.id || 'Tipo de Limpeza';
                    // console.log(`Nome do tipo de limpeza extraído: ${nomeTipoLimpeza}`);
                    return nomeTipoLimpeza;
                case 'tipoTransporte':
                    const nomeTipoTransporte = valor.tipoTransporte || valor.id || 'Tipo de Transporte';
                    // console.log(`Nome do tipo de transporte extraído: ${nomeTipoTransporte}`);
                    return nomeTipoTransporte;
                case 'formaPagamento':
                    const nomeFormaPagamento = valor.pagamento || valor.id || 'Forma de Pagamento';
                    // console.log(`Nome da forma de pagamento extraído: ${nomeFormaPagamento}`);
                    return nomeFormaPagamento;
                default:
                    const nomeDefault = valor.id || JSON.stringify(valor);
                    // console.log(`Nome padrão extraído: ${nomeDefault}`);
                    return nomeDefault;
            }
        }

        // Se for primitivo (ID), buscar no banco
        // console.log(`Valor é primitivo (ID), buscando no banco...`);
        switch (campo) {
            case 'modeloEquipamento':
                const nomeModelo = await this.buscarNomePorId('modelo', valor, 'modelo');
                // console.log(`Nome do modelo buscado no banco: ${nomeModelo}`);
                return nomeModelo;
            case 'fabricante':
                const nomeFabricante = await this.buscarNomePorId('fabricante', valor, 'nome_fabricante');
                // console.log(`Nome do fabricante buscado no banco: ${nomeFabricante}`);
                return nomeFabricante;
            case 'urgencia':
                const nomeUrgencia = await this.buscarNomePorId('urgencia', valor, 'urgencia');
                // console.log(`Nome da urgência buscado no banco: ${nomeUrgencia}`);
                return nomeUrgencia;
            case 'tipoAnalise':
                const nomeTipoAnalise = await this.buscarNomePorId('tipo_analise', valor, 'tipo_analise');
                // console.log(`Nome do tipo de análise buscado no banco: ${nomeTipoAnalise}`);
                return nomeTipoAnalise;
            case 'tipoLacre':
                const nomeTipoLacre = await this.buscarNomePorId('tipo_lacre', valor, 'tipo_lacre');
                // console.log(`Nome do tipo de lacre buscado no banco: ${nomeTipoLacre}`);
                return nomeTipoLacre;
            case 'tipoLimpeza':
                const nomeTipoLimpeza = await this.buscarNomePorId('tipo_limpeza', valor, 'tipo_limpeza');
                // console.log(`Nome do tipo de limpeza buscado no banco: ${nomeTipoLimpeza}`);
                return nomeTipoLimpeza;
            case 'tipoTransporte':
                const nomeTipoTransporte = await this.buscarNomePorId('tipo_transporte', valor, 'tipo_transporte');
                // console.log(`Nome do tipo de transporte buscado no banco: ${nomeTipoTransporte}`);
                return nomeTipoTransporte;
            case 'formaPagamento':
                const nomeFormaPagamento = await this.buscarNomePorId('pagamento', valor, 'pagamento');
                // console.log(`Nome da forma de pagamento buscado no banco: ${nomeFormaPagamento}`);
                return nomeFormaPagamento;
            default:
                // console.log(`Campo não mapeado, retornando valor como string: ${String(valor)}`);
                return String(valor);
        }
    }

    // Método auxiliar para buscar nome pelo ID em uma tabela
    async buscarNomePorId(tabela, id, campoNome) {
        const conectar = (await import('../Service/conexao.js')).default;
        const conexao = await conectar();
        const [rows] = await conexao.query(`SELECT \`${campoNome}\` FROM \`${tabela}\` WHERE id = ?`, [id]);
        conexao.release();
        if (rows.length > 0) {
            return rows[0][campoNome];
        }
        return String(id);
    }
}

export default OrdemServicoCtrl;