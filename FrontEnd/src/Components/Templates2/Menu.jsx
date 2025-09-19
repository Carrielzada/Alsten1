import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
// Certifique-se de ter 'react-icons' instalado: npm install react-icons
import { FaSignOutAlt, FaBell, FaBars } from "react-icons/fa";
import { ContextoUsuarioLogado } from "../../App"; // Ajuste o caminho se necessário
import logoImage from "../../assets/imagens/logoalsten.png"; // << AJUSTE O CAMINHO PARA SUA LOGO
import Button from '../UI/Button'; // Nosso Button moderno
import Breadcrumb from '../UI/Breadcrumb';

// Adicionamos 'toggleBarra' como propriedade (props)
export default function Menu({ toggleBarra }) {
  const navigate = useNavigate();
  // const location = useLocation(); // removido - não utilizado
  const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuarioLogado);
  const [mensagens, /*setMensagens*/] = useState([]);
  const [showNotificacoes, setShowNotificacoes] = useState(false);
  const [quantidadeMensagensPendentes, /*setQuantidadeMensagensPendentes*/] = useState(0);
  const [carregandoMensagens, /*setCarregandoMensagens*/] = useState(false);


  // Carregar mensagens quando abrir notificações
  useEffect(() => {
    if (showNotificacoes && usuarioLogado?.token) {
      // Sua lógica para carregar mensagens aqui
    }
  }, [showNotificacoes, usuarioLogado?.token]);

  // Verificar mensagens periodicamente
  useEffect(() => {
    if (usuarioLogado?.token) {
      // Sua lógica para verificar mensagens aqui
      const interval = setInterval(() => {
        // Sua lógica de verificação periódica
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


  // Marcar mensagem como lida
  const marcarComoLida = async (mensagemId) => {
    // Implementar função para marcar mensagem como lida
    // await marcarMensagemComoLida(usuarioLogado.token, mensagemId);
    // carregarMensagens();
  };

  // Breadcrumb será renderizado no lugar do dropdown

  return (
    <>
      <Navbar expand="lg" className="bg-light shadow-sm" fixed="top" style={{ zIndex: 1030 }}>
        <Container fluid className="w-100 mx-3 d-flex align-items-center">
          <img
            src={logoImage}
            alt="Logo Alsten"
            className="img-fluid"
            style={{ maxHeight: "80px", marginRight: "30px" }} // espaçamento direto no estilo
          />

          <Button
            variant="outline-secondary"
            onClick={toggleBarra}
            className="me-2 border-0"
            style={{ width: '3vw' }}
            aria-label="Toggle Sidebar"
          >
            <FaBars />
          </Button>

          <Navbar.Brand
            as={Link}
            to={usuarioLogado.logado ? "/ordens-servico" : "/"}
            className="p-0 me-3"
          >

          </Navbar.Brand>

          <div className="navbar-nav w-100">
            <Nav className="me-auto">
              {usuarioLogado.logado && (
                <div className="d-flex align-items-center">
                  <Breadcrumb />
                </div>
              )}
            </Nav>

            <Nav className="ms-auto">
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
                    <NavDropdown.Item disabled>Carregando...</NavDropdown.Item>
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
                    <NavDropdown.Item disabled>Nenhuma notificação</NavDropdown.Item>
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

              {usuarioLogado.logado && (
                <NavDropdown
                  title={usuarioLogado.nome || "Usuário"}
                  id="usuario-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/meu-perfil">
                    Meu Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Sair
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
}