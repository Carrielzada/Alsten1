import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const CampoValor = ({ value, onChange, name, style, className = '', placeholder = 'R$ 0,00', ...props }) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Formatar valor para exibição (tipo app bancário)
    const formatarParaExibicao = (valor) => {
        if (!valor || valor === 0) return '';
        
        // Converter para string e remover pontos/vírgulas
        const valorString = valor.toString().replace(/[^\d]/g, '');
        
        if (valorString === '') return '';
        
        // Converter para centavos
        const valorCentavos = parseInt(valorString);
        const valorReais = valorCentavos / 100;
        
        // Formatar como moeda brasileira
        return valorReais.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Converter valor formatado de volta para número
    const converterParaNumero = (valorFormatado) => {
        if (!valorFormatado) return 0;
        
        // Remove tudo que não é número
        const numeros = valorFormatado.replace(/[^\d]/g, '');
        
        if (numeros === '') return 0;
        
        // Converte para número com centavos
        return parseInt(numeros) / 100;
    };

    // Atualizar display quando value prop muda
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatarParaExibicao(value));
        }
    }, [value, isFocused]);

    // Inicializar display value
    useEffect(() => {
        setDisplayValue(formatarParaExibicao(value));
    }, []);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        
        // Permitir apenas números
        const numeros = inputValue.replace(/[^\d]/g, '');
        
        // Limitar a 10 dígitos (999.999.999,99)
        const numerosLimitados = numeros.slice(0, 10);
        
        // Atualizar display durante a digitação
        const valorFormatado = numerosLimitados === '' ? '' : 
            formatarParaExibicao(parseInt(numerosLimitados));
        
        setDisplayValue(valorFormatado);
        
        // Chamar callback com valor numérico
        if (onChange) {
            const valorNumerico = converterParaNumero(valorFormatado);
            onChange({
                target: {
                    name: name,
                    value: valorNumerico
                }
            });
        }
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        // Mostrar valor sem formatação durante edição se preferir
        // setDisplayValue(value ? value.toString() : '');
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        // Reformatar valor na saída do foco
        setDisplayValue(formatarParaExibicao(value));
    };

    const handleKeyDown = (e) => {
        // Permitir teclas de navegação
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
            'Home', 'End', 'Tab', 'Enter'
        ];
        
        // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
            return;
        }
        
        // Permitir apenas números e teclas permitidas
        if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <Form.Control
            type="text"
            name={name}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`valor-input ${className}`}
            style={{
                textAlign: 'right',
                fontWeight: 'bold',
                color: value > 0 ? '#198754' : '#6c757d',
                ...style
            }}
            {...props}
        />
    );
};

export default CampoValor;
