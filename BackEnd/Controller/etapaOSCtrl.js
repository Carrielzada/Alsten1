import EtapaOS from '../Model/EtapaOS.js';

class EtapaOSController {
    async listarTodos(req, res) {
        try {
            const etapaOS = new EtapaOS();
            const lista = await etapaOS.consultar('');
            
            res.json({
                status: true,
                mensagem: "Etapas da OS listadas com sucesso",
                listaEtapasOS: lista
            });
        } catch (error) {
            console.error('Erro ao listar etapas da OS:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const etapaOS = new EtapaOS();
            const resultado = await etapaOS.consultar(id);
            
            if (resultado.length > 0) {
                res.json({
                    status: true,
                    mensagem: "Etapa da OS encontrada",
                    etapaOS: resultado[0]
                });
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Etapa da OS não encontrada"
                });
            }
        } catch (error) {
            console.error('Erro ao buscar etapa da OS:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async buscarPorNome(req, res) {
        try {
            const { nome } = req.params;
            const etapaOS = new EtapaOS();
            const resultado = await etapaOS.consultar(nome);
            
            if (resultado.length > 0) {
                res.json({
                    status: true,
                    mensagem: "Etapa da OS encontrada",
                    etapaOS: resultado[0]
                });
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Etapa da OS não encontrada"
                });
            }
        } catch (error) {
            console.error('Erro ao buscar etapa da OS por nome:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async gravar(req, res) {
        try {
            const { nome, descricao } = req.body;
            
            if (!nome) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Nome é obrigatório"
                });
            }

            const etapaOS = new EtapaOS(null, nome, descricao);
            
            // Validar antes de gravar
            EtapaOS.validar(etapaOS);
            
            await etapaOS.gravar();
            
            res.status(201).json({
                status: true,
                mensagem: "Etapa da OS criada com sucesso",
                etapaOS: etapaOS
            });
        } catch (error) {
            console.error('Erro ao gravar etapa da OS:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;
            
            if (!nome) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Nome é obrigatório"
                });
            }

            const etapaOS = new EtapaOS(parseInt(id), nome, descricao);
            
            // Validar antes de atualizar
            EtapaOS.validar(etapaOS);
            
            await etapaOS.atualizar();
            
            res.json({
                status: true,
                mensagem: "Etapa da OS atualizada com sucesso",
                etapaOS: etapaOS
            });
        } catch (error) {
            console.error('Erro ao atualizar etapa da OS:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const etapaOS = new EtapaOS(parseInt(id));
            
            await etapaOS.excluir();
            
            res.json({
                status: true,
                mensagem: "Etapa da OS excluída com sucesso"
            });
        } catch (error) {
            console.error('Erro ao excluir etapa da OS:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }
}

export default new EtapaOSController(); 