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
// import { alterarSenha } from "../../Services/usersService"; // Removido - Legado
// import { buscarMensagens } from "../../Services/mensagemService"; // Removido - Legado

// Mock da função buscarMensagens para MVP (retorna array vazio)
const buscarMensagensMock = async (token) => {
    console.log("buscarMensagensMock chamado com token:", token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                status: true, 
                listaMensagem: [] 
            });
        }, 300);
    });
};

// Mock da função alterarSenha para MVP (apenas exibe alerta)
const alterarSenhaMock = async (token, email, senhaAtual, novaSenha, confirmarSenha) => {
    console.log("alterarSenhaMock chamado com:", { token, email, senhaAtual, novaSenha, confirmarSenha });
    return new Promise(resolve => {
        setTimeout(() => {
            if (novaSenha !== confirmarSenha) {
                resolve({ status: false, mensagem: "A nova senha e a confirmação não conferem (Mock)." });
                return;
            }
            // Simula sucesso ou falha simples
            if (senhaAtual === "123") { // Simula senha atual correta
                 resolve({ status: true, mensagem: "Senha alterada com sucesso (Mock)!" });
            } else {
                 resolve({ status: false, mensagem: "Senha atual incorreta (Mock)." });
            }
        }, 500);
    });
};

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
    if (showNotificacoes && usuarioLogado && usuarioLogado.token) { // Adicionado guarda para usuarioLogado
        const carregarMensagens = async () => {
            try {
                const resultado = await buscarMensagensMock(usuarioLogado.token); // Usando mock
                const lista = resultado?.listaMensagem || [];
                setMensagens(lista);
                setQuantidadeMensagensPendentes(lista.length);
                setTemNovasMensagens(lista.length > 0);
            } catch (error) {
                console.error("Erro ao buscar mensagens (Mock):", error);
            }
        };
        carregarMensagens();
    }
}, [showNotificacoes, usuarioLogado]); // Removido usuarioLogado.token, adicionado usuarioLogado


useEffect(() => {
  if (usuarioLogado && usuarioLogado.token) { // Adicionado guarda para usuarioLogado
    const verificarMensagens = async () => {
        try {
            const resultado = await buscarMensagensMock(usuarioLogado.token); // Usando mock
            const lista = resultado?.listaMensagem || [];
            setQuantidadeMensagensPendentes(lista.length);
            setTemNovasMensagens(lista.length > 0);
        } catch (error) {
            console.error("Erro ao verificar mensagens (Mock):", error);
        }
    };
    verificarMensagens();
  }
}, [usuarioLogado]); // Removido usuarioLogado.token, adicionado usuarioLogado


function handleLogout() {
  setUsuarioLogado({ nome: "", logado: false, token: "", role: null }); 
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
      const resultado = await alterarSenhaMock( // Usando mock
        usuarioLogado?.token,
        usuarioLogado?.email,
        senha.senhaAtual,
        senha.novaSenha,
        senha.confirmarSenha
      );

      alert(resultado.mensagem); // Exibe a mensagem do mock
      if (resultado.status) {
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erro ao alterar senha (Mock):", error);
      alert("Erro ao alterar senha (Mock). Tente novamente.");
    }
  };

  // Lógica de exibição de cadastros simplificada para o MVP
  const cadastrosMVP = (
    <NavDropdown title="Cadastros (MVP)" id="cadastros-mvp-nav-dropdown">
        <NavDropdown.Item as={Link} to="/cadastros/modelo-equipamento">Modelos de Equipamentos</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/cadastros/pagamento">Tipos de Pagamento</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/cadastros/urgencia">Níveis de Urgência</NavDropdown.Item>
        {/* Adicionar outros cadastros do MVP aqui conforme necessário */}
    </NavDropdown>
  );

  return (
    <>
      <Navbar expand="lg" className="bg-light shadow-sm" sticky="top">
        <Container fluid className="w-100 mx-2">
          <Navbar.Brand as={Link} to={usuarioLogado.logado ? "/ordens-servico" : "/"} className="d-flex align-items-center ms-2">
            <FaHome className="me-1" /> Home OS
          </Navbar.Brand>
        
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {usuarioLogado.logado && cadastrosMVP} {/* Exibe cadastros MVP se logado */}
              {/* Outros links de navegação específicos do MVP podem ser adicionados aqui */}
            </Nav>

            <Nav className="ms-auto">
            {/* Seção de notificações e mensagens removida/simplificada para o MVP */}
            {/* {usuarioLogado.logado && usuarioLogado.role === 2 && ( ... ) } */}

            {usuarioLogado.logado && (
                <NavDropdown
                title={usuarioLogado?.nome || "Usuário"}
                id="usuario-nav-dropdown"
                align="end"
                >
                <NavDropdown.Item onClick={() => setShowModal(true)}>
                    Alterar Senha (Mock)
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                </NavDropdown.Item>
                </NavDropdown>
            )}
          </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alteração de Senha (Mock)</Modal.Title>
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

