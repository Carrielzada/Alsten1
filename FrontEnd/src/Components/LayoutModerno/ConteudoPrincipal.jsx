import React from 'react';
import './ConteudoPrincipal.css';

const ConteudoPrincipal = ({ children, mostrarBarra }) => {
  return (
    <main
      className="conteudo-principal"
      style={{ marginLeft: mostrarBarra ? '260px' : '0' }}
    >
      {children}
    </main>
  );
};

export default ConteudoPrincipal;
