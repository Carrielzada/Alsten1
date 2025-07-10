// BackEnd/Model/OrdemServico.js

class OrdemServico {
    constructor(id, cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, urgencia, tipoAnalise, tipoLacre, tipoLimpeza, tipoTransporte, formaPagamento, arquivosAnexados = [], etapa = 'Previsto', dataCriacao = new Date()) {
        this.id = id;
        this.cliente = cliente?.id ? cliente.id : cliente;
        this.modeloEquipamento = modeloEquipamento?.id ? modeloEquipamento.id : modeloEquipamento;
        this.defeitoAlegado = defeitoAlegado;
        this.numeroSerie = numeroSerie;
        this.fabricante = fabricante?.id ? fabricante.id : fabricante;
        this.urgencia = urgencia?.id ? urgencia.id : urgencia;
        this.tipoAnalise = tipoAnalise?.id ? tipoAnalise.id : tipoAnalise;
        this.tipoLacre = tipoLacre?.id ? tipoLacre.id : tipoLacre;
        this.tipoLimpeza = tipoLimpeza?.id ? tipoLimpeza.id : tipoLimpeza;
        this.tipoTransporte = tipoTransporte?.id ? tipoTransporte.id : tipoTransporte;
        this.formaPagamento = formaPagamento?.id ? formaPagamento.id : formaPagamento;
        this.arquivosAnexados = arquivosAnexados; // Esta propriedade será um array de strings
        this.etapa = etapa;
        this.dataCriacao = dataCriacao;
    }

    // Método para adicionar um arquivo à lista
    adicionarArquivo(caminhoArquivo) {
        this.arquivosAnexados.push(caminhoArquivo);
    }

    // Método para remover um arquivo da lista
    removerArquivo(caminhoArquivo) {
        this.arquivosAnexados = this.arquivosAnexados.filter(caminho => caminho !== caminhoArquivo);
    }

    // Método para mudar a etapa da OS
    mudarEtapa(novaEtapa) {
        this.etapa = novaEtapa;
    }

    toJSON() {
        return {
            id: this.id,
            cliente: this.cliente,
            modeloEquipamento: this.modeloEquipamento,
            defeitoAlegado: this.defeitoAlegado,
            numeroSerie: this.numeroSerie,
            fabricante: this.fabricante,
            urgencia: this.urgencia,
            tipoAnalise: this.tipoAnalise,
            tipoLacre: this.tipoLacre,
            tipoLimpeza: this.tipoLimpeza,
            tipoTransporte: this.tipoTransporte,
            formaPagamento: this.formaPagamento,
            arquivosAnexados: this.arquivosAnexados,
            etapa: this.etapa,
            dataCriacao: this.dataCriacao
        };
    }
}

export default OrdemServico;