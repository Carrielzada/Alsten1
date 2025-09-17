import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './ModernButton.css';

/**
 * Componente de botão moderno e profissional
 * 
 * @param {Object} props - Propriedades do componente
 * @param {'primary'|'success'|'danger'|'secondary'|'outline'|'ghost'} props.variant - Estilo do botão
 * @param {'sm'|'md'|'lg'} props.size - Tamanho do botão
 * @param {boolean} props.iconOnly - Se o botão deve exibir apenas o ícone
 * @param {boolean} props.loading - Se o botão está em estado de carregamento
 * @param {boolean} props.disabled - Se o botão está desabilitado
 * @param {React.ReactNode} props.icon - Ícone a ser exibido
 * @param {string} props.tooltip - Texto do tooltip (obrigatório para botões só com ícone)
 * @param {'button'|'submit'|'reset'} props.type - Tipo do botão
 * @param {Function} props.onClick - Função executada ao clicar
 * @param {string} props.className - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteúdo do botão
 */
const ModernButton = ({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  loading = false,
  disabled = false,
  icon = null,
  tooltip = '',
  type = 'button',
  onClick = () => {},
  className = '',
  children,
  ...props
}) => {
  // Construir classes CSS
  const baseClasses = [
    'modern-btn',
    `modern-btn-${variant}`,
    `modern-btn-${size}`,
    iconOnly && 'modern-btn-icon-only',
    loading && 'modern-btn-loading',
    className
  ].filter(Boolean).join(' ');

  // Conteúdo do botão
  const buttonContent = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      {!iconOnly && children && <span className="btn-text">{children}</span>}
      {loading && <span className="btn-content">{icon}{!iconOnly && children}</span>}
    </>
  );

  // Botão base
  const button = (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  );

  // Se tem tooltip (obrigatório para botões só com ícone), envolver com Tooltip
  if (tooltip || iconOnly) {
    const tooltipText = tooltip || (typeof children === 'string' ? children : 'Ação');
    
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-${Math.random()}`}>
            {tooltipText}
          </Tooltip>
        }
      >
        {button}
      </OverlayTrigger>
    );
  }

  return button;
};

// Componentes específicos para facilitar o uso
export const SaveButton = ({ children = 'Salvar', icon, ...props }) => (
  <ModernButton variant="success" icon={icon} {...props}>
    {children}
  </ModernButton>
);

export const DeleteButton = ({ children = 'Excluir', icon, ...props }) => (
  <ModernButton variant="danger" icon={icon} {...props}>
    {children}
  </ModernButton>
);

export const CancelButton = ({ children = 'Cancelar', icon, ...props }) => (
  <ModernButton variant="secondary" icon={icon} {...props}>
    {children}
  </ModernButton>
);

export const EditButton = ({ children = 'Editar', icon, ...props }) => (
  <ModernButton variant="primary" icon={icon} {...props}>
    {children}
  </ModernButton>
);

export const ViewButton = ({ children = 'Visualizar', icon, ...props }) => (
  <ModernButton variant="outline" icon={icon} {...props}>
    {children}
  </ModernButton>
);

export const BackButton = ({ children = 'Voltar', icon, ...props }) => (
  <ModernButton variant="ghost" icon={icon} {...props}>
    {children}
  </ModernButton>
);

export default ModernButton;