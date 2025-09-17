import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { FaSave, FaTimes, FaUser, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { buscarRoles } from '../../Services/usersService';

const FormUsuario = ({ 
    usuario = null, 
    onSubmit, 
    onCancel, 
    loading = false, 
    modoEdicao = false 
}) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: ''
    });
    
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [loadingRoles, setLoadingRoles] = useState(true);

    useEffect(() => {
        // Carregar roles
        const carregarRoles = async () => {
            try {
                const response = await buscarRoles();
                setRoles(response.listaRoles || []);
            } catch (error) {
                console.error('Erro ao carregar roles:', error);
                setErrors({ geral: 'Erro ao carregar níveis de acesso' });
            } finally {
                setLoadingRoles(false);
            }
        };

        carregarRoles();
    }, []);

    useEffect(() => {
        // Preencher formulário se estiver editando
        if (modoEdicao && usuario) {
            setFormData({
                nome: usuario.nome || '',
                email: usuario.email || '',
                password: '',
                confirmPassword: '',
                role_id: usuario.role_id || ''
            });
        }
    }, [modoEdicao, usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!modoEdicao) {
            if (!formData.password) {
                newErrors.password = 'Senha é obrigatória';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Senhas não conferem';
            }
        } else if (formData.password) {
            // Se estiver editando e forneceu nova senha
            if (formData.password.length < 6) {
                newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Senhas não conferem';
            }
        }

        if (!formData.role_id) {
            newErrors.role_id = 'Nível de acesso é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const dadosParaEnvio = {
            nome: formData.nome.trim(),
            email: formData.email.trim(),
            role_id: parseInt(formData.role_id)
        };

        // Só incluir senha se for criação ou se foi fornecida na edição
        if (!modoEdicao || formData.password) {
            dadosParaEnvio.password = formData.password;
        }

        onSubmit(dadosParaEnvio);
    };

    const handleReset = () => {
        setFormData({
            nome: '',
            email: '',
            password: '',
            confirmPassword: '',
            role_id: ''
        });
        setErrors({});
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

    if (loadingRoles) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando formulário...</p>
            </div>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            {errors.geral && (
                <Alert variant="danger" className="mb-3">
                    {errors.geral}
                </Alert>
            )}

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="nome">
                        <Form.Label className="fw-semibold">
                            <FaUser className="me-2" />
                            Nome Completo *
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Digite o nome completo"
                            isInvalid={!!errors.nome}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nome}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="email">
                        <Form.Label className="fw-semibold">
                            <FaEnvelope className="me-2" />
                            Email *
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemplo@empresa.com"
                            isInvalid={!!errors.email}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="password">
                        <Form.Label className="fw-semibold">
                            <FaLock className="me-2" />
                            {modoEdicao ? 'Nova Senha (opcional)' : 'Senha *'}
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={modoEdicao ? "Deixe vazio para manter a atual" : "Digite uma senha segura"}
                            isInvalid={!!errors.password}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Mínimo de 6 caracteres
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label className="fw-semibold">
                            <FaLock className="me-2" />
                            {modoEdicao ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirme a senha"
                            isInvalid={!!errors.confirmPassword}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group controlId="role_id">
                        <Form.Label className="fw-semibold">
                            <FaUserShield className="me-2" />
                            Nível de Acesso *
                        </Form.Label>
                        <Form.Select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                            isInvalid={!!errors.role_id}
                            disabled={loading}
                        >
                            <option value="">Selecione um nível</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.role_id}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                {formData.role_id && (
                    <Col md={6} className="d-flex align-items-end">
                        <div className="mb-3">
                            <Form.Label className="fw-semibold">Preview:</Form.Label>
                            <div>
                                <span className={`badge bg-${getRoleBadgeColor(parseInt(formData.role_id))} fs-6`}>
                                    {getRoleName(parseInt(formData.role_id))}
                                </span>
                            </div>
                        </div>
                    </Col>
                )}
            </Row>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <Button
                    variant="outline-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    <FaTimes className="me-2" />
                    Cancelar
                </Button>

                <div>
                    {!modoEdicao && (
                        <Button
                            variant="outline-warning"
                            onClick={handleReset}
                            disabled={loading}
                            className="me-2"
                        >
                            Limpar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        <FaSave className="me-2" />
                        {loading ? 'Salvando...' : (modoEdicao ? 'Atualizar' : 'Criar Usuário')}
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default FormUsuario;