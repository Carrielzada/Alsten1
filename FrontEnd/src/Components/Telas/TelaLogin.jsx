import { useContext, useState, useEffect } from "react";
import "./TelaLogin.css";
import { ContextoUsuarioLogado } from "../../App";
import { login } from "../../Services/loginService";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { registrar } from "../../Services/usersService";
import logoImage from "../../assets/imagens/logoalsten.png";
import { useNavigate } from "react-router-dom";
import Button from '../UI/Button';
import { useToast } from "../../hooks/useToast";

export default function TelaLogin() {
  const contexto = useContext(ContextoUsuarioLogado);
  const navigate = useNavigate();
  const toast = useToast();
  const [usuario, setUsuario] = useState({
    usuario: "",
    senha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Se o usuário já estiver logado, redirecionar para boas-vindas
  useEffect(() => {
    if (contexto.usuarioLogado?.logado) {
      navigate("/boas-vindas");
    }
  }, [contexto.usuarioLogado, navigate]);

function realizarLogin(evento) {
    evento.preventDefault();

    setIsLoading(true);
    login(usuario.usuario, usuario.senha)
      .then((resposta) => {
        if (resposta?.status) {
          const usuarioLogado = {
            id: resposta.id,
            nome: resposta.nome,
            email: resposta.email,
            logado: true,
            token: resposta.token,
            role: resposta.role,
          };

          contexto.setUsuarioLogado(usuarioLogado);
          localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

          toast.success(`Bem-vindo, ${resposta.nome}!`);
          navigate("/boas-vindas");

        } else {
          toast.error(resposta.mensagem || "Credenciais inválidas");
        }
      })
      .catch((erro) => {
        toast.error("Erro ao realizar login: " + erro.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

function realizarCadastro(evento) {
    evento.preventDefault();

    setIsRegistering(true);
    const dadosCadastro = {
        nome: usuario.nome,
        email: usuario.usuario,
        password: usuario.senha,
        role_id: 3, // Por exemplo, definir um role padrão para o cadastro
    };

    registrar(dadosCadastro.nome, dadosCadastro.email, dadosCadastro.password, dadosCadastro.role_id)
        .then((resposta) => {
            if (resposta?.status) {
                toast.success("Usuário cadastrado com sucesso! Agora você pode fazer login.");
                setIsSignUpMode(false); // Alternar para a tela de login
                // Limpar o formulário
                setUsuario({ usuario: "", senha: "", nome: "" });
            } else {
                toast.error(resposta.mensagem || "Erro ao cadastrar usuário");
            }
        })
        .catch((erro) => {
            toast.error("Erro ao registrar usuário: " + erro.message);
        })
        .finally(() => {
            setIsRegistering(false);
        });
}


  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setUsuario({ ...usuario, [name]: value });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`login-page ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-login-page">
        <div className="signin-signup">
          {/* Formulário de Login */}
          <form onSubmit={realizarLogin} className="sign-in-form">
            <div className="text-center mb-4">
              <img src={logoImage} alt="Logo" className="img-fluid w-75" />
            </div>
              <div className="input-field">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Usuário"
                name="usuario"
                value={usuario.usuario}
                onChange={manipularMudanca}
              />
            </div>
            <div className="input-field">
              <FaLock
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                name="senha"
                value={usuario.senha}
                onChange={manipularMudanca}
              />
            </div>

            <input 
              type="submit" 
              value={isLoading ? "Entrando..." : "Entrar"} 
              className="btn solid" 
              disabled={isLoading || isRegistering}
              style={{ 
                opacity: isLoading || isRegistering ? 0.6 : 1,
                cursor: isLoading || isRegistering ? 'not-allowed' : 'pointer'
              }}
            />
          </form>

          {/* Formulário de Cadastro */}
          <form onSubmit={realizarCadastro} className="sign-up-form">
            <h2 className="title">Cadastre-se</h2>
            <div className="input-field">
                <FaUser />
                <input
                    type="text"
                    placeholder="Nome do Usuário"
                    name="nome"
                    value={usuario.nome || ""}
                    onChange={manipularMudanca}
                />
            </div>
            <div className="input-field">
                <FaEnvelope />
                <input
                    type="email"
                    placeholder="E-mail"
                    name="usuario"
                    value={usuario.usuario || ""}
                    onChange={manipularMudanca}
                />
            </div>
            <div className="input-field">
                <FaLock
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    name="senha"
                    value={usuario.senha || ""}
                    onChange={manipularMudanca}
                />
            </div>
            <input 
              type="submit" 
              className="btn" 
              value={isRegistering ? "Cadastrando..." : "Cadastrar"}
              disabled={isLoading || isRegistering}
              style={{ 
                opacity: isLoading || isRegistering ? 0.6 : 1,
                cursor: isLoading || isRegistering ? 'not-allowed' : 'pointer'
              }}
            />
        </form>

        </div>
      </div>

      {/* Painéis laterais */}
      <div className="panels-login-page">
        <div className="panel left-panel">
          <div className="content">
            <h3>É novo por aqui?</h3>
            <p>
              Bem-vindo! Faça parte do nosso sistema se cadastrando abaixo:
            </p>
            <Button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => setIsSignUpMode(true)}
            >
              Cadastre-se
            </Button>
          </div>
          <img src="/log.svg" className="image" alt="Log in" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Já possui conta?</h3>
            <p>
              Entre no sistema utilizando suas credenciais para acessar nossas
              funcionalidades.
            </p>
            <Button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => setIsSignUpMode(false)}
            >
              Entrar
            </Button>
          </div>
          <img src="/register.svg" className="image" alt="Sign up" />
        </div>
      </div>
    </div>
  );
}
