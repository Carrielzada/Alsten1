import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Tela404 from "./Components/Telas/Tela404";
import TelaLogin from "./Components/Telas/TelaLogin";
import TelaBoasVindas from "./Components/Telas/TelaBoasVindas";
import ProtectedComponent from "./ProtectedComponent";
import TelaListagemOS from "./Components/Telas/TelaListagemOS";
import TelaOSConcluidas from "./Components/Telas/TelaOSConcluidas";
import TelaCadOrdemServico from "./Components/Telas/TelaCadOrdemServico";
import TelaListagemLogsOS from "./Components/Telas/TelaListagemLogsOS";
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
import TelaCadastroClientes from "./Components/Telas/TelaCadastroClientes";
import TelaAdministracaoCadastros from "./Components/Telas/TelaAdministracaoCadastros";
import TelaAdministracaoUsuarios from "./Components/Telas/TelaAdministracaoUsuarios";
import TelaCadServicoPadrao from "./Components/Telas/TelaCadServicoPadrao";
import TelaRelatorioCompleto from "./Components/Telas/TelaRelatorioCompleto";
import TelaPerfil from "./Components/Telas/TelaPerfil";

// Novo Layout
import LayoutModerno from "./Components/LayoutModerno/LayoutModerno";
import { BlingAuthProvider, useBlingAuth } from './Components/busca/BlingAuthProvider';
import BlingAuthModal from './Components/BlingAuthModal';
import BlingSuccessPage from './Components/BlingSuccessPage';

export const ContextoUsuarioLogado = createContext(null);

function AppContent() {
  const [usuarioLogado, setUsuarioLogado] = useState({
    id: null,
    nome: "",
    logado: false,
    token: "",
    role: null,
  });
  const [usuarioCarregado, setUsuarioCarregado] = useState(false);

  // Use o contexto global do Bling
  const { isAuthenticated: isBlingAuthenticated, isLoading: isBlingLoading, authenticate: authenticateBling, checkAuthStatus: checkBlingAuthStatus } = useBlingAuth();
  const [blingChecked, setBlingChecked] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const usuario = JSON.parse(usuarioSalvo);
        // Verificar se o token ainda é válido antes de considerar o usuário como logado
        // Se não for possível verificar o token no frontend, pelo menos verificamos se os dados estão completos
        if (usuario && usuario.token && usuario.id && usuario.role) {
          setUsuarioLogado(usuario);
        } else {
          // Se os dados estiverem incompletos, limpar o localStorage
          localStorage.removeItem("usuarioLogado");
        }
      } catch (error) {
        // Se houver erro ao fazer parse do JSON, limpar o localStorage
        console.error("Erro ao carregar dados do usuário:", error);
        localStorage.removeItem("usuarioLogado");
      }
    }
    setUsuarioCarregado(true);
  }, []);

  useEffect(() => {
    // Só verificar o status do Bling se o usuário estiver logado
    if (usuarioLogado.logado) {
      // Definir um pequeno atraso para garantir que o token do usuário seja processado primeiro
      const timer = setTimeout(() => {
        checkBlingAuthStatus().finally(() => setBlingChecked(true));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setBlingChecked(true); // Marcar como verificado mesmo quando não logado para não bloquear a renderização
    }
  }, [usuarioLogado.logado, checkBlingAuthStatus]);

  // Mostrar tela de carregamento enquanto verifica o usuário
  if (!usuarioCarregado) return <div>Carregando...</div>;
  
  // Não bloquear a renderização se o usuário não estiver logado, mesmo que o Bling não tenha sido verificado
  if (usuarioLogado.logado && !blingChecked) return <div>Verificando autenticação...</div>;

  const RotasProtegidasComLayout = () => (
    <LayoutModerno>
      <Routes>
        <Route path="/boas-vindas" element={<TelaBoasVindas />} />
        <Route path="/ordens-servico" element={<TelaListagemOS />} />
        <Route path="/os-concluidas" element={<TelaOSConcluidas />} />
        <Route path="/relatorio-completo" element={<TelaRelatorioCompleto />} />
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
        <Route path="/cadastros/clientes" element={<TelaCadastroClientes />} />
        <Route path="/cadastros/servico-realizado" element={<TelaCadServicoPadrao />} />
        {/* Rotas administrativas protegidas - apenas para Admin (role 1) */}
        <Route path="/admin/cadastros" element={
          <ProtectedComponent allowedRoles={[1]} usuarioLogado={usuarioLogado}>
            <TelaAdministracaoCadastros />
          </ProtectedComponent>
        } />
        <Route path="/admin/usuarios" element={
          <ProtectedComponent allowedRoles={[1]} usuarioLogado={usuarioLogado}>
            <TelaAdministracaoUsuarios />
          </ProtectedComponent>
        } />
        <Route path="/meu-perfil" element={<TelaPerfil />} />
        <Route path="/cadastrar-ordem-servico" element={<TelaCadOrdemServico />} />
        <Route path="/cadastrar-ordem-servico/:id" element={<TelaCadOrdemServico />} />
        <Route path="/ordem-servico/:id/logs" element={<TelaListagemLogsOS />} />
        {/* Adicionar outras rotas protegidas aqui */}
        <Route path="*" element={<Tela404 />} /> {/* Fallback para rotas não encontradas dentro do layout */}
      </Routes>
    </LayoutModerno>
  );

  return (
    <ContextoUsuarioLogado.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      <BrowserRouter>
        {/* O modal de autenticação do Bling só deve aparecer após o login no sistema */}
        {usuarioLogado.logado && !isBlingAuthenticated && (
          <BlingAuthModal
            show={true}
            onAuthenticate={authenticateBling}
            isLoading={isBlingLoading}
          />
        )}
        <Routes>
          {/* Rotas públicas acessíveis sem login */}
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/bling/success" element={<BlingSuccessPage />} />
          
          {/* Rota raiz - redireciona sempre para login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Rotas protegidas para todos os usuários logados */}
          {usuarioLogado.logado && (
            <Route path="/*" element={
              <ProtectedComponent allowedRoles={[1, 2, 3, 4, 5, 6]} usuarioLogado={usuarioLogado}>
                <RotasProtegidasComLayout />
              </ProtectedComponent>
            } />
          )}
          
          {/* Fallback - redireciona para login se nenhuma condição acima for atendida */}
          {!usuarioLogado.logado && (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </ContextoUsuarioLogado.Provider>
  );
}

function App() {
  return (
    <BlingAuthProvider>
      <AppContent />
    </BlingAuthProvider>
  );
}

export default App;

