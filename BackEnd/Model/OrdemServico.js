// Arquivo: /home/ubuntu/project_Alsten/BackEnd/Modelo/OrdemServico.js

class OrdemServico {
    constructor(id, cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, arquivosAnexados = [], etapa = 'Previsto') {
        this.id = id; // ID da OS (pode ser gerado automaticamente)
        this.cliente = cliente; // Nome ou ID do cliente
        this.modeloEquipamento = modeloEquipamento; // ID ou nome do modelo
        this.defeitoAlegado = defeitoAlegado;
        this.numeroSerie = numeroSerie;
        this.fabricante = fabricante;
        this.arquivosAnexados = arquivosAnexados; // Array para caminhos dos arquivos
        this.etapa = etapa; // Etapa inicial do fluxo da OS
        this.dataCriacao = new Date();
        // Outros campos conforme necessidade do MVP e evolução
    }

    // Método para adicionar um arquivo à OS
    adicionarArquivo(filePath) {
        if (filePath) {
            this.arquivosAnexados.push(filePath);
            console.log(`Arquivo ${filePath} associado à OS ${this.id}`);
        }
    }

    // Método para mudar a etapa da OS
    mudarEtapa(novaEtapa) {
        this.etapa = novaEtapa;
        console.log(`OS ${this.id} movida para a etapa: ${novaEtapa}`);
        // Adicionar lógica de log de alteração de etapa aqui no futuro
    }
}

export default OrdemServico; // Alterado para export default

