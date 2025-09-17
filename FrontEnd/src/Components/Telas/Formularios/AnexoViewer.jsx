import React from 'react';
import { FaEye, FaDownload, FaTimes } from 'react-icons/fa';
import Button from '../UI/Button';

const AnexoViewer = ({ arquivo, onView, onDownload, onDelete, className = '' }) => {
    const isImage = (filename) => {
        if (!filename) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        return imageExtensions.some(ext => 
            filename.toLowerCase().includes(ext.toLowerCase())
        );
    };

    const getFileIcon = (filename) => {
        if (!filename) return '📄';
        
        const ext = filename.toLowerCase();
        if (ext.includes('.pdf')) return '📄';
        if (ext.includes('.doc') || ext.includes('.docx')) return '📝';
        if (ext.includes('.xls') || ext.includes('.xlsx')) return '📊';
        if (ext.includes('.zip') || ext.includes('.rar')) return '🗜️';
        if (ext.includes('.txt')) return '📃';
        if (isImage(ext)) return '🖼️';
        
        return '📄';
    };

    const handleView = (e) => {
        e.stopPropagation();
        if (onView) onView(arquivo);
    };

    const handleDownload = (e) => {
        e.stopPropagation();
        if (onDownload) onDownload(arquivo);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(arquivo);
    };

    const renderPreview = () => {
        if (typeof arquivo === 'string') {
            // Arquivo já anexado (string com nome do arquivo)
            if (isImage(arquivo)) {
                return (
                    <img 
                        src={`${process.env.REACT_APP_API_URL}/uploads/${arquivo}`}
                        alt="Anexo"
                        className="anexo-preview"
                    />
                );
            } else {
                return (
                    <div className="anexo-preview file-icon-preview">
                        <div className="file-icon">{getFileIcon(arquivo)}</div>
                        <div className="file-name">{arquivo.slice(0, 8)}...</div>
                    </div>
                );
            }
        } else if (arquivo instanceof File) {
            // Arquivo novo (File object)
            if (arquivo.type.startsWith('image/')) {
                return (
                    <img 
                        src={URL.createObjectURL(arquivo)}
                        alt="Anexo"
                        className="anexo-preview"
                    />
                );
            } else {
                return (
                    <div className="anexo-preview file-icon-preview">
                        <div className="file-icon">{getFileIcon(arquivo.name)}</div>
                        <div className="file-name">{arquivo.name.slice(0, 8)}...</div>
                    </div>
                );
            }
        }
        
        return null;
    };

    return (
        <div className={`anexo-item ${className}`}>
            {renderPreview()}
            
            <div className="anexo-overlay">
                <button 
                    className="anexo-action-btn view"
                    onClick={handleView}
                    title="Visualizar"
                    type="button"
                >
                    <FaEye />
                </button>
                
                <button 
                    className="anexo-action-btn download"
                    onClick={handleDownload}
                    title="Baixar"
                    type="button"
                >
                    <FaDownload />
                </button>
                
                <button 
                    className="anexo-action-btn delete"
                    onClick={handleDelete}
                    title="Remover"
                    type="button"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default AnexoViewer;