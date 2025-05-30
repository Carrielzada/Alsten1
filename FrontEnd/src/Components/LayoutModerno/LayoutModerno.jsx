import React, { useState } from 'react';
import './LayoutModerno.css'; // << CRIE ESTE ARQUIVO CSS (código abaixo)
import BarraLateral from './BarraLateral';
import ConteudoPrincipal from './ConteudoPrincipal'; // << CRIE ESTE ARQUIVO (código abaixo)
import Menu from '../Templates2/Menu'; // Ajuste o caminho se necessário

const LayoutModerno = ({ children }) => {
  const [mostrarBarra, setMostrarBarra] = useState(true);

  const toggleBarra = () => {
    setMostrarBarra(!mostrarBarra);
  };

  return (
    <div className="layout-moderno">
      <Menu toggleBarra={toggleBarra} />
      <BarraLateral className={!mostrarBarra ? 'hidden' : ''} />
      <ConteudoPrincipal mostrarBarra={mostrarBarra}>
        {children}
      </ConteudoPrincipal>
    </div>
  );
};

export default LayoutModerno;