import ClienteDAO from '../Persistencia/ClientePFDAO.js';

export default class ClientePF {
    #cpf;
    #nome;
    #data_nascimento;
    #contato;
    #endereco;
    #cidade;
    #bairro;
    #estado;
    #cep;
    #criado_em;
    #atualizado_em;

    constructor(cpf, nome, data_nascimento, contato, endereco, cidade, bairro, estado, cep, criado_em = null, atualizado_em = null) {
        this.#cpf = cpf;
        this.#nome = nome;
        this.#data_nascimento = data_nascimento;
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
    get cpf() { return this.#cpf; }
    set cpf(novoCpf) { this.#cpf = novoCpf; }

    get nome() { return this.#nome; }
    set nome(novoNome) { if (novoNome) this.#nome = novoNome; }

    get data_nascimento() { return this.#data_nascimento; }
    set data_nascimento(novaDataNascimento) { this.#data_nascimento = novaDataNascimento; }

    get contato() { return this.#contato; }
    set contato(novoContato) { this.#contato = novoContato; }

    get endereco() { return this.#endereco; }
    set endereco(novoEndereco) { this.#endereco = novoEndereco; }

    get cidade() { return this.#cidade; }
    set cidade(novaCidade) { this.#cidade = novaCidade; }

    get bairro() { return this.#bairro; }
    set bairro(novoBairro) { this.#bairro = novoBairro; }

    get estado() { return this.#estado; }
    set estado(novoEstado) { this.#estado = novoEstado; }

    get cep() { return this.#cep; }
    set cep(novoCep) { this.#cep = novoCep; }

    get criado_em() { return this.#criado_em; }
    set criado_em(novaData) { this.#criado_em = novaData; }

    get atualizado_em() { return this.#atualizado_em; }
    set atualizado_em(novaData) { this.#atualizado_em = novaData; }

    // Método para converter o objeto para JSON
    toJSON() {
        return {
            cpf: this.#cpf,
            nome: this.#nome,
            data_nascimento: this.#data_nascimento,
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
        const clienteDAO = new ClienteDAO();
        await clienteDAO.incluir(this);
    }

    async atualizar() {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.alterar(this);
    }

    async removerDoBancoDados(cpf) {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.excluir(this.#cpf);
    }

    async consultar(termo) {
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultar(termo);
    }

    async consultarPorCpf(cpf) {
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultarPorCpfPF(cpf);
    }
}
