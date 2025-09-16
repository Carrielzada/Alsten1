// BackEnd/Model/OrdemServico.js

class OrdemServico {
    constructor(id, cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, urgencia, tipoAnalise, tipoLacre, tipoLimpeza, tipoTransporte, formaPagamento, arquivosAnexados = [], etapa = 'Previsto', dataCriacao = new Date(), vendedor = null, diasPagamento = null, dataEntrega = null, dataAprovacaoOrcamento = null, diasReparo = null, dataEquipamentoPronto = null, informacoesConfidenciais = '', checklistItems = [], agendado = false, possuiAcessorio = false, tipoTransporteTexto = '', transporteCifFob = null, pedidoCompras = '', defeitoConstatado = '', servicoRealizar = '', valor = 0.00, etapaId = null, comprovanteAprovacao = '', notaFiscal = '', comprovante = '') {
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
        
        // Novos campos
        this.vendedor = vendedor?.id ? vendedor.id : vendedor;
        this.diasPagamento = diasPagamento?.id ? diasPagamento.id : diasPagamento;
        this.dataEntrega = dataEntrega;
        this.dataAprovacaoOrcamento = dataAprovacaoOrcamento;
        this.diasReparo = diasReparo;
        this.dataEquipamentoPronto = dataEquipamentoPronto;
        this.informacoesConfidenciais = informacoesConfidenciais;
        this.checklistItems = checklistItems; // Array de IDs dos itens do checklist
        this.agendado = agendado;
        this.possuiAcessorio = possuiAcessorio;
        this.tipoTransporteTexto = tipoTransporteTexto;
        this.transporteCifFob = transporteCifFob;
        this.pedidoCompras = pedidoCompras;
        this.defeitoConstatado = defeitoConstatado;
        this.servicoRealizar = servicoRealizar;
        this.valor = valor;
        this.etapaId = etapaId?.id ? etapaId.id : etapaId;
        this.comprovanteAprovacao = comprovanteAprovacao;
        this.notaFiscal = notaFiscal;
        this.comprovante = comprovante; // Campo para UMA imagem de comprovante
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

    // Método para adicionar item ao checklist
    adicionarChecklistItem(itemId) {
        if (!this.checklistItems.includes(itemId)) {
            this.checklistItems.push(itemId);
        }
    }

    // Método para remover item do checklist
    removerChecklistItem(itemId) {
        this.checklistItems = this.checklistItems.filter(id => id !== itemId);
    }

    // Método para calcular data de entrega baseada na aprovação do orçamento
    calcularDataEntrega() {
        if (this.dataAprovacaoOrcamento && this.diasReparo) {
            const dataAprovacao = new Date(this.dataAprovacaoOrcamento);
            let diasAdicionados = 0;
            let dataCalculada = new Date(dataAprovacao);
            
            while (diasAdicionados < this.diasReparo) {
                dataCalculada.setDate(dataCalculada.getDate() + 1);
                // Verificar se é dia útil (segunda a sexta)
                if (dataCalculada.getDay() !== 0 && dataCalculada.getDay() !== 6) {
                    diasAdicionados++;
                }
            }
            
            this.dataEquipamentoPronto = dataCalculada.toISOString().split('T')[0];
        }
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
            dataCriacao: this.dataCriacao,
            vendedor: this.vendedor,
            diasPagamento: this.diasPagamento,
            dataEntrega: this.dataEntrega,
            dataAprovacaoOrcamento: this.dataAprovacaoOrcamento,
            diasReparo: this.diasReparo,
            dataEquipamentoPronto: this.dataEquipamentoPronto,
            informacoesConfidenciais: this.informacoesConfidenciais,
            checklistItems: this.checklistItems,
            agendado: this.agendado,
            possuiAcessorio: this.possuiAcessorio,
            tipoTransporteTexto: this.tipoTransporteTexto,
            transporteCifFob: this.transporteCifFob,
            pedidoCompras: this.pedidoCompras,
            defeitoConstatado: this.defeitoConstatado,
            servicoRealizar: this.servicoRealizar,
            valor: this.valor,
            etapaId: this.etapaId,
            comprovanteAprovacao: this.comprovanteAprovacao,
            notaFiscal: this.notaFiscal,
            comprovante: this.comprovante
        };
    }
}

export default OrdemServico;