import ClienteDAO from '../Service/ClientePJDAO.js';

export default class ClientePJ {
    #cnpj;
    #nome;
    #nome_fantasia;
    #contato;
    #endereco;
    #cidade;
    #bairro;
    #estado;
    #cep;
    #criado_em;
    #atualizado_em;

    constructor(cnpj, nome, nome_fantasia, contato, endereco, cidade, bairro, estado, cep, criado_em = null, atualizado_em = null) {
        this.#cnpj = cnpj;
        this.#nome = nome;
        this.#nome_fantasia = nome_fantasia;
        this.#contato = contato;
        this.#endereco = endereco;
        this.#cidade = cidade;
        this.#bairro = bairro;
        this.#estado = estado;
        this.#cep = cep;
        this.#criado_em = criado_em;
        this.#atualizado_em = atualizado_em;
    }

    // Getters e Setters
    get cnpj() {
        return this.#cnpj;
    }

    set cnpj(novoCnpj) {
        this.#cnpj = novoCnpj;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        if (novoNome !== "")
            this.#nome = novoNome;
    }

    get nome_fantasia() {
        return this.#nome_fantasia;
    }

    set nome_fantasia(novoNomeFantasia) {
        this.#nome_fantasia = novoNomeFantasia;
    }

    get contato() {
        return this.#contato;
    }

    set contato(novoContato) {
        this.#contato = novoContato;
    }

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        this.#endereco = novoEndereco;
    }

    get cidade() {
        return this.#cidade;
    }

    set cidade(novaCidade) {
        this.#cidade = novaCidade;
    }

    get bairro() {
        return this.#bairro;
    }

    set bairro(novoBairro) {
        this.#bairro = novoBairro;
    }

    get estado() {
        return this.#estado;
    }

    set estado(novoEstado) {
        this.#estado = novoEstado;
    }

    get cep() {
        return this.#cep;
    }

    set cep(novoCep) {
        this.#cep = novoCep;
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

    toJSON() {
        return {
            cnpj: this.#cnpj,
            nome: this.#nome,
            nome_fantasia: this.#nome_fantasia,
            contato: this.#contato,
            endereco: this.#endereco,
            cidade: this.#cidade,
            bairro: this.#bairro,
            estado: this.#estado,
            cep: this.#cep,
            criado_em: this.#criado_em,
            atualizado_em: this.#atualizado_em,
        };
    }

    // Métodos de Persistência
    async gravar() {
        const clientePJDAO = new ClienteDAO();
        await clientePJDAO.incluirPJ(this);
    }

    async atualizar() {
        const clientePJDAO = new ClienteDAO();
        await clientePJDAO.alterarPJ(this);
    }

    async removerDoBancoDados() {
        const clientePJDAO = new ClienteDAO();
        await clientePJDAO.excluirPJ(this.#cnpj);
    }

    async consultar(termo) {
        const clientePJDAO = new ClienteDAO();
        return await clientePJDAO.consultarPJ(termo);
    }

    async consultarPorCnpj(cnpj) {
        const clientePJDAO = new ClienteDAO();
        return await clientePJDAO.consultarPorCnpj(cnpj);
    }
}
