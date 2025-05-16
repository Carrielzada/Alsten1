import React from 'react';
import './ConteudoPrincipal.css';

const ConteudoPrincipal = ({ children }) => {
  return (
    <main className="conteudo-principal">
      {children}
    </main>
  );
};

export default ConteudoPrincipal;
