import React from 'react';
import './ConteudoPrincipal.css';
import Breadcrumb from '../UI/Breadcrumb';

const ConteudoPrincipal = ({ children, mostrarBarra }) => {
  return (
    <main
      className="conteudo-principal"
      style={{ marginLeft: mostrarBarra ? '260px' : '0' }}
    >
      <Breadcrumb />
      {children}
    </main>
  );
};

export default ConteudoPrincipal;
