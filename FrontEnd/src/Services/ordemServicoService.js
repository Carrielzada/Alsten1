import fetchAutenticado from './apiService';

/**
 * Adiciona um novo defeito alegado.
 * @param {object} ordemServico - O objeto do defeito a ser adicionado.
 */
export const gravarOrdemServico = (ordemServico) => {
    return fetchAutenticado('/ordem-servico', {
        method: 'POST',
        body: ordemServico, // Não precisa do JSON.stringify, o serviço já faz isso.
    });
};

export const buscarTodasOrdensServico = () => {
    return fetchAutenticado('/ordem-servico');
};

/**
 * Consulta uma Ordem de Serviço específica pelo seu ID.
 * @param {string} id - O ID da Ordem de Serviço a ser consultada.
 */
export const consultarOrdemServicoPorId = (id) => {
    // Para um GET, basta passar o endpoint. A autenticação é adicionada automaticamente.
    return fetchAutenticado(`/ordem-servico/${id}`);
};

/**
 * Anexa um arquivo a uma Ordem de Serviço existente.
 * @param {string} osId - O ID da Ordem de Serviço.
 * @param {File} arquivo - O arquivo a ser anexado.
 */
export const anexarArquivo = (osId, arquivo) => {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return fetchAutenticado(`/ordem-servico/${osId}/anexar`, {
        method: 'POST',
        body: formData, // O apiService não usa JSON.stringify em FormData
    });
};

/**
 * Remove um arquivo de uma Ordem de Serviço.
 * @param {string} osId - O ID da Ordem de Serviço.
 * @param {string} nomeArquivo - O nome do arquivo a ser removido.
 */
export const removerArquivo = (osId, nomeArquivo) => {
    return fetchAutenticado(`/ordem-servico/${osId}/remover-arquivo`, {
        method: 'DELETE',
        body: { nomeArquivo },
    });
};

/**
 * Exclui um defeito alegado pelo ID.
 * @param {string} id - O ID do defeito a ser excluído.
 */
export const excluirOrdemServico = (id) => {
    return fetchAutenticado('/ordem-servico', {
        method: 'DELETE',
        body: { id },
    });
};