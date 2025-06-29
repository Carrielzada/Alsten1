import OrdemServico from "../Model/OrdemServico.js";
import OrdemServicoDAO from "../Service/OrdemServicoDAO.js";
import upload from '../Service/uploadService.js'; // Importa o middleware de upload

class OrdemServicoCtrl {
    async gravar(req, res) {
        res.type("application/json");
        if (req.method === "POST" && req.is("application/json")) {
            const { 
                id, cliente, modeloEquipamento, defeitoAlegado, numeroSerie, 
                fabricante, urgencia, tipoAnalise, tipoLacre, tipoLimpeza, 
                tipoTransporte, formaPagamento, arquivosAnexados, etapa 
            } = req.body;

            if (cliente && modeloEquipamento && defeitoAlegado) {
                const os = new OrdemServico(
                    id, 
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
                    etapa
                );
                const osDAO = new OrdemServicoDAO();
                try {
                    await osDAO.gravar(os);
                    if (id) {
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
}

export default OrdemServicoCtrl;