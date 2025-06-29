import React from 'react';

const ListaArquivosAnexados = ({ arquivos, onRemoverArquivo }) => {
    const handleDownload = (nomeArquivo) => {
        // Assume que o backend serve os arquivos em /uploads
        const url = `http://localhost:4000/uploads/${nomeArquivo}`; // Ajuste a porta se necessário
        window.open(url, '_blank');
    };

    return (
        <div className="arquivos-anexados-container">
            <h4>Arquivos Anexados:</h4>
            <ul>
                {arquivos.map((nomeArquivo, index) => (
                    <li key={index}>
                        <span onClick={() => handleDownload(nomeArquivo)} style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                            {nomeArquivo}
                        </span>
                        <button type="button" onClick={() => onRemoverArquivo(nomeArquivo)}>
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaArquivosAnexados;