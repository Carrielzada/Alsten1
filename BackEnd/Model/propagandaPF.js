import PropagandaPFDAO from '../Service/PropagandaPFDAO.js';

export default class PropagandaPF {
    #id;
    #cliente_cpf;
    #cliente_nome;
    #nome;
    #canal;
    #valor;
    #data_emissao;
    #data_encerramento;    
    #duracao;
    #representante1_nome;
    #representante1_contato;
    #representante2_nome;
    #representante2_contato;
    #contrato_digital;
    #arquivos_adicionais;

    constructor(
        id, cliente_cpf, cliente_nome, nome, canal, valor, data_emissao, data_encerramento, duracao, representante1_nome, representante1_contato, representante2_nome, representante2_contato, contrato_digital, arquivos_adicionais
    ) {
        this.#id = id;
        this.#cliente_cpf = cliente_cpf ? cliente_cpf.replace(/\D/g, '') : null; // Remove caracteres não numéricos
        this.#cliente_nome = cliente_nome;
        this.#nome = nome;
        this.#canal = canal;
        this.#valor = valor;
        this.#data_emissao = data_emissao;
        this.#data_encerramento = data_encerramento;
        this.#duracao = duracao;
        this.#representante1_nome = representante1_nome;
        this.#representante1_contato = representante1_contato;
        this.#representante2_nome = representante2_nome;
        this.#representante2_contato = representante2_contato;
        this.#contrato_digital = contrato_digital;
        this.#arquivos_adicionais = arquivos_adicionais;
    }

    // Getters e Setters
    get id() { return this.#id; }
    set id(novoId) { this.#id = novoId; }

    get cliente_cpf() { return this.#cliente_cpf; }
    set cliente_cpf(cpf) {
        this.#cliente_cpf = cpf ? cpf.replace(/\D/g, '') : null;
    }

    get cliente_nome() { return this.#cliente_nome; }
    set cliente_nome(novoNome) { this.#cliente_nome = novoNome; }

    get nome() { return this.#nome; }
    set nome(novoNome) { this.#nome = novoNome; }

    get canal() { return this.#canal; }
    set canal(novoCanal) { this.#canal = novoCanal; }

    get valor() { return this.#valor; }
    set valor(novoValor) { this.#valor = novoValor; }

    get data_emissao() { return this.#data_emissao; }
    set data_emissao(novaData) { this.#data_emissao = novaData; }

    get data_encerramento() { return this.#data_encerramento; }
    set data_encerramento(novaDataEncerramento) { this.#data_encerramento = novaDataEncerramento; }

    get duracao() { return this.#duracao; }
    set duracao(novaDuracao) { this.#duracao = novaDuracao; }

    get representante1_nome() { return this.#representante1_nome; }
    set representante1_nome(nome) { this.#representante1_nome = nome; }

    get representante1_contato() { return this.#representante1_contato; }
    set representante1_contato(contato) { this.#representante1_contato = contato; }

    get representante2_nome() { return this.#representante2_nome; }
    set representante2_nome(nome) { this.#representante2_nome = nome; }

    get representante2_contato() { return this.#representante2_contato; }
    set representante2_contato(contato) { this.#representante2_contato = contato; }

    get contrato_digital() { return this.#contrato_digital; }
    set contrato_digital(novoContrato) { this.#contrato_digital = novoContrato; }

    get arquivos_adicionais() { return this.#arquivos_adicionais; }
    set arquivos_adicionais(novosArquivos) { this.#arquivos_adicionais = novosArquivos; }

    // Método para serializar a instância para JSON
    toJSON() {
        return {
            id: this.#id,
            cliente_cpf: this.#cliente_cpf,
            cliente_nome: this.#cliente_nome,
            nome: this.#nome,
            canal: this.#canal,
            valor: this.#valor,
            data_emissao: this.#data_emissao,
            data_encerramento: this.#data_encerramento,
            duracao: this.#duracao,
            representante1_nome: this.#representante1_nome,
            representante1_contato: this.#representante1_contato,
            representante2_nome: this.#representante2_nome,
            representante2_contato: this.#representante2_contato,
            contrato_digital: this.#contrato_digital,
            arquivos_adicionais: this.#arquivos_adicionais,
        };
    }

    // Métodos de Persistência
    async gravar() {
        const propagandaPFDAO = new PropagandaPFDAO();
        await propagandaPFDAO.incluir(this);
    }

    async atualizar() {
        const propagandaDAO = new PropagandaPFDAO();
        await propagandaDAO.alterar(this);
    }

    async excluir() {
        const propagandaPFDAO = new PropagandaPFDAO();
        await propagandaPFDAO.excluir(this.#id);
    }

    async consultar(termo = '') {
        const propagandaPFDAO = new PropagandaPFDAO();
        return await propagandaPFDAO.consultar(termo);
    }

    async consultarPorId(id) {
        const propagandaPFDAO = new PropagandaPFDAO();
        return await propagandaPFDAO.consultarPorId(id);
    }

    async alterarArquivosAdicionais(id, novosArquivos) {
        const propagandaPFDAO = new PropagandaPFDAO();
        return await propagandaPFDAO.atualizarArquivosAdicionais(id, novosArquivos);
    }
}
