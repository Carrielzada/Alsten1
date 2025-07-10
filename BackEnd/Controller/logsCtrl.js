import OrdemServicoLogDAO from '../Service/OrdemServicoLogDAO.js';

export default class LogsCtrl {
    async gravar(requisicao, resposta) {
        resposta.status(501).json({ status: false, mensagem: "Método não implementado." });
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        const logDAO = new OrdemServicoLogDAO();
        try {
            const logs = await logDAO.consultarTodosLogs();
            
            resposta.status(200).json({
                status: true,
                logs: logs
            });
        } catch (error) {
            console.error('Erro ao consultar todos os logs:', error);
            resposta.status(500).json({
                status: false,
                mensagem: "Erro ao consultar logs: " + error.message,
            });
        }
    }
}
