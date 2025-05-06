import React, {
  useState,
  useContext,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Container, Table, Modal, Button } from "react-bootstrap";
import { ContextoUsuarioLogado } from "../../../App";
import { FaDownload, FaRegClock, FaRegEnvelope } from "react-icons/fa";
import { atualizarStatusMensagem, baixarMensagem } from "../../../servicos/mensagemService";

const ModalDetalhesMensagem = ({ mensagem, show, handleClose, atualizarTabela }) => {
  const contextoUsuario = useContext(ContextoUsuarioLogado);

  useEffect(() => {
    const handleModalOpen = async () => {
      if (mensagem && show && mensagem.status !== "Visualizada") {
        try {
          await atualizarStatusMensagem(mensagem.id, "Visualizada", contextoUsuario.usuarioLogado.token);
          atualizarTabela(); // Atualiza a tabela ao visualizar a mensagem
        } catch (erro) {
          console.error("Erro ao atualizar status:", erro.message);
        }
      }
    };

    handleModalOpen();
  }, [mensagem, show, contextoUsuario.usuarioLogado.token, atualizarTabela]);

  if (!mensagem) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
            <div className="d-flex align-items-center gap-3">
              <FaRegEnvelope className="text-muted" />
                 Detalhes da Mensagem
            </div>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
         {/* Seção do remetente */}
          <div className="border-bottom pb-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <span className="fw-bold">De:</span> {mensagem.nome_user}
              </h5>
              <span className="text-muted small">
                <FaRegClock className="me-1" />
                {new Date(mensagem.data_hora).toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="text-muted small">
              <strong>ID:</strong> {mensagem.id} | <strong>Tipo:</strong>{' '}
              {mensagem.tipo_referencia === 'publ'
                ? 'Publicidade'
                : mensagem.tipo_referencia === 'prop'
                ? 'PropagandaPJ'
                : mensagem.tipo_referencia === 'propF'
                ? 'PropagandaPF'
                : mensagem.tipo_referencia}{' '}
              | <strong>Cliente: </strong> {mensagem.cliente_nome}
            </div>
          </div>


        {/* Conteúdo da mensagem */}
        <div className="mb-4">
          <h6 className="fw-bold">Mensagem:</h6>
          <p style={{ whiteSpace: "pre-wrap" }}>{mensagem.mensagem}</p>
        </div>
        
        {/* Anexo da mensagem */}
        {mensagem.arquivo && (
          <div className="bg-light p-3 rounded border">
            <h6 className="fw-bold">Anexo:</h6>
            <div className="d-flex align-items-center">
              <FaDownload className="text-primary me-2" />
              <span
                className="text-primary"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  const userId = mensagem.user_id;
                  const userName = mensagem.nome_user;
                  const mesAno = new Date(mensagem.data_hora)
                    .toLocaleDateString("pt-BR", {
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace("/", "_");
                  baixarMensagem(
                    userId,
                    userName,
                    mesAno,
                    mensagem.arquivo,
                    contextoUsuario.usuarioLogado.token
                  ).catch((error) => alert(error.message));
                }}
              >
                {mensagem.arquivo}
              </span>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const TabelaMensagem = forwardRef((props, ref) => {
  const contextoUsuario = useContext(ContextoUsuarioLogado);
  const [modalShow, setModalShow] = useState(false);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);
  const [selecionados, setSelecionados] = useState([]);

  useImperativeHandle(ref, () => ({
    obterSelecionados: () => selecionados,
    limparSelecionados: () => setSelecionados([]),
  }));

  const handleSelecionarTodos = () => {
    if (selecionados.length === props.listaMensagem.length) {
      setSelecionados([]);
    } else {
      setSelecionados(props.listaMensagem.map((mensagem) => mensagem.id));
    }
  };

  const handleSelecionar = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRowClick = (mensagem, coluna) => {
    if (coluna !== "checkbox") {
      setMensagemSelecionada(mensagem);
      setModalShow(true);
    }
  };

  const handleCloseModal = () => {
    setModalShow(false);
    props.setAtualizarTela(true); // Atualiza a tabela ao fechar o modal
  };

  const handleMarcarComoNaoLida = async () => {
    try {
      for (const id of selecionados) {
        await atualizarStatusMensagem(id, "Enviada", contextoUsuario.usuarioLogado.token);
      }
      alert("Mensagens marcadas como 'Não Lida'.");
      props.setAtualizarTela(true); // Atualiza a tabela após a ação
      setSelecionados([]); // Limpa os selecionados
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro.message);
      alert("Erro ao marcar mensagens como 'Não Lida'.");
    }
  };

  return (
    <Container fluid className="px-2">

      {/* Tabela de Mensagens */}
      <Table bordered hover responsive className="text-center align-middle small">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelecionarTodos}
                checked={
                  selecionados.length === props.listaMensagem.length &&
                  props.listaMensagem.length > 0
                }
              />
            </th>
            <th>Usuário</th>
            <th>Mensagem</th>
            <th>Data / Hora</th>
            <th>Anexo</th>
          </tr>
        </thead>
        <tbody>
          {props.listaMensagem?.map((mensagem) => (
            <tr
              key={mensagem.id}
              className={`${
                mensagem.status === "Enviada"
                  ? "fw-bold bg-secondary"
                  : mensagem.status === "Visualizada"
                  ? "bg-light"
                  : ""
              }`}
              onClick={() => handleRowClick(mensagem, "linha")}
              style={{ cursor: "pointer" }}
            >
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(mensagem.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelecionar(mensagem.id);
                  }}
                />
              </td>
              <td className="text-nowrap align-top">{mensagem.nome_user}</td>
              <td
                className={`align-top text-nowrap ${
                  mensagem.status === "Enviada" ? "fw-bold" : ""
                }`}
                style={{
                  maxWidth: "250px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {mensagem.mensagem}
              </td>
              <td className="text-nowrap align-top">
                <span className="text-muted">
                  {new Date(mensagem.data_hora).toLocaleString("pt-BR")}
                </span>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                {mensagem.arquivo && (
                  <FaDownload
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const userId = mensagem.user_id;
                      const userName = mensagem.nome_user;
                      const mesAno = new Date(mensagem.data_hora)
                        .toLocaleDateString("pt-BR", {
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace("/", "_");
                      baixarMensagem(
                        userId,
                        userName,
                        mesAno,
                        mensagem.arquivo,
                        contextoUsuario.usuarioLogado.token
                      ).catch((error) => alert(error.message));
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalDetalhesMensagem
        show={modalShow}
        handleClose={handleCloseModal}
        mensagem={mensagemSelecionada}
        atualizarTabela={props.setAtualizarTela}
      />
    </Container>
  );
});

export default TabelaMensagem;
