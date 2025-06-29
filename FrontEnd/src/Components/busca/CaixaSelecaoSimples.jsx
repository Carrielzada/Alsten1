import React from 'react';

const CaixaSelecaoSimples = ({
    dados,
    campoChave,
    campoExibir,
    valorSelecionado,
    onChange,
    name
}) => {
    return (
        <select
            className="form-select"
            name={name}
            value={valorSelecionado}
            onChange={onChange}
            required
        >
            <option value="" disabled>Selecione uma opção...</option>
            {
                // Garante que 'dados' seja um array antes de mapear
                Array.isArray(dados) && dados.filter(Boolean).map((item) => {
                    
                    // CORREÇÃO APLICADA AQUI:
                    // 1. Verifica se o texto a ser exibido existe.
                    const textoExibir = item[campoExibir];
                    
                    // 2. Se o texto não existir, exibe um aviso em vez de um campo em branco.
                    const textoFinal = textoExibir || `(Opção Inválida - ID: ${item[campoChave]})`;

                    return (
                        <option key={item[campoChave]} value={item[campoChave]}>
                            {textoFinal}
                        </option>
                    );
                })
            }
        </select>
    );
};

export default CaixaSelecaoSimples;