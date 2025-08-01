import React, { useState } from 'react';
import { Button, ListGroup, Badge } from 'react-bootstrap';
import { FaDownload, FaTrash, FaFile, FaEye } from 'react-icons/fa';
import ImageViewer from './ImageViewer';
import ImagePreview from './ImagePreview';

const ListaArquivosAnexados = ({ arquivos, onRemoverArquivo }) => {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDownload = (nomeArquivo) => {
    // Assume que o backend serve os arquivos em /uploads na porta 4000
    const url = `http://localhost:4000/uploads/${nomeArquivo}`;
    window.open(url, '_blank');
  };

  const handleVisualizar = (index) => {
    // Filtra apenas imagens para o modal
    const imageFiles = arquivos.filter(isImage);
    const clickedFile = arquivos[index];
    
    // Se o arquivo clicado não é uma imagem, não abre o modal
    if (!isImage(clickedFile)) {
      return;
    }
    
    // Encontra o índice da imagem no array filtrado
    const imageIndex = imageFiles.findIndex(img => img === clickedFile);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setShowImageViewer(true);
  };

  const handleRemover = (nomeArquivo) => {
    if (onRemoverArquivo) {
      onRemoverArquivo(nomeArquivo);
    }
  };

  const isImage = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  const getFileIcon = (nomeArquivo) => {
    const extensao = nomeArquivo.split('.').pop().toLowerCase();
    switch (extensao) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return '🖼️';
      case 'doc':
      case 'docx':
        return '📝';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📎';
    }
  };

  if (!arquivos || arquivos.length === 0) {
    return (
      <div className="text-muted text-center py-3">
        <FaFile className="mb-2" size={24} />
        <p>Nenhum arquivo anexado</p>
      </div>
    );
  }

  // Verifica se há imagens para mostrar preview
  const hasImages = arquivos.some(isImage);

  return (
    <div className="arquivos-anexados-container">
      <h6 className="mb-2">
        <FaFile className="me-2" />
        Arquivos Anexados ({arquivos.length})
      </h6>
      
      {/* Se há imagens, mostra o preview em grid */}
      {hasImages ? (
        <ImagePreview
          arquivos={arquivos}
          onVisualizar={handleVisualizar}
          onDownload={handleDownload}
          onRemover={handleRemover}
        />
      ) : (
        /* Se não há imagens, mostra lista simples */
        <ListGroup>
          {arquivos.map((nomeArquivo, index) => (
            <ListGroup.Item 
              key={index}
              className="d-flex justify-content-between align-items-center"
              style={{ fontSize: '0.9rem' }}
            >
              <div className="d-flex align-items-center">
                <span className="me-2">{getFileIcon(nomeArquivo)}</span>
                <span 
                  onClick={() => handleDownload(nomeArquivo)} 
                  style={{ cursor: 'pointer', color: '#007bff' }}
                  className="text-decoration-underline"
                >
                  {nomeArquivo}
                </span>
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => handleDownload(nomeArquivo)}
                >
                  <FaDownload size={12} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemover(nomeArquivo)}
                >
                  <FaTrash size={12} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal para visualizar imagens */}
      <ImageViewer
        images={arquivos.filter(isImage)}
        currentIndex={currentImageIndex}
        show={showImageViewer}
        onHide={() => setShowImageViewer(false)}
        onRemove={handleRemover}
      />
    </div>
  );
};

export default ListaArquivosAnexados;