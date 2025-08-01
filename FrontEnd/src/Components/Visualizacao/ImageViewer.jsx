import React, { useState, useEffect } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { FaEye, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageViewer = ({ images, currentIndex = 0, show, onHide, onRemove }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  // Filtra apenas imagens
  const imageFiles = images.filter(filename => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  });

  // Sincroniza o índice quando o modal é aberto
  useEffect(() => {
    if (show) {
      // Encontra o índice da imagem no array filtrado
      const originalImage = images[currentIndex];
      const imageIndex = imageFiles.findIndex(img => img === originalImage);
      setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    }
  }, [show, currentIndex, images, imageFiles]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageFiles.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === imageFiles.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape') {
      onHide();
    }
  };

  const isImage = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  const getImageUrl = (filename) => {
    return `http://localhost:4000/uploads/${filename}`;
  };

  if (!images || images.length === 0) return null;

  // Se não há imagens, mostra mensagem
  if (imageFiles.length === 0) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Nenhuma imagem encontrada</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <div className="mb-3">
            <FaTimes size={48} className="text-muted" />
          </div>
          <h5>Nenhuma imagem para visualizar</h5>
          <p className="text-muted">
            Os arquivos anexados não são imagens ou não foram encontrados.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const currentImage = imageFiles[currentImageIndex];
  const isCurrentImage = isImage(currentImage);

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Visualizando: {currentImage}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-0">
        {isCurrentImage ? (
          <div className="position-relative">
            <Image
              src={getImageUrl(currentImage)}
              alt={currentImage}
              fluid
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
            
            {/* Navegação */}
            {imageFiles.length > 1 && (
              <>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="position-absolute top-50 start-0 translate-middle-y ms-2"
                  onClick={handlePrevious}
                  style={{ zIndex: 1000 }}
                >
                  <FaChevronLeft />
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="position-absolute top-50 end-0 translate-middle-y me-2"
                  onClick={handleNext}
                  style={{ zIndex: 1000 }}
                >
                  <FaChevronRight />
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <div className="mb-3">
              <FaTimes size={48} className="text-muted" />
            </div>
            <h5>Arquivo não é uma imagem</h5>
            <p className="text-muted">
              Este arquivo não pode ser visualizado como imagem.
              <br />
              <small>Arquivo: {currentImage}</small>
            </p>
            <Button variant="primary" onClick={() => window.open(getImageUrl(currentImage), '_blank')}>
              Baixar Arquivo
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            {imageFiles.length > 1 && (
              <span className="text-muted">
                {currentImageIndex + 1} de {imageFiles.length}
              </span>
            )}
          </div>
          <div>
            <Button variant="outline-secondary" onClick={onHide}>
              Fechar
            </Button>
            {onRemove && (
              <Button 
                variant="outline-danger" 
                onClick={() => onRemove(currentImage)}
                className="ms-2"
              >
                <FaTimes className="me-1" />
                Remover
              </Button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageViewer; 