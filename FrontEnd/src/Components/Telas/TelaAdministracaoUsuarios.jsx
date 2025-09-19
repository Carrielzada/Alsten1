import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Table, Modal, Alert, Badge, Form, InputGroup } from 'react-bootstrap';
import Button from '../UI/Button'; // Nosso Button moderno
import { 
    FaUserShield, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, 
    FaUser, FaEnvelope, FaClock, FaFilter 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
// Layout será fornecido pelo LayoutModerno - não importar aqui
import FormUsuario from '../Formularios/FormUsuario';
import { ContextoUsuarioLogado } from '../../App';
import { 
    consultarUsuarios, 
    registrar, 
    atualizarUsuarioPorId, 
    deletarUsuario,
    buscarRoles
} from '../../Services/usersService';

const TelaAdministracaoUsuarios = () => {
    const { usuarioLogado } = useContext(ContextoUsuarioLogado);
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    // Estados para filtros
    const [filtros, setFiltros] = useState({
        termo: '',
        role_id: ''
    });
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        // Aplicar filtros
        aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuarios, filtros]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            
            const [usuariosResponse, rolesResponse] = await Promise.all([
                consultarUsuarios(),
                buscarRoles()
            ]);

            setUsuarios(usuariosResponse.listaUsers || []);
            setRoles(rolesResponse.listaRoles || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar usuários: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let usuariosFiltrados = [...usuarios];

        // Filtro por termo (nome ou email)
        if (filtros.termo) {
            const termo = filtros.termo.toLowerCase();
            usuariosFiltrados = usuariosFiltrados.filter(usuario => 
                usuario.nome?.toLowerCase().includes(termo) ||
                usuario.email?.toLowerCase().includes(termo)
            );
        }

        // Filtro por role
        if (filtros.role_id) {
            usuariosFiltrados = usuariosFiltrados.filter(usuario => 
                usuario.role_id === parseInt(filtros.role_id)
            );
        }

        setUsuariosFiltrados(usuariosFiltrados);
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const limparFiltros = () => {
        setFiltros({
            termo: '',
            role_id: ''
        });
    };

    const handleNovoUsuario = () => {
        setUsuarioEmEdicao(null);
        setModoEdicao(false);
        setShowModal(true);
    };

    const handleEditarUsuario = (usuario) => {
        setUsuarioEmEdicao(usuario);
        setModoEdicao(true);
        setShowModal(true);
    };

    const handleExcluirUsuario = (usuario) => {
        setUsuarioParaExcluir(usuario);
        setShowDeleteModal(true);
    };

    const handleSalvarUsuario = async (dadosUsuario) => {
        try {
            setSalvando(true);
            
            if (modoEdicao) {
                await atualizarUsuarioPorId(usuarioEmEdicao.id, dadosUsuario);
                toast.success('Usuário atualizado com sucesso!');
            } else {
                await registrar(
                    dadosUsuario.nome, 
                    dadosUsuario.email, 
                    dadosUsuario.password, 
                    dadosUsuario.role_id
                );
                toast.success('Usuário criado com sucesso!');
            }
            
            await carregarDados();
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            toast.error('Erro ao salvar usuário: ' + error.message);
        } finally {
            setSalvando(false);
        }
    };

    const confirmarExclusao = async () => {
        try {
            await deletarUsuario(usuarioParaExcluir.id);
            toast.success('Usuário excluído com sucesso!');
            await carregarDados();
            setShowDeleteModal(false);
            setUsuarioParaExcluir(null);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            toast.error('Erro ao excluir usuário: ' + error.message);
        }
    };

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'N/A';
    };

    const getRoleBadgeColor = (roleId) => {
        const colors = {
            1: 'danger',
            2: 'primary', 
            3: 'info',
            4: 'success',
            5: 'warning',
            6: 'secondary'
        };
        return colors[roleId] || 'secondary';
    };

    const formatarData = (data) => {
        if (!data) return 'N/A';
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando usuários...</p>
            </div>
        );
    }

    return (
        <Container fluid className="py-4">
                {/* Cabeçalho */}
                <Row className="mb-4">
                    <Col>
                        <Card className="border-0 shadow-sm bg-danger text-white">
                            <Card.Body className="py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="fw-bold mb-2 d-flex align-items-center">
                                            <FaUserShield size={32} className="me-3" />
                                            Administração de Usuários
                                        </h2>
                                        <p className="lead mb-0">
                                            Gerencie usuários e permissões do sistema
                                        </p>
                                    </div>
                                    <Button
                                        variant="light"
                                        onClick={handleNovoUsuario}
                                        className="px-4"
                                        style={{ 
                                            backgroundColor: 'white', 
                                            color: '#dc3545', 
                                            border: '2px solid white',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <FaPlus className="me-2" />
                                        Novo Usuário
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Alerta de segurança */}
                <Alert variant="warning" className="mb-4">
                    <strong>⚠️ Área Restrita:</strong> Apenas administradores podem gerenciar usuários. 
                    Tenha cuidado ao alterar permissões e sempre mantenha pelo menos um usuário administrador ativo.
                </Alert>

                {/* Filtros */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0 d-flex align-items-center">
                            <FaFilter className="me-2" />
                            Filtros
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Buscar usuários</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            name="termo"
                                            value={filtros.termo}
                                            onChange={handleFiltroChange}
                                            placeholder="Digite nome ou email..."
                                        />
                                        <Button variant="outline-secondary">
                                            <FaSearch />
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Filtrar por nível</Form.Label>
                                    <Form.Select
                                        name="role_id"
                                        value={filtros.role_id}
                                        onChange={handleFiltroChange}
                                    >
                                        <option value="">Todos os níveis</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={4} md={2} className="d-flex align-items-end">
                                <Button
                                    variant="outline-secondary"
                                    onClick={limparFiltros}
                                    className="mb-3 w-100"
                                >
                                    <FaTimes className="me-1" />
                                    Limpar
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Estatísticas - Badges compactos */}
                <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center justify-content-md-start">
                    <div className="d-flex align-items-center bg-primary bg-opacity-10 rounded-pill px-3 py-2">
                        <FaUser size={16} className="text-primary me-2" />
                        <span className="fw-semibold text-primary me-2">{usuarios.length}</span>
                        <small className="text-muted">Total de Usuários</small>
                    </div>
                    
                    <div className="d-flex align-items-center bg-danger bg-opacity-10 rounded-pill px-3 py-2">
                        <FaUserShield size={16} className="text-danger me-2" />
                        <span className="fw-semibold text-danger me-2">
                            {usuarios.filter(u => u.role_id === 1).length}
                        </span>
                        <small className="text-muted">Administradores</small>
                    </div>
                    
                    <div className="d-flex align-items-center bg-success bg-opacity-10 rounded-pill px-3 py-2">
                        <FaFilter size={16} className="text-success me-2" />
                        <span className="fw-semibold text-success me-2">{usuariosFiltrados.length}</span>
                        <small className="text-muted">Filtrados</small>
                    </div>
                </div>

                {/* Tabela de usuários */}
                <Card>
                    <Card.Header>
                        <h5 className="mb-0">
                            Lista de Usuários ({usuariosFiltrados.length})
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {usuariosFiltrados.length === 0 ? (
                            <div className="text-center py-5">
                                <FaUser size={48} className="text-muted mb-3" />
                                <h5 className="text-muted">Nenhum usuário encontrado</h5>
                                <p className="text-muted">
                                    {filtros.termo || filtros.role_id 
                                        ? 'Tente ajustar os filtros' 
                                        : 'Clique em "Novo Usuário" para começar'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>ID</th>
                                            <th><FaUser className="me-2" />Usuário</th>
                                            <th><FaEnvelope className="me-2" />Email</th>
                                            <th><FaUserShield className="me-2" />Nível</th>
                                            <th><FaClock className="me-2" />Criado em</th>
                                            <th width="120">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosFiltrados.map(usuario => (
                                            <tr key={usuario.id}>
                                                <td>
                                                    <strong className="text-primary">#{usuario.id}</strong>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="fw-semibold">{usuario.nome}</div>
                                                        {usuario.id === usuarioLogado.id && (
                                                            <small className="text-success">
                                                                <strong>(Você)</strong>
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{usuario.email}</td>
                                                <td>
                                                    <Badge bg={getRoleBadgeColor(usuario.role_id)}>
                                                        {getRoleName(usuario.role_id)}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <small>{formatarData(usuario.criado_em)}</small>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditarUsuario(usuario)}
                                                            title="Editar usuário"
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        {usuario.id !== usuarioLogado.id && (
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleExcluirUsuario(usuario)}
                                                                title="Excluir usuário"
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Modal de formulário */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaUserShield className="me-2" />
                            {modoEdicao ? 'Editar Usuário' : 'Novo Usuário'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormUsuario
                            usuario={usuarioEmEdicao}
                            onSubmit={handleSalvarUsuario}
                            onCancel={() => setShowModal(false)}
                            loading={salvando}
                            modoEdicao={modoEdicao}
                        />
                    </Modal.Body>
                </Modal>

                {/* Modal de confirmação de exclusão */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-danger">
                            <FaTrash className="me-2" />
                            Confirmar Exclusão
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant="danger">
                            <strong>⚠️ Atenção!</strong> Esta ação não pode ser desfeita.
                        </Alert>
                        <p>
                            Tem certeza que deseja excluir o usuário <strong>{usuarioParaExcluir?.nome}</strong>?
                        </p>
                        <p className="text-muted small">
                            Email: {usuarioParaExcluir?.email}<br />
                            Nível: <Badge bg={getRoleBadgeColor(usuarioParaExcluir?.role_id)}>
                                {getRoleName(usuarioParaExcluir?.role_id)}
                            </Badge>
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmarExclusao}
                        >
                            <FaTrash className="me-2" />
                            Excluir Usuário
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Container>
    );
};

export default TelaAdministracaoUsuarios;