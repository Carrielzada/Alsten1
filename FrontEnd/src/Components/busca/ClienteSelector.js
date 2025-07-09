import React, { useState, useEffect, useCallback } from 'react';
import { useBling, useBlingContatos } from '../../Components/busca/useBling';
import AsyncSelect from 'react-select/async';

const ClienteSelector = ({
    onClienteSelect,
    value: controlledValue, // This is the full client object from the parent
    disabled = false,
    placeholder = "Selecione ou busque um cliente..."
}) => {
    // 1. Re-introduce the authentication hooks from your old code
    const { isAuthenticated, authenticate, isLoading: authLoading } = useBling();
    const {
        fetchContatosForSelect,
        searchContatosByName,
        fetchContatoById,
    } = useBlingContatos();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    // This effect handles setting the initial value when loading an existing record
    useEffect(() => {
        if (controlledValue && controlledValue.id) {
            const initialOption = {
                value: controlledValue.id,
                label: controlledValue.nome,
                original: controlledValue
            };
            setSelectedValue(initialOption);
        } else {
            setSelectedValue(null);
        }
    }, [controlledValue]);


    // This function loads options as the user types
    const loadOptions = useCallback((inputValue, callback) => {
        if (!isAuthenticated) {
            callback([]);
            return;
        }

        setIsLoading(true);
        const fetchCall = inputValue
            ? searchContatosByName(inputValue)
            : fetchContatosForSelect({ tipo: 'cliente', limite: 100 });

        fetchCall
            .then(response => {
                let formattedOptions = [];
                if (response && Array.isArray(response.data)) {
                    formattedOptions = response.data.map(cliente => ({
                        value: cliente.id,
                        label: cliente.nome,
                        original: cliente // Store the original full object
                    }));
                }
                callback(formattedOptions);
            })
            .catch(error => {
                console.error('Erro ao buscar dados do Bling:', error);
                callback([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [isAuthenticated, fetchContatosForSelect, searchContatosByName]);

    // This function handles the change event
    const handleSelectionChange = (selectedOption) => {
        setSelectedValue(selectedOption);
        onClienteSelect(selectedOption ? selectedOption.original : null);
    };
    
    // 2. Re-introduce the authentication check from your old code
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

    // Custom styles can be simplified or kept as they were
    const customStyles = {
        control: (provided) => ({ ...provided, minHeight: '38px' }),
    };

    return (
        <div className="cliente-selector">
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={selectedValue}
                onChange={handleSelectionChange}
                placeholder={placeholder}
                isDisabled={disabled || authLoading} // Also disable while authenticating
                isLoading={isLoading}
                isClearable
                styles={customStyles}
            />
        </div>
    );
};

export default ClienteSelector;