import OrdemServico from "../Model/OrdemServico.js";
import OrdemServicoDAO from "../Service/OrdemServicoDAO.js";
import OrdemServicoLogDAO from "../Service/OrdemServicoLogDAO.js";
import { criarLock, verificarLock, removerLock, refreshLock, listarLocks } from '../Service/OrdemServicoLockService.js';

class OrdemServicoCtrl {
    constructor() {
        this.gravar = this.gravar.bind(this);
        this.consultar = this.consultar.bind(this);
        this.consultarPorId = this.consultarPorId.bind(this);
        this.excluir = this.excluir.bind(this);
        this.anexarArquivo = this.anexarArquivo.bind(this);
        this.anexarComprovante = this.anexarComprovante.bind(this);
        this.removerArquivo = this.removerArquivo.bind(this);
        this.consultarLogs = this.consultarLogs.bind(this);
        this.registrarLogsAlteracoes = this.registrarLogsAlteracoes.bind(this);
        this.transicionarEtapa = this.transicionarEtapa.bind(this);
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
                valor, etapaId, comprovanteAprovacao, notaFiscal, comprovante
            } = req.body;

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
                    notaFiscal,
                    comprovante
                );

                const osDAO = new OrdemServicoDAO();
                const logDAO = new OrdemServicoLogDAO();
                
                try {
                    let dadosAntigos = null;
                    if (req.method === "PUT" && osId) {
                        dadosAntigos = await osDAO.consultarPorId(osId);
                    }

                    await osDAO.gravar(os); // Aqui o DAO já deve atribuir os.id = result.insertId

                    if (req.method === "PUT" && dadosAntigos) {
                        const usuarioId = req.user?.id;
                        await this.registrarLogsAlteracoes(dadosAntigos, os, usuarioId, logDAO);
                    }
                    else if (req.method === "POST") {
                        const usuarioId = req.user?.id;
                        await logDAO.registrarLog(
                            os.id,
                            usuarioId,
                            'criacao',
                            null,
                            null,
                            `Ordem de Serviço criada por ${req.user?.nome || 'Usuário'}`
                        );
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
                // Detectar se é chamada legada (parâmetros antigos) ou nova (com filtros)
                const isLegacyCall = req.query.termo !== undefined || req.query.pagina !== undefined;
                
                if (isLegacyCall) {
                    // Manter compatibilidade com chamadas antigas
                    const termoBusca = req.query.termo || "";
                    const pagina = parseInt(req.query.pagina) || 1;
                    const itensPorPagina = parseInt(req.query.itensPorPagina) || 25;
                    
                    const resultado = await osDAO.consultar(termoBusca, pagina, itensPorPagina);
                    
                    res.status(200).json({
                        status: true,
                        listaOrdensServico: resultado.listaOrdensServico,
                        paginacao: {
                            pagina: resultado.pagina,
                            itensPorPagina: resultado.itensPorPagina,
                            totalRegistros: resultado.totalRegistros,
                            totalPaginas: resultado.totalPaginas
                        }
                    });
                } else {
                    // Nova API com paginação avançada e filtros
                    // Mapear parâmetro 'termo' para 'search' se existir
                    if (req.query.termo) {
                        req.query.search = req.query.termo;
                    }
                    
                    const resultado = await osDAO.consultarComPaginacao(req.query);
                    
                    // Resposta no novo formato padronizado
                    res.status(200).json(resultado);
                }
                
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
                    caminho: req.file.filename 
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
    }

    async anexarComprovante(req, res) {
        res.type("application/json");
        const osDAO = new OrdemServicoDAO();
        const osId = req.params.id;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                mensagem: "Nenhum comprovante enviado."
            });
        }

        // Validar se é uma imagem
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                status: false,
                mensagem: "Apenas imagens são permitidas como comprovante (JPG, PNG, GIF, WEBP)."
            });
        }

        try {
            const nomeArquivo = req.file.filename;
            const sucesso = await osDAO.atualizarComprovante(osId, nomeArquivo);
            if (sucesso) {
                res.status(200).json({
                    status: true,
                    mensagem: "Comprovante anexado com sucesso!",
                    caminho: nomeArquivo
                });
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Ordem de Serviço não encontrada para anexar o comprovante."
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                mensagem: "Erro ao anexar comprovante: " + error.message,
            });
        }
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

    // --- TRANSIÇÃO DE ETAPAS COM VALIDAÇÕES ---
    async transicionarEtapa(req, res) {
        res.type("application/json");
        try {
            const osId = req.params.id;
            const { novaEtapa, novaEtapaId } = req.body || {};

            if (!osId) {
                return res.status(400).json({ status: false, mensagem: 'OS id não informado' });
            }
            if (!novaEtapa && !novaEtapaId) {
                return res.status(400).json({ status: false, mensagem: 'Informe novaEtapa (nome) ou novaEtapaId' });
            }

            const osDAO = new OrdemServicoDAO();
            const logDAO = new OrdemServicoLogDAO();
            const osAtual = await osDAO.consultarPorId(osId);
            if (!osAtual) {
                return res.status(404).json({ status: false, mensagem: 'OS não encontrada' });
            }

            // Resolver nome da etapa e id via tabela etapa_os
            let etapaNomeDestino = novaEtapa;
            let etapaIdDestino = novaEtapaId;
            if (!etapaNomeDestino || !etapaIdDestino) {
                const { default: EtapaOSDAO } = await import('../Service/EtapaOSDAO.js');
                const etapaDAO = new EtapaOSDAO();
                const lista = await etapaDAO.consultar('');
                if (!lista || lista.length === 0) {
                    return res.status(500).json({ status: false, mensagem: 'Tabela de etapas não configurada' });
                }
                if (etapaIdDestino) {
                    const match = lista.find(e => e.id === parseInt(etapaIdDestino));
                    etapaNomeDestino = match?.nome;
                } else if (etapaNomeDestino) {
                    const match = lista.find(e => (e.nome || '').toUpperCase() === etapaNomeDestino.toUpperCase());
                    etapaIdDestino = match?.id;
                }
                if (!etapaNomeDestino || !etapaIdDestino) {
                    return res.status(400).json({ status: false, mensagem: 'Etapa destino inválida' });
                }
            }

            // RBAC básico por etapa
            const role = req.user?.role; // 1-Admin, 2-Diretoria, 3-PCM, 4-Comercial, 5-Logística, 6-Técnico
            const allowAll = [1, 2].includes(role);
            const mapaPermissao = {
                'PREVISTO': [1,2,5],
                'RECEBIDO': [1,2,5],
                'EM ANÁLISE': [1,2,6],
                'ANALISADO': [1,2,6],
                'AGUARDANDO APROVAÇÃO': [1,2,3,4],
                'PRÉ-APROVADO': [1,2,3,4],
                'APROVADO': [1,2,3,4],
                'REPROVADO': [1,2,3,4],
                'AGUARDANDO INFORMAÇÃO': [1,2,3,4,6],
                'SEM CUSTO': [1,2,3,4],
                'EXPEDIÇÃO': [1,2,5,6],
                'DESPACHO': [1,2,5],
                'CONCLUÍDO': [1,2,5]
            };
            const permitidos = mapaPermissao[etapaNomeDestino] || [];
            if (!allowAll && !permitidos.includes(role)) {
                return res.status(403).json({ status: false, mensagem: 'Sem permissão para definir esta etapa' });
            }

            // Regras de obrigatoriedade (gate)
            const faltando = [];
            const exige = {
                'PREVISTO': ['cliente','modeloEquipamento','fabricante','defeitoAlegado'],
                'RECEBIDO': ['arquivosAnexados'],
                'EM ANÁLISE': ['tipoAnalise','checklistItems','tipoLimpeza','defeitoConstatado','servicoRealizar','diasReparo'],
                'AGUARDANDO APROVAÇÃO': ['comprovanteAprovacao'],
                'PRÉ-APROVADO': ['comprovanteAprovacao'],
                'APROVADO': ['comprovanteAprovacao'],
                'REPROVADO': ['comprovanteAprovacao']
            };
            const exigirCampos = exige[etapaNomeDestino] || [];

            const temValor = (campo) => {
                const v = osAtual[campo];
                if (campo === 'arquivosAnexados' || campo === 'checklistItems') return Array.isArray(v) && v.length > 0;
                if (typeof v === 'object') return !!v && (v.id || Object.keys(v).length > 0);
                return v !== undefined && v !== null && String(v).trim() !== '';
            };

            exigirCampos.forEach(c => { if (!temValor(c)) faltando.push(c); });
            if (faltando.length > 0) {
                return res.status(400).json({ status: false, mensagem: 'Campos obrigatórios ausentes para esta etapa', faltando });
            }

            // Cálculo de data de entrega (dias úteis) ao aprovar
            const calcularDataUtil = (inicioISO, dias) => {
                if (!inicioISO || !dias || dias <= 0) return null;
                let d = new Date(inicioISO);
                let adicionados = 0;
                while (adicionados < dias) {
                    d.setDate(d.getDate() + 1);
                    const wd = d.getDay(); // 0-dom,6-sab
                    if (wd !== 0 && wd !== 6) adicionados++;
                }
                return d.toISOString().slice(0,10);
            };

            // Atualizar a OS com a nova etapa e efeitos colaterais
            const osAtualizada = { ...osAtual };
            osAtualizada.etapa = etapaNomeDestino;
            osAtualizada.etapaId = { id: etapaIdDestino, nome: etapaNomeDestino };

            if (etapaNomeDestino === 'APROVADO') {
                const base = osAtual.dataAprovacaoOrcamento || new Date().toISOString().slice(0,10);
                const uteis = parseInt(osAtual.diasReparo || 0);
                if (uteis > 0) {
                    osAtualizada.dataEntrega = calcularDataUtil(base, uteis);
                }
            }

            // Persistir
            const osParaSalvar = new OrdemServico(
                osAtualizada.id,
                osAtualizada.cliente,
                osAtualizada.modeloEquipamento,
                osAtualizada.defeitoAlegado,
                osAtualizada.numeroSerie,
                osAtualizada.fabricante,
                osAtualizada.urgencia,
                osAtualizada.tipoAnalise,
                osAtualizada.tipoLacre,
                osAtualizada.tipoLimpeza,
                osAtualizada.tipoTransporte,
                osAtualizada.formaPagamento,
                osAtualizada.arquivosAnexados,
                osAtualizada.etapa,
                osAtualizada.dataCriacao,
                osAtualizada.vendedor,
osAtualizada.diasPagamento,
                osAtualizada.dataEntrega,
                osAtualizada.dataAprovacaoOrcamento,
                osAtualizada.diasReparo,
                osAtualizada.dataEquipamentoPronto,
                osAtualizada.informacoesConfidenciais,
                osAtualizada.checklistItems,
                osAtualizada.agendado,
                osAtualizada.possuiAcessorio,
                osAtualizada.tipoTransporteTexto,
                osAtualizada.transporteCifFob,
                osAtualizada.pedidoCompras,
                osAtualizada.defeitoConstatado,
                osAtualizada.servicoRealizar,
                osAtualizada.valor,
                osAtualizada.etapaId,
                osAtualizada.comprovanteAprovacao,
                osAtualizada.notaFiscal,
                osAtualizada.comprovante
            );

            const dadosAntigos = osAtual;
            await osDAO.gravar(osParaSalvar);

            // Registrar log da mudança de etapa
            const usuarioId = req.user?.id;
            await logDAO.registrarLog(
                osParaSalvar.id,
                usuarioId,
                'etapa',
                dadosAntigos.etapaId?.nome || dadosAntigos.etapa || 'N/A',
                etapaNomeDestino,
                `Etapa alterada para "${etapaNomeDestino}"`
            );

            return res.status(200).json({ status: true, mensagem: 'Etapa atualizada com sucesso!', os_id: osParaSalvar.id, etapa: etapaNomeDestino });
        } catch (error) {
            console.error('Erro na transição de etapa:', error);
            return res.status(500).json({ status: false, mensagem: 'Erro na transição de etapa: ' + error.message });
        }
    }

    async consultarLogs(req, res) {
        res.type("application/json");
        const logDAO = new OrdemServicoLogDAO();
        const osId = req.params.id;
        try {
            const logs = await logDAO.consultarLogsPorOsId(osId);
            res.status(200).json({ status: true, logs });
        } catch (error) {
            res.status(500).json({
                status: false,
                mensagem: "Erro ao consultar logs da Ordem de Serviço: " + error.message,
            });
        }
    }

async criarLock(req, res) {
        const osId = req.params.id;
        const userId = req.user?.id;
        const userNome = req.user?.nome || req.user?.email || 'Usuário';
        if (!userId) return res.status(401).json({ status: false, mensagem: 'Usuário não autenticado!' });
        const resultado = criarLock(osId, userId, userNome);
        if (resultado.ok) return res.json({ status: true, mensagem: 'Lock adquirido com sucesso!', lock: resultado.lock });
        return res.status(409).json({ status: false, mensagem: 'OS já está sendo editada por outro usuário!', lock: resultado.lock });
    }

async verificarLock(req, res) {
        const osId = req.params.id;
        const lock = verificarLock(osId);
        if (!lock) return res.json({ status: false, livre: true });
        return res.json({ status: true, livre: false, lock });
    }

async removerLock(req, res) {
        const osId = req.params.id;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ status: false, mensagem: 'Usuário não autenticado!' });
        const ok = removerLock(osId, userId);
        if (ok) return res.json({ status: true, mensagem: 'Lock removido com sucesso!' });
        return res.status(403).json({ status: false, mensagem: 'Você não possui o lock desta OS.' });
    }

    async refrescarLock(req, res) {
        const osId = req.params.id;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ status: false, mensagem: 'Usuário não autenticado!' });
        const lock = refreshLock(osId, userId);
        if (!lock) return res.status(409).json({ status: false, mensagem: 'Não foi possível renovar o lock.' });
        return res.json({ status: true, lock });
    }

    async listarLocks(req, res) {
        const locks = listarLocks();
        return res.json({ status: true, locks });
    }

    async registrarLogsAlteracoes(dadosAntigos, dadosNovos, usuarioId, logDAO) {
        // TODOS os campos da Ordem de Serviço para monitoramento completo
        const camposParaMonitorar = [
            // Campos básicos
            'cliente', 'modeloEquipamento', 'defeitoAlegado', 'numeroSerie', 
            'fabricante', 'urgencia', 'tipoAnalise', 'tipoLacre', 'tipoLimpeza', 
            'tipoTransporte', 'formaPagamento', 'etapa',
            
            // Novos campos adicionados
            'vendedor', 'diasPagamento', 'dataEntrega', 'dataAprovacaoOrcamento',
            'diasReparo', 'dataEquipamentoPronto', 'informacoesConfidenciais',
            'agendado', 'possuiAcessorio', 'tipoTransporteTexto', 'transporteCifFob',
            'pedidoCompras', 'defeitoConstatado', 'servicoRealizar', 'valor',
            'etapaId', 'comprovanteAprovacao', 'notaFiscal', 'comprovante'
        ];

        for (const campo of camposParaMonitorar) {
            const valorAntigo = dadosAntigos[campo];
            const valorNovo = dadosNovos[campo];

            // Tratamento especial para checklistItems (array)
            if (campo === 'checklistItems') {
                const itensAntigos = Array.isArray(valorAntigo) ? valorAntigo : [];
                const itensNovos = Array.isArray(valorNovo) ? valorNovo : [];
                
                if (JSON.stringify(itensAntigos.sort()) !== JSON.stringify(itensNovos.sort())) {
                    const descricao = `Checklist alterado: ${itensAntigos.length} itens -> ${itensNovos.length} itens`;
                    await logDAO.registrarLog(
                        dadosNovos.id,
                        usuarioId,
                        'checklistItems',
                        `${itensAntigos.length} itens`,
                        `${itensNovos.length} itens`,
                        descricao
                    );
                }
                continue;
            }

            const valorAntigoNormalizado = this.normalizarValor(valorAntigo);
            const valorNovoNormalizado = this.normalizarValor(valorNovo);

            if (valorAntigoNormalizado !== valorNovoNormalizado) {
                const valorAntigoStr = await this.extrairNomeDoValor(valorAntigo, campo);
                const valorNovoStr = await this.extrairNomeDoValor(valorNovo, campo);

                const nomeAmigavel = this.obterNomeAmigavelCampo(campo);
                const descricao = `${nomeAmigavel} alterado de "${valorAntigoStr}" para "${valorNovoStr}"`;
                
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

    normalizarValor(valor) {
        if (!valor) return null;
        if (typeof valor === 'object' && valor !== null) return valor.id || valor.numeroDocumento || valor;
        return valor;
    }

    async extrairNomeDoValor(valor, campo) {
        if (!valor) return 'N/A';
        
        // Campos booleanos
        if (typeof valor === 'boolean') {
            return valor ? 'Sim' : 'Não';
        }
        
        // Campos de data
        if (['dataEntrega', 'dataAprovacaoOrcamento', 'dataEquipamentoPronto'].includes(campo)) {
            if (valor instanceof Date) return valor.toLocaleDateString('pt-BR');
            if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/)) {
                return new Date(valor).toLocaleDateString('pt-BR');
            }
        }
        
        // Campos numéricos especiais
        if (campo === 'valor' && typeof valor === 'number') {
            return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        }
        
        if (typeof valor === 'object') {
            switch (campo) {
                // Campos básicos
                case 'cliente': return valor.nome || valor.numeroDocumento || valor.id || 'Cliente';
                case 'modeloEquipamento': return valor.modelo || valor.id || 'Modelo';
                case 'fabricante': return valor.nome_fabricante || valor.id || 'Fabricante';
                case 'urgencia': return valor.urgencia || valor.id || 'Urgência';
                case 'tipoAnalise': return valor.tipoAnalise || valor.id || 'Tipo de Análise';
                case 'tipoLacre': return valor.tipoLacre || valor.id || 'Tipo de Lacre';
                case 'tipoLimpeza': return valor.tipoLimpeza || valor.id || 'Tipo de Limpeza';
                case 'tipoTransporte': return valor.tipoTransporte || valor.id || 'Tipo de Transporte';
                case 'formaPagamento': return valor.pagamento || valor.id || 'Forma de Pagamento';
                
                // Novos campos
                case 'vendedor': return valor.nome || valor.id || 'Vendedor';
                case 'diasPagamento': return valor.dias || valor.descricao || valor.id || 'Dias de Pagamento';
                case 'etapaId': return valor.nome || valor.etapa || valor.id || 'Etapa';
                
                default: return valor.id || JSON.stringify(valor);
            }
        }
        
        return String(valor);
    }

    obterNomeAmigavelCampo(campo) {
        const mapeamento = {
            // Campos básicos
            'cliente': 'Cliente',
            'modeloEquipamento': 'Modelo de Equipamento',
            'defeitoAlegado': 'Defeito Alegado',
            'numeroSerie': 'Número de Série',
            'fabricante': 'Fabricante',
            'urgencia': 'Nível de Urgência',
            'tipoAnalise': 'Tipo de Análise',
            'tipoLacre': 'Tipo de Lacre',
            'tipoLimpeza': 'Tipo de Limpeza',
            'tipoTransporte': 'Tipo de Transporte',
            'formaPagamento': 'Forma de Pagamento',
            'etapa': 'Etapa',
            
            // Novos campos
            'vendedor': 'Vendedor',
            'diasPagamento': 'Dias de Pagamento',
            'dataEntrega': 'Data de Entrega',
            'dataAprovacaoOrcamento': 'Data de Aprovação do Orçamento',
            'diasReparo': 'Dias de Reparo',
            'dataEquipamentoPronto': 'Data do Equipamento Pronto',
            'informacoesConfidenciais': 'Informações Confidenciais',
            'checklistItems': 'Itens do Checklist',
            'agendado': 'Agendado',
            'possuiAcessorio': 'Possui Acessório',
            'tipoTransporteTexto': 'Observações do Transporte',
            'transporteCifFob': 'Transporte CIF/FOB',
            'pedidoCompras': 'Pedido de Compras',
            'defeitoConstatado': 'Defeito Constatado',
            'servicoRealizar': 'Serviço a Realizar',
            'valor': 'Valor',
            'etapaId': 'Etapa Atual',
            'comprovanteAprovacao': 'Comprovante de Aprovação',
            'notaFiscal': 'Nota Fiscal',
            'comprovante': 'Comprovante'
        };
        
        return mapeamento[campo] || campo;
    }
}

export default OrdemServicoCtrl;
