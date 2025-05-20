import React from 'react';
import './LayoutModerno.css';
import BarraLateral from './BarraLateral';
import ConteudoPrincipal from './ConteudoPrincipal';

const LayoutModerno = ({ children }) => {
  return (
    <div className="layout-moderno">
      <BarraLateral />
      <ConteudoPrincipal>
        {children}
      </ConteudoPrincipal>
    </div>
  );
};

export default LayoutModerno;
