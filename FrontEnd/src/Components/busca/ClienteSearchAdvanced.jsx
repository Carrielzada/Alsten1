import React, { useState, useEffect, useCallback } from 'react';
import { useBling, useBlingContatos } from './useBling';
import { FaSearch, FaEye, FaFilter, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';
import ClienteInfoModal from './ClienteInfoModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ClienteSearchAdvanced.css';

const ClienteSearchAdvanced = ({ onClienteSelect, selectedCliente = null }) => {
    const { isAuthenticated, authenticate, isLoading: authLoading } = useBling();
    const { fetchContatos, isLoading } = useBlingContatos();

    const [searchTerm, setSearchTerm] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [situacaoFiltro, setSituacaoFiltro] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedClienteForModal, setSelectedClienteForModal] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Buscar clientes quando os filtros mudarem
    const performSearch = useCallback(async () => {
        if (!isAuthenticated || !searchTerm.trim() || searchTerm.trim().length < 3) {
            setSearchResults([]);
            return;
        }
        try {
            const options = { pesquisa: searchTerm.trim() };
            if (tipoFiltro) options.tipo = tipoFiltro;
            if (situacaoFiltro) options.situacao = situacaoFiltro;
            const response = await fetchContatos(options);
            if (response && response.data) {
                setSearchResults(response.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            setSearchResults([]);
            toast.error('Erro ao buscar clientes.');
        }
    }, [isAuthenticated, searchTerm, tipoFiltro, situacaoFiltro, fetchContatos]);

    useEffect(() => {
        if (searchTerm.trim().length >= 3) {
            const timeoutId = setTimeout(() => {
                performSearch();
            }, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, performSearch]);

    const handleClienteSelect = (cliente) => {
        onClienteSelect(cliente);
    };

    const handleViewDetails = (cliente) => {
        setSelectedClienteForModal(cliente);
        setShowModal(true);
    };

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

    // Filtros compactos em dropdown
    const FiltrosDropdown = () => (
        <div className={`filtros-dropdown${showFilters ? ' open' : ''}`}> 
            <button className="filtro-btn" onClick={() => setShowFilters(v => !v)}>
                <FaFilter /> <span>Filtros</span> <FaChevronDown className="chevron" />
            </button>
            {showFilters && (
                <div className="filtros-menu">
                    <div className="filtro-item">
                        <label>Tipo</label>
                        <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="cliente">Cliente</option>
                            <option value="fornecedor">Fornecedor</option>
                            <option value="funcionario">Funcionário</option>
                            <option value="lead">Lead</option>
                        </select>
                    </div>
                    <div className="filtro-item">
                        <label>Situação</label>
                        <select value={situacaoFiltro} onChange={e => setSituacaoFiltro(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="A">Ativo</option>
                            <option value="I">Inativo</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="cliente-search-advanced auth-required">
                <div className="auth-message">
                    <FaUser className="icon" />
                    <span>É necessário fazer login no Bling para buscar clientes.</span>
                </div>
                <button onClick={authenticate} disabled={authLoading} className="btn-auth">
                    {authLoading ? 'Carregando...' : 'Fazer Login no Bling'}
                </button>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
            </div>
        );
    }

    return (
        <div className="cliente-search-advanced">
            <div className="search-bar-row">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar clientes por nome, documento, e-mail..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="search-input"
                        autoComplete="off"
                    />
                    {searchTerm && (
                        <button className="clear-btn" onClick={() => setSearchTerm('')} title="Limpar busca">
                            <FaTimes />
                        </button>
                    )}
                </div>
                <FiltrosDropdown />
            </div>

            {/* Resultados da busca */}
            {searchResults.length > 0 && searchTerm.trim().length >= 3 && (
                <div className="resultados-lista">
                    {searchResults.map((cliente) => (
                        <div
                            key={cliente.id}
                            className={`resultado-item${selectedCliente && selectedCliente.id === cliente.id ? ' selected' : ''}`}
                            onClick={() => handleClienteSelect(cliente)}
                        >
                            <div className="cliente-main">
                                <span className="cliente-nome">{cliente.nome}</span>
                                {cliente.numeroDocumento && (
                                    <span className="cliente-doc">{formatarDocumento(cliente.numeroDocumento)}</span>
                                )}
                                {cliente.telefone && (
                                    <span className="cliente-tel">{cliente.telefone}</span>
                                )}
                            </div>
                            <button
                                className="detalhes-btn"
                                title="Ver detalhes"
                                onClick={e => { e.stopPropagation(); handleViewDetails(cliente); }}
                            >
                                <FaEye />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Cliente selecionado */}
            {selectedCliente && (
                <div className="cliente-selecionado">
                    <span className="cliente-nome">{selectedCliente.nome}</span>
                    {selectedCliente.numeroDocumento && (
                        <span className="cliente-doc">{formatarDocumento(selectedCliente.numeroDocumento)}</span>
                    )}
                    <button className="clear-btn" onClick={() => onClienteSelect(null)} title="Limpar seleção">
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Modal de detalhes */}
            <ClienteInfoModal
                show={showModal}
                onHide={() => setShowModal(false)}
                cliente={selectedClienteForModal}
                title="Detalhes do Cliente"
            />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
        </div>
    );
};

export default ClienteSearchAdvanced; 