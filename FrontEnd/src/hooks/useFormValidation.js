import { useState, useCallback, useEffect } from 'react';

/**
 * Hook avançado para validação de formulários com UX melhorada
 * 
 * @param {Object} initialValues - Valores iniciais do formulário
 * @param {Object} validationRules - Regras de validação
 * @param {Object} options - Opções do hook
 */
export const useFormValidation = (initialValues = {}, validationRules = {}, options = {}) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    showErrorsOnSubmit = true,
    debounceMs = 300
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Debounce para validação
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Validar um campo específico
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Validação obrigatória
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.messages?.required || `${rule.label || name} é obrigatório`;
    }

    // Validação de tipo
    if (value && rule.type) {
      switch (rule.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return rule.messages?.email || 'Email inválido';
          }
          break;
        
        case 'phone':
          const phoneRegex = /^[\d\s\-\(\)\+]+$/;
          if (!phoneRegex.test(value)) {
            return rule.messages?.phone || 'Telefone inválido';
          }
          break;
        
        case 'cpf':
          if (!isValidCPF(value)) {
            return rule.messages?.cpf || 'CPF inválido';
          }
          break;
        
        case 'cnpj':
          if (!isValidCNPJ(value)) {
            return rule.messages?.cnpj || 'CNPJ inválido';
          }
          break;
        
        case 'number':
          if (isNaN(value)) {
            return rule.messages?.number || 'Deve ser um número válido';
          }
          break;
      }
    }

    // Validação de comprimento
    if (value && rule.minLength && value.length < rule.minLength) {
      return rule.messages?.minLength || `Mínimo ${rule.minLength} caracteres`;
    }
    if (value && rule.maxLength && value.length > rule.maxLength) {
      return rule.messages?.maxLength || `Máximo ${rule.maxLength} caracteres`;
    }

    // Validação de valor mínimo/máximo
    if (value && rule.min !== undefined && parseFloat(value) < rule.min) {
      return rule.messages?.min || `Valor mínimo: ${rule.min}`;
    }
    if (value && rule.max !== undefined && parseFloat(value) > rule.max) {
      return rule.messages?.max || `Valor máximo: ${rule.max}`;
    }

    // Validação customizada
    if (rule.validate && typeof rule.validate === 'function') {
      const customError = rule.validate(value, values);
      if (customError) return customError;
    }

    // Validação por regex
    if (value && rule.pattern) {
      const regex = new RegExp(rule.pattern);
      if (!regex.test(value)) {
        return rule.messages?.pattern || 'Formato inválido';
      }
    }

    return null;
  }, [validationRules, values]);

  // Validar todo o formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldError = validateField(fieldName, values[fieldName]);
      if (fieldError) {
        newErrors[fieldName] = fieldError;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [validateField, values, validationRules]);

  // Atualizar valor do campo
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);

    // Validação com debounce
    if (validateOnChange) {
      if (debounceTimer) clearTimeout(debounceTimer);
      
      const timer = setTimeout(() => {
        const fieldError = validateField(name, value);
        setErrors(prev => ({
          ...prev,
          [name]: fieldError
        }));
      }, debounceMs);
      
      setDebounceTimer(timer);
    }

    // Limpar erro se campo foi corrigido
    if (errors[name] && value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validateField, validateOnChange, debounceMs, errors, debounceTimer]);

  // Marcar campo como tocado
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      const fieldError = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [validateField, validateOnBlur, values]);

  // Submeter formulário
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    if (showErrorsOnSubmit) {
      setTouched(
        Object.keys(validationRules).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }

    const formIsValid = validateForm();
    
    if (formIsValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erro no submit:', error);
      }
    }
    
    setIsSubmitting(false);
    return formIsValid;
  }, [validateForm, values, validationRules, showErrorsOnSubmit]);

  // Resetar formulário
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
    if (debounceTimer) clearTimeout(debounceTimer);
  }, [initialValues, debounceTimer]);

  // Definir valores do formulário
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Definir erro manualmente
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Limpar erro específico
  const clearFieldError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Efeito para validar form quando valores mudam
  useEffect(() => {
    if (isDirty) {
      const hasErrors = Object.keys(errors).length > 0;
      const newIsValid = !hasErrors && Object.keys(validationRules).every(key => {
        const rule = validationRules[key];
        if (rule.required) {
          const value = values[key];
          return value !== undefined && value !== null && value !== '';
        }
        return true;
      });
      setIsValid(newIsValid);
    }
  }, [errors, values, validationRules, isDirty]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFormValues,
    setFieldError,
    clearFieldError,
    validateForm,
    validateField
  };
};

// Utilitários de validação
const isValidCPF = (cpf) => {
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.charAt(10));
};

const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  
  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  return result === parseInt(digits.charAt(1));
};

export default useFormValidation;