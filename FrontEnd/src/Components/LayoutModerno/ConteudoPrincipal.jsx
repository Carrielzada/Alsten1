import React from 'react';
import './ConteudoPrincipal.css';
import Breadcrumb from '../UI/Breadcrumb';

const ConteudoPrincipal = ({ children, mostrarBarra, isMobile = false }) => {
  // Em mobile, nunca aplicar margem esquerda
  const marginLeft = isMobile ? '0' : (mostrarBarra ? '260px' : '0');
  
  return (
    <main
      className={`conteudo-principal ${!mostrarBarra ? 'sem-barra' : ''} ${isMobile ? 'mobile' : ''}`}
      style={{ marginLeft }}
    >
      <div className="breadcrumb-container">
        <Breadcrumb compact={isMobile} />
      </div>
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  );
};

export default ConteudoPrincipal;
