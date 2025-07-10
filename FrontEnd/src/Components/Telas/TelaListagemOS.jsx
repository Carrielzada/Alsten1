import React, { useState, useEffect } from 'react';
import { buscarTodasOrdensServico } from '../../Services/ordemServicoService';
import Layout from '../Templates2/Layout';

const TelaListagemOS = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

useEffect(() => {
    const fetchOrdensServico = async () => {
        try {
            const data = await buscarTodasOrdensServico();
            console.log('Dados retornados:', data); // 👈 Adicione aqui
            setOrdensServico(data.listaOrdensServico || []);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    fetchOrdensServico();
}, []);

    if (loading) return <Layout><p>Carregando ordens de serviço...</p></Layout>;
    if (error) return <Layout><p>Erro ao carregar ordens de serviço: {error}</p></Layout>;

    return (
        <Layout>
            <h2>Painel de Ordens de Serviço (MVP)</h2>
            <button onClick={() => alert('Abrir formulário para Nova OS')}>Nova Ordem de Serviço</button>
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
                    {Array.isArray(ordensServico) && ordensServico.map(os => (
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

