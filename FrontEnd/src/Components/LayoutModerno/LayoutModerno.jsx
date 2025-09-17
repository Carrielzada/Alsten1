import React, { useState, useEffect } from 'react';
import './LayoutModerno.css'; // << CRIE ESTE ARQUIVO CSS (código abaixo)
import BarraLateral from './BarraLateral';
import ConteudoPrincipal from './ConteudoPrincipal'; // << CRIE ESTE ARQUIVO (código abaixo)
import Menu from '../Templates2/Menu'; // Ajuste o caminho se necessário
import Rodape from '../Templates2/Rodape';

const LayoutModerno = ({ children }) => {
  const [mostrarBarra, setMostrarBarra] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile e ajusta sidebar automaticamente
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && mostrarBarra) {
        setMostrarBarra(false); // Oculta sidebar por padrão em mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleBarra = () => {
    setMostrarBarra(!mostrarBarra);
  };
  
  // Fecha sidebar ao clicar fora em mobile
  const handleOverlayClick = () => {
    if (isMobile && mostrarBarra) {
      setMostrarBarra(false);
    }
  };

  return (
    <div className="layout-moderno">
      <Menu toggleBarra={toggleBarra} />
      <div className="layout-main">
        {/* Overlay para fechar sidebar em mobile */}
        {isMobile && mostrarBarra && (
          <div 
            className="sidebar-overlay" 
            onClick={handleOverlayClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1049,
              cursor: 'pointer'
            }}
          />
        )}
        <BarraLateral 
          className={`${!mostrarBarra ? 'hidden' : ''} ${isMobile ? 'mobile' : ''}`} 
        />
        <ConteudoPrincipal mostrarBarra={mostrarBarra} isMobile={isMobile} showBreadcrumb={true}>
          {children}
        </ConteudoPrincipal>
      </div>
      <Rodape />
    </div>
  );
};

export default LayoutModerno;