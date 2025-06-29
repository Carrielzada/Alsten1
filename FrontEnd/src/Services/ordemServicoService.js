const API_URL = "http://localhost:4000";

export const gravarOrdemServico = async (osData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(osData),
        });

        if (!response.ok) {
            throw new Error(`Erro ao salvar a Ordem de Serviço: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export const consultarTodasOrdensServico = async (termo = '') => {
    try {
        const response = await fetch(`${API_URL}?termo=${termo}`);
        if (!response.ok) {
            throw new Error('Erro ao consultar as Ordens de Serviço.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export const consultarOrdemServicoPorId = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao consultar a Ordem de Serviço.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export const anexarArquivo = async (osId, arquivo) => {
    try {
        const formData = new FormData();
        formData.append('arquivo', arquivo);

        const response = await fetch(`${API_URL}/anexar-arquivo/${osId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensagem || 'Erro ao anexar o arquivo.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export const removerArquivo = async (osId, nomeArquivo) => {
    try {
        const response = await fetch(`${API_URL}/${osId}/arquivo/${nomeArquivo}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Erro ao remover o arquivo: ${response.statusText}`);
        }
        
        return response.ok; // Retorna true se a remoção foi bem-sucedida
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export const excluirOrdemServico = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao excluir a Ordem de Serviço.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};