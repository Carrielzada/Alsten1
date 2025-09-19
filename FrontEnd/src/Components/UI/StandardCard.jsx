import React from 'react';
import { Card } from 'react-bootstrap';

const StandardCard = ({ 
    children, 
    title = null,
    subtitle = null,
    icon = null,
    headerVariant = 'primary',
    className = '',
    shadow = true,
    ...props 
}) => {
    const cardClasses = [
        shadow ? 'shadow-sm' : '',
        'border-0',
        className
    ].filter(Boolean).join(' ');

    return (
        <Card className={cardClasses} {...props}>
            {(title || icon) && (
                <Card.Header className={`bg-${headerVariant} text-white d-flex align-items-center`}>
                    {icon && <span className="me-2">{icon}</span>}
                    <div>
                        {title && <h5 className="mb-0">{title}</h5>}
                        {subtitle && <small className="opacity-75">{subtitle}</small>}
                    </div>
                </Card.Header>
            )}
            <Card.Body>
                {children}
            </Card.Body>
        </Card>
    );
};

// Componente para cards de estatística/métricas
export const StatsCard = ({ 
    title, 
    value, 
    icon = null, 
    variant = 'primary', 
    change = null,
    changeType = 'neutral', // 'positive', 'negative', 'neutral'
    className = '',
    ...props 
}) => {
    const changeColors = {
        positive: 'text-success',
        negative: 'text-danger',
        neutral: 'text-muted'
    };

    return (
        <Card className={`border-0 shadow-sm ${className}`} {...props}>
            <Card.Body className="d-flex align-items-center">
                {icon && (
                    <div className={`me-3 text-${variant}`} style={{ fontSize: '2rem' }}>
                        {icon}
                    </div>
                )}
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 className="text-muted mb-1">{title}</h6>
                            <h3 className="mb-0 fw-bold">{value}</h3>
                        </div>
                        {change && (
                            <small className={changeColors[changeType]}>
                                {change}
                            </small>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

// Componente para cards de ação rápida
export const ActionCard = ({ 
    title, 
    description, 
    icon = null, 
    onClick = null,
    variant = 'light',
    disabled = false,
    className = '',
    ...props 
}) => {
    const cardClasses = [
        'border-0 shadow-sm h-100',
        onClick && !disabled ? 'cursor-pointer' : '',
        disabled ? 'opacity-50' : '',
        className
    ].filter(Boolean).join(' ');

    const handleClick = () => {
        if (onClick && !disabled) {
            onClick();
        }
    };

    return (
        <Card 
            className={cardClasses} 
            onClick={handleClick}
            style={{ 
                transition: 'transform 0.2s, box-shadow 0.2s',
                ...(onClick && !disabled ? { cursor: 'pointer' } : {})
            }}
            onMouseEnter={(e) => {
                if (onClick && !disabled) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick && !disabled) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '';
                }
            }}
            {...props}
        >
            <Card.Body className="text-center">
                {icon && (
                    <div className={`mb-3 text-${variant === 'light' ? 'primary' : variant}`} 
                         style={{ fontSize: '3rem' }}>
                        {icon}
                    </div>
                )}
                <h5 className="mb-2">{title}</h5>
                {description && (
                    <p className="text-muted mb-0">{description}</p>
                )}
            </Card.Body>
        </Card>
    );
};

export default StandardCard;