import React, { useState, useRef } from 'react';
import { Button, Card, Image, Modal } from 'react-bootstrap';
import { FaCamera, FaImage, FaTrash, FaEye, FaDownload, FaUpload } from 'react-icons/fa';
import './MobileImageUpload.css';

const ComprovanteUpload = ({ 
    arquivo = null, 
    onFileSelect, 
    onFileRemove,
    disabled = false,
    acceptedTypes = "image/*",
    style = {}
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files || []);
        
        if (files.length > 0) {
            const file = files[0]; // Pega apenas o primeiro arquivo
            if (file && file.type && file.type.startsWith('image/')) {
                onFileSelect(file);
            } else {
                alert('Por favor, selecione apenas arquivos de imagem.');
            }
        }
    };

    const getImageUrl = (filename) => {
        return `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
    };

    const isImageFile = (filename) => {
        if (!filename || typeof filename !== 'string') {
            return false;
        }
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    return (
        <div className="comprovante-upload" style={style}>
            {/* Área de Upload ou Visualização */}
            <Card className="upload-card mb-3">
                <Card.Body className="p-3">
                    <h6 className="mb-3">
                        <FaImage className="me-2" />
                        Comprovante de Aprovação
                    </h6>
                    
                    {!arquivo ? (
                        // Área de upload quando não há arquivo
                        <div 
                            className={`upload-area ${disabled ? 'disabled' : ''}`} 
                            onClick={() => !disabled && fileInputRef.current?.click()}
                            style={{ height: '180px', opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                        >
                            <FaCamera className="upload-icon" style={{ fontSize: '2rem' }} />
                            <p className="mt-2 mb-1">Adicionar Comprovante</p>
                            <small className="text-muted">
                                {disabled ? 'Salve a OS primeiro para anexar' : 'Toque para selecionar uma imagem'}
                            </small>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="mt-2"
                                disabled={disabled}
                            >
                                <FaUpload className="me-1" size={14} />
                                Selecionar
                            </Button>
                        </div>
                    ) : (
                        // Visualização quando há arquivo
                        <div className="image-preview-container">
                            {isImageFile(arquivo?.name) ? (
                                <div className="image-container position-relative">
                                    <Image
                                        src={getImageUrl(arquivo?.name || '')}
                                        alt="Comprovante"
                                        className="comprovante-preview"
                                        style={{ 
                                            maxHeight: '180px', 
                                            width: '100%', 
                                            objectFit: 'contain' 
                                        }}
                                        onClick={() => setShowPreview(true)}
                                    />
                                    <div className="image-actions position-absolute" style={{ top: '5px', right: '5px' }}>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="me-1 p-1"
                                            onClick={() => setShowPreview(true)}
                                            disabled={disabled}
                                        >
                                            <FaEye size={14} />
                                        </Button>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="p-1"
                                            onClick={() => onFileRemove()}
                                            disabled={disabled}
                                        >
                                            <FaTrash size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <FaImage className="mb-2" size={32} />
                                    <p>Formato de arquivo não suportado</p>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => onFileRemove()}
                                        disabled={disabled}
                                    >
                                        <FaTrash className="me-1" size={14} />
                                        Remover
                                    </Button>
                                </div>
                            )}
                            <div className="mt-2 text-center">
                                <small className="text-muted d-block mb-2">
                                    {arquivo?.name || 'Comprovante'}
                                </small>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => !disabled && fileInputRef.current?.click()}
                                    disabled={disabled}
                                >
                                    <FaUpload className="me-1" size={14} />
                                    Alterar
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedTypes}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        capture="environment" // Abre câmera traseira por padrão
                        disabled={disabled}
                    />
                </Card.Body>
            </Card>

            {/* Modal de Preview */}
            <Modal 
                show={showPreview} 
                onHide={() => setShowPreview(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Comprovante de Aprovação</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {arquivo && (
                        <Image
                            src={getImageUrl(arquivo?.name || '')}
                            alt={arquivo?.name || 'Comprovante'}
                            fluid
                            className="preview-image"
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setShowPreview(false)}
                    >
                        Fechar
                    </Button>
                    {arquivo && (
                        <Button 
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                const url = getImageUrl(arquivo?.name || '');
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = arquivo?.name || 'comprovante';
                                link.click();
                            }}
                        >
                            <FaDownload className="me-1" size={14} />
                            Download
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ComprovanteUpload;