import React from 'react';
import { Table } from 'react-bootstrap';

const StandardTable = ({ 
    children, 
    striped = true, 
    bordered = true, 
    hover = true, 
    responsive = true,
    size = null,
    variant = null,
    className = '',
    ...props 
}) => {
    return (
        <Table 
            striped={striped}
            bordered={bordered}
            hover={hover}
            responsive={responsive}
            size={size}
            variant={variant}
            className={`shadow-sm ${className}`}
            {...props}
        >
            {children}
        </Table>
    );
};

// Componente para cabeçalho padrão de tabela
export const StandardTableHeader = ({ children, variant = 'dark', className = '', ...props }) => {
    return (
        <thead className={`table-${variant} ${className}`} {...props}>
            {children}
        </thead>
    );
};

// Componente para corpo da tabela
export const StandardTableBody = ({ children, className = '', ...props }) => {
    return (
        <tbody className={className} {...props}>
            {children}
        </tbody>
    );
};

// Componente para mensagem quando não há dados
export const EmptyTableMessage = ({ 
    message = "Nenhum registro encontrado", 
    icon = "📄",
    subtitle = "Não há dados para exibir no momento.",
    colSpan = 1 
}) => {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center py-5">
                <div className="text-muted">
                    <div style={{ fontSize: '3rem' }} className="mb-3">{icon}</div>
                    <h5>{message}</h5>
                    <p>{subtitle}</p>
                </div>
            </td>
        </tr>
    );
};

// Componente para loading na tabela
export const TableLoadingSpinner = ({ colSpan = 1 }) => {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2 text-muted">Carregando dados...</p>
            </td>
        </tr>
    );
};

export default StandardTable;