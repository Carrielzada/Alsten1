import ServicoPadrao from '../Model/ServicoPadrao.js';

class ServicoPadraoController {
    async listarTodos(req, res) {
        try {
            const servicoPadrao = new ServicoPadrao();
            const lista = await servicoPadrao.consultar('');
            
            res.json({
                status: true,
                mensagem: "Serviços padrão listados com sucesso",
                listaServicosPadrao: lista
            });
        } catch (error) {
            console.error('Erro ao listar serviços padrão:', error);
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
            const servicoPadrao = new ServicoPadrao();
            const resultado = await servicoPadrao.consultar(id);
            
            if (resultado.length > 0) {
                res.json({
                    status: true,
                    mensagem: "Serviço padrão encontrado",
                    servicoPadrao: resultado[0]
                });
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Serviço padrão não encontrado"
                });
            }
        } catch (error) {
            console.error('Erro ao buscar serviço padrão:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async gravar(req, res) {
        try {
            const { titulo, servico } = req.body;
            
            if (!titulo || !servico) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Título e serviço são obrigatórios"
                });
            }

            const servicoPadrao = new ServicoPadrao(null, titulo, servico);
            
            // Validar antes de gravar
            ServicoPadrao.validar(servicoPadrao);
            
            await servicoPadrao.gravar();
            
            res.status(201).json({
                status: true,
                mensagem: "Serviço padrão criado com sucesso",
                servicoPadrao: servicoPadrao
            });
        } catch (error) {
            console.error('Erro ao gravar serviço padrão:', error);
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
            const { titulo, servico } = req.body;
            
            if (!titulo || !servico) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Título e serviço são obrigatórios"
                });
            }

            const servicoPadrao = new ServicoPadrao(parseInt(id), titulo, servico);
            
            // Validar antes de atualizar
            ServicoPadrao.validar(servicoPadrao);
            
            await servicoPadrao.atualizar();
            
            res.json({
                status: true,
                mensagem: "Serviço padrão atualizado com sucesso",
                servicoPadrao: servicoPadrao
            });
        } catch (error) {
            console.error('Erro ao atualizar serviço padrão:', error);
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
            const servicoPadrao = new ServicoPadrao(parseInt(id));
            
            await servicoPadrao.excluir();
            
            res.json({
                status: true,
                mensagem: "Serviço padrão excluído com sucesso"
            });
        } catch (error) {
            console.error('Erro ao excluir serviço padrão:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }
}

export default new ServicoPadraoController(); 