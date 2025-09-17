import React, { useState } from 'react';
import './LayoutModerno.css'; // << CRIE ESTE ARQUIVO CSS (código abaixo)
import BarraLateral from './BarraLateral';
import ConteudoPrincipal from './ConteudoPrincipal'; // << CRIE ESTE ARQUIVO (código abaixo)
import Menu from '../Templates2/Menu'; // Ajuste o caminho se necessário
import Rodape from '../Templates2/Rodape';

const LayoutModerno = ({ children }) => {
  const [mostrarBarra, setMostrarBarra] = useState(true);

  const toggleBarra = () => {
    setMostrarBarra(!mostrarBarra);
  };

  return (
    <div className="layout-moderno">
      <Menu toggleBarra={toggleBarra} />
      <div className="layout-main">
        <BarraLateral className={!mostrarBarra ? 'hidden' : ''} />
        <ConteudoPrincipal mostrarBarra={mostrarBarra}>
          {children}
        </ConteudoPrincipal>
      </div>
      <Rodape />
    </div>
  );
};

export default LayoutModerno;