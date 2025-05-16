import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import TelaMenu from "./componentes/Telas/TelaMenu"; // Será substituído/integrado ao LayoutModerno
import Tela404 from "./componentes/Telas/Tela404";
import TelaLogin from "./componentes/Telas/TelaLogin";
import TelaHomeCliente from "./componentes/Telas/TelaHomeCliente";
import ProtectedComponent from "./ProtectedComponent";
import TelaListagemOS from "./componentes/Telas/TelaListagemOS";
import FormUploadArquivo from "./componentes/Telas/Formularios/FormUploadArquivo";

// Cadastros do MVP (serão adaptados ao novo layout)
import TelaCadModeloEquipamento from "./componentes/Telas/TelaCadModeloEquipamento";
import TelaCadPagamento from "./componentes/Telas/TelaCadPagamento";
import TelaCadUrgencia from "./componentes/Telas/TelaCadUrgencia";
import TelaCadTipoLacre from "./componentes/Telas/TelaCadTipoLacre"; // Importar tela de Tipo de Lacre
import TelaCadTipoAnalise from "./componentes/Telas/TelaCadTipoAnalise"; // Importar tela de Tipo de Análise
import TelaCadFabricante from "./componentes/Telas/TelaCadFabricante"; // Importar tela de Fabricante
import TelaCadDefeitoAlegado from "./componentes/Telas/TelaCadDefeitoAlegado"; // Importar tela de Defeito Alegado

// Novo Layout
import LayoutModerno from "./componentes/LayoutModerno/LayoutModerno";

export const ContextoUsuarioLogado = createContext(null);

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState({
    id: null,
    nome: "",
    logado: false,
    token: "",
    role: null,
    id_dados: null,
    prop_publ: null,
  });

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      setUsuarioLogado(usuario);
    }
  }, []);

  // Define as rotas que usarão o LayoutModerno
  const RotasProtegidasComLayout = () => (
    <LayoutModerno>
      <Routes>
        {/* Rota inicial para admin/técnico agora é a listagem de OS */}
        <Route path="/" element={<Navigate to="/ordens-servico" />} /> 
        <Route path="/ordens-servico" element={<TelaListagemOS />} />
        <Route path="/upload-teste" element={<FormUploadArquivo osId={null} onUploadSuccess={(filePath) => console.log("Upload Teste OK:", filePath)} />} />
        <Route path="/cadastros/modelo-equipamento" element={<TelaCadModeloEquipamento />} />
        <Route path="/cadastros/pagamento" element={<TelaCadPagamento />} />
        <Route path="/cadastros/urgencia" element={<TelaCadUrgencia />} />
        {/* Novas rotas de cadastro (a serem criadas as telas) */}
        <Route path="/cadastros/tipo-lacre" element={<TelaCadTipoLacre />} />
        <Route path="/cadastros/tipo-analise" element={<TelaCadTipoAnalise />} />
        <Route path="/cadastros/fabricante" element={<TelaCadFabricante />} />
        <Route path="/cadastros/defeito-alegado" element={<TelaCadDefeitoAlegado />} />
        <Route path="/sua-conta" element={<div>Tela Sua Conta (Em construção)</div>} />
        {/* Adicionar outras rotas protegidas aqui */}
        <Route path="*" element={<Tela404 />} /> {/* Fallback para rotas não encontradas dentro do layout */}
      </Routes>
    </LayoutModerno>
  );

  return (
    <ContextoUsuarioLogado.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<TelaLogin />} />
          {
            usuarioLogado.logado ? (
              // Se logado, verifica o role para direcionar
              (usuarioLogado.role === 1 || usuarioLogado.role === 2) ? (
                // Rotas de Admin/Técnico com o novo layout
                <Route path="/*" element={<ProtectedComponent allowedRoles={[1, 2]} usuarioLogado={usuarioLogado}><RotasProtegidasComLayout /></ProtectedComponent>} />
              ) : (usuarioLogado.role === 3 || usuarioLogado.role === 4) ? (
                // Rotas de Cliente (podem ou não usar o mesmo layout, a definir)
                // Por enquanto, mantendo separadas e simples
                <>
                  <Route path="/home-cliente" element={<ProtectedComponent allowedRoles={[3, 4]} usuarioLogado={usuarioLogado}><TelaHomeCliente /></ProtectedComponent>} />
                  <Route path="/*" element={<Navigate to="/home-cliente" />} /> {/* Redireciona outras rotas para home-cliente */}
                </>
              ) : (
                // Se tem role desconhecido, volta para login
                <Route path="/*" element={<Navigate to="/login" />} />
              )
            ) : (
              // Se não está logado, todas as rotas levam para login, exceto /login em si
              <Route path="/*" element={<Navigate to="/login" />} />
            )
          }
        </Routes>
      </BrowserRouter>
    </ContextoUsuarioLogado.Provider>
  );
}

export default App;

