// CaixaSelecaoAsyncBling.jsx
import React from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

const CaixaSelecaoAsyncBling = ({ valorSelecionado, onChange, name, token }) => {

    const carregarClientes = async (inputValue) => {
        try {
            const response = await axios.get(`https://api.bling.com.br/Api/v3/contatos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    pagina: 1,
                    limite: 100,
                    nome: inputValue // opcional, se a API aceitar filtro por nome
                }
            });

            // Formatar os dados no padrão do react-select
            return response.data.data.map(cliente => ({
                value: cliente.id,
                label: cliente.nome
            }));
        } catch (error) {
            console.error('Erro ao carregar clientes do Bling:', error);
            return [];
        }
    };

    const handleChange = (selectedOption) => {
        onChange({
            target: {
                name,
                value: selectedOption ? selectedOption.value : ''
            }
        });
    };

    const carregarOpcoes = (inputValue, callback) => {
        carregarClientes(inputValue).then(callback);
    };

    const valorAtual = valorSelecionado ? { value: valorSelecionado, label: `ID: ${valorSelecionado}` } : null;

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={carregarOpcoes}
            defaultOptions
            value={valorAtual}
            onChange={handleChange}
            isClearable
            placeholder="Digite para buscar um cliente..."
            styles={{
                container: (provided) => ({
                    ...provided,
                    width: '100%'
                }),
                control: (provided) => ({
                    ...provided,
                    minHeight: '38px',
                    fontSize: '14px'
                }),
                valueContainer: (provided) => ({
                    ...provided,
                    flex: 1,
                    overflow: 'hidden'
                }),
                input: (provided) => ({
                    ...provided,
                    margin: 0,
                    padding: 0,
                    flex: '1 1 auto'
                })
            }}
        />
    );
};

export default CaixaSelecaoAsyncBling;
