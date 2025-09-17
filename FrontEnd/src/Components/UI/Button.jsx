import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './ModernButton.css';

/**
 * Wrapper que substitui automaticamente os botões Bootstrap pelos nossos modernos
 * Mantém 100% de compatibilidade com react-bootstrap Button
 */
const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick = () => {},
  className = '',
  title = '', // Para tooltips
  children,
  ...props
}, ref) => {
  // Mapear variants do Bootstrap para nossos variants
  const variantMap = {
    'primary': 'primary',
    'secondary': 'secondary', 
    'success': 'success',
    'danger': 'danger',
    'warning': 'secondary',
    'info': 'primary',
    'light': 'ghost',
    'dark': 'secondary',
    'outline-primary': 'outline',
    'outline-secondary': 'outline',
    'outline-success': 'outline',
    'outline-danger': 'outline',
    'outline-warning': 'outline',
    'outline-info': 'outline',
    'outline-light': 'outline',
    'outline-dark': 'outline'
  };

  // Mapear tamanhos do Bootstrap
  const sizeMap = {
    'sm': 'sm',
    'md': 'md', 
    'lg': 'lg'
  };

  // Construir classes CSS
  const modernVariant = variantMap[variant] || 'primary';
  const modernSize = sizeMap[size] || 'md';
  
  const baseClasses = [
    'modern-btn',
    `modern-btn-${modernVariant}`,
    `modern-btn-${modernSize}`,
    className
  ].filter(Boolean).join(' ');

  // Verificar se tem apenas ícone (sem texto)
  const isIconOnly = React.Children.count(children) === 1 && 
    React.Children.toArray(children).every(child => 
      React.isValidElement(child) && 
      (child.type?.name?.includes('Fa') || child.props?.className?.includes('fa'))
    );

  // Classes para botão só com ícone
  const finalClasses = isIconOnly ? 
    `${baseClasses} modern-btn-icon-only` : 
    baseClasses;

  // Botão base
  const button = (
    <button
      ref={ref}
      type={type}
      className={finalClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );

  // Se tem title e é só ícone, mostrar tooltip
  if (title && isIconOnly) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-${Math.random()}`}>
            {title}
          </Tooltip>
        }
      >
        {button}
      </OverlayTrigger>
    );
  }

  return button;
});

Button.displayName = 'Button';

export default Button;