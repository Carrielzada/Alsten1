import React from 'react';
import './BotaoModulo.css';

// Espera-se que um componente de Ícone seja passado como prop, ou o nome de um ícone de uma biblioteca
const BotaoModulo = ({ texto, icone, onClick, corDestaque }) => {
  const IconComponent = icone; // Se 'icone' for um componente React

  return (
    <button 
      className="botao-modulo" 
      onClick={onClick}
      style={corDestaque ? { '--cor-destaque-botao': corDestaque } : {}}
    >
      {IconComponent && <span className="botao-modulo-icone"><IconComponent /></span>}
      <span className="botao-modulo-texto">{texto}</span>
    </button>
  );
};

export default BotaoModulo;
