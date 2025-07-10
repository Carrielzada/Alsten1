// CaixaSelecaoPesquisavel.jsx
import React from 'react';
import Select from 'react-select';

const CaixaSelecaoPesquisavel = ({
    dados,
    campoChave,
    campoExibir,
    valorSelecionado,
    onChange,
    name
}) => {

    const opcoes = Array.isArray(dados) ? dados.filter(Boolean).map(item => ({
        value: item[campoChave],
        label: item[campoExibir] || `(Opção Inválida - ID: ${item[campoChave]})`
    })) : [];

    // eslint-disable-next-line eqeqeq
    const valorAtual = opcoes.find(opcao => opcao.value == valorSelecionado) || null;

    const handleChange = (opcaoSelecionada) => {
        onChange({
            target: {
                name,
                value: opcaoSelecionada ? opcaoSelecionada.value : ''
            }
        });
    };

    return (
        <Select
            options={opcoes}
            value={valorAtual}
            onChange={handleChange}
            isClearable
            isSearchable={true}
            placeholder="Selecione uma opção..."
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
                    flex: 1, // força o container a ocupar todo o espaço
                    overflow: 'hidden'
                }),
                input: (provided) => ({
                    ...provided,
                    margin: 0,
                    padding: 0,
                    flex: '1 1 auto', // impede o encolhimento
                    width: 'auto' // pode também forçar width: 100% se preferir
                })
            }}
        />
    );
};

export default CaixaSelecaoPesquisavel;
