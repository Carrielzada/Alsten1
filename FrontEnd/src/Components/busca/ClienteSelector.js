import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom'; 
import { useBling, useBlingContatos } from '../../Components/busca/useBling';
import Select from 'react-select';

const ClienteSelector = ({ 
    onClienteSelect, 
    selectedClienteId = null, 
    disabled = false,
    placeholder = "Selecione ou busque um cliente..." 
}) => {
    const { isAuthenticated, authenticate, isLoading: authLoading } = useBling();
    const { 
        fetchContatosForSelect, 
        searchContatosByName, 
    } = useBlingContatos();
    
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const inputContainerRef = useRef(null); 
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (isOpen && inputContainerRef.current) {
            const rect = inputContainerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [isOpen]);

    const buscarEFormatarClientes = useCallback(async (buscaOptions) => {
        setIsLoading(true);
        try {
            const response = buscaOptions.pesquisa 
                ? await searchContatosByName(buscaOptions.pesquisa, buscaOptions)
                : await fetchContatosForSelect(buscaOptions);
            if (response && Array.isArray(response.data)) {
                setClientes(response.data);
            } else {
                setClientes([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do Bling:', error);
            setClientes([]);
        } finally {
            setIsLoading(false);
        }
    }, [fetchContatosForSelect, searchContatosByName]);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (searchTerm === '' && isOpen) {
            buscarEFormatarClientes({ tipo: 'cliente', limite: 100 });
            return;
        }
        if (searchTerm.length < 2) return;
        const debounceTimer = setTimeout(() => {
            buscarEFormatarClientes({ tipo: 'cliente', pesquisa: searchTerm });
        }, 400);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, isAuthenticated, buscarEFormatarClientes, isOpen]);

    useEffect(() => {
        if (selectedClienteId && clientes.length > 0) {
            const clienteSelecionado = clientes.find(c => c.id === selectedClienteId);
            if(clienteSelecionado && searchTerm !== clienteSelecionado.nome) {
                setSearchTerm(clienteSelecionado.nome);
            }
        }
    }, [selectedClienteId, clientes, searchTerm]);

    const handleClienteSelect = (cliente) => {
        setIsOpen(false);
        onClienteSelect(cliente);
    };

    if (!isAuthenticated) {
        return (
            <div className="cliente-selector">
                <div className="auth-required">
                    <p>É necessário fazer login no Bling para carregar os clientes.</p>
                    <button onClick={authenticate} disabled={authLoading} className="btn btn-primary">
                        {authLoading ? 'Carregando...' : 'Fazer Login no Bling'}
                    </button>
                </div>
            </div>
        );
    }

    const selectOptions = clientes.map(cliente => ({
        value: cliente.id,
        label: cliente.nome,
        documento: cliente.documento
    }));

    // Estilo ajustado para garantir que a caixa de pesquisa e o dropdown tenham boas dimensões
    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: '100%',
        }),
        control: (provided) => ({
            ...provided,
            minHeight: '38px', // Garante que a altura mínima seja mantida
            height: '38px', // Impede que a altura encolha
            fontSize: '14px',
            borderRadius: '4px',
            borderColor: '#ccc',
            boxSizing: 'border-box', // Impede qualquer distorção
            padding: '0 10px', // Padding para conforto
            display: 'flex',
            alignItems: 'center', // Centraliza o texto verticalmente
        }),
        input: (provided) => ({
            ...provided,
            margin: 0,
            padding: '0', // Evita que o padding influencie a altura
            width: '100%',
            minHeight: '38px', // Garante que a altura do campo de pesquisa também seja 38px
            flex: '1 1 auto',
            lineHeight: '20px', // Ajusta o espaçamento entre as linhas de texto
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            maxHeight: '250px',
            overflowY: 'auto',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0066cc' : 'white',
            color: state.isSelected ? 'white' : 'black',
            padding: '10px',
            cursor: 'pointer',
            fontSize: '14px',
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: '14px',
            color: '#777',
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: '14px',
        }),
    };

    return (
        <div className="cliente-selector">
            <label className="form-label">Cliente *</label>
            
            <div className="dropdown-container" ref={inputContainerRef}>
                <Select
                    options={selectOptions}
                    onChange={handleClienteSelect}
                    isClearable
                    isSearchable
                    value={selectOptions.find(option => option.value === selectedClienteId) || null}
                    placeholder={placeholder}
                    styles={customStyles}
                    onInputChange={(newValue) => setSearchTerm(newValue)}
                    isLoading={isLoading}
                    onMenuOpen={() => setIsOpen(true)}
                    onMenuClose={() => setIsOpen(false)}
                    isDisabled={disabled || authLoading}
                />
            </div>

            {selectedClienteId && (
                <div className="selected-cliente-info">
                    <small>Cliente selecionado</small>
                </div>
            )}
        </div>
    );
};

export default ClienteSelector;