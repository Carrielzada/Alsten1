import React, { useState, useContext } from 'react';
import { Card, Form, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaUser, FaLock, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import LayoutModerno from '../LayoutModerno/LayoutModerno';
import Button from '../UI/Button';
import { ContextoUsuarioLogado } from '../../App';
import { atualizarMeuPerfil, alterarSenha } from '../../Services/usersService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TelaPerfil = () => {
    const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuarioLogado);
    const [activeTab, setActiveTab] = useState('dados');
    
    // Estados para dados pessoais
    const [dadosPessoais, setDadosPessoais] = useState({
        nome: usuarioLogado.nome || '',
        email: usuarioLogado.email || ''
    });
    const [editandoDados, setEditandoDados] = useState(false);
    const [carregandoDados, setCarregandoDados] = useState(false);
    
    // Estados para alteração de senha
    const [dadosSenha, setDadosSenha] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [carregandoSenha, setCarregandoSenha] = useState(false);
    
    // Feedback states
    const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

    // Handlers para dados pessoais
    const handleDadosChange = (e) => {
        const { name, value } = e.target;
        setDadosPessoais(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalvarDados = async () => {
        if (!dadosPessoais.nome.trim() || !dadosPessoais.email.trim()) {
            setFeedback({ tipo: 'warning', mensagem: 'Nome e email são obrigatórios.' });
            return;
        }

        setCarregandoDados(true);
        try {
            await atualizarMeuPerfil({
                nome: dadosPessoais.nome,
                email: dadosPessoais.email
            });

            // Atualizar contexto do usuário
            setUsuarioLogado(prev => ({
                ...prev,
                nome: dadosPessoais.nome,
                email: dadosPessoais.email
            }));

            // Atualizar localStorage
            const usuarioAtualizado = {
                ...usuarioLogado,
                nome: dadosPessoais.nome,
                email: dadosPessoais.email
            };
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

            setEditandoDados(false);
            toast.success('Dados atualizados com sucesso!');
            setFeedback({ tipo: '', mensagem: '' });
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            setFeedback({ 
                tipo: 'danger', 
                mensagem: error.message || 'Erro ao atualizar dados. Tente novamente.' 
            });
        } finally {
            setCarregandoDados(false);
        }
    };

    const handleCancelarEdicao = () => {
        setDadosPessoais({
            nome: usuarioLogado.nome || '',
            email: usuarioLogado.email || ''
        });
        setEditandoDados(false);
        setFeedback({ tipo: '', mensagem: '' });
    };

    // Handlers para alteração de senha
    const handleSenhaChange = (e) => {
        const { name, value } = e.target;
        setDadosSenha(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAlterarSenha = async () => {
        if (!dadosSenha.senhaAtual || !dadosSenha.novaSenha || !dadosSenha.confirmarSenha) {
            setFeedback({ tipo: 'warning', mensagem: 'Todos os campos de senha são obrigatórios.' });
            return;
        }

        if (dadosSenha.novaSenha !== dadosSenha.confirmarSenha) {
            setFeedback({ tipo: 'warning', mensagem: 'A nova senha e a confirmação não conferem.' });
            return;
        }

        if (dadosSenha.novaSenha.length < 6) {
            setFeedback({ tipo: 'warning', mensagem: 'A nova senha deve ter pelo menos 6 caracteres.' });
            return;
        }

        setCarregandoSenha(true);
        try {
            await alterarSenha(
                usuarioLogado.email,
                dadosSenha.senhaAtual,
                dadosSenha.novaSenha,
                dadosSenha.confirmarSenha
            );

            setDadosSenha({
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: ''
            });

            toast.success('Senha alterada com sucesso!');
            setFeedback({ tipo: '', mensagem: '' });
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            setFeedback({ 
                tipo: 'danger', 
                mensagem: error.message || 'Erro ao alterar senha. Verifique a senha atual e tente novamente.' 
            });
        } finally {
            setCarregandoSenha(false);
        }
    };

    // Obter nome do role
    const getRoleName = (roleId) => {
        const roles = {
            1: 'Administrador',
            2: 'Diretoria', 
            3: 'PCM',
            4: 'Comercial',
            5: 'Logística',
            6: 'Técnico'
        };
        return roles[roleId] || 'Usuário';
    };

    return (
        <LayoutModerno>
            <div className="container-fluid px-4">
                
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white d-flex align-items-center">
                                <FaUser className="me-2" />
                                <h5 className="mb-0">Meu Perfil</h5>
                            </Card.Header>
                            <Card.Body>
                                {feedback.mensagem && (
                                    <Alert variant={feedback.tipo} className="mb-3">
                                        {feedback.mensagem}
                                    </Alert>
                                )}

                                <Tabs 
                                    activeKey={activeTab} 
                                    onSelect={(k) => setActiveTab(k)}
                                    className="mb-4"
                                >
                                    <Tab eventKey="dados" title={<><FaUser className="me-1" />Dados Pessoais</>}>
                                        <div className="pt-3">
                                            <Form>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Nome Completo</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="nome"
                                                                value={dadosPessoais.nome}
                                                                onChange={handleDadosChange}
                                                                disabled={!editandoDados}
                                                                placeholder="Seu nome completo"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Email</Form.Label>
                                                            <Form.Control
                                                                type="email"
                                                                name="email"
                                                                value={dadosPessoais.email}
                                                                onChange={handleDadosChange}
                                                                disabled={!editandoDados}
                                                                placeholder="seu@email.com"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="fw-semibold">Nível de Acesso</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={getRoleName(usuarioLogado.role)}
                                                        disabled
                                                        className="bg-light"
                                                    />
                                                    <Form.Text className="text-muted">
                                                        O nível de acesso só pode ser alterado por um administrador.
                                                    </Form.Text>
                                                </Form.Group>

                                                <div className="d-flex justify-content-end">
                                                    {!editandoDados ? (
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => setEditandoDados(true)}
                                                        >
                                                            <FaEdit className="me-1" />
                                                            Editar Dados
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="secondary"
                                                                onClick={handleCancelarEdicao}
                                                                className="me-2"
                                                                disabled={carregandoDados}
                                                            >
                                                                <FaTimes className="me-1" />
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                variant="success"
                                                                onClick={handleSalvarDados}
                                                                disabled={carregandoDados}
                                                            >
                                                                <FaSave className="me-1" />
                                                                {carregandoDados ? 'Salvando...' : 'Salvar'}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </Form>
                                        </div>
                                    </Tab>
                                    
                                    <Tab eventKey="senha" title={<><FaLock className="me-1" />Alterar Senha</>}>
                                        <div className="pt-3">
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-semibold">Senha Atual *</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="senhaAtual"
                                                        value={dadosSenha.senhaAtual}
                                                        onChange={handleSenhaChange}
                                                        placeholder="Digite sua senha atual"
                                                    />
                                                </Form.Group>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Nova Senha *</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                name="novaSenha"
                                                                value={dadosSenha.novaSenha}
                                                                onChange={handleSenhaChange}
                                                                placeholder="Digite a nova senha"
                                                                minLength={6}
                                                            />
                                                            <Form.Text className="text-muted">
                                                                Mínimo de 6 caracteres
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Confirmar Nova Senha *</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                name="confirmarSenha"
                                                                value={dadosSenha.confirmarSenha}
                                                                onChange={handleSenhaChange}
                                                                placeholder="Confirme a nova senha"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <div className="d-flex justify-content-end">
                                                    <Button
                                                        variant="warning"
                                                        onClick={handleAlterarSenha}
                                                        disabled={carregandoSenha}
                                                    >
                                                        <FaLock className="me-1" />
                                                        {carregandoSenha ? 'Alterando...' : 'Alterar Senha'}
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false}
                theme="colored" 
            />
        </LayoutModerno>
    );
};

export default TelaPerfil;