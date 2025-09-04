import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaEye, FaDownload, FaTrash, FaFile } from 'react-icons/fa';
import './ImagePreview.css';

const ImagePreview = ({ arquivos, onVisualizar, onDownload, onRemover }) => {
  const isImage = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  const getFileIcon = (filename) => {
    const extensao = filename.split('.').pop().toLowerCase();
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

  const getImageUrl = (filename) => {
    return `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
  };

  if (!arquivos || arquivos.length === 0) {
    return (
      <div className="text-center py-4">
        <FaFile size={48} className="text-muted mb-3" />
        <p className="text-muted">Nenhum arquivo anexado</p>
      </div>
    );
  }

  return (
    <div className="image-preview-container">
      <div className="row g-3">
        {arquivos.map((arquivo, index) => {
          const isImageFile = isImage(arquivo);
          
          return (
            <div key={index} className="col-md-4 col-lg-3 col-sm-6">
              <Card className="h-100 image-preview-card">
                <div className="image-preview-wrapper">
                  {isImageFile ? (
                    <Card.Img
                      variant="top"
                      src={getImageUrl(arquivo)}
                      alt={arquivo}
                      className="image-preview-img"
                      onError={(e) => {
                        console.error(`Erro ao carregar imagem: ${arquivo}`);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log(`Imagem carregada com sucesso: ${arquivo}`);
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback para arquivos não-imagem ou imagens com erro */}
                  <div 
                    className={`image-preview-fallback ${isImageFile ? 'd-none' : 'd-flex'}`}
                  >
                    {getFileIcon(arquivo)}
                  </div>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="small text-truncate" title={arquivo}>
                    {arquivo}
                  </Card.Title>
                  
                  <div className="mt-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      {isImageFile && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => onVisualizar(index)}
                          title="Visualizar"
                        >
                          <FaEye size={12} />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => onDownload(arquivo)}
                        title="Baixar"
                      >
                        <FaDownload size={12} />
                      </Button>
                      
                      {onRemover && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => onRemover(arquivo)}
                          title="Remover"
                        >
                          <FaTrash size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagePreview; 