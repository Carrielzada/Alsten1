import React, { useState } from 'react';
import './LayoutModerno.css';
import BarraLateral from './BarraLateral';
import ConteudoPrincipal from './ConteudoPrincipal';

const LayoutModerno = ({ children }) => {
  const [mostrarBarra, setMostrarBarra] = useState(true);

  const toggleBarra = () => {
    setMostrarBarra(!mostrarBarra);
  };

  return (
    <div className="layout-moderno">
      {mostrarBarra && <BarraLateral />}
      <ConteudoPrincipal mostrarBarra={mostrarBarra}>
        <button onClick={toggleBarra} className="toggle-barra-btn">
          {mostrarBarra ? 'Esconder Menu' : 'Mostrar Menu'}
        </button>
        {children}
      </ConteudoPrincipal>
    </div>
  );
};

export default LayoutModerno;
