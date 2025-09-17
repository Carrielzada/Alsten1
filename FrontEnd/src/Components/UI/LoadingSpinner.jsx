import React from 'react';
import { Spinner } from 'react-bootstrap';

// Componente de Loading flexível e reutilizável
const LoadingSpinner = ({ 
    size = 'md', 
    variant = 'primary', 
    message = null, 
    fullScreen = false,
    overlay = false,
    className = '',
    style = {},
    animation = 'border' // 'border' ou 'grow'
}) => {
    
    // Configurações de tamanho
    const sizeConfig = {
        xs: { width: '1rem', height: '1rem', fontSize: '0.75rem' },
        sm: { width: '1.5rem', height: '1.5rem', fontSize: '0.875rem' },
        md: { width: '2rem', height: '2rem', fontSize: '1rem' },
        lg: { width: '2.5rem', height: '2.5rem', fontSize: '1.125rem' },
        xl: { width: '3rem', height: '3rem', fontSize: '1.25rem' }
    };

    const spinnerSize = sizeConfig[size] || sizeConfig.md;

    // Estilos condicionais
    const containerStyle = {
        ...style,
        ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }),
        ...(overlay && !fullScreen && {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000
        })
    };

    const containerClasses = `
        ${!fullScreen && !overlay ? 'd-flex flex-column align-items-center justify-content-center' : ''}
        ${className}
    `.trim();

    return (
        <div className={containerClasses} style={containerStyle}>
            <Spinner 
                animation={animation}
                variant={variant}
                style={spinnerSize}
                role="status"
                aria-hidden="true"
            />
            {message && (
                <div 
                    className="mt-2 text-center text-muted"
                    style={{ fontSize: spinnerSize.fontSize }}
                >
                    {message}
                </div>
            )}
            <span className="visually-hidden">Carregando...</span>
        </div>
    );
};

// Variações pré-configuradas para casos específicos

// Loading para página inteira
export const FullPageLoading = ({ message = "Carregando página..." }) => (
    <LoadingSpinner 
        size="lg"
        message={message}
        fullScreen={true}
    />
);

// Loading para overlay sobre conteúdo
export const OverlayLoading = ({ message = "Carregando...", size = 'md' }) => (
    <LoadingSpinner 
        size={size}
        message={message}
        overlay={true}
    />
);

// Loading inline pequeno (para botões)
export const InlineLoading = ({ message = null, size = 'sm' }) => (
    <LoadingSpinner 
        size={size}
        message={message}
        className="d-inline-flex align-items-center"
        style={{ gap: '0.5rem' }}
    />
);

// Loading para cards/seções
export const SectionLoading = ({ message = "Carregando dados...", size = 'md', className = "py-5" }) => (
    <LoadingSpinner 
        size={size}
        message={message}
        className={`text-center ${className}`}
    />
);

// Loading para tabelas
export const TableLoading = ({ colSpan = 5, message = "Carregando dados..." }) => (
    <tr>
        <td colSpan={colSpan} className="text-center py-4">
            <LoadingSpinner 
                size="md"
                message={message}
            />
        </td>
    </tr>
);

// Loading pulsante (grow animation)
export const PulseLoading = ({ message = null, size = 'md' }) => (
    <LoadingSpinner 
        size={size}
        message={message}
        animation="grow"
    />
);

export default LoadingSpinner;