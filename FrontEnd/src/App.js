import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Tela404 from "./Components/Telas/Tela404";
import TelaLogin from "./Components/Telas/TelaLogin";
import TelaHomeCliente from "./Components/Telas/TelaHomeCliente";
import ProtectedComponent from "./ProtectedComponent";
import TelaListagemOS from "./Components/Telas/TelaListagemOS";
import TelaCadOrdemServico from "./Components/Telas/TelaCadOrdemServico";
// Porque tem um espaço aqui?

import FormUploadArquivo from "./Components/Telas/Formularios/FormUploadArquivo";
import TelaCadModeloEquipamento from "./Components/Telas/TelaCadModeloEquipamento";
import TelaCadPagamento from "./Components/Telas/TelaCadPagamento";
import TelaCadUrgencia from "./Components/Telas/TelaCadUrgencia";
import TelaCadTipoLacre from "./Components/Telas/TelaCadTipoLacre"; 
import TelaCadTipoAnalise from "./Components/Telas/TelaCadTipoAnalise";
import TelaCadTipoLimpeza from "./Components/Telas/TelaCadTipoLimpeza";
import TelaCadTipoTransporte from "./Components/Telas/TelaCadTipoTransporte";
import TelaCadFabricante from "./Components/Telas/TelaCadFabricante"; 
import TelaCadDefeitoAlegado from "./Components/Telas/TelaCadDefeitoAlegado"; 
import TelaCadClientePJ from "./Components/Telas/TelaCadClientePJ";

// Novo Layout
import LayoutModerno from "./Components/LayoutModerno/LayoutModerno";

export const ContextoUsuarioLogado = createContext(null);

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState({
    id: null,
    nome: "",
    logado: false,
    token: "",
    role: null,
  });

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      setUsuarioLogado(usuario);
    }
  }, []);

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
        <Route path="/cadastros/tipo-limpeza" element={<TelaCadTipoLimpeza />} />
        <Route path="/cadastros/tipo-transporte" element={<TelaCadTipoTransporte />} />
        <Route path="/cadastros/fabricante" element={<TelaCadFabricante />} />
        <Route path="/cadastros/defeito-alegado" element={<TelaCadDefeitoAlegado />} />
        <Route path="/cadastros/clientes" element={<TelaCadClientePJ />} />
        <Route path="/sua-conta" element={<div>Tela Sua Conta (Em construção)</div>} />
        <Route path="/cadastrar-os" element={<TelaCadOrdemServico />} />
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

