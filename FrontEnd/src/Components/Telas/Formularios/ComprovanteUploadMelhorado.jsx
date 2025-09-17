import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import Button from '../UI/Button';
import { FaTimes, FaUpload } from 'react-icons/fa';

const ComprovanteUploadMelhorado = ({ 
    arquivo, 
    onFileSelect, 
    onFileRemove, 
    disabled = false, 
    acceptedTypes = "image/*,.pdf", 
    label = "Comprovante",
    description = "Apenas imagens ou PDF - Máximo 5MB",
    style = {},
    required = false
}) => {
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validar tipo de arquivo
            if (acceptedTypes.includes('image/*') && acceptedTypes.includes('.pdf')) {
                // Aceita imagens e PDF
                const isValidImage = file.type.startsWith('image/');
                const isValidPDF = file.type === 'application/pdf';
                
                if (!isValidImage && !isValidPDF) {
                    alert('Por favor, selecione apenas imagens (JPG, PNG, GIF) ou arquivos PDF.');
                    e.target.value = '';
                    return;
                }
            } else if (acceptedTypes.includes('image/*')) {
                // Apenas imagens
                if (!file.type.startsWith('image/')) {
                    alert('Por favor, selecione apenas arquivos de imagem.');
                    e.target.value = '';
                    return;
                }
            } else if (acceptedTypes.includes('.pdf')) {
                // Apenas PDF
                if (file.type !== 'application/pdf') {
                    alert('Por favor, selecione apenas arquivos PDF.');
                    e.target.value = '';
                    return;
                }
            }
            
            // Validar tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('O arquivo deve ter no máximo 5MB.');
                e.target.value = '';
                return;
            }
            
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleRemove = () => {
        if (onFileRemove) {
            onFileRemove();
        }
        // Limpar o input file
        const fileInput = document.querySelector(`input[name="comprovante-upload"]`);
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const renderPreview = () => {
        if (!arquivo) return null;

        const isFile = arquivo instanceof File;
        const fileName = isFile ? arquivo.name : arquivo;
        const isImage = isFile ? 
            arquivo.type.startsWith('image/') : 
            /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName);

        if (isImage) {
            const src = isFile ? 
                URL.createObjectURL(arquivo) : 
                `${process.env.REACT_APP_API_URL}/uploads/${arquivo}`;

            return (
                <div className="comprovante-preview">
                    <p className="mb-2 text-center"><strong>Arquivo Selecionado:</strong></p>
                    <div className="image-preview-container">
                        <img 
                            src={src}
                            alt="Comprovante" 
                            className="image-preview"
                        />
                        <div className="image-overlay">
                            <button 
                                type="button"
                                className="overlay-button"
                                onClick={handleRemove}
                                title="Remover comprovante"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    <small className="text-muted d-block text-center mt-2">
                        {fileName}
                    </small>
                </div>
            );
        } else {
            // Para PDFs ou outros arquivos
            return (
                <div className="comprovante-preview">
                    <p className="mb-2 text-center"><strong>Arquivo Selecionado:</strong></p>
                    <div className="file-preview-container">
                        <div className="file-icon-large">📄</div>
                        <p className="file-name-large">{fileName}</p>
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={handleRemove}
                            className="mt-2"
                        >
                            <FaTimes className="me-1" />
                            Remover
                        </Button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="comprovante-section">
            <div className="comprovante-upload">
                <Form.Group>
                    <Form.Label>
                        {label}
                        {required && <span className="text-danger"> *</span>}
                    </Form.Label>
                    
                    <div className="upload-area">
                        <Form.Control
                            type="file"
                            name="comprovante-upload"
                            accept={acceptedTypes}
                            onChange={handleFileChange}
                            disabled={disabled}
                            style={style}
                            className="mb-2"
                        />
                        
                        <Form.Text className="text-muted d-block">
                            {description}
                        </Form.Text>
                        
                        {disabled && (
                            <Alert variant="info" className="mt-2 py-2">
                                <small>Salve a OS primeiro para anexar o comprovante.</small>
                            </Alert>
                        )}
                    </div>
                </Form.Group>
            </div>
            
            {renderPreview()}
        </div>
    );
};

export default ComprovanteUploadMelhorado;