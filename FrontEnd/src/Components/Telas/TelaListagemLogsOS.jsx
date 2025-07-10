import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buscarLogsOrdemServico } from '../../Services/ordemServicoService'; // Caminho corrigido

const TelaListagemLogsOS = () => {
    const [logs, setLogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [logSelecionado, setLogSelecionado] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await buscarLogsOrdemServico();
                setLogs(data);
            } catch (error) {
                toast.error("Erro ao buscar logs: " + error.message);
            }
        };
        fetchLogs();
    }, []);

    const handleVerDetalhes = (log) => {
        setLogSelecionado(log);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setLogSelecionado(null);
    };

    return (
        <div className="container mt-4">
            <h2>Listagem de Logs de Ordem de Serviço</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID Log</th>
                        <th>ID OS</th>
                        <th>Ação</th>
                        <th>Detalhes</th>
                        <th>Data/Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.ordemServicoId}</td>
                            <td>{log.acao}</td>
                            <td>
                                <Button variant="info" size="sm" onClick={() => handleVerDetalhes(log)}>
                                    Ver Detalhes
                                </Button>
                            </td>
                            <td>{new Date(log.dataHora).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes do Log</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {logSelecionado && (
                        <div>
                            <p><strong>ID Log:</strong> {logSelecionado.id}</p>
                            <p><strong>ID Ordem de Serviço:</strong> {logSelecionado.ordemServicoId}</p>
                            <p><strong>Ação:</strong> {logSelecionado.acao}</p>
                            <p><strong>Detalhes:</strong> <pre>{JSON.stringify(logSelecionado.detalhes, null, 2)}</pre></p>
                            <p><strong>Data/Hora:</strong> {new Date(logSelecionado.dataHora).toLocaleString()}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TelaListagemLogsOS;


