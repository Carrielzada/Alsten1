import { useEffect, useState, useContext } from "react";
import { Form, Row, Col, Button, Container, FloatingLabel } from "react-bootstrap";
import { ContextoUsuarioLogado } from "../../../App";
import { gravarNetworking, alterarNetworking } from "../../../servicos/networkingService";
import { FaSave, FaTimes } from "react-icons/fa";

export default function FormCadNetworking(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [validado, setValidado] = useState(false);

    const [networking, setNetworking] = useState({
        nome: "",
        categoria: "",
        contato: "",
        email: "",
        data_nascimento: "",
        observacoes: "",
    });

    // Preenche os dados ao entrar no modo de edição
    useEffect(() => {
        if (props.modoEdicao && props.networkingSelecionado) {
            const networkingEdit = {
                ...props.networkingSelecionado,
                data_nascimento: props.networkingSelecionado.data_nascimento
                    ? props.networkingSelecionado.data_nascimento.split('T')[0] // Pega apenas "YYYY-MM-DD"
                    : ""
            };
            setNetworking(networkingEdit);
        }
    }, [props.modoEdicao, props.networkingSelecionado]);
    

    // Formatar Contato (máximo 11 números com máscara)
    const formatarContato = (valor) => {
        valor = valor.replace(/\D/g, "").slice(0, 11); // Remove não numéricos e limita a 11 dígitos
        return valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    };

    // Verificar Data de Nascimento
    const validarDataNascimento = (data) => {
        const hoje = new Date().toISOString().split("T")[0];
        return data <= hoje;
    };

    // Manipular Mudanças nos Campos
    const manipularMudanca = (e) => {
        const { name, value } = e.target;

        if (name === "contato") {
            setNetworking({ ...networking, contato: formatarContato(value) });
        } else if (name === "data_nascimento" && !validarDataNascimento(value)) {
            alert("A data de nascimento não pode ser futura.");
            setNetworking({ ...networking, data_nascimento: "" });
        } else {
            setNetworking({ ...networking, [name]: value });
        }
    };
    

    // Submissão do Formulário
    const manipulaSubmissao = (event) => {
        const token = contextoUsuario.usuarioLogado.token;
        const form = event.currentTarget;
        
        if (form.checkValidity()) {         
            if (props.modoEdicao) {
                // Atualiza registro
                alterarNetworking(networking, token)
                    .then((resposta) => {
                        if (resposta.status) {
                            alert("Networking atualizado com sucesso!");
                            props.setExibirTabela(true);
                            props.setModoEdicao(false);
                        } else {
                            alert(resposta.mensagem);
                        }
                    })
                    .catch((erro) => {
                        alert("Erro ao atualizar: " + erro.message);
                    });
            } else {
                // Grava novo registro
                gravarNetworking(networking, token)
                    .then((resposta) => {
                        if (resposta.status) {
                            alert("Networking cadastrado com sucesso!");
                            props.setExibirTabela(true);
                        } else {
                            alert(resposta.mensagem);
                        }
                    })
                    .catch((erro) => {
                        alert("Ocorreu um erro. Tente novamente.");
                    });
            }
    
            setValidado(false);
        } else {
            setValidado(true);
        }
        event.preventDefault();
    };
    

    // Tratar Erro de Email Duplicado
    const tratarErroEmail = (mensagem) => {
        if (mensagem.includes("O e-mail informado já está cadastrado")) {
            alert("O e-mail informado já está cadastrado. Por favor, utilize outro e-mail.");
        } else {
            alert("Ocorreu um erro. Tente novamente.");
        }
    };

    return (
        <Container className="p-3 border rounded shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
            <Form noValidate validated={validado} onSubmit={manipulaSubmissao} className="small">
                <h5 className="mb-3 text-center fw-bold">
                    {props.modoEdicao ? "Editar Networking" : "Cadastro de Networking"}
                </h5>
                <hr />
                <Row className="justify-content-center">
                    <Col xs={12} md={6} className="mb-2">
                        <FloatingLabel controlId="nomeNetworking" label="Nome do Networking">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="nome"
                                required
                                value={networking.nome}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} md={3} className="mb-2">
                        <FloatingLabel controlId="categoriaNetworking" label="Categoria">
                            <Form.Select
                                size="sm"
                                name="categoria"
                                required
                                value={networking.categoria}
                                onChange={manipularMudanca}
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="Prefeituras">Prefeituras</option>
                                <option value="Propaganda">Propaganda</option>
                                <option value="Parceiros">Parceiros</option>
                                <option value="Investidores">Investidores</option>
                                <option value="Colaboradores">Colaboradores</option>
                                <option value="Política">Política</option>
                                <option value="Social">Social</option>
                                <option value="Rádio">Rádio</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Eventos">Eventos</option>
                                <option value="Estudio de Gravação">Estudio de Gravação</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>

                    <Col xs={12} md={3} className="mb-2">
                        <FloatingLabel controlId="contatoNetworking" label="Contato">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="contato"
                                required
                                value={networking.contato}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} className="mb-2">
                        <FloatingLabel controlId="emailNetworking" label="E-mail">
                            <Form.Control
                                size="sm"
                                type="email"
                                name="email"
                                required
                                value={networking.email}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} md={6} className="mb-2">
                        <FloatingLabel controlId="dataNascimentoNetworking" label="Data de Nascimento">
                            <Form.Control
                                size="sm"
                                type="date"
                                name="data_nascimento"
                                required
                                value={networking.data_nascimento}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <FloatingLabel controlId="observacoesNetworking" label="Observações">
                            <Form.Control
                                size="sm"
                                as="textarea"
                                rows={2}
                                name="observacoes"
                                value={networking.observacoes}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    <Col xs="auto">
                        <Button type="submit" size="sm" className="px-3" style={{ backgroundColor: "#191970" }}>
                            <FaSave className="me-1" /> {props.modoEdicao ? "Atualizar" : "Gravar"}
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="px-3"
                            onClick={() => props.setExibirTabela(true)}
                        >
                            <FaTimes className="me-1" /> Cancelar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
