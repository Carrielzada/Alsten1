import fetchAutenticado from './apiService';

/**
 * Busca todos os defeitos alegados.
 */
export const buscarDefeitosAlegados = () => {
    return fetchAutenticado('/defeito-alegado');
};

/**
 * Adiciona um novo defeito alegado.
 * @param {object} defeitoAlegado - O objeto do defeito a ser adicionado.
 */
export const adicionarDefeitoAlegado = (defeitoAlegado) => {
    return fetchAutenticado('/defeito-alegado', {
        method: 'POST',
        body: defeitoAlegado, // Não precisa do JSON.stringify, o serviço já faz isso.
    });
};

/**
 * Atualiza um defeito alegado existente.
 * @param {object} defeitoAlegado - O objeto do defeito com o ID para atualizar.
 */
export const atualizarDefeitoAlegado = (defeitoAlegado) => {
    return fetchAutenticado('/defeito-alegado', { // Supondo que o ID está no corpo
        method: 'PUT',
        body: defeitoAlegado,
    });
};

/**
 * Exclui um defeito alegado pelo ID.
 * @param {string} id - O ID do defeito a ser excluído.
 */
export const excluirDefeitoAlegado = (id) => {
    return fetchAutenticado('/defeito-alegado', {
        method: 'DELETE',
        body: { id },
    });
};