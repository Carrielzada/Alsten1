import React, { useState, useRef } from 'react';
import { Button, Card, Row, Col, Modal, Image, Alert } from 'react-bootstrap';
import { FaCamera, FaImage, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import './MobileImageUpload.css';

const MobileImageUpload = ({ 
    arquivos = [], 
    onFileSelect, 
    onFileRemove, 
    onFileView,
    maxFiles = 10,
    acceptedTypes = "image/*"
}) => {
    // Debug: verificar estrutura dos dados
    console.log('MobileImageUpload - arquivos:', arquivos);
    console.log('MobileImageUpload - tipo de arquivos:', typeof arquivos);
    console.log('MobileImageUpload - é array?', Array.isArray(arquivos));
    const [showPreview, setShowPreview] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files || []);
        
        if (!arquivos || !Array.isArray(arquivos)) {
            console.warn('arquivos não é um array válido:', arquivos);
            return;
        }
        
        if (arquivos.length + files.length > maxFiles) {
            alert(`Máximo de ${maxFiles} arquivos permitidos`);
            return;
        }

        files.forEach(file => {
            if (file && file.type && file.type.startsWith('image/')) {
                onFileSelect(file);
            }
        });
    };

    const handleImageClick = (file, index) => {
        setSelectedImage({ file, index });
        setShowPreview(true);
    };

    const getImageUrl = (filename) => {
        return `process.env.REACT_APP_API_URL + "/uploads/"${filename}`;
    };

    const isImageFile = (filename) => {
        if (!filename || typeof filename !== 'string') {
            return false;
        }
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    return (
        <div className="mobile-image-upload">
            {/* Botão de Upload Principal */}
            <Card className="upload-card mb-3">
                <Card.Body className="text-center p-4">
                    <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                        <FaCamera className="upload-icon" />
                        <h5 className="mt-2">Tirar Foto ou Selecionar</h5>
                        <p className="text-muted">
                            Toque para abrir a câmera ou galeria
                        </p>
                        <Button 
                            variant="outline-primary" 
                            size="lg"
                            className="upload-btn"
                        >
                            <FaImage className="me-2" />
                            Adicionar Imagem
                        </Button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={acceptedTypes}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        capture="environment" // Abre câmera traseira por padrão
                    />
                </Card.Body>
            </Card>

            {/* Lista de Imagens */}
            {arquivos && Array.isArray(arquivos) && arquivos.length > 0 && (
                <div className="images-grid">
                    <h6 className="mb-3">
                        <FaImage className="me-2" />
                        Imagens Anexadas ({arquivos.length})
                    </h6>
                    
                    <Row>
                        {arquivos.map((arquivo, index) => (
                            <Col key={index} xs={6} sm={4} md={3} className="mb-3">
                                <Card className="image-card h-100">
                                    {isImageFile(arquivo?.name) ? (
                                        <div className="image-container">
                                            <Image
                                                src={getImageUrl(arquivo?.name || '')}
                                                alt={arquivo?.name || 'Imagem'}
                                                className="image-preview"
                                                onClick={() => handleImageClick(arquivo, index)}
                                            />
                                            <div className="image-overlay">
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() => handleImageClick(arquivo, index)}
                                                    className="overlay-btn"
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onFileRemove(arquivo?.name || '')}
                                                    className="overlay-btn"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Card.Body className="text-center">
                                            <FaImage className="file-icon" />
                                            <small className="d-block text-muted">
                                                {arquivo?.name || 'Arquivo'}
                                            </small>
                                        </Card.Body>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Modal de Preview */}
            <Modal 
                show={showPreview} 
                onHide={() => setShowPreview(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Visualizar Imagem</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedImage && (
                        <Image
                            src={getImageUrl(selectedImage.file?.name || '')}
                            alt={selectedImage.file?.name || 'Imagem'}
                            fluid
                            className="preview-image"
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowPreview(false)}
                    >
                        Fechar
                    </Button>
                    {selectedImage && (
                        <Button 
                            variant="primary"
                            onClick={() => {
                                const url = getImageUrl(selectedImage.file?.name || '');
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = selectedImage.file?.name || 'imagem';
                                link.click();
                            }}
                        >
                            <FaDownload className="me-2" />
                            Download
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MobileImageUpload; 