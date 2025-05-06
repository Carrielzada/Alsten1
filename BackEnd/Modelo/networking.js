import NetworkingDAO from '../Persistencia/NetworkingDAO.js';

export default class Networking {
    #id;
    #nome;
    #categoria;
    #contato;
    #email;
    #data_nascimento;
    #observacoes;
    #criado_em;
    #atualizado_em;

    constructor(id, nome, categoria, contato, email, data_nascimento = null, observacoes = null, criado_em = null, atualizado_em = null) {
        this.#id = id;
        this.#nome = nome;
        this.#categoria = categoria;
        this.#contato = contato;
        this.#email = email;
        this.#data_nascimento = data_nascimento;
        this.#observacoes = observacoes;
        this.#criado_em = criado_em;
        this.#atualizado_em = atualizado_em;
    }

    // Getters e Setters
    get id() {
        return this.#id;
    }

    set id(novoId) {
        this.#id = novoId;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        if (novoNome) this.#nome = novoNome;
    }

    get categoria() {
        return this.#categoria;
    }

    set categoria(novaCategoria) {
        this.#categoria = novaCategoria;
    }

    get contato() {
        return this.#contato;
    }

    set contato(novoContato) {
        this.#contato = novoContato;
    }

    get email() {
        return this.#email;
    }

    set email(novoEmail) {
        this.#email = novoEmail;
    }

    get data_nascimento() {
        return this.#data_nascimento;
    }

    set data_nascimento(novaDataNascimento) {
        this.#data_nascimento = novaDataNascimento;
    }

    get observacoes() {
        return this.#observacoes;
    }

    set observacoes(novasObservacoes) {
        this.#observacoes = novasObservacoes;
    }

    get criado_em() {
        return this.#criado_em;
    }

    set criado_em(novaData) {
        this.#criado_em = novaData;
    }

    get atualizado_em() {
        return this.#atualizado_em;
    }

    set atualizado_em(novaData) {
        this.#atualizado_em = novaData;
    }

    // Método para converter para JSON
    toJSON() {
        return {
            "id": this.#id,
            "nome": this.#nome,
            "categoria": this.#categoria,
            "contato": this.#contato,
            "email": this.#email,
            "data_nascimento": this.#data_nascimento,
            "observacoes": this.#observacoes,
            "criado_em": this.#criado_em,
            "atualizado_em": this.#atualizado_em
        };
    }

    // Métodos de Persistência
    async gravar() {
        const networkingDAO = new NetworkingDAO();
        await networkingDAO.incluir(this);
    }

    async atualizar() {
        const networkingDAO = new NetworkingDAO();
        await networkingDAO.alterar(this);
    }

    async removerDoBancoDados() {
        const networkingDAO = new NetworkingDAO();
        await networkingDAO.excluir(this.#id);
    }

    async consultar(termo) {
        const networkingDAO = new NetworkingDAO();
        return await networkingDAO.consultar(termo);
    }

    async consultarPorId(id) {
        const networkingDAO = new NetworkingDAO();
        return await networkingDAO.consultarPorId(id);
    }
}
