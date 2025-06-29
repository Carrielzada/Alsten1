import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Container, FloatingLabel } from "react-bootstrap";
import { gravarClientePJ, alterarClientePJ } from "../../../Services/clientePJService";
import { FaSave, FaTimes } from "react-icons/fa";

export default function FormCadClientePJ(props) {
    const [validado, setValidado] = useState(false);
    const [clientePJ, setClientePJ] = useState({
        // Incluindo o 'id' no estado inicial para garantir que ele exista
        id: null, 
        cnpj: "",
        nome: "",
        nome_fantasia: "",
        contato: "",
        cep: "",
        endereco: "",
        cidade: "",
        bairro: "",
        estado: ""
    });

    // Funções de formatação (mantidas como estavam)
    const formatarCNPJ = (valor) => valor.replace(/\D/g, "").replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    const formatarCEP = (valor) => valor.replace(/\D/g, "").replace(/^(\d{5})(\d{3})$/, "$1-$2");
    const formatarContato = (valor) => valor.replace(/\D/g, "").replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

    useEffect(() => {
        // Quando o modo de edição é ativado, o cliente selecionado (com ID) é carregado no estado do formulário
        if (props.modoEdicao && props.clientePJSelecionado) {
            setClientePJ(props.clientePJSelecionado);
        }
    }, [props.modoEdicao, props.clientePJSelecionado]);

    const manipularMudanca = (e) => {
        const { name, value } = e.target;
        setClientePJ({ ...clientePJ, [name]: value });
    };

    const manipulaSubmissao = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        // O objeto já contém o ID quando em modo de edição
        const clienteParaSalvar = { ...clientePJ };

        if (form.checkValidity()) {
            if (props.modoEdicao) {
                // CORREÇÃO: Chamando a função de serviço sem o token
                alterarClientePJ(clienteParaSalvar)
                    .then(() => {
                        alert("Cliente atualizado com sucesso!");
                        props.setAtualizarTela(true); // Garante que a lista será recarregada
                        props.setExibirTabela(true);
                    })
                    .catch((erro) => alert("Erro ao atualizar: " + erro.message));
            } else {
                // CORREÇÃO: Chamando a função de serviço sem o token
                gravarClientePJ(clienteParaSalvar)
                    .then(() => {
                        alert("Cliente cadastrado com sucesso!");
                        props.setAtualizarTela(true); // Garante que a lista será recarregada
                        props.setExibirTabela(true);
                    })
                    .catch((erro) => alert("Erro ao cadastrar: " + erro.message));
            }
        }
    };

    // O restante do seu JSX do formulário continua aqui, sem alterações...
    return (
        <Container className="p-3 border rounded shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
             <Form noValidate validated={validado} onSubmit={manipulaSubmissao} className="small">
                <h5 className="mb-3 text-center fw-bold">
                    {props.modoEdicao ? "Editar Cliente PJ" : "Cadastro de Cliente PJ"}
                </h5>
                <hr />

                {/* Primeira linha: CNPJ, Razão Social, Nome Fantasia */}
                <Row className="mb-2">
                    <Col md={2}>
                        <FloatingLabel controlId="cnpjClientePJ" label="CNPJ">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="cnpj"
                                required
                                value={formatarCNPJ(clientePJ.cnpj || '')}
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
                        <FloatingLabel controlId="razaoSocialClientePJ" label="Razão Social">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="nome"
                                required
                                value={clientePJ.nome}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={5}>
                        <FloatingLabel controlId="nomeFantasiaClientePJ" label="Nome Fantasia">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="nome_fantasia"
                                required
                                value={clientePJ.nome_fantasia}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Segunda linha: Contato, CEP, Endereço */}
                <Row className="mb-2">
                    <Col md={4}>
                        <FloatingLabel controlId="contatoClientePJ" label="Contato">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="contato"
                                maxLength="15"
                                required
                                value={formatarContato(clientePJ.contato || '')}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel controlId="cepClientePJ" label="CEP">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="cep"
                                maxLength="9"
                                value={formatarCEP(clientePJ.cep || '')}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={5}>
                        <FloatingLabel controlId="enderecoClientePJ" label="Endereço">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="endereco"
                                value={clientePJ.endereco}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Terceira linha: Cidade, Bairro, Estado */}
                <Row className="mb-2">
                    <Col md={4}>
                        <FloatingLabel controlId="cidadeClientePJ" label="Cidade">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="cidade"
                                value={clientePJ.cidade}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <FloatingLabel controlId="bairroClientePJ" label="Bairro">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="bairro"
                                value={clientePJ.bairro}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <FloatingLabel controlId="estadoClientePJ" label="Estado">
                            <Form.Control
                                size="sm"
                                type="text"
                                name="estado"
                                value={clientePJ.estado}
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