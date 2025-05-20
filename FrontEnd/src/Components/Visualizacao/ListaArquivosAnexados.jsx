import React from 'react';

const ListaArquivosAnexados = ({ arquivos }) => {
    if (!arquivos || arquivos.length === 0) {
        return <p>Nenhum arquivo anexado.</p>;
    }

    // Função para obter o nome do arquivo a partir do caminho completo
    const getNomeArquivo = (filePath) => {
        if (!filePath) return '';
        return filePath.substring(filePath.lastIndexOf('/') + 1);
    };

    return (
        <div>
            <h4>Arquivos Anexados:</h4>
            <ul>
                {arquivos.map((arquivo, index) => {
                    // O backend precisa servir estes arquivos. A URL base pode precisar de ajuste.
                    // Exemplo: http://localhost:4000/uploads/nome-do-arquivo.pdf
                    // O filePath retornado pelo backend é o caminho absoluto no servidor.
                    // Precisamos de uma rota no backend para servir esses arquivos ou de um URL público.
                    // Por agora, vamos assumir que o backend servirá de /uploads/<nome-do-arquivo>
                    const nomeArquivo = getNomeArquivo(arquivo.filePath || arquivo); // Suporta objeto ou string
                    const urlArquivo = `http://localhost:4000/uploads/${nomeArquivo}`;
                    
                    return (
                        <li key={index}>
                            <a href={urlArquivo} target="_blank" rel="noopener noreferrer">
                                {nomeArquivo}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ListaArquivosAnexados;

