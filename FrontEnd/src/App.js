import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import TelaMenu from "./componentes/Telas/TelaMenu";
import Tela404 from "./componentes/Telas/Tela404";
import TelaLogin from "./componentes/Telas/TelaLogin";
import TelaNetworking from "./componentes/Telas/TelaCadNetworking";
import TelaCadClientePF from "./componentes/Telas/TelaCadClientePF";
import TelaCadClientePJ from "./componentes/Telas/TelaCadClientePJ";
import TelaPropagandaPF from "./componentes/Telas/TelaCadPropagandaPF";
import TelaPropagandaPJ from "./componentes/Telas/TelaCadPropagandaPJ";
import TelaPublicidadePJ from "./componentes/Telas/TelaCadPublicidadePJ";
import TelaHomeCliente from "./componentes/Telas/TelaHomeCliente";
import TelaCliente from "./componentes/Telas/TelaCliente";
import TelaMensagem from "./componentes/Telas/TelaMensagem";
import ProtectedComponent from "./ProtectedComponent";

export const ContextoUsuarioLogado = createContext(null);

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState({
    id: null,
    nome: "",
    logado: false,
    token: "",
    role: null, // Define a role do usuário (1 = Admin, 2 = Gerente, 3 = Cliente)
    id_dados: null,
    prop_publ: null,
  });

  // UseEffect para carregar os dados do localStorage
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      setUsuarioLogado(usuario);
    }
  }, []); // Executa apenas uma vez, ao montar o componente

  return (
    <ContextoUsuarioLogado.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      {!usuarioLogado.logado ? (
        <TelaLogin />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Rota inicial - redireciona de acordo com a role */}
            <Route
              path="/"
              element={
                usuarioLogado.role === 1 || usuarioLogado.role === 2 ? (
                  <Navigate to="/menu" />
                ) : usuarioLogado.role === 3 || usuarioLogado.role === 4 ? (
                  <Navigate to="/home-cliente" />
                ) : (
                  <Tela404 />
                )
              }
            />
            {/* Tela de Menu */}
            <Route
              path="/menu"
              element={
                <ProtectedComponent allowedRoles={[1, 2]} usuarioLogado={usuarioLogado}>
                  <TelaMenu />
                </ProtectedComponent>
              }
            />
            {/* Networking */}
            <Route
              path="/networking"
              element={
                <ProtectedComponent allowedRoles={[1, 2]} usuarioLogado={usuarioLogado}>
                  <TelaNetworking />
                </ProtectedComponent>
              }
            />
            {/* Clientes */}
            <Route
              path="/clientes/pf"
              element={
                <ProtectedComponent allowedRoles={[1, 2]} usuarioLogado={usuarioLogado}>
                  <TelaCadClientePF />
                </ProtectedComponent>
              }
            />
            <Route
              path="/clientes/pj"
              element={
                <ProtectedComponent allowedRoles={[1, 2]} usuarioLogado={usuarioLogado}>
                  <TelaCadClientePJ />
                </ProtectedComponent>
              }
            />
            {/* Propagandas */}
            <Route
              path="/propaganda/pf"
              element={
                <ProtectedComponent allowedRoles={[2]} usuarioLogado={usuarioLogado}>
                  <TelaPropagandaPF />
                </ProtectedComponent>
              }
            />
            <Route
              path="/propaganda/pj"
              element={
                <ProtectedComponent allowedRoles={[2]} usuarioLogado={usuarioLogado}>
                  <TelaPropagandaPJ />
                </ProtectedComponent>
              }
            />
            {/* Publicidade */}
            <Route
              path="/publicidade/pj"
              element={
                <ProtectedComponent allowedRoles={[2, 4]} usuarioLogado={usuarioLogado}>
                  <TelaPublicidadePJ />
                </ProtectedComponent>
              }
            />
            {/* Home do Cliente */}
            <Route
              path="/home-cliente"
              element={
                <ProtectedComponent allowedRoles={[3, 4]} usuarioLogado={usuarioLogado}>
                  <TelaHomeCliente />
                </ProtectedComponent>
              }
            />
            {/* Dashboard do Cliente */}
            <Route
              path="/dashboard-cliente"
              element={
                <ProtectedComponent allowedRoles={[3, 4]} usuarioLogado={usuarioLogado}>
                  <TelaCliente />
                </ProtectedComponent>
              }
            />
            <Route
              path="/mensagem"
              element={
                <ProtectedComponent allowedRoles={[2, 3, 4]} usuarioLogado={usuarioLogado}>
                  <TelaMensagem />
                </ProtectedComponent>
              }
            />
            {/* Página não encontrada */}
            <Route path="*" element={<Tela404 />} />
          </Routes>
        </BrowserRouter>
      )}
    </ContextoUsuarioLogado.Provider>
  );
}

export default App;
