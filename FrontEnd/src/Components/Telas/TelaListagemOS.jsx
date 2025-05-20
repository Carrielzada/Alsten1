import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Se estiver usando react-router
// import ordemServicoService from '../../servicos/ordemServicoService'; // A ser criado
import Layout from '../Templates2/Layout'; // Usando o Layout Padrão
// import TabelaGenerica from '../Tabelas/TabelaGenerica'; // A ser criado ou adaptado

const TelaListagemOS = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulação de carregamento de dados
        const fetchOrdensServico = async () => {
            try {
                // const data = await ordemServicoService.getAll(); // Exemplo de chamada de serviço
                // setOrdensServico(data);
                // Exemplo mockado por enquanto:
                setOrdensServico([
                    { id: 1, cliente: 'Cliente A', modeloEquipamento: 'Modelo X1', etapa: 'Previsto' },
                    { id: 2, cliente: 'Cliente B', modeloEquipamento: 'Modelo Y2', etapa: 'Em Análise' },
                ]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchOrdensServico();
    }, []);

    const colunasTabela = [
        { Header: 'ID AP', accessor: 'id' },
        { Header: 'Cliente', accessor: 'cliente' },
        { Header: 'Modelo', accessor: 'modeloEquipamento' },
        { Header: 'Etapa', accessor: 'etapa' },
        {
            Header: 'Info',
            accessor: 'info',
            Cell: ({ row }) => (
                // <Link to={`/ordem-servico/${row.original.id}`}>Detalhes</Link> // Exemplo com react-router
                <button onClick={() => alert(`Detalhes da OS ${row.original.id}`)}>Detalhes</button>
            )
        }
    ];

    if (loading) return <Layout><p>Carregando ordens de serviço...</p></Layout>;
    if (error) return <Layout><p>Erro ao carregar ordens de serviço: {error}</p></Layout>;

    return (
        <Layout>
            <h2>Painel de Ordens de Serviço (MVP)</h2>
            {/* <Link to="/ordem-servico/nova">Nova Ordem de Serviço</Link> */}
            <button onClick={() => alert('Abrir formulário para Nova OS')}>Nova Ordem de Serviço</button>
            {/* Aqui entraria o componente TabelaGenerica 
            <TabelaGenerica colunas={colunasTabela} dados={ordensServico} /> 
            Por enquanto, uma tabela simples: */}
            <table border="1" style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>ID AP</th>
                        <th>Cliente</th>
                        <th>Modelo</th>
                        <th>Etapa</th>
                        <th>Info</th>
                    </tr>
                </thead>
                <tbody>
                    {ordensServico.map(os => (
                        <tr key={os.id}>
                            <td>{os.id}</td>
                            <td>{os.cliente}</td>
                            <td>{os.modeloEquipamento}</td>
                            <td>{os.etapa}</td>
                            <td><button onClick={() => alert(`Detalhes da OS ${os.id}`)}>Detalhes</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default TelaListagemOS;

