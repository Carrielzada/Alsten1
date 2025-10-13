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

export const buscarTodasOrdensServico = (pagina = 1, itensPorPagina = 25, termoBusca = '') => {
    const params = new URLSearchParams();
    params.append('pagina', pagina);
    params.append('itensPorPagina', itensPorPagina);
    
    if (termoBusca) {
        params.append('termo', termoBusca);
    }
    
    return fetchAutenticado(`/ordem-servico?${params.toString()}`);
};

/**
 * Consulta uma Ordem de Serviço específica pelo seu ID.
 * @param {string|number} id - O ID da Ordem de Serviço a ser consultada.
 */
export const consultarOrdemServicoPorId = (id) => {
    return fetchAutenticado(`/ordem-servico/${id}`);
};

/**
 * Busca logs de uma Ordem de Serviço específica.
 * @param {string|number} osId - O ID da Ordem de Serviço.
 */
export const buscarLogsOrdemServicoPorId = (osId) => {
    return fetchAutenticado(`/ordem-servico/${osId}/logs`);
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
    return fetchAutenticado(`/ordem-servico/anexar-arquivo/${osId}`, {
        method: 'POST',
        body: formData,
    });
};

/**
 * Anexa um comprovante (imagem) a uma Ordem de Serviço existente.
 * @param {string|number} osId - O ID da Ordem de Serviço.
 * @param {File} arquivo - O arquivo de imagem a ser anexado como comprovante.
 */
export const anexarComprovante = (osId, arquivo) => {
    const formData = new FormData();
    formData.append('comprovante', arquivo);

    return fetchAutenticado(`/ordem-servico/anexar-comprovante/${osId}`, {
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
    return fetchAutenticado(`/ordem-servico/${osId}/arquivo/${nomeArquivo}`, {
        method: 'DELETE',
    });
};

/**
 * Transiciona a etapa de uma Ordem de Serviço, com validações de negócio no servidor.
 * @param {string|number} osId
 * @param {{ novaEtapa?: string, novaEtapaId?: number }} payload
 */
export const transicionarEtapa = (osId, payload) => {
    return fetchAutenticado(`/ordem-servico/${osId}/transition`, {
        method: 'POST',
        body: payload,
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
    return fetchAutenticado('/logs');
};

// --- LOCK DE EDIÇÃO CONCORRENTE ---
export const adquirirLockOS = (osId) => {
    return fetchAutenticado(`/ordem-servico/${osId}/lock`, { method: 'POST' });
};

export const verificarLockOS = (osId) => {
    return fetchAutenticado(`/ordem-servico/${osId}/lock`, { method: 'GET' });
};

export const liberarLockOS = (osId) => {
    return fetchAutenticado(`/ordem-servico/${osId}/lock`, { method: 'DELETE' });
};

