import React, { useState, useEffect, useCallback } from 'react';
import { useBling, useBlingContatos } from '../../Components/busca/useBling';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';

const ClienteSelector = ({
    onClienteSelect,
    value: controlledValue,
    disabled = false,
    placeholder = "Selecione ou busque um cliente..."
}) => {
    const { isAuthenticated, authenticate, isLoading: authLoading } = useBling();
    const {
        fetchContatosForSelect,
        searchContatosByName
    } = useBlingContatos();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    // Define valor inicial quando controlado
    useEffect(() => {
        if (controlledValue && controlledValue.id) {
            setSelectedValue({
                value: controlledValue.id,
                label: controlledValue.nome,
                original: controlledValue
            });
        } else {
            setSelectedValue(null);
        }
    }, [controlledValue]);

    // Função sem debounce, usada internamente
    const loadOptionsRaw = useCallback(async (inputValue, callback) => {
        if (!isAuthenticated || !inputValue || inputValue.trim().length < 3) {
            callback([]);
            return;
        }

        setIsLoading(true);

        try {
            const response = await searchContatosByName(inputValue.trim());

            if (response && Array.isArray(response.data)) {
                const options = response.data.map(cliente => ({
                    value: cliente.id,
                    label: cliente.nome,
                    original: cliente
                }));
                callback(options);
            } else {
                callback([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do Bling:', error);
            callback([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, searchContatosByName]);

    // Debounce externo, apenas 1 referência
    const debouncedLoadOptions = useCallback(
        debounce((inputValue, callback) => {
            loadOptionsRaw(inputValue, callback);
        }, 600),
        [loadOptionsRaw]
    );

    const handleSelectionChange = (selectedOption) => {
        setSelectedValue(selectedOption);
        onClienteSelect(selectedOption ? selectedOption.original : null);
    };

    if (!isAuthenticated) {
        return (
            <div className="cliente-selector">
                <div className="auth-required p-3 border rounded text-center">
                    <p>É necessário fazer login no Bling para carregar os clientes.</p>
                    <button onClick={authenticate} disabled={authLoading} className="btn btn-primary">
                        {authLoading ? 'Carregando...' : 'Fazer Login no Bling'}
                    </button>
                </div>
            </div>
        );
    }

    const customStyles = {
        control: (provided) => ({ ...provided, minHeight: '38px' }),
    };

    return (
        <div className="cliente-selector">
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={debouncedLoadOptions}
                value={selectedValue}
                onChange={handleSelectionChange}
                placeholder={placeholder}
                isDisabled={disabled || authLoading}
                isLoading={isLoading}
                isClearable
                styles={customStyles}
            />
        </div>
    );
};

export default ClienteSelector;
