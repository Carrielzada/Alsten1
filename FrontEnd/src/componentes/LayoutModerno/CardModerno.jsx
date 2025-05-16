import React from 'react';
import './CardModerno.css';

const CardModerno = ({ titulo, children, className }) => {
  return (
    <div className={`card-moderno ${className || ''}`}>
      {titulo && (
        <div className="card-moderno-cabecalho">
          <h3 className="card-moderno-titulo">{titulo}</h3>
        </div>
      )}
      <div className="card-moderno-corpo">
        {children}
      </div>
    </div>
  );
};

export default CardModerno;
