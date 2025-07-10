import DiasPagamento from '../Model/DiasPagamento.js';

class DiasPagamentoController {
    async listarTodos(req, res) {
        try {
            const diasPagamento = new DiasPagamento();
            const lista = await diasPagamento.consultar('');
            
            res.json({
                status: true,
                mensagem: "Dias de pagamento listados com sucesso",
                listaDiasPagamento: lista
            });
        } catch (error) {
            console.error('Erro ao listar dias de pagamento:', error);
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
            const diasPagamento = new DiasPagamento();
            const resultado = await diasPagamento.consultar(id);
            
            if (resultado.length > 0) {
                res.json({
                    status: true,
                    mensagem: "Dias de pagamento encontrado",
                    diasPagamento: resultado[0]
                });
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Dias de pagamento não encontrado"
                });
            }
        } catch (error) {
            console.error('Erro ao buscar dias de pagamento:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async gravar(req, res) {
        try {
            const { descricao, dias } = req.body;
            
            if (!descricao || !dias) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Descrição e dias são obrigatórios"
                });
            }

            const diasPagamento = new DiasPagamento(null, descricao, dias);
            
            // Validar antes de gravar
            DiasPagamento.validar(diasPagamento);
            
            await diasPagamento.gravar();
            
            res.status(201).json({
                status: true,
                mensagem: "Dias de pagamento criado com sucesso",
                diasPagamento: diasPagamento
            });
        } catch (error) {
            console.error('Erro ao gravar dias de pagamento:', error);
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
            const { descricao, dias } = req.body;
            
            if (!descricao || !dias) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Descrição e dias são obrigatórios"
                });
            }

            const diasPagamento = new DiasPagamento(parseInt(id), descricao, dias);
            
            // Validar antes de atualizar
            DiasPagamento.validar(diasPagamento);
            
            await diasPagamento.atualizar();
            
            res.json({
                status: true,
                mensagem: "Dias de pagamento atualizado com sucesso",
                diasPagamento: diasPagamento
            });
        } catch (error) {
            console.error('Erro ao atualizar dias de pagamento:', error);
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
            const diasPagamento = new DiasPagamento(parseInt(id));
            
            await diasPagamento.excluir();
            
            res.json({
                status: true,
                mensagem: "Dias de pagamento excluído com sucesso"
            });
        } catch (error) {
            console.error('Erro ao excluir dias de pagamento:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }
}

export default new DiasPagamentoController(); 