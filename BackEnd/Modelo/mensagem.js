import MensagemDAO from '../Persistencia/mensagemDAO.js';
export default class mensagem {
    #id
    #user_id
    #referencia_id
    #tipo_referencia
    #nome_user
    #cliente_nome
    #mensagem
    #arquivo
    #status
    #data_hora

    constructor (id, user_id, referencia_id, tipo_referencia, nome_user, cliente_nome, mensagem, arquivo, status, data_hora) {

        this.#id = id;
        this.#user_id = user_id;
        this.#referencia_id = referencia_id;
        this.#tipo_referencia = tipo_referencia;
        this.#nome_user = nome_user;
        this.#cliente_nome = cliente_nome;
        this.#mensagem = mensagem;
        this.#arquivo = arquivo;
        this.#status = status;
        this.#data_hora = data_hora;
    }

    get id(){
        return this.#id;
    }
    set id(novoId){
        this.#id = novoId;
    }
    get user_id(){
        return this.#user_id;
    }
    set user_id(novoId){
        this.#user_id = novoId;
    }
    get referencia_id() {
        return this.#referencia_id;
    }
    set referencia_id(novoReferencia_id) {
        this.#referencia_id = novoReferencia_id;
    }
    get tipo_referencia() {
        return this.#tipo_referencia;
    }
    set tipo_referencia(novoTipoReferencia) {
        this.#tipo_referencia = novoTipoReferencia;
    }
    get nome_user() {
        return this.#nome_user;
    }
    set nome_user(novoNomeUser) {
        this.#nome_user = novoNomeUser;
    }

    get cliente_nome() {
        return this.#cliente_nome;
    }
    set cliente_nome(novoClienteNome){
        this.#cliente_nome = novoClienteNome;
    }
    get mensagem(){
        return this.#mensagem;
    }
    set mensagem(novaMensagem){
        this.#mensagem = novaMensagem;
    }
    get arquivo(){
        return this.#arquivo;
    }
    set arquivo(novoArquivo){
        this.#arquivo = novoArquivo
    }
    get status(){
        return this.#status;
    }
    set status(novoStatus){
        this.#status = novoStatus;
    }
    get data_hora(){
        return this.#data_hora;
    }
    set data_hora(novoDataHora){
        this.#data_hora = novoDataHora;
    }

    toJson() {
        return {
            id: this.#id,
            user_id: this.#user_id,
            referencia_id: this.#referencia_id,
            tipo_referencia: this.#tipo_referencia,
            nome_user: this.#nome_user,
            cliente_nome: this.#cliente_nome,
            mensagem: this.#mensagem,
            arquivo: this.#arquivo,
            status: this.#status,
            data_hora: this.#data_hora
        }
    }

    async gravar() {
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.incluir(this);
    }
    
    async atualizar() {
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.alterar(this);
    }

    async removerDoBancoDados() {
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.excluir(this.#id);
    }

    async consultar(termo) {
        const mensagemDAO = new MensagemDAO();
        return await mensagemDAO.consultar(termo);
    }

    async consultarPorId(id) {
        const mensagemDAO = new MensagemDAO();
        return await mensagemDAO.consultarPorId(id);
    }

    async atualizarStatus(novoStatus) {
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.atualizarStatus(this.#id, novoStatus);
    }
    
    async consultarPorStatus(status) {
        const mensagemDAO = new MensagemDAO();
        return await mensagemDAO.consultarPorStatus(status);
    }
    

}