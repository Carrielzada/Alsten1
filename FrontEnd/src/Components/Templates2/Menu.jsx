import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaBell } from "react-icons/fa";
import { ContextoUsuarioLogado } from "../../App";
import { alterarSenha } from "../../Services/usersService"; //alterar aqui

export default function Menu() {
  const navigate = useNavigate();
  const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuarioLogado);
  const [showModal, setShowModal] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [showNotificacoes, setShowNotificacoes] = useState(false);
  const [temNovasMensagens, setTemNovasMensagens] = useState(false);
  const [quantidadeMensagensPendentes, setQuantidadeMensagensPendentes] = useState(0);
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);
  const [carregandoSenha, setCarregandoSenha] = useState(false);

  const [senha, setSenha] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });


  // Carregar mensagens quando abrir notificações
  useEffect(() => {
    if (showNotificacoes && usuarioLogado?.token) {
    }
  }, [showNotificacoes, usuarioLogado?.token]);

  // Verificar mensagens periodicamente
  useEffect(() => {
    if (usuarioLogado?.token) {
    
      
      // Verificar mensagens a cada 30 segundos
      const interval = setInterval(() => {
      
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [usuarioLogado?.token]);

  // Função de logout
  function handleLogout() {
    setUsuarioLogado({ nome: "", logado: false, token: "", role: null, email: "" });
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  }

  // Manipular mudanças nos campos de senha
  const handleChangeSenha = (e) => {
    const { name, value } = e.target;
    setSenha({ ...senha, [name]: value });
  };

  // Salvar nova senha
  const handleSaveSenha = async () => {
    if (!senha.senhaAtual || !senha.novaSenha || !senha.confirmarSenha) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    if (senha.novaSenha !== senha.confirmarSenha) {
      alert("A nova senha e a confirmação não conferem.");
      return;
    }

    if (senha.novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregandoSenha(true);
    try {
      const resultado = await alterarSenha(
        usuarioLogado.token,
        usuarioLogado.email,
        senha.senhaAtual,
        senha.novaSenha,
        senha.confirmarSenha
      );

      alert(resultado.mensagem || "Senha alterada com sucesso!");
      
      if (resultado.status) {
        setShowModal(false);
        setSenha({
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: "",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha. Tente novamente.");
    } finally {
      setCarregandoSenha(false);
    }
  };

  // Fechar modal e limpar campos
  const handleCloseModal = () => {
    setShowModal(false);
    setSenha({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });
  };

  // Marcar mensagem como lida
  const marcarComoLida = async (mensagemId) => {
    // Implementar função para marcar mensagem como lida
    // await marcarMensagemComoLida(usuarioLogado.token, mensagemId);
    // carregarMensagens();
  };

  // Menu de cadastros
  const cadastrosMVP = (
    <NavDropdown title="Cadastros" id="cadastros-mvp-nav-dropdown">
      <NavDropdown.Item as={Link} to="/cadastros/modelo-equipamento">
        Modelos de Equipamentos
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/cadastros/pagamento">
        Tipos de Pagamento
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/cadastros/urgencia">
        Níveis de Urgência
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to="/cadastros/usuarios">
        Usuários
      </NavDropdown.Item>
    </NavDropdown>
  );

  return (
    <>
      <Navbar expand="lg" className="bg-light shadow-sm" sticky="top">
        <Container fluid className="w-100 mx-2">
          <Navbar.Brand 
            as={Link} 
            to={usuarioLogado.logado ? "/ordens-servico" : "/"} 
            className="d-flex align-items-center ms-2"
          >
            <FaHome className="me-1" /> Home OS
          </Navbar.Brand>
        
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {usuarioLogado.logado && cadastrosMVP}
              {usuarioLogado.logado && (
                <Nav.Link as={Link} to="/ordens-servico">
                  Ordens de Serviço
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto">
              {/* Notificações - apenas para administradores */}
              {usuarioLogado.logado && usuarioLogado.role === 2 && (
                <NavDropdown
                  title={
                    <span className="position-relative">
                      <FaBell />
                      {quantidadeMensagensPendentes > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {quantidadeMensagensPendentes}
                        </span>
                      )}
                    </span>
                  }
                  id="notificacoes-nav-dropdown"
                  align="end"
                  show={showNotificacoes}
                  onToggle={(isOpen) => setShowNotificacoes(isOpen)}
                >
                  <NavDropdown.Header>
                    Notificações ({quantidadeMensagensPendentes})
                  </NavDropdown.Header>
                  
                  {carregandoMensagens ? (
                    <NavDropdown.Item disabled>
                      Carregando...
                    </NavDropdown.Item>
                  ) : mensagens.length > 0 ? (
                    mensagens.slice(0, 5).map((mensagem, index) => (
                      <NavDropdown.Item 
                        key={mensagem.id || index}
                        onClick={() => marcarComoLida(mensagem.id)}
                        className="text-wrap"
                        style={{ maxWidth: '300px' }}
                      >
                        <small className="text-muted">
                          {mensagem.data || 'Data não informada'}
                        </small>
                        <br />
                        {mensagem.texto || mensagem.mensagem || 'Mensagem sem conteúdo'}
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item disabled>
                      Nenhuma notificação
                    </NavDropdown.Item>
                  )}
                  
                  {mensagens.length > 5 && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/notificacoes">
                        Ver todas as notificações
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              )}

              {/* Menu do usuário */}
              {usuarioLogado.logado && (
                <NavDropdown
                  title={usuarioLogado.nome || "Usuário"}
                  id="usuario-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item onClick={() => setShowModal(true)}>
                    Alterar Senha
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Sair
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de alteração de senha */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Alteração de Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Senha Atual *</label>
              <input
                type="password"
                className="form-control"
                name="senhaAtual"
                value={senha.senhaAtual}
                onChange={handleChangeSenha}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nova Senha *</label>
              <input
                type="password"
                className="form-control"
                name="novaSenha"
                value={senha.novaSenha}
                onChange={handleChangeSenha}
                minLength={6}
                required
              />
              <small className="form-text text-muted">
                Mínimo de 6 caracteres
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Nova Senha *</label>
              <input
                type="password"
                className="form-control"
                name="confirmarSenha"
                value={senha.confirmarSenha}
                onChange={handleChangeSenha}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={handleSaveSenha}
            disabled={carregandoSenha}
          >
            {carregandoSenha ? "Alterando..." : "Alterar Senha"}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            disabled={carregandoSenha}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}