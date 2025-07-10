import React, { useState, useEffect, useCallback } from 'react';
import { useBling, useBlingContatos } from '../../Components/busca/useBling';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ClienteSelector = ({
    onClienteSelect,
    value: controlledValue,
    disabled = false,
    placeholder = "Selecione ou busque um cliente..."
}) => {
    const { isAuthenticated, authenticate, isLoading: authLoading } = useBling();
    const {
        searchContatosByName,
        fetchContatoById
    } = useBlingContatos();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        if (controlledValue && controlledValue.id) {
            if (controlledValue.nome) {
                setSelectedValue({
                    value: controlledValue.id,
                    label: `${controlledValue.nome}${controlledValue.numeroDocumento ? ` (${formatarDocumento(controlledValue.numeroDocumento)})` : ''}`,
                    original: controlledValue
                });
            } else {
                const buscarClientePorId = async () => {
                    try {
                        setIsLoading(true);
                        const cliente = await fetchContatoById(controlledValue.id);
                        if (cliente) {
                            setSelectedValue({
                                value: cliente.id,
                                label: `${cliente.nome}${cliente.numeroDocumento ? ` (${formatarDocumento(cliente.numeroDocumento)})` : ''}`,
                                original: cliente
                            });
                        } else {
                            setSelectedValue({
                                value: controlledValue.id,
                                label: `Cliente ${controlledValue.id}`,
                                original: { id: controlledValue.id, nome: `Cliente ${controlledValue.id}` }
                            });
                        }
                    } catch (error) {
                        setSelectedValue({
                            value: controlledValue.id,
                            label: `Cliente ${controlledValue.id}`,
                            original: { id: controlledValue.id, nome: `Cliente ${controlledValue.id}` }
                        });
                    } finally {
                        setIsLoading(false);
                    }
                };
                buscarClientePorId();
            }
        } else {
            setSelectedValue(null);
        }
    }, [controlledValue]);

    const formatarDocumento = (documento) => {
        if (!documento) return '';
        const numeros = documento.replace(/\D/g, '');
        if (numeros.length === 11) {
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numeros.length === 14) {
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return documento;
    };

    const loadOptionsRaw = useCallback(async (inputValue, callback) => {
        if (!isAuthenticated || !inputValue || inputValue.trim().length < 2) {
            callback([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await searchContatosByName(inputValue.trim());
            if (response && Array.isArray(response.data)) {
                const options = response.data.map(cliente => ({
                    value: cliente.id,
                    label: `${cliente.nome}${cliente.numeroDocumento ? ` (${formatarDocumento(cliente.numeroDocumento)})` : ''}`,
                    original: cliente
                }));
                callback(options);
            } else {
                callback([]);
            }
        } catch (error) {
            callback([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, searchContatosByName]);

    const debouncedLoadOptions = useCallback(
        debounce((inputValue, callback) => {
            loadOptionsRaw(inputValue, callback);
        }, 400),
        [loadOptionsRaw]
    );

    const handleSelectionChange = (selectedOption) => {
        setSelectedValue(selectedOption);
        onClienteSelect(selectedOption ? selectedOption.original : null);
    };

    if (!isAuthenticated) {
        return (
            <div className="cliente-selector">
                <div className="auth-required p-2 border rounded text-center">
                    <small>É necessário fazer login no Bling para carregar os clientes.</small>
                    <button onClick={authenticate} disabled={authLoading} className="btn btn-sm btn-primary mt-2">
                        {authLoading ? 'Carregando...' : 'Fazer Login no Bling'}
                    </button>
                </div>
            </div>
        );
    }

    const customStyles = {
        control: (provided) => ({ ...provided, minHeight: '32px', fontSize: '14px' }),
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
    };

    return (
        <div style={{ minWidth: 220, maxWidth: 350 }}>
            <OverlayTrigger
                placement="top"
                overlay={selectedValue && selectedValue.original && selectedValue.original.nome ? (
                    <Tooltip id={`tooltip-cliente-${selectedValue.value}`}>
                        <div>
                            <strong>{selectedValue.original.nome}</strong><br />
                            {selectedValue.original.numeroDocumento && (
                                <span>{formatarDocumento(selectedValue.original.numeroDocumento)}<br /></span>
                            )}
                            {selectedValue.original.telefone && (
                                <span>{selectedValue.original.telefone}<br /></span>
                            )}
                            {selectedValue.original.email && (
                                <span>{selectedValue.original.email}<br /></span>
                            )}
                        </div>
                    </Tooltip>
                ) : <></>}
            >
                <div>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={false}
                        loadOptions={debouncedLoadOptions}
                        value={selectedValue}
                        onChange={handleSelectionChange}
                        placeholder={placeholder}
                        isDisabled={disabled || authLoading}
                        isLoading={isLoading}
                        isClearable
                        styles={customStyles}
                        menuPlacement="auto"
                    />
                </div>
            </OverlayTrigger>
        </div>
    );
};

export default ClienteSelector;
