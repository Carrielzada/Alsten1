// Corrected BackEnd/Service/ordemServicoService.js

import fetchAutenticado from './apiService';

/**
 * Adiciona ou atualiza uma Ordem de Serviço.
 * @param {object} ordemServico - O objeto da OS a ser salvo.
 */
export const gravarOrdemServico = (ordemServico) => {
    const isUpdate = !!ordemServico.id;
    const method = isUpdate ? 'PUT' : 'POST';
    const endpoint = isUpdate ? `/ordem-servico/${ordemServico.id}` : '/ordem-servico';

    return fetchAutenticado(endpoint, {
        method: method,
        // FIX: Pass the raw JavaScript object directly. 
        // 'fetchAutenticado' will handle JSON.stringify for us.
        body: ordemServico,
    });
};

export const buscarTodasOrdensServico = () => {
    return fetchAutenticado('/ordem-servico');
};

/**
 * Consulta uma Ordem de Serviço específica pelo seu ID.
 * @param {string|number} id - O ID da Ordem de Serviço a ser consultada.
 */
export const consultarOrdemServicoPorId = (id) => {
    return fetchAutenticado(`/ordem-servico/${id}`);
};

/**
 * Anexa um arquivo a uma Ordem de Serviço existente.
 * @param {string|number} osId - O ID da Ordem de Serviço.
 * @param {File} arquivo - O arquivo a ser anexado.
 */
export const anexarArquivo = (osId, arquivo) => {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    // This function remains correct, as FormData is handled properly.
    return fetchAutenticado(`/ordem-servico/${osId}/anexar`, {
        method: 'POST',
        body: formData,
    });
};

/**
 * Remove um arquivo de uma Ordem de Serviço.
 * @param {string|number} osId - O ID da Ordem de Serviço.
 * @param {string} nomeArquivo - O nome do arquivo a ser removido.
 */
export const removerArquivo = (osId, nomeArquivo) => {
    return fetchAutenticado(`/ordem-servico/${osId}/remover-arquivo`, {
        method: 'DELETE',
        // FIX: Pass the raw JavaScript object directly.
        body: { nomeArquivo },
    });
};

/**
 * Exclui uma Ordem de Serviço pelo ID.
 * @param {string|number} id - O ID da OS a ser excluída.
 */
export const excluirOrdemServico = (id) => {
    return fetchAutenticado(`/ordem-servico/${id}`, {
        method: 'DELETE',
    });
};

/**
 * Busca logs de uma Ordem de Serviço.
 */
export const buscarLogsOrdemServico = () => {
    return fetchAutenticado('/ordem-servico/logs');
};

