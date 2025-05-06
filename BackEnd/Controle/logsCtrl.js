import Logs from '../Modelo/logs.js';

export default class LogsCtrl {
    async gravar(requisicao, resposta) {
        resposta.status(501).json({ status: false, mensagem: "Método não implementado." });
    }

    async consultar(requisicao, resposta) {
        resposta.status(501).json({ status: false, mensagem: "Método não implementado." });
    }
}
