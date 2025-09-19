import { Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import TabelaMensagem from "./Tabelas/TabelaMensagem.jsx";
import { useState, useEffect, useContext, useRef } from "react";
import { buscarMensagem, excluirMensagem, atualizarStatusMensagem } from "../../Services/mensagemService";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaTrash, FaUndo } from "react-icons/fa";
import Button from '../UI/Button';

export default function TelaCadMensagem(props) {
  const contextoUsuario = useContext(ContextoUsuarioLogado);
  const tabelaRef = useRef();

  const [atualizarTela, setAtualizarTela] = useState(false);
  const [listaMensagem, setListaMensagem] = useState([]);

  useEffect(() => {
    async function fetchMensagens() {
      if (contextoUsuario.usuarioLogado.token) {
        try {
          const resposta = await buscarMensagem(
            contextoUsuario.usuarioLogado.token
          );
          if (resposta.status) {
            setListaMensagem(resposta.listaMensagem);
          } else {
            console.error("Erro na resposta:", resposta.mensagem);
          }
        } catch (erro) {
          console.error("Erro ao buscar mensagens:", erro.message);
        } finally {
          setAtualizarTela(false); // Certifique-se de resetar após a chamada
        }
      }
    }

    fetchMensagens();
  }, [atualizarTela]);

  const handleExcluirSelecionados = async () => {
    const idsSelecionados = tabelaRef.current.obterSelecionados();
    const token = contextoUsuario.usuarioLogado.token;

    if (idsSelecionados.length === 0) {
      alert("Nenhuma mensagem selecionada para excluir.");
      return;
    }

    if (window.confirm("Deseja excluir as mensagens selecionadas?")) {
      try {
        await Promise.all(
          idsSelecionados.map(async (id) => {
            const resposta = await excluirMensagem(id, token);
            if (!resposta.status) {
              console.error(
                `Erro ao excluir mensagem com ID ${id}:\`, resposta.mensagem`
              );
            }
          })
        );

        // Atualize a lista localmente para remover as mensagens excluídas
        setListaMensagem((prev) =>
          prev.filter((mensagem) => !idsSelecionados.includes(mensagem.id))
        );

        tabelaRef.current.limparSelecionados(); // Limpa a seleção dos checkboxes
        alert("Mensagens excluídas com sucesso!");
      } catch (erro) {
        console.error("Erro ao excluir mensagens:", erro.message);
        alert("Erro ao excluir mensagens.");
      } finally {
        setAtualizarTela(true); // Atualiza a tabela, caso necessário
      }
    }
  };

  const handleMarcarComoNaoLida = async () => {
    const idsSelecionados = tabelaRef.current.obterSelecionados();
    const token = contextoUsuario.usuarioLogado.token;

    if (idsSelecionados.length === 0) {
      alert("Nenhuma mensagem selecionada para marcar como não lida.");
      return;
    }

    try {
      await Promise.all(
        idsSelecionados.map(async (id) => {
          const resposta = await atualizarStatusMensagem(id, "Enviada", token);
          if (!resposta.status) {
            console.error(
              `Erro ao marcar como não lida a mensagem com ID ${id}:\`, resposta.mensagem`
            );
          }
        })
      );

      // Atualize a lista localmente para refletir a mudança no status
      setListaMensagem((prev) =>
        prev.map((mensagem) =>
          idsSelecionados.includes(mensagem.id)
            ? { ...mensagem, status: "Enviada" }
            : mensagem
        )
      );

      tabelaRef.current.limparSelecionados(); // Limpa a seleção dos checkboxes
    } catch (erro) {
      console.error("Erro ao marcar mensagens como não lidas:", erro.message);
      alert("Erro ao marcar mensagens como não lidas.");
    } finally {
      setAtualizarTela(true); // Atualiza a tabela, caso necessário
    }
  };

  return (
    <Pagina>
      <div className="py-3 w-100 px-2">
        <Container fluid>
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <h4>Caixa de entrada:</h4>
            </Col>
            <Col
              md={4}
              className="text-end d-flex align-items-center justify-content-end"
            >
              <Button
                className="btn btn-warning btn-sm d-flex align-items-center justify-content-center me-2"
                onClick={handleMarcarComoNaoLida}
              >
                <FaUndo className="me-1" />
                Não Lida
              </Button>
              <Button
                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                onClick={handleExcluirSelecionados}
              >
                <FaTrash className="me-1" />
                Excluir
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <TabelaMensagem
        ref={tabelaRef}
        listaMensagem={listaMensagem}
        setAtualizarTela={setAtualizarTela}
      />
    </Pagina>
  );
}