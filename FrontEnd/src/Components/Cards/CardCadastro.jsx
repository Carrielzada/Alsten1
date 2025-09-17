import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CardCadastro = ({ 
    titulo, 
    descricao, 
    icon: Icon, 
    rota, 
    destaque = false, 
    cor = "primary",
    contagem 
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(rota);
    };

    const getCardClass = () => {
        if (destaque) {
            return "border-primary shadow-lg card-destaque";
        }
        return "border-light shadow-sm card-normal";
    };

    return (
        <Card 
            className={`h-100 cursor-pointer ${getCardClass()}`}
            onClick={handleClick}
            style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
        >
            <Card.Body className="text-center p-4">
                <div className="mb-3">
                    {destaque ? (
                        <div className="position-relative">
                            <Icon size={48} className={`text-${cor} card-icon`} />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                                Principal
                            </span>
                        </div>
                    ) : (
                        <Icon size={40} className={`text-${cor} card-icon`} />
                    )}
                </div>
                
                <Card.Title className={`${destaque ? 'h5' : 'h6'} fw-bold text-${cor} mb-2`}>
                    {titulo}
                </Card.Title>
                
                <Card.Text className="text-muted small mb-3">
                    {descricao}
                </Card.Text>
                
                {contagem !== undefined && (
                    <div className="mt-auto">
                        <span className={`badge bg-${cor} fs-6`}>
                            {contagem} {contagem === 1 ? 'item' : 'itens'}
                        </span>
                    </div>
                )}
            </Card.Body>
            
            <style jsx>{`
                .card-normal:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
                    border-color: var(--bs-primary) !important;
                }
                
                .card-destaque {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
                    border-width: 2px !important;
                }
                
                .card-destaque:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 12px 35px rgba(13, 110, 253, 0.25) !important;
                }
                
                .card-icon {
                    transition: all 0.3s ease;
                }
                
                .card:hover .card-icon {
                    transform: scale(1.1);
                }
                
                .cursor-pointer {
                    cursor: pointer !important;
                }
            `}</style>
        </Card>
    );
};

export default CardCadastro;