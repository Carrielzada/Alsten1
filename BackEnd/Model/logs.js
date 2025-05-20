import LogsDAO from '../Service/LogsDAO.js';

export default class Logs {
    #id; 
    #usuario_id; 
    #operacao; 
    #descricao; 
    #criado_em;

    constructor(id, usuario_id, operacao, descricao = null, criado_em = null) {
        this.#id = id; 
        this.#usuario_id = usuario_id; 
        this.#operacao = operacao;
        this.#descricao = descricao; 
        this.#criado_em = criado_em;
    }

    // Getters e Setters
    get id() { return this.#id; }
    set id(novoId) { this.#id = novoId; }

    get usuario_id() { return this.#usuario_id; }
    set usuario_id(novoUsuarioId) { this.#usuario_id = novoUsuarioId; }

    get operacao() { return this.#operacao; }
    set operacao(novaOperacao) { this.#operacao = novaOperacao; }

    get descricao() { return this.#descricao; }
    set descricao(novaDescricao) { this.#descricao = novaDescricao; }

    get criado_em() { return this.#criado_em; }
    set criado_em(novaData) { this.#criado_em = novaData; }

    toJSON() {
        return {
            "id": this.#id, 
            "usuario_id": this.#usuario_id,
            "operacao": this.#operacao, 
            "descricao": this.#descricao,
            "criado_em": this.#criado_em
        };
    }

    // Métodos de Persistência
    async gravar() {
        const logsDAO = new LogsDAO();
        await logsDAO.incluir(this);
    }

    async consultarPorId(id) {
        const logsDAO = new LogsDAO();
        return await logsDAO.consultarPorId(id);
    }

    async consultarPorUsuario(usuario_id) {
        const logsDAO = new LogsDAO();
        return await logsDAO.consultarPorUsuario(usuario_id);
    }

    async consultarPorOperacao(operacao) {
        const logsDAO = new LogsDAO();
        return await logsDAO.consultarPorOperacao(operacao);
    }
}
