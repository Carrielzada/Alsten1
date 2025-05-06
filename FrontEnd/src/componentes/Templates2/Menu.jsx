import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBell, FaRegEnvelope, FaHome } from "react-icons/fa";
import { ContextoUsuarioLogado } from "../../App";  
import { alterarSenha } from "../../servicos/usersService";
import { buscarMensagens } from "../../servicos/mensagemService";

export default function Menu() {
  const navigate = useNavigate();
  const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuarioLogado);
  const [showModal, setShowModal] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [showNotificacoes, setShowNotificacoes] = useState(false);
  const [temNovasMensagens, setTemNovasMensagens] = useState(false);
  const [quantidadeMensagensPendentes, setQuantidadeMensagensPendentes] = useState(0);

  const [senha, setSenha] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    if (showNotificacoes) {
        const carregarMensagens = async () => {
            try {
                const resultado = await buscarMensagens(usuarioLogado.token, "Enviada");
                const lista = resultado?.listaMensagem || [];
                setMensagens(lista);

                // Atualiza a quantidade de mensagens pendentes
                setQuantidadeMensagensPendentes(lista.length);

                // Atualiza a flag caso existam mensagens pendentes
                setTemNovasMensagens(lista.length > 0);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            }
        };
        carregarMensagens();
    }
}, [showNotificacoes, usuarioLogado.token]);


useEffect(() => {
  const verificarMensagens = async () => {
      try {
          const resultado = await buscarMensagens(usuarioLogado.token, "Enviada");
          const lista = resultado?.listaMensagem || [];
          setQuantidadeMensagensPendentes(lista.length);
          setTemNovasMensagens(lista.length > 0);
      } catch (error) {
          console.error("Erro ao verificar mensagens:", error);
      }
  };
  verificarMensagens();
}, [usuarioLogado.token]);


function handleLogout() {
  setUsuarioLogado({ nome: "", logado: false, token: "", role: null }); // Corrigido para usar setUsuarioLogado
  localStorage.removeItem("usuarioLogado");
  navigate("/");
}


  const handleChangeSenha = (e) => {
    const { name, value } = e.target;
    setSenha({ ...senha, [name]: value });
  };

  const handleSaveSenha = async () => {
    if (senha.novaSenha !== senha.confirmarSenha) {
      alert("A nova senha e a confirmação não conferem.");
      return;
    }

    try {
      const resultado = await alterarSenha(
        usuarioLogado?.token,
        usuarioLogado?.email,
        senha.senhaAtual,
        senha.novaSenha,
        senha.confirmarSenha
      );

      if (resultado.status) {
        alert("Senha alterada com sucesso!");
        setShowModal(false);
      } else {
        alert(resultado.mensagem);
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha. Tente novamente.");
    }
  };


  return (
    <>
      <Navbar expand="lg" className="bg-light shadow-sm" sticky="top">
        <Container fluid className="w-100 mx-2">
          {usuarioLogado.role === 1 || usuarioLogado.role === 2 || usuarioLogado.role === 4 ? (
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center ms-2">
              <FaHome className="me-1" /> Home
            </Navbar.Brand>
          ) : (
            <>
              <Navbar.Brand as={Link} to="/home-cliente" className="d-flex align-items-center ms-2">
                <FaHome className="me-1" /> Home
              </Navbar.Brand>
              <Navbar.Brand as={Link} to="/dashboard-cliente">Dashboard</Navbar.Brand>
            </>
          )}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {usuarioLogado.role === 1 && (
                <NavDropdown title="Cadastros" id="cadastros-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/networking">Networking</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/clientes/pf">Clientes Pessoa Física</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/clientes/pj">Clientes Pessoa Jurídica</NavDropdown.Item>
                </NavDropdown>
              )}

              {usuarioLogado.role === 4 && (
                <>
                  <Nav.Link as={Link} to="/dashboard-cliente">Dashboard</Nav.Link>
                  <NavDropdown title="Cadastro de Publicidade" id="publicidade-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/publicidade/pj">Publicidade Pessoa Jurídica</NavDropdown.Item>
                  </NavDropdown>
                </>
              )}

              {usuarioLogado.role === 2 && (
                <>
                  <NavDropdown title="Cadastros" id="cadastros-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/networking">Networking</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/clientes/pf">Clientes Pessoa Física</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/clientes/pj">Clientes Pessoa Jurídica</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Publicidade" id="publicidade-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/publicidade/pj">Publicidade Pessoa Jurídica</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Propaganda" id="propaganda-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/propaganda/pf">Propaganda Pessoa Física</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/propaganda/pj">Propaganda Pessoa Jurídica</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/mensagem" className="d-flex align-items-center ms-2">
                    <FaRegEnvelope className="me-1" /> Mensagens
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="ms-auto">
            {usuarioLogado.role === 2 && (
              <NavDropdown
                title={
                  <span className="position-relative">
                    <FaBell style={{ color: temNovasMensagens ? "Blue" : "inherit" }} />
                    {quantidadeMensagensPendentes > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-15px",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px 6px",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {quantidadeMensagensPendentes}
                      </span>
                    )}
                  </span>
                }
                id="notificacoes-dropdown"
                align="end"
                show={showNotificacoes}
                onToggle={(isOpen) => setShowNotificacoes(isOpen)}
              >
                <div
                  className="notification-container"
                  style={{ maxHeight: "600px", overflowY: "auto", width: "350px" }}
                >
                  {mensagens && mensagens.length > 0 ? (
                    mensagens.map((mensagem) => (
                      <NavDropdown.Item
                        key={mensagem.id}
                        onClick={() => navigate("/mensagem")}
                        className="p-2 border-bottom"
                      >
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex justify-content-between">
                            <strong className="text-dark">{mensagem.nome_user}</strong>
                            <span className="text-muted fs-sm">
                              {new Date(mensagem.data_hora).toLocaleString("pt-BR")}
                            </span>
                          </div>
                          <small className="text-truncate">{mensagem.mensagem}</small>
                        </div>
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item className="text-center py-3">
                      <small className="text-muted">Sem novas mensagens</small>
                    </NavDropdown.Item>
                  )}
                </div>
              </NavDropdown>
            )}

            <NavDropdown
              title={usuarioLogado?.nome || "Usuário"}
              id="usuario-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={() => setShowModal(true)}>
                Alterar Senha
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt /> Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alteração de Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label>Senha Atual</label>
              <input
                type="password"
                className="form-control"
                name="senhaAtual"
                value={senha.senhaAtual}
                onChange={handleChangeSenha}
              />
            </div>
            <div className="mb-3">
              <label>Nova Senha</label>
              <input
                type="password"
                className="form-control"
                name="novaSenha"
                value={senha.novaSenha}
                onChange={handleChangeSenha}
              />
            </div>
            <div className="mb-3">
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                className="form-control"
                name="confirmarSenha"
                value={senha.confirmarSenha}
                onChange={handleChangeSenha}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveSenha}>Alterar Senha</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
