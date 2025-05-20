// Arquivo: /home/ubuntu/project_Alsten/BackEnd/Controller/ordemServicoCtrl.js
import OrdemServico from "../Model/OrdemServico.js";
import OrdemServicoDAO from "../Service/OrdemServicoDAO.js";

class OrdemServicoCtrl {
    async gravar(req, res) {
        res.type("application/json");
        if (req.method === "POST" && req.is("application/json")) {
            const { cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, etapa, arquivosAnexados, id } = req.body;

            if (cliente && modeloEquipamento && defeitoAlegado) {
                const os = new OrdemServico(id, cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, arquivosAnexados, etapa);
                const osDAO = new OrdemServicoDAO();
                try {
                    await osDAO.gravar(os);
                    if (id) { // Se ID existe, é uma atualização
                        res.status(200).json({
                            status: true,
                            mensagem: "Ordem de Serviço atualizada com sucesso!",
                            os_id: os.id
                        });
                    } else { // Senão, é uma criação
                        res.status(200).json({
                            status: true,
                            mensagem: "Ordem de Serviço cadastrada com sucesso!",
                            os_id: os.id // Retorna o ID da OS criada
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
                res.status(200).json(listaOrdensServico);
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
        const id = req.params.id;
        if (req.method === "GET") {
            const osDAO = new OrdemServicoDAO();
            try {
                const os = await osDAO.consultarPorId(id);
                if (os) {
                    res.status(200).json(os);
                } else {
                    res.status(404).json({
                        status: false,
                        mensagem: "Ordem de Serviço não encontrada."
                    });
                }
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar Ordem de Serviço: " + erro.message,
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido para consultar Ordem de Serviço.",
            });
        }
    }

    async mudarEtapa(req, res) {
        res.type("application/json");
        if (req.method === "PUT" && req.is("application/json")) {
            const osId = req.params.id;
            const { novaEtapa } = req.body;

            if (!osId || !novaEtapa) {
                return res.status(400).json({
                    status: false,
                    mensagem: "ID da OS e nova etapa são obrigatórios."
                });
            }

            const osDAO = new OrdemServicoDAO();
            try {
                const os = await osDAO.consultarPorId(osId);
                if (!os) {
                    return res.status(404).json({
                        status: false,
                        mensagem: "Ordem de Serviço não encontrada."
                    });
                }
                os.mudarEtapa(novaEtapa); // Método do modelo
                await osDAO.gravar(os); // Salva a OS atualizada (o método gravar lida com update)
                res.status(200).json({
                    status: true,
                    mensagem: `Etapa da OS ${osId} alterada para ${novaEtapa} com sucesso.`,
                    os: os
                });
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao mudar etapa da Ordem de Serviço: " + erro.message,
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido ou formato JSON não fornecido para mudar etapa.",
            });
        }
    }
}

export default OrdemServicoCtrl;

