import React, { useState, useEffect, useCallback } from 'react';
import { useBlingContatos } from '../../Components/busca/useBling'; // Assuming useBling is not needed directly here
import Select from 'react-select';

const ClienteSelector = ({
    onClienteSelect,
    value: controlledValue, // Renaming prop for clarity
    disabled = false,
    placeholder = "Selecione ou busque um cliente..."
}) => {
    // Note: It's better for the parent to handle auth state and pass down disabled prop
    const {
        fetchContatosForSelect,
        searchContatosByName,
        fetchContatoById, // Assumes you can add a function to fetch a single contact by ID
    } = useBlingContatos();

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // This state holds the currently selected option for react-select
    const [selectedValue, setSelectedValue] = useState(null);

    // Fetch the specific client when the component loads with a value
    useEffect(() => {
        if (controlledValue && controlledValue.id) {
            // Check if the option for this value already exists
            const optionExists = options.some(opt => opt.value === controlledValue.id);
            if (!optionExists && fetchContatoById) {
                setIsLoading(true);
                fetchContatoById(controlledValue.id)
                    .then(clientData => {
                        if (clientData) {
                            const newOption = {
                                value: clientData.id,
                                label: clientData.nome,
                                original: clientData // Store the original object
                            };
                            setOptions(prev => [newOption, ...prev]);
                            setSelectedValue(newOption);
                        }
                    })
                    .catch(err => console.error("Failed to fetch initial client", err))
                    .finally(() => setIsLoading(false));
            } else if (optionExists) {
                // If the option exists, find it and set it
                setSelectedValue(options.find(opt => opt.value === controlledValue.id));
            }
        } else {
            setSelectedValue(null);
        }
    }, [controlledValue, options, fetchContatoById]);


    // Debounced search function
    const loadOptions = useCallback((inputValue, callback) => {
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
                setOptions(formattedOptions); // Also update the local options state
                callback(formattedOptions);
            })
            .catch(error => {
                console.error('Erro ao buscar dados do Bling:', error);
                callback([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [fetchContatosForSelect, searchContatosByName]);

    // The component that makes the async calls is AsyncSelect
    const { default: AsyncSelect } = require('react-select/async');

    const handleSelectionChange = (selectedOption) => {
        setSelectedValue(selectedOption); // Update internal state
        // Pass the original, full client object up to the parent form
        if (selectedOption) {
            onClienteSelect(selectedOption.original);
        } else {
            onClienteSelect(null); // Handle clear
        }
    };
    
    const customStyles = {
        control: (provided) => ({ ...provided, minHeight: '38px' }),
        // ... other styles can remain ...
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
                isDisabled={disabled}
                isLoading={isLoading}
                isClearable
                styles={customStyles}
            />
        </div>
    );
};

export default ClienteSelector;