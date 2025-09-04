import React, { useState } from 'react';
import axios from 'axios';

const FormUploadArquivo = ({ osId, onUploadSuccess }) => { // Adicionado osId como prop
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [mensagemUpload, setMensagemUpload] = useState('');

    const handleSelecaoArquivo = (event) => {
        setArquivoSelecionado(event.target.files[0]);
        setMensagemUpload('');
    };

    const handleUploadArquivo = async () => {
        if (!arquivoSelecionado) {
            setMensagemUpload('Por favor, selecione um arquivo primeiro.');
            return;
        }

        const formData = new FormData();
        formData.append('arquivo', arquivoSelecionado);
        if (osId) { // Adiciona osId ao FormData se estiver presente
            formData.append('osId', osId);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': `Bearer ${seuToken}` // Descomente se necessário
                },
                withCredentials: true
            });
            setMensagemUpload(response.data.message);
            if (onUploadSuccess && response.data.filePath) {
                onUploadSuccess(response.data.filePath, response.data.osId); // Passa filePath e osId
            }
        } catch (error) {
            console.error('Erro no upload do arquivo:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setMensagemUpload(`Erro: ${error.response.data.error}`);
            } else {
                setMensagemUpload('Erro ao enviar o arquivo. Tente novamente.');
            }
        }
    };

    return (
        <div>
            <h3>Upload de Arquivo{osId ? ` para OS ID: ${osId}` : ''}</h3>
            <input type="file" onChange={handleSelecaoArquivo} />
            <button onClick={handleUploadArquivo} disabled={!arquivoSelecionado}>
                Enviar Arquivo
            </button>
            {mensagemUpload && <p>{mensagemUpload}</p>}
            {arquivoSelecionado && (
                <div>
                    <p>Arquivo selecionado: {arquivoSelecionado.name}</p>
                    <p>Tamanho: {Math.round(arquivoSelecionado.size / 1024)} KB</p>
                </div>
            )}
        </div>
    );
};

export default FormUploadArquivo;

