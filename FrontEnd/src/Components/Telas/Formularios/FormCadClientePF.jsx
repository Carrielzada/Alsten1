import { useEffect, useState, useContext } from "react";
import { Form, Row, Col, Container, FloatingLabel } from "react-bootstrap";
import Button from '../../UI/Button';
import { ContextoUsuarioLogado } from "../../../App";
import { gravarClientePF, alterarClientePF } from "../../../Services/clientePFService";
import { FaSave, FaTimes } from "react-icons/fa";

export default function FormCadClientePF(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [validado, setValidado] = useState(false);

    const [clientePF, setClientePF] = useState({
        cpf: "",
        nome: "",
        data_nascimento: "",
        contato: "",
        cep: "",
        endereco: "",
        cidade: "",
        bairro: "",
        estado: ""
    });

    const formatarCPF = (valor) => {
        return valor.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatarContato = (valor) => {
        return valor.replace(/\D/g, "").slice(0, 11).replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    };

    const formatarCEP = (valor) => {
        return valor.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d{3})/, "$1-$2");
    };

    const unformatarCPF = (valor) => {
        return valor.replace(/\D/g, ""); // Remove todos os caracteres que não são dígitos
    };

    useEffect(() => {
        if (props.modoEdicao && props.clientePFSelecionado) {
            const clienteEdit = {
                ...props.clientePFSelecionado,
                data_nascimento: props.clientePFSelecionado.data_nascimento
                    ? props.clientePFSelecionado.data_nascimento.split('T')[0]
                    : ""
            };
            setClientePF(clienteEdit);
        }
    }, [props.modoEdicao, props.clientePFSelecionado]);

    const manipularMudanca = (e) => {
        const { name, value } = e.target;

        if (name === "nome" || name === "cidade" || name === "estado") {
            if (/[^a-zA-ZÀ-ÿ\s]/.test(value)) { // Aceita apenas letras e espaços
                alert("Este campo aceita apenas letras!");
                return;
            }
        }

        let valorFormatado = value;

        if (name === "cpf") {
            valorFormatado = formatarCPF(value);
        } else if (name === "contato") {
            valorFormatado = formatarContato(value);
        } else if (name === "cep") {
            valorFormatado = formatarCEP(value);
        } else if ((name === "contato" || name === "cep") && /\D/.test(value)) {
            alert("Este campo aceita apenas números!");
            return;
        }

        setClientePF({ ...clientePF, [name]: valorFormatado });
    };

    const manipulaSubmissao = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const token = contextoUsuario.usuarioLogado.token;
    
        // Remover a formatação antes de enviar ao backend
        const clientePFComCPFDesformatado = {
            ...clientePF,
            cpf: unformatarCPF(clientePF.cpf),
        };
        
        if (clientePF.cpf.length !== 11 || clientePF.contato.length < 10 || clientePF.cep.length < 9) {
            alert("CPF, Contato ou CEP estão incompletos. Verifique os campos!");
            return;
        }
    
        if (form.checkValidity()) {
            if (props.modoEdicao) {
                alterarClientePF(clientePFComCPFDesformatado, token)
                    .then((resposta) => {
                        alert("Cliente atualizado com sucesso!");
                        props.setExibirTabela(true);
                    })
                    .catch((erro) => alert("Erro ao atualizar: " + erro.message));
            } else {
                gravarClientePF(clientePFComCPFDesformatado, token)
                    .then((resposta) => {
                        alert("Cliente cadastrado com sucesso!");
                        props.setExibirTabela(true);
                    })
                    .catch((erro) => alert("Erro ao cadastrar: " + erro.message));
            }
            setValidado(false);
        } else {
            setValidado(true);
        }
    };
    
    return (
        <Container className="p-3 border rounded shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
            <Form noValidate validated={validado} onSubmit={manipulaSubmissao} className="small">
                <h5 className="mb-3 text-center fw-bold">
                    {props.modoEdicao ? "Editar Cliente PF" : "Cadastro de Cliente PF"}
                </h5>
                <hr />

                {/* Primeira linha: CPF, Nome, Data de Nascimento */}
                <Row className="mb-2">
                    <Col md={4}>
                        <FloatingLabel controlId="cpfClientePF" label="CPF">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="cpf"
                                required
                                value={clientePF.cpf}
                                onChange={manipularMudanca}
                                readOnly={props.modoEdicao}
                                style={{
                                    backgroundColor: props.modoEdicao ? "#e9ecef" : "white",
                                    cursor: props.modoEdicao ? "not-allowed" : "text",
                                }}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={5}>
                        <FloatingLabel controlId="nomeClientePF" label="Nome">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="nome"
                                required
                                value={clientePF.nome}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel controlId="dataNascimentoClientePF" label="Data de Nascimento">
                            <Form.Control
                                size="sm"
                                type="date"
                                name="data_nascimento"
                                required
                                value={clientePF.data_nascimento}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Segunda linha: Contato, CEP, Endereço */}
                <Row className="mb-2">
                    <Col md={4}>
                        <FloatingLabel controlId="contatoClientePF" label="Contato">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="contato"
                                required
                                value={clientePF.contato}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel controlId="cepClientePF" label="CEP">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="cep"
                                value={clientePF.cep}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={5}>
                        <FloatingLabel controlId="enderecoClientePF" label="Endereço">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="endereco"
                                value={clientePF.endereco}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Terceira linha: Cidade, Bairro, Estado */}
                <Row className="mb-2">
                    <Col md={4}>
                        <FloatingLabel controlId="cidadeClientePF" label="Cidade">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="cidade"
                                value={clientePF.cidade}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <FloatingLabel controlId="bairroClientePF" label="Bairro">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="bairro"
                                value={clientePF.bairro}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <FloatingLabel controlId="estadoClientePF" label="Estado">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="estado"
                                value={clientePF.estado}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Botões centralizados */}
                <Row className="mt-3 d-flex justify-content-center">
                    <Col xs="auto">
                        <Button type="submit" size="sm" className="px-3" style={{ backgroundColor: "#191970" }}>
                            <FaSave className="me-1" /> {props.modoEdicao ? "Atualizar" : "Gravar"}
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button variant="secondary" size="sm" className="px-3" onClick={() => props.setExibirTabela(true)}>
                            <FaTimes className="me-1" /> Cancelar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
