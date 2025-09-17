import React, { forwardRef, useState, useId } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './AccessibleInput.css';

/**
 * Componente de input acessível com melhorias de UX
 */
const AccessibleInput = forwardRef(({
  label,
  type = 'text',
  error,
  success,
  helpText,
  required = false,
  disabled = false,
  placeholder,
  icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  maxLength,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  size = 'md',
  variant = 'default',
  onFocus,
  onBlur,
  onChange,
  value,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  
  const inputId = useId();
  const helpTextId = useId();
  const errorId = useId();
  
  // Determinar o tipo real do input
  const actualType = type === 'password' && showPassword ? 'text' : type;
  
  // Classes condicionais
  const inputClasses = `
    accessible-input
    ${className}
    ${error ? 'is-invalid' : ''}
    ${success ? 'is-valid' : ''}
    ${disabled ? 'disabled' : ''}
    ${isFocused ? 'focused' : ''}
    size-${size}
    variant-${variant}
  `.trim();
  
  // Construir aria-describedby
  let describedBy = ariaDescribedBy || '';
  if (helpText) describedBy += ` ${helpTextId}`;
  if (error) describedBy += ` ${errorId}`;
  describedBy = describedBy.trim();
  
  // Handlers
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange?.(e);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const renderIcon = (position) => {
    if (iconPosition !== position) return null;
    
    if (icon) {
      const IconComponent = icon;
      return <IconComponent className="input-icon" aria-hidden="true" />;
    }
    
    return null;
  };
  
  const renderValidationIcon = () => {
    if (error) {
      return <FaExclamationTriangle className="validation-icon error" aria-hidden="true" />;
    }
    if (success) {
      return <FaCheckCircle className="validation-icon success" aria-hidden="true" />;
    }
    return null;
  };
  
  const renderPasswordToggle = () => {
    if (!showPasswordToggle || type !== 'password') return null;
    
    return (
      <button
        type="button"
        className="password-toggle"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={disabled ? -1 : 0}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    );
  };
  
  const renderCharCount = () => {
    if (!maxLength) return null;
    
    const isNearLimit = charCount > maxLength * 0.8;
    const isOverLimit = charCount > maxLength;
    
    return (
      <div 
        className={`char-count ${isNearLimit ? 'near-limit' : ''} ${isOverLimit ? 'over-limit' : ''}`}
        aria-live="polite"
      >
        {charCount}/{maxLength}
      </div>
    );
  };

  return (
    <div className="accessible-input-container">
      {/* Label */}
      {label && (
        <Form.Label htmlFor={inputId} className="accessible-label">
          {label}
          {required && <span className="required-indicator" aria-label="obrigatório">*</span>}
        </Form.Label>
      )}
      
      {/* Input Group */}
      <InputGroup className={`input-group-container ${error ? 'has-error' : ''} ${success ? 'has-success' : ''}`}>
        {/* Ícone esquerdo */}
        {renderIcon('left')}
        
        {/* Input principal */}
        <Form.Control
          ref={ref}
          id={inputId}
          type={actualType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={inputClasses}
          aria-label={ariaLabel || label}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          {...props}
        />
        
        {/* Ícone direito */}
        {renderIcon('right')}
        
        {/* Ícone de validação */}
        {renderValidationIcon()}
        
        {/* Toggle de senha */}
        {renderPasswordToggle()}
      </InputGroup>
      
      {/* Contador de caracteres */}
      {renderCharCount()}
      
      {/* Texto de ajuda */}
      {helpText && (
        <Form.Text id={helpTextId} className="help-text">
          {helpText}
        </Form.Text>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div 
          id={errorId}
          className="error-message"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {/* Mensagem de sucesso */}
      {success && (
        <div 
          className="success-message"
          role="status"
          aria-live="polite"
        >
          {typeof success === 'string' ? success : 'Válido'}
        </div>
      )}
    </div>
  );
});

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput;