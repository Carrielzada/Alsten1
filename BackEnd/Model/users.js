import UsersDAO from '../Service/UsersDAO.js';

export default class Users {
    #id;
    #nome;
    #email;
    #password;
    #role_id;
    #criado_em;
    #atualizado_em;

    constructor(id, nome, email, password, role_id, criado_em = null, atualizado_em = null) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#password = password;
        this.#role_id = role_id;
        this.#criado_em = criado_em;
        this.#atualizado_em = atualizado_em;
    }

    // Getters e Setters
    get id() { return this.#id; }
    set id(novoId) { this.#id = novoId; }

    get nome() { return this.#nome; }
    set nome(novoNome) { this.#nome = novoNome; }

    get email() { return this.#email; }
    set email(novoEmail) { this.#email = novoEmail; }

    get password() { return this.#password; }
    set password(novaSenha) { this.#password = novaSenha; }

    get role_id() { return this.#role_id; }
    set role_id(novoIdRole) { this.#role_id = novoIdRole; }

    get criado_em() { return this.#criado_em; }
    set criado_em(novaData) { this.#criado_em = novaData; }

    get atualizado_em() { return this.#atualizado_em; }
    set atualizado_em(novaData) { this.#atualizado_em = novaData; }

    // Método para converter o objeto para JSON
    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            email: this.#email,
            password: this.#password,
            role_id: this.#role_id,
            criado_em: this.#criado_em,
            atualizado_em: this.#atualizado_em,
        };
    }

    // Métodos de Persistência
    async gravar() {
        const usersDAO = new UsersDAO();
        await usersDAO.incluir(this);
    }

    async atualizar() {
        const usersDAO = new UsersDAO();
        await usersDAO.alterar(this);
    }

    async removerDoBancoDados(id) {
        const usersDAO = new UsersDAO();
        await usersDAO.excluir(this.#id);
    }

    async consultar(termo) {
        const usersDAO = new UsersDAO();
        return await usersDAO.consultar(termo);
    }

}
